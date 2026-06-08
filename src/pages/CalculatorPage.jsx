/**
 * CarbonLens — Calculator Page
 * @module CalculatorPage
 */

import CalculatorWizard from '../components/calculator/CalculatorWizard.jsx';

/**
 * Calculator page wrapper.
 * @returns {JSX.Element}
 */
export default function CalculatorPage() {
  return (
    <main id="main-content" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
      <CalculatorWizard />
    </main>
  );
}
