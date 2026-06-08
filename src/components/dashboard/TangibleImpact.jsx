import { useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { calculateTangibleImpact } from '../../utils/tangibility.js';
import styles from './TangibleImpact.module.css';

/**
 * Tangible Impact Component
 * Translates abstract kg CO2e into real-world analogies and prices.
 */
export default function TangibleImpact() {
  const { state } = useApp();
  const { results, profile } = state;
  
  if (!results) return null;

  const impact = useMemo(() => {
    // 208kg is the monthly budget for Paris 2030
    return calculateTangibleImpact(results.total, 208, profile?.country || 'global');
  }, [results.total, profile?.country]);

  return (
    <section className={`glass-card ${styles.tangibleCard}`} aria-label="Real-world impact">
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>The Reality Check</h3>
          <p className={styles.subtitle}>What your monthly footprint actually means in the real world.</p>
        </div>
        <div className={styles.headerIcon} aria-hidden="true">🌍</div>
      </header>

      <div className={styles.grid}>
        <div className={styles.impactItem}>
          <div className={styles.iconWrap} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
            <span className={styles.icon} aria-hidden="true">🧊</span>
          </div>
          <div className={styles.content}>
            <span className={styles.value}>{impact.iceMeltedSqMeters} m²</span>
            <span className={styles.label}>Arctic Ice Melted</span>
          </div>
        </div>
        
        <div className={styles.impactItem}>
          <div className={styles.iconWrap} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}>
            <span className={styles.icon} aria-hidden="true">🌳</span>
          </div>
          <div className={styles.content}>
            <span className={styles.value}>{impact.treesNeeded}</span>
            <span className={styles.label}>Trees Needed to Absorb</span>
          </div>
        </div>

        <div className={styles.impactItem}>
          <div className={styles.iconWrap} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
            <span className={styles.icon} aria-hidden="true">🚗</span>
          </div>
          <div className={styles.content}>
            <span className={styles.value}>{impact.carMiles.toLocaleString()}</span>
            <span className={styles.label}>Miles Driven in a Gas Car</span>
          </div>
        </div>
      </div>

      <div className={styles.offsetBox}>
        <div className={styles.offsetInfo}>
          <div className={styles.offsetHeader}>
            <span className={styles.offsetIcon} aria-hidden="true">💰</span>
            <h4 className={styles.offsetTitle}>Offset Price Tag</h4>
          </div>
          {impact.deficit > 0 ? (
            <p className={styles.offsetText}>
              You are <strong>{Math.round(impact.deficit)} kg</strong> over the Paris 2030 monthly budget. 
              To offset this excess on the real-world carbon market today, it would cost approximately:
            </p>
          ) : (
            <p className={styles.offsetText}>
              You are entirely within the Paris 2030 budget! If you still wanted to offset your entire footprint, it would cost:
            </p>
          )}
        </div>
        <div className={styles.offsetPriceWrap}>
          <span className={styles.offsetPrice}>
            {impact.currencySymbol}{impact.deficit > 0 ? impact.offsetCost : impact.totalCost}
          </span>
          <span className={styles.offsetPriceUnit}>/ month</span>
        </div>
      </div>
    </section>
  );
}
