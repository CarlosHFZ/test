import { api } from "@/lib/api";
import { CepData } from "@/types/cep";
import { ApiError } from "@/types/error";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from 'axios';

export function useCepLookup() {
  return useMutation<CepData, AxiosError<ApiError>, string>({
    mutationFn: (cep: string) => {
      const formatedCep = cep.replace(/\D/g, '');
      const res = api.get(`/integrations/brasil-api/cep/${formatedCep}`, {
        timeout: 5000,
      })
      .then(res => res.data);
      return res;
    }
  });
}
