
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
import { Group, Student, Exam, Transaction } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Global State (Mock Database)
  const [groups, setGroups] = useState<Group[]>([
    { id: 'g1', name: 'مجموعة النوابغ (علمي)', days: ['الاثنين', 'الخميس'], time: '04:00 م', price: 100, studentCount: 25 },
    { id: 'g2', name: 'مجموعة الأوائل (أدبي)', days: ['الأحد', 'الثلاثاء'], time: '06:00 م', price: 80, studentCount: 18 },
  ]);

  const [students, setStudents] = useState<Student[]>([
    { id: 's1', name: 'أحمد محمد علي', phone: '01012345678', groupId: 'g1', qrCode: 'QR-S1', isPaid: true, attendanceCount: 5 },
    { id: 's2', name: 'سارة محمود حسن', phone: '01233445566', groupId: 'g1', qrCode: 'QR-S2', isPaid: false, attendanceCount: 3 },
    { id: 's3', name: 'ياسين إبراهيم', phone: '01199887766', groupId: 'g2', qrCode: 'QR-S3', isPaid: true, attendanceCount: 8 },
  ]);

  const [exams, setExams] = useState<Exam[]>([
    { id: 'e1', name: 'امتحان الشهر الأول', groupId: 'g1', date: '2024-05-10', maxScore: 50 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', studentName: 'أحمد محمد علي', amount: 100, date: '2024-05-15', groupName: 'مجموعة النوابغ' },
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-zinc-100 transition-colors duration-300">
        <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar 
            isDarkMode={isDarkMode} 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          <main className="p-4 md:p-8 flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard groups={groups} students={students} exams={exams} transactions={transactions} />} />
              <Route path="/groups" element={<Groups groups={groups} setGroups={setGroups} students={students} setStudents={setStudents} />} />
              <Route path="/students" element={<Students students={students} setStudents={setStudents} groups={groups} />} />
              <Route path="/exams" element={<Exams exams={exams} setExams={setExams} groups={groups} students={students} />} />
              <Route path="/attendance" element={<Attendance students={students} groups={groups} setStudents={setStudents} setTransactions={setTransactions} />} />
              <Route path="/payments" element={<Payments students={students} transactions={transactions} setTransactions={setTransactions} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
