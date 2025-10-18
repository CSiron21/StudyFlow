// Storage utilities for StudyFlow
// - Wraps localStorage with defaults and simple schemas

const STORAGE_KEYS = {
  sets: 'sf_sets',
  sets_mirror: 'studyflow_sets',
  stats: 'sf_stats',
  achievements: 'sf_achievements',
};

function getLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function setLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // ignore quota errors for now
  }
}

function initDefaults() {
  // Study sets: array of {id, title, description, subject, cards:[{term,definition,difficulty?}], createdAt}
  const existingSets = localStorage.getItem(STORAGE_KEYS.sets);
  if (!existingSets) {
    const demo = [
      {
        id: 'demo-bio',
        title: 'Biology Basics',
        description: 'Core terms to get started with biology',
        subject: 'Science',
        createdAt: Date.now(),
        dateCreated: new Date().toISOString(),
        cards: [
          { term: 'Photosynthesis', definition: 'Plants convert light energy to chemical energy', difficulty: 'easy' },
          { term: 'Mitochondria', definition: 'Organelle that produces ATP — “powerhouse of the cell”', difficulty: 'medium' },
          { term: 'Homeostasis', definition: 'Maintaining internal stability', difficulty: 'medium' },
        ],
      },
    ];
    setLocalJson(STORAGE_KEYS.sets, demo);
    setLocalJson(STORAGE_KEYS.sets_mirror, demo);
  } else {
    // Ensure mirror key exists for compatibility
    if (!localStorage.getItem(STORAGE_KEYS.sets_mirror)) {
      try { setLocalJson(STORAGE_KEYS.sets_mirror, JSON.parse(existingSets)); } catch { setLocalJson(STORAGE_KEYS.sets_mirror, []); }
    }
  }

  // Stats: { totalCardsStudied, setsCreated, studyStreakDays, lastStudyDateISO, totalStudyMinutes }
  if (!localStorage.getItem(STORAGE_KEYS.stats)) {
    const stats = {
      totalCardsStudied: 0,
      setsCreated: 0,
      studyStreakDays: 0,
      lastStudyDateISO: null,
      totalStudyMinutes: 0,
    };
    setLocalJson(STORAGE_KEYS.stats, stats);
  }

  // Achievements: list of {id, title, description, unlockedAt?}
  if (!localStorage.getItem(STORAGE_KEYS.achievements)) {
    const achievements = [
      { id: 'first-session', title: 'First Study Session', description: 'Complete your first card review' },
      { id: 'ten-reviewed', title: '10 Cards Reviewed', description: 'Review 10 cards total' },
      { id: 'creator', title: 'Creator', description: 'Create your first study set' },
    ];
    setLocalJson(STORAGE_KEYS.achievements, achievements);
  }
}

function getSets() {
  // Prefer primary key; if missing but mirror exists, hydrate
  let sets = getLocalJson(STORAGE_KEYS.sets, null);
  if (!sets) {
    const mirror = getLocalJson(STORAGE_KEYS.sets_mirror, []);
    setLocalJson(STORAGE_KEYS.sets, mirror);
    sets = mirror;
  }
  return Array.isArray(sets) ? sets : [];
}
function saveSets(sets) {
  // Guarantee dateCreated consistency
  const normalized = (sets || []).map((s) => {
    const createdAt = s.createdAt != null ? s.createdAt : Date.now();
    const dateCreated = s.dateCreated || (new Date(createdAt).toISOString());
    return { ...s, createdAt, dateCreated };
  });
  setLocalJson(STORAGE_KEYS.sets, normalized);
  setLocalJson(STORAGE_KEYS.sets_mirror, normalized);
}

function getStats() { return getLocalJson(STORAGE_KEYS.stats, {}); }
function saveStats(stats) { setLocalJson(STORAGE_KEYS.stats, stats); }

function getAchievements() { return getLocalJson(STORAGE_KEYS.achievements, []); }
function saveAchievements(list) { setLocalJson(STORAGE_KEYS.achievements, list); }

// Stats helpers
function incrementCardsStudied(count) {
  const stats = getStats();
  stats.totalCardsStudied = (stats.totalCardsStudied || 0) + count;
  // Handle streak
  const todayISO = new Date().toISOString().slice(0, 10);
  const lastISO = stats.lastStudyDateISO;
  if (!lastISO) {
    stats.studyStreakDays = 1;
  } else {
    const last = new Date(lastISO);
    const today = new Date(todayISO);
    const diffDays = Math.round((today - last) / (1000*60*60*24));
    if (diffDays === 0) {
      // same day, keep
    } else if (diffDays === 1) {
      stats.studyStreakDays = (stats.studyStreakDays || 0) + 1;
    } else if (diffDays > 1) {
      stats.studyStreakDays = 1; // reset
    }
  }
  stats.lastStudyDateISO = todayISO;
  saveStats(stats);
  return stats;
}

function addStudyMinutes(mins) {
  const stats = getStats();
  stats.totalStudyMinutes = (stats.totalStudyMinutes || 0) + mins;
  saveStats(stats);
  return stats;
}

function incrementSetsCreated() {
  const stats = getStats();
  stats.setsCreated = (stats.setsCreated || 0) + 1;
  saveStats(stats);
  return stats;
}

// Export to global scope
window.SFStorage = {
  initDefaults,
  getSets,
  saveSets,
  getStats,
  saveStats,
  getAchievements,
  saveAchievements,
  incrementCardsStudied,
  addStudyMinutes,
  incrementSetsCreated,
  STORAGE_KEYS,
};


