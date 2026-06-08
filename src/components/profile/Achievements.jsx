/**
 * CarbonLens — Achievements Component
 *
 * Displays badges, level progression, streaks, and stats.
 * Provides data export functionality.
 *
 * @module Achievements
 */

import { useApp } from '../../context/AppContext.jsx';
import { BADGES } from '../../utils/badges.js';
import ProgressRing from '../common/ProgressRing.jsx';
import styles from './Achievements.module.css';

/**
 * Achievements and profile page.
 * @returns {JSX.Element}
 */
export default function Achievements() {
  const { state, actions, derived } = useApp();
  const { unlockedBadges } = state;
  const { points, level, stats } = derived;

  const badgeCategories = {
    milestone: { label: 'Milestones', icon: '🏁' },
    streak: { label: 'Streaks', icon: '🔥' },
    achievement: { label: 'Achievements', icon: '🏆' },
    reduction: { label: 'Reductions', icon: '📉' },
    actions: { label: 'Actions', icon: '💪' },
    engagement: { label: 'Engagement', icon: '🎮' },
  };

  // Group badges by category
  const groupedBadges = {};
  for (const badge of BADGES) {
    if (!groupedBadges[badge.category]) {
      groupedBadges[badge.category] = [];
    }
    groupedBadges[badge.category].push(badge);
  }

  return (
    <div className={styles.achievements}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span aria-hidden="true">🏆</span> Achievements
          </h1>
          <p className={styles.subtitle}>
            Track your progress, earn badges, and maintain streaks on your
            sustainability journey.
          </p>
        </header>

        {/* ── Level & Points ───────────────────────────────────── */}
        <div className={styles.levelSection}>
          <div className={`glass-card ${styles.levelCard}`}>
            <ProgressRing
              progress={level.progress}
              size={140}
              strokeWidth={10}
              color="var(--color-green-500)"
              label={`Level ${level.current.level} progress`}
            >
              <span className={styles.levelEmoji} aria-hidden="true">
                {level.current.icon}
              </span>
              <span className={styles.levelNumber}>Lv. {level.current.level}</span>
            </ProgressRing>

            <div className={styles.levelInfo}>
              <h2 className={styles.levelName}>{level.current.name}</h2>
              <p className={styles.levelPoints}>{points} points earned</p>
              {level.next && (
                <p className={styles.levelNext}>
                  {level.next.minPoints - points} points to{' '}
                  <strong>
                    {level.next.icon} {level.next.name}
                  </strong>
                </p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={`glass-card ${styles.statCard}`}>
              <span className={styles.statIcon} aria-hidden="true">🔥</span>
              <span className={styles.statValue}>{stats.currentStreak}</span>
              <span className={styles.statLabel}>Month Streak</span>
            </div>
            <div className={`glass-card ${styles.statCard}`}>
              <span className={styles.statIcon} aria-hidden="true">📊</span>
              <span className={styles.statValue}>{stats.totalScans}</span>
              <span className={styles.statLabel}>Total Scans</span>
            </div>
            <div className={`glass-card ${styles.statCard}`}>
              <span className={styles.statIcon} aria-hidden="true">✅</span>
              <span className={styles.statValue}>{stats.completedActions}</span>
              <span className={styles.statLabel}>Actions Done</span>
            </div>
            <div className={`glass-card ${styles.statCard}`}>
              <span className={styles.statIcon} aria-hidden="true">🏅</span>
              <span className={styles.statValue}>
                {unlockedBadges.length}/{BADGES.length}
              </span>
              <span className={styles.statLabel}>Badges</span>
            </div>
          </div>
        </div>

        {/* ── Badge Grid ───────────────────────────────────────── */}
        <section aria-label="Badges collection">
          {Object.entries(groupedBadges).map(([categoryKey, badges]) => {
            const catMeta = badgeCategories[categoryKey] || {
              label: categoryKey,
              icon: '📦',
            };

            return (
              <div key={categoryKey} className={styles.badgeCategory}>
                <h3 className={styles.categoryTitle}>
                  <span aria-hidden="true">{catMeta.icon}</span> {catMeta.label}
                </h3>

                <div className={styles.badgeGrid}>
                  {badges.map((badge) => {
                    const isUnlocked = unlockedBadges.includes(badge.id);

                    return (
                      <div
                        key={badge.id}
                        className={`${styles.badgeCard} ${
                          isUnlocked ? styles.badgeUnlocked : styles.badgeLocked
                        }`}
                        title={
                          isUnlocked
                            ? `${badge.name} — Unlocked!`
                            : `${badge.name} — Locked`
                        }
                      >
                        <span
                          className={styles.badgeIcon}
                          aria-hidden="true"
                          style={{
                            filter: isUnlocked ? 'none' : 'grayscale(1) opacity(0.4)',
                          }}
                        >
                          {badge.icon}
                        </span>
                        <span className={styles.badgeName}>{badge.name}</span>
                        <span className={styles.badgeDesc}>
                          {badge.description}
                        </span>
                        {isUnlocked && (
                          <span className={styles.unlockedTag}>✓ Unlocked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── Export & Actions ──────────────────────────────────── */}
        <div className={styles.actionsRow}>
          <button
            id="achievements-export"
            className="btn btn-secondary"
            onClick={actions.exportData}
          >
            <span aria-hidden="true">📤</span>
            Export My Data
          </button>
          <button
            id="achievements-recalculate"
            className="btn btn-primary"
            onClick={() => actions.navigate('calculator')}
          >
            <span aria-hidden="true">🔄</span>
            Update My Footprint
          </button>
        </div>
      </div>
    </div>
  );
}
