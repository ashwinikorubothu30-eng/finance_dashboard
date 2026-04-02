import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { DashboardLayout } from './components/DashboardLayout';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { Insights } from './components/Insights';
import { TransactionsSection } from './components/TransactionsSection';

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <DashboardLayout>
          
          <div className="space-y-8 max-w-7xl mx-auto w-full">
            <header className="px-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient-primary mb-2 select-none tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-text-muted text-lg">Welcome back! Here's your financial summary.</p>
            </header>

            <SummaryCards />
            
            <div className="grid lg:grid-cols-3 gap-8 pb-12">
              <div className="lg:col-span-2 space-y-8 flex flex-col w-[calc(100vw-2rem)] sm:w-full overflow-hidden">
                <Charts />
                <TransactionsSection />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Insights />
                </div>
              </div>
            </div>
          </div>

        </DashboardLayout>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
