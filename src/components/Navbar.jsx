import React from 'react';
import { Moon, Sun, Shield, Wallet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';

export const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { role, setRole } = useFinance();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-bg-card/80 border-b border-border-subtle shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg text-white shadow-md shadow-[var(--color-accent)]/20 transition-transform hover:scale-105 duration-300">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-extrabold text-gradient-primary tracking-tight">
              FinDash
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-bg-base rounded-full p-1 border border-border-subtle transition-colors">
              <button
                onClick={() => setRole('Viewer')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                  role === 'Viewer' ? 'bg-bg-card text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Viewer
              </button>
              <button
                onClick={() => setRole('Admin')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1 ${
                  role === 'Admin' ? 'bg-bg-card text-text-main shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-bg-card/50'
                }`}
              >
                <Shield size={14} /> Admin
              </button>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-text-muted hover:bg-bg-base hover:text-text-main transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
