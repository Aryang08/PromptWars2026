/**
 * CarbonLens — Dashboard Component
 *
 * Main analytics dashboard showing footprint breakdown,
 * comparisons, trends, and quick action links.
 *
 * @module Dashboard
 */

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORY_META, NATIONAL_AVERAGES } from '../../data/emissionFactors.js';
import AnimatedCounter from '../common/AnimatedCounter.jsx';
import MetricCard from './MetricCard.jsx';
import TangibleImpact from './TangibleImpact.jsx';
import styles from './Dashboard.module.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
);

/** Chart.js default overrides */
const getChartColor = () => getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim() || '#94a3b8';
const getGridColor = () => getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || 'rgba(148, 163, 184, 0.1)';
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
 * Main dashboard component.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const { state, actions } = useApp();
  const { results, snapshots, profile } = state;

  if (!results) return null;

  const { breakdown, percentages, comparison, insight } = results;

  /** Doughnut chart data */
  const doughnutData = useMemo(
    () => ({
      labels: Object.values(CATEGORY_META).map((c) => c.label),
      datasets: [
        {
          data: [
            breakdown.transport,
            breakdown.energy,
            breakdown.diet,
            breakdown.lifestyle,
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            '#3b82f6',
            '#f59e0b',
            '#22c55e',
            '#8b5cf6',
          ],
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 8,
        },
      ],
    }),
    [breakdown]
  );

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: getChartColor(),
          padding: 16,
          font: { family: 'Inter', size: 13 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Inter', size: 14 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    cutout: '65%',
  }), [state.theme]);

  /** Comparison bar chart */
  const nationalAvg = NATIONAL_AVERAGES[profile.country] || NATIONAL_AVERAGES.global;
  const comparisonData = useMemo(
    () => ({
      labels: ['You', nationalAvg.label, 'Global Avg', 'Paris 2030'],
      datasets: [
        {
          data: [
            results.total,
            nationalAvg.value,
            NATIONAL_AVERAGES.global.value,
            208,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',
            'rgba(59, 130, 246, 0.5)',
            'rgba(148, 163, 184, 0.4)',
            'rgba(245, 158, 11, 0.5)',
          ],
          borderColor: ['#22c55e', '#3b82f6', '#64748b', '#f59e0b'],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [results.total, nationalAvg, profile.country]
  );

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: getGridColor() },
        ticks: { color: getChartColor(), font: { family: 'Inter' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: getChartColor(), font: { family: 'Inter' } },
      },
    },
  }), [state.theme]);

  /** Trend line chart */
  const hasTrend = snapshots.length > 1;
  const trendData = useMemo(() => {
    if (!hasTrend) return null;
    return {
      labels: snapshots.map((s) => s.month),
      datasets: [
        {
          label: 'Monthly Total',
          data: snapshots.map((s) => s.total),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#22c55e',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [snapshots, hasTrend]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
        ticks: { color: CHART_DEFAULTS.color, font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
        ticks: { color: CHART_DEFAULTS.color, font: { family: 'Inter', size: 11 } },
      },
    },
  };

  /** Country change handler */
  const handleCountryChange = (e) => {
    actions.updateProfile({ country: e.target.value });
    actions.calculate();
  };

  const categoryKeys = ['transport', 'energy', 'diet', 'lifestyle'];

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* ── Hero Section ─────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="dashboard-title">
          <div className={styles.heroInner}>
            <span className={styles.ratingEmoji} aria-hidden="true">
              {comparison.rating.emoji}
            </span>
            <h1 id="dashboard-title" className={styles.heroTitle}>
              Your Carbon Footprint
            </h1>
            <div className={styles.heroValue}>
              <AnimatedCounter
                value={results.total}
                className={styles.bigNumber}
                decimals={0}
              />
              <span className={styles.heroUnit}>kg CO₂e / month</span>
            </div>
            <div
              className={styles.ratingBadge}
              style={{ background: comparison.rating.color + '22', color: comparison.rating.color }}
            >
              {comparison.rating.label}
            </div>
            <p className={styles.annualNote}>
              ≈ <AnimatedCounter value={results.annual} decimals={0} /> kg CO₂e per year
              ({(results.annual / 1000).toFixed(1)} tonnes)
            </p>
          </div>
        </section>

        {/* ── Insight Banner ───────────────────────────────────── */}
        {insight && (
          <div
            className={`${styles.insightBanner} ${styles[`insight${insight.emphasis}`]}`}
            role="status"
          >
            <p className={styles.insightText}>{insight.message}</p>
          </div>
        )}

        {/* ── Metric Cards ─────────────────────────────────────── */}
        <section className={styles.metricsGrid} aria-label="Category breakdown">
          {categoryKeys.map((key) => {
            const meta = CATEGORY_META[key];
            return (
              <MetricCard
                key={key}
                label={meta.label}
                value={breakdown[key]}
                unit="kg CO₂e"
                icon={meta.icon}
                color={meta.color}
                percentage={percentages[key]}
                subtitle={`${percentages[key]}% of total`}
              />
            );
          })}
        </section>

        {/* ── Tangibility Reality Check ─────────────────────────── */}
        <TangibleImpact />

        {/* ── Charts Row ───────────────────────────────────────── */}
        <div className={styles.chartsRow}>
          {/* Doughnut */}
          <section className={`glass-card ${styles.chartCard}`} aria-label="Emissions breakdown chart">
            <h3 className={styles.chartTitle}>Breakdown by Category</h3>
            <div className={styles.chartContainer} style={{ height: 300 }}>
              <Doughnut data={doughnutData} options={doughnutOptions} plugins={[centerTextPlugin]} />
            </div>
          </section>

          {/* Comparison */}
          <section className={`glass-card ${styles.chartCard}`} aria-label="Comparison chart">
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>How You Compare</h3>
              <div className={styles.countrySelect}>
                <label htmlFor="country-select" className="sr-only">
                  Select country
                </label>
                <select
                  id="country-select"
                  className="form-select"
                  value={profile.country}
                  onChange={handleCountryChange}
                  style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                >
                  {Object.entries(NATIONAL_AVERAGES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.flag} {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.chartContainer} style={{ height: 260 }}>
              <Bar data={comparisonData} options={barOptions} />
            </div>
          </section>
        </div>

        {/* ── Trend Chart ──────────────────────────────────────── */}
        {hasTrend && trendData && (
          <section className={`glass-card ${styles.chartCardWide}`} aria-label="Monthly trend chart">
            <h3 className={styles.chartTitle}>Monthly Trend</h3>
            <div className={styles.chartContainer} style={{ height: 250 }}>
              <Line data={trendData} options={lineOptions} />
            </div>
          </section>
        )}

        {/* ── Quick Actions ────────────────────────────────────── */}
        <section className={styles.quickActions} aria-label="Quick actions">
          <button
            id="quick-whatif"
            className={`btn btn-secondary ${styles.actionBtn}`}
            onClick={() => actions.navigate('simulator')}
          >
            <span aria-hidden="true">🔮</span>
            Explore What-If
          </button>
          <button
            id="quick-actions"
            className={`btn btn-primary ${styles.actionBtn}`}
            onClick={() => actions.navigate('actions')}
          >
            <span aria-hidden="true">🎯</span>
            View Action Plan
          </button>
          <button
            id="quick-achievements"
            className={`btn btn-secondary ${styles.actionBtn}`}
            onClick={() => actions.navigate('achievements')}
          >
            <span aria-hidden="true">🏆</span>
            Track Progress
          </button>
          <button
            id="quick-recalculate"
            className={`btn btn-secondary ${styles.actionBtn}`}
            onClick={() => actions.navigate('calculator')}
          >
            <span aria-hidden="true">🔄</span>
            Recalculate
          </button>
        </section>
      </div>
    </div>
  );
}
