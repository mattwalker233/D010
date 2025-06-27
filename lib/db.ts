import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { OrderStatus } from './types';

export let db: any = null;

export async function initDb() {
  try {
    db = await open({
      filename: './data.db',
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Drop existing tables
    await db.exec(`
      DROP TABLE IF EXISTS wells;
      DROP TABLE IF EXISTS division_orders;
    `);

    // Create tables
    await db.exec(`
      CREATE TABLE division_orders (
        id TEXT PRIMARY KEY,
        status TEXT CHECK(status IN ('in_process', 'in_pay', 'not_received', 'title_issue', 'contact_operator')) NOT NULL DEFAULT 'in_process',
        operator TEXT NOT NULL,
        entity TEXT NOT NULL,
        county TEXT NOT NULL,
        state TEXT NOT NULL,
        effective_date TEXT NOT NULL,
        notes TEXT
      );

      CREATE TABLE wells (
        id TEXT PRIMARY KEY,
        division_order_id TEXT NOT NULL,
        well_name TEXT NOT NULL,
        property_description TEXT NOT NULL,
        decimal_interest REAL NOT NULL CHECK(decimal_interest >= 0 AND decimal_interest <= 1),
        FOREIGN KEY (division_order_id) REFERENCES division_orders (id) ON DELETE CASCADE
      );

      CREATE INDEX idx_wells_division_order_id ON wells(division_order_id);
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    db = await initDb();
  }
  return db;
} 