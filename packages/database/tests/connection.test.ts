import { prisma, disconnectDatabase } from '../src/prisma.js';

afterAll(async () => {
  await disconnectDatabase();
});

describe('database connection', () => {
  it('connects and runs a query', async () => {
    const result =
      await prisma.$queryRawUnsafe<Record<string, number>[]>('SELECT 1 as val');
    expect(result[0].val).toBe(1);
  });
});
