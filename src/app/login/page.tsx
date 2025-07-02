'use client';

import { LoginForm, type LoginFormData } from '@/components/login/LoginForm';
import { useLogin } from '@/hooks/auth/useLogin';
import { AxiosError } from 'axios';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const mutation = useLogin();

  async function onSubmit(data: LoginFormData) {
    try {
      await mutation.mutateAsync(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message ?? 'Falha no login');
      } else {
        alert('Falha inesperada');
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.logo}>Pet Health</h1>
        <h2 className={styles.title}>Login</h2>
        <LoginForm
          onSubmit={onSubmit}
          isLoading={mutation.isPending}
        />
      </div>
    </div>
  );
}
