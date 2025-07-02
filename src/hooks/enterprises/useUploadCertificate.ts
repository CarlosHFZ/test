// src/hooks/useUploadCertificate.ts
import { api } from '@/lib/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

// Interface para a resposta da API em caso de sucesso
interface UploadResponse {
  message: string;
}

// Interface para as variáveis que a função de mutação recebe
interface UploadCertificateVariables {
  enterpriseId: string;
  file: File;
  password: string;
}

/**
 * Hook para fazer o upload do certificado de uma empresa.
 * Usa o `useMutation` do TanStack Query para gerenciar o estado da requisição.
 */
export function useUploadCertificate(
  options?: UseMutationOptions<UploadResponse, Error, UploadCertificateVariables>
) {
  return useMutation<UploadResponse, Error, UploadCertificateVariables>({
    mutationFn: async ({ enterpriseId, file, password }) => {
      const formData = new FormData();
      formData.append('certificateFile', file);
      formData.append('certificatePassword', password);

      const response = await api.post(
        `/enterprises/${enterpriseId}/upload-certificate/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data;
    },
    ...options, // Permite passar callbacks como onSuccess, onError, etc.
  });
}
