// src/components/enterprise/CertificateUploadForm.tsx
'use client';

import { useUploadCertificate } from '@/hooks/enterprises/useUploadCertificate';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface CertificateUploaderProps {
  enterpriseId: string;
  onSuccess: () => void; // Callback para notificar o modal que o upload deu certo
}

// O formulário agora é focado apenas na UI e em chamar a mutação.
export function CertificateUploader({ enterpriseId, onSuccess }: CertificateUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');

  const { mutate: upload, isPending } = useUploadCertificate({
    onSuccess: (data) => {
      toast.success(data.message || 'Certificado enviado com sucesso!');
      onSuccess(); // Chama o callback para, por exemplo, fechar o modal.
    },
    onError: (error) => {
      toast.error(error.message || 'Falha no upload do certificado.');
    },
  });

  const handleSubmit = () => {
    if (!file || !password) {
      toast.warn('Por favor, selecione um arquivo e digite a senha.');
      return;
    }
    upload({ enterpriseId, file, password });
  };

  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="certificateFile" className="text-sm font-medium">Arquivo (.pfx, .p12)</label>
        <input
          id="certificateFile"
          type="file"
          accept=".pfx,.p12"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="certificatePassword">Senha do Certificado</label>
        <input
          id="certificatePassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******"
          className="p-2 border rounded-md"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !file || !password}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? 'Enviando...' : 'Enviar Certificado'}
      </button>
    </div>
  );
}
