/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Payment, Stats } from './types';
import { PaymentForm } from './components/PaymentForm';
import { PaymentList } from './components/PaymentList';
import { StatsCards } from './components/StatsCards';
import { MonthlyReport } from './components/MonthlyReport';
import { Building2 } from 'lucide-react';

export default function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/stats')
      ]);
      
      if (paymentsRes.ok && statsRes.ok) {
        const paymentsData = await paymentsRes.json();
        const statsData = await statsRes.json();
        setPayments(paymentsData);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pagamento?')) return;

    try {
      const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Gestão de Aluguéis
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <MonthlyReport payments={payments} />
            <PaymentForm onSuccess={fetchData} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64 print:hidden">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="print:hidden">
              <StatsCards stats={stats} />
              <PaymentList payments={payments} onDelete={handleDelete} />
            </div>
            {/* The MonthlyReport modal handles its own print view via CSS print classes */}
          </>
        )}
      </main>
    </div>
  );
}
