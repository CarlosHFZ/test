import { api } from '@/lib/api';
import { Pet } from '@/types/pet';
import { useEffect, useState } from 'react';

type UserForHook = {
  role: string;
} | null;

interface UsePetsOptions {
  isReady: boolean;
  user: UserForHook;
  filterByEnterpriseId?: string | null;
}

interface UsePetsResult {
  pets: Pet[];
  loading: boolean;
  error: string | null;
}


export function usePets({ isReady, user, filterByEnterpriseId }: UsePetsOptions): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !user) {
      setPets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let apiUrl = '/pets/pets/';

    if (user.role === 'ADMIN' && filterByEnterpriseId) {
      apiUrl += `?enterprise_id=${filterByEnterpriseId}`;
    }

    api.get<Pet[]>(apiUrl)
      .then(res => {
        setPets(res.data);
      })
      .catch(() => {
        setError('Erro ao buscar os pets.');
      })
      .finally(() => {
        setLoading(false);
      });

  }, [isReady, user, filterByEnterpriseId]);

  return { pets, loading, error };
}
