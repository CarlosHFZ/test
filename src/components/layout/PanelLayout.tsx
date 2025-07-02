// src/components/layout/PanelLayout.tsx
import styles from '@/app/admin/AdminPage.module.css';
import { ReactNode } from 'react';
import { ActionButton } from '../ui/ActionButton';

interface PanelLayoutProps {
  logo: ReactNode;
  nav: ReactNode;
  children: ReactNode;
  logout: () => void;
}

export function PanelLayout({ logo, nav, children, logout }: PanelLayoutProps) {
  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        {logo}
        <nav className={styles.nav}>
          {nav}
        </nav>
        <div className={styles.logoutArea}>
            <ActionButton onClick={logout} >
              Sair
            </ActionButton>
        </div>
      </aside>
      <main className={styles.mainPanel}>
        {children}
      </main>
    </div>
  );
}
