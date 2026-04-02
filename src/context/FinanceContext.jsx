import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialTransactions } from '../data/mockData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage('finance-transactions', initialTransactions);
  const [role, setRole] = useLocalStorage('finance-role', 'Admin'); // 'Admin' or 'Viewer'

  const addTransaction = (transaction) => {
    if (role !== 'Admin') return;
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (role !== 'Admin') return;
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      role,
      setRole,
      addTransaction,
      deleteTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
