/**
 * CarbonLens — Footer Component
 *
 * @module Footer
 */

import styles from './Footer.module.css';

/**
 * Application footer.
 *
 * @returns {JSX.Element}
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <span className={styles.logo}>🌍 CarbonLens</span>
            <p className={styles.tagline}>
              Track, understand, and reduce your carbon footprint.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Data Sources</h4>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href="https://www.epa.gov/climateleadership/ghg-emission-factors-hub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    EPA Emission Factors
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ipcc.ch/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    IPCC Reports
                  </a>
                </li>
                <li>
                  <a
                    href="https://ourworldindata.org/co2-emissions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Our World in Data
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} CarbonLens. Built for a greener future.
          </p>
          <p className={styles.disclaimer}>
            Emission estimates are approximate and based on publicly available data.
          </p>
        </div>
      </div>
    </footer>
  );
}
