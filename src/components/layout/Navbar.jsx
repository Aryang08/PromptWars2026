/**
 * CarbonLens — Navbar Component
 *
 * Glassmorphism navigation bar with responsive mobile menu.
 * Highlights the current active route.
 *
 * @module Navbar
 */

import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import styles from './Navbar.module.css';

/** Navigation items configuration */
const NAV_ITEMS = [
  { id: 'landing', label: 'Home', icon: '🏠' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'simulator', label: 'What-If', icon: '🔮' },
  { id: 'actions', label: 'Actions', icon: '🎯' },
  { id: 'achievements', label: 'Badges', icon: '🏆' },
];

/**
 * Top navigation bar component.
 *
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const { state, actions } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId) => {
    actions.navigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <button
          className={styles.logo}
          onClick={() => handleNavClick('landing')}
          aria-label="CarbonLens Home"
          id="nav-logo"
        >
          <span className={styles.logoIcon}>🌍</span>
          <span className={styles.logoText}>
            Carbon<span className={styles.logoAccent}>Lens</span>
          </span>
        </button>

        <ul
          className={`${styles.navList} ${mobileMenuOpen ? styles.navListOpen : ''}`}
          role="menubar"
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.id} role="none">
              <button
                id={`nav-${item.id}`}
                className={`${styles.navItem} ${
                  state.currentPage === item.id ? styles.navItemActive : ''
                }`}
                onClick={() => handleNavClick(item.id)}
                role="menuitem"
                aria-current={state.currentPage === item.id ? 'page' : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          id="nav-hamburger"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>
    </header>
  );
}
