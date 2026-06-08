/**
 * CarbonLens — Actions Page
 * @module ActionsPage
 */

import { useApp } from '../context/AppContext.jsx';
import ActionPlan from '../components/insights/ActionPlan.jsx';
import styles from './PageCommon.module.css';

/**
 * Actions page with empty state handling.
 * @returns {JSX.Element}
 */
export default function ActionsPage() {
  const { state, actions } = useApp();

  if (!state.hasCalculated) {
    return (
      <main id="main-content" className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <span className={styles.emptyIcon} aria-hidden="true">🎯</span>
          <h2 className={styles.emptyTitle}>No Actions Yet</h2>
          <p className={styles.emptyText}>
            Calculate your footprint to get personalized action recommendations.
          </p>
          <button
            id="empty-start-calculator-actions"
            className="btn btn-primary btn-lg"
            onClick={() => actions.navigate('calculator')}
          >
            Start Calculator
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <ActionPlan />
    </main>
  );
}
