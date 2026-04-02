import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const highestCategory = Object.entries(grouped).sort((a,b) => b[1] - a[1])[0];

    const currentMonth = new Date().getMonth();
    const currTotal = expenses.filter(t => new Date(t.date).getMonth() === currentMonth).reduce((sum, t) => sum + t.amount, 0);
    const prevTotal = expenses.filter(t => new Date(t.date).getMonth() === currentMonth - 1).reduce((sum, t) => sum + t.amount, 0);
    
    let monthDiff = 0;
    if (prevTotal === 0 && currTotal > 0) monthDiff = 100;
    else if (prevTotal > 0) monthDiff = ((currTotal - prevTotal) / prevTotal) * 100;

    return {
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null,
      monthDiff
    };
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="bg-gradient-primary rounded-2xl p-6 text-white shadow-[var(--shadow-soft)] overflow-hidden relative transition-all hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1 duration-300">
      <div className="absolute -right-4 -top-4 opacity-10">
        <Sparkles size={160} />
      </div>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Sparkles size={20} /> AI Insights
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {insights.highestCategory && (
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-1">
               <AlertTriangle size={14} className="text-amber-300" />
               Highest Spending Category
            </p>
            <p className="text-2xl font-bold">
              {insights.highestCategory.name}
              <span className="text-base font-normal opacity-80 ml-2">
                ({formatCurrency(insights.highestCategory.amount)})
              </span>
            </p>
          </div>
        )}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <p className="text-white/80 text-sm font-medium mb-1">Monthly Comparison (Expenses)</p>
          <div className="flex items-center gap-2 text-2xl font-bold">
            {insights.monthDiff > 0 ? (
                <>
                   <TrendingUp size={24} className="text-rose-300" />
                   {insights.monthDiff.toFixed(1)}% <span className="text-base font-normal opacity-80">more than last month</span>
                </>
            ) : (
                <>
                   <TrendingDown size={24} className="text-emerald-300" />
                   {Math.abs(insights.monthDiff).toFixed(1)}% <span className="text-base font-normal opacity-80">less than last month</span>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
