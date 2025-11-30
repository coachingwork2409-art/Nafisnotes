// ===============================
// script.js (Final Clean Version)
// ===============================

/* ====== Safe helpers ====== */
function safeGet(id){
  try { return document.getElementById(id); } catch(e){ return null; }
}

/* ===============================
   EXAM MODULE (wrapped & guarded)
   =============================== */
(function(){

  // Try to get exam related DOM elements; if missing, skip exam init
  const startCard = safeGet('startCard');
  const examCard = safeGet('examCard');
  const resultCard = safeGet('resultCard');

  const startBtn = safeGet('startBtn');
  const subjectSelect = safeGet('subjectSelect');

  const qText = safeGet('qText');
  const optsBox = safeGet('optsBox');
  const prevBtn = safeGet('prevBtn');
  const nextBtn = safeGet('nextBtn');
  const markBtn = safeGet('markBtn');
  const progressText = safeGet('progressText');

  const scoreLine = safeGet('scoreLine');
  const resultList = safeGet('resultList');
  const printBtn = safeGet('printBtn');
  const retakeBtn = safeGet('retakeBtn');

  // If essential elements for exam are not found, skip the exam initialization
  if(!startBtn || !subjectSelect || !qText || !optsBox || !prevBtn || !nextBtn){
    // console.log("Exam module: required elements not found, skipping exam initialization.");
    return;
  }

  // State
  let questions = [];
  let index = 0;
  let userAnswers = {};
  let marked = {};
  let totalQuestions = 0;
  let subjectKey = "";

  // Shuffle helper
  function shuffle(arr){ 
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Start Button Click
  startBtn.addEventListener("click", () => {
    subjectKey = subjectSelect.value;

    if(!subjectKey){
      alert("कृपया subject चुनें");
      return;
    }

    const bank = window.questionBank && window.questionBank[subjectKey];
    if(!bank || !Array.isArray(bank) || bank.length === 0){
      alert("इस विषय के प्रश्न उपलब्ध नहीं हैं।");
      return;
    }

    let count = subjectKey === "science" ? Math.min(80, bank.length) : Math.min(100, bank.length);

    questions = shuffle(bank.slice()).slice(0, count);
    totalQuestions = questions.length;
    index = 0;
    userAnswers = {};
    marked = {};

    if(startCard) startCard.style.display = "none";
    if(resultCard) resultCard.style.display = "none";
    if(examCard) examCard.style.display = "block";

    loadQuestion();
  });

  // Load a Question
  function loadQuestion(){
    const qObj = questions[index];

    // Progress text
    if(progressText) progressText.textContent = `Question ${index+1} / ${totalQuestions}`;

    if(!qObj) return;

    // Show ONLY main question (no duplicate numbering)
    if(qText) qText.innerHTML = `${qObj.q}`;

    // Options
    if(optsBox) {
      optsBox.innerHTML = "";
      qObj.options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.className = "opt";
        div.innerHTML = `<div style="min-width:28px; font-weight:800;">${String.fromCharCode(65+i)})</div> ${opt}`;

        if(userAnswers[index] === i) div.classList.add("selected");

        div.addEventListener("click", () => {
          userAnswers[index] = i;

          Array.from(optsBox.children).forEach(c => c.classList.remove("selected"));
          div.classList.add("selected");
        });

        optsBox.appendChild(div);
      });
    }

    if(prevBtn) prevBtn.disabled = index === 0;
    if(nextBtn) nextBtn.textContent = index === totalQuestions - 1 ? "Submit" : "Next";
    if(markBtn) markBtn.textContent = marked[index] ? "Unmark" : "Mark";
  }

  // Previous Button
  if(prevBtn){
    prevBtn.addEventListener("click", () => {
      if(index > 0){
        index--;
        loadQuestion();
        window.scrollTo({top:0, behavior:"smooth"});
      }
    });
  }

  // Next or Submit Button
  if(nextBtn){
    nextBtn.addEventListener("click", () => {

      if(index === totalQuestions - 1){
        if(!confirm("क्या आप टेस्ट submit करना चाहते हैं?")) return;
        evaluate();
        return;
      }

      index++;
      loadQuestion();
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  // Mark Button
  if(markBtn){
    markBtn.addEventListener("click", () => {
      marked[index] = !marked[index];
      markBtn.textContent = marked[index] ? "Unmark" : "Mark";
    });
  }

  // Evaluate Result
  function evaluate(){
    if(examCard) examCard.style.display = "none";
    if(resultCard) resultCard.style.display = "block";

    let score = 0;
    if(resultList) resultList.innerHTML = "";

    questions.forEach((q, i) => {
      const user = userAnswers[i];
      const correct = q.ans;

      const item = document.createElement("div");
      item.className = "result-item";

      if(user === correct){
        score++;
        item.style.borderLeft = "6px solid #2ecc71";
      } else {
        item.style.borderLeft = "6px solid #e74c3c";
      }

      const yourAns = typeof user === "number" ? q.options[user] : "<em>Not Answered</em>";

      item.innerHTML = `
        <h4>Q${i+1}. ${q.q}</h4>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <div><strong>Your Answer:</strong> ${yourAns}</div>
          <div><strong>Correct:</strong> ${q.options[correct]}</div>
          <div style="flex:1; text-align:right;">${marked[i] ? "<span style='color:#ffd166'>Marked</span>" : ""}</div>
        </div>
      `;

      if(resultList) resultList.appendChild(item);
    });

    if(scoreLine) scoreLine.textContent = `Score: ${score} / ${totalQuestions} • Attempted: ${Object.keys(userAnswers).length}`;
  }

  // Print Result
  if(printBtn) printBtn.addEventListener("click", () => window.print());

  // Retake
  if(retakeBtn){
    retakeBtn.addEventListener("click", () => {
      if(resultCard) resultCard.style.display = "none";
      if(examCard) examCard.style.display = "none";
      if(startCard) startCard.style.display = "block";
    });
  }

  // Keyboard Navigation
  document.addEventListener("keydown", e => {
    if(examCard && examCard.style.display === "block"){
      if(e.key === "Enter") nextBtn && nextBtn.click();
      if(e.key === "ArrowRight") nextBtn && nextBtn.click();
      if(e.key === "ArrowLeft") prevBtn && prevBtn.click();
    }
  });

})(); // END main exam IIFE



// =================================
// SIDE MENU — FINAL WORKING VERSION
// =================================

function openMenu(){
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  if(menu) menu.classList.add("open");
  if(overlay) overlay.classList.add("show");
}

function closeMenu(){
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  if(menu) menu.classList.remove("open");
  if(overlay) overlay.classList.remove("show");
}

/* Touch helper for startCard only if exists */
(function(){
  const box = document.getElementById('startCard');
  if(box){
    box.addEventListener('touchstart', () => {
      box.classList.add('hover-touch');
      setTimeout(() => {
          box.classList.remove('hover-touch');
      }, 1200);
    });
  }
})();


// =========================
// CLASS CLICK RIPPLE + ACTIVE
// =========================

(function(){
  const boxes = document.querySelectorAll(".class-box");
  if(!boxes || boxes.length === 0) return;

  boxes.forEach(box => {

    box.addEventListener("click", function (e) {

      // Remove previous active box
      document.querySelectorAll(".class-box").forEach(b => b.classList.remove("active"));

      // Add active class on clicked box
      this.classList.add("active");

      // Create ripple element
      const circle = document.createElement("span");
      circle.classList.add("ripple");

      // Ripple position (support both mouse and touch)
      const rect = this.getBoundingClientRect();
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;

      let x = clientX - rect.left;
      let y = clientY - rect.top;

      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      // size ripple relative to element
      const size = Math.max(rect.width, rect.height) * 0.18;
      circle.style.width = circle.style.height = `${size}px`;

      this.appendChild(circle);

      // Remove ripple after animation
      setTimeout(() => {
        circle.remove();
      }, 700);

    });

  });
})();
