import { TaxRegimeType } from '@/types/types';
import { cnpj as cnpjValidator, cpf as cpfValidator } from 'cpf-cnpj-validator';

import { useEffect } from 'react';
import { Controller, FieldError, FieldErrorsImpl, Merge, RegisterOptions, useFormContext, Validate } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { CepField } from './CepField';
import styles from './formFields.module.css';
import { InternationalPhoneField } from './InternationalPhoneField';
;



// Tipagem para mensagens de erro
type ErrorMessageType = string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>> | undefined;

function renderErrorMessage(message: ErrorMessageType) {
  return typeof message === 'string' ? <p className={styles.error}>{message}</p> : null;
}

// --- SingleTaxIdField ---
interface SingleTaxIdFieldProps {
  name: string;
  docType: 'cpf' | 'cnpj';
  label: string;
  placeholder?: string;
  requiredMessage?: string | boolean;
  enableSmartValidation?: boolean;
  formatErrorMessage?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean; // Para desabilitar o campo
  onBlur?: () => void;
}

export function SingleTaxIdField({
  name,
  label,
  docType,
  placeholder = "Digite o documento",
  requiredMessage = "Obrigatório",
  enableSmartValidation = true,
  className = "",
  inputClassName = "",
  disabled = false,
  onBlur: onBlurProp,
}: SingleTaxIdFieldProps) {
  const { control, formState: { errors } } = useFormContext();

  const validateDocument = (value: string) => {
    if (!enableSmartValidation || !value) return true;

    const cleanedValue = String(value).replace(/\D/g, '');
    if (cleanedValue.length === 0) return true;

    // A validação agora é explícita, não baseada no tamanho
    if (docType === 'cpf') {
      return cpfValidator.isValid(cleanedValue) || 'CPF inválido';
    } else { // docType === 'cnpj'
      return cnpjValidator.isValid(cleanedValue) || 'CNPJ inválido';
    }
  };


  const rules: RegisterOptions = {};
  if (requiredMessage) {
    rules.required = typeof requiredMessage === 'string' ? requiredMessage : 'Obrigatório';
  }
  if (enableSmartValidation) {
    rules.validate = validateDocument as Validate<string, Record<string, unknown>>; // Corrigido 'any'
  }

  const selectedMask = docType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00';


  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value, name: controllerName, ref } }) => (
          <IMaskInput
            mask={selectedMask}
            dispatch={(appended, dynamicMasked) => {
              const potentialUnmaskedValue = (String(dynamicMasked.unmaskedValue || '') + appended).replace(/\D/g, '');
              if (potentialUnmaskedValue.length <= 11) return dynamicMasked.compiledMasks[0];
              return dynamicMasked.compiledMasks[1];
            }}
            value={String(value || '')}
            unmask={true}
            onAccept={(unmaskedValue) => onChange(unmaskedValue)}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onBlur={(event) => {
              onBlur(); // react-hook-form
              if (onBlurProp) onBlurProp(); // custom prop
            }}

            inputRef={ref}
            name={controllerName}
            id={name}
            placeholder={placeholder}
            className={`${styles.input} ${inputClassName || styles.inputFullWidth}`}
            type="tel"
            disabled={disabled}
          />
        )}
      />
      {renderErrorMessage(errors[name]?.message)}
    </div>
  );
}

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'required'> {
  fullName: string;
  label: string;
  required?: string | boolean; // Sua prop customizada é mantida
  inputClassName?: string;
  validation?: RegisterOptions;
}

export function TextField({
  fullName: full_name,
  label,
  type = "text",
  required = false,
  placeholder = "",
  className = "",
  inputClassName = "",
  maxLength,
  autoComplete,
  disabled = false,
  onBlur,
  validation,
  ...rest
}: TextFieldProps) {
  const { register, formState: { errors } } = useFormContext();

  const rules: RegisterOptions = {};
  if (required) {
    rules.required = typeof required === 'string' ? required : `${label} é obrigatório`;
  }
  if (maxLength) {
    rules.maxLength = { value: maxLength, message: `Máximo de ${maxLength} caracteres` };
  }
  if (type === 'number') {
    rules.valueAsNumber = true;
  }
  Object.assign(rules, validation);

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={full_name} className={styles.label}>{label}</label>
      <input
        type={type}
        id={full_name}
        {...register(full_name, rules)}
        {...rest} // Passa props extras como 'step'
        placeholder={placeholder}
        className={`${styles.input} ${inputClassName || styles.inputFullWidth}`}
        maxLength={maxLength}
        autoComplete={autoComplete}
        onBlur={onBlur}
        disabled={disabled}
      />
      {renderErrorMessage(errors[full_name]?.message)}
    </div>
  );
}
interface PhoneFieldProps {
  name: string;
  label: string;
  required?: boolean | string;
  className?: string;
  inputClassName?: string;
}

