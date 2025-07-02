'use client';

import adminStyles from '@/app/admin/AdminPage.module.css';
import { useAuth } from '@/context/AuthContext';
import { usePets } from '@/hooks/pets/usePets';
import { ActionButton } from '../ui/ActionButton';

interface Props {
  onRegister?: () => void;
  onBack?: () => void;
}

export function PetList({ onRegister, onBack }: Props) {
  const { user, isReady } = useAuth();
  const { pets, loading, error } = usePets({ isReady, user });


  if (error) return <p className={adminStyles.error}>{error}</p>;
  if (loading) return <p>Carregando pets...</p>;

  return (
    // Reutilizamos os mesmos estilos para manter a consistência visual
    <div className={adminStyles.enterpriseList}>
      <div className={adminStyles.enterpriseListHeader}>
        <h2>Pets Cadastrados</h2>
        <div className={adminStyles.actions}>
          {onRegister && (
            <ActionButton onClick={onRegister} variant="primary">
              Cadastrar Pet
            </ActionButton>
          )}
          {onBack && (
            <ActionButton onClick={onBack} variant="secondary">
              Voltar
            </ActionButton>
          )}
        </div>
      </div>

      {!pets.length ? (
        <p>Nenhum pet encontrado.</p>
      ) : (
        <ul className={adminStyles.enterpriseUl}>
          {pets.map(pet => (
            <li key={pet.id} className={adminStyles.enterpriseItem}>
              <strong>{pet.name}</strong> ({pet.species.name} - {pet.race.name})<br />
              <span>Tutor: {pet.tutor.full_name}</span><br />
              <span>Sexo: {pet.sex}</span><br />
              <span>Tag: {pet.tagName}  ({pet.tagColor})</span><br />
              <span>Peso: {pet.weight || 0 } kg</span><br />
              <span>Observação: {pet.observation}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
