
import React, { useState } from 'react';

const Students: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <i className="fa-solid fa-user-graduate text-main"></i>
          قائمة الطلاب المسجلين
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
              <input type="text" placeholder="بحث بالاسم أو الرقم..." className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-main outline-none" />
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
           </div>
           <button className="bg-main text-white px-6 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
              <i className="fa-solid fa-user-plus"></i>
              طالب جديد
           </button>
        </div>
      </div>

      <div className="card p-0 bg-white dark:bg-zinc-800 border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="bg-gray-50 dark:bg-zinc-700/50">
              <tr className="border-b dark:border-zinc-700">
                <th className="py-4 px-6 text-right">كود الطالب</th>
                <th className="py-4 px-6 text-right">الاسم بالكامل</th>
                <th className="py-4 px-6 text-right">رقم الموبايل</th>
                <th className="py-4 px-6 text-right">المجموعة الحالية</th>
                <th className="py-4 px-6 text-right">تاريخ التسجيل</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <tr key={i} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                  <td className="py-4 px-6 font-mono text-main font-bold">#2024-00{i}</td>
                  <td className="py-4 px-6 font-semibold">علي إبراهيم ممدوح الشامي</td>
                  <td className="py-4 px-6 text-sm">0101234567{i}</td>
                  <td className="py-4 px-6">
                     <span className="px-2 py-1 bg-main/10 text-main rounded text-xs font-bold">مجموعة النوابغ</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">12/05/2024</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-500 hover:bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-pen"></i></button>
                      <button className="text-orange-500 hover:bg-orange-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-qrcode"></i></button>
                      <button className="text-red-500 hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 flex items-center justify-between border-t dark:border-zinc-700">
           <span className="text-sm text-gray-500">عرض 10 من أصل 250 طالب</span>
           <div className="flex gap-1">
              <button className="p-2 border rounded hover:bg-gray-100 dark:bg-zinc-700 dark:border-zinc-600">السابق</button>
              <button className="px-4 py-2 bg-main text-white rounded">1</button>
              <button className="px-4 py-2 border rounded dark:bg-zinc-700 dark:border-zinc-600">2</button>
              <button className="px-4 py-2 border rounded dark:bg-zinc-700 dark:border-zinc-600">3</button>
              <button className="p-2 border rounded hover:bg-gray-100 dark:bg-zinc-700 dark:border-zinc-600">التالي</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
