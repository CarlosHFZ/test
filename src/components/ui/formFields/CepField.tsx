// /components/ui/formFields/CepField.tsx

import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import styles from "./formFields.module.css";

interface CepFieldProps {
  name: string;
  label: string;
  required?: boolean | string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  onBlur?: () => void;
}

export function CepField({
  name,
  label,
  required = false,
  className = "",
  inputClassName = "",
  disabled = false,
  onBlur,
}: CepFieldProps) {
  const { control, formState: { errors } } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const errorMessage = error?.message;

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{
            required: required ? (typeof required === 'string' ? required : `${label} é obrigatório`) : false,
        }}
        render={({ field }) => (
          <IMaskInput
            mask="00000-000"
            value={field.value || ''}
            // onAccept é mais seguro para máscaras, pois só atualiza quando o valor é aceito
            onAccept={(value) => field.onChange(value)}
            // Passamos o onBlur que veio de fora junto com o do RHF
            onBlur={(e) => {
              field.onBlur(); // Chama o onBlur do react-hook-form
              if (onBlur) onBlur(); // Chama nosso onBlur customizado
            }}
            inputRef={field.ref}
            id={name}
            placeholder="00000-000"
            className={`${styles.input} ${inputClassName || styles.inputWidthSmall}`}
            disabled={disabled}
          />
        )}
      />
      {errorMessage && <p className={styles.error}>{errorMessage as string}</p>}
    </div>
  );
}
