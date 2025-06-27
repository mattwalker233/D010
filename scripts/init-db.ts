import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

async function main() {
  // Create SQLite database instance
  const sqlite = new Database('data.db');
  const db = drizzle(sqlite);

  console.log('Running migrations...');
  
  // This will run migrations from the drizzle folder
  await migrate(db, { migrationsFolder: 'drizzle' });
  
  console.log('Migrations completed successfully');
  
  // Close the connection
  sqlite.close();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 