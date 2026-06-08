# 🌍 CarbonLens — Carbon Footprint Awareness Platform

> Track, understand, and reduce your carbon footprint through personalized insights, interactive simulations, and actionable recommendations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-CarbonLens-22c55e?style=for-the-badge)](https://prompt-wars2026.vercel.app/)

## 📋 Challenge Vertical

**Carbon Footprint Awareness Platform** — A smart, dynamic platform that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

---

## 🎯 Approach & Logic

### Problem
Individuals lack awareness of their personal contribution to global carbon emissions. Existing calculators are static, one-time tools that provide little motivation for sustained behavioral change.

### Solution
CarbonLens takes a **gamified, interactive approach**:

1. **Smart Calculator**: Multi-step wizard covering 4 emission categories (Transport, Energy, Diet, Lifestyle) with EPA/IPCC-sourced emission factors
2. **Visual Dashboard**: Interactive Chart.js visualizations showing breakdown, comparisons against national/global averages, and trends over time
3. **What-If Simulator**: Drag sliders to explore how lifestyle changes affect your footprint in real-time
4. **Personalized Action Plans**: AI-powered rule engine ranks recommendations by impact and feasibility
5. **Gamification**: Badges, levels, streaks, and points to sustain engagement
6. **100% Client-Side**: All data stays in localStorage — zero server costs, complete privacy

### Emission Factor Methodology
All emission factors are sourced from:
- **EPA GHG Emission Factors Hub** (2024) — transportation, electricity
- **IPCC AR6** (2023) — global warming potentials
- **DEFRA Conversion Factors** (2024) — UK benchmarks
- **Our World in Data** — diet comparisons, per-capita averages

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🧮 **Smart Calculator** | 4-step wizard with visual card selectors, sliders, and real-time validation |
| 📊 **Dashboard** | Animated counters, doughnut/bar/line charts, comparison with 11 countries |
| 🔮 **What-If Simulator** | Drag category sliders to see projected impact instantly |
| 🎯 **Action Plans** | 25+ personalized recommendations with difficulty ratings and savings estimates |
| 🏆 **Gamification** | 14 badges, 8 levels, streak tracking, and points system |
| 🔒 **Privacy First** | 100% client-side — no accounts, no servers, no tracking |
| ♿ **Accessible** | WCAG 2.1 AA — keyboard navigation, screen reader support, reduced motion |
| 📱 **Responsive** | Mobile-first design, works on all screen sizes |
| 🌙 **Dark Mode** | Beautiful dark theme with glassmorphism effects |

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|:---|:---|:---|
| Build Tool | Vite 5 | Fast HMR, tiny output, tree-shaking |
| UI Framework | React 19 | Component modularity, testability |
| Styling | Vanilla CSS (CSS Modules) | Zero bloat, maximum control |
| Charts | Chart.js 4 + react-chartjs-2 | Lightweight, accessible canvas charts |
| State | React Context + useReducer | Predictable state, no extra deps |
| Persistence | localStorage | Zero backend, complete privacy |
| Testing | Vitest | 37 unit tests, native Vite integration |
| Deployment | Vercel | Auto-deploy, global CDN |

---

## 🏗️ Architecture

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Router + AppProvider
├── context/
│   └── AppContext.jsx          # Centralized state (useReducer + localStorage)
├── data/
│   └── emissionFactors.js      # EPA/IPCC emission factor database
├── utils/
│   ├── calculator.js           # Pure emission calculation functions
│   ├── recommendations.js      # Smart rule-based recommendation engine
│   ├── badges.js               # Gamification logic (badges, levels, streaks)
│   └── __tests__/              # 37 unit tests
├── components/
│   ├── layout/                 # Navbar, Footer
│   ├── calculator/             # 4-step wizard with step components
│   ├── dashboard/              # Dashboard, MetricCard
│   ├── simulator/              # What-If Simulator
│   ├── insights/               # Action Plan
│   ├── profile/                # Achievements & Badges
│   └── common/                 # AnimatedCounter, ProgressRing
├── pages/                      # Page wrappers with empty states
└── styles/
    ├── variables.css            # Design tokens
    └── global.css               # Reset, utilities, animations
```

---

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/carbonlens.git
cd carbonlens

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npx vitest run

# Build for production
npm run build
```

---

## 🧪 Testing

```bash
# Run all tests
npx vitest run

# Run with coverage
npx vitest run --coverage
```

**37 tests** cover:
- All emission calculator functions (transport, energy, diet, lifestyle)
- Edge cases (zero values, extreme inputs, missing data)
- Recommendation generation, ranking, and filtering
- Insight summary logic
- Emission comparison against global averages and Paris targets

---

## 🌍 Assumptions

1. Emission factors are based on global/US averages; actual values vary by region
2. Diet emissions use monthly averages from meta-studies, not per-meal tracking
3. Flight emissions include a 1.9x radiative forcing multiplier for high-altitude effects
4. Renewable energy percentage applies as a linear offset to total energy emissions
5. All data persists in browser localStorage — clearing browser data resets the app
6. The smart recommendation engine uses rule-based conditions, not ML

---

## ♿ Accessibility

- **WCAG 2.1 AA** compliant color contrast ratios
- Skip-to-content navigation link
- All form inputs have associated `<label>` elements
- Interactive elements use proper ARIA roles (`radiogroup`, `radio`, `progressbar`)
- Keyboard-navigable throughout (Tab, Enter, Space)
- `prefers-reduced-motion` media query respected
- Screen reader announcements via `aria-live` regions

---

## 📊 Evaluation Criteria Coverage

| Criteria | Implementation |
|:---|:---|
| **Code Quality** | Modular component architecture, CSS Modules, JSDoc comments, pure utility functions, consistent design tokens |
| **Security** | 100% client-side (no server), no API keys, no user data transmitted, CSP-compatible |
| **Efficiency** | ~160 KB gzipped bundle, lazy chart rendering, memoized computations, code splitting |
| **Testing** | 37 unit tests with Vitest, edge case coverage, pure function design for testability |
| **Accessibility** | WCAG 2.1 AA, keyboard navigation, screen reader support, reduced motion, semantic HTML |

---

## 📄 License

MIT © CarbonLens

---

*Built for PromptWars Virtual — Main Challenge 3*
