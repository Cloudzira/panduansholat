/* Naikkan angka versi V pada setiap rilis agar pengguna mendapat pemberitahuan pembaruan. */
const V="panduan-sholat-v5",ASSETS=["./","index.html","styles.css","cities.js","data.js","data-extra.js","app.js","icon.svg","icon-192.png","icon-512.png","manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(ASSETS.map(u=>c.add(new Request(u,{cache:"reload"}))))))});
self.addEventListener("message",e=>{if(e.data&&e.data.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const same=new URL(r.url).origin===location.origin;
e.respondWith(fetch(same?new Request(r.url,{cache:"no-cache"}):r).then(res=>{if(res.ok&&same){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))))});
self.addEventListener("notificationclick",e=>{e.notification.close();
e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l){if("focus"in c)return c.focus()}return self.clients.openWindow("./index.html")}))});
