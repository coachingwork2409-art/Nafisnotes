// =========================
// MAIN EXAM LOGIC FOR test.html
// =========================

(function () {

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
  let questions = [];
  let index = 0;
  let userAnswers = {};
  let marked = {};
  let totalQuestions = 0;
  let subjectKey = '';

  // Shuffle helper
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // START BUTTON CLICK
  startBtn.addEventListener('click', () => {
    subjectKey = subjectSelect.value;
    if (!subjectKey) { alert('कृपया subject चुनें'); return; }

    const bank = window.questionBank && window.questionBank[subjectKey];
    if (!bank || !Array.isArray(bank) || bank.length === 0) {
      alert('इस विषय के प्रश्न उपलब्ध नहीं हैं।');
      return;
    }

    let count = 100;
    if (subjectKey === 'science') count = Math.min(80, bank.length);
    else count = Math.min(100, bank.length);

    questions = shuffle(bank.slice()).slice(0, count);
    totalQuestions = questions.length;
    index = 0;
    userAnswers = {};
    marked = {};

    startCard.style.display = 'none';
    resultCard.style.display = 'none';
    examCard.style.display = 'block';

    loadQuestion();
  });

  // LOAD QUESTION
  function loadQuestion() {
    const qObj = questions[index];
    progressText.textContent = `Question ${index + 1} / ${totalQuestions}`;

    qText.innerHTML = `<span style="opacity:0.95; margin-right:6px;">Q${index + 1}.</span> ${qObj.q}`;

    optsBox.innerHTML = '';
    qObj.options.forEach((optText, i) => {
      const div = document.createElement('div');
      div.className = 'opt';
      div.setAttribute('data-choice', i);
      div.innerHTML = `<div style="min-width:28px; font-weight:800;">${String.fromCharCode(65 + i)})</div><div>${optText}</div>`;
      if (userAnswers[index] === i) div.classList.add('selected');

      div.addEventListener('click', () => {
        userAnswers[index] = i;
        Array.from(optsBox.children).forEach(c => c.classList.remove('selected'));
        div.classList.add('selected');
      });

      optsBox.appendChild(div);
    });

    prevBtn.disabled = index === 0;
    nextBtn.textContent = (index === totalQuestions - 1) ? 'Submit' : 'Next';
    markBtn.textContent = marked[index] ? 'Unmark' : 'Mark';
  }

  // NEXT
  nextBtn.addEventListener('click', () => {
    if (index === totalQuestions - 1) {
      if (!confirm('क्या आप टेस्ट submit करना चाहते हैं?')) return;
      evaluate();
      return;
    }
    index++;
    loadQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // PREV
  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      loadQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // MARK / UNMARK
  markBtn.addEventListener('click', () => {
    marked[index] = !marked[index];
    markBtn.textContent = marked[index] ? 'Unmark' : 'Mark';
  });

  // EVALUATE
  function evaluate() {
    examCard.style.display = 'none';
    resultCard.style.display = 'block';

    let score = 0;
    resultList.innerHTML = '';

    questions.forEach((q, i) => {
      const user = userAnswers[i];
      const correct = q.ans;
      const item = document.createElement('div');
      item.className = 'result-item';

      if (user === correct) {
        score++;
        item.style.borderLeft = '6px solid #2ecc71';
      } else {
        item.style.borderLeft = '6px solid #e74c3c';
      }

      const yourAnsText =
        (typeof user === 'number') ? q.options[user] : '<em>Not Answered</em>';

      item.innerHTML = `
        <h4 style="margin:0 0 6px 0;">Q${i + 1}. ${q.q}</h4>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <div style="min-width:220px;"><strong>Your Answer:</strong> ${yourAnsText}</div>
          <div style="min-width:220px;"><strong>Correct:</strong> ${q.options[correct]}</div>
          <div style="flex:1; text-align:right;">${marked[i] ? '<span style="color:#ffd166">Marked</span>' : ''}</div>
        </div>
      `;
      resultList.appendChild(item);
    });

    scoreLine.textContent =
      `Score: ${score} / ${totalQuestions} • Attempted: ${Object.keys(userAnswers).length}`;
  }

  printBtn.addEventListener('click', () => window.print());

  retakeBtn.addEventListener('click', () => {
    resultCard.style.display = 'none';
    examCard.style.display = 'none';
    startCard.style.display = 'block';
  });

})();
  

// =========================
// GLOBAL MENU FUNCTIONS (FIX)
// =========================

window.openMenu = function () {
  const side = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (side) side.classList.add("open");
  if (overlay) overlay.classList.add("show");
};

window.closeMenu = function () {
  const side = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");

  if (side) side.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
