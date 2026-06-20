import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Command, Map, ChevronRight } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-th-base text-th-primary flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Error: 404_Target_Missing
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Signal <span className="text-th-dimmed italic font-medium font-mono">LOST</span></h1>
            <p className="text-th-secondary text-lg max-w-md mx-auto leading-relaxed">The coordinate you requested does not exist in the NeoCube neural network.</p>
          </motion.div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button onClick={() => navigate('/dashboard')} className="h-12 px-8 rounded-full font-bold transition-all flex items-center justify-center gap-2" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 30px var(--accent-glow)` }}>
            <Home className="w-4 h-4" /> Go to Dashboard
          </button>
          <button onClick={() => navigate(-1)} className="h-12 px-8 rounded-full border border-th-main bg-th-pill text-th-primary font-bold hover:bg-th-pill-active transition-all flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Initialize Step-back
          </button>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HelpLink to="/technologies" icon={Command} title="Technology Radar" desc="Explore all AI roadmaps." />
          <HelpLink to="/profile" icon={Map} title="Personal Atlas" desc="Review your saved progress." />
        </motion.div>
        <div className="mt-12 pt-8 border-t border-th-main flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-[10px] font-mono text-th-dimmed uppercase tracking-[0.3em]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Core System Nominal</div>
          <div className="hidden md:block w-px h-3 bg-th-main" />
          <div className="text-[10px] font-mono text-th-dimmed uppercase tracking-[0.3em]">Status: Connection_Closed</div>
        </div>
      </div>
    </div>
  );
};

const HelpLink = ({ to, icon: Icon, title, desc }) => (
  <Link to={to} className="group p-5 bg-[var(--bg-card)] border border-th-main rounded-2xl hover:border-th-input hover:bg-[var(--bg-card-hover)] transition-all flex items-start gap-4">
    <div className="p-2.5 rounded-xl bg-th-base border border-th-main"><Icon className="w-5 h-5 text-th-muted group-hover:text-th-primary" /></div>
    <div>
      <div className="text-sm font-bold text-th-secondary flex items-center gap-2 group-hover:text-th-primary transition-colors">{title} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></div>
      <div className="text-xs text-th-muted mt-1">{desc}</div>
    </div>
  </Link>
);

export default NotFound;