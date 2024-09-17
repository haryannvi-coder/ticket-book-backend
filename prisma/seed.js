const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const seats = Array.from({ length: 80 }, (_, index) => ({
    seatNumber: index + 1,
    status: 'available',
  }));

  await prisma.seat.createMany({
    data: seats,
  });

  console.log('Database seeded with 80 seats');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
