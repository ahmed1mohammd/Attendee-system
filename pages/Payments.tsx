
import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';
import { Transaction } from '../types';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const [pData, sData] = await Promise.all([
        ApiClient.get<Transaction[]>('/payments'),
        ApiClient.get<any>('/payments/stats')
      ]);
      setPayments(pData);
      setStats(sData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const filtered = payments.filter(p => p.studentName.includes(search));

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-12 rounded-[48px] bg-[#16423C] text-white border-0 shadow-2xl relative overflow-hidden group">
          <i className="fa-solid fa-money-bill-trend-up absolute -top-4 -right-4 text-white/5 text-[180px] group-hover:scale-110 transition-transform"></i>
          <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 relative z-10 text-brand">إيرادات اليوم</p>
          <div className="relative z-10 flex items-baseline gap-3">
            <h3 className="text-7xl font-black tracking-tighter">{stats?.daily || 0}</h3>
            <span className="text-xl font-bold opacity-30 italic">EGP</span>
          </div>
        </div>

        <div className="card p-12 rounded-[48px] bg-brand text-black border-0 shadow-2xl relative overflow-hidden group">
          <i className="fa-solid fa-vault absolute -top-4 -right-4 text-black/5 text-[180px] group-hover:scale-110 transition-transform"></i>
          <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 relative z-10">أرباح الأسبوع</p>
          <div className="relative z-10 flex items-baseline gap-3">
            <h3 className="text-7xl font-black tracking-tighter">{stats?.weekly || 0}</h3>
            <span className="text-xl font-bold opacity-30 italic">EGP</span>
          </div>
        </div>

        <div className="card p-12 rounded-[48px] bg-black text-white border border-zinc-900 shadow-2xl relative overflow-hidden group">
          <i className="fa-solid fa-chart-pie absolute -top-4 -right-4 text-white/5 text-[180px] group-hover:scale-110 transition-transform"></i>
          <p className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 relative z-10">أرباح الشهر</p>
          <div className="relative z-10 flex items-baseline gap-3">
            <h3 className="text-7xl font-black tracking-tighter">{stats?.monthly || 0}</h3>
            <span className="text-xl font-bold opacity-30 italic">EGP</span>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-sm">
        <div className="p-10 border-b border-gray-50 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <h4 className="text-2xl font-black flex items-center gap-4">
            <i className="fa-solid fa-receipt text-brand"></i>
            السجلات المالية
          </h4>
          <div className="relative w-full md:w-96">
            <input 
              type="text" placeholder="بحث باسم الطالب..." 
              className="w-full bg-gray-50 dark:bg-zinc-900 p-4 pr-12 rounded-3xl outline-none font-bold text-sm border border-transparent focus:border-brand"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <i className="fa-solid fa-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800">
                <th className="p-8">اسم الطالب</th>
                <th className="p-8">المجموعة</th>
                <th className="p-8">التاريخ</th>
                <th className="p-8 text-center">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center"><i className="fa-solid fa-circle-notch animate-spin text-brand"></i></td></tr>
              ) : filtered.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/40 group transition-all">
                  <td className="p-8 font-black text-black dark:text-white text-lg">{t.studentName}</td>
                  <td className="p-8"><span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.groupName}</span></td>
                  <td className="p-8 text-gray-500 font-mono text-sm">{t.date}</td>
                  <td className="p-8 text-center">
                    <span className="font-black text-brand text-xl tracking-tighter">{t.amount} ج.م</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
