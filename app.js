const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const pad=n=>String(n).padStart(2,"0"),dayKey=(d=new Date())=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove("show"),4500)};

/* Tema */
if(store.get("light",false))document.body.classList.add("light");
$("#themeToggle").onclick=()=>{document.body.classList.toggle("light");store.set("light",document.body.classList.contains("light"))};

/* Audio: sembunyikan tombol jika suara Arab belum tersedia */
function ttsCheck(){const ok="speechSynthesis"in window&&speechSynthesis.getVoices().some(v=>v.lang.toLowerCase().replace("_","-").startsWith("ar"));document.body.classList.toggle("no-tts",!ok)}
ttsCheck();if("speechSynthesis"in window){speechSynthesis.addEventListener?.("voiceschanged",ttsCheck);setTimeout(ttsCheck,1500)}
/* Splash */
const sp=$("#splash"),hideSplash=()=>{sp.classList.add("out");setTimeout(()=>sp.remove(),600)};
setTimeout(hideSplash,matchMedia("(prefers-reduced-motion:reduce)").matches?300:1900);sp.onclick=hideSplash;
/* Navigasi layar (gaya aplikasi) */
const TITLES={home:"Beranda",bersuci:"Bersuci",sholat:"Tahapan sholat",bacaan:"Bacaan",info:"Info & rujukan"};
let curV="home",lastV="home";
function go(v){if(!TITLES[v])v="home";curV=v;if(v!=="info")lastV=v;$$(".view").forEach(x=>x.classList.toggle("on",x.id==="v-"+v));$$(".tabbar button").forEach(b=>b.classList.toggle("on",b.dataset.v===v));const ib=$("#infoBtn");ib.classList.toggle("on",v==="info");ib.setAttribute("aria-pressed",String(v==="info"));$("#viewTitle").textContent=TITLES[v];$("#views").scrollTop=0;store.set("view",v);try{history.replaceState(null,"","#"+v)}catch(e){}}
$$(".tabbar button").forEach(b=>b.onclick=()=>go(b.dataset.v));
$("#infoBtn").onclick=()=>go(curV==="info"?lastV:"info");
/* Audio */
function speakArabic(text,btn){
if(!text)return toast("Belum ada teks bacaan pada tahapan ini.");
if(!("speechSynthesis"in window))return toast("Browser ini belum mendukung suara. Coba Chrome atau Edge.");
const idle="▶ Dengarkan";if(speechSynthesis.speaking){speechSynthesis.cancel();btn.textContent=idle;return}
const u=new SpeechSynthesisUtterance(text.replace(/\n/g,"، "));u.lang="ar";u.rate=.78;
const v=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("ar"));if(v)u.voice=v;
u.onstart=()=>btn.textContent="◼ Hentikan";u.onend=u.onerror=()=>btn.textContent=idle;speechSynthesis.speak(u)}

