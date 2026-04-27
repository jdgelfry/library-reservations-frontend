'use client';

import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useState } from 'react';
import { CREATE_BOOK, DELETE_BOOK, GET_BOOKS, UPDATE_BOOK } from '@/lib/graphql';
import type { Book } from '@/lib/types';

type BookForm = {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: string;
};

const emptyForm: BookForm = { title: '', author: '', isbn: '', publishedYear: '' };

export default function BooksPage() {
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [message, setMessage] = useState('');

  const { data, loading } = useQuery<{ books: Book[] }>(GET_BOOKS);
  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, { refetchQueries: [{ query: GET_BOOKS }] });
  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, { refetchQueries: [{ query: GET_BOOKS }] });
  const [deleteBook] = useMutation(DELETE_BOOK, { refetchQueries: [{ query: GET_BOOKS }] });

  const isEditing = Boolean(form.id);
  const saving = creating || updating;

  function setField(field: keyof BookForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const input = {
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
    };

    try {
      if (isEditing) {
        await updateBook({ variables: { input: { id: form.id, ...input } } });
        setMessage('Libro actualizado correctamente.');
      } else {
        await createBook({ variables: { input } });
        setMessage('Libro creado correctamente.');
      }
      setForm(emptyForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el libro.');
    }
  }

  async function handleDelete(id: string) {
    setMessage('');
    try {
      await deleteBook({ variables: { id } });
      setMessage('Libro eliminado correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar el libro.');
    }
  }

  function handleEdit(book: Book) {
    setForm({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.publishedYear ? String(book.publishedYear) : '',
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{isEditing ? 'Editar libro' : 'Crear libro'}</h2>

        <label className="mb-3 block text-sm font-medium">
          Título
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.title} onChange={(e) => setField('title', e.target.value)} />
        </label>

        <label className="mb-3 block text-sm font-medium">
          Autor
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.author} onChange={(e) => setField('author', e.target.value)} />
        </label>

        <label className="mb-3 block text-sm font-medium">
          ISBN
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.isbn} onChange={(e) => setField('isbn', e.target.value)} />
        </label>

        <label className="mb-4 block text-sm font-medium">
          Año de publicación
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={form.publishedYear}
            onChange={(e) => setField('publishedYear', e.target.value)}
            type="number"
          />
        </label>

        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:bg-slate-400" disabled={saving} type="submit">
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
          {isEditing && (
            <button className="rounded-xl border px-4 py-2 font-semibold" type="button" onClick={() => setForm(emptyForm)}>
              Cancelar
            </button>
          )}
        </div>

        {message && <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      </form>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Libros</h2>
        {loading && <p className="text-sm text-slate-500">Cargando libros...</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Título</th>
                <th className="py-2">Autor</th>
                <th className="py-2">ISBN</th>
                <th className="py-2">Año</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.books.map((book) => (
                <tr key={book.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{book.title}</td>
                  <td className="py-3 text-slate-600">{book.author}</td>
                  <td className="py-3 text-slate-600">{book.isbn}</td>
                  <td className="py-3 text-slate-600">{book.publishedYear ?? '-'}</td>
                  <td className="py-3 text-right">
                    <button className="mr-2 rounded-lg border px-3 py-1" onClick={() => handleEdit(book)} type="button">
                      Editar
                    </button>
                    <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600" onClick={() => handleDelete(book.id)} type="button">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
