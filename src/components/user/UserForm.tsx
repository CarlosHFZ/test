'use client';

import adminStyles from '@/app/admin/AdminPage.module.css';
import { useAuth } from '@/context/AuthContext';
import { useCreateUser } from '@/hooks/user/useCreateUser';
import { api } from '@/lib/api';
import { ROLES } from '@/types/roles';
import { UUID } from '@/types/types';
import { CreateUserInput } from '@/types/user';
import { useEffect, useState } from 'react';
// Importar FormProvider e useForm
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EmailField, NameFields, PasswordField } from '../ui/formFields/formFields';
import styles from './UserForm.module.css';

interface Props {
  initialData?: CreateUserInput;
  onSuccess(): void;
  onCancel(): void;
}

interface Positions { id: number; name: string; }
interface Speciality { id: number; name: string; }
interface EnterpriseSimple { id: UUID; legalName: string; }

export function UserForm({ initialData, onSuccess, onCancel }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Positions[]>([]);
  const [enterprises, setEnterprises] = useState<EnterpriseSimple[]>([]);
  const [speciality, setSpeciality] = useState<Speciality[]>([]);
  const { user } = useAuth();

  const methods = useForm<CreateUserInput>({
    defaultValues: initialData
      ? initialData
      : { isMedical: false, isActivate: true } as CreateUserInput,
  });

  const { register, handleSubmit, reset, watch, setValue, unregister, formState: { errors, isSubmitting } } = methods;

  const isMedicalWatched = watch('isMedical');

  useEffect(() => {

    if (!user) return;

    let formValuesToSet: Partial<CreateUserInput>;

    if (initialData) {

      formValuesToSet = { ...initialData };

      formValuesToSet.isMedical = initialData.isMedical ?? false;
      formValuesToSet.isActivate = initialData.isActivate ?? true;

    } else {
      formValuesToSet = {
        isMedical: false,
        isActivate: true,
      };

      reset(formValuesToSet as CreateUserInput);

      if (user.role !== "ADMIN" && user.enterprise_id) {
        setValue('enterprise_id', user.enterprise_id);
      }

    }


  }, [initialData, user, reset, setValue]);

  useEffect(() => {
        const isMedical = String(isMedicalWatched) === 'true';

        if (!isMedical) {
          setValue('crmv', '');
          setValue('specialty', undefined);
          unregister(['crmv', 'specialty'])
        }

  }, [isMedicalWatched, setValue, unregister]);

  useEffect(() => {
    async function loadData() {
      try {
        const posRes = await api.get<Positions[]>('/positions/');
        const speRes = await api.get<Speciality[]>('/specialties/')
        setPositions(posRes.data);
        setSpeciality(speRes.data)
        if (user?.role === "ADMIN") {
          const entRes = await api.get<EnterpriseSimple[]>('/enterprises/find-all-simple/');
          setEnterprises(entRes.data);
        }
      } catch {
        setError('Erro ao carregar dados de organização');
      }
    }
    loadData();
  }, [user?.role]);

  const mutation = useCreateUser();

  async function handleFormSubmit(data: CreateUserInput) {
    try {
      const payload = {
        ...data,
        isMedical: String(data.isMedical) === 'true',
      };

      if (!payload.isMedical){
          payload.crmv = ''
      }

      await mutation.mutateAsync(payload);
      toast.success('Usuário cadastrado com sucesso!');
      onSuccess();
    } catch (err) {
      toast.error('Erro ao cadastrar usuário');
      console.error(err);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(
          handleFormSubmit,
          (formErrors) => {
            console.log("ERROS DE VALIDAÇÃO:", formErrors);
          }
        )}

        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto p-4"
      >
        {/* Seção: Organização */}
        <div className="col-span-full">
          <h3 className={styles.sectionHeader}>Organização</h3>
        </div>

        {error && (
          <div className="col-span-full">
            <p className={styles.error}>{error}</p>
          </div>
        )}

        {/* Campo Empresa: Lógica específica mantida */}
        {user?.role === 'ADMIN' ? (
          <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
            <label htmlFor="enterprise" className={styles.label}>Empresa</label>
            <select
              id="enterprise"
              {...register('enterprise_id', { required: 'Obrigatório' })}
              className={styles.input}
              defaultValue=""
            >
              <option value="">Selecione a empresa</option>
              {enterprises.map(ent => (
                <option key={ent.id} value={ent.id}>{ent.legalName}</option>
              ))}
            </select>
            {errors.enterprise_id && <p className={styles.error}>{errors.enterprise_id.message}</p>}
          </div>
        ) : (
          <Controller
            name="enterprise_id"
            control={methods.control}
            defaultValue={user?.enterprise_id || ''}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                className="hidden"
                {...field}
              />
            )}
          />
        )}

        <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
          <label htmlFor="position" className={styles.label}>Cargo</label>
          <select id="position" {...register('position', { required: 'Obrigatório' })} className={styles.input} defaultValue="">
            <option value="">Selecione o departamento</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>{pos.name}</option>
            ))}
          </select>
          {errors.position && <p className={styles.error}>{errors.position.message}</p>}
        </div>

        <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
          <label htmlFor="isMedical" className={styles.label}>Esse usuário é médico?</label>
          <select
            id="isMedical"
            {...register('isMedical')}
            className={styles.input}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
          {errors.isMedical && <p className={styles.error}>{typeof errors.isMedical.message === 'string' ? errors.isMedical.message : 'Erro'}</p>}
        </div>


        {(String(isMedicalWatched) === 'true') && (
          <div className={`${styles.formGroup} col-span-full md:col-span-2`}>
            <label htmlFor="crmv" className={styles.label}>CRMV</label>
            <input id="crmv" {...register('crmv', { required: 'CRMV Obrigatório para médico' })} className={styles.input} />
            {errors.crmv && <p className={styles.error}>{errors.crmv.message}</p>}
          </div>
        )}

        {(String(isMedicalWatched) === 'true') && (
        <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
          <label htmlFor="specialty" className={styles.label}>Especialidade</label>
          <select id="specialty" {...register('specialty', { required: 'Obrigatório' })} className={styles.input} defaultValue="">
            <option value="">Selecione a especialidade</option>
            {speciality.map(pos => (
              <option key={pos.id} value={pos.id}>{pos.name}</option>
            ))}
          </select>
          {errors.specialty && <p className={styles.error}>{errors.specialty.message}</p>}
        </div>
        )}

        {/* Seção: Perfil */}
        <div className={`${styles.formGroup} col-span-full md:col-span-2`}>
          <label htmlFor="role" className={styles.label}>Perfil</label>
          <select id="role" {...register('role', { required: 'Obrigatório' })} className={styles.input} defaultValue="">
            <option value="">Selecione</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.role && <p className={styles.error}>{errors.role.message}</p>}
        </div>

        {/* Seção: Identificação */}
        <div className="col-span-full">
          <h3 className={styles.sectionHeader}>Identificação</h3>
        </div>
        {/* Usando componente reutilizável NameFields */}
        <NameFields />

        {/* Seção: Acesso */}
        <div className="col-span-full">
          <h3 className={styles.sectionHeader}>Acesso</h3>
        </div>
        {/* Usando componentes reutilizáveis EmailField e PasswordField */}
        <EmailField name="email" label="Email" requiredMessage="Email obrigatório" />
        <PasswordField name="password" label="Senha" requiredMessage="Senha obrigatório"/>

        {/* Ações */}
        <div className="col-span-full flex justify-end gap-2 mt-4 sticky bottom-0 bg-white pt-4">
          <button type="button" onClick={onCancel} className={`${adminStyles.buttonSecondary} ${adminStyles.buttonLarge}`}>Voltar</button>
          <button type="submit" disabled={isSubmitting} className={`${adminStyles.buttonPrimary} ${adminStyles.buttonLarge}`}>
            {isSubmitting ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
