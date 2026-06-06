import React, { useState } from 'react';
import { Button } from '../common/Button';
import styles from '../../styles/Auth.module.css';

interface LoginBoxProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginBox: React.FC<LoginBoxProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side Validation
    if (!email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    // Simulate authentication
    onLoginSuccess();
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.header}>
        <img src="/logo.jpg" alt="Logo" className={styles.logoImage} />
        <div>
          <h2>Vendor Portal</h2>
          <p>Sign in to your supplier dashboard</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.fieldGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="supplier@company.com"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" variant="cyan">Authenticate Access</Button>
      </form>

      <div className={styles.footer}>
        <p>Don't have an onboarding profile?</p>
        <button onClick={onNavigateToRegister} className={styles.linkButton}>Create Portal Profile</button>
      </div>
    </div>
  );
};
