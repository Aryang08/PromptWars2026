/**
 * LifestyleStep — Step 4 of the Carbon Footprint Calculator
 *
 * Collects lifestyle and consumption data: shopping habits,
 * electronics usage, water consumption, and recycling practices.
 *
 * @module LifestyleStep
 */

import { useApp } from '../../../context/AppContext.jsx';
import { LIFESTYLE_FACTORS } from '../../../data/emissionFactors.js';
import styles from './LifestyleStep.module.css';

/**
 * Renders a category section with selectable cards.
 *
 * @param {Object} props
 * @param {string} props.id - Unique section ID prefix
 * @param {string} props.title - Section heading text
 * @param {string} props.icon - Emoji icon for the heading
 * @param {Object} props.options - Options object from LIFESTYLE_FACTORS
 * @param {string} props.selectedValue - Currently selected key
 * @param {Function} props.onSelect - Callback when a card is selected
 * @param {number} [props.columns=4] - Number of grid columns (3 or 4)
 * @returns {JSX.Element} Category section
 */
function CategorySection({
  id,
  title,
  icon,
  options,
  selectedValue,
  onSelect,
  columns = 4,
}) {
  const keys = Object.keys(options);
  const gridClass = columns === 3 ? styles.cardGrid3 : styles.cardGrid;

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle} id={`${id}-heading`}>
        <span className={styles.sectionIcon} aria-hidden="true">
          {icon}
        </span>
        {title}
      </h3>

      <div
        className={gridClass}
        role="radiogroup"
        aria-labelledby={`${id}-heading`}
      >
        {keys.map((key) => {
          const item = options[key];
          const isSelected = selectedValue === key;
          return (
            <button
              key={key}
              id={`${id}-${key}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${item.label}${item.description ? `: ${item.description}` : ''}`}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(key)}
            >
              <span className={styles.cardIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.cardLabel}>{item.label}</span>
              {item.description && (
                <span className={styles.cardDescription}>
                  {item.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Lifestyle data collection step.
 *
 * @returns {JSX.Element} Lifestyle step form
 */
export default function LifestyleStep() {
  const { state, actions } = useApp();
  const lifestyle = state.calculatorData.lifestyle;

  /**
   * Update a single lifestyle field.
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const update = (field, value) => {
    actions.updateCategory('lifestyle', { [field]: value });
  };

  return (
    <div
      className={styles.step}
      role="group"
      aria-labelledby="lifestyle-shopping-heading"
    >
      <CategorySection
        id="lifestyle-shopping"
        title="Shopping Habits"
        icon="🛍️"
        options={LIFESTYLE_FACTORS.shopping}
        selectedValue={lifestyle.shoppingLevel}
        onSelect={(key) => update('shoppingLevel', key)}
        columns={4}
      />

      <CategorySection
        id="lifestyle-electronics"
        title="Electronics Usage"
        icon="💻"
        options={LIFESTYLE_FACTORS.electronics}
        selectedValue={lifestyle.electronicsLevel}
        onSelect={(key) => update('electronicsLevel', key)}
        columns={3}
      />

      <CategorySection
        id="lifestyle-water"
        title="Water Usage"
        icon="💧"
        options={LIFESTYLE_FACTORS.water}
        selectedValue={lifestyle.waterLevel}
        onSelect={(key) => update('waterLevel', key)}
        columns={3}
      />

      <CategorySection
        id="lifestyle-recycling"
        title="Recycling Practices"
        icon="♻️"
        options={LIFESTYLE_FACTORS.recycling}
        selectedValue={lifestyle.recyclingLevel}
        onSelect={(key) => update('recyclingLevel', key)}
        columns={4}
      />
    </div>
  );
}
