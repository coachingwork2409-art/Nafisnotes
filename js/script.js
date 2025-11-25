// ============================
// MAIN EXAM + MENU FIXED CODE
// ============================

(function(){

// DOM CHECK (only for test.html)
const startCard = document.getElementById('startCard');
const examCard = document.getElementById('examCard');
const resultCard = document.getElementById('resultCard');

if(startCard && examCard && resultCard){

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

let questions = [];
let index = 0;
let userAnswers = {};
let marked = {};
let totalQuestions = 0;
let subjectKey = '';

function shuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

startBtn.addEventListener('click', () => {

  subjectKey = subjectSelect.value;
  if(!subjectKey){ alert("कृपया subject चुनें"); return; }

  const bank = window.questionBank && window.questionBank[subjectKey];
  if(!bank){ alert("इस subject का bank नहीं मिला"); return; }

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

function loadQuestion(){
  const qObj = questions[index];

  // FIXED ERROR LINE 🔥
  progressText.textContent = `Question ${index+1} / ${totalQuestions}`;

  qText.innerHTML = `<span style="opacity:0.95;margin-right:6px;">Q${index+1}.</span> ${qObj.q}`;

  optsBox.innerHTML = "";

  qObj.options.forEach((opt,i)=>{
    const div = document.createElement("div");
    div.className = "opt";
    div.innerHTML = `<div style="min-width:28px;font-weight:800;">${String.fromCharCode(65+i)})</div> <div>${opt}</div>`;

    if(userAnswers[index] === i) div.classList.add("selected");

    div.addEventListener("click",()=>{
      userAnswers[index] = i;
      [...optsBox.children].forEach(c=>c.classList.remove("selected"));
      div.classList.add("selected");
    });

    optsBox.appendChild(div);
  });

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === totalQuestions - 1 ? "Submit" : "Next";
  markBtn.textContent = marked[index] ? "Unmark" : "Mark";
}

prevBtn.addEventListener("click",()=>{
  if(index>0){ index--; loadQuestion(); }
});

nextBtn.addEventListener("click",()=>{
  if(index === totalQuestions - 1){
    if(!confirm("Submit करना चाहते?")) return;
    evaluate();
    return;
  }
  index++;
  loadQuestion();
});

markBtn.addEventListener("click",()=>{
  marked[index] = !marked[index];
  markBtn.textContent = marked[index] ? "Unmark" : "Mark";
});

function evaluate(){
  examCard.style.display = "none";
  resultCard.style.display = "block";

  let score = 0;
  resultList.innerHTML = "";

  questions.forEach((q,i)=>{
    const user = userAnswers[i];
    const correct = q.ans;

    const box = document.createElement("div");
    box.className = "result-item";
    box.style.borderLeft = user === correct ? "6px solid #00ff80" : "6px solid #ff4444";

    box.innerHTML = `
      <h4>Q${i+1}. ${q.q}</h4>
      <p><strong>Your:</strong> ${(typeof user==="number")?q.options[user]:"—"}</p>
      <p><strong>Correct:</strong> ${q.options[correct]}</p>
    `;

    if(user===correct) score++;
    resultList.appendChild(box);
  });

  scoreLine.textContent = `Score: ${score} / ${totalQuestions}`;
}

printBtn.addEventListener("click",()=>window.print());
retakeBtn.addEventListener("click",()=>{
  examCard.style.display="none";
  resultCard.style.display="none";
  startCard.style.display="block";
});

} // END exam check

})();

// ============================
// SIDEMENU FINAL WORKING CODE
// ============================

function openMenu(){
  const m = document.getElementById("sideMenu");
  const o = document.getElementById("overlay");
  if(m && o){ m.classList.add("open"); o.classList.add("show"); }
}

function closeMenu(){
  const m = document.getElementById("sideMenu");
  const o = document.getElementById("overlay");
  if(m && o){ m.classList.remove("open"); o.classList.remove("show"); }
}
