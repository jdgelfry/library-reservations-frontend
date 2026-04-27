'use client';

import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useMemo, useState } from 'react';
import { CREATE_RESERVATION, GET_AVAILABLE_BOOKS, GET_USERS } from '@/lib/graphql';
import type { Book, User } from '@/lib/types';
import { toEndOfDayIso } from '@/lib/date';

export default function HomePage() {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');

  const { data: booksData, loading: loadingBooks } = useQuery<{ availableBooks: Book[] }>(GET_AVAILABLE_BOOKS);
  const { data: usersData, loading: loadingUsers } = useQuery<{ users: User[] }>(GET_USERS);

  const [createReservation, { loading: saving }] = useMutation(CREATE_RESERVATION, {
    refetchQueries: [{ query: GET_AVAILABLE_BOOKS }],
  });

  const selectedBook = useMemo(
    () => booksData?.availableBooks.find((book) => book.id === selectedBookId),
    [booksData?.availableBooks, selectedBookId],
  );

  async function handleReserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!selectedBookId || !selectedUserId || !returnDate) {
      setMessage('Selecciona libro, usuario y fecha de devolución.');
      return;
    }

    try {
      await createReservation({
        variables: {
          input: {
            bookId: selectedBookId,
            userId: selectedUserId,
            reservationDate: new Date().toISOString(),
            returnDate: toEndOfDayIso(returnDate),
          },
        },
      });

      setMessage('Reserva creada correctamente.');
      setSelectedBookId('');
      setSelectedUserId('');
      setReturnDate('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo crear la reserva.');
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Libros disponibles</h2>
            <p className="text-sm text-slate-500">Solo aparecen los libros sin reserva activa.</p>
          </div>
          {(loadingBooks || loadingUsers) && <span className="text-sm text-slate-500">Cargando...</span>}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {booksData?.availableBooks.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBookId(book.id)}
              className={`rounded-2xl border p-4 text-left transition hover:border-slate-400 ${
                selectedBookId === book.id ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-white'
              }`}
            >
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-slate-600">{book.author}</p>
              <p className="mt-2 text-xs text-slate-400">ISBN: {book.isbn}</p>
            </button>
          ))}

          {booksData?.availableBooks.length === 0 && !loadingBooks && (
            <p className="col-span-full rounded-xl bg-slate-100 p-4 text-sm text-slate-500">
              No hay libros disponibles en este momento.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleReserve} className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Reservar libro</h2>
        <p className="mb-4 text-sm text-slate-500">
          Libro seleccionado: <strong>{selectedBook?.title ?? 'Ninguno'}</strong>
        </p>

        <label className="mb-3 block text-sm font-medium">
          Usuario
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
          >
            <option value="">Seleccionar usuario</option>
            {usersData?.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-4 block text-sm font-medium">
          Fecha de devolución
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            type="date"
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
          />
        </label>

        <button
          className="w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={saving}
          type="submit"
        >
          {saving ? 'Reservando...' : 'Reservar'}
        </button>

        {message && <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      </form>
    </section>
  );
}
