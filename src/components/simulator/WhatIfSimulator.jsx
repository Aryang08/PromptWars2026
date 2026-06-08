/**
 * CarbonLens — What-If Simulator Component
 *
 * Interactive scenario explorer that lets users drag sliders
 * to see real-time impact of lifestyle changes on their footprint.
 *
 * @module WhatIfSimulator
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORY_META } from '../../data/emissionFactors.js';
import AnimatedCounter from '../common/AnimatedCounter.jsx';
import styles from './WhatIfSimulator.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = ['transport', 'energy', 'diet', 'lifestyle'];

const getChartColor = () => getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim() || '#94a3b8';
const getCenterColor = () => getComputedStyle(document.documentElement).getPropertyValue('--chart-center').trim() || '#f8fafc';

/** Plugin to draw text in the center of the doughnut chart */
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { top, bottom, left, right } = chartArea;
    const width = right - left;
    const height = bottom - top;
    
    ctx.restore();
    const fontSize = (height / 160).toFixed(2);
    ctx.font = `bold ${fontSize}em Inter, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = getCenterColor();
    
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const text = Math.round(total).toLocaleString();
    const textX = left + Math.round((width - ctx.measureText(text).width) / 2);
    const textY = top + height / 2 - 12;
    ctx.fillText(text, textX, textY);
    
    ctx.font = `normal ${fontSize * 0.4}em Inter, sans-serif`;
    ctx.fillStyle = getChartColor();
    const label = 'kg CO₂e';
    const labelX = left + Math.round((width - ctx.measureText(label).width) / 2);
    const labelY = top + height / 2 + 18;
    ctx.fillText(label, labelX, labelY);
    ctx.save();
  }
};

/**
 * What-If Simulator page component.
 * @returns {JSX.Element}
 */
export default function WhatIfSimulator() {
  const { state, actions } = useApp();
  const { results } = state;

  // Track slider values as percentages (100 = current)
  const [sliders, setSliders] = useState({
    transport: 100,
    energy: 100,
    diet: 100,
    lifestyle: 100,
  });

  // Mark simulator as used on mount
  useEffect(() => {
    actions.markSimulatorUsed();
  }, [actions]);

  if (!results) return null;

  const { breakdown } = results;

  /** Calculate projected values based on slider positions */
  const projected = useMemo(() => {
    const values = {};
    let total = 0;
    for (const key of CATEGORIES) {
      values[key] = (breakdown[key] * sliders[key]) / 100;
      total += values[key];
    }
    return { values, total };
  }, [breakdown, sliders]);

  const savings = results.total - projected.total;
  const savingsPercent =
    results.total > 0 ? Math.round((savings / results.total) * 100) : 0;

  /** Handle slider change */
  const handleSliderChange = (category, value) => {
    setSliders((prev) => ({ ...prev, [category]: Number(value) }));
  };

  /** Reset all sliders to 100% */
  const handleReset = () => {
    setSliders({ transport: 100, energy: 100, diet: 100, lifestyle: 100 });
  };

  /** Doughnut chart for projected breakdown */
  const chartData = useMemo(
    () => ({
      labels: CATEGORIES.map((key) => CATEGORY_META[key].label),
      datasets: [
        {
          data: CATEGORIES.map((key) => Math.round(projected.values[key])),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: ['#3b82f6', '#f59e0b', '#22c55e', '#8b5cf6'],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    }),
    [projected]
  );

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: getChartColor(),
          padding: 14,
          usePointStyle: true,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed} kg CO₂e/month`,
        },
      },
    },
    cutout: '60%',
  }), [state.theme]);

  return (
    <div className={styles.simulator}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span aria-hidden="true">🔮</span> What-If Simulator
          </h1>
          <p className={styles.subtitle}>
            Drag the sliders to explore how changes in each category would affect
            your total carbon footprint.
          </p>
        </header>

        <div className={styles.layout}>
          {/* Left: Sliders */}
          <div className={styles.slidersPanel}>
            {CATEGORIES.map((key) => {
              const meta = CATEGORY_META[key];
              const currentVal = breakdown[key];
              const projectedVal = projected.values[key];
              const diff = projectedVal - currentVal;

              return (
                <div key={key} className={styles.sliderGroup}>
                  <div className={styles.sliderHeader}>
                    <span className={styles.sliderIcon} aria-hidden="true">
                      {meta.icon}
                    </span>
                    <span className={styles.sliderLabel}>{meta.label}</span>
                    <span className={styles.sliderValues}>
                      <span style={{ color: meta.color }}>
                        {Math.round(projectedVal)} kg
                      </span>
                      {diff !== 0 && (
                        <span
                          className={styles.sliderDiff}
                          style={{
                            color: diff < 0 ? 'var(--color-green-400)' : 'var(--color-coral-400)',
                          }}
                        >
                          {diff > 0 ? '+' : ''}{Math.round(diff)}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className={styles.sliderRow}>
                    <span className={styles.sliderMin}>0%</span>
                    <input
                      type="range"
                      id={`simulator-slider-${key}`}
                      min="0"
                      max="200"
                      step="5"
                      value={sliders[key]}
                      onChange={(e) => handleSliderChange(key, e.target.value)}
                      aria-label={`${meta.label} adjustment`}
                      aria-valuemin={0}
                      aria-valuemax={200}
                      aria-valuenow={sliders[key]}
                      aria-valuetext={`${sliders[key]}% of current`}
                      className={styles.slider}
                      style={{
                        '--slider-progress': `${sliders[key] / 2}%`,
                        '--slider-color': meta.color,
                      }}
                    />
                    <span className={styles.sliderMax}>200%</span>
                  </div>

                  <div className={styles.sliderPercent}>
                    {sliders[key]}% of current
                    {sliders[key] < 100 && (
                      <span className={styles.reductionHint}>
                        ({100 - sliders[key]}% reduction)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              id="simulator-reset"
              className="btn btn-secondary"
              onClick={handleReset}
              style={{ marginTop: 'var(--space-4)', width: '100%' }}
            >
              🔄 Reset to Current
            </button>
          </div>

          {/* Right: Results */}
          <div className={styles.resultsPanel}>
            <div className={`glass-card ${styles.projectedCard}`}>
              <h3 className={styles.projectedLabel}>Projected Footprint</h3>
              <div className={styles.projectedValue}>
                <AnimatedCounter
                  value={projected.total}
                  className={styles.projectedNumber}
                  decimals={0}
                />
                <span className={styles.projectedUnit}>kg CO₂e/month</span>
              </div>

              {savings !== 0 && (
                <div
                  className={styles.savingsBadge}
                  style={{
                    background:
                      savings > 0
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    color: savings > 0 ? '#4ade80' : '#f87171',
                  }}
                >
                  {savings > 0 ? '↓' : '↑'} {Math.abs(Math.round(savings))} kg/month
                  ({Math.abs(savingsPercent)}% {savings > 0 ? 'reduction' : 'increase'})
                </div>
              )}
            </div>

            <div className={`glass-card ${styles.chartCard}`} aria-label="Projected emissions breakdown">
              <h3 className={styles.chartTitle}>Projected Breakdown</h3>
              <div style={{ height: 280 }}>
                <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
              </div>
            </div>

            <div className={`glass-card ${styles.comparisonMini}`}>
              <div className={styles.compRow}>
                <span>Current</span>
                <strong>{Math.round(results.total)} kg</strong>
              </div>
              <div className={styles.compRow}>
                <span>Projected</span>
                <strong style={{ color: projected.total < results.total ? '#4ade80' : '#f87171' }}>
                  {Math.round(projected.total)} kg
                </strong>
              </div>
              <div className={styles.compRow}>
                <span>Annual Impact</span>
                <strong style={{ color: savings > 0 ? '#4ade80' : '#f87171' }}>
                  {savings > 0 ? '-' : '+'}{Math.abs(Math.round(savings * 12))} kg/year
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
