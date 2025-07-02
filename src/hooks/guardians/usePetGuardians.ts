import { api } from '@/lib/api';
import { PetGuardianSimpleData } from '@/types/pet-guardian';
import { useEffect, useState } from 'react';

interface UsePetGuardiansOptions {
  isReady: boolean;
  user: {
    role: string;
    enterprise_id: string | null;
  } | null;
  filterByEnterpriseId?: string | null;
}

interface UsePetGuardiansResult {
  guardians: PetGuardianSimpleData[];
  loading: boolean;
  error: string | null;
}

export function usePetGuardians({ isReady, user, filterByEnterpriseId }: UsePetGuardiansOptions): UsePetGuardiansResult {
  const [guardians, setGuardians] = useState<PetGuardianSimpleData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !user) {
      setGuardians([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let apiUrl = '/pet-guardians/';

    if (user.role === 'ADMIN' && filterByEnterpriseId) {
      apiUrl += `?enterprise_id=${filterByEnterpriseId}`;
    }

    api.get<PetGuardianSimpleData[]>(apiUrl)
      .then(res => setGuardians(res.data))
      .catch(() => setError('Erro ao buscar tutores'))
      .finally(() => setLoading(false));

  }, [isReady, user, filterByEnterpriseId]);

  return { guardians, loading, error };
}
