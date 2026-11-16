/* Cartwall offline cache: the page opens even with no internet.
   The page is fetched fresh when online (so updates show up) and falls back to the saved copy after 3 seconds or when offline.
   Carts and their audio live in the browser's own storage, not here. */
const CACHE='cartwall-v2';
const SHELL=['./','./index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||req.mode!=='navigate') return;   // only the page itself; carts.json and WAVs always come from the site
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const net=fetch(req).then(r=>{if(r.ok) cache.put('./index.html',r.clone()); return r;});
    const saved=await cache.match('./index.html');
    if(!saved) return net;
    return Promise.race([net.catch(()=>saved),new Promise(res=>setTimeout(()=>res(saved),3000))]);
  })());
});
