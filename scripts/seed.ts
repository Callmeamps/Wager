import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureUser(email: string, name: string) {
  const pw = await bcrypt.hash('password123', 12);
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })!;
  }
  return prisma.user.create({
    data: { email, name, passwordHash: pw },
    select: { id: true, email: true, name: true },
  });
}

async function main() {
  console.log('Seeding demo data...');

  const [alice, bob, charlie] = await Promise.all([
    ensureUser('alice@example.com', 'Alice'),
    ensureUser('bob@example.com', 'Bob'),
    ensureUser('charlie@example.com', 'Charlie'),
  ]);
  console.log(`  Created 3 users`);
  console.log('  Login: alice@example.com / password123');

  // Create wagers
  const wagers = await Promise.all([
    prisma.wager.create({
      data: {
        title: 'Run 5km under 25 minutes',
        description: 'Loser buys dinner at the steakhouse',
        stakeAmount: 50,
        stakeCurrency: 'USD',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdBy: alice.id,
        participants: {
          create: [{ userId: alice.id }, { userId: bob.id }],
        },
      },
    }),
    prisma.wager.create({
      data: {
        title: 'Best homemade pizza photo',
        description: 'Submit a photo of your best homemade pizza. Most votes wins bragging rights.',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: bob.id,
        participants: {
          create: [{ userId: bob.id }, { userId: charlie.id }],
        },
      },
    }),
  ]);
  console.log(`  Created ${wagers.length} wagers`);

  // Add proof to first wager
  await prisma.proof.create({
    data: {
      wagerId: wagers[0].id,
      userId: alice.id,
      link: 'https://strava.com/activities/example',
      evidence: 'Screenshot attached',
    },
  });
  await prisma.wager.update({ where: { id: wagers[0].id }, data: { status: 'SUBMITTED' } });
  console.log('  Added 1 proof');

  // Add votes
  await Promise.all([
    prisma.vote.create({ data: { wagerId: wagers[0].id, voterId: alice.id, isValid: true, comment: 'Legit run!' } }),
    prisma.vote.create({ data: { wagerId: wagers[0].id, voterId: bob.id, isValid: false, comment: 'Need GPS data' } }),
  ]);
  console.log('  Added 2 votes');

  console.log('');
  console.log('Seed complete!');
  console.log('Login: alice@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
