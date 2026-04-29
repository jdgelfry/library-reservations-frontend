# Library Reservations Frontend

Frontend de la prueba tecnica para gestionar reservas de libros de una biblioteca.

## Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Apollo Client
- GraphQL
- Yarn

## Que incluye

- Pagina inicial con listado de libros disponibles.
- Reserva directa de un libro indicando usuario y fecha de devolucion.
- Menu de navegacion.
- Creacion de usuarios.
- CRUD completo de libros.
- Consulta de reservas por usuario con filtro de fechas.
- Consulta de reservas por libro con filtro de fechas.
- Retorno de libros activos.

## Requisitos

- Node.js 20+
- Yarn
- Docker y Docker Compose, si se ejecuta con contenedores
- Backend corriendo en `http://localhost:4000/graphql`

## Variable de entorno

`.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:4000/graphql"
```

El archivo `.env.example` ya incluye esta variable como referencia.

## Ejecutar con Docker

Primero asegurate de tener corriendo el backend.

Luego ejecuta:

```bash
docker compose up --build
```

Este comando levanta el frontend en modo desarrollo con hot reload.
Si guardas cambios en el codigo, el navegador debe recargar automaticamente.

Frontend disponible en:

```txt
http://localhost:3000
```

## Ejecutar en local sin Docker

```bash
cp .env.example .env.local
yarn install
yarn dev
```

Frontend disponible en:

```txt
http://localhost:3000
```

## Build de produccion con Docker

Para construir la imagen final optimizada:

```bash
docker build --target runner --build-arg NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql -t library-reservations-frontend .
```

Para ejecutar esa imagen:

```bash
docker run --rm -p 3000:3000 library-reservations-frontend
```

## Orden recomendado para probar

1. Levantar el backend.
2. Confirmar que GraphQL abre en `http://localhost:4000/graphql`.
3. Levantar este frontend.
4. Entrar a `http://localhost:3000`.
5. Ver libros disponibles del seed.
6. Reservar un libro con un usuario del seed.
7. Ir a `Consultas y devolucion`.
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
