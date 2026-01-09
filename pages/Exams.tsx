
import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/apiClient';
import { Exam, Group, Student } from '../types';

// Removed ExamsProps interface as component now handles its own data fetching via ApiClient
const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [gradingExam, setGradingExam] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState<Partial<Exam>>({ name: '', groupId: '', maxScore: 50, date: new Date().toISOString().split('T')[0] });

  // Fetch exams, groups, and students from the API to satisfy data requirements
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

  const filtered = exams.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

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
      // Persist the updated score via API
      await ApiClient.put(`/exams/${gradingExam.id}`, { ...gradingExam, scores: updatedScores });
      
      // Update local states for immediate UI feedback
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
          <button onClick={() => setGradingExam(null)} className="w-12 h-12 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-black dark:text-zinc-400">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <div>
            <h2 className="text-3xl font-black text-black dark:text-white">رصد درجات: {gradingExam.name}</h2>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mt-1">الدرجة النهائية: {gradingExam.maxScore}</p>
          </div>
        </div>
        <div className="card overflow-hidden rounded-[32px] border-gray-100 dark:border-zinc-900">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-900/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100 dark:border-zinc-900">
                <th className="p-6">اسم الطالب</th>
                <th className="p-6 text-center">الدرجة المستحقة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
              {groupStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20">
                  <td className="p-6 font-bold text-black dark:text-white">{s.name}</td>
                  <td className="p-6 text-center">
                    <input 
                      type="number" 
                      className="w-24 bg-gray-100 dark:bg-black border border-gray-200 dark:border-zinc-800 p-2 rounded-xl text-center font-black text-brand outline-none focus:border-brand"
                      value={gradingExam.scores[s.id] || 0}
                      onChange={e => updateScore(s.id, Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-black dark:text-white">الامتحانات</h2>
        <div className="flex gap-4">
          <div className="relative">
             <input 
              type="text" placeholder="بحث..." 
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-3 pr-10 rounded-xl outline-none text-xs font-bold w-64"
              value={search} onChange={e => setSearch(e.target.value)}
             />
             <i className="fa-solid fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <button onClick={() => { setExamForm({ name: '', groupId: '', maxScore: 50, date: new Date().toISOString().split('T')[0] }); setShowModal(true); }} className="bg-main dark:bg-brand text-white dark:text-black px-6 rounded-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-file-signature"></i> إضافة امتحان
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map(ex => (
          <div key={ex.id} className="card p-8 rounded-[32px] border-gray-100 dark:border-zinc-900 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">EXAM LOG</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setExamForm(ex); setShowModal(true); }} className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-black dark:text-white hover:text-brand"><i className="fa-solid fa-edit"></i></button>
                <button onClick={() => del(ex.id)} className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white"><i className="fa-solid fa-trash"></i></button>
              </div>
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white mb-2">{ex.name}</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase">المجموعة: {groups.find(g => g.id === ex.groupId)?.name}</p>
            <div className="mt-8 flex items-center justify-between">
              <div className="text-center bg-gray-50 dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <p className="text-2xl font-black text-brand">{ex.maxScore}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">النهائية</p>
              </div>
              <button onClick={() => setGradingExam(ex)} className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform shadow-lg">رصد الدرجات</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={saveExam} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] p-10 space-y-6">
            <h3 className="text-2xl font-black text-black dark:text-white">بيانات الامتحان</h3>
            <input type="text" placeholder="اسم الامتحان" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold" value={examForm.name} onChange={e => setExamForm({...examForm, name: e.target.value})} />
            <select className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold" value={examForm.groupId} onChange={e => setExamForm({...examForm, groupId: e.target.value})}>
              <option value="">اختر المجموعة...</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <input type="number" placeholder="الدرجة النهائية" required className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-2xl outline-none font-bold" value={examForm.maxScore} onChange={e => setExamForm({...examForm, maxScore: Number(e.target.value)})} />
            <input type="date" required className="w-full bg-gray-50 dark:bg-zinc-900 p-4 rounded-2xl outline-none font-bold" value={examForm.date} onChange={e => setExamForm({...examForm, date: e.target.value})} />
            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-main dark:bg-brand text-white py-4 rounded-2xl font-black">حفظ</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 rounded-2xl text-black">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Exams;
