
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student, Group, AbsenceRecord } from '../types';

interface GroupAbsenceProps {
  groups: Group[];
  students: Student[];
  absenceRecords: AbsenceRecord[];
  setAbsenceRecords: React.Dispatch<React.SetStateAction<AbsenceRecord[]>>;
}

const GroupAbsence: React.FC<GroupAbsenceProps> = ({ groups, students, absenceRecords, setAbsenceRecords }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  
  const group = groups.find(g => g.id === groupId);
  const groupStudents = students.filter(s => s.groupId === groupId);

  const getStatus = (studentId: string) => {
    const record = absenceRecords.find(r => r.studentId === studentId && r.date === today);
    return record ? record.status : 'present';
  };

  const toggleStatus = (studentId: string) => {
    setAbsenceRecords(prev => {
      const existingIndex = prev.findIndex(r => r.studentId === studentId && r.date === today);
      if (existingIndex > -1) {
        const newRecords = [...prev];
        newRecords[existingIndex].status = newRecords[existingIndex].status === 'present' ? 'absent' : 'present';
        return newRecords;
      } else {
        return [...prev, {
          id: 'abs-' + Date.now() + Math.random(),
          studentId,
          groupId: groupId || '',
          date: today,
          status: 'absent'
        }];
      }
    });
  };

  const handleWhatsAppBatch = () => {
    const absents = groupStudents.filter(s => getStatus(s.id) === 'absent');
    if (absents.length === 0) {
      alert('لا يوجد طلاب غائبين لإرسال رسائل لهم.');
      return;
    }
    const message = `تنبيه غياب: نود إخطاركم بتغيب الطالب عن حصة اليوم بمجموعة ${group?.name}.`;
    alert(`سيتم تجهيز رسائل لـ ${absents.length} طالب غائب.\nنص الرسالة: ${message}`);
  };

  if (!group) return <div className="p-20 text-center font-black">المجموعة غير موجودة</div>;

  return (
    <div className="animate-fadeIn space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 dark:border-zinc-900 pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/groups')}
            className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-zinc-400 hover:text-main dark:hover:text-brand transition-all border border-gray-200 dark:border-zinc-800"
          >
            <i className="fa-solid fa-arrow-right text-lg"></i>
          </button>
          <div>
            <h2 className="text-3xl font-black text-black dark:text-white">سجل غياب: {group.name}</h2>
            <p className="text-gray-500 font-bold mt-1">تاريخ اليوم: <span className="text-brand font-mono">{today}</span></p>
          </div>
        </div>

        <button 
          onClick={handleWhatsAppBatch}
          className="bg-main dark:bg-brand text-white dark:text-black px-8 py-4 rounded-2xl font-black hover:scale-[1.02] transition-all flex items-center gap-3 shadow-lg"
        >
          <i className="fa-brands fa-whatsapp text-2xl"></i>
          إرسال واتساب للمتغيبين
        </button>
      </div>

      <div className="card overflow-hidden shadow-sm">
        <table className="w-full text-right border-separate border-spacing-y-2 px-4">
          <thead>
            <tr className="text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] font-black">
              <th className="p-6">اسم الطالب</th>
              <th className="p-6">رقم الموبايل</th>
              <th className="p-6 text-center">حالة الحضور</th>
              <th className="p-6 text-center">تغيير الحالة</th>
            </tr>
          </thead>
          <tbody>
            {groupStudents.map(student => {
              const status = getStatus(student.id);
              const isAbsent = status === 'absent';

              return (
                <tr key={student.id} className={`bg-gray-50/50 dark:bg-zinc-900/20 hover:bg-gray-100 dark:hover:bg-zinc-900/40 transition-colors ${isAbsent ? 'border-r-4 border-red-500' : 'border-r-4 border-brand'}`}>
                  <td className="p-6">
                    <p className={`font-black text-lg ${isAbsent ? 'text-gray-400 dark:text-zinc-500' : 'text-black dark:text-white'}`}>{student.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-mono italic">ID: {student.id}</p>
                  </td>
                  <td className="p-6 text-gray-600 dark:text-zinc-400 font-bold text-sm font-mono">
                    {student.phone}
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                      isAbsent ? 'bg-red-50 text-red-500 border-red-100' : 'bg-brand/10 text-brand border-brand/20'
                    }`}>
                      {isAbsent ? 'غائب اليوم' : 'حاضر'}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => toggleStatus(student.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isAbsent ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:text-main dark:hover:text-white'
                      }`}
                    >
                      <i className={`fa-solid ${isAbsent ? 'fa-user-xmark' : 'fa-user-check'}`}></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupAbsence;
