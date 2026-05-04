'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useLanguage } from '@/lib/language-context';
import { getTranslation } from '@/lib/translations';

export function AppShell({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const menu = [
    { href: '/', label: t('nav.home') },
    { href: '/users', label: t('nav.users') },
    { href: '/books', label: t('nav.books') },
    { href: '/reservations', label: t('nav.reservations') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">{t('nav.appTitle')}</h1>
            <p className="text-sm text-slate-500">{t('nav.appSubtitle')}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {menu.map((item) => (
              <Link
                key={item.href}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-2 flex gap-1 border-l border-slate-200 pl-2">
              <button
                className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
                  language === 'es'
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100'
                }`}
                onClick={() => setLanguage('es')}
              >
                ES
              </button>
              <button
                className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
                  language === 'en'
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100'
                }`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <footer className="border-t bg-white px-4 py-3 text-center text-sm text-slate-500">
        <p>Biblioteca Grupo NEX - Prueba técnica Full Stack Developer</p>
      </footer>
    </div>
  );
}
