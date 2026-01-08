
import React, { useState } from 'react';

const Attendance: React.FC = () => {
  const [searchType, setSearchType] = useState<'qr' | 'manual'>('qr');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<any>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedStudent({
        name: 'كريم محمود يوسف',
        id: '12345',
        group: 'مجموعة الأحد 4م',
        status: 'مُسجل مسبقاً'
      });
    }, 1500);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setScannedStudent({
      name: 'سارة أحمد كمال',
      id: searchQuery,
      group: 'مجموعة الأربعاء 6م',
      status: 'حضور'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">تسجيل حضور الطلاب</h2>
        <p className="text-gray-500">اختر طريقة التسجيل المناسبة (QR أو بحث يدوي)</p>
      </div>

      <div className="flex justify-center p-1 bg-gray-200 dark:bg-zinc-800 rounded-xl w-fit mx-auto">
        <button 
          onClick={() => setSearchType('qr')}
          className={`px-8 py-2 rounded-lg transition-all ${searchType === 'qr' ? 'bg-main text-white shadow-md' : 'text-gray-500'}`}
        >
          <i className="fa-solid fa-qrcode ml-2"></i>
          فحص QR
        </button>
        <button 
          onClick={() => setSearchType('manual')}
          className={`px-8 py-2 rounded-lg transition-all ${searchType === 'manual' ? 'bg-main text-white shadow-md' : 'text-gray-500'}`}
        >
          <i className="fa-solid fa-magnifying-glass ml-2"></i>
          بحث يدوي
        </button>
      </div>

      <div className="card p-8 bg-white dark:bg-zinc-800 border-0 shadow-lg text-center">
        {searchType === 'qr' ? (
          <div className="space-y-6">
            <div className={`w-64 h-64 mx-auto border-4 border-dashed rounded-3xl flex items-center justify-center relative overflow-hidden transition-all ${isScanning ? 'border-main' : 'border-gray-300'}`}>
              {isScanning && (
                <div className="absolute inset-0 bg-main/10 animate-pulse flex items-center justify-center">
                   <div className="w-full h-1 bg-main absolute top-0 animate-scan"></div>
                </div>
              )}
              <i className={`fa-solid fa-qrcode text-8xl ${isScanning ? 'text-main' : 'text-gray-200'}`}></i>
            </div>
            
            <button 
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="bg-main text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-second disabled:opacity-50 transition-all"
            >
              {isScanning ? 'جاري الفحص...' : 'بدء فحص الكود'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualSearch} className="max-w-md mx-auto space-y-4">
             <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-main outline-none text-center text-xl"
                  placeholder="ادخل رقم الموبايل أو كود الطالب"
                />
                <i className="fa-solid fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
             </div>
             <button className="w-full bg-main text-white py-4 rounded-xl font-bold text-lg shadow-lg">تحقق من البيانات</button>
          </form>
        )}
      </div>

      {scannedStudent && (
        <div className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-xl border-r-4 border-r-main animate-slideUp">
           <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-main text-4xl">
                 <i className="fa-solid fa-user-check"></i>
              </div>
              <div className="flex-1 text-center md:text-right">
                 <h3 className="text-2xl font-bold mb-1">{scannedStudent.name}</h3>
                 <p className="text-gray-500 mb-2">رقم التعريف: {scannedStudent.id} | {scannedStudent.group}</p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">تم تسجيل الحضور</span>
                    <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">مدفوع: 100 ج.م</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">إلغاء</button>
                 <button onClick={() => setScannedStudent(null)} className="bg-main text-white px-6 py-2 rounded-lg font-bold">تم</button>
              </div>
           </div>
        </div>
      )}

      {/* Style for QR scanning animation */}
      <style>{`
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Attendance;
