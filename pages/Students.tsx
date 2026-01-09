
import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';
import { Student, Group } from '../types';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Student>>({ name: '', phone: '', groupId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sData, gData] = await Promise.all([
        ApiClient.get<Student[]>('/students'),
        ApiClient.get<Group[]>('/groups')
      ]);
      setStudents(sData);
      setGroups(gData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) await ApiClient.put(`/students/${form.id}`, form);
      else await ApiClient.post('/students', form);
      setShowModal(false);
      fetchData();
    } catch (err: any) { alert(err.message); }
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
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-black dark:text-white">إدارة الطلاب</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <input 
              type="text" placeholder="بحث بالاسم أو رقم الهاتف..." 
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 pr-12 rounded-3xl outline-none font-bold text-sm shadow-sm"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <i className="fa-solid fa-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button onClick={() => { setForm({ name: '', phone: '', groupId: '' }); setShowModal(true); }} className="bg-brand text-black px-8 py-4 rounded-3xl font-black shadow-lg hover:bg-black hover:text-brand transition-all flex items-center gap-2">
            <i className="fa-solid fa-user-plus"></i> إضافة طالب
          </button>
        </div>
      </div>

      <div className="card overflow-hidden rounded-[48px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900 text-gray-500 font-black text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-zinc-800">
                <th className="p-8">الطالب</th>
                <th className="p-8">المجموعة</th>
                <th className="p-8">الهاتف</th>
                <th className="p-8 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-2xl"></i></td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
                  <td className="p-8">
                    <p className="font-black text-black dark:text-white text-lg">{s.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{s.qrCode}</p>
                  </td>
                  <td className="p-8">
                    <span className="bg-brand/10 text-brand px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                      {groups.find(g => g.id === s.groupId)?.name || 'عام'}
                    </span>
                  </td>
                  <td className="p-8 text-gray-500 font-mono font-bold">{s.phone}</td>
                  <td className="p-8 text-center">
                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setForm(s); setShowModal(true); }} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:text-brand"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => del(s.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={save} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[48px] p-12 space-y-6">
            <h3 className="text-2xl font-black">بيانات الطالب</h3>
            <div className="space-y-4">
              <input type="text" placeholder="الاسم بالكامل" required className="w-full bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input type="tel" placeholder="رقم الموبايل" required className="w-full bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              <select required className="w-full bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold outline-none" value={form.groupId} onChange={e => setForm({...form, groupId: e.target.value})}>
                <option value="">اختر المجموعة...</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
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

export default Students;
