import React, { useState } from 'react';
import { Button } from '../common/Button';
import styles from '../../styles/Auth.module.css';

interface RegistrationBoxProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegistrationBox: React.FC<RegistrationBoxProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (companyName.trim().length < 3) {
      setError('Company name must contain at least 3 characters.');
      return;
    }
    if (!email.includes('@')) {
      setError('Invalid email address formatting.');
      return;
    }
    if (taxId.trim().length < 5) {
      setError('Tax ID is required for verification.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    onRegisterSuccess();
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.header}>
        <img src="/logo.jpg" alt="Logo" className={styles.logoImage} />
        <div>
          <h2>Register Supplier</h2>
          <p>Submit profile credentials for onboarding</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className={styles.form}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.fieldGroup}>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Logistics"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Onboarding Contact Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@acme.com"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Tax Identification Code (EIN/TIN)</label>
          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="XX-XXXXXXX"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Security Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" variant="green">Register Credentials</Button>
      </form>

      <div className={styles.footer}>
        <p>Already registered in the ERP?</p>
        <button onClick={onNavigateToLogin} className={styles.linkButton}>Sign In</button>
      </div>
    </div>
  );
};
