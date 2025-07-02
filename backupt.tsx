// src/components/EnterpriseForm.tsx
'use client';

import adminStyles from '@/app/admin/AdminPage.module.css';
import { useCreateEnterprise } from '@/hooks/enterprises/useCreateEnterprise';
import { CreateEnterpriseInput, EnterpriseType } from '@/types/enterprise';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styles from './EnterpriseForm.module.css';

interface Props {
  initialData?: CreateEnterpriseInput;
  onSuccess(): void;
  onCancel(): void;
}

export function EnterpriseForm({ initialData, onSuccess, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateEnterpriseInput>({ defaultValues: initialData });

  const mutation = useCreateEnterprise();

  async function handleFormSubmit(data: CreateEnterpriseInput) {
    try{
      await mutation.mutateAsync(data);
      toast.success('Empresa cadastrada com sucesso!');
      onSuccess();
    } catch {
      toast.error('Erro ao cadastrar empresa')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto p-4"
    >
      {/* Seção: Dados da Empresa */}
      <div className="col-span-full">
        <h3 className={styles.sectionHeader}>Dados da Empresa</h3>
      </div>

      {/* Nome */}
      <div className={`${styles.formGroup} col-span-full md:col-span-2`}>
        <label htmlFor="name" className={styles.label}>Nome</label>
        <input
          id="name"
          {...register('name', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </div>

      {/* Sigla */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="acronym" className={styles.label}>Sigla</label>
        <input
          id="acronym"
          {...register('acronym', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.acronym && <p className={styles.error}>{errors.acronym.message}</p>}
      </div>

      {/* CNPJ */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="cnpj" className={styles.label}>CNPJ</label>
        <input
          id="cnpj"
          {...register('cnpj', { required: 'Obrigatório' })}
          placeholder="00.000.000/0000-00"
          className={styles.input}
        />
        {errors.cnpj && <p className={styles.error}>{errors.cnpj.message}</p>}
      </div>

      {/* Inscrições */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="stateRegistration" className={styles.label}>Inscrição Estadual</label>
        <input
          id="stateRegistration"
          {...register('stateRegistration', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.stateRegistration && <p className={styles.error}>{errors.stateRegistration.message}</p>}
      </div>

      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="municipalRegistration" className={styles.label}>Inscrição Municipal</label>
        <input
          id="municipalRegistration"
          {...register('municipalRegistration', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.municipalRegistration && <p className={styles.error}>{errors.municipalRegistration.message}</p>}
      </div>

      {/* Contato */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="phone" className={styles.label}>Telefone</label>
        <input
          id="phone"
          {...register('phone', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
      </div>

      {/* Opicional, Responsável, Certificado, CNES */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="optional_phone" className={styles.label}>Telefone Opcional</label>
        <input
          id="optional_phone"
          {...register('optional_phone')}
          className={styles.input}
        />
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="technicalManager" className={styles.label}>Responsável Técnico</label>
        <input
          id="technicalManager"
          {...register('technicalManager', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.technicalManager && <p className={styles.error}>{errors.technicalManager.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="digitalCertificate" className={styles.label}>Certificado Digital</label>
        <input
          id="digitalCertificate"
          {...register('digitalCertificate', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.digitalCertificate && <p className={styles.error}>{errors.digitalCertificate.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="cnes" className={styles.label}>CNES</label>
        <input
          id="cnes"
          {...register('cnes', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.cnes && <p className={styles.error}>{errors.cnes.message}</p>}
      </div>

      {/* Seção: Endereço */}
      <div className="col-span-full">
        <h3 className={styles.sectionHeader}>Endereço</h3>
      </div>

      {/* Rua, Número, Complemento */}
      <div className={`${styles.formGroup} col-span-full md:col-span-2`}>
        <label htmlFor="street" className={styles.label}>Rua</label>
        <input
          id="street"
          {...register('street', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.street && <p className={styles.error}>{errors.street.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="number" className={styles.label}>Número</label>
        <input
          id="number"
          {...register('number', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.number && <p className={styles.error}>{errors.number.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="complement" className={styles.label}>Complemento</label>
        <input
          id="complement"
          {...register('complement')}
          className={styles.input}
        />
      </div>

      {/* Bairro, Cidade, Estado */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="district" className={styles.label}>Bairro</label>
        <input
          id="district"
          {...register('district', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.district && <p className={styles.error}>{errors.district.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="city" className={styles.label}>Cidade</label>
        <input
          id="city"
          {...register('city', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.city && <p className={styles.error}>{errors.city.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="state" className={styles.label}>Estado</label>
        <input
          id="state"
          {...register('state', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.state && <p className={styles.error}>{errors.state.message}</p>}
      </div>

      {/* País, CEP */}
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="country" className={styles.label}>País</label>
        <input
          id="country"
          {...register('country', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.country && <p className={styles.error}>{errors.country.message}</p>}
      </div>
      <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
        <label htmlFor="cep" className={styles.label}>CEP</label>
        <input
          id="cep"
          {...register('cep', { required: 'Obrigatório' })}
          className={styles.input}
        />
        {errors.cep && <p className={styles.error}>{errors.cep.message}</p>}
      </div>

      {/* Seção: Configurações */}

      <div className={`${styles.formGroup} col-span-full md:col-span-2`}>
        <label htmlFor="type" className={styles.label}>Tipo de Empresa</label>
        <select
          id="type"
          {...register('type', { required: 'Obrigatório' })}
          className={styles.input}
        >
          {Object.values(EnterpriseType).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.type && <p className={styles.error}>{errors.type.message}</p>}
      </div>

      <div className={`${styles.formGroup} col-span-full md:col-span-1 flex items-center`}>
        <input
          id="isActivate"
          type="checkbox"
          {...register('isActivate')}
          className="mr-2"
        />
        <label htmlFor="isActivate" className={styles.label}>Ativa</label>
      </div>

      {/* Ações */}
      <div className="col-span-full flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`${adminStyles.buttonSecondary} ${adminStyles.buttonLarge}`}
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${adminStyles.buttonPrimary} ${adminStyles.buttonLarge}`}
        >
          {isSubmitting ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
