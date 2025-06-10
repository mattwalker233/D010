export interface DivisionOrderData {
  id: string;
  status: 'in_process' | 'in_pay' | 'not_received' | 'title_issue' | 'contact_operator';
  operator: string;
  entity: string;
  county: string;
  state: string;
  effective_date: string;
  notes?: string;
} 