const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent||"");
const standalone=()=>(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone;
/* Jadwal sholat (rumus astronomi; Subuh 20°, Isya 18°, Asar mazhab Syafi'i) */
const R=Math.PI/180,sin=x=>Math.sin(x*R),cos=x=>Math.cos(x*R),tan=x=>Math.tan(x*R),acos=x=>Math.acos(x)/R;
function calc(date,lat,lng,tz){
const jd=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/864e5+2440587.5,d=jd-2451545;
const g=(357.529+.98560028*d)%360,q=(280.459+.98564736*d)%360,L=q+1.915*sin(g)+.02*sin(2*g),e=23.439-4e-7*d;
const dec=Math.asin(sin(e)*sin(L))/R;let ra=Math.atan2(cos(e)*sin(L),cos(L))/R/15;ra=((ra%24)+24)%24;
const noon=12+tz-lng/15-(q/15-ra+(q/15-ra<-12?24:q/15-ra>12?-24:0));
const T=a=>{const c=(sin(a)-sin(dec)*sin(lat))/(cos(dec)*cos(lat));return isNaN(c)||Math.abs(c)>1?NaN:acos(c)/15};
const asr=Math.atan(1/(1+tan(Math.abs(lat-dec))))/R;
return{Subuh:noon-T(-20),Syuruq:noon-T(-.833),Dzuhur:noon+2/60,Ashar:noon+T(asr),Maghrib:noon+T(-.833),Isya:noon+T(-18)}}
const NAMES=["Subuh","Dzuhur","Ashar","Maghrib","Isya"],GRACE=10*6e4;
let cityName=store.get("city","Jakarta");if(!CITIES[cityName])cityName="Jakarta";
let times={},tomorrow=null;
const tzOf=()=>CITIES[cityName].tz,tzLabel=()=>({7:"WIB",8:"WITA",9:"WIT"})[tzOf()];
const hm=d=>{const x=new Date(d.getTime()+tzOf()*36e5);return `${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}`};
function cityDay(off=0){const n=new Date(Date.now()+tzOf()*36e5+off*864e5),y=n.getUTCFullYear(),m=n.getUTCMonth(),d=n.getUTCDate();return{y,m,d,key:`${y}-${m+1}-${d}`}}
function timesFor(off=0){const c=CITIES[cityName],{y,m,d,key}=cityDay(off),r=calc(new Date(y,m,d),c.lat,c.lng,c.tz),o={key};
for(const k in r)o[k]=isNaN(r[k])?null:new Date(Date.UTC(y,m,d)-c.tz*36e5+Math.round(r[k]*60)*6e4);return o}
const computeTimes=()=>{times=timesFor(0);tomorrow=null},getTomorrow=()=>tomorrow||(tomorrow=timesFor(1));
function ensureToday(){if(times.key!==cityDay().key){computeTimes();renderPrayers();renderTrack();scheduleReminder()}}
let remind=store.get("remind",{Subuh:1,Dzuhur:1,Ashar:1,Maghrib:1,Isya:1}),lead=store.get("lead",0),fired=store.get("fired",{});
function renderPrayers(){
$("#locLabel").textContent=`Jadwal untuk ${cityName} (${tzLabel()}), dihitung otomatis. Cocokkan dengan jadwal Kemenag atau masjid setempat.`;
$("#prayerGrid").innerHTML=["Subuh","Syuruq","Dzuhur","Ashar","Maghrib","Isya"].map(n=>`<div class="prayer glass" data-p="${n}"><small>${n==="Syuruq"?"Terbit":"Sholat"}</small><b>${n}</b><strong>${times[n]?hm(times[n]):"--:--"}</strong>${n==="Syuruq"?"":`<button class="bell ${remind[n]?"on":""}" data-bell="${n}" aria-pressed="${!!remind[n]}" aria-label="Pengingat ${n}">${remind[n]?"🔔":"🔕"}</button>`}</div>`).join("");
$$("[data-bell]").forEach(b=>b.onclick=()=>{const n=b.dataset.bell;remind[n]=remind[n]?0:1;store.set("remind",remind);renderPrayers();scheduleReminder();
if(remind[n]&&"Notification"in window&&Notification.permission!=="granted")toast("Pengingat aktif. Aktifkan notifikasi agar muncul di layar.");tick()})}
function nextPrayer(){const now=new Date();for(const n of NAMES)if(times[n]&&times[n]>now)return{n,t:times[n]};return{n:"Subuh",t:getTomorrow().Subuh}}
function tick(){
ensureToday();
const now=new Date(),nx=nextPrayer(),ms=nx.t-now,idx=NAMES.indexOf(nx.n);
const prev=idx>0?times[NAMES[idx-1]]:(times.Isya&&now>=times.Isya?times.Isya:new Date(nx.t-6*36e5)),span=Math.max(nx.t-prev,1);
$("#nextName").textContent=nx.n;$("#nextTime").textContent=`pukul ${hm(nx.t)} ${tzLabel()}`;
const s=Math.max(0,Math.floor(ms/1000));$("#nextCount").textContent=`${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`;
const C=2*Math.PI*52;$("#ringFg").style.strokeDasharray=C;$("#ringFg").style.strokeDashoffset=C*Math.min(1,Math.max(0,ms/span));
$$(".prayer").forEach(p=>p.classList.toggle("next",p.dataset.p===nx.n));
checkReminders()}

/* Notifikasi pengingat */
async function showNotif(title,body,tag){
if(!("Notification"in window)||Notification.permission!=="granted")return false;
const o={body,icon:"icon-192.png",badge:"icon-192.png",tag,renotify:true,vibrate:[200,100,200],lang:"id",data:{url:"./index.html"}};
try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg&&reg.active){await reg.showNotification(title,o);return true}}catch(e){}
try{new Notification(title,o);return true}catch(e){return false}}
function reminderText(n){const rem=Math.ceil((times[n]-Date.now())/6e4);
if(rem>0)return `${rem} menit lagi masuk waktu ${n}. Siapkan wudhu.`;
const late=-rem;return late>=2?`Waktu ${n} telah masuk ${late} menit yang lalu. Mari sholat.`:`Waktu ${n} telah masuk. Mari sholat.`}
function notify(n){const msg=reminderText(n);toast(msg);if(navigator.vibrate)try{navigator.vibrate([200,100,200])}catch(e){}
showNotif(`Pengingat Sholat ${n}`,msg,`sholat-${n}-${times.key}`)}
function checkReminders(){const now=Date.now();
if(fired.day!==times.key){fired={day:times.key};store.set("fired",fired)}
NAMES.forEach(n=>{if(!remind[n]||!times[n])return;const key=`${n}@${lead}`,diff=times[n]-lead*6e4-now;
if(diff<=0&&diff>-GRACE&&!fired[key]){fired[key]=1;store.set("fired",fired);notify(n)}})}
/* Tandai pengingat yang waktunya sudah lewat agar tidak berbunyi mendadak setelah ganti kota/jeda */
function markPassed(){const now=Date.now();if(fired.day!==times.key)fired={day:times.key};NAMES.forEach(n=>{if(times[n]&&times[n]-lead*6e4<=now)fired[`${n}@${lead}`]=1});store.set("fired",fired)}
/* Pewaktu tepat sasaran (selain interval 1 detik) agar tidak terlewat saat tab di latar belakang */
let rt;function scheduleReminder(){clearTimeout(rt);const now=Date.now();let best=Infinity;
[times,getTomorrow()].forEach(t=>NAMES.forEach(n=>{if(!remind[n]||!t[n])return;const x=t[n]-lead*6e4;if(x>now&&x<best)best=x}));
if(best<Infinity)rt=setTimeout(()=>{tick();scheduleReminder()},Math.min(best-now+400,2147e6))}
function setNotifState(){const el=$("#notifState"),b=$("#notifBtn"),t=$("#notifTest");
if(!("Notification"in window)){b.hidden=true;t.hidden=true;
el.textContent=isIOS&&!standalone()?"Di iPhone/iPad, notifikasi hanya tersedia setelah aplikasi dipasang ke Layar Utama (iOS 16.4 ke atas). Sementara ini pengingat tampil sebagai pesan di halaman.":"Browser ini belum mendukung notifikasi; pengingat tampil sebagai pesan di halaman.";return}
const p=Notification.permission;b.hidden=p==="granted";t.hidden=p!=="granted";
el.textContent=p==="granted"?"Notifikasi aktif. Pengingat muncul selama aplikasi terbuka atau berjalan di latar belakang. Jika aplikasi ditutup sepenuhnya, pengingat tidak dapat muncul.":p==="denied"?"Notifikasi diblokir di browser. Izinkan lewat pengaturan situs, lalu muat ulang halaman.":"Aktifkan notifikasi agar pengingat muncul di layar. Pengingat berjalan selama aplikasi terbuka."}
$("#notifBtn").onclick=async()=>{let r;try{r=await Notification.requestPermission()}catch(e){}
const p=r||Notification.permission;setNotifState();
if(p==="granted"){const ok=await showNotif("Notifikasi aktif","Pengingat sholat akan muncul sesuai pengaturan Anda.","aktif");toast(ok?"Notifikasi diaktifkan.":"Izin diberikan, tetapi notifikasi gagal ditampilkan. Coba muat ulang halaman.")}
else if(p==="denied")toast("Izin notifikasi ditolak. Izinkan lewat pengaturan situs di browser.")};
$("#notifTest").onclick=async()=>{const ok=await showNotif("Tes notifikasi","Notifikasi Panduan Sholat berfungsi dengan baik.","tes");
toast(ok?"Notifikasi tes dikirim.":"Notifikasi tes gagal. Periksa izin notifikasi di pengaturan browser.")};
try{navigator.permissions&&navigator.permissions.query({name:"notifications"}).then(st=>{st.onchange=setNotifState}).catch(()=>{})}catch(e){}
$("#leadSel").value=lead;$("#leadSel").onchange=e=>{lead=+e.target.value;store.set("lead",lead);markPassed();scheduleReminder();toast("Pengingat diatur.")};
/* Pilih kota */
$("#citySel").innerHTML=CITY_GROUPS.map(g=>`<optgroup label="${g.g}">${g.c.map(c=>`<option value="${c[0]}">${c[0]}</option>`).join("")}</optgroup>`).join("");
$("#citySel").value=cityName;
$("#citySel").onchange=e=>{cityName=e.target.value;store.set("city",cityName);computeTimes();markPassed();renderPrayers();scheduleReminder();tick();toast(`Jadwal diperbarui untuk ${cityName}.`)};
/* Bangun ulang saat aplikasi kembali ke layar */
const wake=()=>{if(!document.hidden){tick();scheduleReminder()}};
document.addEventListener("visibilitychange",wake);window.addEventListener("focus",wake);window.addEventListener("pageshow",wake);

