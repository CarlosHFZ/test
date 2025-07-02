'use client';

import adminStyles from '@/app/admin/AdminPage.module.css';
import { useCreateEnterprise } from '@/hooks/enterprises/useCreateEnterprise';
import { useCnpjLookup } from '@/hooks/utils/useCnpjLookup';
import { CreateEnterpriseDto, Enterprise } from '@/types/enterprise';
import { EnterpriseType } from '@/types/types';
import axios from 'axios';
import { useEffect, useState } from 'react'; // Importe o useState
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  AddressFields,
  ContactFields,
  EmailField,
  FiscalFields,
  SelectField,
  SingleTaxIdField,
  TextField
} from '../ui/formFields/formFields';
import styles from './EnterpriseForm.module.css';

interface Props {
  initialData?: CreateEnterpriseDto;
  onSuccess(): void;
  onCancel(): void;
}
interface ApiErrorResponse {
  message: string | string[];
}

export function EnterpriseForm({ initialData, onSuccess, onCancel }: Props) {
  const methods = useForm<CreateEnterpriseDto>({
    defaultValues: initialData
      ? initialData
      : ({
          isActivate: true,
          type: undefined,
          taxRegime: undefined,
        } as Partial<CreateEnterpriseDto>),
  });

  const { handleSubmit, clearErrors, setValue, setError, reset } = methods;


  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mainData: true,
    documents: false,
    contactoMain: false,
    representationLegal: false,
    moreInfo: false,
    address: false,
    // configuracoes: false, // Se você reativar esta seção
  });

  const { mutate: cnpjMutate, isPending: isCnpjPending} = useCnpjLookup();
  const cnpjValue = methods.watch('cnpj');

  const handleCpfLookup = () => {
    if (!cnpjValue || cnpjValue.replace(/\D/g, '').length !== 14) return;

    clearErrors('cnpj');

    cnpjMutate(cnpjValue, {
      onSuccess: (data) => {

        setValue('street', data.street || '');
        setValue('neighborhood', data.neighborhood || '');
        setValue('city', data.city || '');
        setValue('state', data.state);
        setValue('legalName', data.legalName || '');
        setValue('tradeName', data.tradeName || '');
        setValue('cep', data.postalCode || '');
        setValue('country', data.country || 'Brasil');
        setValue('cnae', String(data.fiscalActivityCode) || '')
        setValue('phone', data.phone1AreaCode || '');
        setValue('optional_phone', data.phone2AreaCode || '');
        setValue('email', data.email || '');
        setValue('legalRepresentativeName', data.partners?.[0]?.legalRepresentativeName || '');
      },
      onError: (error) => {
        // Verificamos se o código do erro é de timeout
        if (error.code === 'ECONNABORTED') {
          setError('cnpj', {
            type: 'manual',
            message: 'CNPJ inválido ou não encontrado.'
          });
        } else {
          // Lógica para outros erros (como 404 - não encontrado)
          const errorMessage = error.response?.data?.message || 'CNPJ inválido ou não encontrado.';
          setError('cnpj', { type: 'manual', message: errorMessage });
        }
      },
    });
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  useEffect(() => {
    if (initialData) {
      const formValues: Partial<CreateEnterpriseDto> = { ...initialData };
      formValues.isActivate = initialData.isActivate ?? true;
      formValues.type = initialData.type ?? undefined;
      formValues.taxRegime = initialData.taxRegime ?? undefined;
      reset(formValues as CreateEnterpriseDto);
    } else {
      reset({
        isActivate: true,
        type: undefined,
        taxRegime: undefined,
      });
    }
  }, [initialData, reset]);



  const { mutate: createEnterprise, isPending: isCreatePending } = useCreateEnterprise();
  // Função de submit principal
  async function handleFormSubmit(data: CreateEnterpriseDto) {
    setServerErrors([]);

    const formData = new FormData();
    // Sua lógica para construir o formData está correta
    (Object.keys(data) as Array<keyof CreateEnterpriseDto>).forEach(key => {
      if (key === 'mainLogo') {
        const fileListValue = data.mainLogo;
        if (fileListValue && fileListValue.length > 0) {
          formData.append(key, fileListValue[0]);
        }
      } else {
        const value = data[key];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    });

    // Chamada da mutação com os callbacks corrigidos
    createEnterprise(formData, {
      onSuccess: (_responseData: Enterprise) => {
        toast.success('Empresa cadastrada com sucesso!');
        onSuccess();
      },
      onError: (error: Error) => { // 4. O tipo base é 'Error'
        toast.error('Erro ao cadastrar empresa. Verifique os campos.');
        // 5. Usamos o type guard para acessar propriedades do Axios
        if (axios.isAxiosError(error) && error.response) {
          const apiError = error.response.data as ApiErrorResponse;
          const messages = apiError.message;
          setServerErrors(Array.isArray(messages) ? messages : [messages]);
        } else {
          setServerErrors(['Ocorreu um erro inesperado.']);
        }
      },
    });
  }

  const enterpriseTypeOptions = Object.values(EnterpriseType).map(value => ({ value, label: value }));
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-3 gap-y-6 max-h-[80vh] overflow-y-auto p-4"
      >
        {serverErrors.length > 0 && (
          <div className={styles.errorBox}>
            <strong>Por favor, corrija os seguintes erros:</strong>
            <ul>
              {serverErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Seção 1: Documentos e Inscrições da Empresa */}
        <div className="col-span-full">
          <h3 onClick={() => toggleSection('documentos')} className={`${styles.sectionHeader} ${styles.accordionHeader}`}>
            Documentos e Inscrições
            <span className={styles.accordionToggle}>{expandedSections.documentos ? '▲' : '▼'}</span>
          </h3>
          {expandedSections.documentos && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2 p-1">
              <FiscalFields
                onCnpjblur={handleCpfLookup}
                IsCnpjLoading={isCnpjPending}
                taxIdName="cnpj"
                taxIdRequiredMessage="CNPJ Obrigatório"
                taxIdFormatErrorMessage="CNPJ da Empresa inválido"
                stateRegistrationRequired="IE Obrigatória"
                municipalRegistrationRequired="IM Obrigatória"
                enableSmartTaxIdValidation={true}
                taxIdClassName="md:col-span-1"
                stateRegistrationClassName="md:col-span-1"
                municipalRegistrationClassName="md:col-span-1"
                isLegal={true}
              />
            </div>
          )}
        </div>

        {/* Seção 2: Dados Principais da Empresa */}
        <div className="col-span-full">

          <h3 onClick={() => toggleSection('dadosPrincipais')} className={`${styles.sectionHeader} ${styles.accordionHeader}`}>
            Dados Principais da Empresa
            <span className={styles.accordionToggle}>{expandedSections.dadosPrincipais ? '▲' : '▼'}</span>
          </h3>
          {expandedSections.dadosPrincipais && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2 p-1">
              <TextField fullName="legalName" label="Razão Social" required className="md:col-span-2" />
              <TextField fullName="tradeName" label="Nome Fantasia" required className="md:col-span-1" />
              <TextField fullName="acronym" label="Sigla" className="md:col-span-1" />
              <TextField fullName="cnae" label="CNAE Principal" required className="md:col-span-1" />
              <SelectField
                  name="type"
                  label="Tipo de Empresa"
                  options={enterpriseTypeOptions}
                  required
                  className="md:col-span-1"
                  placeholder="Selecione o Tipo"
              />
            </div>
          )}
        </div>

        {/* Seção 3: Contato Principal da Empresa */}
        <div className="col-span-full">
            <h3 onClick={() => toggleSection('contatoPrincipal')} className={`${styles.sectionHeader} ${styles.accordionHeader}`}>
                Contato Principal
                <span className={styles.accordionToggle}>{expandedSections.contatoPrincipal ? '▲' : '▼'}</span>
            </h3>
            {expandedSections.contatoPrincipal && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2 p-1">
                    <EmailField name="email" label="E-mail Principal" requiredMessage="E-mail obrigatório" className="md:col-span-1" />
                    <ContactFields />
                </div>
            )}
        </div>

        {/* Seção 4: Representante Legal */}
        <div className="col-span-full">
            <h3 onClick={() => toggleSection('representanteLegal')} className={`${styles.sectionHeader} ${styles.accordionHeader}`}>
                Representante Legal
                <span className={styles.accordionToggle}>{expandedSections.representanteLegal ? '▲' : '▼'}</span>
            </h3>
            {expandedSections.representanteLegal && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2 p-1">
                    <TextField fullName="legalRepresentativeName" label="Nome Completo do Representante Legal" required className="md:col-span-2"/>
                    <SingleTaxIdField
                        name="legalRepresentativeCpf"
                        label="CPF do Representante Legal"
                        requiredMessage="CPF Obrigatório"
                        formatErrorMessage="CPF do Rep. Legal inválido"
                        placeholder="000.000.000-00"
                        enableSmartValidation={true}
                        className="md:col-span-1"
                        docType={'cpf'}
                    />
                </div>
            )}
        </div>

        {/* Seção 5: Informações Adicionais e Regulatórias (e Logo) */}
        <div className="col-span-full">
            <h3 onClick={() => toggleSection('infoAdicionais')} className={`${styles.sectionHeader} ${styles.accordionHeader}`}>
                Informações Adicionais
                <span className={styles.accordionToggle}>{expandedSections.infoAdicionais ? '▲' : '▼'}</span>
            </h3>
            {expandedSections.infoAdicionais && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2 p-1">
                    <TextField fullName="technicalManager" label="Responsável Técnico (se houver)" className="md:col-span-1"/>
                    <TextField fullName="crmv" label="CRMV" className="md:col-span-1" autoComplete='off'/>
                    {/* <TextField name="cnes" label="CNES (se houver)" className="md:col-span-1"/> */}
                    {/* Campo de Upload de Logo */}
                    {/* <div className={`${styles.formGroup} md:col-span-2`}>
                        <label htmlFor="mainLogo" className={styles.label}>Logo Principal</label>
                        <input
                            type="file"
                            id="mainLogo"
                            className={styles.input}
                            accept="image/png, image/jpeg, image/svg+xml"
                            {...register("mainLogo")}
                        />
                        {errors.mainLogo && <p className={styles.error}>{errors.mainLogo.message as string}</p>}
                    </div> */}
                </div>
            )}
        </div>

        {/* Seção 6: Endereço da Empresa */}
        <div className="col-span-full">
            <h3 onClick={() => toggleSection('endereco')} className={`${styles.sectionHeader} ${styles.accordionHeader}`}>
                Endereço da Empresa
                <span className={styles.accordionToggle}>{expandedSections.endereco ? '▲' : '▼'}</span>
            </h3>
            {expandedSections.endereco && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2 p-1">
                    <AddressFields />
                </div>
            )}
        </div>

        {/* Botões de Ação */}
        {/* <div className="col-span-full flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
          <button type="button" onClick={onCancel} className={`${adminStyles.buttonSecondary} ${adminStyles.buttonLarge}`}>Voltar</button>
          <button type="submit" disabled={isCnpjPending} className={`${adminStyles.buttonPrimary} ${adminStyles.buttonLarge}`}>
            {isCnpjPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div> */}
        <div className="col-span-full flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
          <button type="button" onClick={onCancel} className={`${adminStyles.buttonSecondary} ${adminStyles.buttonLarge}`}>Voltar</button>
          {/* 4. CORREÇÃO AQUI: Use o novo nome da variável para o estado de salvar */}
          <button type="submit" disabled={isCreatePending} className={`${adminStyles.buttonPrimary} ${adminStyles.buttonLarge}`}>
            {isCreatePending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
