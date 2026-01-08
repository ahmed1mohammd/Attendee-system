
import React, { useState } from 'react';
import { Student, Group } from '../types';

interface StudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  groups: Group[];
}

const Students: React.FC<StudentsProps> = ({ students, setStudents, groups }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', groupId: '' });

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.phone.includes(searchTerm) || s.id.includes(searchTerm)
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone || !newStudent.groupId) return alert('برجاء ملء كافة البيانات');
    
    const student: Student = {
      id: 's' + (students.length + 1 + Date.now().toString().slice(-3)),
      name: newStudent.name,
      phone: newStudent.phone,
      groupId: newStudent.groupId,
      qrCode: 'QR-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      isPaid: false,
      attendanceCount: 0
    };

    setStudents([student, ...students]);
    setShowAddModal(false);
    setNewStudent({ name: '', phone: '', groupId: '' });
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold border-r-4 border-main pr-4">إدارة شؤون الطلاب</h2>
        <div className="flex gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
              <input 
                type="text" 
                placeholder="بحث بالاسم أو الرقم..." 
                className="w-full bg-white dark:bg-zinc-900 pl-10 pr-4 py-2.5 rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-main outline-none transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
           </div>
           <button 
            onClick={() => setShowAddModal(true)}
            className="bg-main text-white px-6 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-lg shadow-main/20 hover:scale-105 transition-transform font-bold"
           >
              <i className="fa-solid fa-user-plus"></i>
              إضافة طالب جديد
           </button>
        </div>
      </div>

      <div className="card p-0 bg-white dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden rounded-[30px]">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400">
                <th className="py-5 px-6 font-bold text-sm uppercase">كود الطالب</th>
                <th className="py-5 px-6 font-bold text-sm uppercase">الاسم بالكامل</th>
                <th className="py-5 px-6 font-bold text-sm uppercase">المجموعة</th>
                <th className="py-5 px-6 font-bold text-sm uppercase">رقم التواصل</th>
                <th className="py-5 px-6 font-bold text-sm uppercase">الحالة المالية</th>
                <th className="py-5 px-6 font-bold text-sm text-center uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors group">
                  <td className="py-5 px-6 font-mono text-main dark:text-second font-black text-sm">{student.id}</td>
                  <td className="py-5 px-6">
                    <div className="font-bold text-gray-800 dark:text-gray-200">{student.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{student.qrCode}</div>
                  </td>
                  <td className="py-5 px-6">
                     <span className="px-3 py-1 bg-main/5 text-main dark:text-fourth dark:bg-main/20 rounded-lg text-xs font-black">
                        {groups.find(g => g.id === student.groupId)?.name || 'غير محدد'}
                     </span>
                  </td>
                  <td className="py-5 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">{student.phone}</td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${student.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {student.isPaid ? 'خالص' : 'متبقي'}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center transition-colors hover:bg-blue-500 hover:text-white">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => deleteStudent(student.id)} className="w-9 h-9 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center transition-colors hover:bg-red-500 hover:text-white">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-scaleIn border dark:border-zinc-800">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-main dark:text-white">تسجيل طالب جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-red-500 transition-colors">
                   <i className="fa-solid fa-times"></i>
                </button>
             </div>
             
             <form onSubmit={handleAddStudent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold pr-2 flex items-center gap-2">
                    <i className="fa-solid fa-user text-main"></i> اسم الطالب
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all"
                    placeholder="الاسم الثلاثي..."
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold pr-2 flex items-center gap-2">
                    <i className="fa-solid fa-phone text-main"></i> رقم الموبايل
                  </label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all text-center font-bold"
                    placeholder="01xxxxxxxxx"
                    value={newStudent.phone}
                    onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold pr-2 flex items-center gap-2">
                    <i className="fa-solid fa-users-rectangle text-main"></i> تخصيص المجموعة
                  </label>
                  <select 
                    required
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all font-bold appearance-none"
                    value={newStudent.groupId}
                    onChange={e => setNewStudent({...newStudent, groupId: e.target.value})}
                  >
                    <option value="">اختر المجموعة...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.time})</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                   <button type="submit" className="flex-1 bg-main text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-main/20 hover:scale-[1.02] active:scale-95 transition-all">
                      حفظ وتسجيل الطالب
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
