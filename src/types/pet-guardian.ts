import { PersonType, TaxRegimeType, UUID } from "./types";

export interface CreatePetGuardianInput {
  full_name: string;
  email: string;
  phone: string;
  optional_phone?: string;
  person_type: PersonType;
  identification: string;
  cpf_cnpj: string;
  taxRegime: TaxRegimeType;
  stateRegistration?: string;
  municipalRegistration?: string;
  // sex: Gender;
  date_of_birth: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  observation?: string;
  enterprise?: UUID;
  isActivate?: boolean;
}


export interface PetGuardianSimpleData {
  id: UUID;
  full_name: string;
  email: string;
  phone: string;
  optional_phone: string;
  cpf_cnpj: string;
  identification: string;
  isActivate: boolean;
  tutorId: string;
  // sex: string;
}
