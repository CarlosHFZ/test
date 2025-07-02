import { api } from "@/lib/api";
import { EnterpriseSimpleData } from "@/types/enterprise";
import { useQuery } from "@tanstack/react-query";


export function useGetEnterpriseById(id: string, enabled = true ) {
  return useQuery({
    queryKey: ['enterprise', id],
    queryFn: () => api.get<EnterpriseSimpleData>(`/enterprise/${id}`).then(res => res.data),
    enabled: !!id && enabled,
  });
}
