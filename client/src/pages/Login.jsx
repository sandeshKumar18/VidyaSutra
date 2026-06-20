import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;
      if (!token) throw new Error("No token received");
      login(token, user);
      toast.success('Access Granted. Welcome back.');
      navigate('/technologies');
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-th-base text-th-primary flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-main)' } }} />
      
      {/* Theme toggle */}
      <button onClick={toggleTheme} className="fixed top-6 right-6 z-50 p-2.5 rounded-xl border border-th-subtle text-th-muted hover:text-th-primary hover:bg-th-pill transition-all">
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-sm mb-6" style={{ background: 'var(--logo-bg)', boxShadow: `0 0 15px var(--logo-glow)` }} />
          <h1 className="text-4xl font-black tracking-tight mb-2 text-th-primary">Welcome Back</h1>
          <p className="text-th-muted text-sm">Authenticate to access the neural network.</p>
        </div>

        <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-th-main rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-th-muted to-transparent opacity-30" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-th-muted ml-1">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-muted transition-colors group-focus-within:text-th-primary" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-th-input rounded-xl py-4 pl-12 pr-4 text-th-primary placeholder-th-dimmed focus:border-[var(--border-input-focus)] focus:ring-1 focus:ring-[var(--border-input-focus)] outline-none transition-all"
                  placeholder="operative@system.com" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-th-muted">Passcode</label>
                <a href="#" className="text-xs text-th-secondary hover:text-th-primary transition-colors">Forgot code?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-muted transition-colors group-focus-within:text-th-primary" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-th-input rounded-xl py-4 pl-12 pr-12 text-th-primary placeholder-th-dimmed focus:border-[var(--border-input-focus)] focus:ring-1 focus:ring-[var(--border-input-focus)] outline-none transition-all"
                  placeholder="••••••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-th-muted hover:text-th-primary transition-colors focus:outline-none">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><span className="relative z-10">Initialize Session</span><ArrowRight className="w-4 h-4 relative z-10" /></>}
            </motion.button>
          </form>
        </div>
        <p className="text-center mt-8 text-th-muted text-sm">
          New to the network? <Link to="/register" className="text-th-primary font-bold hover:text-th-secondary transition-colors">Request Access</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;