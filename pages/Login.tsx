
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Visual Section */}
      <div className="hidden md:flex flex-1 bg-main items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-second/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-second/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-center max-w-md">
           <img src="https://ro-s.net/img/logo.png" alt="Logo" className="h-32 mx-auto mb-8 drop-shadow-2xl" />
           <h1 className="text-4xl font-bold mb-6">نظام إدارة الطلاب الذكي</h1>
           <p className="text-xl opacity-80 font-light leading-relaxed">
             أفضل منصة لإدارة المجموعات التعليمية، تتبع الحضور، والمدفوعات المالية بكل سهولة ودقة.
           </p>
           
           <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                 <i className="fa-solid fa-bolt text-2xl mb-2"></i>
                 <p className="text-sm">سريع وموثوق</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                 <i className="fa-solid fa-lock text-2xl mb-2"></i>
                 <p className="text-sm">بيانات مشفرة</p>
              </div>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <img src="https://ro-s.net/img/logo.png" alt="Logo" className="h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-main">تسجيل الدخول للنظام</h2>
          </div>

          <div className="mb-10 hidden md:block">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك مجدداً!</h2>
            <p className="text-gray-500">من فضلك ادخل بيانات الاعتماد الخاصة بك للوصول</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                 <i className="fa-solid fa-envelope text-main"></i>
                 البريد الإلكتروني
              </label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all"
                placeholder="admin@school.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                 <i className="fa-solid fa-key text-main"></i>
                 كلمة المرور
              </label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-main" />
                تذكرني
              </label>
              <a href="#" className="text-main font-semibold hover:underline">نسيت كلمة المرور؟</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-main text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-main/20 hover:bg-second transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  دخول لوحة التحكم
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-gray-500 text-sm">
             <p>تحتاج مساعدة؟ تواصل مع الدعم الفني</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
