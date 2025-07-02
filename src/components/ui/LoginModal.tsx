// components/FormModal.tsx
import { ReactNode } from 'react';
import { Modal } from './Modal';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode; // seu <EnterpriseForm /> ou similar
}

export function FormModal({ isOpen, title, onClose, children }: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{title}</h2>
      {children}
    </Modal>
  );
}
