
import React, { useState, useMemo } from 'react';
import { Exam, Group, Student } from '../types';

interface ExamsProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  groups: Group[];
  students: Student[];
}

const Exams: React.FC<ExamsProps> = ({ exams, setExams, groups, students }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'scores' | 'report'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examScores, setExamScores] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtering students for the selected exam's group
  const examStudents = useMemo(() => {
    if (!selectedExam) return [];
    return students.filter(s => s.groupId === selectedExam.groupId);
  }, [selectedExam, students]);

  const handleOpenScores = (exam: Exam) => {
    setSelectedExam(exam);
    // In a real app, you'd fetch existing scores here
    setActiveTab('scores');
    setSaveSuccess(false);
  };

  const handleOpenReport = (exam: Exam) => {
    setSelectedExam(exam);
    setActiveTab('report');
  };

  const handleScoreChange = (studentId: string, value: string) => {
    setExamScores(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSaveScores = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const calculateStats = () => {
    const scores = Object.values(examScores).map(s => parseFloat(s)).filter(s => !isNaN(s));
    if (scores.length === 0) return { avg: 0, high: 0, low: 0 };
    const sum = scores.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / scores.length).toFixed(1),
      high: Math.max(...scores),
      low: Math.min(...scores)
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Tabs - Hidden during print */}
      <div className="no-print space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-file-signature text-main"></i>
            إدارة الامتحانات والنتائج
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
      </div>

      {/* Main Content Area */}
      <div id="print-section">
        {activeTab === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
            {exams.map(exam => (
              <div key={exam.id} className="card p-6 bg-white dark:bg-zinc-800 border-0 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">سجل امتحان</span>
                    <span className="text-xs text-gray-500">{exam.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{exam.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 font-semibold">
                    المجموعة: {groups.find(g => g.id === exam.groupId)?.name}
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-gray-50 dark:bg-zinc-700 p-2 rounded-xl text-center min-w-[70px]">
                      <p className="text-lg font-black text-main dark:text-second">{exam.maxScore}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">الدرجة النهائية</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-700 p-2 rounded-xl text-center min-w-[70px]">
                      <p className="text-lg font-black text-blue-500">
                        {students.filter(s => s.groupId === exam.groupId).length}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">طلاب المجموعة</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <button 
                    onClick={() => handleOpenScores(exam)}
                    className="bg-main text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-second transition-all shadow-lg shadow-main/10 flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-pen-nib"></i>
                    رصد الدرجات
                  </button>
                  <button 
                    onClick={() => handleOpenReport(exam)}
                    className="border border-main text-main px-4 py-3 rounded-xl text-sm font-bold hover:bg-main hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-chart-bar"></i>
                    التقرير والتحليل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="card p-8 bg-white dark:bg-zinc-900 border-0 shadow-2xl max-w-2xl mx-auto no-print">
            <h3 className="text-2xl font-black mb-8 text-main">إنشاء سجل امتحان جديد</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold pr-2">اسم الامتحان</label>
                  <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all font-bold" placeholder="مثال: اختبار فيزياء دوري" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold pr-2">المجموعة المستهدفة</label>
                  <select className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all font-bold appearance-none">
                    <option value="">اختر المجموعة...</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold pr-2">الدرجة النهائية</label>
                    <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all font-bold text-center" defaultValue={100} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold pr-2">تاريخ الامتحان</label>
                    <input type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all font-bold text-center" defaultValue={new Date().toISOString().split('T')[0]} />
                 </div>
              </div>
              <div className="pt-6">
                 <button className="w-full bg-main text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-main/20 hover:scale-[1.01] transition-all">فتح سجل الرصد</button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'scores' || activeTab === 'report') && selectedExam && (
          <div className="animate-slideUp space-y-6">
             {/* Print Header */}
             <div className="hidden print:block text-center border-b-2 border-main pb-6 mb-8">
                <img src="https://ro-s.net/img/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
                <h1 className="text-3xl font-black">تقرير نتائج الطلاب</h1>
                <p className="text-lg font-bold text-gray-600 mt-2">
                   {selectedExam.name} - مجموعة: {groups.find(g => g.id === selectedExam.groupId)?.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">تاريخ التصدير: {new Date().toLocaleDateString('ar-EG')}</p>
             </div>

             {/* UI Navigation Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => setActiveTab('list')}
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 hover:text-main transition-colors"
                   >
                      <i className="fa-solid fa-arrow-right"></i>
                   </button>
                   <div>
                      <h3 className="text-2xl font-black">{activeTab === 'scores' ? 'رصد درجات الطلاب' : 'تقرير النتائج'}</h3>
                      <p className="text-sm text-gray-500 font-bold">{selectedExam.name} - {groups.find(g => g.id === selectedExam.groupId)?.name}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={handleExportPDF}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all"
                   >
                      <i className="fa-solid fa-file-pdf"></i>
                      تصدير كـ PDF
                   </button>
                   {activeTab === 'scores' && (
                     <button 
                       onClick={handleSaveScores}
                       disabled={isSaving}
                       className={`relative px-8 py-3 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2 ${saveSuccess ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-main text-white shadow-main/20 hover:bg-second'}`}
                     >
                        {isSaving ? (
                          <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : saveSuccess ? (
                          <i className="fa-solid fa-check-double"></i>
                        ) : (
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                        )}
                        {saveSuccess ? 'تم الحفظ بنجاح' : isSaving ? 'جاري الحفظ...' : 'حفظ درجات الطلاب'}
                     </button>
                   )}
                </div>
             </div>

             {/* Statistics Cards for Report Tab */}
             {activeTab === 'report' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                   <div className="card bg-main text-white p-6 border-0 shadow-xl">
                      <p className="text-sm opacity-80 font-bold mb-1">متوسط الدرجات</p>
                      <h4 className="text-4xl font-black">{stats.avg} <span className="text-sm font-normal">/ {selectedExam.maxScore}</span></h4>
                   </div>
                   <div className="card bg-green-500 text-white p-6 border-0 shadow-xl">
                      <p className="text-sm opacity-80 font-bold mb-1">أعلى درجة</p>
                      <h4 className="text-4xl font-black">{stats.high}</h4>
                   </div>
                   <div className="card bg-red-500 text-white p-6 border-0 shadow-xl">
                      <p className="text-sm opacity-80 font-bold mb-1">أقل درجة</p>
                      <h4 className="text-4xl font-black">{stats.low}</h4>
                   </div>
                </div>
             )}

             {/* Scores Table */}
             <div className="card bg-white dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden rounded-[30px]">
                <div className="overflow-x-auto">
                   <table className="w-full text-right border-collapse">
                      <thead>
                         <tr className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400">
                            <th className="py-5 px-8 font-black uppercase text-xs">كود الطالب</th>
                            <th className="py-5 px-8 font-black uppercase text-xs">اسم الطالب</th>
                            <th className="py-5 px-8 font-black uppercase text-xs text-center">الدرجة النهائية</th>
                            <th className="py-5 px-8 font-black uppercase text-xs text-center">الدرجة المحصلة</th>
                            <th className="py-5 px-8 font-black uppercase text-xs text-center">النسبة المئوية</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-zinc-800">
                         {examStudents.length === 0 ? (
                            <tr>
                               <td colSpan={5} className="py-20 text-center opacity-30">
                                  <i className="fa-solid fa-user-slash text-6xl mb-4"></i>
                                  <p className="text-xl font-bold">لا يوجد طلاب مسجلين في هذه المجموعة</p>
                               </td>
                            </tr>
                         ) : (
                            examStudents.map(student => {
                               const scoreVal = examScores[student.id] || "";
                               const currentScore = parseFloat(scoreVal) || 0;
                               const isInvalid = !isNaN(parseFloat(scoreVal)) && (currentScore > selectedExam.maxScore || currentScore < 0);
                               const percentage = ((currentScore / selectedExam.maxScore) * 100).toFixed(0);
                               
                               return (
                                  <tr key={student.id} className={`hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors ${isInvalid ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                                     <td className="py-5 px-8 font-mono font-black text-main dark:text-second">{student.id}</td>
                                     <td className="py-5 px-8">
                                        <div className="font-bold text-gray-800 dark:text-gray-200">{student.name}</div>
                                     </td>
                                     <td className="py-5 px-8 text-center font-bold text-gray-400">{selectedExam.maxScore}</td>
                                     <td className="py-5 px-8 text-center">
                                        {activeTab === 'scores' ? (
                                           <div className="relative inline-block">
                                              <input 
                                                 type="number" 
                                                 value={scoreVal}
                                                 onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                 className={`w-24 bg-gray-100 dark:bg-zinc-800 border-2 p-2 rounded-xl text-center font-black outline-none transition-all ${isInvalid ? 'border-red-500 ring-4 ring-red-500/10' : scoreVal !== "" ? 'border-main' : 'border-transparent focus:border-main'}`}
                                                 placeholder="0"
                                              />
                                              {isInvalid && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] animate-bounce shadow-lg">
                                                   <i className="fa-solid fa-exclamation"></i>
                                                </div>
                                              )}
                                           </div>
                                        ) : (
                                           <span className={`text-xl font-black ${currentScore >= selectedExam.maxScore * 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                                              {currentScore}
                                           </span>
                                        )}
                                     </td>
                                     <td className="py-5 px-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                           <div className="w-16 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden no-print">
                                              <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isInvalid ? 'bg-gray-300' : parseInt(percentage) >= 50 ? 'bg-green-500' : 'bg-red-500'}`} 
                                                style={{ width: `${Math.min(Math.max(parseInt(percentage), 0), 100)}%` }}
                                              ></div>
                                           </div>
                                           <span className={`font-bold ${isInvalid ? 'text-red-500' : ''}`}>{percentage}%</span>
                                        </div>
                                     </td>
                                  </tr>
                                );
                            })
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
             
             {/* Print Footer Only */}
             <div className="hidden print:block text-left mt-10 pt-6 border-t border-gray-100 italic text-gray-400">
                <p>نظام إدارة الطلاب الذكي - مع تحياتنا لطلابنا المتفوقين</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
