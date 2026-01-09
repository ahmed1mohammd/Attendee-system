
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiClient } from '../services/apiClient';
import { Group } from '../types';

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

  const filtered = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-black dark:text-white">المجموعات الدراسية</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" placeholder="بحث عن مجموعة..." 
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 pr-12 rounded-3xl outline-none font-bold text-sm shadow-sm"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <i className="fa-solid fa-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button onClick={() => { setForm({ name: '', price: 0, time: '', days: [] }); setShowModal(true); }} className="bg-brand text-black px-8 py-4 rounded-3xl font-black shadow-lg shadow-brand/10 hover:bg-black hover:text-brand transition-all flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> إضافة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><i className="fa-solid fa-circle-notch animate-spin text-3xl text-brand"></i></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(g => (
            <div key={g.id} className="card p-10 rounded-[48px] group bg-white dark:bg-black border-gray-100 dark:border-zinc-900 hover:border-brand transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center text-brand text-3xl">
                  <i className="fa-solid fa-users-rectangle"></i>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setForm(g); setShowModal(true); }} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:text-brand"><i className="fa-solid fa-edit"></i></button>
                  <button onClick={() => del(g.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white mb-2">{g.name}</h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{g.days.join(' - ')} | {g.time}</p>
              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-zinc-900 flex justify-between items-center">
                <span className="text-main dark:text-brand font-black text-2xl">{g.price} ج.م</span>
                <button 
                  onClick={() => navigate(`/groups/${g.id}/attendance`)}
                  className="px-6 py-3 bg-black dark:bg-zinc-900 text-brand rounded-2xl flex items-center gap-2 hover:bg-brand hover:text-black transition-all font-black text-sm"
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  الحضور
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={save} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[48px] p-12 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black">بيانات المجموعة</h3>
            <div className="space-y-4">
              <input type="text" placeholder="اسم المجموعة" required className="w-full bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input type="number" placeholder="سعر الحصة" required className="w-full bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
              <input type="text" placeholder="المواعيد (الأحد - الثلاثاء)" required className="w-full bg-gray-50 dark:bg-zinc-900 p-5 rounded-2xl font-bold" value={form.days?.join(' - ')} onChange={e => setForm({...form, days: e.target.value.split(' - ')})} />
              <input type="text" placeholder="الوقت (04:00 م)" required className="w-full bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
            </div>
            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-1 bg-brand text-black py-5 rounded-3xl font-black">حفظ</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-black py-5 rounded-3xl font-bold">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Groups;
