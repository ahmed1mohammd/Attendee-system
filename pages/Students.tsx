
import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';
import { Student, Group } from '../types';
import QRDisplay from '../components/QRDisplay';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState<Student | null>(null);
  const [form, setForm] = useState<Partial<Student>>({ name: '', phone: '', groupId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sData, gData] = await Promise.all([
        ApiClient.get<Student[]>('/students'),
        ApiClient.get<Group[]>('/groups')
      ]);
      setStudents(sData || []);
      setGroups(gData || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result: Student;
      if (form.id) {
        result = await ApiClient.put<Student>(`/students/${form.id}`, form);
      } else {
        result = await ApiClient.post<Student>('/students', form);
      }
      
      setShowModal(false);
      await fetchData();
      
      // Automatic QR Flow for NEW students
      if (!form.id) {
        setShowQRModal(result);
      }
    } catch (err: any) { 
      alert(err.message); 
    }
  };

  const del = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف الطالب؟')) return;
    try {
      await ApiClient.delete(`/students/${id}`);
      fetchData();
    } catch (err: any) { alert(err.message); }
  };

  const filtered = students.filter(s => s.name.includes(search) || s.phone.includes(search));

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn pb-10 px-2 font-['Cairo']">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white italic">Students Management</h2>
          <p className="text-brand font-bold text-[10px] uppercase tracking-widest mt-1">قاعدة بيانات الطلاب المسجلين</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" placeholder="بحث بالاسم أو رقم الهاتف..." 
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 pr-12 rounded-2xl md:rounded-3xl outline-none font-bold text-sm shadow-sm focus:border-brand"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <i className="fa-solid fa-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button onClick={() => { setForm({ name: '', phone: '', groupId: '' }); setShowModal(true); }} className="bg-brand text-black px-8 py-4 rounded-2xl md:rounded-3xl font-black shadow-lg hover:bg-black hover:text-brand transition-all flex items-center justify-center gap-3 text-sm">
            <i className="fa-solid fa-user-plus text-lg"></i> إضافة طالب جديد
          </button>
        </div>
      </div>

      <div className="card overflow-hidden rounded-[32px] md:rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 dark:border-zinc-800">
                <th className="p-6 md:p-8">بيانات الطالب</th>
                <th className="p-6 md:p-8">المجموعة</th>
                <th className="p-6 md:p-8">رقم الموبايل</th>
                <th className="p-6 md:p-8 text-center">QR Code</th>
                <th className="p-6 md:p-8 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900/50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-2xl"></i></td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-brand/5 transition-all group">
                  <td className="p-6 md:p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-brand font-black text-xl">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-black dark:text-white text-base md:text-lg tracking-tighter">{s.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">{s.qrCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 md:p-8">
                    <div className="flex flex-col">
                      <span className="text-zinc-800 dark:text-zinc-300 font-black text-sm truncate max-w-[150px]">
                        {groups.find(g => g.id === s.groupId)?.name || 'غير محدد'}
                      </span>
                      <span className="text-[9px] text-brand font-bold uppercase tracking-widest">Active Group</span>
                    </div>
                  </td>
                  <td className="p-6 md:p-8 text-zinc-500 font-mono font-bold text-sm">{s.phone}</td>
                  <td className="p-6 md:p-8 text-center">
                    <button 
                      onClick={() => setShowQRModal(s)}
                      className="w-12 h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-brand rounded-2xl hover:scale-110 transition-transform shadow-sm group-hover:bg-brand group-hover:text-black"
                    >
                      <i className="fa-solid fa-qrcode text-lg"></i>
                    </button>
                  </td>
                  <td className="p-6 md:p-8 text-center">
                    <div className="flex justify-center gap-3 opacity-100 md:opacity-20 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setForm(s); setShowModal(true); }} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:text-brand transition-all"><i className="fa-solid fa-pen text-xs"></i></button>
                      <button onClick={() => del(s.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash text-xs"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="p-20 text-center text-zinc-500 font-bold italic">لا توجد بيانات مطابقة للبحث</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-white dark:bg-zinc-950 w-full max-w-lg rounded-[40px] p-10 md:p-14 space-y-6 animate-scaleIn shadow-2xl border border-white/5 overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white italic">Student Entry</h3>
               <button type="button" onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-red-500 transition-all"><i className="fa-solid fa-xmark text-2xl"></i></button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Student Name</label>
                <input type="text" placeholder="الاسم الرباعي للطالب" required className="w-full bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-brand transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Mobile Number</label>
                <input type="tel" placeholder="01xxxxxxxxx" required className="w-full bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl font-black text-sm outline-none border border-transparent focus:border-brand text-center font-mono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Target Group</label>
                <select required className="w-full bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl font-black outline-none border border-transparent focus:border-brand text-sm" value={form.groupId} onChange={e => setForm({...form, groupId: e.target.value})}>
                  <option value="">اختر المجموعة...</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button type="submit" className="flex-1 bg-brand text-black py-5 rounded-[24px] font-black shadow-2xl shadow-brand/20 hover:scale-[1.03] active:scale-95 transition-all text-lg">تأكيد التسجيل</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 py-5 rounded-[24px] font-black hover:bg-red-500 hover:text-white transition-all">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* QR Viewer / Post-Registration Success Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
             <div className="mb-6 text-center animate-bounce">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto shadow-2xl">
                   <i className="fa-solid fa-check text-black text-3xl"></i>
                </div>
                <p className="text-brand font-black mt-4 text-xl tracking-tighter">تم التسجيل بنجاح!</p>
             </div>
             <QRDisplay 
              student={showQRModal} 
              groupName={groups.find(g => g.id === showQRModal.groupId)?.name || 'عام'} 
              onClose={() => setShowQRModal(null)} 
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
