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