
import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../services/apiClient';
import { User } from '../types';
import SearchBar from '../components/SearchBar';

const Users: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<User>>({ name: '', username: '', phone: '', role: 'Manager', password: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<User[]>('/users');
      setAdmins(data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search by Full Name ONLY
  const filtered = useMemo(() => {
    return admins.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  }, [admins, search]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) {
        await ApiClient.put(`/users/${form.id}`, form);
      } else {
        await ApiClient.post('/users', form);
      }
      setShowModal(false);
      setForm({ name: '', username: '', phone: '', role: 'Manager', password: '' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المسؤول؟')) return;
    try {
      await ApiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-3xl"></i></div>;

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-black dark:text-white">إدارة المسؤولين</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchBar 
            value={search}
            onChange={setSearch}
            placeholder="ابحث باسم المسؤول..."
            className="w-full md:w-64"
          />
          <button onClick={() => { setForm({ name: '', username: '', phone: '', role: 'Manager', password: '' }); setShowModal(true); }} className="bg-main dark:bg-brand text-white dark:text-black px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
            <i className="fa-solid fa-user-shield"></i> إضافة مسؤول
          </button>
        </div>
      </div>

      <div className="card overflow-hidden rounded-[32px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-zinc-900">
                <th className="p-6 text-right">الاسم</th>
                <th className="p-6 text-right">اسم المستخدم</th>
                <th className="p-6 text-right">الصلاحية</th>
                <th className="p-6 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 group transition-all">
                  <td className="p-6 font-bold text-black dark:text-white text-right">{u.name}</td>
                  <td className="p-6 text-gray-500 font-mono text-xs text-right">{u.username}</td>
                  <td className="p-6 text-right">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${u.role === 'Admin' ? 'bg-brand/10 text-brand' : 'bg-blue-100 text-blue-600'}`}>{u.role}</span>
                  </td>
                  <td className="p-6 text-center">
                    {/* Actions always visible */}
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setForm(u); setShowModal(true); }} className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg hover:text-brand transition-all"><i className="fa-solid fa-edit"></i></button>
                      <button onClick={() => del(u.id)} className="w-9 h-9 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={save} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] p-10 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black text-black dark:text-white">بيانات المسؤول</h3>
            <div className="space-y-4">
              <input type="text" placeholder="الاسم" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-black dark:text-white border border-transparent focus:border-brand" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input type="text" placeholder="اسم المستخدم" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-black dark:text-white border border-transparent focus:border-brand" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
              <input type="password" placeholder="كلمة المرور" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-black dark:text-white border border-transparent focus:border-brand" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              <select className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-black dark:text-white border border-transparent focus:border-brand" value={form.role} onChange={e => setForm({...form, role: e.target.value as any})}>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-main dark:bg-brand text-white dark:text-black py-4 rounded-2xl font-black shadow-lg">حفظ</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 rounded-2xl text-black font-bold">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
