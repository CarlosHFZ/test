import { UserSimpleData } from "@/types/user";


export function getAuthToken(): string | null {
  return localStorage.getItem('AUTH_TOKEN');
}

export function getAuthUser(): UserSimpleData | null {
  const raw = localStorage.getItem('AUTH_USER');
  return raw ? JSON.parse(raw) : null;
}

export function getAuthData(): { token: string, user: UserSimpleData } | null {
  const token = getAuthToken();
  const user = getAuthUser();
  if (token && user) return { token, user };
  return null;
}
