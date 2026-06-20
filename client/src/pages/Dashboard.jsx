import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Flame, Zap, Activity, ChevronRight, Cpu, Star, ArrowUpRight, Globe, Command, Layout } from 'lucide-react';

const NeoCard = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`relative overflow-hidden rounded-2xl border border-th-main bg-[var(--bg-card)] backdrop-blur-sm p-6 transition-all duration-300 group ${onClick ? 'cursor-pointer hover:bg-[var(--bg-card-hover)] hover:border-th-input hover:shadow-2xl' : ''} ${className}`}>
    {children}
  </div>
);

const StatBox = ({ label, value, icon: Icon, color }) => (
  <NeoCard className="flex flex-col justify-between h-full">
    <div className="flex items-start justify-between mb-4"><div className={`p-2.5 rounded-lg bg-th-pill ${color}`}><Icon className="w-5 h-5" /></div></div>
    <div><div className="text-3xl font-bold text-th-primary tracking-tight">{value}</div><div className="text-xs text-th-muted font-mono uppercase tracking-wider mt-1">{label}</div></div>
  </NeoCard>
);

const ProtocolItem = ({ title, level, progress, color, icon: Icon, onClick }) => (
  <div onClick={onClick} className="group relative p-5 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-th-main rounded-xl transition-all cursor-pointer overflow-hidden">
    <div className="flex justify-between items-start mb-4"><div className="w-10 h-10 rounded-lg bg-th-base border border-th-main flex items-center justify-center text-th-secondary group-hover:text-th-primary transition-colors"><Icon className="w-5 h-5" /></div><span className="text-[10px] font-mono bg-th-pill px-2 py-1 rounded text-th-muted border border-th-subtle">{level}</span></div>
    <h3 className="text-base font-bold text-th-primary mb-2 group-hover:text-th-secondary transition-colors">{title}</h3>
    <div className="flex items-center justify-between text-[10px] text-th-muted font-mono mb-2"><span>PROGRESS</span><span>{progress}%</span></div>
    <div className="w-full bg-th-base rounded-full h-1 overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${progress}%` }} /></div>
  </div>
);

const SuggestionItem = ({ icon, name, tag }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-th-pill transition-colors cursor-pointer group">
    <div className="w-10 h-10 rounded-lg bg-th-base border border-th-main flex items-center justify-center text-lg">{icon}</div>
    <div className="flex-1 min-w-0"><div className="text-sm font-bold text-th-primary group-hover:text-th-secondary transition-colors truncate">{name}</div><div className="text-[10px] text-th-muted font-mono truncate">{tag}</div></div>
    <ChevronRight className="w-4 h-4 text-th-dimmed group-hover:text-th-primary transition-colors" />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const userStats = user?.stats || {};
  const streak = user?.streak ?? userStats.streak ?? 0;

  return (
    <div className="min-h-screen bg-th-base text-th-primary pt-6 pb-20 font-sans relative w-full overflow-x-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>

      <div className="w-full px-6 md:px-8 xl:px-12 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-th-secondary mb-3 font-mono text-xs tracking-[0.2em] uppercase">
              <Zap className="w-4 h-4" /> VIDYASETU • {today}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-black text-th-primary leading-tight">
              {greeting}, <br /><span className="text-th-muted">{user?.name?.split(' ')[0] || 'Operative'}</span>
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 bg-[var(--bg-card)] border border-th-subtle p-2 pr-6 rounded-full backdrop-blur-md">
            <div className="w-12 h-12 bg-th-elevated rounded-full flex items-center justify-center border border-th-subtle text-orange-500"><Flame className={`w-6 h-6 ${streak > 0 ? 'fill-orange-500 animate-bounce' : ''}`} /></div>
            <div><div className="text-2xl font-bold text-th-primary leading-none">{streak}</div><div className="text-[10px] font-bold text-th-muted uppercase tracking-wider">Day Streak</div></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatBox label="Active Modules" value={userStats.inProgressTechnologies ?? 3} icon={Cpu} color="text-blue-400" />
          <StatBox label="Nodes Cleared" value={userStats.completedSteps ?? 24} icon={Target} color="text-emerald-400" />
          <StatBox label="Global Rank" value="#842" icon={Trophy} color="text-yellow-400" />
          <StatBox label="System Sync" value={`${userStats.overallProgress ?? 68}%`} icon={Activity} color="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 xl:gap-8">
          <div className="xl:col-span-3 space-y-6">
            <NeoCard className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div><h2 className="text-2xl font-bold text-th-primary flex items-center gap-3"><Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" /> Active Protocols</h2><p className="text-th-secondary text-sm mt-1">Resume where you left off.</p></div>
                <button onClick={() => navigate('/technologies')} className="px-4 py-2 rounded-full bg-th-pill hover:bg-th-pill-active text-xs font-bold text-th-primary border border-th-main transition-colors flex items-center gap-2">VIEW RADAR <ArrowUpRight className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProtocolItem title="React.js Architecture" level="Level 4" progress={68} color="bg-blue-500" icon={Layout} onClick={() => navigate('/technologies/reactjs')} />
                <ProtocolItem title="Node.js Scalability" level="Level 2" progress={45} color="bg-emerald-500" icon={Globe} onClick={() => navigate('/technologies/nodejs')} />
              </div>
            </NeoCard>
            <NeoCard className="p-8">
              <div className="flex items-center gap-3 mb-8"><div className="p-2 bg-th-pill rounded-lg"><TrendingUp className="w-5 h-5 text-th-secondary" /></div><div><h2 className="text-lg font-bold text-th-primary">Neural Activity</h2><p className="text-th-muted text-xs">Commit frequency over 7 days</p></div></div>
              <div className="flex items-end justify-between h-40 gap-2 sm:gap-4 px-2">
                {[35, 60, 25, 80, 55, 90, 45].map((h, i) => (<div key={i} className="w-full relative group"><div className="w-full bg-th-elevated rounded-t-sm group-hover:bg-[var(--accent-bg)] transition-all duration-500" style={{ height: `${h}%` }} /></div>))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-th-dimmed uppercase"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </NeoCard>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <NeoCard><h3 className="text-xs font-mono text-th-muted uppercase tracking-widest mb-6 flex items-center gap-2"><Command className="w-3 h-3" /> Recommended</h3><div className="space-y-2"><SuggestionItem icon="🐍" name="Python" tag="Data Science" /><SuggestionItem icon="🐳" name="Docker" tag="DevOps" /><SuggestionItem icon="☁️" name="AWS" tag="Cloud Architecture" /></div></NeoCard>
            <div className="relative overflow-hidden rounded-2xl p-8 border border-th-main group cursor-pointer bg-[var(--bg-card)]"><div className="relative z-10"><div className="w-10 h-10 bg-th-pill rounded-xl flex items-center justify-center border border-th-main mb-4 text-th-secondary"><Star className="w-5 h-5" /></div><h3 className="text-lg font-bold text-th-primary mb-2">Upgrade to Pro</h3><p className="text-th-secondary text-sm mb-6 leading-relaxed">Unlock Layer 2 protocols and access advanced architect certs.</p><button className="w-full py-3 text-sm font-bold rounded-lg transition-colors" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>Upgrade Now</button></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;