'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import {
  GET_BOOKS,
  GET_USERS,
  RESERVATIONS_BY_BOOK,
  RESERVATIONS_BY_USER,
  RETURN_BOOK,
} from '@/lib/graphql';
import type { Book, Reservation, User } from '@/lib/types';
import { formatDate, toEndOfDayIso, toStartOfDayIso } from '@/lib/date';
import { useLanguage } from '@/lib/language-context';
import { getTranslation } from '@/lib/translations';

type Mode = 'book' | 'user';

function buildFilter(from: string, to: string) {
  const filter: { from?: string; to?: string } = {};
  if (from) filter.from = toStartOfDayIso(from);
  if (to) filter.to = toEndOfDayIso(to);
  return Object.keys(filter).length ? filter : undefined;
}

export default function ReservationsPage() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const [mode, setMode] = useState<Mode>('book');
  const [selectedId, setSelectedId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const { data: usersData } = useQuery<{ users: User[] }>(GET_USERS);
  const { data: booksData } = useQuery<{ books: Book[] }>(GET_BOOKS);

  const query = mode === 'book' ? RESERVATIONS_BY_BOOK : RESERVATIONS_BY_USER;
  const variables = useMemo(() => {
    const filter = buildFilter(from, to);
    return mode === 'book' ? { bookId: selectedId, filter } : { userId: selectedId, filter };
  }, [from, mode, selectedId, to]);

  const { data, loading, refetch } = useQuery<{ reservationsByBook?: Reservation[]; reservationsByUser?: Reservation[] }>(query, {
    variables,
    skip: !selectedId,
    fetchPolicy: 'cache-and-network',
  });

  const [returnBook, { loading: returning }] = useMutation(RETURN_BOOK);
  const reservations = mode === 'book' ? data?.reservationsByBook ?? [] : data?.reservationsByUser ?? [];

  async function handleReturn(reservationId: string) {
    setMessage('');
    try {
      await returnBook({ variables: { reservationId } });
      await refetch();
      setMessage(t('reservations.bookReturned'));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t('reservations.returnFailed'));
    }
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{t('reservations.queryReservations')}</h2>
        <p className="text-sm text-slate-500">{t('reservations.filterByDateRange')}</p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-5">
        <label className="text-sm font-medium">
          {t('reservations.queryType')}
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              setSelectedId('');
            }}
          >
            <option value="book">{t('reservations.reservationsByBook')}</option>
            <option value="user">{t('reservations.reservationsByUser')}</option>
          </select>
        </label>

        <label className="text-sm font-medium md:col-span-2">
          {mode === 'book' ? t('reservations.book') : t('users.users')}
          <select className="mt-1 w-full rounded-xl border px-3 py-2" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">{t('common.select')}</option>
            {mode === 'book'
              ? booksData?.books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author}
                  </option>
                ))
              : usersData?.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
          </select>
        </label>

        <label className="text-sm font-medium">
          {t('reservations.from')}
          <input className="mt-1 w-full rounded-xl border px-3 py-2" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>

        <label className="text-sm font-medium">
          {t('reservations.to')}
          <input className="mt-1 w-full rounded-xl border px-3 py-2" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>

      {message && <p className="mb-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      {loading && <p className="text-sm text-slate-500">{t('common.loading')}</p>}
      {!selectedId && <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500">{t('reservations.selectBookOrUser')}</p>}

      {selectedId && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">{t('reservations.book')}</th>
                <th className="py-2">{t('users.users')}</th>
                <th className="py-2">{t('reservations.reservationDate')}</th>
                <th className="py-2">{t('reservations.returnDateColumn')}</th>
                <th className="py-2">{t('reservations.returnedAt')}</th>
                <th className="py-2">{t('reservations.status')}</th>
                <th className="py-2 text-right">{t('reservations.action')}</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{reservation.book?.title ?? reservation.bookId}</td>
                  <td className="py-3 text-slate-600">{reservation.user?.name ?? reservation.userId}</td>
                  <td className="py-3 text-slate-600">{formatDate(reservation.reservationDate)}</td>
                  <td className="py-3 text-slate-600">{formatDate(reservation.returnDate)}</td>
                  <td className="py-3 text-slate-600">{formatDate(reservation.returnedAt)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${reservation.status === 'ACTIVE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {reservation.status === 'ACTIVE' ? t('reservations.active') : t('reservations.returned')}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {reservation.status === 'ACTIVE' ? (
                      <button
                        className="rounded-lg border px-3 py-1 font-medium hover:bg-slate-100 disabled:opacity-50"
                        disabled={returning}
                        onClick={() => handleReturn(reservation.id)}
                        type="button"
                      >
                        {t('reservations.returnBook')}
                      </button>
                    ) : (
                      <span className="text-slate-400">{t('reservations.noAction')}</span>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && !loading && (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={7}>
                    {t('reservations.noReservations')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
