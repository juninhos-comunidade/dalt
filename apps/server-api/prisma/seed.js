const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const roles = ['MASTER', 'MENTOR', 'APRENDIZ'];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
    console.log(`ensured role: ${name}`);
  }

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
