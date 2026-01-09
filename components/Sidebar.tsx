
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLogout }) => {
  const menuItems = [
    { name: 'الرئيسية', icon: 'fa-chart-pie', path: '/' },
    { name: 'المجموعات', icon: 'fa-layer-group', path: '/groups' },
    { name: 'الطلاب', icon: 'fa-user-graduate', path: '/students' },
    { name: 'الامتحانات', icon: 'fa-file-signature', path: '/exams' },
    { name: 'الحضور والتحصيل', icon: 'fa-qrcode', path: '/attendance' },
    { name: 'السجلات المالية', icon: 'fa-wallet', path: '/payments' },
    { name: 'المسؤولين', icon: 'fa-user-shield', path: '/users' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} h-screen sticky top-0 transition-all duration-300 bg-main dark:bg-black border-l border-white/5 flex flex-col p-4 z-40 shadow-2xl`}>
      <div className={`mb-10 flex items-center ${isOpen ? 'gap-3 px-2' : 'justify-center'}`}>
        <img src="https://ro-s.net/img/logo.png" className="w-10 h-10 object-contain" alt="Logo" />
        {isOpen && <span className="text-xl font-black text-white italic tracking-tighter">DASHBOARD</span>}
      </div>

      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center ${isOpen ? 'gap-4 px-4' : 'justify-center'} py-3.5 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? 'text-white bg-white/10 border-r-4 border-brand shadow-lg' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <i className={`fa-solid ${item.icon} text-lg w-6 text-center`}></i>
            {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center ${isOpen ? 'gap-4 px-4' : 'justify-center'} py-3 rounded-xl text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all`}
        >
          <i className="fa-solid fa-power-off w-6 text-center"></i>
          {isOpen && <span>خروج</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
