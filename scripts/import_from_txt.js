// Import from .txt file to create a new study set
// - Expected format per line: TERM, DEFINITION


(function () {
  const upload = document.getElementById('txt-upload');
  const btn = document.getElementById('btn-import');
  const feedback = document.getElementById('import-feedback');
  if (!upload || !btn) return;

  function showFeedback(msg, isWarn) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.style.color = isWarn ? '#b91c1c' : 'var(--text-light)';
  }

  function toast(message, isError) {
    if (isError) {
      // Keep existing lightweight error toast style for failures
      const t = document.createElement('div');
      t.className = 'achievement-toast';
      t.textContent = message;
      t.style.borderColor = '#fecdd3';
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2200);
      return;
    }
    // Use global success toast for success states; no duplicates due to reuse
    if (window.SFUI && typeof window.SFUI.showSuccessMessage === 'function') {
      window.SFUI.showSuccessMessage('Imported study set successfully!');
    }
  }

  btn.addEventListener('click', () => {
    const file = upload.files && upload.files[0];
    if (!file) { showFeedback('Please choose a .txt file first.', true); return; }
    if (!/\.txt$/i.test(file.name)) { showFeedback('Only .txt files are supported.', true); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      // If file is essentially empty, treat as failure
      if (!text || !text.trim()) { showFeedback('Failed to import file. Please try again.', true); alert('Conversion failed. The file is empty or unreadable.'); return; }

      const lines = text.split(/\r?\n/);
      const cards = [];
      let skipped = 0;
      for (let raw of lines) {
        if (!raw || !raw.trim()) { continue; }
        const idx = raw.indexOf(',');
        if (idx === -1) { skipped++; continue; }
        let term = raw.slice(0, idx).trim();
        let definition = raw.slice(idx + 1).trim();
        if (!term || !definition) { skipped++; continue; }
        cards.push({ term, definition });
      }
      if (cards.length === 0) { showFeedback('No valid lines found in the file.', true); toast('Conversion failed: no valid lines found.', true); alert('Conversion failed: no valid lines found.'); return; }

      // Pull metadata if present
      const titleInput = document.getElementById('set-title');
      const subjectSelect = document.getElementById('set-subject');
      const descInput = document.getElementById('set-description');
      const titleVal = titleInput && titleInput.value.trim();
      const subjectVal = subjectSelect && subjectSelect.value.trim();
      const descVal = descInput && descInput.value.trim();

      const title = titleVal || `Imported Set - ${new Date().toLocaleString()}`;
      const subject = subjectVal || 'General';
      const description = descVal || 'Imported from text file';

      const sets = window.SFStorage.getSets();
      const newSet = {
        id: 'set-' + Date.now(),
        title,
        subject,
        description,
        createdAt: Date.now(),
        dateCreated: new Date().toISOString(),
        cards,
      };
      sets.unshift(newSet);
      window.SFStorage.saveSets(sets);
      window.SFStorage.incrementSetsCreated();
      window.SFAchievements.checkCreatorAchievement();

      let msg = `Study set '${title}' created successfully with ${cards.length} cards.`;
      if (skipped > 0) msg += ` ${skipped} line(s) were skipped due to format issues.`;
      showFeedback(msg, false);
      toast('success');
      // Blocking confirmation box for visibility and optional navigation
      const go = window.confirm(`${msg}\n\nOpen this set now?`);
      if (go) location.href = `study.html?set=${encodeURIComponent(newSet.id)}`;
    };
    reader.onerror = () => { showFeedback('Failed to import file. Please try again.', true); toast('Conversion failed. Please try again.', true); alert('Conversion failed. Please try again.'); };
    try {
      reader.readAsText(file);
    } catch (_) {
      showFeedback('Failed to import file. Please try again.', true);
      toast('Conversion failed. Please try again.', true);
      alert('Conversion failed. Please try again.');
    }
  });
})();


