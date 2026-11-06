/*
 * Use App.getDependency for Dependency Injection
 * eg: var DialogService = App.getDependency('DialogService');
 */

/* =============================================================================
 * Salesforce UI Embedding bridge (package-free) for WaveMaker
 * sf-embedding protocol, JSON-RPC 2.0 over MessagePort
 * Host: c-illustration-embedding (<lightning-ui-embedding>, "Illustration" tab)
 *
 *  Host → app : props  = { employees, selectedEmployeeId, selectedEmployee,
 *                          selectionRequestId, locale, source }
 *               event  'employeeselect' { employeeId, employee, parties, requestId, origin: 'salesforce' }
 *               parties = { firstParty, secondParty|null, preparedBy|null, adviser }
 *               (chosen in the "Select illustration parties" dialog)
 *               (sent when "Create Illustration" is clicked in the Employee Directory)
 *  App → host : 'appready'        {}  (sent once from App.onPageReady; host then (re)sends
 *                                     the current 'employeeselect' — events sent before the app
 *                                     subscribed are dropped by <lightning-ui-embedding>)
 *               'employeeselect'  { employeeId }
 *               'trackdirtystate' { isDirty, instanceId, label }
 *
 *  Needs one app-level Model variable: selectedEmployee (object)
 * ========================================================================== */

// hostMetaData arrives as a query parameter of the URL the frame was opened with.
// The app's router may already have replaced that URL (e.g. "/" → "/react-pages/<Home>",
// dropping the query) by the time this code runs, so also read it from the original
// document URL kept in the navigation timing entry.
function sfReadHostMetaData() {
    const fromUrl = (url) => {
        try {
            return new URL(url, location.href).searchParams.get("hostMetaData");
        } catch (e) {
            return null;
        }
    };
    const nav = window.performance?.getEntriesByType?.("navigation")?.[0];
    return (
        fromUrl(location.href) ??
        (nav ? fromUrl(nav.name) : null) ??
        window.__SF_HOST_METADATA__ ??
        null
    );
}

// Step 1: handshake — wait for the host to transfer a MessagePort.
// No timeout, since the iframe may sit on login/MFA/consent screens.
function sfBootstrap({ signal } = {}) {
    return new Promise((resolve, reject) => {
        if (window.parent === window) {
            // Loaded directly, not embedded. Stay silent so the app works standalone.
            return reject(new Error("NOT_EMBEDDED"));
        }
        const rawMeta = sfReadHostMetaData();
        if (!rawMeta) return reject(new Error("NOT_EMBEDDED")); // framed, but not by lightning-ui-embedding
        let meta = null;
        try {
            meta = JSON.parse(rawMeta);
        } catch (e) {
            return reject(new Error("BAD_HOST_METADATA"));
        }
        const hostAppOrigin = meta?.hostAppOrigin;
        const instanceId = meta?.instanceId;
        if (
            typeof hostAppOrigin !== "string" || !hostAppOrigin ||
            typeof instanceId !== "string" || !instanceId
        ) {
            return reject(new Error("BAD_HOST_METADATA"));
        }

        let captured = false;
        function onMessage(event) {
            const d = event.data;
            if (d?.type !== "sf-embedding.bootstrap" || d?.protocol !== "sf-embedding") return;
            if (event.origin !== hostAppOrigin) return;
            if (event.source !== window.parent) return;
            if (event.ports.length !== 1) return;
            if (d.instanceId !== instanceId) return;

            if (captured) {
                // Second valid envelope: fail closed, ask host to shut down, ignore the new port.
                parent.postMessage(
                    { type: "sf-embedding/shutdown", reason: "DUPLICATE_PORT_TRANSFER" },
                    hostAppOrigin
                );
                return;
            }
            captured = true;
            const port = event.ports[0];
            port.start();
            resolve({ port, hostAppOrigin, instanceId });
            // Listener stays registered so a later duplicate envelope still triggers the shutdown.
        }

        window.addEventListener("message", onMessage);
        signal?.addEventListener("abort", () => reject(new Error("BOOTSTRAP_ABORTED")), { once: true });
        // Heartbeat only after the listener is registered.
        parent.postMessage(
            { type: "sf-embedding/ready", instanceId, protocolVersion: "1.0.0" },
            hostAppOrigin
        );
    });
}

