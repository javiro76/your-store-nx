# 🚀 Guía de Despliegue - Your Store NX

Esta guía te ayudará a desplegar tu aplicación en DigitalOcean usando Docker y GitHub Actions.

## 📋 Prerrequisitos

### 1. En tu máquina local:
- [x] Git
- [x] GitHub CLI (`gh`) instalado
- [x] Docker Hub Account

### 2. En DigitalOcean:
- [x] Droplet creado (Ubuntu 22.04 LTS recomendado)
- [x] Acceso SSH configurado con llaves

## 🔧 Configuración Inicial

### Paso 1: Preparar el Droplet

```bash
# Conectar al droplet
ssh root@tu_ip_del_droplet

# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Configurar firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Crear directorio del proyecto
mkdir ~/your-store-nx
cd ~/your-store-nx

# Crear archivo de variables de producción
nano .env.prod
```

### Paso 2: Configurar `.env.prod` en el servidor

```bash
# Contenido del archivo .env.prod (copia y pega, cambia los valores)
DOCKERHUB_USERNAME=tu-usuario-dockerhub
JWT_SECRET=genera-un-jwt-secreto-muy-seguro-aqui
CUSTOMERS_DATABASE_URL=postgresql://customers_user:password_super_segura@customers-db:5432/customers_db
CUSTOMERS_DB_USER=customers_user
CUSTOMERS_DB_PASSWORD=password_super_segura
CUSTOMERS_DB_NAME=customers_db
PRODUCTS_DATABASE_URL=postgresql://products_user:otra_password_segura@products-db:5432/products_db
PRODUCTS_DB_USER=products_user
PRODUCTS_DB_PASSWORD=otra_password_segura
PRODUCTS_DB_NAME=products_db
```

### Paso 3: Configurar GitHub Secrets

Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**

Agrega estos secretos:

```
DOCKERHUB_USERNAME: tu-usuario-dockerhub
DOCKERHUB_TOKEN: dckr_pat_xxxxxxxxx (tu access token)
DROPLET_HOST: tu_ip_del_droplet
DROPLET_USERNAME: root (o tu usuario SSH)
SSH_PRIVATE_KEY: -----BEGIN OPENSSH PRIVATE KEY----- (tu llave SSH privada)
```

## 🏗️ Primer Despliegue

### Método 1: Push a main (Automático)
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### Método 2: Ejecutar manualmente
1. Ve a tu repo en GitHub
2. **Actions** → **Deploy to DigitalOcean Droplet**
3. **Run workflow** → **Run workflow**

## 🔍 Verificación del Despliegue

### En el servidor:
```bash
# Conectarse al droplet
ssh root@tu_ip_del_droplet
cd ~/your-store-nx

# Ver estado de los contenedores
docker-compose -f docker-compose.prod.yml ps

# Ver logs en caso de problemas
docker-compose -f docker-compose.prod.yml logs
```

### Desde internet:
```bash
# Probar el health check
curl http://tu_ip_del_droplet/health

# Probar las APIs
curl http://tu_ip_del_droplet/api/customers
curl http://tu_ip_del_droplet/api/products
```

## 🛠️ Arquitectura del Sistema

```
Internet → [Nginx:80/443] → [customers-api:3000] → [customers-db:5432]
                         → [products-api:3001]  → [products-db:5432]
```

### Endpoints disponibles:
- `GET /` - Información del API Gateway
- `GET /health` - Health check
- `GET /api/customers/*` - API de Customers
- `GET /api/products/*` - API de Products

## 🔄 Despliegues Posteriores

Cada vez que hagas push a la rama `main`, se ejecutará automáticamente:

1. **Build**: Construye las imágenes Docker
2. **Push**: Sube las imágenes a Docker Hub
3. **Deploy**: Actualiza el servidor con las nuevas versiones
4. **Health Check**: Verifica que todo funciona

## 🐛 Troubleshooting

### Error: "Permission denied"
```bash
# En el droplet, agregar usuario al grupo docker
sudo usermod -aG docker $USER
sudo systemctl restart docker
```

### Error: "Connection refused"
```bash
# Verificar firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Error: "Service unhealthy"
```bash
# Ver logs específicos
docker-compose -f docker-compose.prod.yml logs customers-api
docker-compose -f docker-compose.prod.yml logs products-api
```

### Error: "Database connection failed"
```bash
# Verificar variables de entorno
cat .env.prod
docker-compose -f docker-compose.prod.yml config
```

## 🔐 Seguridad

- ✅ Variables de entorno nunca en Git
- ✅ Contraseñas seguras para bases de datos
- ✅ JWT secrets únicos y fuertes
- ✅ Firewall configurado
- ✅ Acceso SSH solo con llaves
- ⚠️ SSL/HTTPS opcional (configurar certificados)

## 📚 Recursos Útiles

- [Docker Hub](https://hub.docker.com/)
- [DigitalOcean Docs](https://docs.digitalocean.com/)
- [GitHub Actions](https://docs.github.com/actions)
- [Nginx Documentation](https://nginx.org/docs/)