/* Bersuci & pembatal */
const acc=x=>x.map(y=>`<details class="acc glass"><summary>${y.t}</summary><p>${y.d}</p><p class="src">${y.s}</p></details>`).join("");
let pk="wudhu",pi=0;
function renderPurify(){$$("#purifyTabs button").forEach(b=>b.classList.toggle("on",b.dataset.k===pk));const box=$("#purifyList");
if(pk==="pembatal"){box.innerHTML=`<h4 class="gtitle">Pembatal wudhu</h4>${acc(BATAL_WUDHU)}<h4 class="gtitle">Pembatal sholat</h4>${acc(BATAL_SHOLAT)}`;return}
const arr=pk==="wudhu"?WUDHU:TAYAMMUM,x=arr[pi];
box.innerHTML=`<div class="stepcard glass"><div class="dots">${arr.map((_,n)=>`<i class="${n===pi?"on":n<pi?"past":""}" data-pi="${n}"></i>`).join("")}</div><span class="lesson-index">Langkah ${pi+1} dari ${arr.length}</span><h3>${x.t}</h3><p class="detail-text">${x.d}</p>${x.ar?`<div class="arabic" lang="ar" dir="rtl">${x.ar}</div><p class="latin">${x.lt}</p><p class="translation">${x.m}</p>`:""}<p class="src">Sumber: ${x.s}</p><div class="lesson-controls"><button id="pPrev" ${pi===0?"disabled":""}>← Kembali</button><button id="pNext" ${pi===arr.length-1?"disabled":""}>Lanjut →</button></div></div>`;
$("#pPrev").onclick=()=>{pi--;renderPurify()};$("#pNext").onclick=()=>{pi++;renderPurify()};$$("[data-pi]").forEach(d=>d.onclick=()=>{pi=+d.dataset.pi;renderPurify()})}
$$("#purifyTabs button").forEach(b=>b.onclick=()=>{pk=b.dataset.k;pi=0;renderPurify()});renderPurify();
/* Ragam bacaan & tahapan sholat */
const sv={},sg={};let cur=0;const done=new Set(store.get("done",[]));
const vcard=(g,i)=>{const x=G[g].items[i];return `<div class="vcard"><span class="vtag">${x.tag}</span>${x.ar?`<div class="arabic" lang="ar" dir="rtl">${x.ar}</div>`:""}${x.lt?`<p class="latin">${x.lt}</p>`:""}<p class="translation">${x.m}</p><p class="src">Sumber: ${x.s}</p>${x.ar?`<button class="audio-btn" data-va="${g}|${i}">▶ Dengarkan</button>`:""}</div>`};
const gInner=(g,lib)=>{const q=G[g],n=q.items.length,i=Math.min(sv[g]||0,n-1);return `${lib?"":`<h4 class="gtitle">${q.title}</h4>`}<p class="gnote">${q.note}</p>${n>1?`<div class="chips">${q.items.map((_,j)=>`<button class="chip ${j===i?"on":""}" data-vg="${g}" data-vi="${j}">${j+1}</button>`).join("")}<span class="chipnote">${n} ragam riwayat</span></div>`:""}${vcard(g,i)}`};
function readHTML(){const ids=SG[cur],k=Math.min(sg[cur]||0,ids.length-1);return (ids.length>1?`<div class="seg">${ids.map((g,j)=>`<button class="${j===k?"on":""}" data-gt="${j}">${G[g].title.replace(/ \(.*\)/,"")}</button>`).join("")}</div>`:"")+`<div class="gblk" data-g="${ids[k]}">${gInner(ids[k])}</div>`}
document.addEventListener("click",e=>{let b=e.target.closest("[data-va]");if(b){const[g,i]=b.dataset.va.split("|");speakArabic(G[g].items[+i].ar,b);return}
b=e.target.closest("[data-vg]");if(b){sv[b.dataset.vg]=+b.dataset.vi;const k=b.closest(".gblk");k.innerHTML=gInner(b.dataset.vg,k.dataset.lib==="1");return}
b=e.target.closest("[data-gt]");if(b){sg[cur]=+b.dataset.gt;$("#readArea").innerHTML=readHTML()}});
function render(){
$("#stepList").innerHTML=PRAYER_STEPS.map((s,i)=>`<button class="schip ${i===cur?"active":""} ${done.has(i)?"done":""}" data-step="${i}"><span>${done.has(i)?"✓":i+1}</span>${s.title}</button>`).join("");
$$("[data-step]").forEach(b=>b.onclick=()=>{cur=+b.dataset.step;render()});
const ac=$(".schip.active");if(ac&&ac.scrollIntoView)try{ac.scrollIntoView({inline:"center",block:"nearest"})}catch(e){}
$("#progressLabel").textContent=`${done.size} dari ${PRAYER_STEPS.length} selesai`;$("#progressBar").style.width=`${done.size/PRAYER_STEPS.length*100}%`;
const s=PRAYER_STEPS[cur];
const main=s.arabic?`<div class="arabic" lang="ar" dir="rtl">${s.arabic.replace(/\n/g,"<br>")}</div><div class="latin">${s.latin}</div><p class="translation">${s.meaning}</p><button class="audio-btn" id="audioBtn">▶ Dengarkan</button>`:"";
$("#lesson").innerHTML=`<div class="lesson-top"><span class="lesson-index">Tahap ${cur+1} dari ${PRAYER_STEPS.length}</span><button class="mark-done" id="doneBtn">${done.has(cur)?"✓ Selesai":"Tandai selesai"}</button></div><h3>${s.title}</h3><p class="intro">${s.intro}</p><details class="how" open><summary>Tata cara</summary><p class="detail-text">${s.detail}</p></details><div id="readArea">${SG[cur]?readHTML():main}</div><div class="source-line"><b>Rujukan</b> ${s.source}</div><div class="lesson-controls"><button id="prevBtn" ${cur===0?"disabled":""}>← Sebelumnya</button><button id="nextBtn" ${cur===PRAYER_STEPS.length-1?"disabled":""}>Berikutnya →</button></div>`;
$("#doneBtn").onclick=()=>{done.has(cur)?done.delete(cur):done.add(cur);store.set("done",[...done]);render()};
$("#prevBtn").onclick=()=>{cur=Math.max(0,cur-1);render();$("#views").scrollTop=0};$("#nextBtn").onclick=()=>{cur=Math.min(PRAYER_STEPS.length-1,cur+1);render();$("#views").scrollTop=0};
const au=$("#audioBtn");if(au)au.onclick=()=>speakArabic(s.arabic,au)}

