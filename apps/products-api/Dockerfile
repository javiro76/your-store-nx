# Etapa 1: Construcción de la aplicación
FROM node:22-alpine AS builder

WORKDIR /app

# Copia los archivos de dependencias primero para aprovechar el cache
COPY package.json package-lock.json tsconfig.base.json ./
RUN npm ci

# Copia el resto del código fuente
COPY . .

# Regenera Prisma client para Alpine y compila la aplicación
RUN npx prisma generate --schema=apps/products-api/prisma/schema.prisma
RUN npx nx build products-api

# Etapa 2: Imagen final para producción
FROM node:22-alpine

WORKDIR /app

# Copia solo los archivos necesarios desde la etapa de build
COPY --from=builder /app/dist/apps/products-api ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Copia el cliente generado de Prisma y sus engines
COPY --from=builder /app/apps/products-api/generated/products-client ./apps/products-api/generated/products-client

# Instala solo dependencias de producción
RUN npm ci --omit=dev

# Copia el schema de Prisma para poder ejecutar migraciones
COPY --from=builder /app/apps/products-api/prisma ./apps/products-api/prisma

EXPOSE 3001

# Script de inicio que ejecuta migraciones, siembra los datos y luego la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy --schema=apps/products-api/prisma/schema.prisma && node apps/products-api/prisma/seed.js && node dist/main.js"]