// Step 2: minimal JSON-RPC 2.0 bridge. No JSON.stringify: MessagePort uses structured clone.
function sfCreateBridge(port) {
    let nextId = 1;
    const pending = new Map();
    const handlers = new Map();

    port.onmessage = ({ data: msg }) => {
        if (!msg) return;
        if (msg.id != null && ("result" in msg || "error" in msg)) {
            const p = pending.get(msg.id);
            if (!p) return;
            pending.delete(msg.id);
            msg.error ? p.reject(msg.error) : p.resolve(msg.result);
        } else if (msg.method) {
            Promise.resolve(handlers.get(msg.method)?.(msg.params)).then((result) => {
                if (msg.id != null) port.postMessage({ jsonrpc: "2.0", id: msg.id, result });
            });
        }
    };

    return {
        notify: (method, params) => port.postMessage({ jsonrpc: "2.0", method, params }),
        request: (method, params, timeoutMs = 30000) =>
            new Promise((resolve, reject) => {
                const id = nextId++;
                pending.set(id, { resolve, reject });
                if (timeoutMs) {
                    setTimeout(() => {
                        if (pending.delete(id)) reject(new Error(`TIMEOUT ${method}`));
                    }, timeoutMs);
                }
                port.postMessage({ jsonrpc: "2.0", id, method, params });
            }),
        on: (method, handler) => handlers.set(method, handler),
    };
}

