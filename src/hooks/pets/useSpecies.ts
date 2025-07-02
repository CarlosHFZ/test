import { api } from '@/lib/api';
import { Species } from '@/types/pet';
import { useQuery } from '@tanstack/react-query';

const fetchSpecies = async (): Promise<Species[]> => {
  const { data } = await api.get('pets/species/');
  return data;
};

export function useSpecies() {
  return useQuery({
    queryKey: ['species'],
    queryFn: fetchSpecies
  });
}
