import { Stats } from '../types';
import { DollarSign, Users, TrendingUp, Wallet } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null;

  const pixTotal = stats.by_method.find(m => m.payment_type === 'Pix')?.total || 0;
  const cashTotal = stats.by_method.find(m => m.payment_type === 'Dinheiro')?.total || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Total</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Receita Total</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">
          R$ {stats.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
        </div>
        <p className="text-sm text-gray-500 font-medium">Pagamentos Registrados</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">
          {stats.total_payments}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Pix</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Total em Pix</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">
          R$ {pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Wallet size={24} />
          </div>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Dinheiro</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">Total em Dinheiro</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">
          R$ {cashTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>
    </div>
  );
}
