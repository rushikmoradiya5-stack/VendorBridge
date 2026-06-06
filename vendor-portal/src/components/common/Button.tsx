import React from 'react';
import styles from '../../styles/Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'green';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'cyan',
  className,
  ...props
}) => {
  const variantClass = variant === 'green' ? styles.green : styles.cyan;
  return (
    <button
      className={`${styles.button} ${variantClass} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
