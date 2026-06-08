/**
 * CarbonLens — Badges & Gamification System
 *
 * Defines badges, levels, and streak logic to keep users
 * motivated in their carbon reduction journey.
 *
 * @module badges
 */

/**
 * Badge definitions with unlock criteria.
 *
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   description: string,
 *   icon: string,
 *   category: string,
 *   condition: function
 * }>}
 */
export const BADGES = [
  {
    id: 'first-scan',
    name: 'First Steps',
    description: 'Complete your first carbon footprint calculation',
    icon: '🌱',
    category: 'milestone',
    condition: (stats) => stats.totalScans >= 1,
  },
  {
    id: 'second-scan',
    name: 'Committed',
    description: 'Calculate your footprint for a second time',
    icon: '📊',
    category: 'milestone',
    condition: (stats) => stats.totalScans >= 2,
  },
  {
    id: 'streak-3',
    name: 'Streak Starter',
    description: 'Track your footprint 3 months in a row',
    icon: '🔥',
    category: 'streak',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak-6',
    name: 'Streak Master',
    description: 'Track your footprint 6 months in a row',
    icon: '⚡',
    category: 'streak',
    condition: (stats) => stats.currentStreak >= 6,
  },
  {
    id: 'below-average',
    name: 'Below Average',
    description: 'Your footprint is below the global average',
    icon: '🌿',
    category: 'achievement',
    condition: (stats) => stats.latestTotal < 383,
  },
  {
    id: 'half-average',
    name: 'Half Way There',
    description: 'Your footprint is less than half the global average',
    icon: '🏆',
    category: 'achievement',
    condition: (stats) => stats.latestTotal < 191,
  },
  {
    id: 'paris-2030',
    name: 'Paris 2030',
    description: 'Meet the Paris Agreement 2030 per-capita target',
    icon: '🌍',
    category: 'achievement',
    condition: (stats) => stats.latestTotal <= 208,
  },
  {
    id: 'reduction-10',
    name: 'First Cut',
    description: 'Reduce your footprint by 10% from your first scan',
    icon: '✂️',
    category: 'reduction',
    condition: (stats) =>
      stats.totalScans >= 2 &&
      stats.latestTotal < stats.firstTotal * 0.9,
  },
  {
    id: 'reduction-25',
    name: 'Quarter Down',
    description: 'Reduce your footprint by 25% from your first scan',
    icon: '📉',
    category: 'reduction',
    condition: (stats) =>
      stats.totalScans >= 2 &&
      stats.latestTotal < stats.firstTotal * 0.75,
  },
  {
    id: 'reduction-50',
    name: 'Half Footprint',
    description: 'Reduce your footprint by 50% from your first scan',
    icon: '🌟',
    category: 'reduction',
    condition: (stats) =>
      stats.totalScans >= 2 &&
      stats.latestTotal < stats.firstTotal * 0.5,
  },
  {
    id: 'action-hero',
    name: 'Action Hero',
    description: 'Complete 5 recommended actions',
    icon: '💪',
    category: 'actions',
    condition: (stats) => stats.completedActions >= 5,
  },
  {
    id: 'action-champion',
    name: 'Action Champion',
    description: 'Complete 15 recommended actions',
    icon: '🏅',
    category: 'actions',
    condition: (stats) => stats.completedActions >= 15,
  },
  {
    id: 'simulator-explorer',
    name: 'What-If Explorer',
    description: 'Use the What-If Simulator for the first time',
    icon: '🔮',
    category: 'engagement',
    condition: (stats) => stats.simulatorUsed,
  },
  {
    id: 'data-exporter',
    name: 'Data Keeper',
    description: 'Export your footprint data',
    icon: '📤',
    category: 'engagement',
    condition: (stats) => stats.dataExported,
  },
];

/**
 * Level definitions based on cumulative positive actions.
 *
 * @type {Array<{level: number, name: string, minPoints: number, icon: string}>}
 */
export const LEVELS = [
  { level: 1, name: 'Seedling', minPoints: 0, icon: '🌱' },
  { level: 2, name: 'Sprout', minPoints: 50, icon: '🌿' },
  { level: 3, name: 'Sapling', minPoints: 150, icon: '🌳' },
  { level: 4, name: 'Tree', minPoints: 300, icon: '🌲' },
  { level: 5, name: 'Forest', minPoints: 500, icon: '🏔️' },
  { level: 6, name: 'Guardian', minPoints: 800, icon: '🌍' },
  { level: 7, name: 'Champion', minPoints: 1200, icon: '🌟' },
  { level: 8, name: 'Legend', minPoints: 2000, icon: '🏆' },
];

/**
 * Check which badges are unlocked based on current stats.
 *
 * @param {Object} stats - User statistics
 * @param {number} stats.totalScans - Total calculations done
 * @param {number} stats.currentStreak - Consecutive months tracked
 * @param {number} stats.latestTotal - Latest monthly total
 * @param {number} stats.firstTotal - First ever monthly total
 * @param {number} stats.completedActions - Actions completed
 * @param {boolean} stats.simulatorUsed - Whether simulator was used
 * @param {boolean} stats.dataExported - Whether data was exported
 * @returns {Array<string>} Array of unlocked badge IDs
 */
export function checkBadges(stats) {
  if (!stats) return [];

  return BADGES.filter((badge) => {
    try {
      return badge.condition(stats);
    } catch {
      return false;
    }
  }).map((badge) => badge.id);
}

/**
 * Get the current level based on points.
 *
 * @param {number} points - User's total points
 * @returns {{current: Object, next: Object|null, progress: number}}
 */
export function getCurrentLevel(points) {
  let current = LEVELS[0];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      current = LEVELS[i];
      break;
    }
  }

  const nextIndex = LEVELS.findIndex((l) => l.level === current.level + 1);
  const next = nextIndex >= 0 ? LEVELS[nextIndex] : null;

  const progress = next
    ? ((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100
    : 100;

  return {
    current,
    next,
    progress: Math.min(100, Math.max(0, Math.round(progress))),
  };
}

/**
 * Calculate points earned from badges, scans, and actions.
 *
 * @param {Object} stats - User statistics
 * @returns {number} Total points
 */
export function calculatePoints(stats) {
  if (!stats) return 0;

  let points = 0;

  // Points per scan
  points += (stats.totalScans || 0) * 10;

  // Points per completed action
  points += (stats.completedActions || 0) * 15;

  // Points per badge
  const unlockedBadges = checkBadges(stats);
  points += unlockedBadges.length * 25;

  // Streak bonus
  points += (stats.currentStreak || 0) * 20;

  return points;
}

/**
 * Calculate streak from snapshot dates.
 *
 * @param {Array<string>} dates - Array of ISO date strings (one per month snapshot)
 * @returns {number} Current consecutive monthly streak
 */
export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;

  // Sort dates descending
  const sorted = [...dates]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const previous = sorted[i + 1];

    // Check if the previous date is within the prior month
    const diffMonths =
      (current.getFullYear() - previous.getFullYear()) * 12 +
      (current.getMonth() - previous.getMonth());

    if (diffMonths === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
