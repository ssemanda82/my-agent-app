var CACHE = 'agent-v1';
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(['./']); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function(res) {
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return res;
    }).catch(function() {
      return caches.match(e.request).then(function(m){ return m || caches.match('./'); });
    })
  );
});
