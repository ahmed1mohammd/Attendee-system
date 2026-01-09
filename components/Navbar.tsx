
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toggleSidebar: () => void;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, toggleSidebar, user }) => {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 text-black dark:text-zinc-500 hover:text-main dark:hover:text-brand transition-all flex items-center justify-center border border-gray-100 dark:border-zinc-800"
        >
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 text-main dark:text-brand flex items-center justify-center transition-all hover:scale-110 border border-gray-100 dark:border-zinc-800"
        >
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pr-4 border-r border-gray-100 dark:border-zinc-800 cursor-pointer group"
        >
          <div className="hidden sm:block text-left text-right">
            <p className="text-xs font-black text-black dark:text-white group-hover:text-brand transition-colors">{user.name}</p>
            <p className="text-[9px] text-gray-400 uppercase font-bold">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-main text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-user-gear"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
