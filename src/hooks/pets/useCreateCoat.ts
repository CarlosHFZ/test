import { api } from "@/lib/api";
import { CreateCoatDto } from "@/types/pet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useCreateCoat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoatDto) => api.post('pets/coats/', data).then(res => res.data),

    onSuccess: () => {
      toast.success("Pelagem criada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ['coats'] });
    },
    onError: () => {
      toast.error('Erro ao criar a pelagem');
    }
  });
}
