// Simple in-memory database for demo purposes
// In production, use a real database like PostgreSQL, MongoDB, etc.

interface Well {
  wellName: string
  propertyDescription: string
  decimalInterest?: number | string
}

interface DivisionOrder {
  id: string
  fileName: string
  uploadDate: string
  operator: string
  entity: string
  effectiveDate: string
  county: string
  wells: Well[]
  preparedDate: string
  confidence: number
}

class Database {
  private orders: DivisionOrder[] = []

  async getDivisionOrders(): Promise<DivisionOrder[]> {
    return this.orders
  }

  async getDivisionOrder(id: string): Promise<DivisionOrder | null> {
    return this.orders.find((order) => order.id === id) || null
  }

  async createDivisionOrder(data: Omit<DivisionOrder, "id">): Promise<DivisionOrder> {
    const order: DivisionOrder = {
      ...data,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    this.orders.push(order)
    return order
  }

  async updateDivisionOrder(id: string, data: Partial<DivisionOrder>): Promise<DivisionOrder | null> {
    const index = this.orders.findIndex((order) => order.id === id)
    if (index === -1) return null

    this.orders[index] = { ...this.orders[index], ...data }
    return this.orders[index]
  }

  async deleteDivisionOrder(id: string): Promise<boolean> {
    const index = this.orders.findIndex((order) => order.id === id)
    if (index === -1) return false

    this.orders.splice(index, 1)
    return true
  }
}

export const db = new Database()