/* Tips & pelacak */
let tipI=Math.floor(Date.now()/864e5)%TIPS.length;
function showTip(){const t=TIPS[tipI];$("#tipNo").textContent=`Tip ${tipI+1} dari ${TIPS.length}`;$("#tipTitle").textContent=t.t;$("#tipBody").textContent=t.d;$("#tipSrc").textContent=t.s?`Rujukan: ${t.s}`:""}
$("#tipNext").onclick=()=>{tipI=(tipI+1)%TIPS.length;showTip()};
let log=store.get("log",{});
function renderTrack(){const k=dayKey(),d=log[k]||[];
$("#track").innerHTML=NAMES.map(n=>`<label class="chk ${d.includes(n)?"on":""}"><input type="checkbox" data-t="${n}" ${d.includes(n)?"checked":""}><span>${n}</span></label>`).join("");
$("#trackCount").textContent=`${d.length} dari 5`;
let st=0,x=new Date();if(!(log[dayKey(x)]||[]).length===0&&(log[dayKey(x)]||[]).length===5){}
while((log[dayKey(x)]||[]).length===5){st++;x.setDate(x.getDate()-1)}
$("#streak").textContent=st?`Anda menyelesaikan lima sholat selama ${st} hari berturut-turut.`:d.length===5?"":"Centang setiap sholat setelah Anda menunaikannya.";
$$("[data-t]").forEach(c=>c.onchange=()=>{const s=new Set(log[k]||[]);c.checked?s.add(c.dataset.t):s.delete(c.dataset.t);log[k]=[...s];store.set("log",log);renderTrack();if(s.size===5)toast("Alhamdulillah, lima sholat hari ini lengkap.")})}

