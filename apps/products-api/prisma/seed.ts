import { PrismaClient } from '../generated/products-client';

const prisma = new PrismaClient();

async function main() {
  // Crear categorías por defecto
  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Books' },
    { name: 'Home & Garden' },
    { name: 'Sports' },
    { name: 'General' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
