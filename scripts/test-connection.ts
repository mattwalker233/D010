import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }

    console.log('Attempting to connect with:', connectionString);

    // Create a new client
    const client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    // Create a new db instance
    const db = drizzle(client);

    // Try to execute a simple query
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('Database connection successful!');
    console.log('Test query result:', result);

    // Close the connection
    await client.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection(); 