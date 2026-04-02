import React from 'react';
import { Navbar } from './Navbar';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-base text-text-main transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="animate-[fade-in_0.5s_ease-out]">
            {children}
        </div>
      </main>
    </div>
  );
};
