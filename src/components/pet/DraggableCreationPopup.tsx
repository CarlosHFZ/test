'use client';

// 1. IMPORTE o 'useRef' do React
import { GripVertical, X } from 'lucide-react';
import { useRef } from 'react';
import Draggable from 'react-draggable';
import { FormProvider, useForm } from 'react-hook-form';
import { TextField } from '../ui/formFields/formFields';
import styles from './DraggableCreationPopup.module.css';

// --- Interfaces ---
interface FormData {
  name: string;
}

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function DraggableCreationPopup({ isOpen, onClose, title, onSubmit, isLoading }: PopupProps) {
  const methods = useForm<FormData>();
  const { handleSubmit, reset } = methods;

  // 2. CRIE A REFERÊNCIA
  // `useRef(null)` cria uma referência que podemos "prender" a um elemento.
  const nodeRef = useRef(null);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
  };

  if (!isOpen) {
    return null;
  }

  return (
    // 3. PASSE A REFERÊNCIA PARA O DRAGGABLE e desative o findDOMNode
    // `nodeRef` é a solução moderna que resolve o erro.
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
      {/* E "prenda" a referência ao elemento que será arrastado */}
      <div ref={nodeRef} className={styles.popupContainer}>
        <div className={styles.header}>
          <GripVertical size={20} className="drag-handle text-gray-400 cursor-grab" />
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={18} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
            <TextField
              fullName="name"
              label="Nome"
              required
            />
            <div className={styles.footer}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancelar
              </button>
              <button type="submit" disabled={isLoading} className={styles.submitButton}>
                {isLoading ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Draggable>
  );
}
