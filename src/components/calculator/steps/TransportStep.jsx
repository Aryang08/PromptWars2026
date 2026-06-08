/**
 * TransportStep — Step 1 of the Carbon Footprint Calculator
 *
 * Collects transportation data: vehicle type, weekly distance,
 * public transport usage, and annual flight trips.
 *
 * @module TransportStep
 */

import { useApp } from '../../../context/AppContext.jsx';
import { TRANSPORT_FACTORS, FLIGHT_FACTORS } from '../../../data/emissionFactors.js';
import styles from './TransportStep.module.css';

/** Vehicle type keys to display in the card grid */
const VEHICLE_KEYS = [
  'car_gasoline',
  'car_diesel',
  'car_hybrid',
  'car_electric',
  'motorcycle',
  'bicycle',
  'walking',
];

/** Public transport options */
const PUBLIC_TRANSPORT_OPTIONS = [
  { value: 'bus', label: 'Bus 🚌' },
  { value: 'train', label: 'Train 🚆' },
  { value: 'metro', label: 'Metro 🚇' },
];

/** Flight haul types */
const FLIGHT_KEYS = ['short_haul', 'medium_haul', 'long_haul'];

/**
 * Transport data collection step.
 *
 * @returns {JSX.Element} Transport step form
 */
export default function TransportStep() {
  const { state, actions } = useApp();
  const transport = state.calculatorData.transport;

  /**
   * Update a single transport field.
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const update = (field, value) => {
    actions.updateCategory('transport', { [field]: value });
  };

  /**
   * Update a flight row's tripsPerYear.
   * @param {string} flightType - e.g. 'short_haul'
   * @param {number} trips - New trip count
   */
  const updateFlight = (flightType, trips) => {
    const flights = transport.flights.map((f) =>
      f.type === flightType ? { ...f, tripsPerYear: trips } : f
    );
    actions.updateCategory('transport', { flights });
  };

  /** Get current trips for a flight type */
  const getFlightTrips = (flightType) => {
    const flight = transport.flights.find((f) => f.type === flightType);
    return flight ? flight.tripsPerYear : 0;
  };

  return (
    <div className={styles.step} role="group" aria-labelledby="transport-step-heading">
      {/* ── Vehicle Type ─────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle} id="transport-step-heading">
          <span className={styles.sectionIcon} aria-hidden="true">🚗</span>
          Primary Vehicle
        </h3>

        <div
          className={styles.cardGrid}
          role="radiogroup"
          aria-label="Vehicle type selection"
        >
          {VEHICLE_KEYS.map((key) => {
            const item = TRANSPORT_FACTORS[key];
            const isSelected = transport.vehicleType === key;
            return (
              <button
                key={key}
                id={`transport-vehicle-${key}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={item.label}
                className={`${styles.card} ${isSelected ? styles.selected : ''}`}
                onClick={() => update('vehicleType', key)}
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

      {/* ── Weekly Distance ──────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sliderGroup}>
          <div className={styles.sliderHeader}>
            <label htmlFor="transport-weekly-km" className={styles.sliderLabel}>
              Weekly Driving Distance
            </label>
            <span className={styles.sliderValue} aria-live="polite">
              {transport.weeklyKm} km
            </span>
          </div>
          <input
            id="transport-weekly-km"
            type="range"
            className={styles.slider}
            min={0}
            max={500}
            step={5}
            value={transport.weeklyKm}
            onChange={(e) => update('weeklyKm', Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={500}
            aria-valuenow={transport.weeklyKm}
            aria-valuetext={`${transport.weeklyKm} kilometers per week`}
          />
        </div>
      </section>

      {/* ── Public Transport ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">🚌</span>
          Public Transport
        </h3>

        <div className={styles.publicTransportRow}>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label
                htmlFor="transport-public-km"
                className={styles.sliderLabel}
              >
                Weekly Distance
              </label>
              <span className={styles.sliderValue} aria-live="polite">
                {transport.publicTransportKm} km
              </span>
            </div>
            <input
              id="transport-public-km"
              type="range"
              className={styles.slider}
              min={0}
              max={200}
              step={5}
              value={transport.publicTransportKm}
              onChange={(e) =>
                update('publicTransportKm', Number(e.target.value))
              }
              aria-valuemin={0}
              aria-valuemax={200}
              aria-valuenow={transport.publicTransportKm}
              aria-valuetext={`${transport.publicTransportKm} kilometers per week`}
            />
          </div>

          <div className={styles.selectWrapper}>
            <label
              htmlFor="transport-public-type"
              className={styles.sliderLabel}
            >
              Transport Type
            </label>
            <select
              id="transport-public-type"
              className={styles.select}
              value={transport.publicTransportType}
              onChange={(e) => update('publicTransportType', e.target.value)}
            >
              {PUBLIC_TRANSPORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Flights ──────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon} aria-hidden="true">✈️</span>
          Annual Flights
        </h3>

        <div className={styles.flightRows}>
          {FLIGHT_KEYS.map((key) => {
            const flight = FLIGHT_FACTORS[key];
            const trips = getFlightTrips(key);
            return (
              <div key={key} className={styles.flightRow}>
                <div className={styles.flightInfo}>
                  <span className={styles.flightLabel}>{flight.label}</span>
                  <span className={styles.flightSub}>
                    ~{flight.avgDistance.toLocaleString()} km avg
                  </span>
                </div>

                <div
                  className={styles.numericSelector}
                  role="group"
                  aria-label={`${flight.label} trips per year`}
                >
                  <button
                    id={`transport-flight-${key}-dec`}
                    type="button"
                    className={styles.numBtn}
                    onClick={() => updateFlight(key, Math.max(0, trips - 1))}
                    disabled={trips <= 0}
                    aria-label={`Decrease ${flight.label} trips`}
                  >
                    −
                  </button>
                  <span
                    className={styles.numValue}
                    aria-live="polite"
                    aria-atomic="true"
                    id={`transport-flight-${key}-value`}
                  >
                    {trips}
                  </span>
                  <button
                    id={`transport-flight-${key}-inc`}
                    type="button"
                    className={styles.numBtn}
                    onClick={() => updateFlight(key, Math.min(10, trips + 1))}
                    disabled={trips >= 10}
                    aria-label={`Increase ${flight.label} trips`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
