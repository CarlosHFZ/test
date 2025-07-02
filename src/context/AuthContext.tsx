'use client';


import { getAuthData } from '@/lib/authStorage';
import { UserSimpleData } from '@/types/user';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: UserSimpleData | null;
  isReady: boolean;
  login: (token: string, user: UserSimpleData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSimpleData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const loadUser = async () => {
      const auth = getAuthData();
      if (auth) setUser(auth.user);
      setIsReady(true);
    };
    loadUser();
  }, []);

  function login(token: string, user: UserSimpleData) {
    localStorage.setItem('AUTH_TOKEN', token);
    localStorage.setItem('AUTH_USER', JSON.stringify(user));

    const firstName = user?.full_name.split(' ')[0];

    localStorage.setItem('FIRST_NAME', firstName);

    setUser(user);
    if (user.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/dashboard');
    }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('AUTH_USER');
    localStorage.removeItem('FIRST_NAME');
    setUser(null);
    router.push('/login');
  }, [router]); // A dependência do useCallback é o router


  useEffect(() => {

    window.addEventListener('auth-error', logout);

    return () => {
      window.removeEventListener('auth-error', logout);
    };
  }, [logout]);


  return (
    <AuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
