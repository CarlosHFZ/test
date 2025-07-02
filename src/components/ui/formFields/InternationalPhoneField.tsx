// src/components/ui/formFields/InternationalPhoneField.tsx

import { Controller, FieldError, useFormContext } from 'react-hook-form';
// REMOVIDO: O import do isValidPhoneNumber não é mais necessário
// import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/max';
import 'react-phone-number-input/style.css';
import styles from './formFields.module.css';

interface InternationalPhoneFieldProps {
  name: string;
  label: string;
  required?: boolean | string;
  className?: string;
  onBlur?: () => void;
}

export function InternationalPhoneField({
  name,
  label,
  required = false,
  className = "",
  onBlur,
}: InternationalPhoneFieldProps) {
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
          required: required ? (typeof required === 'string' ? required : "Campo obrigatório") : false,
        }}
        render={({ field: { ref, ...field } }) => (
          <PhoneInput
            {...field}
            id={name}
            inputRef={ref}
            onBlur={() => {
              field.onBlur();
              if (onBlur) onBlur();
            }}
            onChange={(value) => {
              field.onChange(value || '');
            }}
            international
            className={`${styles.inputWidthMedium}`}
          />
        )}
      />
      {errorMessage && <p className={styles.error}>{errorMessage as string}</p>}
    </div>
  );
}
