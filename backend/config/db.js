import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
import * as schema from '../db/schema.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

export const db = drizzle(pool, { schema });

export const checkDbHealth = async () => {
  await pool.query('SELECT 1');
  return true;
};

export const closeDb = async () => {
  await pool.end();
};

export const connectDB = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('PostgreSQL connection established successfully');
  } finally {
    client.release();
  }
};

export default connectDB;
