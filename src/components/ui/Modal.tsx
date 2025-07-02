// components/Modal.tsx
'use client';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose(): void;
  children: ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen) return null;
  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.content}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
