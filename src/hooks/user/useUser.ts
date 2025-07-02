import { api } from '@/lib/api';
import { UserSimpleData } from '@/types/user';
import { useEffect, useState } from 'react';

interface UseUsersOptions {
  isReady: boolean;
  user: {
    role: string;
    enterprise_id: string | null;
  } | null;
  // Adicione este parâmetro se quiser que um ADMIN possa filtrar
  filterByEnterpriseId?: string | null;
}

interface UseUsersResult {
  users: UserSimpleData[];
  loading: boolean;
  error: string | null;
}

export function useUsers({ isReady, user, filterByEnterpriseId }: UseUsersOptions): UseUsersResult {
  const [users, setUsers] = useState<UserSimpleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A condição de guarda continua a mesma, é uma ótima prática.
    if (!isReady || !user) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // A URL base é sempre a mesma. O backend decide o que retornar.
    let url = '/users/';

    // Apenas se o usuário for ADMIN e um filtro for explicitamente passado,
    // adicionamos o parâmetro de query.
    if (user.role === 'ADMIN' && filterByEnterpriseId) {
      url += `?enterprise_id=${filterByEnterpriseId}`;
    }

    api.get<UserSimpleData[]>(url)
      .then(res => {
        setUsers(res.data);
      })
      .catch(() => {
        setError('Erro ao buscar usuários');
      })
      .finally(() => {
        setLoading(false);
      });

  // O hook agora também reage a mudanças no filtro
  }, [isReady, user, filterByEnterpriseId]);

  return { users, loading, error };
}
