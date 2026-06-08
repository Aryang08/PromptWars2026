/**
 * CarbonLens — Dashboard Page
 * @module DashboardPage
 */

import { useApp } from '../context/AppContext.jsx';
import Dashboard from '../components/dashboard/Dashboard.jsx';
import styles from './PageCommon.module.css';

/**
 * Dashboard page with empty state handling.
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const { state, actions } = useApp();

  if (!state.hasCalculated) {
    return (
      <main id="main-content" className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <span className={styles.emptyIcon} aria-hidden="true">📊</span>
          <h2 className={styles.emptyTitle}>No Data Yet</h2>
          <p className={styles.emptyText}>
            Calculate your carbon footprint first to see your personalized dashboard.
          </p>
          <button
            id="empty-start-calculator"
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
      <Dashboard />
    </main>
  );
}