// Step 3: lifecycle, host state, events, auto-resize. Single session promise, started at load.
App.salesforce = (function () {
    const stateListeners = [];
    const eventListeners = [];
    const employeeSelectListeners = [];
    let lastEmployeeRequestId = null;
    const lastRequestIdByChannel = { event: null, props: null };
    let appReadySent = false;

    const remove = (list, fn) => () => {
        const i = list.indexOf(fn);
        if (i >= 0) list.splice(i, 1);
    };

    const api = {
        embedded: false,
        hostInfo: null,
        instanceId: null,
        uiState: { props: {}, styles: {} },
        bridge: null,
        session: null,
        /** Last employee sent by Salesforce ("Create Illustration"), or null. */
        selectedEmployee: null,
        /** Parties chosen in the Salesforce dialog for that employee, or null. */
        selectedParties: null,

        // Subscribe to host props/styles; fires immediately if a snapshot already exists.
        onUiStateChange(fn) {
            stateListeners.push(fn);
            if (api.bridge) fn(api.uiState.props, api.uiState.styles);
            return remove(stateListeners, fn);
        },

        // Receive every event forwarded by the host: fn(eventType, detail).
        onHostEvent(fn) {
            eventListeners.push(fn);
            return remove(eventListeners, fn);
        },

        // Employee row sent by Salesforce on "Create Illustration":
        // fn(employee, { employeeId, parties, requestId, via: 'event' | 'props' | 'replay' }).
        // Replays the last one immediately, so late subscribers still get it.
        onEmployeeSelect(fn) {
            employeeSelectListeners.push(fn);
            if (api.selectedEmployee) {
                fn(api.selectedEmployee, {
                    employeeId: api.selectedEmployee.id,
                    parties: api.selectedParties,
                    requestId: lastEmployeeRequestId,
                    via: "replay",
                });
            }
            return remove(employeeSelectListeners, fn);
        },

        // Size hint in CSS px; host may honor, clamp or ignore.
        resize(height) {
            return api.session.then(({ bridge }) =>
                bridge.notify("ui/notifications/resize", { height: Math.ceil(height) })
            );
        },

        // Bubble a custom event onto the host <lightning-ui-embedding> element.
        dispatchEvent(eventType, detail) {
            return api.session.then(({ bridge }) =>
                bridge.notify("ui/events/dispatch", { eventType, detail })
            );
        },

        // Dirty-state rides on the event channel; instanceId from the handshake is required.
        trackDirtyState(isDirty, label) {
            return api.session.then(({ bridge, instanceId }) =>
                bridge.notify("ui/events/dispatch", {
                    eventType: "trackdirtystate",
                    detail: { isDirty: !!isDirty, instanceId, label },
                })
            );
        },

        // Tell the host the app is up (pages rendered, listeners attached). Sent once; the
        // host answers by (re)sending the current 'employeeselect'. Call from App.onPageReady.
        notifyAppReady() {
            if (appReadySent) return api.session;
            appReadySent = true;
            return api.session.then(({ bridge }) =>
                bridge.notify("ui/events/dispatch", { eventType: "appready", detail: {} })
            );
        },

        // ── c-illustration-embedding helpers ──────────────────────────────
        // Current employees passed by the host (loaded via Apex in Salesforce).
        getEmployees() {
            return api.uiState.props?.employees ?? [];
        },
        getSelectedEmployeeId() {
            return api.uiState.props?.selectedEmployeeId ?? null;
        },
        // App → Salesforce: open a Lightning tab (the frame can't navigate Lightning itself).
        // Default: the Client Illustration list ("Client_Illustration").
        navigateToTab(apiName = "Client_Illustration") {
            return api.dispatchEvent("navigatetab", { apiName });
        },
        // App → Salesforce: the user picked an employee inside the WaveMaker app.
        // Host updates selectedEmployeeId, broadcasts to the Lightning page and shows a toast.
        selectEmployee(employeeId) {
            if (!employeeId) return Promise.resolve();
            return api.dispatchEvent("employeeselect", { employeeId: String(employeeId) });
        },
    };

    // Deliver a Salesforce-initiated employee once per requestId and channel. The props copy
    // can arrive before the WaveMaker pages are ready; the event copy arrives after 'appready'.
    function emitEmployeeSelect(employee, info) {
        if (!employee || typeof employee !== "object") return;
        const requestId = info.requestId ?? null;
        const channel = info.via === "event" ? "event" : "props";
        if (requestId && requestId === lastRequestIdByChannel[channel]) return;
        lastRequestIdByChannel[channel] = requestId;
        lastEmployeeRequestId = requestId;
        api.selectedEmployee = employee;
        api.selectedParties = info.parties ?? null;
        const meta = {
            employeeId: employee.id ?? info.employeeId,
            parties: api.selectedParties,
            requestId,
            via: info.via,
        };
        employeeSelectListeners.forEach((fn) => {
            try {
                fn(employee, meta);
            } catch (e) {
                console.error("Salesforce embedding: onEmployeeSelect listener failed", e);
            }
        });
    }

    // Salesforce sends only primitive props (nested values would fail to cross the
    // MessagePort): objects/arrays arrive as JSON strings named "<name>Json".
    // Parse them back, e.g. selectedEmployeeJson → selectedEmployee.
    function decodeJsonProps(raw) {
        const props = { ...(raw ?? {}) };
        Object.keys(props).forEach((key) => {
            if (!key.endsWith("Json") || typeof props[key] !== "string") return;
            try {
                props[key.slice(0, -4)] = JSON.parse(props[key]);
            } catch (e) {
                console.warn("Salesforce embedding: could not parse prop " + key, e);
            }
        });
        return props;
    }

    function applyState(current) {
        api.uiState = { props: decodeJsonProps(current?.props), styles: current?.styles ?? {} };
        stateListeners.forEach((fn) => {
            try {
                fn(api.uiState.props, api.uiState.styles);
            } catch (e) {
                console.error("Salesforce embedding: onUiStateChange listener failed", e);
            }
        });
        // Fallback: the row also arrives in props, in case the event came before we subscribed.
        const p = api.uiState.props;
        if (p.selectionRequestId && p.selectedEmployee) {
            emitEmployeeSelect(p.selectedEmployee, {
                requestId: p.selectionRequestId,
                parties: p.selectionParties,
                via: "props",
            });
        }
    }

    function handleHostEvent({ eventType, detail } = {}) {
        eventListeners.forEach((fn) => {
            try {
                fn(eventType, detail);
            } catch (e) {
                console.error("Salesforce embedding: onHostEvent listener failed", e);
            }
        });
        if (eventType === "employeeselect" && detail?.origin === "salesforce") {
            const employee =
                detail.employee ?? api.getEmployees().find((e) => e.id === detail.employeeId) ?? null;
            emitEmployeeSelect(employee, {
                employeeId: detail.employeeId,
                parties: detail.parties,
                requestId: detail.requestId,
                via: "event",
            });
        }
    }

    api.session = sfBootstrap().then(async ({ port, hostAppOrigin, instanceId }) => {
        const bridge = sfCreateBridge(port);
        api.embedded = true;
        api.bridge = bridge;
        api.instanceId = instanceId;

        // Register inbound handlers before announcing so a fast host can't get ahead.
        let hostInitialized;
        const hostInitializedPromise = new Promise((res) => (hostInitialized = res));
        bridge.on("ui/notifications/host-initialized", (p) => {
            api.instanceId = p?.instanceId ?? api.instanceId;
            api.hostInfo = p?.hostInfo ?? null;
            hostInitialized(p);
        });
        bridge.on("ui/notifications/ui-state-changed", ({ current } = {}) => applyState(current));
        bridge.on("ui/events/dispatch", handleHostEvent);

        bridge.notify("ui/notifications/embedding-initialized", {
            embeddingInfo: { name: "wavemaker-app", version: "1.0.0" },
        });

        // Requests before host-initialized are rejected with NOT_INITIALIZED.
        await hostInitializedPromise;

        // Subscribe to host events first so 'employeeselect' sent right after "ready" isn't missed.
        await bridge.request("ui/events/subscribe", {}).catch((err) =>
            console.warn("Salesforce embedding: ui/events/subscribe not available", err)
        );

        const { current } = await bridge.request("ui/subscribe/ui-state", {});
        applyState(current);

        return { bridge, port, hostAppOrigin, instanceId: api.instanceId };
    });

    // No auto-resize: the Salesforce component sizes the frame to the space on the page
    // and the app scrolls inside it. Reporting the content height back made the frame
    // grow forever (the app's full-height layout grew with the frame on every report).

    // Standalone / failed bootstrap must not surface as unhandled rejections.
    api.session.catch((err) => {
        if (err?.message !== "NOT_EMBEDDED") console.error("Salesforce embedding bridge:", err);
    });

    return api;
})();

