
import React from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, toggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="h-16 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
        >
          <i className={`fa-solid ${isSidebarCollapsed ? 'fa-indent' : 'fa-outdent'} text-xl text-main dark:text-second`}></i>
        </button>
        <h1 className="text-xl font-bold text-main dark:text-white hidden md:block">لوحة التحكم</h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
          title={isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}
        >
          <i className={`fa-solid ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600'} text-xl`}></i>
        </button>
        
        <div className="flex items-center gap-3 border-r pr-4 dark:border-zinc-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold dark:text-white">أدمن النظام</p>
            <p className="text-xs text-gray-500">مدير عام</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-main flex items-center justify-center text-white">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
