import { Role } from "./roles";
export interface CreateUserInput {
  full_name: string;
  email: string;
  password: string;
  isMedical?: boolean;
  crmv?: string;
  specialty?: number;
  position?: number;
  role: Role;
  enterprise_id: string;
  isActivate: boolean;
}


export interface UserSimpleData {
    id: string;
    full_name: string;
    email: string;
    role: string;
    enterprise_id: string;
    enterprise_name: string;
    certificate_is_valid: boolean;
    // certificate_expiration_date: string | null;
}

export interface User extends CreateUserInput {
  id: number;
}
