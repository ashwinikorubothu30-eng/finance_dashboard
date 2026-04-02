import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, ChevronDown, ChevronUp, Trash2, Plus, Download } from 'lucide-react';
import { AddTransactionForm } from './AddTransactionForm';
import { formatCurrency } from '../utils/formatCurrency';

export const TransactionsSection = () => {
  const { transactions, role, deleteTransaction } = useFinance();
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    let result = transactions.filter(t => 
      t.category.toLowerCase().includes(search.toLowerCase()) || 
      t.date.includes(search)
    );

    result.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [transactions, search, sortConfig]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Category', 'Amount', 'Type'].join(','),
      ...filteredAndSorted.map(t => `${t.date},"${t.category}",${t.amount},${t.type}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ChevronDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="bg-bg-card rounded-2xl border border-border-subtle shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] overflow-hidden transition-shadow duration-300">
      <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search category or date..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-border-subtle bg-bg-base text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] w-full sm:w-64 transition-all"
            />
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 border border-border-subtle hover:bg-bg-base rounded-lg text-sm font-medium transition-colors"
            title="Export to CSV"
          >
            <Download size={16} />
          </button>
          {role === 'Admin' && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          )}
        </div>
      </div>

      {showAddForm && role === 'Admin' && (
        <div className="p-6 border-b border-border-subtle bg-bg-base/50">
          <AddTransactionForm onClose={() => setShowAddForm(false)} />
        </div>
      )}

      <div className="overflow-x-auto">
        {filteredAndSorted.length > 0 ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-bg-base/50 text-text-muted border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-text-main transition-colors" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">Date <SortIcon column="date" /></div>
                </th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:text-text-main transition-colors" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">Amount <SortIcon column="amount" /></div>
                </th>
                <th className="px-6 py-4 font-medium">Type</th>
                {role === 'Admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredAndSorted.map(t => (
                <tr key={t.id} className="hover:bg-[var(--color-background)] even:bg-[var(--color-background)]/50 transition-colors group">
                  <td className="px-6 py-4">{t.date}</td>
                  <td className="px-6 py-4 font-medium">{t.category}</td>
                  <td className="px-6 py-4 font-bold">
                     {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      t.type === 'income' 
                        ? 'bg-[var(--color-income)]/10 text-[var(--color-income)] border-[var(--color-income)]/20' 
                        : 'bg-[var(--color-expense)]/10 text-[var(--color-expense)] border-[var(--color-expense)]/20'
                    }`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  {role === 'Admin' && (
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center text-text-muted">
             <div className="w-16 h-16 bg-bg-base rounded-full flex items-center justify-center mb-4">
                 <Search className="opacity-40" size={24} />
             </div>
             <p className="text-lg font-medium text-text-main">{search ? 'No transactions match your search.' : 'No transactions found.'}</p>
             <p className="text-sm mt-1 mb-2">{search ? 'Try adjusting your filters.' : 'Add a new transaction to get started.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
