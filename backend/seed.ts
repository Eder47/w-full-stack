import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Smartphone Galaxy S23',
    description: 'Smartphone de última generación con cámara de 50MP, pantalla AMOLED de 6.1 pulgadas y batería de larga duración.',
    price: 2999000,
    stock: 10,
  },
  {
    name: 'Laptop MacBook Air M2',
    description: 'Laptop ultradelgada con chip M2, 8GB RAM, 256GB SSD, pantalla Retina de 13.6 pulgadas.',
    price: 4999000,
    stock: 5,
  },
  {
    name: 'Audífonos Sony WH-1000XM5',
    description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria, batería de 30 horas.',
    price: 1299000,
    stock: 15,
  },
  {
    name: 'Smart TV LG OLED 55"',
    description: 'Televisor OLED 4K con inteligencia artificial, procesador a9 Gen5, compatible con Alexa y Google Assistant.',
    price: 3999000,
    stock: 3,
  },
  {
    name: 'Tablet iPad Air',
    description: 'Tablet con chip M1, pantalla Liquid Retina de 10.9 pulgadas, compatible con Apple Pencil.',
    price: 2799000,
    stock: 8,
  },
];

async function main() {
  console.log('Starting seed...');

  await prisma.order.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();

  console.log('🗑️ Cleaned existing data');

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);
  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });