// Quiz Mode implementation
// - Multiple choice from current set
// - Tracks score and saves aggregate stats in localStorage under studyflow_quiz_stats

(function () {
  const quizSection = document.getElementById('quiz-section');
  if (!quizSection) return;

  const KEY = 'studyflow_quiz_stats';
  function getQuizStats() { try { return JSON.parse(localStorage.getItem(KEY)) || { quizzesTaken: 0, totalScore: 0, totalQuestions: 0, avgScore: 0 }; } catch { return { quizzesTaken: 0, totalScore: 0, totalQuestions: 0, avgScore: 0 }; } }
  function saveQuizStats(stats) { try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch {} }

  let sets = window.SFStorage.getSets();
  let params = new URLSearchParams(location.search);
  let setId = params.get('set');
  let currentSet = sets.find(s => s.id === setId) || sets[0];
  if (!currentSet) return;

  const qProgress = document.getElementById('quiz-progress');
  const qScore = document.getElementById('quiz-score');
  const qQuestion = document.getElementById('quiz-question');
  const qOptions = document.getElementById('quiz-options');
  const qFeedback = document.getElementById('quiz-feedback');
  const qNext = document.getElementById('quiz-next');
  const qResult = document.getElementById('quiz-result');
  const qSummary = document.getElementById('quiz-summary');
  const qRetry = document.getElementById('quiz-retry');
  const qBack = document.getElementById('quiz-back');

  let questions = [];
  let index = 0;
  let correct = 0;

  function generateQuestions() {
    const cards = (currentSet.cards || []).filter(c => c.term && c.definition);
    // Build one question per term; order randomized later
    const defsAll = cards.map(cc => cc.definition);
    questions = cards.map((c) => {
      // Build 3 unique incorrect options from other definitions
      const pool = defsAll.filter(d => d !== c.definition);
      const incorrect = [];
      const poolCopy = [...pool];
      while (incorrect.length < Math.min(3, poolCopy.length)) {
        const idx = Math.floor(Math.random() * poolCopy.length);
        const pick = poolCopy.splice(idx, 1)[0];
        if (pick && !incorrect.includes(pick)) incorrect.push(pick);
      }
      // If dataset smaller than 4, backfill with any remaining defs to keep 4 options when possible
      if (incorrect.length < 3) {
        const extras = defsAll.filter(d => d !== c.definition && !incorrect.includes(d));
        for (let i = 0; i < extras.length && incorrect.length < 3; i++) incorrect.push(extras[i]);
      }
      const optionsSource = [c.definition, ...incorrect.slice(0,3)];
      const uniqueOptions = Array.from(new Set(optionsSource));
      const options = shuffleArray(uniqueOptions);
      return { prompt: c.term, answer: c.definition, options };
    });
    // Randomize question order; exactly matches number of terms
    questions = shuffleArray(questions);
  }

  function shuffleArray(arr) { const a = [...arr]; for (let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function renderQuestion() {
    if (index >= questions.length) return endQuiz();
    const q = questions[index];
    qQuestion.textContent = q.prompt;
    qOptions.innerHTML = '';
    qFeedback.textContent = '';
    qNext.disabled = true;
    qNext.setAttribute('aria-disabled', 'true');
    qProgress.textContent = `Question ${index + 1} of ${questions.length}`;
    qScore.textContent = `Score: ${correct}/${index}`;
    const frag = document.createDocumentFragment();
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = opt || '(no answer)';
      btn.addEventListener('click', () => onPick(btn, opt === q.answer));
      btn.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'enter' || e.key === ' ') { e.preventDefault(); onPick(btn, opt === q.answer); } });
      frag.appendChild(btn);
    });
    qOptions.appendChild(frag);
    // animate in
    quizSection.querySelector('.quiz-card').classList.remove('quiz-fade','show');
    void qQuestion.offsetWidth; // reflow
    quizSection.querySelector('.quiz-card').classList.add('quiz-fade');
    setTimeout(() => quizSection.querySelector('.quiz-card').classList.add('show'), 20);
  }

  function onPick(button, isCorrect) {
    // disable all
    qOptions.querySelectorAll('button').forEach(b => { b.disabled = true; b.setAttribute('aria-disabled','true'); });
    button.setAttribute('aria-pressed', 'true');
    if (isCorrect) {
      correct += 1;
      button.classList.add('correct');
      qFeedback.textContent = 'Correct!';
    } else {
      button.classList.add('incorrect');
      qFeedback.textContent = 'Incorrect';
      // mark correct option
      Array.from(qOptions.children).forEach((b) => { if (b.textContent === questions[index].answer) b.classList.add('correct'); });
    }
    qScore.textContent = `Score: ${correct}/${index + 1}`;
    qNext.disabled = false;
    qNext.removeAttribute('aria-disabled');
  }

  function nextQuestion() {
    index += 1;
    renderQuestion();
  }

  function endQuiz() {
    quizSection.querySelector('.quiz-card').setAttribute('hidden', '');
    qResult.removeAttribute('hidden');
    const total = questions.length || 1;
    const pct = Math.round((correct / total) * 100);
    qSummary.textContent = `You answered ${correct} out of ${total} correctly (${pct}%).`;

    // Save stats
    const s = getQuizStats();
    s.quizzesTaken += 1;
    s.totalScore += correct;
    s.totalQuestions += total;
    s.avgScore = s.totalQuestions ? Math.round((s.totalScore / s.totalQuestions) * 100) : 0;
    saveQuizStats(s);
  }

  function startQuiz() {
    quizSection.removeAttribute('hidden');
    quizSection.querySelector('.quiz-card').removeAttribute('hidden');
    qResult.setAttribute('hidden', '');
    index = 0; correct = 0; questions = []; generateQuestions(); renderQuestion();
  }

  qNext.addEventListener('click', nextQuestion);
  qRetry.addEventListener('click', startQuiz);
  qBack.addEventListener('click', () => switchMode('flashcards'));

  // mode switch hook from flashcards.js
  window.SFStudyQuiz = { startQuiz };
})();


