import { EnterpriseType, TaxRegimeType, UUID } from "./types";

export interface EnterpriseBase {
  legalName: string;
  tradeName: string;
  acronym?: string;
  cnpj: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  taxRegime: TaxRegimeType;
  email: string;
  phone: string;
  optional_phone?: string;
  legalRepresentativeName: string;
  legalRepresentativeCpf: string;
  technicalManager?: string;
  crmv?: string;
  certificateIsValid: boolean;
  certificateExpiresOn: Date | null;
  cnae?: string;
  type: EnterpriseType;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  cep: string;
  isActivate?: boolean;
}

export interface CreateEnterpriseDto extends EnterpriseBase {
  mainLogo?: FileList | null;
}


export interface Enterprise extends EnterpriseBase {
  id: UUID;
  mainLogoUrl?: string | null;
}

export interface EnterpriseSimpleData {
  id: UUID;
  legalName: string;
  acronym: string;
  cnpj: string;
  email: string;
  phone:string;
  city: string;
  state: string;
}
