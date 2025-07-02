'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { PetGuardianSimpleData } from '@/types/pet-guardian';
import { UUID } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/Input';
import styles from './GuardianFinderModal.module.css';

interface GuardianFinderModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectGuardian: (guardian: PetGuardianSimpleData) => void;
}


function useGuardiansByEnterprise(enterpriseId: UUID) {
  return useQuery({
    queryKey: ['guardians', enterpriseId],
    queryFn: async () => {
      const response = await api.get<PetGuardianSimpleData[]>(`/pet-guardians/by-enterprise/${enterpriseId}/`);
      return response.data;
    },
    enabled: !!enterpriseId,
  });
}

export function GuardianFinderModal({ isOpen, onOpenChange, onSelectGuardian }: GuardianFinderModalProps) {
  const { user } = useAuth();
  const { data: guardians = [], isLoading, isError } = useGuardiansByEnterprise(user?.enterprise_id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuardians = useMemo(() => {
    if (!searchTerm) return guardians;
    return guardians.filter(g =>
      g.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.cpf_cnpj.includes(searchTerm)
    );
  }, [searchTerm, guardians]);

  const handleSelect = (guardian: PetGuardianSimpleData) => {
    onSelectGuardian(guardian);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Selecionar Tutor</DialogTitle>
          <DialogDescription>
            Busque pelo nome ou CPF e selecione o tutor desejado.
          </DialogDescription>
        </DialogHeader>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tableContainer}>
          {isLoading && <p>Carregando tutores...</p>}
          {isError && <p className={styles.errorText}>Não foi possível carregar os tutores.</p>}
          {!isLoading && !isError && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Identificação</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuardians.length > 0 ? (
                  filteredGuardians.map((guardian) => (
                    <tr key={guardian.id}>
                      <td>{`${guardian.full_name}`}</td>
                      <td>{guardian.cpf_cnpj || guardian.identification}</td>
                      <td>
                        <button onClick={() => handleSelect(guardian)} className={styles.selectButton}>
                          Selecionar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Nenhum tutor encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
