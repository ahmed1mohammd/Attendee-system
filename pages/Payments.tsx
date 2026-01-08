
import React, { useState, useMemo } from 'react';
import { Student, Transaction } from '../types';

interface PaymentsProps {
  students: Student[];
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Payments: React.FC<PaymentsProps> = ({ students, transactions, setTransactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalIncomeThisMonth = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const studentsNotPaidCount = students.filter(s => !s.isPaid).length;

  // Filter logic for searching by name or phone
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const student = students.find(s => s.name === t.studentName);
      const phoneMatch = student ? student.phone.includes(searchTerm) : false;
      const nameMatch = t.studentName.includes(searchTerm);
      return nameMatch || phoneMatch;
    });
  }, [transactions, searchTerm, students]);

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Print View Header */}
      <div className="hidden print:block text-center border-b-4 border-main pb-8 mb-10">
         <img src="https://ro-s.net/img/logo.png" alt="Logo" className="h-20 mx-auto mb-4" />
         <h1 className="text-4xl font-black">تقرير السجلات المالية والتحصيلات</h1>
         <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-gray-50 rounded-2xl border">
               <p className="text-xs text-gray-500 font-bold uppercase mb-1">إجمالي الإيرادات</p>
               <p className="text-2xl font-black text-main">{totalIncomeThisMonth} ج.م</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border">
               <p className="text-xs text-gray-500 font-bold uppercase mb-1">عدد المعاملات</p>
               <p className="text-2xl font-black text-main">{filteredTransactions.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border">
               <p className="text-xs text-gray-500 font-bold uppercase mb-1">تاريخ التقرير</p>
               <p className="text-2xl font-black text-main">{new Date().toLocaleDateString('ar-EG')}</p>
            </div>
         </div>
      </div>

      <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-sack-dollar text-main"></i>
            السجلات المالية والمدفوعات
          </h2>
          <p className="text-gray-500 font-semibold text-sm">يتم تسجيل الدفع تلقائياً عند تسجيل حضور الطالب</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleDownloadReport}
             className="bg-main text-white px-8 py-3 rounded-2xl shadow-lg shadow-main/20 flex items-center gap-3 hover:scale-105 transition-all font-black"
           >
              <i className="fa-solid fa-print"></i>
              تحميل التقرير (PDF)
           </button>
        </div>
      </div>

      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card p-6 bg-gradient-to-br from-main to-second text-white border-0 shadow-2xl">
            <p className="opacity-80 text-sm mb-1 font-bold">إجمالي الدخل المحصل</p>
            <h3 className="text-4xl font-black">{totalIncomeThisMonth.toLocaleString()} <span className="text-lg">ج.م</span></h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] bg-white/20 w-fit px-3 py-1.5 rounded-full font-black">
               <i className="fa-solid fa-sync fa-spin"></i>
               <span>تحديث فوري للسجلات</span>
            </div>
         </div>
         <div className="card p-6 bg-white dark:bg-zinc-900 border-0 shadow-xl">
            <p className="text-gray-500 text-sm mb-1 font-bold">معاملات الحضور اليوم</p>
            <h3 className="text-4xl font-black text-main dark:text-second">{transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length} <span className="text-lg">عملية</span></h3>
            <p className="text-xs text-gray-400 mt-2">عن كافة المجموعات</p>
         </div>
         <div className="card p-6 bg-white dark:bg-zinc-900 border-0 shadow-xl">
            <p className="text-gray-500 text-sm mb-1 font-bold">طلاب لم يتم تحصيلهم</p>
            <h3 className="text-4xl font-black text-red-500">{studentsNotPaidCount}</h3>
            <p className="text-xs text-gray-400 mt-2 text-red-400">يرجى مراجعة كشف الحضور</p>
         </div>
      </div>

      <div id="print-section" className="card p-6 bg-white dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden rounded-[30px]">
        <div className="no-print flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
           <h3 className="font-black text-xl">سجل العمليات التفصيلي</h3>
           <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو رقم الهاتف..." 
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-zinc-800 text-sm font-bold outline-none focus:ring-4 focus:ring-main/10 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 border-b dark:border-zinc-700">
                <th className="py-5 px-6 font-black uppercase text-xs">كود المعاملة</th>
                <th className="py-5 px-6 font-black uppercase text-xs">الطالب / الموبايل</th>
                <th className="py-5 px-6 font-black uppercase text-xs">المجموعة</th>
                <th className="py-5 px-6 font-black uppercase text-xs">التاريخ</th>
                <th className="py-5 px-6 font-black uppercase text-xs text-center">المبلغ</th>
                <th className="py-5 px-6 font-black uppercase text-xs text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {filteredTransactions.map(t => {
                const student = students.find(s => s.name === t.studentName);
                return (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-5 px-6 font-mono text-xs text-gray-400">{t.id}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-main/10 flex items-center justify-center text-main font-black">
                          {t.studentName[0]}
                        </div>
                        <div>
                          <p className="font-black text-sm">{t.studentName}</p>
                          <p className="text-[10px] text-gray-500 font-bold">{student?.phone || 'بدون رقم'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm font-bold text-gray-600 dark:text-gray-400">{t.groupName}</td>
                    <td className="py-5 px-6 text-sm font-mono text-gray-500">{t.date}</td>
                    <td className="py-5 px-6 text-center">
                       <span className="font-black text-main dark:text-second text-lg">{t.amount} <span className="text-[10px]">ج.م</span></span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                         <i className="fa-solid fa-check-circle ml-1"></i>
                         تم التحصيل
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400 opacity-30">
                     <i className="fa-solid fa-receipt text-6xl mb-4"></i>
                     <p className="text-xl font-bold">لا توجد سجلات مالية مطابقة للبحث</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Print Footer Only */}
      <div className="hidden print:block text-left mt-10 pt-6 border-t border-gray-100 italic text-gray-400">
         <p>تم استخراج هذا التقرير آلياً من نظام إدارة الطلاب الذكي - {new Date().toLocaleTimeString('ar-EG')}</p>
      </div>
    </div>
  );
};

export default Payments;
