// src/hooks/pets/useCreateRace.ts
import { api } from "@/lib/api";
import { CreateRaceDto, Races } from "@/types/pet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Função que envia os dados para a API
const createRace = async (data: CreateRaceDto): Promise<Races> => {
  const response = await api.post<Races>('pets/races/', data);
  return response.data;
};

export function useCreateRace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRace,
    onSuccess: () => {
      toast.success("Raça criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['races'] });
    },
    onError: () => {
      toast.error("Erro ao criar a raça.");
    }
  });
}
