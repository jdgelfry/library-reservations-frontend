import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    createdAt
    updatedAt
  }
`;

export const BOOK_FIELDS = gql`
  fragment BookFields on Book {
    id
    title
    author
    isbn
    publishedYear
    isDeleted
    createdAt
    updatedAt
  }
`;

export const RESERVATION_FIELDS = gql`
  fragment ReservationFields on Reservation {
    id
    userId
    bookId
    reservationDate
    returnDate
    returnedAt
    status
    user {
      id
      name
      email
    }
    book {
      id
      title
      author
      isbn
    }
  }
`;

export const GET_USERS = gql`
  ${USER_FIELDS}
  query Users {
    users {
      ...UserFields
    }
  }
`;

export const CREATE_USER = gql`
  ${USER_FIELDS}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`;

export const GET_BOOKS = gql`
  ${BOOK_FIELDS}
  query Books {
    books {
      ...BookFields
    }
  }
`;

export const GET_AVAILABLE_BOOKS = gql`
  ${BOOK_FIELDS}
  query AvailableBooks {
    availableBooks {
      ...BookFields
    }
  }
`;

export const CREATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      ...BookFields
    }
  }
`;

export const UPDATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation UpdateBook($input: UpdateBookInput!) {
    updateBook(input: $input) {
      ...BookFields
    }
  }
`;

export const DELETE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      ...BookFields
    }
  }
`;

export const CREATE_RESERVATION = gql`
  ${RESERVATION_FIELDS}
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      ...ReservationFields
    }
  }
`;

export const RESERVATIONS_BY_BOOK = gql`
  ${RESERVATION_FIELDS}
  query ReservationsByBook($bookId: ID!, $filter: ReservationDateFilterInput) {
    reservationsByBook(bookId: $bookId, filter: $filter) {
      ...ReservationFields
    }
  }
`;

export const RESERVATIONS_BY_USER = gql`
  ${RESERVATION_FIELDS}
  query ReservationsByUser($userId: ID!, $filter: ReservationDateFilterInput) {
    reservationsByUser(userId: $userId, filter: $filter) {
      ...ReservationFields
    }
  }
`;

export const RETURN_BOOK = gql`
  ${RESERVATION_FIELDS}
  mutation ReturnBook($reservationId: ID!) {
    returnBook(reservationId: $reservationId) {
      ...ReservationFields
    }
  }
`;
