import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip } from 'recharts';

export const Charts = () => {
  const { transactions } = useFinance();

  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const grouped = transactions.reduce((acc, t) => {
      // For more robustness we normally sort by parsing date, here we just grouped by MMM YYYY
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0, _d: date.getTime() };
      acc[month][t.type] += t.amount;
      return acc;
    }, {});
    return Object.values(grouped).sort((a,b) => a._d - b._d);
  }, [transactions]);

  const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-bg-card p-6 rounded-2xl border border-border-subtle shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] transition-all hover:-translate-y-1 duration-300">
        <h3 className="text-lg font-semibold mb-6 text-text-main">Expense Breakdown</h3>
        <div className="h-[300px]">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-bg-card stroke-2" />
                  ))}
                </Pie>
                <PieTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-text-muted">No expense data available</div>
          )}
        </div>
      </div>

      <div className="bg-bg-card p-6 rounded-2xl border border-border-subtle shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] transition-all hover:-translate-y-1 duration-300">
        <h3 className="text-lg font-semibold mb-6 text-text-main">Monthly Trend</h3>
        <div className="h-[300px]">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <BarTooltip 
                  cursor={{ fill: 'var(--bg-base)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)' }}
                />
                <Bar dataKey="income" name="Income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted">No transaction data available</div>
          )}
        </div>
      </div>
    </div>
  );
};
