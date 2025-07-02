import { api } from '@/lib/api';
// import { CreateEnterpriseInput } from '@/types/enterprise';
import { useMutation } from '@tanstack/react-query';

export function useCreateEnterprise() {
  return useMutation({
    mutationFn: (data: FormData) => {
      return api.post('/enterprises/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
    },
  });
}

