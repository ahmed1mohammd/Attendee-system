
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const data = [
  { name: 'السبت', payments: 4000 },
  { name: 'الأحد', payments: 3000 },
  { name: 'الاثنين', payments: 2000 },
  { name: 'الثلاثاء', payments: 2780 },
  { name: 'الأربعاء', payments: 1890 },
  { name: 'الخميس', payments: 2390 },
  { name: 'الجمعة', payments: 3490 },
];

const COLORS = ['#16423C', '#6A9C89', '#C4DAD2', '#16423C', '#6A9C89', '#C4DAD2', '#16423C'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bootstrap Classes used for Cards as requested */}
        <div className="card shadow-sm border-0 p-4 flex flex-row items-center gap-4 hover:-translate-y-1 transition-transform bg-white dark:bg-zinc-800">
          <div className="bg-main/10 p-4 rounded-xl">
            <i className="fa-solid fa-user-graduate text-3xl text-main"></i>
          </div>
          <div>
            <h5 className="text-gray-500 dark:text-gray-400 text-sm">إجمالي الطلاب</h5>
            <p className="text-2xl font-bold dark:text-white">1,250</p>
          </div>
        </div>

        <div className="card shadow-sm border-0 p-4 flex flex-row items-center gap-4 hover:-translate-y-1 transition-transform bg-white dark:bg-zinc-800">
          <div className="bg-green-100 p-4 rounded-xl">
            <i className="fa-solid fa-money-bill-wave text-3xl text-green-600"></i>
          </div>
          <div>
            <h5 className="text-gray-500 dark:text-gray-400 text-sm">تحصيل اليوم</h5>
            <p className="text-2xl font-bold dark:text-white">4,500 <span className="text-xs font-normal">ج.م</span></p>
          </div>
        </div>

        <div className="card shadow-sm border-0 p-4 flex flex-row items-center gap-4 hover:-translate-y-1 transition-transform bg-white dark:bg-zinc-800">
          <div className="bg-blue-100 p-4 rounded-xl">
            <i className="fa-solid fa-layer-group text-3xl text-blue-600"></i>
          </div>
          <div>
            <h5 className="text-gray-500 dark:text-gray-400 text-sm">عدد المجموعات</h5>
            <p className="text-2xl font-bold dark:text-white">12</p>
          </div>
        </div>

        <div className="card shadow-sm border-0 p-4 flex flex-row items-center gap-4 hover:-translate-y-1 transition-transform bg-white dark:bg-zinc-800">
          <div className="bg-purple-100 p-4 rounded-xl">
            <i className="fa-solid fa-file-lines text-3xl text-purple-600"></i>
          </div>
          <div>
            <h5 className="text-gray-500 dark:text-gray-400 text-sm">الامتحانات القادمة</h5>
            <p className="text-2xl font-bold dark:text-white">3</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 bg-white dark:bg-zinc-800 shadow-sm border-0">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <i className="fa-solid fa-chart-line text-main"></i>
             إحصائيات المدفوعات الأسبوعية
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16423C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16423C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="payments" stroke="#16423C" fillOpacity={1} fill="url(#colorPayments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 bg-white dark:bg-zinc-800 shadow-sm border-0">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <i className="fa-solid fa-users text-main"></i>
             توزيع الطلاب على المجموعات
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="payments" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Activity Table */}
      <div className="card p-6 bg-white dark:bg-zinc-800 shadow-sm border-0 overflow-hidden">
        <h3 className="text-lg font-bold mb-4">أحدث عمليات تسجيل الحضور</h3>
        <div className="table-responsive">
          <table className="table dark:text-gray-300">
            <thead>
              <tr className="border-b dark:border-zinc-700">
                <th className="py-3 px-4 text-right">اسم الطالب</th>
                <th className="py-3 px-4 text-right">المجموعة</th>
                <th className="py-3 px-4 text-right">الوقت</th>
                <th className="py-3 px-4 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <td className="py-3 px-4">أحمد محمد علي</td>
                  <td className="py-3 px-4">مجموعة الأحد 4م</td>
                  <td className="py-3 px-4 text-sm text-gray-500">منذ 5 دقائق</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">حاضر</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
