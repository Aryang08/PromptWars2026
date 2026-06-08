/**
 * CarbonLens — Landing Page
 *
 * Rich hero with SVG earth illustration, animated particles,
 * "How It Works" section, stats, features, and bottom CTA.
 *
 * @module LandingPage
 */

import { useApp } from '../context/AppContext.jsx';
import styles from './LandingPage.module.css';

/** Feature cards data */
const FEATURES = [
  {
    icon: '🧮',
    title: 'Smart Calculator',
    description:
      'Comprehensive footprint analysis covering transport, energy, diet, and lifestyle with data from EPA and IPCC.',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.02))',
  },
  {
    icon: '📊',
    title: 'Visual Dashboard',
    description:
      'Beautiful interactive charts showing your breakdown, trends over time, and how you compare globally.',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.02))',
  },
  {
    icon: '🔮',
    title: 'What-If Simulator',
    description:
      'Drag sliders to explore scenarios and see in real-time how lifestyle changes reduce your impact.',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.02))',
  },
  {
    icon: '🎯',
    title: 'Action Plans',
    description:
      'Personalized recommendations ranked by impact, with difficulty ratings and estimated savings.',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.02))',
  },
  {
    icon: '🏆',
    title: 'Gamification',
    description:
      'Earn badges, level up, and maintain streaks to stay motivated on your sustainability journey.',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.02))',
  },
  {
    icon: '🔒',
    title: '100% Private',
    description:
      'All data stays in your browser. No accounts, no servers, no tracking. Your footprint is yours alone.',
    gradient: 'linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.02))',
  },
];

/** Global emission stats */
const STATS = [
  { value: '40B+', label: 'Tonnes CO₂ emitted annually', icon: '🌡️' },
  { value: '4.7', label: 'Tonnes per person globally', icon: '👤' },
  { value: '50%', label: 'Reduction needed by 2030', icon: '📉' },
  { value: '1', label: 'Planet. No backup plan.', icon: '🌍' },
];

/** How It Works steps */
const STEPS = [
  {
    number: '01',
    title: 'Tell Us Your Habits',
    description: 'Answer simple questions about your transport, energy, diet, and lifestyle in our 4-step calculator.',
    icon: '📝',
    color: '#3b82f6',
  },
  {
    number: '02',
    title: 'See Your Impact',
    description: 'Get an instant breakdown with charts comparing you to national and global averages.',
    icon: '📊',
    color: '#f59e0b',
  },
  {
    number: '03',
    title: 'Explore What-If',
    description: 'Drag sliders to simulate lifestyle changes and see how much CO₂ you could save.',
    icon: '🔮',
    color: '#8b5cf6',
  },
  {
    number: '04',
    title: 'Take Action',
    description: 'Follow personalized recommendations, track your progress, and earn badges along the way.',
    icon: '🚀',
    color: '#22c55e',
  },
];

/**
 * SVG illustration of the Earth with atmosphere rings.
 * Pure CSS/SVG — no image files needed.
 */
