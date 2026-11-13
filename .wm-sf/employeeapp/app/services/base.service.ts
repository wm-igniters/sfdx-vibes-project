import { store } from '@wavemaker-ai/react-runtime/store';
import { getHttpService } from '@wavemaker-ai/react-runtime/hooks/useHttp';

/**
 * Structural, not `AxiosInstance`: the runtime bundles its own axios copy, so the two
 * `AxiosInstance` types are nominally different and assigning one to the other fails. Only
 * `.request()` is used.
 */
interface RequestTransport {
  request<T>(config: Record<string, any>): Promise<{
    data: T;
    status: number;
    headers?: any;
    [key: string]: any;
  }>;
}

/**
 * The app's base URL, read live from the runtime store per call.
 *
 * Falls back to NEXT_PUBLIC_SERVER_PATH: the store starts as `appConfig: {}` and is filled from
 * an async effect, so a startup variable can fire first — an empty base would then produce a
 * relative URL resolving against the dev server rather than the backend.
 */
function getServerPath(): string {
  return (
    store.getState().info?.appConfig?.url ||
    process.env.NEXT_PUBLIC_SERVER_PATH ||
    ''
  );
}

/** Joins the server path with a generated path, collapsing the boundary to one slash. */
export function joinServerPath(path: string): string {
  const joined = `${getServerPath().replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  return joined.endsWith('/') ? joined.slice(0, -1) : joined;
}

/**
 * The runtime's own axios instance — the one carrying every interceptor (Accept/withCredentials/
 * XSRF, App.onBeforeServiceCall / onServiceSuccess / onServiceError, the 401 session-replay
 * queue). Sharing it keeps a single implementation of those rather than a copy here that drifts.
 *
 * `getHttpService()` is a lazy singleton, not a hook, so it is safe from a module-scope service.
 */
function getTransport(): RequestTransport {
  return getHttpService().getAxiosInstance() as unknown as RequestTransport;
}

/**
 * Carries path-param values onto a `directPath`, which keeps its `{token}` templates while the
 * caller's relative path already has real values substituted. Matched by position, aligned from
 * the end, since directPath's own prefix differs.
 */
function applyPathParams(
  directPath: string,
  templateRelativePath = '',
  interpolatedRelativePath = ''
): string {
  if (!directPath.includes('{')) {
    return directPath;
  }
  const templateSegments = templateRelativePath.split('/');
  const actualSegments = interpolatedRelativePath.split('/');
  const values: string[] = [];
  // Align from the END: directPath's own prefix differs from the relative path, but the
  // param-bearing tail is the same shape.
  for (let i = 1; i <= templateSegments.length; i++) {
    const templateSegment = templateSegments[templateSegments.length - i];
    const actualSegment = actualSegments[actualSegments.length - i];
    if (
      templateSegment &&
      /^\{[^}]+\}$/.test(templateSegment) &&
      actualSegment !== undefined
    ) {
      values.unshift(actualSegment);
    }
  }
  let index = 0;
  return directPath.replace(/\{[^}]+\}/g, match =>
    index < values.length ? values[index++] : match
  );
}

/**
 * Extra per-call context a caller can pass alongside the generated params object —
 * everything here is optional and merges over whatever the operation itself computed
 * (headers/query/data), never the other way round.
 */
export interface ServiceFnCtx {
  /**
   * Values are `string | undefined`: a generated method always passes every declared header param,
   * and an optional one that the caller didn't supply arrives as undefined. The request
   * interceptor drops those rather than sending the literal "undefined".
   */
  headers?: Record<string, string | undefined>;
  query?: Record<string, any>;
  data?: any;
  timeout?: number;
  signal?: AbortSignal;
  withCredentials?: boolean;
  /**
   * Set to 'blob' for a file-download operation — suppresses the `Accept: application/json`
   * header the request interceptor otherwise adds, matching the runtime's own carve-out for
   * downloads (whose response is a binary stream, not JSON).
   */
  responseType?: 'blob' | 'json' | 'text' | 'arraybuffer';
  /**
   * The variable's own cancellation token, set by the runtime's send(). Forwarded so
   * `httpService.cancel(variable)` can still abort an in-flight request — which is what
   * `inFlightBehavior: 'executeLast'` relies on to stop a superseded response from landing
   * after a newer one.
   */
  cancelToken?: any;
  /**
   * The runtime's own marker for which variable this call belongs to. The request interceptor
   * reads `.operation` (the download carve-out) and an app's `onBeforeServiceCall` hook can read
   * `.name`/`.owner`, so it is passed through rather than re-stated.
   */
  __wmVariable?: { name?: string; owner?: string; operation?: string };
  /**
   * The operation's entry from the app's own `servicedefs.json` (`wmServiceOperationInfo`),
   * forwarded by the generated invokeHttp glue. It is the ONLY runtime source of a direct
   * (non-proxied) connector's real target URL — see url().
   */
  serviceInfo?: {
    relativePath?: string;
    directPath?: string;
    proxySettings?: {
      web?: boolean;
      mobile?: boolean;
      withCredentials?: boolean;
    };
    [key: string]: any;
  };
}

export interface ServiceResponse<T> {
  data: T;
  status: number;
  headers?: Record<string, any>;
}

export abstract class BaseService {
  /**
   * `super(routePrefix, basePath)` — outermost segment first, so the arguments read in the same
   * order they appear in the URL.
   *
   * - `routePrefix`: the app-server routing segment this service needs — `/services` for a
   *   proxied root service, `/prefabs/<Name>` for a prefab one, and `''` for a direct connector
   *   (whose target comes from `serviceInfo.directPath` instead). Decided per service from the
   *   designtime doc, so it cannot be hardcoded here.
   * - `basePath`: the controller's own base path, i.e. the TS equivalent of Spring's class-level
   *   `@RequestMapping("/hrdb/Department")` (from `x-WM-BASE_PATH`). Each method then builds only
   *   its method-level relative path (`@GetMapping("/{deptId}/employees")`).
   */
  protected constructor(
    private readonly routePrefix: string = '',
    private readonly basePath: string = ''
  ) {}

  /**
   * Resolves a method-level path, mirroring the runtime's own choice
   * (`url = isProxyCall ? options.url : serviceInfo.directPath`):
   *
   * - **direct connector** (`proxySettings.web === false`) uses `serviceInfo.directPath`. That URL
   *   is only knowable at runtime — the designtime doc carries just the unresolved
   *   `${rest.<Service>.*}` placeholder, resolved server-side into servicedefs.json.
   * - **otherwise** route through the app server: live baseUrl + `/services` (or
   *   `/prefabs/<Name>`) + base path. Also the fallback when `serviceInfo` is absent, so
   *   incomplete metadata never sends a request to an external host.
   */
  /**
   * The full request URL: this service's resolved path for `relativePath`, plus `params` as a
   * query string. The one call a generated method makes.
   */
  protected buildTargetUrl(
    relativePath: string,
    params: Record<string, any> = {},
    ctx?: ServiceFnCtx,
    arrayFormats?: Record<string, string>
  ): string {
    return appendQueryString(this.url(relativePath, ctx), params, arrayFormats);
  }

  protected url(relativePath = '', ctx?: ServiceFnCtx): string {
    const serviceInfo = ctx?.serviceInfo;
    const isProxied = serviceInfo?.proxySettings?.web ?? true;
    if (serviceInfo?.directPath && !isProxied) {
      return applyPathParams(
        serviceInfo.directPath,
        serviceInfo.relativePath,
        relativePath
      );
    }
    const path = `${this.routePrefix}${this.basePath}${relativePath}`.replace(
      /\/{2,}/g,
      '/'
    );
    return joinServerPath(path);
  }

  protected async request<T>(
    url: string,
    method: string,
    ctx: ServiceFnCtx = {},
    // Left undefined rather than defaulted to `false`: the runtime's request interceptor applies
    // `config.withCredentials ?? true`, and passing an explicit `false` would satisfy that and
    // silently suppress the session cookie on every call.
    withCredentials?: boolean
  ): Promise<ServiceResponse<T>> {
    // Only build the config — every cross-cutting concern (Accept/XSRF/withCredentials default,
    // App.onBeforeServiceCall, App.onServiceSuccess, App.onServiceError, the 401 session-replay
    // queue) is applied by the interceptors already attached to this transport. See getTransport().
    // GET/DELETE/HEAD/OPTIONS carry no body — WS_CONSTANTS.NON_DATA_AXIOS_METHODS, which the
    // runtime's send() applies as `...(isNonDataMethod ? {} : { data })`. `ctx` is that same
    // axiosConfig, so its `data` (the row being deleted, say) would otherwise ride along on a
    // DELETE that declares no body.
    const isNonDataMethod = ['get', 'delete', 'head', 'options'].includes(
      method.toLowerCase()
    );
    const res: any = await getTransport().request<T>({
      url,
      method,
      ...(isNonDataMethod ? {} : { data: ctx.data }),
      params: ctx.query,
      headers: ctx.headers,
      timeout: ctx.timeout,
      signal: ctx.signal,
      // A direct connector can declare its own credential policy in servicedefs
      // (`proxySettings.withCredentials`); honour it before the interceptor's default-true.
      withCredentials:
        ctx.withCredentials ??
        withCredentials ??
        ctx.serviceInfo?.proxySettings?.withCredentials,
      responseType: ctx.responseType,
      // Without this, httpService.cancel(variable) cannot abort the request and
      // `inFlightBehavior: 'executeLast'` stops working — a superseded response can land after a
      // newer one and overwrite the variable's dataSet.
      cancelToken: ctx.cancelToken,
      // The interceptor skips the JSON Accept header for downloads, keyed off the variable it is
      // given. Prefer the runtime's own marker (it also carries name/owner for an app's
      // onBeforeServiceCall hook); state the carve-out directly only when there is none.
      __wmVariable:
        ctx.__wmVariable ??
        (ctx.responseType === 'blob'
          ? { operation: 'getDownloadFile' }
          : undefined),
    } as any);
    // Returned whole, as the pre-invokeHttp flow did: the managers gate their success handlers on
    // the interceptor's own fields (CrudVariableManager requires `type` and reads `body` only), so
    // narrowing the shape silently skips processSuccessResponse and the variable's dataSet is
    // never assigned — a successful call that renders nothing. `status`/`headers` need no
    // re-stating; the spread already carries them. `data` does: it mirrors `body` so an
    // App.onServiceSuccess hook that rewrote the payload is honoured for a `.data` reader.
    return {
      ...(res as any),
      data: (res?.body ?? res?.data) as T,
    };
  }
}

/**
 * Strips a `<name>=` prefix @wavemaker-ai/variables baked into a value for its own URL templates
 * (`sort: "sort=userId asc"`, `data: "q=username='admin'"`). These methods build their own pairs,
 * so an un-stripped fragment is prefixed twice and the backend rejects it. Applied by the two
 * serializers below, which hold each param's wire name — matching on that name is the only rule
 * that works, since the same param arrives prefixed from one operation and bare from another.
 *
 * Text-only: the value inside is already encodeURIComponent'd, so parsing it would decode `%26`
 * to a literal `&` and split the query.
 */
function bareParamValue(name: string, value: any): any {
  if (typeof value !== 'string') {
    return value; // entity bodies, numbers, arrays are never formatted fragments
  }
  const prefix = `${name}=`;
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

export function toFormUrlEncoded(params: Record<string, any> = {}): string {
  return (
    Object.entries(params)
      .map(([k, v]) => [k, bareParamValue(k, v)] as const)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      // The VALUE is not re-encoded. @wavemaker-ai/variables has already
      // encodeURIComponent'd it (LiveVariableUtils.encodeAndAddQuotes), and the legacy path
      // sent that string as the body verbatim — so the server's single form-decode yields the
      // intended text. Encoding again makes a `startignorecase` filter's trailing `%` arrive as
      // the literal `%25`, and `LIKE 'admin%25'` matches nothing.
      .map(([k, v]) => `${encodeURIComponent(k)}=${String(v)}`)
      .join('&')
  );
}

/**
 * Appends `params` to `url` as a query string.
 *
 * `arrayFormats` is only needed for an array-valued param whose doc declares a non-default
 * `collectionFormat`/`style` (e.g. `multi`, which repeats the key instead of joining with commas).
 * Every other param serializes the same way, so the generated call omits it.
 */
function appendQueryString(
  url: string,
  params: Record<string, any> = {},
  arrayFormats: Record<string, string> = {}
): string {
  const parts: string[] = [];
  const hasValue = (v: any) => v !== undefined && v !== null && v !== '';

  Object.entries(params).forEach(([name, rawValue]) => {
    const value = bareParamValue(name, rawValue);
    // An empty string means the optional param wasn't supplied — every one of these is
    // `required: false`, and a blank value is meaningfully different from an absent one
    // (e.g. `q=` asks a DataService to filter by nothing).
    if (!hasValue(value)) {
      return;
    }
    const encoded = encodeURIComponent(name);

    if (Array.isArray(value)) {
      if (arrayFormats[name] === 'multi') {
        value.forEach(v => parts.push(`${encoded}=${encodeURIComponent(v)}`));
        return;
      }
      const separator =
        arrayFormats[name] === 'ssv'
          ? ' '
          : arrayFormats[name] === 'tsv'
            ? '\t'
            : arrayFormats[name] === 'pipes'
              ? '|'
              : ',';
      parts.push(`${encoded}=${encodeURIComponent(value.join(separator))}`);
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value)
        .filter(([, v]) => hasValue(v))
        .forEach(([k, v]) =>
          parts.push(
            `${encoded}[${encodeURIComponent(k)}]=${encodeURIComponent(String(v))}`
          )
        );
      return;
    }

    parts.push(`${encoded}=${encodeURIComponent(String(value))}`);
  });

  if (!parts.length) {
    return url;
  }
  return `${url}${url.includes('?') ? '&' : '?'}${parts.join('&')}`;
}
