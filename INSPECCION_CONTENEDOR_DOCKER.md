# Pasos para crear e inspeccionar un contenedor Docker

## 1. Construir la imagen Docker

Desde la raíz del proyecto, ejecuta:

```powershell
docker build -t products-api-local -f apps/products-api/Dockerfile .
```

## 2. Crear un contenedor en modo interactivo (sin iniciar la app)

Esto te permite inspeccionar los archivos antes de que se ejecute nada:

```powershell
docker run --rm -it --entrypoint powershell products-api-local
```

> Si tu imagen solo tiene bash o sh, usa `--entrypoint sh` o `--entrypoint bash`.

## 3. Explorar los archivos dentro del contenedor

Dentro del contenedor, puedes usar comandos como:

```powershell
ls
ls dist
ls prisma
ls node_modules
```

O para ver el contenido de un archivo específico:

```powershell
cat prisma/seed.js
```

## 4. Salir del contenedor

Simplemente ejecuta:

```powershell
exit
```

---

## Notas

- El flag `--rm` elimina el contenedor al salir.
- El flag `-it` te da una terminal interactiva.
- Puedes cambiar el nombre de la imagen (`products-api-local`) según corresponda.
- Si quieres inspeccionar un contenedor ya corriendo, usa `docker exec -it <container_id> powershell` (o `sh`/`bash`).
