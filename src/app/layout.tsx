import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css'; // <<--- CORREÇÃO: O nome do arquivo é 'global.css' (sem o 's')
import { Providers } from './providers'; // Mantendo seus Providers

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pet Health Control', // Você pode customizar o título
  description: 'Sistema de gerenciamento para pet shops e clínicas.', // E a descrição
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* Envolvemos os filhos com os seus providers existentes */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
