
import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../services/apiClient';
import { Transaction, GroupFinanceSummary } from '../types';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [groupSummaries, setGroupSummaries] = useState<GroupFinanceSummary[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'day' | 'week' | 'month'>('all');
  
  // State for group drill-down
  const [selectedGroup, setSelectedGroup] = useState<GroupFinanceSummary | null>(null);

  const fetchPaymentsData = async () => {
    setLoading(true);
    try {
      const [pData, sData, gSummaries] = await Promise.all([
        ApiClient.get<Transaction[]>('/payments'),
        ApiClient.get<any>('/payments/stats'),
        ApiClient.get<GroupFinanceSummary[]>('/payments/group-summaries')
      ]);
      setPayments(pData || []);
      setStats(sData);
      setGroupSummaries(gSummaries || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPaymentsData(); }, []);

  // Filter groups by search query
  const filteredGroups = useMemo(() => {
    return groupSummaries.filter(g => 
      g.groupName.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupSummaries, search]);

  // Filter transactions for specific group if one is selected
  const groupSpecificTransactions = useMemo(() => {
    if (!selectedGroup) return [];
    return payments.filter(p => p.groupId === selectedGroup.groupId);
  }, [selectedGroup, payments]);

  // Filter individual transactions by search and time filter for general list
  const filteredTransactions = useMemo(() => {
    let list = payments.filter(p => p.studentName.includes(search) || p.groupName.includes(search));
    
    const now = new Date();
    if (filterType === 'day') {
      list = list.filter(p => p.date === now.toISOString().split('T')[0]);
    }
    
    return list;
  }, [payments, search, filterType]);

  return (
    <div className="space-y-12 animate-fadeIn pb-20 font-['Cairo'] w-full overflow-x-hidden">
      
      {!selectedGroup ? (
        <>
          {/* 1. Finance Overview - Hero Stats (Huge Numbers) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-10 rounded-[56px] bg-main text-white border-0 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
              <p className="font-black text-xs uppercase tracking-[0.3em] mb-6 text-brand">إيرادات اليوم</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-6xl md:text-8xl font-black tracking-tighter">{stats?.daily || 0}</h3>
                <span className="text-xl font-bold opacity-30 italic">ج.م</span>
              </div>
            </div>

            <div className="card p-10 rounded-[56px] bg-brand text-black border-0 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
              <p className="font-black text-xs uppercase tracking-[0.3em] mb-6 opacity-60">أرباح الأسبوع</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-6xl md:text-8xl font-black tracking-tighter">{stats?.weekly || 0}</h3>
                <span className="text-xl font-bold opacity-20 italic">ج.م</span>
              </div>
            </div>

            <div className="card p-10 rounded-[56px] bg-black text-white border border-zinc-900 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
              <p className="font-black text-xs uppercase tracking-[0.3em] mb-6 text-zinc-500">أرباح الشهر</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-6xl md:text-8xl font-black tracking-tighter">{stats?.monthly || 0}</h3>
                <span className="text-xl font-bold opacity-20 italic">ج.م</span>
              </div>
            </div>
          </div>

          {/* 2. Group Income Analysis Cards */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
              <div className="space-y-1">
                <h4 className="text-3xl font-black text-black dark:text-white italic tracking-tighter uppercase">Groups Performance</h4>
                <p className="text-brand font-bold text-xs uppercase tracking-widest">تحليل الدخل التفصيلي لكل مجموعة</p>
              </div>
              <div className="relative w-full md:w-96">
                <input 
                  type="text" placeholder="بحث باسم المجموعة..." 
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 pr-14 rounded-3xl outline-none font-bold text-sm shadow-xl focus:border-brand transition-all"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
                <i className="fa-solid fa-search absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20"><i className="fa-solid fa-spinner animate-spin text-brand text-4xl"></i></div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-2">
                {filteredGroups.map(g => (
                  <div key={g.groupId} className="card p-10 rounded-[56px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-2xl hover:border-brand transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-3 h-full bg-brand/20 group-hover:bg-brand transition-colors"></div>
                    
                    <div className="flex justify-between items-start mb-12">
                      <div className="space-y-1">
                        <h5 className="text-2xl md:text-3xl font-black text-black dark:text-white group-hover:text-brand transition-colors">{g.groupName}</h5>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Financial Summary</p>
                        </div>
                      </div>
                      <button className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-brand text-2xl shadow-inner border border-zinc-100 dark:border-zinc-800 hover:scale-110 transition-transform">
                        <i className="fa-solid fa-chart-line"></i>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                      <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-[32px] text-center border border-gray-100 dark:border-zinc-800 transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-3 tracking-widest">دخل الحصة</p>
                        <p className="text-3xl font-black text-black dark:text-white tracking-tighter">{g.sessionIncome}</p>
                        <p className="text-[8px] font-bold text-brand mt-1">SESSION</p>
                      </div>
                      <div className="bg-brand/5 p-6 rounded-[32px] text-center border border-brand/10 transition-transform hover:-translate-y-1 scale-105 shadow-xl shadow-brand/5">
                        <p className="text-[10px] font-black text-brand uppercase mb-3 tracking-widest">دخل الأسبوع</p>
                        <p className="text-3xl font-black text-brand tracking-tighter">{g.weeklyIncome}</p>
                        <p className="text-[8px] font-bold text-brand mt-1">WEEKLY</p>
                      </div>
                      <div className="bg-black dark:bg-zinc-950 p-6 rounded-[32px] text-center border border-zinc-900 transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-black text-zinc-500 uppercase mb-3 tracking-widest">دخل الشهر</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{g.monthlyIncome}</p>
                        <p className="text-[8px] font-bold text-zinc-600 mt-1">MONTHLY</p>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-50 dark:border-zinc-900 flex justify-between items-center">
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                          {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-zinc-200 dark:bg-zinc-800"></div>)}
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-black bg-brand flex items-center justify-center text-[10px] font-black text-black">+12</div>
                      </div>
                      <button 
                        onClick={() => setSelectedGroup(g)}
                        className="text-zinc-400 hover:text-brand font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all group-hover:translate-x-[-10px]"
                      >
                          تفاصيل المجموعة
                          <i className="fa-solid fa-arrow-left"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Group Detail Drill-down View */
        <div className="space-y-10 animate-scaleIn">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-gray-100 dark:border-zinc-900 pb-10 px-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSelectedGroup(null)}
                className="w-16 h-16 rounded-[24px] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-brand transition-all shadow-lg border border-gray-100 dark:border-zinc-800"
              >
                <i className="fa-solid fa-arrow-right text-xl"></i>
              </button>
              <div>
                <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter">{selectedGroup.groupName}</h2>
                <div className="flex items-center gap-3 mt-2">
                   <span className="bg-brand/10 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">تحصيل المجموعة</span>
                   <span className="text-zinc-500 font-bold text-xs">إجمالي المحصل لهذه المجموعة</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
               <div className="bg-brand text-black px-10 py-5 rounded-[32px] font-black flex flex-col items-center justify-center shadow-xl shadow-brand/20">
                  <span className="text-[10px] uppercase opacity-60">Session Total</span>
                  <span className="text-3xl tracking-tighter">{selectedGroup.sessionIncome} ج.م</span>
               </div>
            </div>
          </div>

          <div className="card overflow-hidden rounded-[64px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-2xl">
            <div className="p-10 border-b border-gray-50 dark:border-zinc-900">
               <h4 className="text-2xl font-black text-black dark:text-white italic">Group Students Payments</h4>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">قائمة الطلاب الذين قاموا بالسداد</p>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-right min-w-[800px]">
                  <thead>
                     <tr className="bg-gray-50 dark:bg-zinc-900/30 text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 dark:border-zinc-900">
                        <th className="p-10">اسم الطالب</th>
                        <th className="p-10">رقم الهاتف</th>
                        <th className="p-10">تاريخ السداد</th>
                        <th className="p-10 text-center">المبلغ</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-zinc-900/50">
                     {groupSpecificTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-brand/[0.02] group transition-all">
                           <td className="p-10">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-brand font-black text-xl border border-gray-100 dark:border-zinc-800 group-hover:bg-brand group-hover:text-black transition-all">
                                    {t.studentName[0]}
                                 </div>
                                 <p className="font-black text-black dark:text-white text-lg tracking-tight">{t.studentName}</p>
                              </div>
                           </td>
                           <td className="p-10 text-zinc-500 font-mono font-bold text-sm">--01xxxxxxxxx--</td>
                           <td className="p-10 text-zinc-400 font-mono text-sm italic">{t.date}</td>
                           <td className="p-10 text-center">
                              <span className="font-black text-brand text-3xl tracking-tighter">+{t.amount}</span>
                           </td>
                        </tr>
                     ))}
                     {groupSpecificTransactions.length === 0 && (
                        <tr><td colSpan={4} className="p-28 text-center text-zinc-500 italic font-black">لا توجد سجلات دفع لهذه المجموعة حالياً</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. General Detailed Transactions Table - Only shown in summary view */}
      {!selectedGroup && (
        <div className="card overflow-hidden rounded-[64px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-2xl">
          <div className="p-10 md:p-14 border-b border-gray-50 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-brand text-black rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <div>
                <h4 className="text-2xl font-black text-black dark:text-white">سجل المعاملات</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Recent Financial Logs</p>
              </div>
            </div>
            
            <div className="flex bg-gray-50 dark:bg-zinc-900 p-2 rounded-2xl border border-gray-100 dark:border-zinc-800">
              {(['all', 'day', 'week', 'month'] as const).map(type => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)} 
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterType === type ? 'bg-brand text-black shadow-lg' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
                >
                  {type === 'all' ? 'الكل' : type === 'day' ? 'اليوم' : type === 'week' ? 'الأسبوع' : 'الشهر'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-900/30 text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 dark:border-zinc-900">
                  <th className="p-10">بيانات الطالب</th>
                  <th className="p-10">المجموعة</th>
                  <th className="p-10">التاريخ والوقت</th>
                  <th className="p-10 text-center">المبلغ المستلم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-900/50">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-3xl"></i></td></tr>
                ) : filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-brand/[0.02] group transition-all">
                    <td className="p-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-brand font-black text-xl border border-gray-100 dark:border-zinc-800 group-hover:bg-brand group-hover:text-black transition-all">
                          {t.studentName[0]}
                        </div>
                        <div>
                          <p className="font-black text-black dark:text-white text-lg tracking-tight">{t.studentName}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase">Verified Transaction</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-10">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-all">
                        {t.groupName}
                      </span>
                    </td>
                    <td className="p-10">
                      <div className="flex flex-col">
                        <span className="text-zinc-500 font-mono text-sm font-black italic">{t.date}</span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Auto Generated Time</span>
                      </div>
                    </td>
                    <td className="p-10 text-center">
                      <div className="inline-flex flex-col items-end">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-brand text-3xl tracking-tighter">+{t.amount}</span>
                          <span className="text-xs font-bold text-zinc-400 italic">EGP</span>
                        </div>
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mt-1">Paid via QR/Manual</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && !loading && (
                  <tr><td colSpan={4} className="p-28 text-center text-zinc-500 font-black italic text-xl opacity-30">لا توجد سجلات مالية مطابقة</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