function EarthIllustration() {
  return (
    <div className={styles.earthContainer} aria-hidden="true">
      {/* Animated particles around earth */}
      <div className={styles.particle} style={{ '--delay': '0s', '--x': '-60px', '--y': '-80px' }}>💨</div>
      <div className={styles.particle} style={{ '--delay': '1s', '--x': '70px', '--y': '-50px' }}>🏭</div>
      <div className={styles.particle} style={{ '--delay': '2s', '--x': '80px', '--y': '40px' }}>🚗</div>
      <div className={styles.particle} style={{ '--delay': '3s', '--x': '-70px', '--y': '60px' }}>✈️</div>
      <div className={styles.particle} style={{ '--delay': '0.5s', '--x': '-90px', '--y': '0px' }}>🔥</div>
      <div className={styles.particle} style={{ '--delay': '2.5s', '--x': '50px', '--y': '-70px' }}>⚡</div>

      {/* Atmosphere rings */}
      <div className={styles.atmosphereRing} style={{ '--ring-size': '240px', '--ring-opacity': '0.06' }} />
      <div className={styles.atmosphereRing} style={{ '--ring-size': '200px', '--ring-opacity': '0.10' }} />
      <div className={styles.atmosphereRing} style={{ '--ring-size': '160px', '--ring-opacity': '0.15' }} />

      {/* Earth SVG */}
      <svg className={styles.earthSvg} viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <radialGradient id="earth-grad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#1e8449" />
            <stop offset="100%" stopColor="#0f3d1e" />
          </radialGradient>
          <radialGradient id="ocean-grad" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean base */}
        <circle cx="60" cy="60" r="54" fill="url(#ocean-grad)" filter="url(#glow)" />

        {/* Continents (simplified) */}
        <ellipse cx="45" cy="38" rx="18" ry="12" fill="url(#earth-grad)" opacity="0.9" />
        <ellipse cx="70" cy="42" rx="12" ry="8" fill="url(#earth-grad)" opacity="0.85" />
        <ellipse cx="55" cy="65" rx="10" ry="14" fill="url(#earth-grad)" opacity="0.8" />
        <ellipse cx="80" cy="62" rx="8" ry="6" fill="url(#earth-grad)" opacity="0.75" />
        <ellipse cx="35" cy="58" rx="6" ry="9" fill="url(#earth-grad)" opacity="0.7" />

        {/* Cloud wisps */}
        <ellipse cx="38" cy="30" rx="14" ry="3" fill="white" opacity="0.15" />
        <ellipse cx="72" cy="50" rx="12" ry="2.5" fill="white" opacity="0.12" />
        <ellipse cx="50" cy="75" rx="10" ry="2" fill="white" opacity="0.1" />

        {/* Atmosphere edge glow */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(74,222,128,0.2)" strokeWidth="3" />
        <circle cx="60" cy="60" r="57" fill="none" stroke="rgba(74,222,128,0.08)" strokeWidth="2" />
      </svg>
    </div>
  );
}

/**
 * Decorative carbon molecule illustration.
 */
function CarbonMolecule() {
  return (
    <svg className={styles.moleculeSvg} viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">
      <defs>
        <radialGradient id="atom-grad">
          <stop offset="0%" stopColor="rgba(34,197,94,0.4)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0.05)" />
        </radialGradient>
      </defs>
      {/* CO2 molecule */}
      {/* Central carbon */}
      <circle cx="100" cy="100" r="18" fill="url(#atom-grad)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
      <text x="100" y="105" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="14" fontWeight="600" fontFamily="Inter">C</text>
      {/* Left oxygen */}
      <line x1="82" y1="100" x2="52" y2="100" stroke="rgba(239,68,68,0.2)" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="40" cy="100" r="14" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
      <text x="40" y="105" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="12" fontWeight="600" fontFamily="Inter">O</text>
      {/* Right oxygen */}
      <line x1="118" y1="100" x2="148" y2="100" stroke="rgba(239,68,68,0.2)" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="160" cy="100" r="14" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
      <text x="160" y="105" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="12" fontWeight="600" fontFamily="Inter">O</text>
      {/* Electron orbits */}
      <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="1" transform="rotate(-20 100 100)" />
      <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="1" transform="rotate(20 100 100)" />
    </svg>
  );
}

/**
 * Landing page component.
 *
 * @returns {JSX.Element}
 */
