/**
 * CarbonLens — ProgressRing Component
 *
 * SVG-based circular progress indicator with animation.
 * Supports center content via children slot.
 *
 * @module ProgressRing
 */

import PropTypes from 'prop-types';
import styles from './ProgressRing.module.css';

/**
 * Circular progress ring component.
 *
 * @param {Object} props
 * @param {number} props.progress - Progress value 0-100
 * @param {number} [props.size=120] - Ring diameter in px
 * @param {number} [props.strokeWidth=8] - Stroke width in px
 * @param {string} [props.color='var(--color-green-500)'] - Stroke color
 * @param {string} [props.label] - Accessible label
 * @param {React.ReactNode} [props.children] - Center content
 * @returns {JSX.Element}
 */
export default function ProgressRing({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = 'var(--color-green-500)',
  label = 'Progress',
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={styles.container}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ width: size, height: size }}
    >
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          className={styles.progress}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}

ProgressRing.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};
