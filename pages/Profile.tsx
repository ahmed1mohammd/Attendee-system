
import React, { useState } from 'react';
import { User } from '../types';
import { ApiClient } from '../services/apiClient';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [form, setForm] = useState<User>({ ...user, password: user.password || '' });
  const [msg, setMsg] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update the user profile via API using the existing ApiClient
      const updatedUser = await ApiClient.put<User>(`/users/${user.id}`, form);
      // Fallback to form data if API response doesn't return the object
      const finalUser = updatedUser || form;
      
      onUpdate(finalUser);
      setMsg('تم حفظ التغييرات بنجاح');
      setTimeout(() => setMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تحديث البيانات');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fadeIn font-['Cairo']">
      <div className="text-center">
        <div className="w-28 h-28 bg-main rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-2xl text-white text-5xl font-black border-4 border-brand/20">
          {user.name[0]}
        </div>
        <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">{user.name}</h2>
        <p className="text-brand font-bold text-xs uppercase tracking-[0.3em] mt-2">{user.role}</p>
      </div>

      <form onSubmit={save} className="card p-10 rounded-[48px] space-y-8 border-gray-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">الاسم بالكامل</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl outline-none text-black dark:text-white font-bold focus:border-brand transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">رقم الهاتف</label>
            <input type="tel" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl outline-none text-black dark:text-white font-bold focus:border-brand transition-all text-center" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">اسم المستخدم للنظام</label>
          <input type="text" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl outline-none text-black dark:text-white font-bold focus:border-brand transition-all" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">تعديل كلمة المرور</label>
          <input type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl outline-none text-black dark:text-white font-bold focus:border-brand transition-all text-center" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>

        {msg && <div className="p-4 bg-brand/10 text-brand rounded-2xl text-center text-xs font-black animate-pulse">{msg}</div>}

        <button type="submit" className="w-full bg-black dark:bg-brand text-white dark:text-black py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-brand dark:hover:bg-white transition-all">
          تحديث البيانات الشخصية
        </button>
      </form>
    </div>
  );
};

export default Profile;
