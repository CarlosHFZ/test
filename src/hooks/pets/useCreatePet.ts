import { api } from "@/lib/api";
import { CreatePetDto } from "@/types/pet";
import { useMutation } from "@tanstack/react-query";

export function useCreatePet() {
  return useMutation({
    mutationFn: (data: CreatePetDto) => api.post('/pets/pets/', data).then(res => res.data)
  });
}
