import { api } from "@/lib/api";
import { CreateSpecieDto } from '@/types/pet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useCreateSpecie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSpecieDto) => api.post('pets/species/', data).then(res => res.data),

    onSuccess: () => {
      toast.success("Espécie criada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ['species'] });
    },
    onError: () => {
      toast.error("Erro ao criar a espécie.");
    }
  });
}
