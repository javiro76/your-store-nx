#!/bin/bash

# Production Deployment Script for Your Store NX
echo "🚀 Starting production deployment..."

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ .env.prod file not found!"
    echo "📋 Please copy .env.prod.example to .env.prod and fill in your values"
    exit 1
fi

# Load environment variables
set -a
source .env.prod
set +a

echo "✅ Environment variables loaded"

# Create backup directories
mkdir -p ./db-backups/customers
mkdir -p ./db-backups/products

echo "✅ Backup directories created"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Remove old images (optional - uncomment if you want to force rebuild)
# echo "🗑️ Removing old images..."
# docker compose -f docker-compose.prod.yml down --rmi all

# Pull/build latest images
echo "🔨 Building/pulling latest images..."
docker compose -f docker-compose.prod.yml build --no-cache

# Start databases first
echo "🗄️ Starting databases..."
docker compose -f docker-compose.prod.yml up -d customers-db products-db

# Wait for databases to be healthy
echo "⏳ Waiting for databases to be ready..."
docker compose -f docker-compose.prod.yml exec customers-db pg_isready -U $CUSTOMERS_DB_USER -d $CUSTOMERS_DB_NAME
docker compose -f docker-compose.prod.yml exec products-db pg_isready -U $PRODUCTS_DB_USER -d $PRODUCTS_DB_NAME

# Run database setup (migrations and seeds)
echo "🗃️ Running database setup..."
docker compose -f docker-compose.prod.yml up db-setup

# Start all services
echo "🚀 Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Show status
echo "📊 Deployment status:"
docker compose -f docker-compose.prod.yml ps

echo "✅ Production deployment completed!"
echo "🌐 Your application should be available at:"
echo "   - HTTP: http://localhost"
echo "   - HTTPS: https://localhost (if SSL configured)"
echo ""
echo "📋 To check logs:"
echo "   docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker compose -f docker-compose.prod.yml down"
