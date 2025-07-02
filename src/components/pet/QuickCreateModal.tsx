'use client';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { TextField } from '../ui/formFields/formFields';

interface FormData {
  name: string;
}

interface QuickCreateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resourceName: string;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function QuickCreateModal({ isOpen, onOpenChange, resourceName, onSubmit, isLoading }: QuickCreateModalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={() => reset()}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <ModalHeader>Criar Nova {resourceName}</ModalHeader>
            <ModalBody>
              <TextField
                fullName="name"
                label={`Nome da ${resourceName}`}
                required
                {...register("name", { required: true })}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={onClose}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
