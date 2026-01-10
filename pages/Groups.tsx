
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiClient } from '../services/apiClient';
import { Group } from '../types';
import SearchBar from '../components/SearchBar';

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Group>>({ name: '', price: 0, time: '', days: [] });

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<Group[]>('/groups');
      setGroups(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) await ApiClient.put(`/groups/${form.id}`, form);
      else await ApiClient.post('/groups', form);
      setShowModal(false);
      fetchGroups();
    } catch (err: any) { alert(err.message); }
  };

  const del = async (id: string) => {
    if (!confirm('سيتم حذف المجموعة وجميع بياناتها، هل أنت متأكد؟')) return;
    try {
      await ApiClient.delete(`/groups/${id}`);
      fetchGroups();
    } catch (err: any) { alert(err.message); }
  };

  // Search by Group Name ONLY
  const filtered = useMemo(() => {
    return groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [groups, search]);

  return (
    <div className="space-y-6 md:space-y-10 animate-fadeIn pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-2">
        <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white">المجموعات الدراسية</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchBar 
            value={search}
            onChange={setSearch}
            placeholder="ابحث باسم المجموعة..."
            className="flex-1 md:w-80"
          />
          <button onClick={() => { setForm({ name: '', price: 0, time: '', days: [] }); setShowModal(true); }} className="w-full sm:w-auto bg-brand text-black px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl font-black shadow-lg shadow-brand/10 hover:bg-black hover:text-brand transition-all flex items-center justify-center gap-2 text-sm md:text-base">
            <i className="fa-solid fa-plus"></i> إضافة مجموعة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><i className="fa-solid fa-circle-notch animate-spin text-3xl text-brand"></i></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2">
          {filtered.map(g => (
            <div key={g.id} className="card p-8 md:p-10 rounded-[32px] md:rounded-[48px] group bg-white dark:bg-black border-gray-100 dark:border-zinc-900 hover:border-brand transition-all relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 dark:bg-zinc-900 rounded-2xl md:rounded-3xl flex items-center justify-center text-brand text-2xl md:text-3xl shadow-inner">
                  <i className="fa-solid fa-users-rectangle"></i>
                </div>
                {/* Actions always visible */}
                <div className="flex gap-2">
                  <button onClick={() => { setForm(g); setShowModal(true); }} className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-xl hover:text-brand transition-colors"><i className="fa-solid fa-edit text-xs"></i></button>
                  <button onClick={() => del(g.id)} className="w-8 h-8 md:w-10 md:h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><i className="fa-solid fa-trash text-xs"></i></button>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 truncate">{g.name}</h3>
              <p className="text-gray-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest truncate">{g.days.join(' - ')} | {g.time}</p>
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-50 dark:border-zinc-900 flex justify-between items-center">
                <span className="text-main dark:text-brand font-black text-xl md:text-2xl tracking-tighter">{g.price} ج.م</span>
                <button 
                  onClick={() => navigate(`/groups/${g.id}/attendance`)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-black dark:bg-zinc-900 text-brand rounded-xl md:rounded-2xl flex items-center gap-2 hover:bg-brand hover:text-black transition-all font-black text-xs md:text-sm shadow-md"
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  الحضور
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold">لم يتم العثور على مجموعات</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[32px] md:rounded-[48px] p-8 md:p-12 space-y-4 md:space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white">بيانات المجموعة</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">اسم المجموعة</label>
                <input type="text" placeholder="أدخل الاسم" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none focus:border-brand border border-transparent text-black dark:text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">سعر الحصة (بالجنيه)</label>
                <input type="number" placeholder="0" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none focus:border-brand border border-transparent text-black dark:text-white" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">الأيام (مثال: الأحد - الثلاثاء)</label>
                <input type="text" placeholder="الأحد - الثلاثاء" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none focus:border-brand border border-transparent text-center text-black dark:text-white" value={form.days?.join(' - ')} onChange={e => setForm({...form, days: e.target.value.split(' - ')})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">الوقت (مثال: 04:00 م)</label>
                <input type="text" placeholder="04:00 م" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none focus:border-brand border border-transparent text-center text-black dark:text-white" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button type="submit" className="flex-1 bg-brand text-black py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-base md:text-lg shadow-xl shadow-brand/10 transition-transform active:scale-95">حفظ</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-black py-4 md:py-5 rounded-2xl md:rounded-3xl font-bold text-sm">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Groups;
