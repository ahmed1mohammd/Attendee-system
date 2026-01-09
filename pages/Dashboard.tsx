
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
    { label: 'إجمالي الطلاب', value: stats?.studentsCount, icon: 'fa-user-graduate', color: 'bg-brand/10 text-brand', shadow: 'shadow-brand/5' },
    { label: 'إجمالي المجموعات', value: stats?.groupsCount, icon: 'fa-layer-group', color: 'bg-emerald-500/10 text-emerald-500', shadow: 'shadow-emerald-500/5' },
    { label: 'إجمالي الأرباح', value: `${stats?.totalIncome} ج.م`, icon: 'fa-wallet', color: 'bg-green-500/10 text-green-400', shadow: 'shadow-green-500/5' },
    { label: 'الامتحانات المنفذة', value: stats?.examsCount, icon: 'fa-file-signature', color: 'bg-zinc-500/10 text-zinc-400', shadow: 'shadow-zinc-500/5' },
  ];

  return (
    <div className="space-y-6 md:space-y-12 animate-fadeIn w-full overflow-x-hidden font-['Cairo']">
      {/* Enhanced Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {cards.map((s, i) => (
          <div key={i} className={`card p-8 md:p-10 rounded-[40px] md:rounded-[56px] flex flex-col items-start gap-8 shadow-2xl border-gray-100 dark:border-white/5 bg-white dark:bg-black transition-all hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden ${s.shadow}`}>
            {/* Background Accent for depth */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 blur-3xl ${s.color}`}></div>
            
            <div className={`w-16 h-16 md:w-20 md:h-20 ${s.color} rounded-3xl flex items-center justify-center shadow-lg border border-white/10`}>
              <i className={`fa-solid ${s.icon} text-2xl md:text-3xl`}></i>
            </div>
            
            <div className="space-y-2 w-full">
              <p className="text-zinc-500 dark:text-zinc-400 font-black text-xs md:text-sm uppercase tracking-[0.2em]">{s.label}</p>
              <h4 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-tighter leading-none break-all">
                {s.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-2 card p-8 md:p-12 rounded-[48px] md:rounded-[64px] border-gray-100 dark:border-white/5 bg-white dark:bg-black w-full overflow-hidden shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl md:text-2xl font-black text-black dark:text-white flex items-center gap-4">
              <div className="w-2 h-8 bg-brand rounded-full"></div>
              تحليل الأداء الأكاديمي
            </h3>
            <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/10 px-4 py-2 rounded-full">Live Analytics</span>
          </div>
          <div className="h-64 md:h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[40px] text-zinc-500 font-bold text-base md:text-lg text-center p-8 bg-gray-50/50 dark:bg-zinc-900/10">
            <i className="fa-solid fa-chart-simple text-5xl mb-4 opacity-20"></i>
            <p className="max-w-xs">سيتم عرض منحنى بياني لتطور درجات الطلاب والحضور هنا بمجرد توفر البيانات الكافية.</p>
          </div>
        </div>

        {/* Improved Recent Transactions */}
        <div className="card p-8 md:p-12 rounded-[48px] md:rounded-[64px] border-gray-100 dark:border-white/5 bg-white dark:bg-black w-full overflow-hidden shadow-xl">
          <h3 className="text-xl md:text-2xl font-black mb-10 flex items-center gap-4 text-black dark:text-white">
            <i className="fa-solid fa-receipt text-brand"></i>
            أحدث العمليات
          </h3>
          <div className="space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
            {stats?.recentPayments?.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between group p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-brand font-black text-lg group-hover:bg-brand group-hover:text-black transition-all shadow-sm">
                    {t.studentName[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-sm md:text-base text-black dark:text-white truncate tracking-tight">{t.studentName}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{t.groupName}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                   <p className="text-brand font-black text-base md:text-xl tracking-tighter">+{t.amount}</p>
                   <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">EGP</p>
                </div>
              </div>
            ))}
            {(!stats?.recentPayments || stats.recentPayments.length === 0) && (
              <div className="py-10 text-center text-zinc-500 italic font-bold">لا توجد تحصيلات حالياً</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
