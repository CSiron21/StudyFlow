// Achievement helpers

function unlockAchievement(id) {
  const list = window.SFStorage.getAchievements();
  const idx = list.findIndex(a => a.id === id);
  if (idx === -1) return false;
  if (!list[idx].unlockedAt) {
    list[idx].unlockedAt = Date.now();
    window.SFStorage.saveAchievements(list);
    announceAchievement(list[idx]);
    return true;
  }
  return false;
}

function announceAchievement(a) {
  // Simple toast-like announcement for accessibility
  let region = document.getElementById('sf-live-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'sf-live-region';
    region.className = 'visually-hidden';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }
  region.textContent = `Achievement unlocked: ${a.title}`;

  // Visual toast
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-label', `Achievement unlocked: ${a.title}`);
  toast.innerHTML = `<strong>🎉 ${a.title}</strong><div class="muted">${a.description}</div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function checkProgressAchievements() {
  const stats = window.SFStorage.getStats();
  if ((stats.totalCardsStudied || 0) >= 1) unlockAchievement('first-session');
  if ((stats.totalCardsStudied || 0) >= 10) unlockAchievement('ten-reviewed');
}

function checkCreatorAchievement() {
  const stats = window.SFStorage.getStats();
  if ((stats.setsCreated || 0) >= 1) unlockAchievement('creator');
}

// Merge new catalog entries into existing without overwriting unlockedAt
function ensureCatalog() {
  const base = window.SFStorage.getAchievements();
  const map = new Map(base.map(a => [a.id, a]));
  const catalog = [
    // Existing
    { id: 'first-session', title: 'First Study Session', description: 'Complete your first card review' },
    { id: 'ten-reviewed', title: '10 Cards Reviewed', description: 'Review 10 cards total' },
    { id: 'creator', title: 'Creator', description: 'Create your first study set' },
    // Streaks
    { id: 'streak-3', title: '3-Day Streak', description: 'Study 3 days in a row' },
    { id: 'streak-7', title: '7-Day Streak', description: 'Study 7 days in a row' },
    { id: 'streak-14', title: '14-Day Streak', description: 'Study 14 days in a row' },
    { id: 'streak-30', title: '30-Day Streak', description: 'Study 30 days in a row' },
    // Sets created
    { id: 'created-5', title: 'Rising Creator', description: 'Create 5 study sets' },
    { id: 'created-10', title: 'Prolific Creator', description: 'Create 10 study sets' },
    { id: 'created-20', title: 'Curator', description: 'Create 20 study sets' },
    // Cards studied
    { id: 'cards-50', title: 'Learner I', description: 'Study 50 cards' },
    { id: 'cards-100', title: 'Learner II', description: 'Study 100 cards' },
    { id: 'cards-250', title: 'Scholar I', description: 'Study 250 cards' },
    { id: 'cards-500', title: 'Scholar II', description: 'Study 500 cards' },
    // Quiz performance (based on avg score)
    { id: 'quiz-80', title: 'Quiz Achiever', description: 'Average score 80% or higher' },
    { id: 'quiz-90', title: 'Quiz Expert', description: 'Average score 90% or higher' },
    { id: 'quiz-100', title: 'Quiz Master', description: 'Average score 100%' },
  ];
  catalog.forEach(c => { if (!map.has(c.id)) map.set(c.id, c); });
  window.SFStorage.saveAchievements(Array.from(map.values()));
}

function checkAll() {
  const stats = window.SFStorage.getStats();
  const cards = stats.totalCardsStudied || 0;
  const streak = stats.studyStreakDays || 0;
  const created = stats.setsCreated || 0;
  // Cards
  if (cards >= 1) unlockAchievement('first-session');
  if (cards >= 10) unlockAchievement('ten-reviewed');
  if (cards >= 50) unlockAchievement('cards-50');
  if (cards >= 100) unlockAchievement('cards-100');
  if (cards >= 250) unlockAchievement('cards-250');
  if (cards >= 500) unlockAchievement('cards-500');
  // Streaks
  if (streak >= 3) unlockAchievement('streak-3');
  if (streak >= 7) unlockAchievement('streak-7');
  if (streak >= 14) unlockAchievement('streak-14');
  if (streak >= 30) unlockAchievement('streak-30');
  // Created
  if (created >= 1) unlockAchievement('creator');
  if (created >= 5) unlockAchievement('created-5');
  if (created >= 10) unlockAchievement('created-10');
  if (created >= 20) unlockAchievement('created-20');
  // Quiz performance via average
  try {
    const qs = JSON.parse(localStorage.getItem('studyflow_quiz_stats') || '{}');
    const avg = Number(qs.avgScore || 0);
    if (avg >= 80) unlockAchievement('quiz-80');
    if (avg >= 90) unlockAchievement('quiz-90');
    if (avg >= 100) unlockAchievement('quiz-100');
  } catch {}
}

window.SFAchievements = {
  unlockAchievement,
  checkProgressAchievements,
  checkCreatorAchievement,
  ensureCatalog,
  checkAll,
};


