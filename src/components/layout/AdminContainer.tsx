// src/components/layout/AdminContainer.tsx
import { ReactNode } from 'react';

export function AdminContainer({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '10vh', background: '#f7f3ef', color: '#3d2c1e' }}>
      {children}
    </div>
  );
}
