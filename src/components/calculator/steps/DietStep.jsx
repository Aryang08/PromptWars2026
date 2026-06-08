/**
 * DietStep — Step 3 of the Carbon Footprint Calculator
 *
 * Collects dietary data: diet type, food waste level,
 * and local food sourcing habits.
 *
 * @module DietStep
 */

import { useApp } from '../../../context/AppContext.jsx';
import {
  DIET_FACTORS,
  FOOD_WASTE_FACTORS,
  LOCAL_FOOD_FACTORS,
} from '../../../data/emissionFactors.js';
import styles from './DietStep.module.css';

/** Diet type keys */
const DIET_KEYS = [
  'high_meat',
  'medium_meat',
  'low_meat',
  'pescatarian',
  'vegetarian',
  'vegan',
];

/** Food waste level keys */
const WASTE_KEYS = ['none', 'low', 'average', 'high'];

/** Local food sourcing keys */
const LOCAL_KEYS = ['mostly_local', 'some_local', 'mostly_imported'];

/**
 * Diet data collection step.
 *
 * @returns {JSX.Element} Diet step form
 */
export default function DietStep() {
  const { state, actions } = useApp();
  const diet = state.calculatorData.diet;

  /**
   * Update a single diet field.
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const update = (field, value) => {
    actions.updateCategory('diet', { [field]: value });
  };

  return (
    <div className={styles.step} role="group" aria-labelledby="diet-step-heading">
      {/* ── Diet Type ────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle} id="diet-step-heading">
          <span className={styles.sectionIcon} aria-hidden="true">🍽️</span>
          Diet Type
        </h3>

        <div
          className={styles.cardGrid}
          role="radiogroup"
          aria-label="Diet type selection"
        >
          {DIET_KEYS.map((key) => {
            const item = DIET_FACTORS[key];
            const isSelected = diet.dietType === key;
            return (
              <button
                key={key}
                id={`diet-type-${key}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${item.label}: ${item.description}`}
                className={`${styles.card} ${isSelected ? styles.selected : ''}`}
                onClick={() => update('dietType', key)}
              >
                <span className={styles.cardIcon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={styles.cardDescription}>
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Food Waste ───────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">🗑️</span>
          Food Waste Level
        </h3>

        <div
          className={styles.optionGrid}
          role="radiogroup"
          aria-label="Food waste level selection"
        >
          {WASTE_KEYS.map((key) => {
            const item = FOOD_WASTE_FACTORS[key];
            const isSelected = diet.foodWaste === key;
            return (
              <button
                key={key}
                id={`diet-waste-${key}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${item.label}: ${item.description}`}
                className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => update('foodWaste', key)}
              >
                <span className={styles.optionLabel}>{item.label}</span>
                <span className={styles.optionDescription}>
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Local Food Sourcing ──────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">🌍</span>
          Food Sourcing
        </h3>

        <div
          className={styles.optionGrid}
          role="radiogroup"
          aria-label="Local food sourcing selection"
        >
          {LOCAL_KEYS.map((key) => {
            const item = LOCAL_FOOD_FACTORS[key];
            const isSelected = diet.localFood === key;
            return (
              <button
                key={key}
                id={`diet-local-${key}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={item.label}
                className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => update('localFood', key)}
              >
                <span className={styles.optionLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
