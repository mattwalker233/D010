export interface Entity {
  id: number;
  entity_name: string | null;
  printed_name: string | null;
  tax_id: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  signature: string | null;
  witness_name: string | null;
  witness_signature: string | null;
  created_at: string;
  updated_at: string;
} 