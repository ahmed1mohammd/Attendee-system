
import React, { useState } from 'react';
import { ApiClient } from '../services/apiClient';
import { Student } from '../types';

const Attendance: React.FC = () => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ t: string, s: 'ok' | 'err' } | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      const student = await ApiClient.get<Student>(`/students/search?q=${query}`);
      setActive(student);
    } catch (err: any) {
      setMsg({ t: 'لم يتم العثور على الطالب', s: 'err' });
      setActive(null);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (!active) return;
    setLoading(true);
    try {
      await ApiClient.post('/attendance/mark', { studentId: active.id });
      setMsg({ t: `تم تسجيل حضور ${active.name} بنجاح`, s: 'ok' });
      setActive(null);
      setQuery('');
    } catch (err: any) {
      setMsg({ t: 'حدث خطأ أثناء التسجيل', s: 'err' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-fadeIn w-full pb-10">
      <div className="text-center px-4">
        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white italic uppercase tracking-tighter">Smart Attendance</h2>
        <p className="text-brand font-bold text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] mt-2">QR & Manual Scan System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-2">
        {/* QR Scanner Mock Area */}
        <div className="card p-8 md:p-12 rounded-[32px] md:rounded-[48px] flex flex-col items-center gap-6 md:gap-10 bg-white dark:bg-black border-gray-100 dark:border-zinc-900">
           <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-50 dark:bg-zinc-900/50 rounded-[32px] md:rounded-[48px] border-4 border-dashed border-gray-100 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-inner">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand qr-scanner-line opacity-50"></div>
             <i className="fa-solid fa-qrcode text-6xl md:text-8xl text-gray-200 dark:text-zinc-800"></i>
           </div>
           <button className="w-full bg-main dark:bg-brand text-white dark:text-black py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-base md:text-lg shadow-2xl hover:scale-[1.02] transition-all">
             تفعيل الكاميرا
           </button>
        </div>

        {/* Search & Results */}
        <div className="space-y-6 md:space-y-8">
          <div className="card p-6 md:p-10 rounded-[32px] md:rounded-[40px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black">
            <h3 className="text-base md:text-lg font-black text-black dark:text-white mb-6 md:mb-8 text-center md:text-right">بحث يدوي</h3>
            <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" placeholder="رقم الموبايل..." 
                className="flex-1 bg-gray-50 dark:bg-zinc-900 p-4 md:p-5 rounded-2xl outline-none border border-transparent focus:border-brand font-bold text-center text-black dark:text-white text-sm"
                value={query} onChange={e => setQuery(e.target.value)}
              />
              <button disabled={loading} className="bg-black dark:bg-white text-white dark:text-black p-4 md:px-8 rounded-2xl font-black text-sm transition-all hover:bg-brand hover:text-black">
                {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'بحث'}
              </button>
            </form>
            {msg && <div className={`mt-6 p-4 rounded-2xl text-[10px] md:text-[11px] font-black text-center ${msg.s === 'ok' ? 'bg-brand/10 text-brand' : 'bg-red-500/10 text-red-500'}`}>{msg.t}</div>}
          </div>

          {active && (
            <div className="card p-6 md:p-10 rounded-[32px] md:rounded-[40px] border-brand/20 bg-brand/5 animate-scaleIn shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-6 md:mb-8 text-center sm:text-right">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-main dark:bg-brand text-white dark:text-black rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg">
                  {active.name[0]}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xl md:text-2xl font-black text-black dark:text-white truncate">{active.name}</h4>
                  <p className="text-brand font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-1">طالب مسجل</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={markAttendance}
                  disabled={loading}
                  className="flex-1 bg-black dark:bg-brand text-white dark:text-black py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-xl hover:scale-105 transition-transform"
                >
                  تأكيد الحضور
                </button>
                <button onClick={() => setActive(null)} className="p-4 sm:px-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-400 rounded-2xl font-bold text-sm">إلغاء</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
