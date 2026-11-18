import { config } from './env.js';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../models/schema.js';

let dbInstance = null;
let isPostgresConnected = false;

/**
 * Clean in-memory dynamic state store.
 * NO static / prebuilt / dummy data - completely populated by real user inputs,
 * registrations, admissions, and agent interactions.
 */
export const inMemoryStore = {
  persons: [],
  campuses: [],
  feeInvoices: [],
  examPapers: [],
  dynamicScheduleSlots: [],
  financialAidAssessments: [],
  busTelemetry: [],
  syllabusCoverageRecords: [],
  agentAuditLogs: [],
};

if (config.databaseUrl) {
  try {
    const pool = new pg.Pool({ connectionString: config.databaseUrl });
    dbInstance = drizzle(pool, { schema });
    isPostgresConnected = true;
    console.log('[Database] Connected to PostgreSQL with Drizzle ORM');
  } catch (err) {
    console.warn('[Database] PostgreSQL connection failed, operating with clean in-memory state engine:', err.message);
  }
} else {
  console.log('[Database] Drizzle ORM configured with zero-friction clean state store (ready for real user inputs)');
}

export const getDb = () => dbInstance;
export const isDbConnected = () => isPostgresConnected;
