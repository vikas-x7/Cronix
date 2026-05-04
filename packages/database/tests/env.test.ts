import { envSchema } from '../src/schema';

const validEnv = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/db?sslmode=require',
  DATABASE_POOL_MIN: '0',
  DATABASE_POOL_MAX: '10',
  DATABASE_IDLE_TIMEOUT_MS: '30000',
  DATABASE_CONNECTION_TIMEOUT_MS: '10000',
  DATABASE_STATEMENT_TIMEOUT_MS: '30000',
  DATABASE_QUERY_TIMEOUT_MS: '30000',
  DATABASE_TRANSACTION_MAX_WAIT_MS: '5000',
  DATABASE_TRANSACTION_TIMEOUT_MS: '10000',
  DATABASE_LOG_QUERIES: 'false',
};

describe('env validation', () => {
  it('passes with valid env values', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    }
  });

  it('fails when DATABASE_URL is missing', () => {
    const { DATABASE_URL: _, ...rest } = validEnv;
    const result = envSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('fails when DATABASE_URL is empty', () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: '' });
    expect(result.success).toBe(false);
  });

  it('fails when DATABASE_URL is not a url', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      DATABASE_URL: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('fails when DATABASE_URL does not use postgres protocol', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      DATABASE_URL: 'mysql://user:password@localhost:5432/db',
    });
    expect(result.success).toBe(false);
  });

  it('fails when DATABASE_POOL_MIN is negative', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      DATABASE_POOL_MIN: '-1',
    });
    expect(result.success).toBe(false);
  });

  it('fails when DATABASE_POOL_MAX is not a positive integer', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      DATABASE_POOL_MAX: '-5',
    });
    expect(result.success).toBe(false);
  });

  it('fails when DATABASE_LOG_QUERIES is not true or false', () => {
    const result = envSchema.safeParse({
      ...validEnv,
      DATABASE_LOG_QUERIES: 'maybe',
    });
    expect(result.success).toBe(false);
  });

  it('applies defaults for optional fields', () => {
    const minimal = { DATABASE_URL: validEnv.DATABASE_URL };
    const result = envSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.DATABASE_POOL_MIN).toBe(0);
      expect(result.data.DATABASE_POOL_MAX).toBe(10);
      expect(result.data.DATABASE_LOG_QUERIES).toBe(false);
    }
  });

  it('transforms DATABASE_LOG_QUERIES to boolean', () => {
    const r1 = envSchema.safeParse({
      ...validEnv,
      DATABASE_LOG_QUERIES: 'true',
    });
    expect(r1.success).toBe(true);
    if (r1.success) expect(r1.data.DATABASE_LOG_QUERIES).toBe(true);

    const r2 = envSchema.safeParse({
      ...validEnv,
      DATABASE_LOG_QUERIES: 'false',
    });
    expect(r2.success).toBe(true);
    if (r2.success) expect(r2.data.DATABASE_LOG_QUERIES).toBe(false);
  });
});
