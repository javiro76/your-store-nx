# Configuración del Firewall UFW para Docker

## Abrir puertos necesarios para tu aplicación

```bash
# Permitir SSH (puerto 22) - CRÍTICO para mantener acceso
sudo ufw allow 22/tcp

# Permitir HTTP (puerto 80) - Para tráfico web normal
sudo ufw allow 80/tcp

# Permitir HTTPS (puerto 443) - Para tráfico web seguro
sudo ufw allow 443/tcp

# Activar el firewall
sudo ufw --force enable

# Verificar el estado
sudo ufw status
```

## Comandos alternativos más específicos

Si prefieres ser más explícito:

```bash
# Permitir HTTP desde cualquier IP
sudo ufw allow from any to any port 80 proto tcp

# Permitir HTTPS desde cualquier IP  
sudo ufw allow from any to any port 443 proto tcp

# Permitir SSH (más restrictivo - solo desde tu IP)
sudo ufw allow from TU_IP_PUBLICA to any port 22 proto tcp
```

## Verificar configuración

```bash
# Ver reglas activas
sudo ufw status numbered

# Ver reglas en formato detallado
sudo ufw status verbose
```

## Si necesitas resetear UFW

```bash
# Resetear todas las reglas (cuidado!)
sudo ufw --force reset

# Luego reconfigurar desde cero
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```
