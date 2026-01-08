
import React, { useState } from 'react';
import { Group } from '../types';

const Groups: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'مجموعة النوابغ - ثانوي', schedule: ['الاثنين', 'الخميس'], lecturePrice: 100 },
    { id: '2', name: 'مجموعة المبدعين - إعدادي', schedule: ['الأحد', 'الأربعاء'], lecturePrice: 75 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-users-rectangle text-main"></i>
          إدارة المجموعات
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-main text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-second transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          إضافة مجموعة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-main/10 rounded-lg flex items-center justify-center text-main">
                <i className="fa-solid fa-user-group text-xl"></i>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-md"><i className="fa-solid fa-pen"></i></button>
                <button className="text-red-500 hover:bg-red-50 p-2 rounded-md"><i className="fa-solid fa-trash"></i></button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{group.name}</h3>
            
            <div className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-calendar-days w-5"></i>
                <span>المواعيد: {group.schedule.join(' - ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-money-bill w-5"></i>
                <span>سعر الحصة: {group.lecturePrice} ج.م</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-users w-5"></i>
                <span>عدد الطلاب: 45 طالب</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border border-main text-main rounded-lg hover:bg-main hover:text-white transition-all font-semibold">
              مشاهدة الطلاب
            </button>
          </div>
        ))}
      </div>

      {/* Simple Modal Simulation */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl w-full max-w-md p-8 shadow-2xl scale-in">
            <h3 className="text-2xl font-bold mb-6">إضافة مجموعة جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المجموعة</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-main outline-none" placeholder="مثال: مجموعة الفيزياء - الصف الثالث" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">أيام المحاضرات</label>
                <div className="grid grid-cols-2 gap-2">
                  {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map(day => (
                    <label key={day} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="accent-main" /> {day}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">تكلفة الحصة (ج.م)</label>
                <input type="number" className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-main outline-none" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-main text-white py-2 rounded-lg font-bold">حفظ</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 dark:bg-zinc-700 py-2 rounded-lg font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
