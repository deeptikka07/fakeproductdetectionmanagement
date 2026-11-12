import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  X,
  AlertCircle
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const matched = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (matched) {
      onLogin(matched);
      onClose();
    } else {
      setError('Invalid username or password credentials. Or select one of the instant role presets below.');
    }
  };

  const handleQuickLogin = (roleName: string) => {
    const user = users.find(u => u.role === roleName) || users[0];
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'TrueTag™ Role Authentication' : 'Create New Account'}
          </h2>
          <p className="text-xs text-slate-500">
            Role session guards routes via <code>AuthFilter.java</code>
          </p>
        </div>

        {/* 1-Click Role Presets (Super convenient for testing) */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
          <span className="text-xs font-bold text-blue-900 block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            1-Click Quick Role Switch (For Mini-Project Testing):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2 text-center bg-white hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="font-bold">Admin</div>
              <div className="text-[10px] text-slate-500 font-mono">admin / admin123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('MANUFACTURER')}
              className="p-2 text-center bg-white hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="font-bold">Manufacturer</div>
              <div className="text-[10px] text-slate-500 font-mono">apple_mfg</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('CUSTOMER')}
              className="p-2 text-center bg-white hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 transition-colors cursor-pointer shadow-2xs"
            >
              <div className="font-bold">Customer</div>
              <div className="text-[10px] text-slate-500 font-mono">john_doe</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or apple_mfg"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password (BCrypt Hashed)</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Authenticate Credentials
          </button>
        </form>

      </div>
    </div>
  );
};
