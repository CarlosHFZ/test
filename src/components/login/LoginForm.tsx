'use cliente'
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/LoginField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from './LoginForm.module.css';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});


export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField label="E-mail" error={errors.email?.message}>
        <Input type="email" {...register('email')} />
      </FormField>

      <FormField label="Senha" error={errors.password?.message}>
        <Input type="password" {...register('password')} />
      </FormField>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
