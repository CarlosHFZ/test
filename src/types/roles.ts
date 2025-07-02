export const ROLES = ['Gerente','Funcionário','Sem Acesso'] as const;
export type Role = (typeof ROLES)[number];
