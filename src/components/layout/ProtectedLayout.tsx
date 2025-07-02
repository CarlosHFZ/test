// src/components/layout/ProtectedLayout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedLayoutProps {
  allowedRoles?: string[];   // se não passar, só exige login
  fallback?: ReactNode;      // pode passar tela de loading customizada
  children: ReactNode;
}

export function ProtectedLayout({ allowedRoles, fallback, children }: ProtectedLayoutProps) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role.trim().toUpperCase())) {
      // Pode redirecionar para /dashboard ou uma tela de acesso negado, se quiser
      router.replace('/login');
    }
  }, [isReady, user, allowedRoles, router]);

  if (!isReady) {
    return fallback || (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando...
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Redirecionando para login...
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role.trim().toUpperCase())) {
    return fallback || (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Acesso restrito. Redirecionando...
      </div>
    );
  }

  return <>{children}</>;
}
