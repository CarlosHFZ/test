// src/components/layout/MainPanel.tsx
import styles from '@/app/admin/AdminPage.module.css';
import { ReactNode } from 'react';

export function MainPanel({ children }: { children: ReactNode }) {
  return <main className={styles.mainPanel}>{children}</main>;
}
