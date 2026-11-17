import _ from "lodash-es";
import "core-js";
import "./app.libs.js";


export default function attachScript(App) {
    /* 
  Salesforce Microfrontend UI Embedding - Start
  */
  
  // The router may already have replaced the URL (dropping ?hostMetaData) by the time
  // this runs, so also read it from the original document URL (navigation timing entry).
  function sfReadHostMetaData() {
      const fromUrl = (url) => {
          try {
              return new URL(url, location.href).searchParams.get("hostMetaData");
          } catch (e) {
              return null;
          }
      };
      const nav = window.performance?.getEntriesByType?.("navigation")?.[0];
      return fromUrl(location.href) ?? (nav ? fromUrl(nav.name) : null) ?? window.__SF_HOST_METADATA__ ?? null;
  }
  
  // Step 1: handshake — wait for the host to transfer a MessagePort.
  // No timeout, since the iframe may sit on login/MFA/consent screens.
  function sfBootstrap({ signal } = {}) {
      return new Promise((resolve, reject) => {
          if (window.parent === window) {
              // Loaded directly, not embedded. Stay silent so the app works standalone.
              return reject(new Error("NOT_EMBEDDED"));
          }
          // sf-shim.js (patched by `npm run wm:patch`) keeps the first-load value in
          // window.__SF_HOST_METADATA__, because the redirect to the home page drops the query string.
          // const rawMeta =
          //     new URL(location.href).searchParams.get("hostMetaData") ?? window.__SF_HOST_METADATA__ ?? null;
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
  
  // Salesforce sends only primitive props (nested values would fail to cross the
  // MessagePort): objects/arrays arrive as JSON strings named "<name>Json".
  // Parse them back, e.g. selectedEmployeeJson → selectedEmployee, ebsSubmissionJson → ebsSubmission.
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
  
  // Step 3: lifecycle, host state, events, auto-resize. Single session promise, started at load.
  App.salesforce = (function () {
      const stateListeners = [];
      const eventListeners = [];
      const employeeSelectListeners = [];
      const createEbsListeners = [];
      let lastEmployeeRequestId = null;
      let lastEbsRequestId = null;
  
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
          /** Last EBS submission sent by Salesforce ("Create EBS" — the whole API response), or null. */
          ebsSubmission: null,
          ebsInfo: null,
  
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
          // fn(employee, { employeeId, requestId, via: 'event' | 'props' | 'replay' }).
          // Replays the last one immediately, so late subscribers still get it.
          onEmployeeSelect(fn) {
              employeeSelectListeners.push(fn);
              if (api.selectedEmployee) {
                  fn(api.selectedEmployee, {
                      employeeId: api.selectedEmployee.id,
                      requestId: lastEmployeeRequestId,
                      via: "replay",
                  });
              }
              return remove(employeeSelectListeners, fn);
          },
  
          // EBS submission sent by Salesforce on Business manager → "Create EBS"
          // (the whole POST /illustrations/{id}/submissions response):
          // fn(submission, { requestId, illustrationId, clientId, via: 'event' | 'props' | 'replay' }).
          // Replays the last one immediately, so late subscribers still get it.
          onCreateEbs(fn) {
              createEbsListeners.push(fn);
              if (api.ebsSubmission) fn(api.ebsSubmission, { ...api.ebsInfo, via: "replay" });
              return remove(createEbsListeners, fn);
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
  
          // ── c-illustration-embedding helpers ──────────────────────────────
          // Current employees passed by the host (loaded via Apex in Salesforce).
          getEmployees() {
              return api.uiState.props?.employees ?? [];
          },
          getSelectedEmployeeId() {
              return api.uiState.props?.selectedEmployeeId ?? null;
          },
          // App → Salesforce: the user picked an employee inside the WaveMaker app.
          // Host updates selectedEmployeeId, broadcasts to the Lightning page and shows a toast.
          selectEmployee(employeeId) {
              if (!employeeId) return Promise.resolve();
              return api.dispatchEvent("employeeselect", { employeeId: String(employeeId) });
          },
      };
  
      // Deliver a Salesforce-initiated employee once per requestId (event and props both carry it).
      function emitEmployeeSelect(employee, info) {
          if (!employee || typeof employee !== "object") return;
          const requestId = info.requestId ?? null;
          if (requestId && requestId === lastEmployeeRequestId) return;
          lastEmployeeRequestId = requestId;
          api.selectedEmployee = employee;
          const meta = { employeeId: employee.id ?? info.employeeId, requestId, via: info.via };
          employeeSelectListeners.forEach((fn) => {
              try {
                  fn(employee, meta);
              } catch (e) {
                  console.error("Salesforce embedding: onEmployeeSelect listener failed", e);
              }
          });
      }
  
      // Deliver a Salesforce-initiated EBS submission once per requestId (event and props both carry it).
      function emitCreateEbs(submission, info) {
          if (!submission || typeof submission !== "object") return;
          const requestId = info.requestId ?? null;
          if (requestId && requestId === lastEbsRequestId) return;
          lastEbsRequestId = requestId;
          api.ebsSubmission = submission;
          api.ebsInfo = {
              requestId,
              illustrationId: info.illustrationId ?? submission.illustrationId ?? null,
              clientId: info.clientId ?? null,
          };
          const meta = { ...api.ebsInfo, via: info.via };
          createEbsListeners.forEach((fn) => {
              try {
                  fn(submission, meta);
              } catch (e) {
                  console.error("Salesforce embedding: onCreateEbs listener failed", e);
              }
          });
      }
  
      function applyState(current) {
          //api.uiState = { props: current?.props ?? {}, styles: current?.styles ?? {} };
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
              emitEmployeeSelect(p.selectedEmployee, { requestId: p.selectionRequestId, via: "props" });
          }
          // Same for "Create EBS": the submission is also in props.
          if (p.ebsRequestId && p.ebsSubmission) {
              emitCreateEbs(p.ebsSubmission, { requestId: p.ebsRequestId, via: "props" });
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
                  requestId: detail.requestId,
                  via: "event",
              });
          }
          // detail: { submission, illustrationId, clientId, requestId, origin: 'salesforce' }
          if (eventType === "createEBS" && detail?.origin === "salesforce") {
              emitCreateEbs(detail.submission, {
                  requestId: detail.requestId,
                  illustrationId: detail.illustrationId,
                  clientId: detail.clientId,
                  via: "event",
              });
          }
      }
  
      // No auto-resizer without the Salesforce package: report content height ourselves.
      // function startAutoResize() {
      //     let last = 0;
      //     let frame = 0;
      //     const measure = () => {
      //         frame = 0;
      //         const h = Math.ceil(
      //             Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
      //         );
      //         if (h && Math.abs(h - last) > 1) {
      //             last = h;
      //             api.resize(h).catch(() => { });
      //         }
      //     };
      //     const schedule = () => {
      //         if (!frame) frame = requestAnimationFrame(measure);
      //     };
      //     if (window.ResizeObserver) {
      //         const ro = new ResizeObserver(schedule);
      //         ro.observe(document.documentElement);
      //         if (document.body) ro.observe(document.body);
      //     }
      //     window.addEventListener("load", schedule);
      //     schedule();
      // }
  
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
  
      // Start resizing once connected (no-op when standalone).
      //api.session.then(startAutoResize, () => { });
  
      // Standalone / failed bootstrap must not surface as unhandled rejections.
      api.session.catch((err) => {
          if (err?.message !== "NOT_EMBEDDED") console.error("Salesforce embedding bridge:", err);
      });
  
      return api;
  })();
  
  // ── Page navigation for Salesforce requests ─────────────────────────────────
  // A request can arrive while the app is still starting, so navigation waits for the
  // first App.onPageReady (the router is up by then).
  var sfPageIsReady = false;
  var sfAfterPageReady = [];
  var sfNavigationRequested = false; // Salesforce asked for a page (e.g. Create EBS) → skip the home page
  function sfWhenPageReady(fn) {
      sfNavigationRequested = true;
      if (sfPageIsReady) fn();
      else sfAfterPageReady.push(fn);
  }
  
  // Resolves once the Salesforce bridge has applied its first state (at once when standalone),
  // so requests carried in the initial props are known; gives up after timeoutMs.
  function sfWhenSettled(timeoutMs) {
      return Promise.race([
          App.salesforce.session.then(function () { }, function () { }),
          new Promise(function (resolve) {
              setTimeout(resolve, timeoutMs);
          }),
      ]);
  }
  
  // Open a WaveMaker page. Uses the app action "goToPage_<pageName>" when it exists;
  // otherwise any gotoPage navigation action can open it, because the pageName
  // passed in data overrides the action's own page.
  function sfGoToPage(pageName) {
      var actions = App.Actions || {};
      var own = actions["goToPage_" + pageName];
      if (own && typeof own.invoke === "function") return own.invoke();
      var key = Object.keys(actions).find(function (k) {
          var a = actions[k];
          return a && a.config && a.config.operation === "gotoPage" && typeof a.invoke === "function";
      });
      if (key) return actions[key].invoke({ data: { pageName: pageName } });
      console.warn("Salesforce embedding: no navigation action available to open page '" + pageName + "'");
  }
  
  /* 
  Salesforce Microfrontend UI Embedding - End
  */
  
  
  /*
   * Default home page
   * Page opened when the app is loaded at its root URL, e.g. "clientIllustrationList".
   * Leave "" to keep WaveMaker's own home page.
   */
  App.homePageConfig = {
      page: ""
  };
  
  // True when the document was loaded at the app root (no page in the path or hash).
  // Uses the original document URL, because the router may already have replaced it.
  // In Salesforce the app is loaded at /app/c__<bundle>, which also counts as the root.
  function appOpenedAtRoot() {
      var nav = window.performance && window.performance.getEntriesByType
          ? window.performance.getEntriesByType("navigation")[0]
          : null;
      var url;
      try {
          url = new URL((nav && nav.name) || location.href, location.href);
      } catch (e) {
          url = location;
      }
      var hash = (url.hash || "").replace(/^#\/?/, "").split("?")[0];
      if (hash) return false;
      var path = url.pathname || "/";
      var lastSegment = path.split("/").filter(Boolean).pop() || "";
      return path === "/" || path.endsWith("/") || /\.html?$/i.test(lastSegment) || /^\/app\/c__[^/]+\/?$/.test(path);
  }
  
  /*
   * Runs before the app UI is initialized (first load only).
   * Decides the target home page and remembers whether the app was opened at its root URL,
   * so deep links to a specific page are never overridden. The redirect itself happens in App.onPageReady.
   */
  App.onBeforeAppReady = function () {
      App.homeRedirect = {
          target: (App.homePageConfig && App.homePageConfig.page) || "",
          pending: appOpenedAtRoot()
      };
  };
  
  var appActivePageName = null;
  
  /*
   * Use App.getDependency for Dependency Injection
   * eg: var DialogService = App.getDependency('DialogService');
   */
  
  /* perform any action on the variables within this block(on-page-load) */
  App.onAppVariablesReady = function () {
      /*
       * variables can be accessed through 'App.Variables' property here
       * e.g. App.Variables.staticVariable1.getData()
       */
      // Salesforce Microfrontend UI Embedding
      function setVariable(name, value) {
          var v = App.Variables && App.Variables[name];
          if (v) v.dataSet = value;
          else console.warn("Salesforce embedding: app variable '" + name + "' not found");
      }
  
      // Row sent by Salesforce on "Create Illustration":
      // { id, name, department, title, email, phone, salary, location, hireDate, status, avatarInitials }
      App.salesforce.onEmployeeSelect(function (employee, info) {
          setVariable("selectedEmployee", employee);
          console.log("employeeselect from Salesforce:", employee.name, info.requestId, info.via);
          sfWhenPageReady(function () {
              sfGoToPage("Illustration");
          });
      });
  
      // Full employee list pushed by the host
      App.salesforce.onUiStateChange(function (props) {
          if (props && props.selectedEmployee) setVariable("selectedEmployee", props.selectedEmployee);
      });
  
      // "Create EBS" in Salesforce (Business manager → Illustration summary): the whole
      // submission response, e.g. { submissionId, submissionRef, illustrationId, productCode,
      // status, currentScreen, createdAt, updatedAt, submittedAt }.
      App.salesforce.onCreateEbs(function (submission, info) {
          setVariable("ebsSubmissionData", submission);
          console.log("createEBS from Salesforce:", submission.submissionRef, info.requestId, info.via);
          sfWhenPageReady(function () {
              sfGoToPage("IndividualSavingsAccount");
          });
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
      console.log("Page Ready")
      appActivePageName = activePageName;
  
      // Salesforce Microfrontend UI Embedding: run navigations queued before the first page was up.
      sfPageIsReady = true;
      sfAfterPageReady.splice(0).forEach(function (fn) {
          try {
              fn();
          } catch (e) {
              console.error("Salesforce embedding: page navigation failed", e);
          }
      });
  
      // Configurable home page: redirect once on first load at the root URL.
      // A page requested by Salesforce (e.g. Create EBS → IndividualSavingsAccount) takes priority,
      // including one that arrives with the bridge's first state, so wait for that first.
      var homeRedirect = App.homeRedirect;
      if (homeRedirect && homeRedirect.pending) {
          homeRedirect.pending = false;
          if (homeRedirect.target) {
              sfWhenSettled(5000).then(function () {
                  if (!sfNavigationRequested && homeRedirect.target !== appActivePageName) {
                      sfGoToPage(homeRedirect.target);
                  }
              });
          }
      }
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
  
}