export function PhoneField({
  name,
  label,
  required = false,
  className = "",
  inputClassName = "",
}: PhoneFieldProps) {
  const { control, formState: { errors } } = useFormContext();

  const rules: RegisterOptions = {
    required: required ? (typeof required === 'string' ? required : `${label} é obrigatório`) : false,
  };

  const error = errors[name] as FieldError | undefined;
  const errorMessage = error?.message;

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={name} className={styles.label}>{label}</label>

    <Controller
      name={name}
      control={control}
      rules={rules} // As regras agora só contêm o 'required'
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <IMaskInput
          mask={[
            { mask: '(00) 0000-0000'},
            { mask: '(00) 00000-0000'}
          ]}
          value={value || ''}
          unmask={true}
          onAccept={(val, mask) => onChange(mask.unmaskedValue)}
          onBlur={onBlur}
          inputRef={ref}
          id={name}
          placeholder='(00) 00000-0000'
          className={`${styles.input} ${inputClassName || styles.inputWidthMedium}`}
        />
      )}
    />
    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  selectClassName?: string;
}

export const SelectField = ({ name, label, required, options, placeholder, ...rest }: SelectFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];
  const { selectClassName, className, ...cleanedRest } = rest;

  return (
    <div className={`${styles.formGroup} ${className || ''}`}>
      <label htmlFor={name} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <select
        id={name}
        {...register(name, { required })}
        {...cleanedRest} // agora sem `selectClassName`
        className={`${styles.input} ${selectClassName || ''}`} // aplica aqui corretamente
        defaultValue=""
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles.error}>{error.message as string}</p>}
    </div>
  );
};

// --- NameFields ---
export function NameFields() {
  return (
    <>
      <TextField
        fullName="full_name"
        label="Nome Completo"
        required="Obrigatório"
        className={styles.inputWidthLarge}
      />
    </>
  );
}

interface ContactFieldsProps {
  isForeigner?: boolean;
}

// --- ContactFields ---
export function ContactFields({
  isForeigner = false,
}: ContactFieldsProps) {

  const phoneKey = isForeigner ? 'international_phone' : 'phone';
  const optionalPhoneKey = isForeigner ? 'international_optional_phone' : 'optional_phone';

  return (
    <>
    {isForeigner ? (
      <>
        <InternationalPhoneField
          key={phoneKey}
          name='phone'
          label='Telefone internacional'
          required
        />

        <InternationalPhoneField
          key={optionalPhoneKey}
          name='optional_phone'
          label='Telefone Opcional'
          required={false}
        />
      </>
    ) : (
      <>
        <PhoneField
        key={phoneKey}
        name='phone'
        label='Telefone'
        />
        <PhoneField
        key={optionalPhoneKey}
        name='optional_phone'
        label='Telefone Opcional'
        required={false}
        />
      </>
    )}
  </>
  );
}

// --- PasswordField ---
interface PasswordFieldProps {
    name?: string;
    label?: string;
    requiredMessage?: string | boolean;
    autoComplete?: string;
    className?: string;
    inputClassName?: string;
}


export function PasswordField({
    name = "password",
    label = "Senha",
    requiredMessage = false,
    autoComplete = "new-password",
    inputClassName = ""
}: PasswordFieldProps) {
  return (
    <TextField
      fullName={name}
      label={label}
      type="password"
      required={requiredMessage}
      autoComplete={autoComplete}
      className={styles.inputWidthMedium}
      inputClassName={inputClassName}
    />
  );
}

