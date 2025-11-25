// js/script.js
// Main exam logic for test.html

(function(){
// DOM
const startCard = document.getElementById('startCard');
const examCard = document.getElementById('examCard');
const resultCard = document.getElementById('resultCard');

const startBtn = document.getElementById('startBtn');
const classSelect = document.getElementById('classSelect');
const subjectSelect = document.getElementById('subjectSelect');
const chapterSelect = document.getElementById('chapterSelect');

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
let questions = []; // current exam questions
let index = 0;
let userAnswers = {}; // { idx: choiceIndex (0..3) }
let marked = {}; // flagged questions
let totalQuestions = 0;
let subjectKey = '';

// helpers
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

// when Start clicked
startBtn.addEventListener('click', () => {
subjectKey = subjectSelect.value;
if(!subjectKey){ alert('कृपया subject चुनें'); return; }

// pick question bank  
const bank = window.questionBank && window.questionBank[subjectKey];  
if(!bank || !Array.isArray(bank) || bank.length===0){  
  alert('इस विषय के प्रश्न उपलब्ध नहीं हैं।');  
  return;  
}  

// choose count: prefer 100 for many subjects, but use bank length if smaller.  
// for science example we use up to 80 (as bank has 80)  
let count = 100;  
if(subjectKey === 'science') count = Math.min(80, bank.length);  
else count = Math.min(100, bank.length);  

// create working copy and shuffle, slice count  
questions = shuffle(bank.slice()).slice(0, count);  
totalQuestions = questions.length;  
index = 0;  
userAnswers = {};  
marked = {};  

// hide start show exam  
startCard.style.display = 'none';  
resultCard.style.display = 'none';  
examCard.style.display = 'block';  
loadQuestion();

});

function loadQuestion(){
const qObj = questions[index];
progressText.textContent = Question ${index+1} / ${totalQuestions};

// question  
qText.innerHTML = `<span style="opacity:0.95; margin-right:6px;">Q${index+1}.</span> ${qObj.q}`;  

// options  
optsBox.innerHTML = '';  
qObj.options.forEach((optText, i) => {  
  const div = document.createElement('div');  
  div.className = 'opt';  
  div.setAttribute('data-choice', i);  
  div.innerHTML = `<div style="min-width:28px; font-weight:800;">${String.fromCharCode(65+i)})</div><div>${optText}</div>`;  
  // highlight if selected  
  if(userAnswers[index] === i) div.classList.add('selected');  
  div.addEventListener('click', () => {  
    // select choice  
    userAnswers[index] = i;  
    // visual  
    Array.from(optsBox.children).forEach(c => c.classList.remove('selected'));  
    div.classList.add('selected');  
  });  
  optsBox.appendChild(div);  
});  

// prev/next button text and disable states  
prevBtn.disabled = index === 0;  
nextBtn.textContent = (index === totalQuestions-1) ? 'Submit' : 'Next';  

// toggle mark button text  
markBtn.textContent = marked[index] ? 'Unmark' : 'Mark';

}

prevBtn.addEventListener('click', () => {
if(index>0){ index--; loadQuestion(); window.scrollTo({top:0,behavior:'smooth'}); }
});

nextBtn.addEventListener('click', () => {
// if last and Submit
if(index === totalQuestions-1){
// Confirm submit
if(!confirm('क्या आप टेस्ट submit करना चाहते हैं?')) return;
evaluate();
return;
}
// allow move forward only if answer selected (you can change this behaviour)
// If you want to force selection before moving next, uncomment:
// if(typeof userAnswers[index] === 'undefined'){ alert('कृपया option चुनें'); return; }

index++;  
loadQuestion();  
window.scrollTo({top:0,behavior:'smooth'});

});

markBtn.addEventListener('click', () => {
marked[index] = !marked[index];
markBtn.textContent = marked[index] ? 'Unmark' : 'Mark';
});

// evaluate & show result
function evaluate(){
examCard.style.display = 'none';
resultCard.style.display = 'block';

// compute score  
let score = 0;  
resultList.innerHTML = '';  

questions.forEach((q,i) => {  
  const user = userAnswers[i];  
  const correct = q.ans;  
  const item = document.createElement('div');  
  item.className = 'result-item';  
  // highlight correct/wrong  
  if(user === correct){  
    score++;  
    item.style.borderLeft = '6px solid #2ecc71';  
  } else {  
    item.style.borderLeft = '6px solid #e74c3c';  
  }  
  // content  
  const yourAnsText = (typeof user === 'number') ? q.options[user] : '<em>Not Answered</em>';  
  item.innerHTML = `<h4 style="margin:0 0 6px 0;">Q${i+1}. ${q.q}</h4>  
    <div style="display:flex; gap:12px; flex-wrap:wrap;">  
      <div style="min-width:220px;"><strong>Your Answer:</strong> ${yourAnsText}</div>  
      <div style="min-width:220px;"><strong>Correct:</strong> ${q.options[correct]}</div>  
      <div style="flex:1; text-align:right;">${marked[i] ? '<span style="color:#ffd166">Marked</span>' : ''}</div>  
    </div>`;  
  resultList.appendChild(item);  
});  

scoreLine.textContent = `Score: ${score} / ${totalQuestions} • Attempted: ${Object.keys(userAnswers).length}`;

}

printBtn.addEventListener('click', () => {
window.print();
});

retakeBtn.addEventListener('click', () => {
// reset to start
resultCard.style.display = 'none';
examCard.style.display = 'none';
startCard.style.display = 'block';
});

// Keyboard: Enter -> next
document.addEventListener('keydown', (e) => {
if(examCard.style.display === 'block'){
if(e.key === 'Enter') nextBtn.click();
if(e.key === 'ArrowRight') nextBtn.click();
if(e.key === 'ArrowLeft') prevBtn.click();
}
});

})();
