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
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Total</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Receita Total</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
          R$ {stats.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Users size={20} className="sm:w-6 sm:h-6" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Pagamentos</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
          {stats.total_payments}
        </h3>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-purple-50 text-purple-600 rounded-lg">
            <TrendingUp size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Pix</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Pix</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
          R$ {pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Wallet size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Dinheiro</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Dinheiro</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
          R$ {cashTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>
    </div>
  );
}
