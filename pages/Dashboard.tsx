
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

  if (loading) return <div className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-3xl"></i></div>;

  const cards = [
    { label: 'إجمالي الطلاب', value: stats?.studentsCount, icon: 'fa-user-graduate', color: 'bg-brand/10 text-brand' },
    { label: 'إجمالي المجموعات', value: stats?.groupsCount, icon: 'fa-layer-group', color: 'bg-main/10 text-main' },
    { label: 'إجمالي الأرباح', value: `${stats?.totalIncome} ج.م`, icon: 'fa-wallet', color: 'bg-green-500/10 text-green-500' },
    { label: 'الامتحانات', value: stats?.examsCount, icon: 'fa-file-signature', color: 'bg-zinc-500/10 text-zinc-500' },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((s, i) => (
          <div key={i} className="card p-8 rounded-[40px] flex flex-col gap-6 shadow-sm border-gray-100 dark:border-zinc-900 bg-white dark:bg-black">
            <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              <i className={`fa-solid ${s.icon} text-2xl`}></i>
            </div>
            <div>
              <p className="text-gray-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{s.label}</p>
              <h4 className="text-4xl font-black mt-1 text-black dark:text-white tracking-tighter">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-10 rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black">
          <h3 className="text-xl font-black text-black dark:text-white mb-10 flex items-center gap-4">
            <i className="fa-solid fa-chart-line text-brand"></i>
            نظرة عامة على الأداء
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[32px] text-gray-400 font-bold">
            [رسم بياني - بانتظار ربط البيانات]
          </div>
        </div>

        <div className="card p-10 rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black">
          <h3 className="text-xl font-black mb-8 flex items-center gap-4 text-black dark:text-white">
            <i className="fa-solid fa-clock-rotate-left text-brand"></i>
            آخر التحصيلات
          </h3>
          <div className="space-y-6">
            {stats?.recentPayments?.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-brand font-black text-xs group-hover:bg-brand group-hover:text-black transition-all">
                    {t.studentName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black dark:text-white">{t.studentName}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{t.groupName}</p>
                  </div>
                </div>
                <span className="text-brand font-black text-sm">+{t.amount}ج</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
