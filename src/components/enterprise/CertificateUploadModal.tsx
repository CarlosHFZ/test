// src/components/enterprise/CertificateUploadModal.tsx
'use client';

// Importações do shadcn/ui que você instalou
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CertificateUploader } from './CertificateUploadForm'; // Nosso formulário refatorado

interface CertificateUploadModalProps {
  isOpen: boolean;
  enterpriseId: string;
  onUploadSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function CertificateUploadModal({
  isOpen,
  enterpriseId,
  onUploadSuccess,
  onOpenChange,

}: CertificateUploadModalProps) {

  const handleSuccess = () => {
    onUploadSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Primeiro Acesso</DialogTitle>
          <DialogDescription>
            Para continuar, por favor, faça o upload do seu Certificado Digital A1.
          </DialogDescription>
        </DialogHeader>
        <CertificateUploader enterpriseId={enterpriseId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
