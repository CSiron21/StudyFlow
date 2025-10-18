// Memory Game implementation
// - Pairs are term and definition
// - Tracks attempts and time; saves aggregate stats under studyflow_memory_stats

(function () {
  const memSection = document.getElementById('memory-section');
  if (!memSection) return;

  const KEY = 'studyflow_memory_stats';
  function getMemStats() { try { return JSON.parse(localStorage.getItem(KEY)) || { memoryGamesPlayed: 0, totalAttempts: 0, totalTimeSec: 0, avgAttempts: 0, bestTime: null }; } catch { return { memoryGamesPlayed: 0, totalAttempts: 0, totalTimeSec: 0, avgAttempts: 0, bestTime: null }; } }
  function saveMemStats(stats) { try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch {} }

  let sets = window.SFStorage.getSets();
  let params = new URLSearchParams(location.search);
  let setId = params.get('set');
  let currentSet = sets.find(s => s.id === setId) || sets[0];
  if (!currentSet) return;

  const grid = document.getElementById('memory-grid');
  const attemptsEl = document.getElementById('mem-attempts');
  const matchedEl = document.getElementById('mem-matched');
  const timerEl = document.getElementById('mem-timer');
  const modal = document.getElementById('memory-modal');
  const summary = document.getElementById('memory-summary');
  const playAgain = document.getElementById('mem-play-again');
  const back = document.getElementById('mem-back');

  let cards = [];
  let firstPick = null;
  let secondPick = null;
  let lockBoard = false;
  let attempts = 0;
  let matches = 0;
  let startTime = 0;
  let timerId = null;

  function startTimer() {
    startTime = Date.now();
    timerId = setInterval(() => updateTimer(), 1000);
    updateTimer();
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
  function updateTimer() {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
  }

  function shuffle(arr) { const a = [...arr]; for (let i=a.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function buildDeck() {
    const base = (currentSet.cards || []).filter(c => c.term && c.definition);
    const sample = shuffle(base).slice(0, Math.min(8, base.length)); // up to 8 pairs for pace
    const deck = [];
    for (const c of sample) {
      deck.push({ id: c.term + '|Q', key: c.term, type: 'q', label: c.term });
      deck.push({ id: c.term + '|A', key: c.term, type: 'a', label: c.definition });
    }
    return shuffle(deck);
  }

  function renderGrid() {
    grid.innerHTML = '';
    cards = buildDeck();
    attempts = 0; matches = 0; firstPick = null; secondPick = null; lockBoard = false;
    attemptsEl.textContent = '0';
    matchedEl.textContent = '0';
    // Build dom
    const frag = document.createDocumentFragment();
    cards.forEach((c, idx) => {
      const cell = document.createElement('button');
      cell.className = 'memory-card';
      cell.setAttribute('data-key', c.key);
      cell.setAttribute('data-type', c.type);
      cell.setAttribute('aria-label', 'Memory card');
      cell.innerHTML = `<div class="inner"><div class="face front">?</div><div class="face back">${escapeHtml(c.label)}</div></div>`;
      cell.addEventListener('click', () => onPick(cell));
      cell.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'enter' || e.key === ' ') { e.preventDefault(); onPick(cell); } });
      frag.appendChild(cell);
    });
    grid.appendChild(frag);
  }

  function onPick(cell) {
    if (lockBoard) return;
    if (cell.classList.contains('matched') || cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    if (!firstPick) { firstPick = cell; return; }
    if (cell === firstPick) return; // same cell
    secondPick = cell; lockBoard = true; attempts += 1; attemptsEl.textContent = String(attempts);
    const isMatch = firstPick.getAttribute('data-key') === secondPick.getAttribute('data-key') && firstPick.getAttribute('data-type') !== secondPick.getAttribute('data-type');
    if (isMatch) {
      firstPick.classList.add('matched');
      secondPick.classList.add('matched');
      matches += 1; matchedEl.textContent = String(matches);
      resetTurn();
      checkWin();
    } else {
      setTimeout(() => {
        firstPick.classList.remove('revealed');
        secondPick.classList.remove('revealed');
        resetTurn();
      }, 1000);
    }
  }

  function resetTurn() { firstPick = null; secondPick = null; lockBoard = false; }

  function checkWin() {
    const totalPairs = Math.floor(cards.length / 2);
    if (matches >= totalPairs) {
      stopTimer();
      const sec = Math.floor((Date.now() - startTime) / 1000);
      summary.textContent = `Attempts: ${attempts} • Time: ${formatTime(sec)}`;
      modal.removeAttribute('hidden');
      // Save stats
      const s = getMemStats();
      s.memoryGamesPlayed += 1;
      s.totalAttempts += attempts;
      s.totalTimeSec += sec;
      s.avgAttempts = s.memoryGamesPlayed ? Math.round(s.totalAttempts / s.memoryGamesPlayed) : 0;
      s.bestTime = (s.bestTime == null) ? sec : Math.min(s.bestTime, sec);
      saveMemStats(s);
    }
  }

  function formatTime(sec) { const m = String(Math.floor(sec/60)).padStart(2,'0'); const s = String(sec%60).padStart(2,'0'); return `${m}:${s}`; }
  function escapeHtml(str) { return String(str).replace(/[&<>"]|'/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m])); }

  function startMemory() {
    memSection.removeAttribute('hidden');
    modal.setAttribute('hidden', '');
    renderGrid();
    stopTimer();
    startTimer();
  }

  playAgain.addEventListener('click', startMemory);
  back.addEventListener('click', () => switchMode('flashcards'));

  // mode switch hook from flashcards.js
  window.SFStudyMemory = { startMemory };
})();


