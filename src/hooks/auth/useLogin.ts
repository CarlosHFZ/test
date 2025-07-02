import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { UserSimpleData } from '@/types/user';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';


interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: UserSimpleData;
}


export function useLogin() {
  const { login } = useAuth();
  return useMutation<LoginResponse, AxiosError, LoginInput>({
    mutationFn: (data) =>
      api.post('auth/login/', data).then(res => res.data),
    onSuccess: (data) => {
      login(data.access_token, data.user)
    },
  });
}
