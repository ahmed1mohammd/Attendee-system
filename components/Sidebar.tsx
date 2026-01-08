
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { name: 'الرئيسية', icon: 'fa-house-chimney', path: '/' },
    { name: 'المجموعات', icon: 'fa-layer-group', path: '/groups' },
    { name: 'الطلاب', icon: 'fa-user-graduate', path: '/students' },
    { name: 'الامتحانات', icon: 'fa-file-invoice', path: '/exams' },
    { name: 'تسجيل الحضور', icon: 'fa-qrcode', path: '/attendance' },
    { name: 'المدفوعات', icon: 'fa-vault', path: '/payments' },
  ];

  return (
    <aside 
      className={`sidebar-transition h-screen sticky top-0 bg-black dark:bg-[#000000] text-white shadow-[10px_0_30px_rgba(0,0,0,0.5)] overflow-hidden z-40 border-l border-white/5 dark:border-[#22c55e15]
        ${collapsed ? 'w-0 md:w-24' : 'w-72'}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className={`flex items-center justify-center py-10 transition-all duration-500 ${collapsed ? 'px-2' : 'px-6'}`}>
          {!collapsed ? (
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-darkMain to-darkSecond rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img src="https://ro-s.net/img/logo.png" alt="Logo" className="relative h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
            </div>
          ) : (
             <div className="w-12 h-12 bg-gradient-to-br from-[#0f766e] to-[#22c55e] rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <i className="fa-solid fa-microchip text-black text-xl"></i>
             </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-4 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-gradient-to-r from-[#0f766e]/20 to-transparent text-[#22c55e] border-r-4 border-[#22c55e] shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`
              }
            >
              <div className={`flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${collapsed ? 'w-full' : 'w-12 ml-1'}`}>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
              </div>
              
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-sm tracking-wide">{item.name}</span>
                  <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest leading-none">إدارة النظام</span>
                </div>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="fixed right-24 bg-[#061c17] text-[#22c55e] px-4 py-2 rounded-xl text-xs font-black border border-[#22c55e33] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section / Status */}
        <div className="p-6 border-t border-white/5 bg-gradient-to-t from-[#061c17] to-transparent">
           {!collapsed ? (
             <div className="bg-[#0f766e]/10 border border-[#22c55e1a] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-ping"></div>
                   <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-tighter">الحالة: متصل بالخادم</p>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[9px] text-gray-500 font-bold">آخر تحديث</p>
                      <p className="text-xs font-black text-gray-300">الآن</p>
                   </div>
                   <i className="fa-solid fa-shield-halved text-gray-700 text-xl"></i>
                </div>
             </div>
           ) : (
             <div className="flex justify-center">
                <i className="fa-solid fa-circle-check text-[#22c55e] text-xs animate-pulse"></i>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
