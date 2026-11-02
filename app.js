const $ = (s) => document.querySelector(s);
let current = 0;
const completed = new Set();
function speakArabic(text, button){
  if(!text){alert("Belum ada teks bacaan pada tahapan ini.");return;}
  if(!("speechSynthesis" in window)){alert("Browser ini belum mendukung fitur suara. Coba Chrome atau Edge terbaru.");return;}
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/\n/g,"، "));
  utterance.lang = "ar";
  utterance.rate = 0.78;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase().startsWith("ar"));
  if(voice) utterance.voice = voice;
  utterance.onstart = () => { if(button) button.textContent = "◼ Hentikan audio"; };
  utterance.onend = utterance.onerror = () => { if(button) button.textContent = "▶ Dengarkan (suara perangkat)"; };
  if(button && speechSynthesis.speaking){speechSynthesis.cancel();button.textContent="▶ Dengarkan (suara perangkat)";return;}
  speechSynthesis.speak(utterance);
}
function renderSteps(){
  $("#stepList").innerHTML = PRAYER_STEPS.map((s,i)=>`<button class="step-button ${i===current?"active":""} ${completed.has(i)?"done":""}" data-step="${i}"><span class="step-num">${completed.has(i)?"✓":String(i+1).padStart(2,"0")}</span><span><b>${s.title}</b><small>${s.tag}</small></span></button>`).join("");
  document.querySelectorAll("[data-step]").forEach(b=>b.addEventListener("click",()=>{current=Number(b.dataset.step);render();}));
  $("#progressLabel").textContent=`${completed.size} dari ${PRAYER_STEPS.length} selesai`;
  $("#progressBar").style.width=`${completed.size/PRAYER_STEPS.length*100}%`;
}
function renderLesson(){
 const s=PRAYER_STEPS[current];
 $("#lesson").innerHTML=`<div class="lesson-top"><span class="lesson-index">TAHAP ${String(current+1).padStart(2,"0")} / ${PRAYER_STEPS.length}</span><button class="mark-done" id="doneBtn">${completed.has(current)?"✓ Selesai":"Tandai selesai"}</button></div>
 <h3>${s.title}</h3><p class="intro">${s.intro}</p>
 <div class="detail-label">TATA CARA</div><p class="detail-text">${s.detail}</p>
 ${s.arabic?`<div class="detail-label">BACAAN</div><div class="arabic" lang="ar" dir="rtl">${s.arabic.replace(/\n/g,"<br>")}</div><div class="latin">${s.latin}</div><p class="translation">${s.meaning}</p><button class="audio-btn" id="audioBtn">▶ Dengarkan (suara perangkat)</button>`:""}
 <div class="source-line"><b>RUJUKAN</b><br>${s.source}</div>
 <div class="lesson-controls"><button id="prevBtn" ${current===0?"disabled":""}>← Sebelumnya</button><button id="nextBtn" ${current===PRAYER_STEPS.length-1?"disabled":""}>Berikutnya →</button></div>`;
 $("#doneBtn").addEventListener("click",()=>{completed.has(current)?completed.delete(current):completed.add(current);render();});
 $("#prevBtn").addEventListener("click",()=>{current=Math.max(0,current-1);render();});
 $("#nextBtn").addEventListener("click",()=>{current=Math.min(PRAYER_STEPS.length-1,current+1);render();});
 const audio=$("#audioBtn");if(audio)audio.addEventListener("click",()=>speakArabic(s.arabic,audio));
}
function renderReadings(){
 $("#readingGrid").innerHTML=READINGS.map((r,i)=>`<article class="reading-card glass"><h3>${r.title}</h3><div class="arabic" lang="ar" dir="rtl">${r.ar}</div><p class="latin">${r.latin}</p><p class="translation">${r.meaning}</p><button class="audio-btn" data-audio="${i}">▶ Dengarkan</button></article>`).join("");
 document.querySelectorAll("[data-audio]").forEach(b=>b.addEventListener("click",()=>speakArabic(READINGS[Number(b.dataset.audio)].ar,b)));
}
function render(){renderSteps();renderLesson();}
$("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
render();renderReadings();
