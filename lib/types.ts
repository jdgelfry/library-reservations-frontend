export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear?: number | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReservationStatus = 'ACTIVE' | 'RETURNED';

export type Reservation = {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: string;
  returnDate: string;
  returnedAt?: string | null;
  status: ReservationStatus;
  user?: User;
  book?: Book;
};
