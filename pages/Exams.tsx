
import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../services/apiClient';
import { Exam, Group, Student } from '../types';
import SearchBar from '../components/SearchBar';

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [gradingExam, setGradingExam] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState<Partial<Exam>>({ name: '', groupId: '', maxScore: 50, date: new Date().toISOString().split('T')[0] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eData, gData, sData] = await Promise.all([
        ApiClient.get<Exam[]>('/exams'),
        ApiClient.get<Group[]>('/groups'),
        ApiClient.get<Student[]>('/students')
      ]);
      setExams(eData || []);
      setGroups(gData || []);
      setStudents(sData || []);
    } catch (err) {
      console.error('Failed to fetch exams data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search by Exam Name ONLY
  const filtered = useMemo(() => {
    return exams.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  }, [exams, search]);

  const saveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.name || !examForm.groupId) return;
    
    try {
      if (examForm.id) {
        await ApiClient.put(`/exams/${examForm.id}`, examForm);
      } else {
        await ApiClient.post('/exams', examForm);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateScore = async (studentId: string, score: number) => {
    if (!gradingExam) return;
    const updatedScores = { ...gradingExam.scores, [studentId]: score };
    try {
      await ApiClient.put(`/exams/${gradingExam.id}`, { ...gradingExam, scores: updatedScores });
      setExams(prev => prev.map(ex => {
        if (ex.id === gradingExam.id) {
          return { ...ex, scores: updatedScores };
        }
        return ex;
      }));
      setGradingExam(prev => prev ? { ...prev, scores: updatedScores } : null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm('حذف الامتحان؟')) return;
    try {
      await ApiClient.delete(`/exams/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-3xl"></i></div>;

  if (gradingExam) {
    const groupStudents = students.filter(s => s.groupId === gradingExam.groupId);
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center gap-6 border-b border-gray-100 dark:border-zinc-900 pb-8">
          <button onClick={() => setGradingExam(null)} className="w-12 h-12 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-black dark:text-zinc-400 hover:text-brand transition-all">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <div>
            <h2 className="text-xl md:text-3xl font-black text-black dark:text-white">رصد درجات: {gradingExam.name}</h2>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mt-1">الدرجة النهائية: {gradingExam.maxScore}</p>
          </div>
        </div>
        <div className="card overflow-x-auto rounded-[32px] border-gray-100 dark:border-zinc-900 bg-white dark:bg-black">
          <table className="w-full text-right min-w-[300px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-zinc-900">
                <th className="p-6 text-right">اسم الطالب</th>
                <th className="p-6 text-center">الدرجة المستحقة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
              {groupStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20">
                  <td className="p-6 font-bold text-black dark:text-white text-right">{s.name}</td>
                  <td className="p-6 text-center">
                    <input 
                      type="number" 
                      className="w-20 md:w-24 bg-gray-100 dark:bg-black border border-gray-200 dark:border-zinc-800 p-2 rounded-xl text-center font-black text-brand outline-none focus:border-brand"
                      value={gradingExam.scores[s.id] || 0}
                      onChange={e => updateScore(s.id, Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
              {groupStudents.length === 0 && (
                <tr><td colSpan={2} className="p-10 text-center text-gray-400 italic font-bold">لا يوجد طلاب في هذه المجموعة</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-2">
        <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white">الامتحانات</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchBar 
            value={search}
            onChange={setSearch}
            placeholder="ابحث باسم الامتحان..."
            className="flex-1 md:w-64"
          />
          <button 
            onClick={() => { setExamForm({ name: '', groupId: '', maxScore: 50, date: new Date().toISOString().split('T')[0] }); setShowModal(true); }} 
            className="w-full sm:w-auto bg-main dark:bg-brand text-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand/10 transition-transform active:scale-95"
          >
            <i className="fa-solid fa-file-signature"></i> إضافة امتحان
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-2">
        {filtered.map(ex => (
          <div key={ex.id} className="card p-6 md:p-8 rounded-[32px] border-gray-100 dark:border-zinc-900 shadow-sm relative overflow-hidden group bg-white dark:bg-black">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">EXAM LOG</span>
              {/* Actions always visible */}
              <div className="flex gap-2">
                <button onClick={() => { setExamForm(ex); setShowModal(true); }} className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg hover:text-brand transition-all"><i className="fa-solid fa-edit text-xs"></i></button>
                <button onClick={() => del(ex.id)} className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash text-xs"></i></button>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 truncate text-right">{ex.name}</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase truncate text-right">المجموعة: {groups.find(g => g.id === ex.groupId)?.name || 'غير معروفة'}</p>
            <div className="mt-8 flex items-center justify-between">
              <div className="text-center bg-gray-50 dark:bg-zinc-900 px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <p className="text-xl md:text-2xl font-black text-brand tracking-tighter">{ex.maxScore}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">النهائية</p>
              </div>
              <button onClick={() => setGradingExam(ex)} className="bg-black dark:bg-zinc-900 text-white dark:text-brand border border-transparent dark:border-brand/20 px-5 py-3 md:px-6 md:py-4 rounded-2xl font-black text-xs md:text-sm hover:scale-[1.02] transition-transform shadow-lg">رصد الدرجات</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">لا توجد امتحانات مسجلة</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={saveExam} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] p-8 md:p-10 space-y-4 md:space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-4">بيانات الامتحان</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">اسم الامتحان</label>
                <input type="text" placeholder="مثلاً: اختبار أكتوبر" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm focus:border-brand border border-transparent text-black dark:text-white" value={examForm.name} onChange={e => setExamForm({...examForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">المجموعة المستهدفة</label>
                <select className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm focus:border-brand border border-transparent text-black dark:text-white" value={examForm.groupId} onChange={e => setExamForm({...examForm, groupId: e.target.value})}>
                  <option value="">اختر المجموعة...</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">الدرجة النهائية</label>
                <input type="number" placeholder="50" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm focus:border-brand border border-transparent text-black dark:text-white" value={examForm.maxScore} onChange={e => setExamForm({...examForm, maxScore: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">تاريخ الامتحان</label>
                <input type="date" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm focus:border-brand border border-transparent text-black dark:text-white" value={examForm.date} onChange={e => setExamForm({...examForm, date: e.target.value})} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button type="submit" className="flex-1 bg-main dark:bg-brand text-white dark:text-black py-4 md:py-5 rounded-2xl font-black text-base shadow-xl">حفظ</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-black py-4 md:py-5 rounded-2xl font-bold text-sm">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Exams;
