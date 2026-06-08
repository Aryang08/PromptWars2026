/**
 * CarbonLens — Main Application Component
 *
 * Handles client-side routing and page rendering.
 * Uses a simple hash-free state-based router via AppContext.
 *
 * @module App
 */

import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CalculatorPage from './pages/CalculatorPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SimulatorPage from './pages/SimulatorPage.jsx';
import ActionsPage from './pages/ActionsPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import './styles/global.css';

/**
 * Page router — renders the active page based on state.
 *
 * @returns {JSX.Element}
 */
function PageRouter() {
  const { state } = useApp();

  // Instantly scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.currentPage]);

  const renderPage = () => {
    switch (state.currentPage) {
      case 'calculator':
        return <CalculatorPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'actions':
        return <ActionsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'landing':
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      {renderPage()}
      <Footer />
    </>
  );
}

/**
 * Root application component.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.glass-card, .btn');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AppProvider>
      <PageRouter />
    </AppProvider>
  );
}
