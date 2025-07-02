'use client';

import adminStyles from '@/app/admin/AdminPage.module.css';
import { useAuth } from '@/context/AuthContext';
import { useCreateGuardian } from "@/hooks/guardians/useCreateGuardian";
import { useCepLookup } from '@/hooks/utils/useCepLookup';
import { CreatePetGuardianInput } from "@/types/pet-guardian";
import { PersonType } from '@/types/types';
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { DateField } from '../ui/formFields/DateField';
import {
  AddressFields,
  ContactFields,
  EmailField,
  FiscalFields,
  NameFields,
  TextAreaField
} from '../ui/formFields/formFields';
import styles from "./PetGuardianForm.module.css";


interface Props {
  initialData?: CreatePetGuardianInput;
  onSuccess(): void;
  onCancel(): void;
}

export function PetGuardianForm({ initialData, onSuccess, onCancel }: Props) {
  const [formError, setFormError] = useState<string | null>(null);

  const methods = useForm<CreatePetGuardianInput>({
    mode: 'onBlur',
    defaultValues: initialData
      ? initialData
      : { isActivate: true } as CreatePetGuardianInput,
  });

  const { register, handleSubmit, watch, setValue, setError, clearErrors, formState: { errors, isSubmitting }, reset } = methods;
  const { user } = useAuth();
  const { mutate, isPending } = useCepLookup();
  const cepValue = watch('cep');

  const personTypeWatched = watch('person_type');
  const isLegal = personTypeWatched === 'Jurídica'
  const isForeigner = personTypeWatched === 'Estrangeiro'

  useEffect(() => {
    setValue('phone', '', { shouldValidate: false });
    setValue('optional_phone', '', { shouldValidate: false });

  }, [personTypeWatched, setValue]);

  useEffect(() => {

    if (initialData) {
      reset({
        isActivate: true,
        ...initialData,
        enterprise: user?.enterprise_id,
      });
    } else {
      reset({
        isActivate: true,
        person_type: PersonType.INDIVIDUAL,
        enterprise: user?.enterprise_id,
      });
    }
  }, [initialData, user, reset]);


  const mutation = useCreateGuardian();

  async function handleFormSubmit(data: CreatePetGuardianInput) {
    setFormError(null);

    try {

      const payload: CreatePetGuardianInput = {
        ...data,
      };

      if (!isForeigner) {
        payload.country = 'Brasil'
      }

      await mutation.mutateAsync(payload);
      toast.success('Tutor cadastrado com sucesso!');
      onSuccess();
      } catch (err: unknown) {
        let errorMessage = 'Erro ao cadastrar tutor';

        if (err instanceof Error) {
          errorMessage = err.message;
        }
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const errorResponse = (err as any).response;
          if (errorResponse?.data?.message) {
            errorMessage = errorResponse.data.message;
          }
        }
        setFormError(errorMessage);
        toast.error(errorMessage);
        console.error("Erro ao criar tutor:", err);
      }
  }

  const handleCepLookup = () => {
    if (!cepValue || cepValue.replace(/\D/g, '').length !== 8) return;

    clearErrors('cep');

    mutate(cepValue, {
      onSuccess: (data) => {

        setValue('street', data.street);
        setValue('neighborhood', data.neighborhood);
        setValue('city', data.city);
        setValue('state', data.stateCode);

      },
      onError: (error) => {
        // Verificamos se o código do erro é de timeout
        if (error.code === 'ECONNABORTED') {
          setError('cep', {
            type: 'manual',
            message: 'CEP inválido ou não encontrado.'
          });
        } else {
          // Lógica para outros erros (como 404 - não encontrado)
          const errorMessage = error.response?.data?.message || 'CEP inválido ou não encontrado.';
          setError('cep', { type: 'manual', message: errorMessage });
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto p-4"
      >
        <div className="col-span-full">
          <h3 className={styles.sectionHeader}>Identificação do Tutor</h3>
        </div>

        {formError && (
          <div className="col-span-full">
            <p className={styles.error}>{formError}</p>
          </div>
        )}

        <NameFields />

        <div className={`${styles.formGroup} col-span-full md:col-span-2`}>
            <EmailField name="email" label="Email" requiredMessage="Email obrigatório" />
        </div>



        <div className={`${styles.formGroup} col-span-full md:col-span-1`}>
          <label htmlFor="person_type" className={styles.label}>Tipo de Pessoa</label>
          <select id="person_type" {...register("person_type", { required: "Obrigatório" })} className={`${styles.input} ${styles.inputWidthSmall}`}  defaultValue="">
            <option value="">Selecione</option>
            {Object.values(PersonType).map(pt => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>

          {errors.person_type && <p className={styles.error}>{errors.person_type.message}</p>}
        </div>

        <div className="col-span-full md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FiscalFields
          isLegal={isLegal}
          isForeigner={isForeigner}
          />
        </div>

        <ContactFields
        isForeigner={isForeigner}
        />

        <div className="col-span-full md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateField
              name="date_of_birth"
              label="Data de Nascimento"
              required="Obrigatório"
              className="md:col-span-1" // Use as classes de layout que precisar
            />
        </div>

        <div className="col-span-full">
          <h3 className={styles.sectionHeader}>Endereço</h3>
        </div>

        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <AddressFields
            onCepBlur={handleCepLookup}
            isCepLoading={isPending}
            />
        </div>


        <div className={`${styles.formGroup} col-span-full`}>
            <TextAreaField
              name="observation"
              label="Observação"
              placeholder="Digite suas observações aqui..."
              className="col-span-full"
            />
        </div>

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
