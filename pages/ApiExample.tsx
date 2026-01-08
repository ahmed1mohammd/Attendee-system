
import React, { useEffect } from 'react';
import { api } from '../api';
import { useApi } from '../useApi';
import { Student } from '../types';

const ApiExample: React.FC = () => {
  // استخدام الهوك المخصص للتعامل مع قائمة الطلاب
  const { data: students, loading, error, execute: fetchStudents } = useApi<Student[]>();

  // إضافة هوك منفصل لعملية الإضافة لتجنب تعارض الأنواع بين مصفوفة الطلاب وطالب واحد
  const { loading: adding, execute: createStudent } = useApi<Student>();

  // وظيفة لجلب البيانات عند تحميل المكون
  useEffect(() => {
    // استدعاء الطلب عبر execute
    fetchStudents(api.get<Student[]>('/students'))
      .catch(() => {
        // يمكن معالجة الخطأ هنا أيضاً إذا لزم الأمر
      });
  }, [fetchStudents]);

  // وظيفة لإضافة طالب جديد (مثال على POST)
  const handleAddStudent = async () => {
    try {
      const newStudentData = { name: 'طالب تجريبي', phone: '0100000000', groupId: 'g1' };
      // تم تصحيح الخطأ: استخدام الهوك createStudent الذي يتوقع Promise<Student> بدلاً من fetchStudents الذي يتوقع Promise<Student[]>
      await createStudent(api.post<Student>('/students', newStudentData));
      alert('تمت الإضافة بنجاح!');
      
      // إعادة جلب القائمة لتحديث العرض
      fetchStudents(api.get<Student[]>('/students'));
    } catch (err) {
      // الخطأ يتم التعامل معه تلقائياً في حالة الـ error state
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <i className="fa-solid fa-circle-notch animate-spin text-4xl text-main"></i>
    </div>
  );

  if (error) return (
    <div className="p-10 bg-red-50 text-red-500 rounded-3xl border border-red-100 flex items-center gap-4">
      <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
      <p className="font-bold">فشل جلب البيانات: {error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">مثال جلب البيانات من السيرفر</h2>
        <button 
          onClick={handleAddStudent}
          disabled={adding}
          className="bg-main text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
        >
          {adding && <i className="fa-solid fa-spinner animate-spin"></i>}
          إضافة طالب (POST)
        </button>
      </div>

      <div className="grid gap-4">
        {students?.map(student => (
          <div key={student.id} className="p-4 bg-white dark:bg-darkCard rounded-2xl shadow-sm border dark:border-white/5">
            <p className="font-bold">{student.name}</p>
            <p className="text-xs text-gray-400">{student.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiExample;
