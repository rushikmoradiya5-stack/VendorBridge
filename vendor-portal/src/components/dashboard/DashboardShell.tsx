import React from 'react';
import { Widgets } from './Widgets';
import styles from '../../styles/Dashboard.module.css';

interface DashboardShellProps {
  onLogout: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ onLogout }) => {
  return (
    <div className={styles.layout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/logo.jpg" alt="Logo" className={styles.brandLogoImage} />
          <div>
            <h3>VendorBridge</h3>
            <p>Portal Hub</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navLink} ${styles.active}`}>Dashboard</button>
          <button className={styles.navLink}>Bid Invitations</button>
          <button className={styles.navLink}>Invoices</button>
          <button className={styles.navLink}>Profile Settings</button>
        </nav>

        <button onClick={onLogout} className={styles.logoutButton}>Sign Out</button>
      </aside>

      {/* Main Content Pane */}
      <div className={styles.content}>
        <header className={styles.topbar}>
          <h1>Supplier Dashboard</h1>
          <p>Welcome back, Supplier Node #0212</p>
        </header>

        <main className={styles.dashboardGrid}>
          <Widgets />
        </main>
      </div>
    </div>
  );
};
