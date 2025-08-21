# Production Deployment Script for Your Store NX (PowerShell)
Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Check if .env.prod exists
if (-Not (Test-Path ".env.prod")) {
    Write-Host "❌ .env.prod file not found!" -ForegroundColor Red
    Write-Host "📋 Please copy .env.prod.example to .env.prod and fill in your values" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variables file found" -ForegroundColor Green

# Create backup directories
New-Item -ItemType Directory -Force -Path "./db-backups/customers" | Out-Null
New-Item -ItemType Directory -Force -Path "./db-backups/products" | Out-Null

Write-Host "✅ Backup directories created" -ForegroundColor Green

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml down

# Pull/build latest images
Write-Host "🔨 Building/pulling latest images..." -ForegroundColor Blue
docker compose -f docker-compose.prod.yml build --no-cache

# Start databases first
Write-Host "🗄️ Starting databases..." -ForegroundColor Blue
docker compose -f docker-compose.prod.yml up -d customers-db products-db

# Wait for databases to be ready
Write-Host "⏳ Waiting for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Run database setup (migrations and seeds)
Write-Host "🗃️ Running database setup..." -ForegroundColor Blue
docker compose -f docker-compose.prod.yml up db-setup

# Start all services
Write-Host "🚀 Starting all services..." -ForegroundColor Green
docker compose -f docker-compose.prod.yml up -d

# Show status
Write-Host "📊 Deployment status:" -ForegroundColor Cyan
docker compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host "✅ Production deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your application should be available at:" -ForegroundColor Cyan
Write-Host "   - HTTP: http://localhost" -ForegroundColor White
Write-Host "   - HTTPS: https://localhost (if SSL configured)" -ForegroundColor White
Write-Host ""
Write-Host "📋 To check logs:" -ForegroundColor Yellow
Write-Host "   docker compose -f docker-compose.prod.yml logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop:" -ForegroundColor Red
Write-Host "   docker compose -f docker-compose.prod.yml down" -ForegroundColor White
