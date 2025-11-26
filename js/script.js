// ===============================
// script.js (Final Clean Version)
// ===============================

(function(){

  // DOM elements
  const startCard = document.getElementById('startCard');
  const examCard = document.getElementById('examCard');
  const resultCard = document.getElementById('resultCard');

  const startBtn = document.getElementById('startBtn');
  const subjectSelect = document.getElementById('subjectSelect');

  const qText = document.getElementById('qText');
  const optsBox = document.getElementById('optsBox');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const markBtn = document.getElementById('markBtn');
  const progressText = document.getElementById('progressText');

  const scoreLine = document.getElementById('scoreLine');
  const resultList = document.getElementById('resultList');
  const printBtn = document.getElementById('printBtn');
  const retakeBtn = document.getElementById('retakeBtn');

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

    startCard.style.display = "none";
    resultCard.style.display = "none";
    examCard.style.display = "block";

    loadQuestion();
  });

  // Load a Question
  function loadQuestion(){
    const qObj = questions[index];

    // Progress text
    progressText.textContent = `Question ${index+1} / ${totalQuestions}`;

    // Show ONLY main question (no duplicate numbering)
    qText.innerHTML = `${qObj.q}`;

    // Options
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

    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === totalQuestions - 1 ? "Submit" : "Next";
    markBtn.textContent = marked[index] ? "Unmark" : "Mark";
  }

  // Previous Button
  prevBtn.addEventListener("click", () => {
    if(index > 0){
      index--;
      loadQuestion();
      window.scrollTo({top:0, behavior:"smooth"});
    }
  });

  // Next or Submit Button
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

  // Mark Button
  markBtn.addEventListener("click", () => {
    marked[index] = !marked[index];
    markBtn.textContent = marked[index] ? "Unmark" : "Mark";
  });

  // Evaluate Result
  function evaluate(){
    examCard.style.display = "none";
    resultCard.style.display = "block";

    let score = 0;
    resultList.innerHTML = "";

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

      resultList.appendChild(item);
    });

    scoreLine.textContent = `Score: ${score} / ${totalQuestions} • Attempted: ${Object.keys(userAnswers).length}`;
  }

  // Print Result
  printBtn.addEventListener("click", () => window.print());

  // Retake
  retakeBtn.addEventListener("click", () => {
    resultCard.style.display = "none";
    examCard.style.display = "none";
    startCard.style.display = "block";
  });

  // Keyboard Navigation
  document.addEventListener("keydown", e => {
    if(examCard.style.display === "block"){
      if(e.key === "Enter") nextBtn.click();
      if(e.key === "ArrowRight") nextBtn.click();
      if(e.key === "ArrowLeft") prevBtn.click();
    }
  });

})(); // END main exam IIFE



// =================================
// SIDE MENU — FINAL WORKING VERSION
// =================================

function openMenu(){
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  menu.classList.add("open");
  overlay.classList.add("show");
}

function closeMenu(){
  const menu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  menu.classList.remove("open");
  overlay.classList.remove("show");
}
const box = document.getElementById('startCard');

box.addEventListener('touchstart', () => {
    box.classList.add('hover-touch');
    setTimeout(() => {
        box.classList.remove('hover-touch');
    }, 1200);
});
