import { AdminContainer } from '@/components/layout/AdminContainer';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout allowedRoles={['ADMIN']}>
      <AdminContainer>
        {children}
      </AdminContainer>
    </ProtectedLayout>
  );
}
