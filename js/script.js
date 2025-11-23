// Menu open / close
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

function openMenu(){
  if(!sideMenu || !overlay) return;
  sideMenu.classList.add('open');
  overlay.classList.add('show');
  sideMenu.setAttribute('aria-hidden','false');
}
function closeMenu(){
  if(!sideMenu || !overlay) return;
  sideMenu.classList.remove('open');
  overlay.classList.remove('show');
  sideMenu.setAttribute('aria-hidden','true');
}
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeMenu();
});

/* ====== MCQ Test rendering (on test.html) ====== */
const quizRoot = document.getElementById('quiz');
const resultBox = document.getElementById('result');
const checkBtn = document.getElementById('checkBtn');

const sampleQuestions = [
  {
    q: "1)  √2 क्या है?",
    options: ["Rational", "Irrational", "Integer", "Natural"],
    answer: 1
  },
  {
    q: "2)  (x+1)(x-1) का विस्तार क्या है?",
    options: ["x^2-1", "x^2+1", "x^2-2x+1", "x^2+2x+1"],
    answer: 0
  },
  {
    q: "3)  त्रिभुज के तीनों कोणों का योग?",
    options: ["90°", "180°", "270°", "360°"],
    answer: 1
  }
];

function renderQuiz(){
  if(!quizRoot) return;
  quizRoot.innerHTML = '';
  sampleQuestions.forEach((item, idx)=>{
    const div = document.createElement('div');
    div.className = 'quiz-q';
    div.innerHTML = `<p style="font-weight:700;margin-bottom:6px">${item.q}</p>`;
    item.options.forEach((opt,i)=>{
      const id = `q${idx}_opt${i}`;
      const html = `<label style="display:block;margin:6px 0">
        <input type="radio" name="q${idx}" value="${i}" /> ${opt}
      </label>`;
      div.insertAdjacentHTML('beforeend', html);
    });
    quizRoot.appendChild(div);
  });
}
if(quizRoot) renderQuiz();

if(checkBtn){
  checkBtn.addEventListener('click', ()=>{
    let score=0;
    sampleQuestions.forEach((item,idx)=>{
      const sel = document.querySelector(`input[name="q${idx}"]:checked`);
      if(sel && Number(sel.value) === item.answer) score++;
    });
    if(resultBox) resultBox.innerText = `आपका स्कोर: ${score} / ${sampleQuestions.length}`;
  });
}

/* Contact form (client-side fallback) */
function submitContact(e){
  e.preventDefault();
  const name = document.getElementById('name')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const message = document.getElementById('message')?.value || '';
  if(!name || !email || !message){ alert('कृपया सभी फ़ील्ड भरें'); return; }
  // mailto fallback
  const subject = encodeURIComponent('Contact from website: ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
  // also show confirmation
  alert('Thank you! Your email client will open. If not, contact using the email shown on page.');
}
