
import React, { useState } from 'react';
import { ApiClient } from '../services/apiClient';
import { Student, Group } from '../types';

const Attendance: React.FC = () => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ t: string, s: 'ok' | 'err' } | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-4xl font-black text-black dark:text-white italic uppercase tracking-tighter">Smart Attendance</h2>
        <p className="text-brand font-bold text-[10px] uppercase tracking-[0.5em] mt-2">QR & Manual Scan System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="card p-12 rounded-[48px] flex flex-col items-center gap-10 bg-white dark:bg-black border-gray-100 dark:border-zinc-900">
           <div className="w-64 h-64 bg-gray-50 dark:bg-zinc-900/50 rounded-[48px] border-4 border-dashed border-gray-100 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-inner">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand qr-scanner-line opacity-50"></div>
             <i className="fa-solid fa-qrcode text-8xl text-gray-200 dark:text-zinc-800"></i>
           </div>
           <button className="w-full bg-main dark:bg-brand text-white dark:text-black py-6 rounded-3xl font-black text-lg shadow-2xl hover:scale-[1.02] transition-all">
             تفعيل الكاميرا
           </button>
        </div>

        <div className="space-y-8">
          <div className="card p-10 rounded-[40px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black">
            <h3 className="text-lg font-black text-black dark:text-white mb-8">بحث يدوي</h3>
            <form onSubmit={search} className="flex gap-3">
              <input 
                type="text" placeholder="رقم الهاتف أو كود الطالب..." 
                className="flex-1 bg-gray-50 dark:bg-zinc-900 p-5 rounded-2xl outline-none border border-transparent focus:border-brand font-bold text-center text-black dark:text-white"
                value={query} onChange={e => setQuery(e.target.value)}
              />
              <button disabled={loading} className="bg-black dark:bg-white text-white dark:text-black px-8 rounded-2xl font-black">
                {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'بحث'}
              </button>
            </form>
            {msg && <div className={`mt-6 p-5 rounded-2xl text-[11px] font-black text-center ${msg.s === 'ok' ? 'bg-brand/10 text-brand' : 'bg-red-500/10 text-red-500'}`}>{msg.t}</div>}
          </div>

          {active && (
            <div className="card p-10 rounded-[40px] border-brand/20 bg-brand/5 animate-scaleIn shadow-2xl">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-main dark:bg-brand text-white dark:text-black rounded-2xl flex items-center justify-center text-3xl font-black">
                  {active.name[0]}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-black dark:text-white">{active.name}</h4>
                  <p className="text-brand font-bold text-[10px] uppercase tracking-widest mt-1">طالب مسجل</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={markAttendance}
                  disabled={loading}
                  className="flex-1 bg-black dark:bg-brand text-white dark:text-black py-5 rounded-2xl font-black text-lg shadow-xl"
                >
                  تأكيد الحضور
                </button>
                <button onClick={() => setActive(null)} className="px-8 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-400 rounded-2xl">إلغاء</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