/* perform any action on the variables within this block(on-page-load) */
App.onAppVariablesReady = function () {
    /*
     * variables can be accessed through 'App.Variables' property here
     * e.g. App.Variables.staticVariable1.getData()
     */
    function setVariable(name, value) {
        var v = App.Variables && App.Variables[name];
        if (v) v.dataSet = value;
        else console.warn("Salesforce embedding: app variable '" + name + "' not found");
    }

    // Client row sent by Salesforce on "Start illustration":
    // { id, clientId, name, displayName, title, forename, surname, externalRef,
    //   dateOfBirth, adviserId, adviserName, avatarInitials }
    App.salesforce.onEmployeeSelect(function (employee, info) {
        setVariable("selectedEmployee", employee);
        // Optional app-level Model variable for the dialog's parties
        if (App.Variables && App.Variables.illustrationParties) {
            App.Variables.illustrationParties.dataSet = info.parties || {};
        }
        console.log("employeeselect from Salesforce:", employee.name, info.parties, info.requestId, info.via);
    });

    // Host props also carry the selected client: keep selectedEmployee in sync with them.
    App.salesforce.onUiStateChange(function (props) {
        if (props && props.selectedEmployee) setVariable("selectedEmployee", props.selectedEmployee);
    });
};

/* perform any action on session timeout here, e.g clearing some data, etc */
App.onSessionTimeout = function () {
    /*
     * NOTE:
     * On re-login after session timeout:
     * if the same user logs in(through login dialog), app will retain its state
     * if a different user logs in, app will be reloaded and user is redirected to respective landing page configured in Security.
     */
};

/*
 * This application level callback function will be invoked after the invocation of PAGE level onPageReady function.
 * Use this function to write common logic across the pages in the application.
 * activePageName : name of the page
 * activePageScope: scope of the page
 * $activePageEl  : page jQuery element
 */
App.onPageReady = function (activePageName, activePageScope, $activePageEl) {
    // Salesforce data that arrived before this page was ready: apply it now.
    if (App.salesforce && App.salesforce.selectedEmployee && App.Variables && App.Variables.selectedEmployee) {
        App.Variables.selectedEmployee.dataSet = App.salesforce.selectedEmployee;
    }
    // Tell Salesforce we're ready to receive 'employeeselect' (sent once per session).
    if (App.salesforce && App.salesforce.notifyAppReady) App.salesforce.notifyAppReady();
};

/*
 * This application level callback function will be invoked after a Variable receives an error from the target service.
 * Use this function to write common error handling logic across the application.
 * errorMsg:    The error message returned by the target service. This message will be displayed through appNotification variable
 *              You can change this though App.Variables.appNotification.setMessage(YOUR_CUSTOM_MESSAGE)
 * xhrObj:      The xhrObject used to make the service call
 *              This object contains useful information like statusCode, url, request/response body.
 */
App.onServiceError = function (errorMsg, xhrObj) {

};
