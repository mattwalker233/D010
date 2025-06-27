const Database = require('better-sqlite3');

const db = new Database('data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_name TEXT,
    printed_name TEXT,
    tax_id TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    signature TEXT,
    witness_name TEXT,
    witness_signature TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('entities table created successfully!');
db.close(); 