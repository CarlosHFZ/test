import { api } from "@/lib/api";
import { CreateUserInput } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserInput) => api.post('/users/', data).then(res => res.data)
  });
}
