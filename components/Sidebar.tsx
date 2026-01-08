
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { name: 'الرئيسية', icon: 'fa-home', path: '/' },
    { name: 'المجموعات', icon: 'fa-users-rectangle', path: '/groups' },
    { name: 'الطلاب', icon: 'fa-user-graduate', path: '/students' },
    { name: 'الامتحانات', icon: 'fa-file-signature', path: '/exams' },
    { name: 'تسجيل الحضور', icon: 'fa-qrcode', path: '/attendance' },
    { name: 'المدفوعات', icon: 'fa-money-bill-wave', path: '/payments' },
  ];

  return (
    <aside 
      className={`sidebar-transition h-screen sticky top-0 bg-main text-white shadow-xl overflow-hidden z-40 
        ${collapsed ? 'w-0 md:w-20' : 'w-64'}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-8 border-b border-white/10">
          {!collapsed ? (
            <img src="https://ro-s.net/img/logo.png" alt="Logo" className="h-16 object-contain transition-all" />
          ) : (
             <i className="fa-solid fa-graduation-cap text-3xl"></i>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 py-3 px-4 rounded-lg transition-all mb-2 hover:bg-second/40 
                ${isActive ? 'bg-second shadow-lg text-white' : 'text-gray-300'}`
              }
            >
              <i className={`fa-solid ${item.icon} text-xl w-6 text-center`}></i>
              {!collapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
           {!collapsed && (
             <p className="text-xs text-center text-gray-400">© 2024 نظام إدارة الطلاب</p>
           )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