export default function LandingPage() {
  const { actions } = useApp();

  return (
    <main className={styles.landing} id="main-content">
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroBackground}>
          <div className={styles.orb1} aria-hidden="true" />
          <div className={styles.orb2} aria-hidden="true" />
          <div className={styles.orb3} aria-hidden="true" />
          {/* Grid pattern overlay */}
          <div className={styles.gridPattern} aria-hidden="true" />
        </div>

        <div className={styles.heroContent}>
          <EarthIllustration />

          <h1 id="hero-title" className={styles.heroTitle}>
            Understand Your
            <span className={styles.heroHighlight}> Carbon Footprint</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Track, visualize, and reduce your environmental impact with
            personalized insights and actionable recommendations powered by
            real emission data.
          </p>

          <div className={styles.heroCta}>
            <button
              id="cta-start-calculator"
              className={`btn btn-primary btn-lg ${styles.ctaButton}`}
              onClick={() => actions.navigate('calculator')}
            >
              <span aria-hidden="true">🧮</span>
              Calculate My Footprint
            </button>
            <button
              id="cta-learn-more"
              className={`btn btn-secondary btn-lg ${styles.ctaButtonSecondary}`}
              onClick={() => {
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More ↓
            </button>
          </div>

          {/* Trust badges */}
          <div className={styles.trustBadges}>
            <span className={styles.trustItem}>✅ Free forever</span>
            <span className={styles.trustDivider}>•</span>
            <span className={styles.trustItem}>🔒 No sign-up needed</span>
            <span className={styles.trustDivider}>•</span>
            <span className={styles.trustItem}>⚡ Results in 3 minutes</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats} aria-label="Global emission statistics">
        <div className={styles.statsHeader}>
          <h2 className={styles.statsTitle}>The Climate Crisis in Numbers</h2>
          <p className={styles.statsSubtitle}>
            Understanding the scale of the problem is the first step to solving it.
          </p>
        </div>
        <div className={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <div
              key={index}
              className={styles.statCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className={styles.statIcon} aria-hidden="true">
                {stat.icon}
              </span>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className={styles.howItWorks}
        id="how-it-works"
        aria-labelledby="how-title"
      >
        <div className={styles.howInner}>
          <h2 id="how-title" className={styles.sectionTitle}>
            How It <span className={styles.heroHighlight}>Works</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Four simple steps to understand and reduce your environmental impact.
          </p>

          <div className={styles.stepsGrid}>
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={styles.stepCard}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className={styles.stepConnector} aria-hidden="true" />
                )}

                <div
                  className={styles.stepNumber}
                  style={{ background: step.color + '18', color: step.color, borderColor: step.color + '30' }}
                >
                  {step.number}
                </div>

                <div className={styles.stepIconBubble} style={{ background: step.color + '10' }}>
                  <span className={styles.stepIcon} aria-hidden="true">{step.icon}</span>
                </div>

                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={styles.features}
        id="features-section"
        aria-labelledby="features-title"
      >
        <div className={styles.featuresInner}>
          {/* Decorative molecule */}
          <div className={styles.moleculeDecor} aria-hidden="true">
            <CarbonMolecule />
          </div>

          <h2 id="features-title" className={styles.sectionTitle}>
            Everything You Need to
            <span className={styles.heroHighlight}> Make a Difference</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            CarbonLens combines science-backed emission data with an engaging
            experience to help you understand and reduce your environmental impact.
          </p>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className={`glass-card ${styles.featureCard}`}
                style={{ animationDelay: `${index * 0.1}s`, background: feature.gradient }}
              >
                <div className={styles.featureIconWrap}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    {feature.icon}
                  </span>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Banner */}
      <section className={styles.dataBanner} aria-label="Data sources">
        <div className={styles.dataBannerInner}>
          <h3 className={styles.dataBannerTitle}>
            Powered by Trusted Science
          </h3>
          <div className={styles.dataSources}>
            <div className={styles.dataSource}>
              <span className={styles.dataSourceIcon}>🏛️</span>
              <span className={styles.dataSourceName}>EPA</span>
              <span className={styles.dataSourceLabel}>Emission Factors Hub</span>
            </div>
            <div className={styles.dataSource}>
              <span className={styles.dataSourceIcon}>🌐</span>
              <span className={styles.dataSourceName}>IPCC</span>
              <span className={styles.dataSourceLabel}>AR6 Assessment</span>
            </div>
            <div className={styles.dataSource}>
              <span className={styles.dataSourceIcon}>📊</span>
              <span className={styles.dataSourceName}>Our World in Data</span>
              <span className={styles.dataSourceLabel}>Per-capita benchmarks</span>
            </div>
            <div className={styles.dataSource}>
              <span className={styles.dataSourceIcon}>🇬🇧</span>
              <span className={styles.dataSourceName}>DEFRA</span>
              <span className={styles.dataSourceLabel}>Conversion Factors</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className={styles.ctaBottom} aria-label="Call to action">
        <div className={styles.ctaBottomInner}>
          {/* Decorative leaf SVGs */}
          <div className={styles.ctaDecor} aria-hidden="true">
            <span className={styles.leafLeft}>🍃</span>
            <span className={styles.leafRight}>🌿</span>
          </div>

          <h2 className={styles.ctaBottomTitle}>
            Ready to Start Your Journey?
          </h2>
          <p className={styles.ctaBottomText}>
            It takes less than 3 minutes to calculate your footprint and get
            personalized recommendations. No sign-up required.
          </p>
          <button
            id="cta-bottom-start"
            className={`btn btn-primary btn-lg ${styles.ctaButton}`}
            onClick={() => actions.navigate('calculator')}
          >
            <span aria-hidden="true">🚀</span>
            Get Started — It&apos;s Free
          </button>
        </div>
      </section>
    </main>
  );
}
