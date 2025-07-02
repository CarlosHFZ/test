// src/components/UserList.tsx
import styles from '@/app/admin/AdminPage.module.css';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/hooks/user/useUser';
import { ActionButton } from '../ui/ActionButton';

interface Props {
  onRegister?: () => void;
  onBack?: () => void;
}

export function UserList({ onRegister, onBack }: Props) {
  const { user, isReady } = useAuth();
  const { users, loading, error } = useUsers({ isReady, user });


  if (loading) return <p>Carregando usuários...</p>;
  if (!users.length) return <p>Nenhum usuário encontrado.</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.enterpriseList}>
      <div className={styles.enterpriseListHeader}>
        <h2>Usuários Cadastrados</h2>
        <div className={styles.actions}>
          {onRegister && (
              <ActionButton onClick={onRegister} variant="primary">
                Cadastrar Usuario
              </ActionButton>
          )}
          {onBack && (
            <ActionButton onClick={onBack} variant='secondary'>
              Voltar
            </ActionButton>
          )}
        </div>
      </div>
      <ul className={styles.enterpriseUl}>
        {users.map(u => (
          <li key={u.id} className={styles.enterpriseItem}>
            <strong>{u.full_name}</strong> ({u.email})<br />
            <span>Role: {u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
