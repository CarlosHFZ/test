import { api } from "@/lib/api";
import { CreatePetGuardianInput } from "@/types/pet-guardian";
import { useMutation } from "@tanstack/react-query";

export function useCreateGuardian() {
  return useMutation({
    mutationFn: (data: CreatePetGuardianInput) => api.post('/pet-guardians/', data).then(res => res.data)
  });
}
