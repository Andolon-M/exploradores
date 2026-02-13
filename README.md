# Exploradores API

Backend independiente para el dominio de Exploradores.

## Incluye

- Autenticacion propia (JWT)
- Prisma + MariaDB
- Swagger
- Rate limit
- Modulos base: `auth`, `explorers`, `commanders`

## Ejecutar en local

1. Copia `.env.example` a `.env`.
2. Instala dependencias:
   - `npm install`
3. Genera Prisma client:
   - `npm run prisma:generate`
4. Ejecuta migraciones:
   - `npm run prisma:migrate`
5. Ejecuta seed inicial:
   - `npm run seed`
6. Levanta API:
   - `npm run dev`

## Documentacion

- Swagger UI: `http://localhost:3010/api-docs`
- Health: `http://localhost:3010/api/health`
