
import React, { useState } from 'react';

const Exams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-file-signature text-main"></i>
          إدارة الامتحانات والدرجات
        </h2>
      </div>

      <div className="flex border-b dark:border-zinc-700">
        <button 
          onClick={() => setActiveTab('list')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'list' ? 'border-b-2 border-main text-main' : 'text-gray-500'}`}
        >
          قائمة الامتحانات
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === 'add' ? 'border-b-2 border-main text-main' : 'text-gray-500'}`}
        >
          إضافة امتحان جديد
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-bold uppercase">الفيزياء</span>
                  <span className="text-xs text-gray-500">20 ديسمبر 2024</span>
                </div>
                <h3 className="text-xl font-bold mb-1">اختبار الشهر - الوحدات الأولى</h3>
                <p className="text-sm text-gray-500 mb-4">المجموعة: مجموعة النوابغ (ثانوي)</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">50</p>
                    <p className="text-[10px] text-gray-400 uppercase">الدرجة الكلية</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-500">42</p>
                    <p className="text-[10px] text-gray-400 uppercase">تم الرفع</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-500">8</p>
                    <p className="text-[10px] text-gray-400 uppercase">متبقي</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button className="bg-main text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-second transition-colors">
                  رفع الدرجات يدوياً
                </button>
                <button className="border border-main text-main px-4 py-2 rounded-lg text-sm font-semibold hover:bg-main hover:text-white transition-all">
                  عرض التقرير الكامل
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 bg-white dark:bg-zinc-800 border-0 shadow-sm max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-6">إنشاء سجل امتحان جديد</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم الامتحان</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-main outline-none" placeholder="امتحان نصف الترم" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المجموعة</label>
                <select className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-main outline-none">
                  <option>اختر المجموعة...</option>
                  <option>مجموعة النوابغ</option>
                  <option>مجموعة المبدعين</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الدرجة النهائية</label>
              <input type="number" className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-main outline-none" defaultValue={100} />
            </div>
            <div className="pt-4">
               <button className="w-full bg-main text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-main/20 transition-all">بدء رصد الدرجات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
