/**
 * EnergyStep — Step 2 of the Carbon Footprint Calculator
 *
 * Collects home energy data: monthly electricity, heating type,
 * heating usage, and renewable energy percentage.
 *
 * @module EnergyStep
 */

import { useApp } from '../../../context/AppContext.jsx';
import {
  ENERGY_FACTORS,
  ELECTRICITY_BENCHMARKS,
} from '../../../data/emissionFactors.js';
import styles from './EnergyStep.module.css';

/** Heating type keys to show as cards */
const HEATING_KEYS = ['natural_gas', 'heating_oil', 'lpg', 'solar'];

/**
 * Energy data collection step.
 *
 * @returns {JSX.Element} Energy step form
 */
export default function EnergyStep() {
  const { state, actions } = useApp();
  const energy = state.calculatorData.energy;

  /**
   * Update a single energy field.
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const update = (field, value) => {
    actions.updateCategory('energy', { [field]: value });
  };

  return (
    <div className={styles.step} role="group" aria-labelledby="energy-step-heading">
      {/* ── Monthly Electricity ──────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle} id="energy-step-heading">
          <span className={styles.sectionIcon} aria-hidden="true">💡</span>
          Monthly Electricity
        </h3>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderHeader}>
            <label htmlFor="energy-electricity" className={styles.sliderLabel}>
              Electricity Usage
            </label>
            <span className={styles.sliderValue} aria-live="polite">
              {energy.electricityKwh} kWh
            </span>
          </div>
          <input
            id="energy-electricity"
            type="range"
            className={styles.slider}
            min={0}
            max={2000}
            step={10}
            value={energy.electricityKwh}
            onChange={(e) => update('electricityKwh', Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={2000}
            aria-valuenow={energy.electricityKwh}
            aria-valuetext={`${energy.electricityKwh} kilowatt hours per month`}
          />

          {/* Benchmark labels */}
          <div className={styles.benchmarks} aria-label="Usage benchmarks">
            {Object.values(ELECTRICITY_BENCHMARKS).map((b) => (
              <div key={b.label} className={styles.benchmark}>
                <span className={styles.benchmarkValue}>{b.kwhPerMonth}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Heating Type ─────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">🔥</span>
          Heating Source
        </h3>

        <div
          className={styles.cardGrid}
          role="radiogroup"
          aria-label="Heating type selection"
        >
          {HEATING_KEYS.map((key) => {
            const item = ENERGY_FACTORS[key];
            const isSelected = energy.heatingType === key;
            return (
              <button
                key={key}
                id={`energy-heating-${key}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={item.label}
                className={`${styles.card} ${isSelected ? styles.selected : ''}`}
                onClick={() => update('heatingType', key)}
              >
                <span className={styles.cardIcon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.cardLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Monthly Heating Usage ────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sliderGroup}>
          <div className={styles.sliderHeader}>
            <label htmlFor="energy-heating-usage" className={styles.sliderLabel}>
              Monthly Heating Usage
            </label>
            <span className={styles.sliderValue} aria-live="polite">
              {energy.heatingUsage} kWh
            </span>
          </div>
          <input
            id="energy-heating-usage"
            type="range"
            className={styles.slider}
            min={0}
            max={500}
            step={5}
            value={energy.heatingUsage}
            onChange={(e) => update('heatingUsage', Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={500}
            aria-valuenow={energy.heatingUsage}
            aria-valuetext={`${energy.heatingUsage} kilowatt hours per month`}
          />
        </div>
      </section>

      {/* ── Renewable Energy ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">☀️</span>
          Renewable Energy
        </h3>

        <div className={styles.renewableRow}>
          <div className={`${styles.sliderGroup} ${styles.renewableSlider}`}>
            <div className={styles.sliderHeader}>
              <label
                htmlFor="energy-renewable"
                className={styles.sliderLabel}
              >
                Renewable Percentage
              </label>
              <span className={styles.sliderValue} aria-live="polite">
                {energy.renewablePercentage}%
              </span>
            </div>
            <input
              id="energy-renewable"
              type="range"
              className={styles.slider}
              min={0}
              max={100}
              step={1}
              value={energy.renewablePercentage}
              onChange={(e) =>
                update('renewablePercentage', Number(e.target.value))
              }
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={energy.renewablePercentage}
              aria-valuetext={`${energy.renewablePercentage} percent renewable`}
            />
          </div>

          {/* Sun icon that fills up */}
          <div
            className={styles.sunIcon}
            role="img"
            aria-label={`${energy.renewablePercentage}% renewable energy`}
          >
            <div
              className={styles.sunFill}
              style={{ height: `${energy.renewablePercentage}%` }}
            />
            <span
              className={styles.sunEmoji}
              style={{
                filter:
                  energy.renewablePercentage > 50
                    ? 'drop-shadow(0 0 8px rgba(251,191,36,0.6))'
                    : 'none',
              }}
            >
              ☀️
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
