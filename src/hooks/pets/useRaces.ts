// src/hooks/pets/useRaces.ts
import { api } from '@/lib/api';
import { Races } from '@/types/pet';
import { useQuery } from '@tanstack/react-query';

const fetchRacesBySpecies = async (speciesId: number): Promise<Races[]> => {
  const { data } = await api.get(`pets/races/?species_id=${speciesId}`);
  return data;
};

export function useRaces(speciesId: number | null) {
  return useQuery({
    queryKey: ['races', speciesId],
    queryFn: () => fetchRacesBySpecies(speciesId!),
    enabled: !!speciesId,
  });
}
