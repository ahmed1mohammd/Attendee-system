
import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';

interface DashboardStats {
  studentsCount: number;
  groupsCount: number;
  totalIncome: number;
  examsCount: number;
  recentPayments: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get<DashboardStats>('/dashboard/stats')
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-10 md:p-20 text-center">
      <i className="fa-solid fa-spinner animate-spin text-brand text-3xl"></i>
    </div>
  );

  const cards = [
    { label: 'إجمالي الطلاب', value: stats?.studentsCount, icon: 'fa-user-graduate', color: 'bg-brand/10 text-brand' },
    { label: 'إجمالي المجموعات', value: stats?.groupsCount, icon: 'fa-layer-group', color: 'bg-main/10 text-main' },
    { label: 'إجمالي الأرباح', value: `${stats?.totalIncome} ج.م`, icon: 'fa-wallet', color: 'bg-green-500/10 text-green-500' },
    { label: 'الامتحانات', value: stats?.examsCount, icon: 'fa-file-signature', color: 'bg-zinc-500/10 text-zinc-500' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn w-full overflow-x-hidden">
      {/* Responsive Grid for Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((s, i) => (
          <div key={i} className="card p-6 md:p-8 rounded-[32px] md:rounded-[40px] flex flex-col gap-4 md:gap-6 shadow-sm border-gray-100 dark:border-zinc-900 bg-white dark:bg-black transition-transform hover:scale-[1.02]">
            <div className={`w-12 h-12 md:w-14 md:h-14 ${s.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              <i className={`fa-solid ${s.icon} text-xl md:text-2xl`}></i>
            </div>
            <div>
              <p className="text-gray-400 dark:text-zinc-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">{s.label}</p>
              <h4 className="text-2xl md:text-4xl font-black mt-1 text-black dark:text-white tracking-tighter truncate">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black w-full overflow-hidden">
          <h3 className="text-lg md:text-xl font-black text-black dark:text-white mb-6 md:mb-10 flex items-center gap-4">
            <i className="fa-solid fa-chart-line text-brand"></i>
            نظرة عامة على الأداء
          </h3>
          <div className="h-48 md:h-64 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[24px] md:rounded-[32px] text-gray-400 font-bold text-sm md:text-base text-center p-4">
            [رسم بياني تفاعلي - بانتظار ربط البيانات]
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black w-full overflow-hidden">
          <h3 className="text-lg md:text-xl font-black mb-6 md:mb-8 flex items-center gap-4 text-black dark:text-white">
            <i className="fa-solid fa-clock-rotate-left text-brand"></i>
            آخر التحصيلات
          </h3>
          <div className="space-y-4 md:space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
            {stats?.recentPayments?.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-brand font-black text-xs group-hover:bg-brand group-hover:text-black transition-all">
                    {t.studentName[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs md:text-sm text-black dark:text-white truncate">{t.studentName}</p>
                    <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase truncate">{t.groupName}</p>
                  </div>
                </div>
                <span className="text-brand font-black text-xs md:text-sm flex-shrink-0">+{t.amount}ج</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
