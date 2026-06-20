import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [name, setName] = useState('');
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
      const res = await api.post('/auth/register', { name, email, password });
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;
      if (!token) throw new Error("No token received");
      login(token, user);
      toast.success('Identity Verified. Welcome aboard.');
      navigate('/technologies');
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[var(--bg-input)] border border-th-input rounded-xl py-4 pl-12 pr-4 text-th-primary placeholder-th-dimmed focus:border-[var(--border-input-focus)] focus:ring-1 focus:ring-[var(--border-input-focus)] outline-none transition-all";

  return (
    <div className="min-h-screen bg-th-base text-th-primary flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-main)' } }} />
      
      <button onClick={toggleTheme} className="fixed top-6 right-6 z-50 p-2.5 rounded-xl border border-th-subtle text-th-muted hover:text-th-primary hover:bg-th-pill transition-all">
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-sm mb-6" style={{ background: 'var(--logo-bg)', boxShadow: `0 0 15px var(--logo-glow)` }} />
          <h1 className="text-4xl font-black tracking-tight mb-2">Create Identity</h1>
          <p className="text-th-muted text-sm">Establish your credentials in the network.</p>
        </div>

        <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-th-main rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-th-muted to-transparent opacity-30" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-th-muted ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-muted transition-colors group-focus-within:text-th-primary" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="John Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-th-muted ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-muted transition-colors group-focus-within:text-th-primary" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="name@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-th-muted ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-muted transition-colors group-focus-within:text-th-primary" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-th-input rounded-xl py-4 pl-12 pr-12 text-th-primary placeholder-th-dimmed focus:border-[var(--border-input-focus)] focus:ring-1 focus:ring-[var(--border-input-focus)] outline-none transition-all"
                  placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-th-muted hover:text-th-primary transition-colors focus:outline-none">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><span>Initialize Account</span><ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>
        </div>
        <p className="text-center mt-8 text-th-muted text-sm">
          Already verified? <Link to="/login" className="text-th-primary font-bold hover:text-th-secondary transition-colors">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;