// --- EmailField ---
interface EmailFieldProps {
    name?: string;
    label?: string;
    requiredMessage?: string | boolean;
    autoComplete?: string;
    className?: string; // Para o formGroup
    inputClassName?: string; // Para o input
}
export function EmailField({
    name = "email",
    label = "Email",
    requiredMessage = "Obrigatório",
    autoComplete = "email",
    inputClassName = ""
}: EmailFieldProps) {
  return (
    <TextField
      fullName={name}
      label={label}
      type="email"
      required={requiredMessage}
      autoComplete={autoComplete}
      className={styles.inputWidthMedium}
      inputClassName={inputClassName}
      validation={{
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Email inválido"
        }
      }}
    />
  );
}

interface AdressFieldsProps{
  onCepBlur?: () => void;
  isCepLoading?: boolean;
}

export function AddressFields({ onCepBlur, isCepLoading }: AdressFieldsProps) {

  return (
   <>
      <CepField
        name="cep"
        label="CEP"
        required
        onBlur={onCepBlur}
        disabled={isCepLoading}
      />
      <TextField fullName="street" label="Rua" required className={styles.inputWidthLarge} />
      <TextField fullName="number" label="Número" required inputClassName={styles.inputWidthXSmall} />
      <TextField fullName="complement" label="Complemento" inputClassName={styles.inputWidthMedium} />
      {/* 3. Corrigi o 'name' para bater com o que a API retorna */}
      <TextField fullName="neighborhood" label="Bairro" required inputClassName={styles.inputWidthMedium} />
      <TextField fullName="city" label="Cidade" required inputClassName={styles.inputWidthMedium} />
      <TextField fullName="state" label="Estado" required inputClassName={styles.inputWidthXSmall} />
    </>
  );
}

// --- FiscalFields ---
interface FiscalFieldsProps {
  taxIdName?: string;
  taxIdRequiredMessage?: string | boolean;
  enableSmartTaxIdValidation?: boolean;
  taxIdFormatErrorMessage?: string;
  taxIdInputClassName?: string; // Para o input de CPF/CNPJ (SingleTaxIdField)
  isLegal?: boolean;
  isForeigner?: boolean;

  stateIndentificationName?: string;
  stateIndentificationLabel?: string;
  stateIndentificationRequired?: boolean;
  stateIndentificationInputClassName?: string;

  stateRegistrationName?: string;
  stateRegistrationLabel?: string;
  stateRegistrationRequired?: string | boolean;
  stateRegistrationInputClassName?: string; // Para o input de IE (TextField)

  municipalRegistrationName?: string;
  municipalRegistrationLabel?: string;
  municipalRegistrationRequired?: string | boolean;
  municipalRegistrationInputClassName?: string; // Para o input de IM (TextField)

  taxIdClassName?: string;
  stateRegistrationClassName?: string; // Classe para o formGroup da IE
  municipalRegistrationClassName?: string; // Classe para o formGroup da IM

  onCnpjblur?: () => void; // Callback para o blur do CNPJ
  IsCnpjLoading?: boolean; // Indica se o CNPJ está sendo carregado
}

