interface PartnerData {
  country: string | null;
  partnerName: string;
  countryCode: string | null;
  partnerDocument: string;
  legalRepresentativeCpf: string;
  legalRepresentativeName: string;
}

export interface CnpjData {
  legalName: string; // razaoSocial
  tradeName: string; // nomeFantasia
  cnpj: string;
  state: string; // uf
  postalCode: string; // cep
  email: string | null;
  neighborhood: string; // bairro
  streetNumber: string; // numero
  faxAreaCode: string; // dddFax
  city: string; // municipio
  street: string; // logradouro
  fiscalActivityCode: number; // cnaeFiscal
  countryCode: string | null; // codigoPais
  addressComplement: string; // complemento
  phone1AreaCode: string; // dddTelefone1
  phone2AreaCode: string; // dddTelefone2
  cityCode: number; // codigoMunicipio
  registrationStatus: number; // situacaoCadastral
  country: string | null; // pais
  partners: PartnerData[]; // qsa
}
