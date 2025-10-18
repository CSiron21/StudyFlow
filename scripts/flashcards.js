// Flashcards page logic
// - loads set from localStorage (by ?set=id, defaults to demo)
// - flip/next/prev/shuffle
// - session studied count
// - create custom card to current set

(function () {
  window.SFStorage.initDefaults();

  const params = new URLSearchParams(location.search);
  const setId = params.get('set');
  let sets = window.SFStorage.getSets();
  let currentSet = sets.find(s => s.id === setId) || sets[0];
  if (!currentSet) {
    currentSet = { id: 'empty', title: 'Empty Set', description: '', subject: 'Other', createdAt: Date.now(), cards: [] };
    sets.push(currentSet);
    window.SFStorage.saveSets(sets);
  }

  // DOM elements
  const titleEl = document.getElementById('set-title');
  const countEl = document.getElementById('card-count');
  const progressLabel = document.getElementById('progress-label');
  const progressBar = document.getElementById('progress-bar');
  const fillEl = progressBar ? progressBar.querySelector('.fill') : null;
  const flashcard = document.getElementById('flashcard');
  const inner = document.getElementById('flashcard-inner');
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  const btnFlip = document.getElementById('btn-flip');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnShuffle = document.getElementById('btn-shuffle');
  const sessionCountEl = document.getElementById('session-count');
  const createForm = document.getElementById('create-card-form');
  const inputTerm = document.getElementById('input-term');
  const inputDef = document.getElementById('input-definition');

  // Mode sections
  const flashContainer = document.getElementById('flash-container');
  const flashCreate = document.getElementById('flash-create');
  const flashProgress = document.getElementById('flash-progress');
  const quizSection = document.getElementById('quiz-section');
  const memorySection = document.getElementById('matching-section');
  const modeButtons = document.querySelectorAll('[data-mode]');

  let currentIndex = 0;
  let showBack = false;
  let sessionStudied = 0;
  let sessionStart = Date.now();

  function renderCard() {
    const total = (currentSet.cards || []).length;
    if (titleEl) titleEl.textContent = currentSet.title || 'Study';
    if (countEl) countEl.textContent = String(total);
    if (total === 0) {
      if (front) front.textContent = 'No cards yet. Add one below!';
      if (back) back.textContent = '';
      if (progressLabel) progressLabel.textContent = 'No cards';
      if (fillEl) fillEl.style.width = '0%';
      progressBar && progressBar.setAttribute('aria-valuenow', '0');
      return;
    }
    const card = currentSet.cards[currentIndex];
    if (front) front.textContent = card.term;
    if (back) back.textContent = card.definition;
    if (progressLabel) progressLabel.textContent = `Card ${currentIndex + 1} of ${total}`;
    const pct = Math.round(((currentIndex + 1) / total) * 100);
    if (fillEl) fillEl.style.width = `${pct}%`;
    progressBar && progressBar.setAttribute('aria-valuenow', String(pct));
  }

  function flip() {
    showBack = !showBack;
    if (flashcard) flashcard.classList.toggle('flipped', showBack);
  }

  function next() {
    if (!currentSet.cards.length) return;
    currentIndex = (currentIndex + 1) % currentSet.cards.length;
    showBack = false; flashcard && flashcard.classList.remove('flipped');
    renderCard();
    sessionStudied++;
    if (sessionCountEl) sessionCountEl.textContent = String(sessionStudied);
    window.SFStorage.incrementCardsStudied(1);
    window.SFAchievements.checkProgressAchievements();
  }

  function prev() {
    if (!currentSet.cards.length) return;
    currentIndex = (currentIndex - 1 + currentSet.cards.length) % currentSet.cards.length;
    showBack = false; flashcard && flashcard.classList.remove('flipped');
    renderCard();
  }

  function shuffle() {
    const array = currentSet.cards;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    currentIndex = 0;
    showBack = false; flashcard && flashcard.classList.remove('flipped');
    window.SFStorage.saveSets(sets);
    // Add shuffle animation
    if (flashcard) {
      flashcard.classList.add('shuffle-anim');
      setTimeout(() => flashcard.classList.remove('shuffle-anim'), 450);
    }
    renderCard();
  }

  // Keyboard accessibility
  if (flashcard) {
    flashcard.addEventListener('click', flip);
    flashcard.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key.toLowerCase() === 'enter') { e.preventDefault(); flip(); }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  btnFlip && btnFlip.addEventListener('click', flip);
  btnNext && btnNext.addEventListener('click', next);
  btnPrev && btnPrev.addEventListener('click', prev);
  btnShuffle && btnShuffle.addEventListener('click', shuffle);

  // Create card form
  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const term = String(inputTerm && inputTerm.value || '').trim();
      const definition = String(inputDef && inputDef.value || '').trim();
      if (!term || !definition) return;
      const newCard = { term, definition };
      currentSet.cards.push(newCard);
      window.SFStorage.saveSets(sets);
      inputTerm && (inputTerm.value = '');
      inputDef && (inputDef.value = '');
      currentIndex = currentSet.cards.length - 1;
      renderCard();
    });
  }

  // Reset progress button
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (!confirm('Reset total progress and achievements?')) return;
      // Reset stats and achievements
      localStorage.removeItem(window.SFStorage.STORAGE_KEYS.stats);
      localStorage.removeItem(window.SFStorage.STORAGE_KEYS.achievements);
      window.SFStorage.initDefaults();
      // Visual feedback
      btnReset.classList.add('press');
      setTimeout(() => btnReset.classList.remove('press'), 150);
    });
  }

  // Track session time on unload
  window.addEventListener('beforeunload', () => {
    const minutes = Math.max(0, Math.round((Date.now() - sessionStart) / 60000));
    if (minutes > 0) window.SFStorage.addStudyMinutes(minutes);
  });

  // Study mode switching
  function setModeButtonState(mode) {
    modeButtons.forEach((b) => {
      const isActive = b.getAttribute('data-mode') === mode;
      b.setAttribute('aria-pressed', String(isActive));
      if (isActive) b.classList.remove('secondary'); else b.classList.add('secondary');
    });
  }

  function show(el) { el && el.removeAttribute('hidden'); }
  function hide(el) { el && el.setAttribute('hidden', ''); }

  function switchMode(mode) {
    if (mode === 'flashcards') {
      show(flashContainer); show(flashCreate); show(flashProgress);
      hide(quizSection); hide(memorySection);
      setModeButtonState('flashcards');
      // focus main flashcard for keyboard control
      flashcard && flashcard.focus && flashcard.focus();
      return;
    }
    if (mode === 'quiz') {
      hide(flashContainer); hide(flashCreate); hide(flashProgress);
      hide(memorySection); show(quizSection);
      setModeButtonState('quiz');
      if (window.SFStudyQuiz && window.SFStudyQuiz.startQuiz) window.SFStudyQuiz.startQuiz();
      return;
    }
    if (mode === 'matching') {
      hide(flashContainer); hide(flashCreate); hide(flashProgress);
      hide(quizSection); show(memorySection);
      setModeButtonState('matching');
      if (window.SFStudyMatching && window.SFStudyMatching.start) window.SFStudyMatching.start();
      return;
    }
  }

  modeButtons.forEach((btn) => btn.addEventListener('click', () => switchMode(btn.getAttribute('data-mode'))));

  // expose for other modules
  window.switchMode = switchMode;

  // Initial render (and default mode is flashcards)
  renderCard();
  switchMode('flashcards');
})();


