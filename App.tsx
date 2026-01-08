
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Groups from './pages/Groups';
import Students from './pages/Students';
import Exams from './pages/Exams';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <HashRouter>
      <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-third text-gray-900'}`}>
        {/* Sidebar */}
        <Sidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
          <Navbar 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode} 
            toggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/students" element={<Students />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
