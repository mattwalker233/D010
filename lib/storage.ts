import fs from 'fs/promises';
import path from 'path';
import { DivisionOrderData } from '../types/division-order';

const DATA_DIR = path.join(process.cwd(), 'data');
const DIVISION_ORDERS_FILE = path.join(DATA_DIR, 'division-orders.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize storage
export async function initStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DIVISION_ORDERS_FILE);
    } catch {
      await fs.writeFile(DIVISION_ORDERS_FILE, JSON.stringify([], null, 2));
    }
    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

// Get all division orders
export async function getAllDivisionOrders(): Promise<DivisionOrderData[]> {
  try {
    const data = await fs.readFile(DIVISION_ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading division orders:', error);
    return [];
  }
}

// Create a new division order
export async function createDivisionOrder(data: Partial<DivisionOrderData>): Promise<DivisionOrderData> {
  try {
    const orders = await getAllDivisionOrders();
    
    const newOrder: DivisionOrderData = {
      id: crypto.randomUUID(),
      operator: data.operator || 'Unknown Operator',
      entity: data.entity || 'Unknown Entity',
      county: data.county || 'Unknown County',
      state: data.state || 'TX',
      effective_date: data.effective_date || new Date().toISOString().split('T')[0],
      status: data.status || 'in_process',
      notes: data.notes || ''
    };

    if (!Array.isArray(orders)) {
      throw new Error('Invalid orders data structure');
    }

    orders.push(newOrder);
    await fs.writeFile(DIVISION_ORDERS_FILE, JSON.stringify(orders, null, 2));
    return newOrder;
  } catch (error) {
    console.error('Error creating division order:', error);
    throw error;
  }
}

// Update a division order
export async function updateDivisionOrder(id: string, updates: Partial<DivisionOrderData>): Promise<DivisionOrderData | null> {
  try {
    const orders = await getAllDivisionOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      return null;
    }

    orders[index] = { ...orders[index], ...updates };
    await fs.writeFile(DIVISION_ORDERS_FILE, JSON.stringify(orders, null, 2));
    return orders[index];
  } catch (error) {
    console.error('Error updating division order:', error);
    throw error;
  }
}

// Delete a division order
export async function deleteDivisionOrder(id: string): Promise<boolean> {
  try {
    const orders = await getAllDivisionOrders();
    const filteredOrders = orders.filter(order => order.id !== id);
    
    if (filteredOrders.length === orders.length) {
      return false;
    }

    await fs.writeFile(DIVISION_ORDERS_FILE, JSON.stringify(filteredOrders, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting division order:', error);
    throw error;
  }
} 