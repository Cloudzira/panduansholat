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
const TITLES={home:"Beranda",bersuci:"Wudhu, tayammum & pembatal",sholat:"Tahapan sholat",bacaan:"Perpustakaan bacaan",info:"Rujukan & info"};
function go(v){if(!TITLES[v])v="home";$$(".view").forEach(x=>x.classList.toggle("on",x.id==="v-"+v));$$(".tabbar button").forEach(b=>b.classList.toggle("on",b.dataset.v===v));$("#viewTitle").textContent=TITLES[v];$("#views").scrollTop=0;store.set("view",v);try{history.replaceState(null,"","#"+v)}catch(e){}}
$$(".tabbar button").forEach(b=>b.onclick=()=>go(b.dataset.v));
/* Audio */
function speakArabic(text,btn){
if(!text)return toast("Belum ada teks bacaan pada tahapan ini.");
if(!("speechSynthesis"in window))return toast("Browser ini belum mendukung suara. Coba Chrome atau Edge.");
const idle="▶ Dengarkan";if(speechSynthesis.speaking){speechSynthesis.cancel();btn.textContent=idle;return}
const u=new SpeechSynthesisUtterance(text.replace(/\n/g,"، "));u.lang="ar";u.rate=.78;
const v=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("ar"));if(v)u.voice=v;
u.onstart=()=>btn.textContent="◼ Hentikan";u.onend=u.onerror=()=>btn.textContent=idle;speechSynthesis.speak(u)}

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
const NAMES=["Subuh","Dzuhur","Ashar","Maghrib","Isya"];
let loc=store.get("loc",{lat:-6.2,lng:106.82,name:"Jakarta (bawaan)"}),times={};
const at=(h,base=new Date())=>{const x=new Date(base);x.setHours(0,0,0,0);x.setMinutes(Math.round(h*60));return x};
const hm=d=>`${pad(d.getHours())}:${pad(d.getMinutes())}`;
function computeTimes(base=new Date()){const c=calc(base,loc.lat,loc.lng,-base.getTimezoneOffset()/60);times={};for(const k in c)times[k]=at(c[k],base)}
let remind=store.get("remind",{Subuh:1,Dzuhur:1,Ashar:1,Maghrib:1,Isya:1}),lead=store.get("lead",0),fired=store.get("fired",{});
function renderPrayers(){
$("#locLabel").textContent=`Lokasi: ${loc.name}. Jadwal dihitung otomatis, cocokkan dengan jadwal masjid setempat.`;
$("#prayerGrid").innerHTML=["Subuh","Syuruq","Dzuhur","Ashar","Maghrib","Isya"].map(n=>`<div class="prayer glass" data-p="${n}"><small>${n==="Syuruq"?"Terbit":"Sholat"}</small><b>${n}</b><strong>${times[n]?hm(times[n]):"--:--"}</strong>${n==="Syuruq"?"":`<button class="bell ${remind[n]?"on":""}" data-bell="${n}" aria-pressed="${!!remind[n]}" aria-label="Pengingat ${n}">${remind[n]?"🔔":"🔕"}</button>`}</div>`).join("");
$$("[data-bell]").forEach(b=>b.onclick=()=>{remind[b.dataset.bell]=remind[b.dataset.bell]?0:1;store.set("remind",remind);renderPrayers();markTrack()})}
function nextPrayer(){const now=new Date();for(const n of NAMES)if(times[n]>now)return{n,t:times[n]};computeTimes(new Date(Date.now()+864e5));const r={n:"Subuh",t:times.Subuh};computeTimes();return r}
function tick(){
const now=new Date(),nx=nextPrayer(),ms=nx.t-now,idx=NAMES.indexOf(nx.n);
const prev=idx>0?times[NAMES[idx-1]]:new Date(nx.t-864e5*.25),span=Math.max(nx.t-prev,1);
$("#nextName").textContent=nx.n;$("#nextTime").textContent=`pukul ${hm(nx.t)}`;
const s=Math.max(0,Math.floor(ms/1000));$("#nextCount").textContent=`${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`;
const C=2*Math.PI*52;$("#ringFg").style.strokeDasharray=C;$("#ringFg").style.strokeDashoffset=C*Math.min(1,Math.max(0,ms/span));
$$(".prayer").forEach(p=>p.classList.toggle("next",p.dataset.p===nx.n));
const today=dayKey();if(fired.day!==today){fired={day:today};store.set("fired",fired)}
NAMES.forEach(n=>{if(!remind[n]||!times[n])return;const key=n+lead,diff=times[n]-lead*6e4-now;
if(diff<=0&&diff>-9e4&&!fired[key]){fired[key]=1;store.set("fired",fired);notify(n)}})}
function notify(n){const msg=lead?`${lead} menit lagi masuk waktu ${n}. Siapkan wudhu.`:`Waktu ${n} telah masuk. Mari sholat.`;
toast(msg);if(navigator.vibrate)navigator.vibrate([200,100,200]);
if("Notification"in window&&Notification.permission==="granted")try{new Notification("Pengingat Sholat",{body:msg})}catch(e){}}
function markTrack(){}
function setNotifState(){const el=$("#notifState"),b=$("#notifBtn");
if(!("Notification"in window)){el.textContent="Browser belum mendukung notifikasi; pengingat tampil sebagai pesan di halaman.";b.hidden=true;return}
const p=Notification.permission;b.hidden=p==="granted";
el.textContent=p==="granted"?"Notifikasi aktif. Pengingat berjalan selama halaman terbuka.":p==="denied"?"Notifikasi diblokir di browser. Izinkan lewat pengaturan situs.":"Pengingat berjalan selama halaman terbuka. Aktifkan notifikasi agar muncul di layar."}
$("#notifBtn").onclick=async()=>{try{await Notification.requestPermission()}catch(e){}setNotifState()};
$("#leadSel").value=lead;$("#leadSel").onchange=e=>{lead=+e.target.value;store.set("lead",lead);toast("Pengingat diatur.")};
$("#locBtn").onclick=()=>{if(!navigator.geolocation)return toast("Lokasi tidak didukung browser ini.");
navigator.geolocation.getCurrentPosition(p=>{loc={lat:p.coords.latitude,lng:p.coords.longitude,name:`${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)}`};store.set("loc",loc);computeTimes();renderPrayers();tick();toast("Jadwal diperbarui sesuai lokasi Anda.")},()=>toast("Izin lokasi ditolak. Jadwal memakai lokasi bawaan."),{timeout:8000})};

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

computeTimes();renderPrayers();setNotifState();render();showTip();renderTrack();tick();setInterval(tick,1000);
setInterval(()=>{if(new Date().getHours()===0&&new Date().getMinutes()===0){computeTimes();renderPrayers();renderTrack()}},60000);
go(location.hash.slice(1)||store.get("view","home"));
