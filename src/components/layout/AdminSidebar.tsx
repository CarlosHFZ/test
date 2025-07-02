import styles from '@/app/admin/AdminPage.module.css';
import { getAuthUser } from '@/lib/authStorage';
import { PageMode } from '@/types/PageMode';

export interface AdminSidebarProps {
  onNav: (mode: PageMode) => void;
  current: PageMode;
  onLogout: () => void;
}


export function AdminSidebar({ onNav, current, onLogout }: AdminSidebarProps) {
  const user = getAuthUser()

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Pet Health</h2>
      <nav className={styles.nav}>
        {user?.role === "ADMIN" && (
          <button
            className={`${styles.buttonPrimary} ${styles.buttonLarge} ${current === 'enterprises_list' ? styles.active : ''}`}
            onClick={() => onNav('enterprises_list')}
          >
            Gerenciar Empresas
          </button>
        )}
        <button
          className={`${styles.buttonPrimary} ${styles.buttonLarge} ${current === 'users_list' ? styles.active : ''}`}
          onClick={() => onNav('users_list')}
        >
          Gerenciar Usuários
        </button>
        <button
          className={`${styles.buttonPrimary} ${styles.buttonLarge} ${current === 'users_list' ? styles.active : ''}`}
          onClick={() => onNav('guardians_list')}
        >
          Gerenciar Tutores
        </button>
        <button
          className={`${styles.buttonPrimary} ${styles.buttonLarge} ${current === 'users_list' ? styles.active : ''}`}
          onClick={() => onNav('pets_list')}
        >
          Gerenciar Pets
        </button>

      </nav>
      <div className={styles.logoutArea}>
        <button
          onClick={onLogout}
          className={`${styles.buttonLogout} ${styles.buttonLogoutHover} ${styles.buttonLarge}`}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
