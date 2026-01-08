
import React, { useState } from 'react';
import { Student, Group, Transaction } from '../types';

interface AttendanceProps {
  students: Student[];
  groups: Group[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Attendance: React.FC<AttendanceProps> = ({ students, groups, setStudents, setTransactions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = students.find(s => s.phone === searchQuery || s.id === searchQuery || s.qrCode === searchQuery);
    if (found) {
      setActiveStudent(found);
      setMessage(null);
    } else {
      setMessage({ text: 'عفواً، لم يتم العثور على الطالب', type: 'error' });
      setActiveStudent(null);
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      setActiveStudent(randomStudent);
      setIsScanning(false);
      setMessage({ text: 'تم فحص الكود بنجاح', type: 'success' });
    }, 1500);
  };

  const confirmAttendance = () => {
    if (!activeStudent) return;
    
    const group = groups.find(g => g.id === activeStudent.groupId);
    const amount = group?.price || 0;

    // 1. Create Transaction
    const newTransaction: Transaction = {
      id: 't' + Date.now(),
      studentName: activeStudent.name,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      groupName: group?.name || 'غير معروف'
    };

    // 2. Update Global States
    setTransactions(prev => [newTransaction, ...prev]);
    setStudents(prev => prev.map(s => 
      s.id === activeStudent.id 
        ? { ...s, attendanceCount: s.attendanceCount + 1, isPaid: true } 
        : s
    ));

    setMessage({ text: `تم تسجيل حضور ${activeStudent.name} ودفع مبلغ ${amount} ج.م بنجاح!`, type: 'success' });
    
    setTimeout(() => {
      setActiveStudent(null);
      setSearchQuery('');
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center">
         <h2 className="text-4xl font-black text-main mb-2">تسجيل حضور المحاضرة</h2>
         <p className="text-gray-500 font-bold">تسجيل الحضور يقوم تلقائياً بخصم تكلفة الحصة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         <div className="card bg-white dark:bg-zinc-900 border-0 shadow-2xl p-8 text-center space-y-6">
            <h3 className="text-xl font-bold border-b dark:border-zinc-800 pb-4">جهاز الفحص الضوئي (QR)</h3>
            <div className={`relative w-64 h-64 mx-auto border-4 border-dashed rounded-[40px] flex items-center justify-center transition-all ${isScanning ? 'border-main scale-105' : 'border-gray-200'}`}>
               {isScanning && (
                 <div className="absolute inset-0 bg-main/5 animate-pulse overflow-hidden rounded-[40px]">
                    <div className="w-full h-1.5 bg-main absolute top-0 animate-scan"></div>
                 </div>
               )}
               <i className={`fa-solid fa-qrcode text-8xl ${isScanning ? 'text-main' : 'text-gray-200'}`}></i>
            </div>
            <button 
              onClick={simulateScan}
              disabled={isScanning}
              className="w-full py-4 bg-main text-white rounded-2xl font-black text-lg shadow-xl shadow-main/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {isScanning ? 'جاري الفحص...' : 'تشغيل الكاميرا للفحص'}
            </button>
         </div>

         <div className="space-y-6">
            <div className="card bg-white dark:bg-zinc-900 border-0 shadow-2xl p-8">
               <h3 className="text-xl font-bold mb-6">بحث يدوي سريع</h3>
               <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                     <input 
                       type="text" 
                       className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-5 rounded-2xl text-xl font-bold outline-none focus:ring-4 focus:ring-main/10 pr-14"
                       placeholder="رقم الموبايل أو كود الطالب..."
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                     />
                     <i className="fa-solid fa-magnifying-glass absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                  </div>
                  <button className="w-full py-4 bg-zinc-800 dark:bg-zinc-700 text-white rounded-2xl font-bold shadow-lg">تحقق من الكود</button>
               </form>

               {message && (
                 <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    <i className={`fa-solid ${message.type === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'}`}></i>
                    {message.text}
                 </div>
               )}
            </div>

            {activeStudent && (
               <div className="card bg-white dark:bg-zinc-900 border-0 shadow-2xl p-6 border-r-8 border-main animate-slideUp">
                  <div className="flex items-start gap-6">
                     <div className="w-20 h-20 rounded-2xl bg-main/10 flex items-center justify-center text-main text-3xl font-black">
                        {activeStudent.name[0]}
                     </div>
                     <div className="flex-1">
                        <h4 className="text-2xl font-black mb-1">{activeStudent.name}</h4>
                        <p className="text-gray-500 font-bold mb-4">{groups.find(g => g.id === activeStudent.groupId)?.name}</p>
                        
                        <div className="flex flex-wrap gap-2">
                           <span className={`px-4 py-1 rounded-full text-xs font-bold ${activeStudent.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/20 text-red-600 animate-pulse'}`}>
                              {activeStudent.isPaid ? 'الحساب: مدفوع مسبقاً' : 'الحساب: سيتم تحصيل الرسوم'}
                           </span>
                           <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">
                              الحضور التراكمي: {activeStudent.attendanceCount}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                     <button onClick={confirmAttendance} className="bg-main text-white py-4 rounded-2xl font-black shadow-lg">تأكيد الحضور والدفع</button>
                     <button onClick={() => setActiveStudent(null)} className="bg-gray-100 dark:bg-zinc-800 py-4 rounded-2xl font-bold text-gray-500">إلغاء</button>
                  </div>
               </div>
            )}
         </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Attendance;
