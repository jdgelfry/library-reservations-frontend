'use client';

import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useState } from 'react';
import { CREATE_USER, GET_USERS } from '@/lib/graphql';
import type { User } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import { getTranslation } from '@/lib/translations';

export default function UsersPage() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { data, loading } = useQuery<{ users: User[] }>(GET_USERS);
  const [createUser, { loading: saving }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    try {
      await createUser({ variables: { input: { name, email } } });
      setName('');
      setEmail('');
      setMessage(t('users.userCreated'));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t('users.userFailed'));
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{t('users.createUser')}</h2>

        <label className="mb-3 block text-sm font-medium">
          {t('users.name')}
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Juan Pérez"
          />
        </label>

        <label className="mb-4 block text-sm font-medium">
          {t('users.email')}
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@example.com"
            type="email"
          />
        </label>

        <button
          className="w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400"
          disabled={saving}
          type="submit"
        >
          {saving ? t('common.loading') : t('users.createUser')}
        </button>

        {message && <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      </form>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{t('users.users')}</h2>
        {loading && <p className="text-sm text-slate-500">{t('common.loading')}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">{t('users.userName')}</th>
                <th className="py-2">{t('users.userEmail')}</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{user.name}</td>
                  <td className="py-3 text-slate-600">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
