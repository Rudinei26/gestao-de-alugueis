import { Payment } from '../types';
import { Trash2, Search, Calendar, User, Home, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface PaymentListProps {
  payments: Payment[];
  onDelete: (id: number) => void;
}

export function PaymentList({ payments, onDelete }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apartment.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Histórico de Pagamentos</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou apt..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-medium">
              <th className="px-6 py-4">Apartamento</th>
              <th className="px-6 py-4">Inquilino</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nenhum pagamento encontrado.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                        <Home size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{payment.apartment}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-700">{payment.tenant_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">
                    R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(payment.payment_date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      payment.payment_type === 'Pix' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <CreditCard size={12} />
                      {payment.payment_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(payment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
