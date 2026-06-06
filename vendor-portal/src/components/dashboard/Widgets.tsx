import React from 'react';
import styles from '../../styles/Dashboard.module.css';

export const Widgets: React.FC = () => {
  return (
    <>
      {/* KPI Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>Total Sales YTD</p>
          <h3 className={styles.kpiValue}>$184,200</h3>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>Active Contracts</p>
          <h3 className={styles.kpiValue}>4</h3>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>Pending Invoices</p>
          <h3 className={styles.kpiValue}>$12,450</h3>
        </div>
      </div>

      {/* Main Grid Widgets */}
      <div className={styles.widgetGrid}>
        {/* Active Bids */}
        <div className={styles.widgetCard}>
          <h4>Active RFP Bids</h4>
          <div className={styles.widgetList}>
            <div className={styles.widgetItem}>
              <div>
                <h5>RFP-2026-0091</h5>
                <p>Office Supply Standing Contract</p>
              </div>
              <span className={styles.badgeSuccess}>Bid Submitted</span>
            </div>
            <div className={styles.widgetItem}>
              <div>
                <h5>RFP-2026-0084</h5>
                <p>Logistics Transport Contract</p>
              </div>
              <span className={styles.badgeWarning}>Under Review</span>
            </div>
          </div>
        </div>

        {/* Invoice Status Tracking */}
        <div className={styles.widgetCard}>
          <h4>Recent Invoices</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>INV-2026-0045</td>
                <td>$8,200</td>
                <td><span className={styles.badgeSuccess}>Paid</span></td>
              </tr>
              <tr>
                <td>INV-2026-0049</td>
                <td>$4,250</td>
                <td><span className={styles.badgeWarning}>Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
