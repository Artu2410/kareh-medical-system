require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Obras sociales iniciales
  const os1 = await prisma.socialWork.upsert({
    where: { name: 'Particular' },
    update: {},
    create: { name: 'Particular' }
  });

  const os2 = await prisma.socialWork.upsert({
    where: { name: 'OSDE' },
    update: {},
    create: { name: 'OSDE' }
  });

  // Profesionales de ejemplo
  const prof1 = await prisma.professional.upsert({
    where: { license: 'MP-10318' },
    update: {},
    create: {
      firstName: 'Katia',
      lastName: 'Romero',
      license: 'MP-10318'
    }
  });

  const prof2 = await prisma.professional.upsert({
    where: { license: 'MN-18900' },
    update: {},
    create: {
      firstName: 'Juan',
      lastName: 'Perez',
      license: 'MN-18900'
    }
  });

  console.log('Seed completed:', { os1: os1.name, os2: os2.name, prof1: prof1.id, prof2: prof2.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
