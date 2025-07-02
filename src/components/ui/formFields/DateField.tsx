// /components/ui/formFields/DateField.tsx

import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Controller, FieldError, RegisterOptions, useFormContext } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

import "react-datepicker/dist/react-datepicker.css";
import styles from "./formFields.module.css";

registerLocale('pt-BR', ptBR);

// 1. ADICIONAMOS A PROP 'onAccept' AO NOSSO ADAPTADOR
const DateCustomInput = forwardRef<
  HTMLInputElement,
  { value?: string; onClick?: () => void; onAccept?: (value: any) => void; }
>(({ value, onClick, onAccept }, ref) => (
  <IMaskInput
    mask="00/00/0000"
    value={value || ''}
    onClick={onClick}
    ref={ref}
    placeholder="dd/mm/aaaa"
    className={styles.input}
    // O evento onAccept do IMaskInput notificará a mudança
    onAccept={onAccept}
    // Adicionamos 'lazy: false' para garantir que o onAccept seja chamado ao preencher
    lazy={false}
  />
));
DateCustomInput.displayName = 'DateCustomInput';

interface DateFieldProps {
  name: string;
  label: string;
  required?: boolean | string;
  className?: string;
}

export function DateField({ name, label, required = false, className = "" }: DateFieldProps) {
  const { control, formState: { errors } } = useFormContext();

  const rules: RegisterOptions = {
    required: required ? (typeof required === 'string' ? required : `${label} é obrigatório`) : false,

    validate: (value: Date | null) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return new Date(value) <= today || 'A data de nascimento não pode ser no futuro.';
    }
  };

  const error = errors[name] as FieldError | undefined;
  const errorMessage = error?.message;

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          // Função que atualiza o formulário a partir do texto digitado
          const handleAccept = (dateString: string) => {
            const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
            if (isValid(parsedDate)) {
              field.onChange(parsedDate);
            }
          };

          // Formata o valor do formulário (que é um objeto Date) para a string 'dd/MM/yyyy' que o input espera
          const formattedValue = field.value ? format(new Date(field.value), 'dd/MM/yyyy') : '';

          return (
            <DatePicker
              // O 'selected' continua vindo do formulário para o calendário funcionar
              selected={field.value ? new Date(field.value) : null}
              // O 'onChange' do DatePicker (para cliques no calendário) atualiza o formulário
              onChange={(date) => field.onChange(date)}

              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={80}
              maxDate={new Date()}

              // 2. PASSAMOS NOSSO VALOR FORMATADO E O HANDLER 'onAccept' PARA O INPUT
              customInput={
                <DateCustomInput
                  value={formattedValue}
                  onClick={() => {}} // O DatePicker gerencia o clique
                  onAccept={handleAccept}
                />
              }
            />
          );
        }}
      />
      {errorMessage && <p className={styles.error}>{errorMessage as string}</p>}
    </div>
  );
}
