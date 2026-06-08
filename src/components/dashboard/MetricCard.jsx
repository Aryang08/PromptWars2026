/**
 * CarbonLens — MetricCard Component
 *
 * Glassmorphism card displaying a metric with animated value,
 * trend indicator, and category color coding.
 *
 * @module MetricCard
 */

import AnimatedCounter from '../common/AnimatedCounter.jsx';
import styles from './MetricCard.module.css';

/**
 * Metric display card.
 *
 * @param {Object} props
 * @param {string} props.label - Metric label
 * @param {number} props.value - Metric value
 * @param {string} [props.unit='kg'] - Unit display
 * @param {string} [props.icon] - Emoji icon
 * @param {'up'|'down'|'neutral'} [props.trend='neutral'] - Trend direction
 * @param {string} [props.color] - Accent color
 * @param {string} [props.subtitle] - Secondary text
 * @param {number} [props.percentage] - Percentage of total
 * @returns {JSX.Element}
 */
export default function MetricCard({
  label,
  value,
  unit = 'kg',
  icon,
  trend = 'neutral',
  color = 'var(--color-green-500)',
  subtitle,
  percentage,
}) {
  const trendArrow = trend === 'down' ? '↓' : trend === 'up' ? '↑' : '→';
  // For emissions, down is good (green), up is bad (red)
  const trendColor =
    trend === 'down'
      ? 'var(--color-green-400)'
      : trend === 'up'
        ? 'var(--color-coral-400)'
        : 'var(--color-text-tertiary)';

  return (
    <div className={styles.card} style={{ '--card-accent': color }}>
      <div className={styles.header}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.label}>{label}</span>
      </div>

      <div className={styles.valueRow}>
        <AnimatedCounter
          value={value}
          className={styles.value}
          decimals={0}
        />
        <span className={styles.unit}>{unit}</span>
      </div>

      <div className={styles.footer}>
        {percentage !== undefined && (
          <div className={styles.bar}>
            <div
              className={styles.barFill}
              style={{ width: `${Math.min(100, percentage)}%`, background: color }}
            />
          </div>
        )}
        <div className={styles.meta}>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          {trend !== 'neutral' && (
            <span className={styles.trend} style={{ color: trendColor }}>
              {trendArrow}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
