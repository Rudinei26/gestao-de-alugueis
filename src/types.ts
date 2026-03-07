export interface Payment {
  id: number;
  apartment: string;
  tenant_name: string;
  payment_date: string;
  payment_type: 'Dinheiro' | 'Pix';
  amount: number;
  notes?: string;
  created_at: string;
}

export interface Stats {
  total_revenue: number;
  total_payments: number;
  by_method: {
    payment_type: string;
    count: number;
    total: number;
  }[];
}
