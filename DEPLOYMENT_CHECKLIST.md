# ✅ Checklist de Despliegue - Your Store NX

## 📋 Antes del primer despliegue

### 🔧 Configuración Local
- [ ] GitHub CLI instalado (`gh --version`)
- [ ] Cuenta de Docker Hub creada
- [ ] Access Token de Docker Hub generado
- [ ] Repositorio en GitHub creado

### 🔐 Docker Hub
- [ ] Access Token creado (no usar contraseña directa)
- [ ] Permisos: Read, Write, Delete

### 🖥️ Servidor (Droplet)
- [ ] Droplet creado en DigitalOcean
- [ ] SSH key configurada
- [ ] Docker instalado: `sudo apt install -y docker.io docker-compose`
- [ ] Firewall configurado: `sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp`
- [ ] Usuario agregado al grupo docker: `sudo usermod -aG docker $USER`

### 📝 Variables de Entorno
- [ ] Archivo `.env.prod` creado en el servidor
- [ ] Contraseñas seguras generadas
- [ ] JWT_SECRET único y fuerte
- [ ] Variables de base de datos configuradas

### 🔑 GitHub Secrets
En GitHub repo → Settings → Secrets and variables → Actions:

- [ ] `DOCKERHUB_USERNAME`: tu-usuario-dockerhub
- [ ] `DOCKERHUB_TOKEN`: dckr_pat_xxxxx
- [ ] `DROPLET_HOST`: IP del droplet
- [ ] `DROPLET_USERNAME`: root (o tu usuario SSH)
- [ ] `SSH_PRIVATE_KEY`: contenido completo de la llave privada

## 🚀 Lista de verificación del despliegue

### Pre-despliegue
- [ ] Código pusheado a rama `main`
- [ ] Tests pasando localmente
- [ ] Variables de entorno verificadas
- [ ] Dockerfile funciona localmente

### Durante el despliegue
- [ ] GitHub Actions ejecutándose sin errores
- [ ] Imágenes Docker construyéndose correctamente
- [ ] Push a Docker Hub exitoso
- [ ] Conexión SSH al servidor establecida
- [ ] Contenedores iniciándose correctamente

### Post-despliegue
- [ ] Health check responde: `curl http://YOUR_IP/health`
- [ ] APIs funcionando:
  - [ ] `curl http://YOUR_IP/api/customers`
  - [ ] `curl http://YOUR_IP/api/products`
- [ ] Logs sin errores: `docker-compose logs`
- [ ] Bases de datos con migraciones aplicadas

## 🐛 Troubleshooting

### Error común: "Permission denied"
```bash
sudo usermod -aG docker $USER
sudo systemctl restart docker
# Desloguearse y volver a conectar
```

### Error común: "Connection refused"
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Error común: "Service unhealthy"
```bash
cd ~/your-store-nx
docker-compose -f docker-compose.prod.yml logs [service-name]
```

### Error común: ".env.prod not found"
```bash
cd ~/your-store-nx
ls -la .env.prod
# Si no existe, crearlo con las variables necesarias
```

## 🎯 Comandos útiles

### En el servidor:
```bash
# Estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs -f customers-api

# Reiniciar un servicio
docker-compose -f docker-compose.prod.yml restart customers-api

# Ver uso de recursos
docker stats
```

### Desde tu máquina:
```bash
# Probar conectividad
curl http://YOUR_DROPLET_IP/health

# Ver información del gateway
curl http://YOUR_DROPLET_IP/

# Probar APIs
curl http://YOUR_DROPLET_IP/api/customers
curl http://YOUR_DROPLET_IP/api/products
```

## 📊 URLs del sistema desplegado

Una vez desplegado, estas serán tus URLs:

- **Gateway Info**: `http://YOUR_IP/`
- **Health Check**: `http://YOUR_IP/health`
- **Customers API**: `http://YOUR_IP/api/customers`
- **Products API**: `http://YOUR_IP/api/products`

## 🔄 Para despliegues futuros

Solo necesitas:
1. Hacer cambios en tu código
2. `git push origin main`
3. ¡GitHub Actions se encarga del resto! 🎉
