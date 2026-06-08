/**
 * CarbonLens — Simulator Page
 * @module SimulatorPage
 */

import { useApp } from '../context/AppContext.jsx';
import WhatIfSimulator from '../components/simulator/WhatIfSimulator.jsx';
import styles from './PageCommon.module.css';

/**
 * What-If Simulator page with empty state handling.
 * @returns {JSX.Element}
 */
export default function SimulatorPage() {
  const { state, actions } = useApp();

  if (!state.hasCalculated) {
    return (
      <main id="main-content" className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <span className={styles.emptyIcon} aria-hidden="true">🔮</span>
          <h2 className={styles.emptyTitle}>Calculate First</h2>
          <p className={styles.emptyText}>
            You need to calculate your footprint before exploring what-if scenarios.
          </p>
          <button
            id="empty-start-calculator-sim"
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
      <WhatIfSimulator />
    </main>
  );
}