export function FiscalFields({
  taxIdName = "cpf_cnpj",
  taxIdRequiredMessage = "Obrigatório",
  enableSmartTaxIdValidation = true,
  isLegal = false,
  isForeigner = false,
  taxIdFormatErrorMessage,
  taxIdInputClassName = styles.inputWidthMedium,

  stateIndentificationName = 'identification',
  stateIndentificationLabel = 'Identificação',
  stateIndentificationRequired = false,
  stateIndentificationInputClassName = styles.inputWidthMedium,

  stateRegistrationName = "stateRegistration",
  stateRegistrationLabel = "Inscrição Estadual",
  stateRegistrationRequired = false,
  stateRegistrationInputClassName = styles.inputWidthMedium,

  municipalRegistrationName = "municipalRegistration",
  municipalRegistrationLabel = "Inscrição Municipal",
  municipalRegistrationRequired = false,
  municipalRegistrationInputClassName = styles.inputWidthMedium,

  taxIdClassName = "md:col-span-1",
  stateRegistrationClassName = "md:col-span-1",
  municipalRegistrationClassName = "md:col-span-1",

  onCnpjblur,
  IsCnpjLoading,
}: FiscalFieldsProps) {

  const { unregister } = useFormContext();

  useEffect(() => {
    if (isLegal) {

      unregister('identification');
      unregister('country');

    } else if (isForeigner) {

      unregister('cpf_cnpj');
      unregister('stateRegistration');
      unregister('municipalRegistration');
      unregister('taxRegime');

    } else {

      unregister('stateRegistration');
      unregister('municipalRegistration');
      unregister('identification');
      unregister('country');
      unregister('taxRegime');
    }
  }, [isLegal, isForeigner, unregister]);

  const dynamicTaxIdLabel = isLegal ? 'CNPJ' : 'CPF';
  const dynamicTaxIdPlaceholder = isLegal ? '00.000.000/0000-00' : '000.000.000-00';
  const taxRegimeOptions = Object.values(TaxRegimeType).map(value => ({ value, label: value }));

  return (
    <>
      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {(!isForeigner) && (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <SingleTaxIdField
              name={taxIdName}
              label={dynamicTaxIdLabel}
              docType={isLegal ? 'cnpj' : 'cpf'}
              placeholder={dynamicTaxIdPlaceholder}
              requiredMessage={taxIdRequiredMessage}
              enableSmartValidation={enableSmartTaxIdValidation}
              formatErrorMessage={taxIdFormatErrorMessage}
              className={taxIdClassName}
              inputClassName={taxIdInputClassName}
              onBlur={onCnpjblur}
              disabled={IsCnpjLoading}
            />
          </div>
        )}

        {isForeigner &&(
          <>
            <TextField
              fullName={stateIndentificationName}
              label={stateIndentificationLabel}
              required={stateIndentificationRequired}
              inputClassName={stateIndentificationInputClassName}
              />
            <TextField fullName="country" label="País" required inputClassName={styles.inputWidthMedium} />
          </>
        )}
      </div>

      {(isLegal && !isForeigner) && (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField
              name="taxRegime"
              label="Regime Tributário"
              options={taxRegimeOptions}
              required
              className="md:col-span-1"
              selectClassName={styles.input}
              placeholder="Selecione o Regime"
          />
          <TextField
            fullName={stateRegistrationName}
            label={stateRegistrationLabel}
            required={stateRegistrationRequired}
            className={stateRegistrationClassName}
            inputClassName={stateRegistrationInputClassName}
          />
          <TextField
            fullName={municipalRegistrationName}
            label={municipalRegistrationLabel}
            required={municipalRegistrationRequired}
            className={municipalRegistrationClassName}
            inputClassName={municipalRegistrationInputClassName}
          />
        </div>
      )}
    </>
  );
}

// --- ActivationCheckbox ---
export function ActivationCheckbox() {
  const { register } = useFormContext();
  return (
    <div className={styles.formGroup}>
      <label htmlFor="isActivate" className={styles.label} style={{ marginRight: '0.5rem' }}>Ativo</label>
      <input type="checkbox" id="isActivate" {...register('isActivate')} defaultChecked style={{ verticalAlign: 'middle' }}/>
    </div>
  );
}

interface TextAreaFieldProps {
  name: string;
  label: string;
  required?: string | boolean;
  placeholder?: string;
  className?: string; // For the container <div>
  textareaClassName?: string; // For the <textarea> element itself
}

export function TextAreaField({
  name,
  label,
  required = false,
  placeholder = "",
  className = "",
  textareaClassName = "", // Default is empty, allowing the base .textarea style to apply
}: TextAreaFieldProps) {
  const { register, formState: { errors } } = useFormContext();

  const rules: RegisterOptions = {};
  if (required) {
    rules.required = typeof required === 'string' ? required : `${label} é obrigatório`;
  }

  // A helper function you already have in the file
  function renderErrorMessage(message: any) {
    return typeof message === 'string' ? <p className={styles.error}>{message}</p> : null;
  }

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={name} className={styles.label}>{label}</label>
      <textarea
        id={name}
        {...register(name, rules)}
        placeholder={placeholder}
        className={`${styles.textarea} ${textareaClassName}`}
      />
      {renderErrorMessage(errors[name]?.message)}
    </div>
  );
}
