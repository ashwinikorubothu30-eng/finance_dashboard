import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowDownRight, ArrowUpRight, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const SummaryCards = () => {
  const { transactions } = useFinance();

  const { income, expense, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  const Card = ({ title, amount, icon, type }) => (
    <div className="bg-bg-card p-6 rounded-2xl border border-border-subtle shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-all group-hover:scale-110 duration-500">
        {React.cloneElement(icon, { size: 120 })}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${
          type === 'income' ? 'bg-[var(--color-income)]/10 text-[var(--color-income)]' :
          type === 'expense' ? 'bg-[var(--color-expense)]/10 text-[var(--color-expense)]' :
          'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
        }`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <p className="text-sm font-medium text-text-muted">{title}</p>
      </div>
      <h3 className="text-3xl font-bold flex items-baseline gap-1">
        {formatCurrency(amount)}
      </h3>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Total Balance" amount={balance} icon={<IndianRupee />} type="balance" />
      <Card title="Total Income" amount={income} icon={<ArrowUpRight />} type="income" />
      <Card title="Total Expenses" amount={expense} icon={<ArrowDownRight />} type="expense" />
    </div>
  );
};
