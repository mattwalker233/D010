import fs from 'fs';
import path from 'path';

interface Entity {
  id: number;
  entity_name: string | null;
  printed_name: string | null;
  tax_id: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  signature: string | null;
  witness_name: string | null;
  witness_signature: string | null;
  created_at: string;
  updated_at: string;
}

// Define the data directory and file path
const dataDir = path.join(process.cwd(), 'data');
const entitiesFile = path.join(dataDir, 'entities.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize entities file if it doesn't exist
if (!fs.existsSync(entitiesFile)) {
  fs.writeFileSync(entitiesFile, JSON.stringify([], null, 2));
}

// Database functions
export const db = {
  getEntities: () => {
    try {
      const data = fs.readFileSync(entitiesFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading entities:', error);
      return [];
    }
  },

  addEntity: (entity: any) => {
    try {
      const entities = db.getEntities();
      const newEntity = {
        id: entities.length > 0 ? Math.max(...entities.map((e: any) => e.id)) + 1 : 1,
        ...entity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      entities.push(newEntity);
      fs.writeFileSync(entitiesFile, JSON.stringify(entities, null, 2));
      return newEntity;
    } catch (error) {
      console.error('Error adding entity:', error);
      throw error;
    }
  },

  deleteEntity: (id: number) => {
    try {
      const entities = db.getEntities();
      const filteredEntities = entities.filter((e: any) => e.id !== id);
      fs.writeFileSync(entitiesFile, JSON.stringify(filteredEntities, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
  }
}; 