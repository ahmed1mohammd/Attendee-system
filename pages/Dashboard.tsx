
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Group, Student, Exam, Transaction } from '../types';

interface DashboardProps {
  groups: Group[];
  students: Student[];
  exams: Exam[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ groups, students, exams, transactions }) => {
  const todayDate = new Date().toISOString().split('T')[0];

  const totalIncome = useMemo(() => transactions.reduce((acc, curr) => acc + curr.amount, 0), [transactions]);
  
  const todayAttendance = useMemo(() => 
    transactions.filter(t => t.date === todayDate).length
  , [transactions, todayDate]);

  const chartData = useMemo(() => [
    { name: 'السبت', value: 400 },
    { name: 'الأحد', value: 700 },
    { name: 'الاثنين', value: 1200 },
    { name: 'الثلاثاء', value: 900 },
    { name: 'الأربعاء', value: 1500 },
    { name: 'الخميس', value: 2000 },
    { name: 'الجمعة', value: 0 },
  ], []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-darkText flex items-center gap-3">
               <span className="w-2 h-8 bg-main dark:bg-darkSecond rounded-full"></span>
               الإحصائيات الحيوية
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold mt-1 mr-5">متابعة فورية لنشاط المركز</p>
         </div>
         <div className="flex gap-2">
            <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 px-6 py-3 rounded-2xl shadow-sm">
               <span className="text-[10px] font-black text-gray-400 block uppercase">تاريخ اليوم</span>
               <span className="text-sm font-black text-main dark:text-darkSecond">{todayDate}</span>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white dark:bg-darkCard shadow-xl p-8 rounded-[35px] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-main/5 dark:bg-darkSecond/5 rounded-bl-[100px] transition-all group-hover:scale-110"></div>
           <div className="flex justify-between items-center mb-6">
              <div className="w-14 h-14 bg-main/10 dark:bg-darkMain/20 rounded-2xl flex items-center justify-center text-main dark:text-darkSecond">
                 <i className="fa-solid fa-user-graduate text-2xl"></i>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الطلاب</p>
           </div>
           <h4 className="text-4xl font-black text-gray-900 dark:text-darkText">{students.length}</h4>
        </div>

        <div className="card bg-white dark:bg-darkCard shadow-xl p-8 rounded-[35px] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 dark:bg-green-500/5 rounded-bl-[100px] transition-all group-hover:scale-110"></div>
           <div className="flex justify-between items-center mb-6">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                 <i className="fa-solid fa-money-bill-trend-up text-2xl"></i>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الإيرادات</p>
           </div>
           <h4 className="text-4xl font-black text-gray-900 dark:text-darkText">{totalIncome} <span className="text-sm font-normal opacity-50">ج.م</span></h4>
        </div>

        <div className="card bg-white dark:bg-darkCard shadow-xl p-8 rounded-[35px] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-500/5 rounded-bl-[100px] transition-all group-hover:scale-110"></div>
           <div className="flex justify-between items-center mb-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                 <i className="fa-solid fa-layer-group text-2xl"></i>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المجموعات</p>
           </div>
           <h4 className="text-4xl font-black text-gray-900 dark:text-darkText">{groups.length}</h4>
        </div>

        <div className="card bg-white dark:bg-darkCard shadow-xl p-8 rounded-[35px] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 dark:bg-orange-500/5 rounded-bl-[100px] transition-all group-hover:scale-110"></div>
           <div className="flex justify-between items-center mb-6">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                 <i className="fa-solid fa-calendar-check text-2xl"></i>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الحضور</p>
           </div>
           <h4 className="text-4xl font-black text-gray-900 dark:text-darkText">{todayAttendance}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column - Added min-w-0 to fix Recharts measurement */}
        <div className="lg:col-span-2 card bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-10 rounded-[40px] shadow-2xl min-w-0">
           <h3 className="text-xl font-black mb-12 text-gray-800 dark:text-darkText flex items-center gap-3">
              <i className="fa-solid fa-chart-line text-main dark:text-darkSecond"></i>
              الرصد البياني الأسبوعي
           </h3>
           {/* Fixed Height Parent with Relative positioning */}
           <div className="h-[380px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8881" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 11, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#061c17', borderRadius: '16px', border: '1px solid #22c55e33', color: '#e6fff6' }}
                    itemStyle={{ color: '#e6fff6', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="card bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-10 rounded-[40px] shadow-2xl">
           <h3 className="text-xl font-black mb-10 text-gray-800 dark:text-darkText flex items-center gap-3">
              <i className="fa-solid fa-bolt text-darkSecond animate-pulse"></i>
              أحدث العمليات
           </h3>
           <div className="space-y-5">
              {transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-darkSecond/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-main dark:bg-darkMain text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:rotate-12 transition-transform">
                      {t.studentName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-darkText">{t.studentName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{t.groupName}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-darkSecond">+{t.amount}ج</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
