import { api } from "@/lib/api";
import { CnpjData } from "@/types/cnpj";
import { ApiError } from "@/types/error";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from 'axios';

export function useCnpjLookup() {
  return useMutation<CnpjData, AxiosError<ApiError>, string>({
    mutationFn: (cep: string) => {
      const formatedCnpj = cep.replace(/\D/g, '');

      return api.get(`/integrations/brasil-api/cnpj/${formatedCnpj}/`, {
        timeout: 5000,
      })
      .then(res => {
        return res.data;
      });
    }
  });
}
