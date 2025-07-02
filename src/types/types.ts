export type UUID = string;


export enum PersonType {
  INDIVIDUAL = 'Física',
  LEGAL_ENTITY = 'Jurídica',
  FOREIGNER = 'Estrangeiro',
}


export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino',
  NON_BINARY = 'Não Binario',
  PREFER_NOT_TO_SAY = 'Prefiro Não Dizer',
}


export enum EnterpriseType {
  CLINIC = 'Clinica',
  PETSHOP = 'Petshop',
  HOSPITAL = 'Hospital',
  CONSULTANCY = 'Consutório',
}

export enum TaxRegimeType {
  NATIONAL_SIMPLES = 'Simples National',
  PRESUMED_PROFIT = 'Lucro Presumido',
  REAL_PROFIT = 'Lucro Real',
}


