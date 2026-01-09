
import React, { useState } from 'react';
import { User } from '../types';
import { ApiClient } from '../services/apiClient';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiClient.post<{ user: User; token: string }>('/auth/login', { username, password });
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black font-['Cairo']">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fadeIn">
          <div className="w-24 h-24 bg-brand rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand/20">
            <i className="fa-solid fa-bolt-lightning text-black text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Control Panel</h1>
          <p className="text-zinc-500 font-bold mt-2 text-[10px] uppercase tracking-[0.4em]">Student Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-10 rounded-[48px] border border-zinc-800 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block px-2">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-black border border-zinc-800 p-5 rounded-3xl outline-none focus:border-brand font-bold text-white transition-all text-center"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block px-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-black border border-zinc-800 p-5 rounded-3xl outline-none focus:border-brand font-bold text-white transition-all text-center"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-[11px] font-black text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand text-black py-5 rounded-3xl font-black text-lg hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand/10"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
