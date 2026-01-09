
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiClient } from '../services/apiClient';
import { Student, Group, AbsenceRecord } from '../types';

const AttendanceManager: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AbsenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(today);
  
  // Search states for each table
  const [presentSearch, setPresentSearch] = useState('');
  const [absentSearch, setAbsentSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gData, sData, rData] = await Promise.all([
        ApiClient.get<Group>(`/groups/${groupId}`),
        ApiClient.get<Student[]>(`/students?groupId=${groupId}`),
        ApiClient.get<AbsenceRecord[]>(`/attendance?groupId=${groupId}&date=${date}`)
      ]);
      setGroup(gData);
      setStudents(sData);
      setRecords(rData || []);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId, date]);

  // Separate students into Present and Absent lists
  const { presentList, absentList } = useMemo(() => {
    const present = students.filter(s => records.some(r => r.studentId === s.id && r.status === 'present'));
    const absent = students.filter(s => !records.some(r => r.studentId === s.id && r.status === 'present'));
    return { presentList: present, absentList: absent };
  }, [students, records]);

  // Filter lists based on search
  const filteredPresent = presentList.filter(s => s.name.includes(presentSearch) || s.phone.includes(presentSearch));
  const filteredAbsent = absentList.filter(s => s.name.includes(absentSearch) || s.phone.includes(absentSearch));

  const toggleStatus = async (studentId: string, currentStatus: 'present' | 'absent') => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    try {
      // Mock/Real API Call to update status
      await ApiClient.post('/attendance/update', { studentId, date, status: newStatus, groupId });
      
      // Update locally to reflect change instantly
      if (newStatus === 'present') {
        setRecords(prev => [...prev, { id: 'temp-'+Date.now(), studentId, date, status: 'present', groupId: groupId! }]);
      } else {
        setRecords(prev => prev.filter(r => r.studentId !== studentId || r.date !== date));
      }
    } catch (err) {
      alert('فشل تحديث الحالة');
    }
  };

  const handleWhatsAppBatch = () => {
    if (absentList.length === 0) {
      alert('لا يوجد طلاب غائبين لإرسال رسائل لهم.');
      return;
    }
    const message = `نحيطكم علماً بغياب الطالب عن درس اليوم في مجموعة (${group?.name}). نرجو المتابعة.`;
    const names = absentList.map(s => s.name).join(', ');
    alert(`تجهيز رسائل لـ ${absentList.length} طالب غائب.\n\nالطلاب: ${names}\n\nالنص: ${message}`);
  };

  if (loading) return <div className="p-20 text-center"><i className="fa-solid fa-spinner animate-spin text-brand text-3xl"></i></div>;

  return (
    <div className="space-y-10 animate-fadeIn font-['Cairo'] pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 dark:border-zinc-900 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/groups')}
            className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-brand transition-all shadow-sm"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <div>
            <h2 className="text-3xl font-black text-black dark:text-white">{group?.name}</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-brand font-bold text-xs uppercase tracking-widest">إدارة الحضور والغياب</span>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="bg-transparent border-0 font-mono text-brand font-black outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleWhatsAppBatch}
          className="bg-brand text-black px-8 py-4 rounded-3xl font-black shadow-lg hover:bg-black hover:text-brand transition-all flex items-center gap-3"
        >
          <i className="fa-brands fa-whatsapp text-2xl"></i>
          مراسلة المتغيبين
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Present Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black text-brand flex items-center gap-3">
              <i className="fa-solid fa-circle-check"></i>
              كشف الحضور ({presentList.length})
            </h3>
            <div className="relative">
              <input 
                type="text" placeholder="بحث..." 
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-2 pr-8 rounded-xl outline-none text-xs font-bold w-40"
                value={presentSearch} onChange={e => setPresentSearch(e.target.value)}
              />
              <i className="fa-solid fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
            </div>
          </div>
          
          <div className="card overflow-hidden rounded-[32px] bg-white dark:bg-black border-brand/20 shadow-xl shadow-brand/5 min-h-[400px]">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-brand/5 text-brand font-black text-[10px] uppercase tracking-widest border-b border-brand/10">
                  <th className="p-5">اسم الطالب</th>
                  <th className="p-5">التاريخ</th>
                  <th className="p-5 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
                {filteredPresent.map(s => (
                  <tr key={s.id} className="hover:bg-brand/5 transition-all group">
                    <td className="p-5">
                      <p className="font-bold text-black dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.phone}</p>
                    </td>
                    <td className="p-5 text-gray-500 font-mono text-xs">{date}</td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => toggleStatus(s.id, 'present')}
                        className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="نقل للغياب"
                      >
                        <i className="fa-solid fa-user-xmark"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPresent.length === 0 && (
                  <tr><td colSpan={3} className="p-10 text-center text-gray-400 font-bold italic">لا يوجد حضور حالياً</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Absent Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black text-red-500 flex items-center gap-3">
              <i className="fa-solid fa-circle-xmark"></i>
              كشف الغياب ({absentList.length})
            </h3>
            <div className="relative">
              <input 
                type="text" placeholder="بحث..." 
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-2 pr-8 rounded-xl outline-none text-xs font-bold w-40"
                value={absentSearch} onChange={e => setAbsentSearch(e.target.value)}
              />
              <i className="fa-solid fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
            </div>
          </div>

          <div className="card overflow-hidden rounded-[32px] bg-white dark:bg-black border-red-500/10 shadow-xl shadow-red-500/5 min-h-[400px]">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-red-500/5 text-red-500 font-black text-[10px] uppercase tracking-widest border-b border-red-500/10">
                  <th className="p-5">اسم الطالب</th>
                  <th className="p-5">التاريخ</th>
                  <th className="p-5 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
                {filteredAbsent.map(s => (
                  <tr key={s.id} className="hover:bg-red-500/5 transition-all group">
                    <td className="p-5">
                      <p className="font-bold text-black dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.phone}</p>
                    </td>
                    <td className="p-5 text-gray-500 font-mono text-xs">{date}</td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => toggleStatus(s.id, 'absent')}
                        className="w-10 h-10 bg-brand/10 text-brand rounded-xl hover:bg-brand hover:text-black transition-all shadow-sm"
                        title="تحضير الطالب"
                      >
                        <i className="fa-solid fa-user-check"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAbsent.length === 0 && (
                  <tr><td colSpan={3} className="p-10 text-center text-gray-400 font-bold italic">الجميع حاضرون</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManager;
