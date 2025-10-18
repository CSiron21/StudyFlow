// Discover page handlers: edit and delete study sets

(function () {
  const modal = document.getElementById('edit-modal');
  if (!modal) return;
  const inputTitle = document.getElementById('edit-title');
  const inputSubject = document.getElementById('edit-subject');
  const inputDesc = document.getElementById('edit-description');
  const btnSave = document.getElementById('edit-save');
  const btnCancel = document.getElementById('edit-cancel');
  const cardsContainer = document.getElementById('edit-cards');
  const btnAddCard = document.getElementById('edit-add-card');
  let editingId = null;
  let workingCards = [];

  function openModal(set) {
    editingId = set.id;
    inputTitle.value = set.title || '';
    inputSubject.value = set.subject || 'General';
    inputDesc.value = set.description || '';
    workingCards = Array.isArray(set.cards) ? set.cards.map(c => ({ term: c.term || '', definition: c.definition || '' })) : [];
    renderCards();
    modal.removeAttribute('hidden');
    inputTitle.focus();
  }
  function closeModal() { modal.setAttribute('hidden', ''); editingId = null; }

  btnCancel.addEventListener('click', closeModal);
  btnAddCard.addEventListener('click', () => {
    workingCards.push({ term: '', definition: '' });
    renderCards();
  });
  btnSave.addEventListener('click', () => {
    const title = (inputTitle.value || '').trim();
    if (!title) { alert('Title cannot be empty.'); inputTitle.focus(); return; }
    const subject = inputSubject.value || 'General';
    const description = (inputDesc.value || '').trim();
    // Validate cards
    for (let i = 0; i < workingCards.length; i++) {
      const c = workingCards[i];
      if (!c.term.trim() || !c.definition.trim()) { alert('All cards must have term and definition.'); return; }
    }
    const sets = window.SFStorage.getSets();
    const i = sets.findIndex(s => s.id === editingId);
    if (i === -1) { closeModal(); return; }
    sets[i] = { ...sets[i], title, subject, description, cards: workingCards.map(c => ({ term: c.term.trim(), definition: c.definition.trim() })) };
    window.SFStorage.saveSets(sets);
    closeModal();
    toast('Study set updated successfully.');
    // re-render via inline render() in page scope
    if (window.renderDiscover) window.renderDiscover();
  });

  function toast(message) {
    const t = document.createElement('div');
    t.className = 'achievement-toast show';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 1800);
  }

  function onActionClick(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    const sets = window.SFStorage.getSets();
    const set = sets.find(s => s.id === id);
    if (!set) return;
    if (action === 'delete') {
      if (!confirm('Are you sure you want to delete this set?')) return;
      const next = sets.filter(s => s.id !== id);
      window.SFStorage.saveSets(next);
      toast('Study set deleted successfully.');
      if (window.renderDiscover) window.renderDiscover();
    } else if (action === 'edit') {
      openModal(set);
    }
  }

  function attachHandlers() {
    document.getElementById('results')?.addEventListener('click', onActionClick);
  }

  window.SFDiscover = { attachHandlers };

  function renderCards() {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = workingCards.map((c, idx) => {
      return `
        <div class="panel" data-idx="${idx}">
          <div class="grid cols-2">
            <label>Term<input type="text" class="card-term" value="${escapeHtml(c.term)}" style="width:100%; padding:12px; border:1px solid #e9d5ff; border-radius:12px;" /></label>
            <label>Definition<input type="text" class="card-def" value="${escapeHtml(c.definition)}" style="width:100%; padding:12px; border:1px solid #e9d5ff; border-radius:12px;" /></label>
          </div>
          <div style="margin-top:8px; display:flex; gap:8px; justify-content:flex-end;">
            <button type="button" class="btn secondary btn-del-card" aria-label="Delete card">Delete</button>
          </div>
        </div>`;
    }).join('');
    // Wire inputs and delete buttons
    Array.from(cardsContainer.querySelectorAll('.panel')).forEach((panelEl) => {
      const idx = Number(panelEl.getAttribute('data-idx'));
      const termInput = panelEl.querySelector('.card-term');
      const defInput = panelEl.querySelector('.card-def');
      termInput.addEventListener('input', (e) => { workingCards[idx].term = e.target.value; });
      defInput.addEventListener('input', (e) => { workingCards[idx].definition = e.target.value; });
      const delBtn = panelEl.querySelector('.btn-del-card');
      delBtn.addEventListener('click', () => {
        if (!confirm('Delete this card?')) return;
        workingCards.splice(idx, 1);
        renderCards();
      });
    });
  }

  function escapeHtml(str) { return String(str).replace(/[&<>"]|'|`/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[m])); }
})();


