import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/AppShell';
import { LanguageProvider } from '@/lib/language-context';

export const metadata: Metadata = {
  title: 'Biblioteca Grupo NEX',
  description: 'Prueba técnica Full Stack Developer',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
