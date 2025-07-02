'use client';

import { CertificateUploadModal } from '@/components/enterprise/CertificateUploadModal';
import { EnterpriseForm } from '@/components/enterprise/EnterpriseForm';
import { EnterpriseList } from '@/components/enterprise/EnterpriseList';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { MainPanel } from '@/components/layout/MainPanel';
import { PetGuardianForm } from '@/components/pet-guardian/PetGuardianForm.tsx';
import { PetGuardianList } from '@/components/pet-guardian/PetGuardianList';
import { PetForm } from '@/components/pet/PetForm';
import { PetList } from '@/components/pet/PetList';
import { UserForm } from '@/components/user/UserForm';
import { UserList } from '@/components/user/UserList';
import { useAuth } from '@/context/AuthContext';
import { useCertificateStatus } from '@/hooks/enterprises/useCertificateStatus';
import { PageMode } from '@/types/PageMode';
import { useQueryClient } from '@tanstack/react-query'; // 1. Importe o useQueryClient
import { useState } from 'react';
import styles from './AdminPage.module.css';


export default function AdminPage() {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState<PageMode>('home')
  const [modalManuallyClosed, setModalManuallyClosed] = useState(false);
  const queryClient = useQueryClient();
  const { data: certificateStatus, isLoading } = useCertificateStatus(user?.enterprise_id || '');
  const shouldModalBeOpen = !isLoading && certificateStatus?.isValid === false;
  const isModalVisible = shouldModalBeOpen && !modalManuallyClosed;

  const handleUploadSuccess = () => {
    console.log('Certificate uploaded successfully');
    queryClient.invalidateQueries({ queryKey: ['enterprise', user?.enterprise_id, 'isValid'] });
  };

  const firstName = localStorage.getItem('FIRST_NAME');

  return (
    <div className={styles.dashboardContainer}>
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', borderRadius: '5px', zIndex: 100 }}>
        {user ? `Bem vindo ${firstName}` : 'Aguardando usuário...'}
      </div>
      {certificateStatus?.isExpiringSoon && (
        <div style={{ padding: '1rem', backgroundColor: 'yellow', color: 'black' }}>
          <strong>Atenção:</strong> Seu certificado digital irá expirar em breve!
        </div>
      )}
      <CertificateUploadModal
        isOpen={isModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setModalManuallyClosed(true);
          }
        }}
        enterpriseId={user?.enterprise_id || ''}
        onUploadSuccess={handleUploadSuccess}
      />
      <AdminSidebar onNav={setMode} current={mode} onLogout={logout} />
      <MainPanel>
        {mode === 'home' && (
          <div className={styles.info}>
            <h1 className={styles.title}>Bem-vindo ao Painel de Administração</h1>
            <span>Selecione uma opção no menu lateral.</span>
          </div>
        )}

        {mode === 'enterprises_list' && (
            <EnterpriseList
              onRegister={() => setMode('register-enterprise')}
              onBack={() => setMode('home')}
            />
        )}

        {mode === 'register-enterprise' && (
          <div className={styles.enterpriseList}>
            <div className={styles.enterpriseListHeader}>
              <h2>Cadastrar Nova Empresa</h2>
            </div>
            <EnterpriseForm
              initialData={undefined}
              onSuccess={() => setMode('enterprises_list')}
              onCancel={() => setMode('enterprises_list')}
            />
          </div>
        )}

        {mode === 'users_list' && (
          <UserList
            onRegister={() => setMode('register-user')}
            onBack={() => setMode('home')}
          />
        )}

        {mode === 'register-user' && (
          <div className={styles.enterpriseList}>
            <div className={styles.enterpriseListHeader}>
              <h2>Cadastrar Novo Usuário</h2>
            </div>
            <UserForm
              initialData={undefined}
              onSuccess={() => setMode('users_list')}
              onCancel={() => setMode('users_list')}
            />
          </div>
        )}

        {mode === 'guardians_list' && (
          <PetGuardianList
            onRegister={() => setMode('register-guardian')}
            onBack={() => setMode('home')}
          />
        )}

        {mode === 'register-guardian' && (
          <div className={styles.enterpriseList}>
            <div className={styles.enterpriseListHeader}>
              <h2>Cadastrar Novo Tutor</h2>
            </div>
            <PetGuardianForm
              initialData={undefined}
              onSuccess={() => setMode('guardians_list')}
              onCancel={() => setMode('guardians_list')}
            />
          </div>
        )}

        {mode === 'pets_list' && (
          <PetList
            onRegister={() => setMode('register-pet')}
            onBack={() => setMode('home')}
          />
        )}

        {mode === 'register-pet' && (
          <div className={styles.enterpriseList}>
            <div className={styles.enterpriseListHeader}>
              <h2>Cadastrar Novo Pet</h2>
            </div>
            <PetForm
              initialData={undefined}
              onSuccess={() => setMode('pets_list')}
              onCancel={() => setMode('pets_list')}
            />
          </div>
        )}



      </MainPanel>
    </div>
  );
}
