/**
 * CalculatorWizard — Multi-step Carbon Footprint Calculator
 *
 * A 4-step wizard (Transport → Energy → Diet → Lifestyle) with an
 * animated progress bar, step indicators, and smooth slide transitions.
 * On the final step, "Calculate" computes the footprint, saves a
 * monthly snapshot, and navigates to the dashboard.
 *
 * @module CalculatorWizard
 */

import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import TransportStep from './steps/TransportStep.jsx';
import EnergyStep from './steps/EnergyStep.jsx';
import DietStep from './steps/DietStep.jsx';
import LifestyleStep from './steps/LifestyleStep.jsx';
import styles from './CalculatorWizard.module.css';

/** Step definitions */
const STEPS = [
  { key: 'transport', label: 'Transport', icon: '🚗', Component: TransportStep },
  { key: 'energy', label: 'Energy', icon: '⚡', Component: EnergyStep },
  { key: 'diet', label: 'Diet', icon: '🍽️', Component: DietStep },
  { key: 'lifestyle', label: 'Lifestyle', icon: '🛍️', Component: LifestyleStep },
];

/**
 * Multi-step calculator wizard component.
 *
 * @returns {JSX.Element} The wizard UI
 */
export default function CalculatorWizard() {
  const { actions } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = STEPS.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  /** Advance to the next step */
  const handleNext = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLastStep]);

  /** Go back to the previous step */
  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isFirstStep]);

  /** Run calculation, save snapshot, and navigate to dashboard */
  const handleCalculate = useCallback(() => {
    actions.calculate();
    actions.saveSnapshot();
    actions.navigate('dashboard');
  }, [actions]);

  /** Render the current step's component */
  const ActiveStep = STEPS[currentStep].Component;

  return (
    <div className={styles.wizard} role="form" aria-label="Carbon Footprint Calculator">
      {/* Title */}
      <h2 className={styles.wizardTitle}>Calculate Your Footprint</h2>
      <p className={styles.wizardSubtitle}>
        Step {currentStep + 1} of {totalSteps} — {STEPS[currentStep].label}
      </p>

      {/* ── Progress Bar ─────────────────────────────────────────────────── */}
      <div className={styles.progressWrapper}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className={styles.stepIndicators}>
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.key} className={styles.stepDot}>
                <span
                  className={[
                    styles.dot,
                    isActive ? styles.active : '',
                    isCompleted ? styles.completed : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span
                  className={[
                    styles.stepLabel,
                    isActive ? styles.active : '',
                    isCompleted ? styles.completed : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step Content ─────────────────────────────────────────────────── */}
      <div className={styles.stepContent}>
        <div key={currentStep} className={styles.stepPane}>
          <ActiveStep />
        </div>
      </div>

      {/* ── Navigation Buttons ───────────────────────────────────────────── */}
      <div className={styles.navButtons}>
        {isFirstStep ? (
          <span className={styles.navSpacer} />
        ) : (
          <button
            id="wizard-btn-prev"
            type="button"
            className={styles.btnPrev}
            onClick={handlePrev}
            aria-label="Go to previous step"
          >
            ← Previous
          </button>
        )}

        {isLastStep ? (
          <button
            id="wizard-btn-calculate"
            type="button"
            className={styles.btnCalculate}
            onClick={handleCalculate}
            aria-label="Calculate your carbon footprint"
          >
            🌱 Calculate
          </button>
        ) : (
          <button
            id="wizard-btn-next"
            type="button"
            className={styles.btnNext}
            onClick={handleNext}
            aria-label="Go to next step"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
