/**
 * CarbonLens — AnimatedCounter Component
 *
 * Smoothly animates a number from 0 (or previous value) to target.
 * Uses requestAnimationFrame for 60fps animation.
 * Respects prefers-reduced-motion.
 *
 * @module AnimatedCounter
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Easing function (ease-out cubic) for natural deceleration.
 * @param {number} t - Progress [0, 1]
 * @returns {number} Eased value [0, 1]
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animated number counter component.
 *
 * @param {Object} props
 * @param {number} props.value - Target value to animate to
 * @param {number} [props.duration=1000] - Animation duration in ms
 * @param {number} [props.decimals=0] - Decimal places
 * @param {string} [props.suffix=''] - Text after the number
 * @param {string} [props.prefix=''] - Text before the number
 * @param {string} [props.className] - Optional CSS class
 * @returns {JSX.Element}
 */
export default function AnimatedCounter({
  value,
  duration = 1000,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      previousValue.current = value;
      return;
    }

    const startValue = previousValue.current;
    const diff = value - startValue;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = startValue + diff * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  const formatted = displayValue.toFixed(decimals);
  // Add thousand separators
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const display = parts.join('.');

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      {prefix}{display}{suffix}
    </span>
  );
}
