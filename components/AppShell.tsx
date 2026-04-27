import Link from 'next/link';
import { ReactNode } from 'react';

const menu = [
  { href: '/', label: 'Libros disponibles' },
  { href: '/users', label: 'Usuarios' },
  { href: '/books', label: 'CRUD libros' },
  { href: '/reservations', label: 'Consultas y devolución' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">Biblioteca Grupo NEX</h1>
            <p className="text-sm text-slate-500">Reservas de libros con Next.js, GraphQL, NestJS y Prisma</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {menu.map((item) => (
              <Link
                key={item.href}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-slate-100"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
