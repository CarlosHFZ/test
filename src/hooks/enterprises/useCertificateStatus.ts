import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface CertificateStatus {
  isValid: boolean;
  expiresOn: Date | null;
  isExpiringSoon: boolean;
  daysUntilExpiration: number | null;
}

export function useCertificateStatus(enterpriseId: string, enabled = true ) {
  return useQuery({
    // CORREÇÃO: A chave deve ser mais específica para corresponder à invalidação.
    queryKey: ['enterprise', enterpriseId, 'isValid'],

    queryFn: () => api.get<CertificateStatus>(`/enterprises/${enterpriseId}/get-certificate-status/`).then(res => res.data),
    enabled: !!enterpriseId && enabled,
  });
}
