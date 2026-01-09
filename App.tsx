
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
import Profile from './pages/Profile';
import Users from './pages/Users';
import AttendanceManager from './pages/AttendanceManager';
import { User } from './types';
import { ApiClient } from './services/apiClient';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      ApiClient.get<User>('/auth/me')
        .then(user => setCurrentUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center font-['Cairo']">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-bold tracking-widest text-xs uppercase">Connecting to Server...</p>
      </div>
    </div>
  );

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-white dark:bg-black font-['Cairo'] transition-colors duration-300">
        <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar 
            theme={theme} 
            toggleTheme={() => setTheme(p => p === 'dark' ? 'light' : 'dark')} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            user={currentUser}
          />
          
          <main className="p-4 md:p-8 flex-1 overflow-y-auto bg-gray-50/30 dark:bg-black">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:groupId/attendance" element={<AttendanceManager />} />
                <Route path="/students" element={<Students />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/profile" element={<Profile user={currentUser} onUpdate={setCurrentUser} />} />
                <Route path="/users" element={<Users />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
