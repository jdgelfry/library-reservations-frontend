# Library Reservations Frontend

Frontend de la prueba técnica para gestionar reservas de libros de una biblioteca.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Apollo Client
- GraphQL

## Qué incluye

- Página inicial con listado de libros disponibles.
- Reserva directa de un libro indicando usuario y fecha de devolución.
- Menú de navegación.
- Creación de usuarios.
- CRUD completo de libros.
- Consulta de reservas por usuario con filtro de fechas.
- Consulta de reservas por libro con filtro de fechas.
- Retorno de libros activos.

## Requisitos

- Node.js 20+
- npm
- Backend corriendo en `http://localhost:4000/graphql`

## Ejecutar con Docker

Primero asegúrate de tener corriendo el backend.

Luego ejecuta:

```bash
docker compose up --build
```

Este comando levanta el frontend en modo desarrollo con hot reload.
Si guardas cambios en el código, el navegador debe recargar automáticamente.

Frontend disponible en:

```txt
http://localhost:3000
```

## Ejecutar en local sin Docker

```bash
cp .env.example .env.local
npm install
npm run dev
```

Frontend disponible en:

```txt
http://localhost:3000
```

## Variable de entorno

`.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Orden recomendado para probar

1. Levantar el backend.
2. Confirmar que GraphQL abre en `http://localhost:4000/graphql`.
3. Levantar este frontend.
4. Entrar a `http://localhost:3000`.
5. Ver libros disponibles del seed.
6. Reservar un libro con un usuario del seed.
7. Ir a `Consultas y devolución`.
8. Consultar reservas por libro o usuario usando filtro de fechas.
9. Retornar una reserva activa.

## Subir a GitHub

```bash
git init
git add .
git commit -m "Initial frontend implementation"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO_FRONTEND
git push -u origin main
```
