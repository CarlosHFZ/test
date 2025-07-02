'use client';

import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </AuthProvider>
  );
}
