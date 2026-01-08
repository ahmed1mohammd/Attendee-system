
import React, { useState, useMemo } from 'react';
import { Group, Student } from '../types';

interface GroupsProps {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const Groups: React.FC<GroupsProps> = ({ groups, setGroups, students, setStudents }) => {
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', price: 0, time: '', days: [] as string[] });
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '' });
  
  // Search states
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const daysList = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter(g => g.name.includes(groupSearchQuery));
  }, [groups, groupSearchQuery]);

  // Filter students within the selected group
  const groupStudents = useMemo(() => {
    if (!selectedGroup) return [];
    return students.filter(s => 
      s.groupId === selectedGroup.id && 
      (s.name.includes(studentSearchQuery) || s.phone.includes(studentSearchQuery) || s.id.includes(studentSearchQuery))
    );
  }, [selectedGroup, students, studentSearchQuery]);

  const handleAddGroup = () => {
    if (!newGroup.name) return alert('برجاء إدخال اسم المجموعة');
    const group: Group = {
      id: 'g' + (groups.length + 1 + Date.now().toString().slice(-3)),
      name: newGroup.name,
      price: Number(newGroup.price),
      time: newGroup.time,
      days: newGroup.days,
      studentCount: 0
    };
    setGroups([...groups, group]);
    setShowAddGroupModal(false);
    setNewGroup({ name: '', price: 0, time: '', days: [] });
  };

  const handleQuickAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !newStudent.name || !newStudent.phone) return;

    const student: Student = {
      id: 's' + (students.length + 1 + Date.now().toString().slice(-3)),
      name: newStudent.name,
      phone: newStudent.phone,
      groupId: selectedGroup.id,
      qrCode: 'QR-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      isPaid: false,
      attendanceCount: 0
    };

    setStudents([student, ...students]);
    setNewStudent({ name: '', phone: '' });
    setShowAddStudentModal(false);
  };

  const deleteGroup = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المجموعة؟ جميع الطلاب سيفقدون ارتباطهم بها.')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const removeStudentFromGroup = (studentId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب من المجموعة؟')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <h2 className="text-2xl font-bold border-r-4 border-main pr-4">إدارة المجموعات التعليمية</h2>
           <p className="text-gray-500 text-sm mt-1 font-bold">يمكنك البحث عن المجموعات وإدارة طلابها من هنا</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث عن مجموعة..." 
                className="w-full sm:w-64 bg-white dark:bg-zinc-900 border-0 p-3 pl-10 rounded-2xl outline-none shadow-sm focus:ring-4 focus:ring-main/10 font-bold transition-all"
                value={groupSearchQuery}
                onChange={e => setGroupSearchQuery(e.target.value)}
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
           </div>
           <button 
             onClick={() => setShowAddGroupModal(true)}
             className="bg-main text-white px-8 py-3 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-main/20 hover:scale-105 active:scale-95 transition-all font-black"
           >
             <i className="fa-solid fa-plus-circle text-xl"></i>
             <span>إنشاء مجموعة</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGroups.map(group => (
          <div key={group.id} className="card bg-white dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="h-2 bg-gradient-to-l from-main to-second w-full"></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-main/5 dark:bg-main/20 rounded-3xl flex items-center justify-center text-main dark:text-second">
                  <i className="fa-solid fa-users-viewfinder text-3xl"></i>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteGroup(group.id)} className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black mb-1 text-gray-800 dark:text-gray-100">{group.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-6">
                 <i className="fa-solid fa-clock opacity-50"></i> {group.time} | {group.days.join(' - ')}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">التكلفة / حصة</p>
                    <p className="text-xl font-black text-main dark:text-second">{group.price} <span className="text-[10px]">ج.م</span></p>
                 </div>
                 <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">الطلاب الحاليين</p>
                    <p className="text-xl font-black text-gray-700 dark:text-gray-300">{students.filter(s => s.groupId === group.id).length}</p>
                 </div>
              </div>

              <button 
                onClick={() => { setSelectedGroup(group); setStudentSearchQuery(''); }}
                className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black hover:bg-main hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-list-check"></i>
                كشف الطلاب والتحكم
              </button>
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-20">
             <i className="fa-solid fa-search-minus text-9xl mb-6"></i>
             <h3 className="text-3xl font-black">لا توجد مجموعات مطابقة لبحثك</h3>
          </div>
        )}
      </div>

      {/* DETAILED Group Students Page (Overlay) */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-white dark:bg-zinc-950 z-[60] overflow-y-auto animate-fadeIn">
           <div className="max-w-6xl mx-auto p-6 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                 <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setSelectedGroup(null)}
                      className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-500 hover:bg-main hover:text-white transition-all shadow-sm"
                    >
                       <i className="fa-solid fa-arrow-right text-xl"></i>
                    </button>
                    <div>
                       <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-1">{selectedGroup.name}</h3>
                       <p className="text-gray-500 font-bold flex items-center gap-2">
                          <i className="fa-solid fa-calendar-check text-main"></i>
                          مواعيد المجموعة: {selectedGroup.days.join(' - ')} | {selectedGroup.time}
                       </p>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                       <input 
                         type="text" 
                         placeholder="بحث في طلاب هذه المجموعة..." 
                         className="w-full bg-gray-100 dark:bg-zinc-900 border-0 p-4 pl-12 rounded-2xl outline-none font-bold shadow-inner"
                         value={studentSearchQuery}
                         onChange={e => setStudentSearchQuery(e.target.value)}
                       />
                       <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <button 
                      onClick={() => setShowAddStudentModal(true)}
                      className="bg-main text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-main/30 flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                        <i className="fa-solid fa-user-plus text-xl"></i>
                        إضافة طالب
                    </button>
                 </div>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div className="card bg-gray-50 dark:bg-zinc-900/50 p-6 border-0 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">إجمالي المسجلين</p>
                    <h4 className="text-3xl font-black text-main dark:text-second">{students.filter(s => s.groupId === selectedGroup.id).length}</h4>
                 </div>
                 <div className="card bg-gray-50 dark:bg-zinc-900/50 p-6 border-0 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">مدفوعات اليوم</p>
                    <h4 className="text-3xl font-black text-green-500">{students.filter(s => s.groupId === selectedGroup.id && s.isPaid).length * selectedGroup.price} <span className="text-sm font-bold">ج.م</span></h4>
                 </div>
                 <div className="card bg-gray-50 dark:bg-zinc-900/50 p-6 border-0 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">حالات التأخر</p>
                    <h4 className="text-3xl font-black text-red-500">{students.filter(s => s.groupId === selectedGroup.id && !s.isPaid).length} <span className="text-sm font-bold">حالة</span></h4>
                 </div>
                 <div className="card bg-gray-50 dark:bg-zinc-900/50 p-6 border-0 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">نسبة الحضور</p>
                    <h4 className="text-3xl font-black text-blue-500">85%</h4>
                 </div>
              </div>

              {/* TABLE VIEW START */}
              <div className="card bg-white dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden rounded-[30px] animate-slideUp">
                {groupStudents.length === 0 ? (
                  <div className="text-center py-32 opacity-20">
                     <i className="fa-solid fa-users-slash text-9xl mb-6"></i>
                     <h3 className="text-3xl font-black">لا يوجد طلاب متطابقين</h3>
                     <p className="text-lg font-bold">حاول البحث بكلمات أخرى أو أضف طالباً جديداً</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500">
                          <th className="py-6 px-8 font-black uppercase text-xs">كود الطالب</th>
                          <th className="py-6 px-8 font-black uppercase text-xs">الاسم</th>
                          <th className="py-6 px-8 font-black uppercase text-xs">الموبايل</th>
                          <th className="py-6 px-8 font-black uppercase text-xs">الحالة المالية</th>
                          <th className="py-6 px-8 font-black uppercase text-xs">مرات الحضور</th>
                          <th className="py-6 px-8 font-black uppercase text-xs text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-zinc-800">
                        {groupStudents.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors group/row">
                            <td className="py-6 px-8 font-mono text-main dark:text-second font-black text-sm">{s.id}</td>
                            <td className="py-6 px-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-main/10 flex items-center justify-center font-black text-main">{s.name[0]}</div>
                                  <span className="font-bold text-gray-800 dark:text-gray-100">{s.name}</span>
                               </div>
                            </td>
                            <td className="py-6 px-8 font-semibold text-sm text-gray-500">{s.phone}</td>
                            <td className="py-6 px-8">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${s.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {s.isPaid ? 'مدفوع' : 'غير مدفوع'}
                               </span>
                            </td>
                            <td className="py-6 px-8">
                               <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-16 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-main rounded-full" style={{ width: `${Math.min(s.attendanceCount * 10, 100)}%` }}></div>
                                  </div>
                                  <span className="text-xs font-bold">{s.attendanceCount}</span>
                               </div>
                            </td>
                            <td className="py-6 px-8">
                               <div className="flex justify-center gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                  <button className="w-9 h-9 bg-main/10 text-main rounded-xl flex items-center justify-center hover:bg-main hover:text-white transition-all"><i className="fa-solid fa-eye"></i></button>
                                  <button onClick={() => removeStudentFromGroup(s.id)} className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><i className="fa-solid fa-user-minus"></i></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-scaleIn border dark:border-zinc-800">
              <h3 className="text-3xl font-black mb-8 text-main dark:text-white">تفاصيل المجموعة</h3>
              <div className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-sm font-bold pr-2">اسم المجموعة</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all"
                      placeholder="مثال: رياضيات - السبت"
                      value={newGroup.name}
                      onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold pr-2">وقت المحاضرة</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 text-center font-bold"
                        placeholder="04:00 م"
                        value={newGroup.time}
                        onChange={e => setNewGroup({...newGroup, time: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold pr-2">سعر الحصة</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 text-center font-bold"
                        value={newGroup.price}
                        onChange={e => setNewGroup({...newGroup, price: Number(e.target.value)})}
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold pr-2">أيام المواعيد</label>
                    <div className="flex flex-wrap gap-2">
                       {daysList.map(day => (
                         <button 
                           key={day}
                           onClick={() => {
                             if(newGroup.days.includes(day)) setNewGroup({...newGroup, days: newGroup.days.filter(d => d !== day)});
                             else setNewGroup({...newGroup, days: [...newGroup.days, day]});
                           }}
                           className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${newGroup.days.includes(day) ? 'bg-main text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}
                         >
                           {day}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="flex gap-4 mt-10">
                 <button onClick={handleAddGroup} className="flex-1 bg-main text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-main/20">تأكيد الإنشاء</button>
                 <button onClick={() => setShowAddGroupModal(false)} className="flex-1 bg-gray-100 dark:bg-zinc-800 py-4 rounded-2xl font-bold">تجاهل</button>
              </div>
           </div>
        </div>
      )}

      {/* Quick Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-scaleIn border dark:border-zinc-800">
              <h3 className="text-2xl font-black mb-6">إضافة طالب لـ {selectedGroup?.name}</h3>
              <form onSubmit={handleQuickAddStudent} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-sm font-bold pr-2">اسم الطالب</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all"
                      placeholder="الاسم بالكامل..."
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold pr-2">رقم الموبايل</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-0 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-main/10 transition-all text-center font-bold"
                      placeholder="01xxxxxxxxx"
                      value={newStudent.phone}
                      onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 bg-main text-white py-4 rounded-2xl font-black shadow-xl shadow-main/20">تأكيد الإضافة</button>
                    <button type="button" onClick={() => setShowAddStudentModal(false)} className="flex-1 bg-gray-100 dark:bg-zinc-800 py-4 rounded-2xl font-bold">إلغاء</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