/* Bacaan */
$("#readingGrid").innerHTML=Object.keys(G).map(g=>`<details class="acc glass lib"><summary>${G[g].title}<em>${G[g].items.length} ragam</em></summary><div class="gblk" data-g="${g}" data-lib="1">${gInner(g,true)}</div></details>`).join("");

computeTimes();renderPrayers();setNotifState();render();showTip();renderTrack();tick();scheduleReminder();setInterval(tick,1000);
/* Instal aplikasi (PWA) */
let dip=window.__dip||null;
const installed=()=>!!standalone();
function syncInstall(){$$(".install-btn").forEach(b=>b.hidden=installed())}
window.addEventListener("pwa-ready",()=>{dip=window.__dip;syncInstall()});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;window.__dip=e;syncInstall()});
window.addEventListener("appinstalled",()=>{dip=null;window.__dip=null;syncInstall();toast("Aplikasi berhasil dipasang. Buka dari layar utama.")});
function openSheet(){
const ua=navigator.userAgent||"",android=/android/i.test(ua);let steps,note;
if(isIOS){steps=["Ketuk ikon <b>Bagikan</b> (kotak dengan panah ke atas) di Safari.","Gulir lalu pilih <b>Tambah ke Layar Utama</b>.","Ketuk <b>Tambah</b>. Ikon aplikasi muncul di layar utama."];note="iPhone/iPad tidak mengizinkan situs memasang aplikasi otomatis, jadi pemasangan dilakukan lewat menu Bagikan. Gunakan Safari (atau Chrome/Edge versi terbaru)."}
else if(android){steps=["Ketuk menu <b>⋮</b> di pojok browser.","Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.","Ketuk <b>Instal</b>."];note="Tombol Instal otomatis aktif di Chrome, Edge, atau Samsung Internet setelah halaman dimuat beberapa detik. Jika tidak muncul, aplikasi mungkin sudah terpasang: cek layar utama Anda."}
else{steps=["Buka halaman ini di <b>Chrome</b> atau <b>Edge</b>.","Klik ikon <b>Instal</b> di kanan bilah alamat, atau menu <b>⋮</b> lalu <b>Instal Panduan Sholat</b>.","Klik <b>Instal</b>."];note="Firefox dan Safari desktop belum mendukung pemasangan aplikasi web. Pemasangan juga memerlukan alamat https."}
$("#sheetSteps").innerHTML=steps.map(x=>`<li>${x}</li>`).join("");$("#sheetNote").textContent=note;$("#installSheet").hidden=false;$("#sheetClose").focus()}
const closeSheet=()=>{$("#installSheet").hidden=true};
$("#sheetClose").onclick=closeSheet;$("#installSheet").onclick=e=>{if(e.target.id==="installSheet")closeSheet()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
async function doInstall(){
if(!dip){openSheet();return}
const ev=dip;dip=null;window.__dip=null;
try{await ev.prompt();const c=await ev.userChoice;toast(c&&c.outcome==="accepted"?"Memasang aplikasi…":"Pemasangan dibatalkan. Ketuk Instal kapan saja untuk mencoba lagi.")}
catch(e){openSheet()}}
$$(".install-btn").forEach(b=>b.onclick=doInstall);syncInstall();

/* Pembaruan aplikasi: tampil di awal aplikasi dibuka */
let swReg=null,updating=false,dismissed=false;
function offerUpdate(){if(dismissed)return;const show=()=>{$("#updateBar").hidden=false};
if(document.getElementById("splash"))setTimeout(show,2300);else show()}
function watchWorker(w){if(!w)return;const chk=()=>{if(w.state==="installed"&&navigator.serviceWorker.controller)offerUpdate()};w.addEventListener("statechange",chk);chk()}
$("#updateLater").onclick=()=>{dismissed=true;$("#updateBar").hidden=true};
$("#updateNow").onclick=()=>{const w=swReg&&swReg.waiting;if(!w){location.reload();return}
updating=true;$("#updateNow").disabled=true;$("#updateNow").textContent="Memperbarui…";w.postMessage({type:"SKIP_WAITING"});setTimeout(()=>location.reload(),4000)};
$("#checkUpdate").onclick=async()=>{if(!swReg)return toast("Pembaruan hanya tersedia saat aplikasi dibuka lewat https.");
toast("Memeriksa pembaruan…");try{await swReg.update()}catch(e){return toast("Gagal memeriksa pembaruan. Periksa koneksi internet.")}
if(swReg.waiting||swReg.installing){dismissed=false;watchWorker(swReg.installing||swReg.waiting);if(swReg.waiting)offerUpdate();toast("Pembaruan ditemukan.")}else toast("Anda sudah memakai versi terbaru.")};
if("serviceWorker"in navigator){
navigator.serviceWorker.addEventListener("controllerchange",()=>{if(updating)location.reload()});
const reg=()=>navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(r=>{swReg=r;
if(r.waiting&&navigator.serviceWorker.controller)offerUpdate();
r.addEventListener("updatefound",()=>watchWorker(r.installing));
r.update().catch(()=>{});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)r.update().catch(()=>{})});
setInterval(()=>r.update().catch(()=>{}),30*6e4)}).catch(()=>{});
if(document.readyState==="complete")reg();else window.addEventListener("load",reg)}

go(location.hash.slice(1)||store.get("view","home"));
