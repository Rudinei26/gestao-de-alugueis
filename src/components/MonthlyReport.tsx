import React, { useState, useMemo } from 'react';
import { Printer, FileText, Calendar, X, Share2, Copy, Check } from 'lucide-react';
import { Payment } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MonthlyReportProps {
  payments: Payment[];
}

export function MonthlyReport({ payments }: MonthlyReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [copied, setCopied] = useState(false);

  const reportData = useMemo(() => {
    const filtered = payments.filter(p => p.payment_date.startsWith(selectedMonth));
    const total = filtered.reduce((sum, p) => sum + p.amount, 0);
    const byType = filtered.reduce((acc, p) => {
      acc[p.payment_type] = (acc[p.payment_type] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      payments: filtered,
      total,
      byType
    };
  }, [payments, selectedMonth]);

  const monthLabel = new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const generateShareText = () => {
    let text = `*RELATÓRIO DE PAGAMENTOS - ${monthLabel.toUpperCase()}*\n`;
    text += `*Residencial Hemann*\n\n`;
    text += `💰 *Total Recebido:* R$ ${reportData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    text += `💠 Pix: R$ ${(reportData.byType['Pix'] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    text += `💵 Dinheiro: R$ ${(reportData.byType['Dinheiro'] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;
    text += `*DETALHAMENTO:*\n`;
    
    if (reportData.payments.length === 0) {
      text += `_Nenhum pagamento registrado._`;
    } else {
      reportData.payments.forEach(p => {
        text += `• Apt ${p.apartment}: R$ ${p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${p.payment_type})\n`;
      });
    }
    
    text += `\n_Gerado em: ${new Date().toLocaleString('pt-BR')}_`;
    return text;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Relatório ${monthLabel} - Residencial Hemann`,
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      handleCopy();
    }
  };

  const handleCopy = () => {
    const shareText = generateShareText();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
      >
        <FileText size={20} className="text-blue-600" />
        <span className="hidden xs:inline">Relatório Mensal</span>
        <span className="xs:hidden">Relatório</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:p-0 print:bg-white print:static print:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-w-none print:max-h-none print:rounded-none"
            >
              {/* Header - Hidden on Print */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-100 print:hidden gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={24} />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Gerar Relatório</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mr-auto sm:mr-2">
                    <Calendar size={18} className="text-gray-400" />
                    <input
                      type="month"
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32 sm:w-auto"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none"
                      title="Compartilhar"
                    >
                      <Share2 size={18} />
                      <span className="hidden sm:inline">Compartilhar</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 p-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none"
                      title="Copiar texto"
                    >
                      {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                      <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none"
                    >
                      <Printer size={18} />
                      <span className="hidden sm:inline">Imprimir</span>
                    </button>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible" id="printable-report">
                <div className="max-w-3xl mx-auto">
                  {/* Report Header */}
                  <div className="text-center mb-8 border-b-2 border-gray-900 pb-6">
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Relatório de Pagamentos</h1>
                    <p className="text-lg text-gray-600 mt-1 capitalize">{monthLabel}</p>
                    <p className="text-sm text-gray-400 mt-4">Residencial Hemann</p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="border border-gray-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Recebido</p>
                      <p className="text-xl font-bold text-gray-900">R$ {reportData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Pix</p>
                      <p className="text-xl font-bold text-emerald-600">R$ {(reportData.byType['Pix'] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Dinheiro</p>
                      <p className="text-xl font-bold text-amber-600">R$ {(reportData.byType['Dinheiro'] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-left border-collapse mb-8 min-w-[500px] sm:min-w-0">
                      <thead>
                        <tr className="border-b-2 border-gray-900">
                          <th className="py-3 font-bold text-sm uppercase">Apto</th>
                          <th className="py-3 font-bold text-sm uppercase">Inquilino</th>
                          <th className="py-3 font-bold text-sm uppercase">Data</th>
                          <th className="py-3 font-bold text-sm uppercase">Tipo</th>
                          <th className="py-3 font-bold text-sm uppercase text-right">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.payments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500 italic">
                              Nenhum registro encontrado para este período.
                            </td>
                          </tr>
                        ) : (
                          reportData.payments.map((p) => (
                            <tr key={p.id} className="text-sm">
                              <td className="py-3 font-medium">{p.apartment}</td>
                              <td className="py-3">{p.tenant_name}</td>
                              <td className="py-3">{new Date(p.payment_date).toLocaleDateString('pt-BR')}</td>
                              <td className="py-3">{p.payment_type}</td>
                              <td className="py-3 text-right font-mono">R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-900">
                          <td colSpan={4} className="py-4 font-bold text-right uppercase">Total Geral:</td>
                          <td className="py-4 text-right font-bold font-mono">R$ {reportData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                    <p>Relatório gerado em {new Date().toLocaleString('pt-BR')}</p>
                    <p className="mt-1">Sistema de Gestão Residencial Hemann</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
