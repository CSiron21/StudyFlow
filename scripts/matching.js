// Matching Type Quiz
// - Column A terms; Column B definitions (shuffled)
// - Select one from each; check correctness; lock correct pairs

(function () {
  const section = document.getElementById('matching-section');
  if (!section) return;
  const termsEl = document.getElementById('match-terms');
  const defsEl = document.getElementById('match-defs');
  const statusEl = document.getElementById('match-status');
  const emptyEl = document.getElementById('match-empty');
  const progressEl = document.getElementById('match-progress');

  let sets = window.SFStorage.getSets();
  const params = new URLSearchParams(location.search);
  const setId = params.get('set');
  let currentSet = sets.find(s => s.id === setId) || sets[0];
  if (!currentSet) return;

  let pairs = [];
  let remaining = 0;
  let selectedTermId = null;
  let selectedDefId = null;

  function shuffle(a) { const x = [...a]; for (let i=x.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }

  function render() {
    const cards = (currentSet.cards || []).filter(c => c.term && c.definition);
    if (cards.length === 0) {
      emptyEl.removeAttribute('hidden');
      termsEl.innerHTML = '';
      defsEl.innerHTML = '';
      progressEl.textContent = '';
      return;
    }
    emptyEl.setAttribute('hidden', '');
    pairs = cards.map((c, i) => ({ id: 'p' + i, term: c.term, def: c.definition, locked: false }));
    remaining = pairs.length;
    selectedTermId = null; selectedDefId = null;
    progressEl.textContent = `${pairs.length - remaining}/${pairs.length} matched`;

    // Render terms
    termsEl.innerHTML = pairs.map(p => `
      <button class="match-item" data-id="${p.id}" data-type="term" aria-selected="false"><span class="match-text">${escapeHtml(p.term)}</span></button>
    `).join('');

    // Render definitions shuffled
    const defs = shuffle(pairs).map(p => ({ id: p.id, text: p.def }));
    defsEl.innerHTML = defs.map(d => `
      <button class="match-item" data-id="${d.id}" data-type="def" aria-selected="false"><span class="match-text">${escapeHtml(d.text)}</span></button>
    `).join('');

    attachHandlers();
  }

  function attachHandlers() {
    section.addEventListener('click', onClick);
  }

  function onClick(e) {
    const item = e.target.closest('.match-item');
    if (!item) return;
    if (item.classList.contains('correct')) return; // already locked
    const type = item.getAttribute('data-type');
    const id = item.getAttribute('data-id');

    // Toggle selection state
    if (type === 'term') {
      clearSelection('term');
      item.setAttribute('aria-selected', 'true');
      selectedTermId = id;
    } else if (type === 'def') {
      clearSelection('def');
      item.setAttribute('aria-selected', 'true');
      selectedDefId = id;
    }

    // If both selected, evaluate
    if (selectedTermId && selectedDefId) {
      evaluateMatch();
    }
  }

  function clearSelection(type) {
    const list = section.querySelectorAll(`.match-item[data-type="${type}"]`);
    list.forEach(el => el.setAttribute('aria-selected', 'false'));
  }

  function evaluateMatch() {
    const termEl = section.querySelector(`.match-item[data-type="term"][data-id="${selectedTermId}"]`);
    const defEl = section.querySelector(`.match-item[data-type="def"][data-id="${selectedDefId}"]`);
    const isCorrect = selectedTermId === selectedDefId;
    if (isCorrect) {
      termEl.classList.add('correct');
      defEl.classList.add('correct');
      termEl.setAttribute('aria-selected', 'false');
      defEl.setAttribute('aria-selected', 'false');
      selectedTermId = null; selectedDefId = null;
      remaining -= 1;
      progressEl.textContent = `${pairs.length - remaining}/${pairs.length} matched`;
      statusEl.textContent = 'Correct match!';
      if (remaining <= 0) {
        statusEl.textContent = 'All matched correctly!';
      }
    } else {
      termEl.classList.add('incorrect');
      defEl.classList.add('incorrect');
      statusEl.textContent = 'Incorrect match. Try again.';
      setTimeout(() => {
        termEl.classList.remove('incorrect');
        defEl.classList.remove('incorrect');
        // keep selections cleared to allow a new pick
        termEl.setAttribute('aria-selected', 'false');
        defEl.setAttribute('aria-selected', 'false');
        selectedTermId = null; selectedDefId = null;
      }, 700);
    }
  }

  function escapeHtml(str) { return String(str).replace(/[&<>"]|'|`/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[m])); }

  // hook for switching
  window.SFStudyMatching = { start: () => { section.removeAttribute('hidden'); render(); } };
})();


