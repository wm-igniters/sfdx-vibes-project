(function () {
  var base = new URL(document.currentScript.src).pathname.replace(/\/sf-shim\.js$/, '');
  var sameApp = function (u) { return u.origin === location.origin && u.pathname.indexOf(base + '/') === 0; };

  // Salesforce caches every file for a year; tag non-hashed app files with this build's id.
  var version = function (u) {
    if (sameApp(u) && u.pathname.indexOf(base + '/_next/static/') !== 0) u.searchParams.set('v', "A1I75B29Wv_Y36BbNRq4t");
    return u;
  };

  // Salesforce answers every route with index.html (the "/" tree). Hydrating it under another path
  // renders nothing, so reset deep links to the root; the app then redirects to its home page.
  if (location.pathname !== base && location.pathname !== base + '/') {
    history.replaceState(history.state, '', base + location.search + location.hash);
  }

  // Next fetches RSC payloads as <route>.txt; read the .txt.json copy and restore the content type.
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var raw = typeof input === 'string' || input instanceof URL ? String(input) : input.url;
    var url = new URL(raw, location.href);
    if (sameApp(url) && /\.txt$/.test(url.pathname)) {
      var original = url.href;
      url.pathname += '.json';
      return origFetch.call(this, version(url).href, init).then(function (res) {
        var out = new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: { 'content-type': 'text/x-component' },
        });
        Object.defineProperty(out, 'url', { value: original });
        return out;
      });
    }
    if (sameApp(url) && typeof input === 'string') arguments[0] = version(url).href;
    return origFetch.apply(this, arguments);
  };

  // With a server path set, the runtime asks for the backend endpoint services/servicedefs;
  // point it at the static JSON instead.
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    var u = new URL(url, location.href);
    if (sameApp(u) && u.pathname === base + '/services/servicedefs') {
      u.pathname += '.json';
    }
    if (sameApp(u)) arguments[1] = version(u).href;
    return origOpen.apply(this, arguments);
  };
})();
