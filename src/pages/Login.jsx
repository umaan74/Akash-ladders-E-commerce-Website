import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, User, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [portalType, setPortalType] = useState('customer'); // 'customer' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle switching login tabs
  const handleTabChange = (type) => {
    setPortalType(type);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/customer/dashboard';
        navigate(from);
      }
    } else {
      setError(res.message || 'Login failed. Account not found in database or password incorrect.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Strict MongoDB Database Verification
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Sign In to Akash Ladders</h1>
          <p className="text-sm text-slate-400">
            Sign in to your registered customer account or admin dashboard
          </p>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              portalType === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Customer Portal
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              portalType === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Seed Account Quick Helper */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Registered MongoDB Accounts:
              </span>
              <button
                type="button"
                onClick={() => {
                  if (portalType === 'admin') {
                    setEmail('admin@akashladders.com');
                    setPassword('admin123');
                  } else {
                    setEmail('customer@example.com');
                    setPassword('customer123');
                  }
                }}
                className="underline hover:text-amber-300 text-[11px]"
              >
                Fill Seed Account
              </button>
            </div>
            {portalType === 'admin' ? (
              <p>Email: <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">admin@akashladders.com</code> | Pass: <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">admin123</code></p>
            ) : (
              <p>Email: <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">customer@example.com</code> | Pass: <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">customer123</code></p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {portalType === 'admin' ? 'Administrator Email' : 'Customer Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating JWT...' : (
                <>
                  <span>Sign In as {portalType === 'admin' ? 'Administrator' : 'Customer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {portalType === 'customer' && (
            <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-amber-400 hover:underline font-bold">
                Create Customer Account
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
