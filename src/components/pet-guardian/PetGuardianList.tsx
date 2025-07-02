import styles from '@/app/admin/AdminPage.module.css';
import { useAuth } from '@/context/AuthContext';
import { usePetGuardians } from '@/hooks/guardians/usePetGuardians';
import { User } from '@/types/user';
import { ActionButton } from '../ui/ActionButton';
// Removed unused imports: api, PetGuardianSimpleData, useEffect

interface Props {
  onRegister?: () => void;
  onBack?: () => void;
}

export function PetGuardianList({ onRegister, onBack }: Props) {
  const { user, isReady } = useAuth();
  // Cast user to User if you are sure it matches the type, or adjust useAuth to return the correct type
  const { guardians, loading, error } = usePetGuardians({ isReady, user: user as User | null });

  // Handle initial loading state for user data
  if (!isReady) {
    return <div>Carregando dados do usuário...</div>;
  }

  // Handle loading state for guardians data
  if (loading) {
    return <p>Carregando tutores...</p>;
  }

  // Handle error state for guardians data
  if (error) {
    return <p className={styles.error}>Erro: {error}</p>;
  }

  return (
    <div className={styles.enterpriseList}>
      <div className={styles.enterpriseListHeader}>
        <h2>Tutores Cadastrados</h2>
        <div className={styles.actions}>
          {onRegister && (
            <ActionButton onClick={onRegister} variant="primary">
              Cadastrar Tutor
            </ActionButton>
          )}
          {onBack && (
            <ActionButton onClick={onBack} variant="secondary">
              Voltar
            </ActionButton>
          )}
        </div>
      </div>
      {!guardians.length && (
        <p>Nenhum tutor encontrado.</p>
      )}
      <ul className={styles.enterpriseUl}>
        {guardians.map(g => (
          <li key={g.id} className={styles.enterpriseItem}>
            <strong>{g.full_name}</strong> (<span>{g.email}</span>)<br />
            <span>Identificação: {g.cpf_cnpj || g.identification}</span><br />
            <span>Telefone: {g.phone}{g.optional_phone ? ` / ${g.optional_phone}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
