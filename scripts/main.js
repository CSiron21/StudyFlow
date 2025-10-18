// Main JS bootstrapping common UI and home stats rendering

(function () {
  window.SFStorage.initDefaults();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());


  // Highlight current nav link based on location
  const path = location.pathname.toLowerCase();
  const links = document.querySelectorAll('.nav-link, .mobile-nav a');
  links.forEach((a) => {
    try {
      const href = a.getAttribute('href') || '';
      const isIndex = path.endsWith('/') || path.endsWith('index.html');
      const target = href.toLowerCase();
      const match = (isIndex && target.includes('home.html')) || path.endsWith(target);
      if (match) a.setAttribute('aria-current', 'page');
    } catch (_) {}
  });

  // Populate home quick stats and recent sets if present
  const stats = window.SFStorage.getStats();
  const sets = window.SFStorage.getSets();
  const streakEl = document.getElementById('stat-streak');
  const timeEl = document.getElementById('stat-time');
  const setsEl = document.getElementById('stat-sets');
  if (streakEl) streakEl.textContent = String(stats.studyStreakDays || 0);
  if (timeEl) timeEl.textContent = `${stats.totalStudyMinutes || 0}m`;
  if (setsEl) setsEl.textContent = String(stats.setsCreated || 0);

  const recentContainer = document.getElementById('recent-sets');
  if (recentContainer) {
    // sort by createdAt desc and render up to 6
    const recent = [...sets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 6);
    recentContainer.innerHTML = recent.map(renderSetCard).join('');
    // Animate cards in
    Array.from(recentContainer.children).forEach((el, i) => {
      el.classList.add('fade-in-up');
      setTimeout(() => el.classList.add('show'), 100 + i * 80);
    });
  }

  // Hero fade-ins
  document.querySelectorAll('.hero .fade-seq').forEach((el, i) => {
    el.classList.add('fade-in-up');
    setTimeout(() => el.classList.add('show'), 100 + i * 120);
  });

  // Press feedback on buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.btn');
    if (!btn) return;
    btn.classList.add('press');
    setTimeout(() => btn.classList.remove('press'), 130);
  });

  // Mobile hamburger drawer
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => drawer.classList.toggle('open'));
    drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.classList.remove('open'); });
  }

  // (Dark mode removed)
})();

function renderSetCard(set) {
  const percent = Math.min(100, Math.round(((set.progress || 0) / 100) * 100));
  const safeTitle = escapeHtml(set.title || 'Untitled');
  const safeDesc = escapeHtml(set.description || '');
  return `
  <article class="panel" aria-label="Study set: ${safeTitle}">
    <header style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px;">
      <h4 style="margin:0; font-weight:800;">${safeTitle}</h4>
      <span class="badge" aria-label="${(set.cards||[]).length} cards">${(set.cards||[]).length} cards</span>
    </header>
    <p class="muted" style="margin-bottom:12px;">${safeDesc}</p>
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
      <div class="fill" style="width:${percent}%"></div>
    </div>
    <div style="margin-top:12px; display:flex; gap:8px;">
      <a class="btn secondary" href="pages/study.html?set=${encodeURIComponent(set.id)}" aria-label="Study ${safeTitle}">Study</a>
    </div>
  </article>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]|'/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
  });
}
// Global success toast utility (reusable)
// Usage: window.SFUI.showSuccessMessage('Created study successfully!')
;(function(){
  const TOAST_ID = 'sf-success-toast';
  function createToastContainer() {
    const el = document.createElement('div');
    el.id = TOAST_ID;
    el.className = 'sf-success-toast';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<span class="icon" aria-hidden="true">✔</span><span class="text"></span><button class="sf-success-close" aria-label="Dismiss notification">×</button>';
    document.body.appendChild(el);
    // Close handler
    el.querySelector('.sf-success-close').addEventListener('click', () => hideToast());
    return el;
  }

  let hideTimer = null;
  function showToast(messageText, durationMs) {
    // Reuse existing toast if present
    const existing = document.getElementById(TOAST_ID) || createToastContainer();
    existing.querySelector('.text').textContent = messageText || '';
    // Cancel any hide timers and show anew
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    requestAnimationFrame(() => existing.classList.add('show'));
    hideTimer = setTimeout(() => hideToast(), Math.max(3000, Math.min(5000, durationMs || 3500)));
  }

  function hideToast() {
    const el = document.getElementById(TOAST_ID);
    if (!el) return;
    el.classList.remove('show');
    // Allow transition to finish
    setTimeout(() => {
      // Keep container for reuse to prevent DOM churn
      // Just clear text to avoid stale content for screen readers
      const text = el.querySelector('.text');
      if (text) text.textContent = '';
    }, 300);
  }

  window.SFUI = window.SFUI || {};
  window.SFUI.showSuccessMessage = function(messageText, options){
    const duration = options && options.durationMs;
    showToast(String(messageText || ''), duration);
  };
})();



