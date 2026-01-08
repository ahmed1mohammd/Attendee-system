
import React, { useState } from 'react';

const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-sack-dollar text-main"></i>
            السجلات المالية والمدفوعات
          </h2>
          <p className="text-gray-500">تتبع تحصيلات الحصص والاشتراكات الشهرية</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg border dark:border-zinc-700 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <i className="fa-solid fa-download"></i>
              تحميل التقرير
           </button>
           <button className="bg-main text-white px-6 py-2 rounded-lg shadow-lg hover:bg-second transition-colors">
              تسجيل عملية دفع
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card p-6 bg-gradient-to-br from-main to-second text-white border-0">
            <p className="opacity-80 text-sm mb-1">إجمالي الدخل (هذا الشهر)</p>
            <h3 className="text-3xl font-bold">12,450.00 <span className="text-lg">ج.م</span></h3>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded">
               <i className="fa-solid fa-arrow-trend-up"></i>
               <span>زيادة 12% عن الشهر الماضي</span>
            </div>
         </div>
         <div className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">مدفوعات اليوم</p>
            <h3 className="text-3xl font-bold text-main">1,200 <span className="text-lg">ج.م</span></h3>
            <p className="text-xs text-gray-400 mt-2">عن 12 طالب</p>
         </div>
         <div className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">طلاب لم يدفعوا (اليوم)</p>
            <h3 className="text-3xl font-bold text-red-500">4</h3>
            <p className="text-xs text-gray-400 mt-2 text-red-400">يرجى المتابعة</p>
         </div>
      </div>

      <div className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
           <h3 className="font-bold text-lg">سجل العمليات الأخيرة</h3>
           <div className="flex gap-2">
              <input type="text" placeholder="ابحث عن طالب..." className="px-4 py-1 rounded-md border text-sm dark:bg-zinc-700 dark:border-zinc-600 outline-none focus:ring-1 focus:ring-main" />
           </div>
        </div>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr className="text-gray-500 border-b dark:border-zinc-700">
                <th className="py-3 px-2 text-right">الطالب</th>
                <th className="py-3 px-2 text-right">المجموعة</th>
                <th className="py-3 px-2 text-right">التاريخ</th>
                <th className="py-3 px-2 text-right">المبلغ</th>
                <th className="py-3 px-2 text-right">طريقة الدفع</th>
                <th className="py-3 px-2 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <tr key={i} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                        {i === 1 ? 'أ' : 'م'}
                      </div>
                      <span className="font-semibold">ياسين إبراهيم</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm">مجموعة السبت 10ص</td>
                  <td className="py-4 px-2 text-sm text-gray-500">24 ديسمبر - 12:45م</td>
                  <td className="py-4 px-2 font-bold">100 ج.م</td>
                  <td className="py-4 px-2 text-sm">كاش</td>
                  <td className="py-4 px-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">ناجح</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
