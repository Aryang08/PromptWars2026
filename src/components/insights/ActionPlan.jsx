/**
 * CarbonLens — ActionPlan Component
 *
 * Personalized action recommendations ranked by impact,
 * with completion tracking and filtering.
 *
 * @module ActionPlan
 */

import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import styles from './ActionPlan.module.css';

const DIFFICULTY_COLORS = {
  easy: { bg: 'rgba(34, 197, 94, 0.12)', color: '#4ade80', label: 'Easy' },
  medium: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'Medium' },
  hard: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', label: 'Hard' },
};

/**
 * Action plan page component.
 * @returns {JSX.Element}
 */
export default function ActionPlan() {
  const { state, actions } = useApp();
  const { results, completedActions } = state;
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  if (!results?.recommendations) return null;

  const recommendations = results.recommendations;

  /** Filtered recommendations */
  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      if (filterCategory !== 'all' && rec.category !== filterCategory) return false;
      if (filterDifficulty !== 'all' && rec.difficulty !== filterDifficulty) return false;
      return true;
    });
  }, [recommendations, filterCategory, filterDifficulty]);

  const completedCount = completedActions.length;
  const totalCount = recommendations.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  /** Total potential savings from all recommendations */
  const totalPotentialSavings = recommendations.reduce(
    (sum, r) => sum + r.savingsKg,
    0
  );
  const completedSavings = recommendations
    .filter((r) => completedActions.includes(r.id))
    .reduce((sum, r) => sum + r.savingsKg, 0);

  return (
    <div className={styles.actionPlan}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span aria-hidden="true">🎯</span> Your Action Plan
          </h1>
          <p className={styles.subtitle}>
            Personalized recommendations ranked by impact. Check off actions as
            you complete them.
          </p>
        </header>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              {completedCount} of {totalCount} actions completed
            </span>
            <span className={styles.savingsLabel}>
              ~{completedSavings} of {totalPotentialSavings} kg CO₂e/month saved
            </span>
          </div>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label="Action completion progress"
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="filter-category" className={styles.filterLabel}>
              Category
            </label>
            <select
              id="filter-category"
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="transport">🚗 Transportation</option>
              <option value="energy">⚡ Home Energy</option>
              <option value="diet">🍽️ Diet & Food</option>
              <option value="lifestyle">🛍️ Lifestyle</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="filter-difficulty" className={styles.filterLabel}>
              Difficulty
            </label>
            <select
              id="filter-difficulty"
              className="form-select"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>
        </div>

        {/* Action Cards */}
        <div className={styles.actionsList}>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p>No recommendations match your filters.</p>
            </div>
          )}

          {filtered.map((rec, index) => {
            const isCompleted = completedActions.includes(rec.id);
            const diffStyle = DIFFICULTY_COLORS[rec.difficulty];

            return (
              <div
                key={rec.id}
                className={`${styles.actionCard} ${isCompleted ? styles.actionCardCompleted : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  id={`action-toggle-${rec.id}`}
                  className={styles.checkbox}
                  onClick={() => actions.toggleAction(rec.id)}
                  aria-label={`${isCompleted ? 'Unmark' : 'Mark'} "${rec.title}" as completed`}
                  aria-pressed={isCompleted}
                >
                  {isCompleted ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <rect width="20" height="20" rx="6" fill="var(--color-green-500)" />
                      <path
                        d="M6 10l3 3 5-6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <rect
                        x="1"
                        y="1"
                        width="18"
                        height="18"
                        rx="5"
                        stroke="var(--color-text-tertiary)"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>

                <div className={styles.actionContent}>
                  <div className={styles.actionHeader}>
                    <span className={styles.actionIcon} aria-hidden="true">
                      {rec.icon}
                    </span>
                    <h3
                      className={`${styles.actionTitle} ${isCompleted ? styles.strikethrough : ''}`}
                    >
                      {rec.title}
                    </h3>
                  </div>

                  <p className={styles.actionDescription}>{rec.description}</p>

                  <div className={styles.actionMeta}>
                    <span
                      className={styles.savingsBadge}
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#4ade80',
                      }}
                    >
                      Save ~{rec.savingsKg} kg/month
                    </span>
                    <span
                      className={styles.difficultyBadge}
                      style={{ background: diffStyle.bg, color: diffStyle.color }}
                    >
                      {diffStyle.label}
                    </span>
                    <span
                      className={styles.categoryBadge}
                      style={{
                        background: rec.categoryColor + '18',
                        color: rec.categoryColor,
                      }}
                    >
                      {rec.categoryIcon} {rec.categoryLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
