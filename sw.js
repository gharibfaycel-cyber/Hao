// network-first for the page (so updates arrive), cache fallback offline
const CACHE="hao-v3";
const FILES=["./","index.html","manifest.json","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const timeout=new Promise((_,rej)=>setTimeout(rej,3000));
  e.respondWith(
    Promise.race([fetch(e.request,{cache:"no-store"}),timeout]).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
      return res;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html")))
  );
});
