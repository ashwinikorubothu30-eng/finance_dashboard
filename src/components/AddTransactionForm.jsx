import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export const AddTransactionForm = ({ onClose }) => {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    addTransaction({
      id: Date.now().toString(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end animate-[fade-in_0.3s_ease-out]">
      <div className="flex-1 w-full">
        <label className="block text-xs font-medium text-text-muted mb-1">Date</label>
        <input 
          type="date" 
          required
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-card text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-medium text-text-muted mb-1">Amount</label>
        <input 
          type="number" 
          min="0.01" step="0.01"
          required placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-card text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-medium text-text-muted mb-1">Category</label>
        <input 
          type="text" 
          required placeholder="e.g. Salary, Utilities"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-card text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
        <select 
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-card text-sm focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border-subtle text-sm font-medium hover:bg-bg-card transition-colors flex-1">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg text-sm font-medium transition-colors flex-1">
          Save
        </button>
      </div>
    </form>
  );
};
