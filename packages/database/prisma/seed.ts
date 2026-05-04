import { prisma } from '../src/prisma';

const main = async () => {
  const user = await prisma.user.upsert({
    where: {
      email: 'demo@cronix.local',
    },
    update: {},
    create: {
      email: 'demo@cronix.local',
      name: 'Cronix Demo',
      spaces: {
        create: {
          name: 'Demo Space',
          jobs: {
            create: {
              name: 'Health Check',
              type: 'CRON',
              endpoint: 'https://example.com/health',
              method: 'GET',
              schedule: '*/5 * * * *',
              retryCount: 3,
              retryDelay: 30,
              timeout: 30,
            },
          },
        },
      },
    },
    include: {
      spaces: {
        include: {
          jobs: true,
        },
      },
    },
  });

  console.info(`Seeded demo user ${user.email}`);
};

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
