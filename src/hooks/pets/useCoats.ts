import { api } from "@/lib/api";
import { Coats } from "@/types/pet";
import { useQuery } from "@tanstack/react-query";

const fetchCoats = async (): Promise<Coats[]> => {
  const { data } = await api.get('pets/coats');
  return data;
}

export function useCoats() {
  return useQuery({
    queryKey: ['coats'],
    queryFn: fetchCoats
  });
}
