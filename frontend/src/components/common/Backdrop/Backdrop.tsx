import React from 'react';
import styles from './Backdrop.module.scss';

interface BackdropProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Backdrop: React.FC<BackdropProps> = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};