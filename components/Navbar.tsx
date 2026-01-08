
import React from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, toggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="h-16 bg-white dark:bg-darkCard/80 dark:backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-main dark:text-darkSecond"
        >
          <i className={`fa-solid ${isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'} text-xl`}></i>
        </button>
        <div className="flex items-center gap-3 mr-4">
           <div className="w-8 h-8 bg-main dark:bg-darkSecond rounded-lg flex items-center justify-center text-white dark:text-black text-xs font-black shadow-lg">S</div>
           <h1 className="text-sm font-black text-gray-800 dark:text-darkText hidden md:block">نظام إدارة الطلاب الذكي</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-100 dark:border-white/5"
        >
          <i className={`fa-solid ${isDarkMode ? 'fa-sun text-yellow-500' : 'fa-moon text-blue-500'} text-lg`}></i>
        </button>
        
        <div className="flex items-center gap-3 border-r pr-4 border-gray-100 dark:border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-gray-900 dark:text-darkText">أدمن النظام</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">الوصول الكامل</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400">
            <i className="fa-solid fa-user-shield"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
