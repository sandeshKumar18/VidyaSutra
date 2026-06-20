import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, ArrowUpRight, Zap, Activity, Code2, Server, Globe, Cpu, Database, BarChart3, Clock } from 'lucide-react';

const trendingData = [
  { rank: 1, name: 'Next.js 14', category: 'Frontend', growth: '+124%', users: '2.4M', description: 'The React Framework for the Web. Server Actions are changing the game.', icon: <Code2 className="w-8 h-8" />, color: 'text-th-primary', bg: 'bg-th-elevated' },
  { rank: 2, name: 'Docker', category: 'DevOps', growth: '+89%', users: '5M+', description: 'Containerization is now a mandatory skill for 90% of backend roles.', icon: <Globe className="w-8 h-8" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { rank: 3, name: 'Rust', category: 'System', growth: '+76%', users: '800k', description: 'Memory safety without garbage collection. The future of systems programming.', icon: <Cpu className="w-8 h-8" />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { rank: 4, name: 'Kubernetes', category: 'DevOps', growth: '+65%', users: '1.2M', description: 'Orchestration at scale. Essential for enterprise cloud architecture.', icon: <Server className="w-8 h-8" />, color: 'text-blue-300', bg: 'bg-blue-400/10' },
  { rank: 5, name: 'Supabase', category: 'Backend', growth: '+54%', users: '400k', description: 'The open source Firebase alternative. SQL proficiency required.', icon: <Database className="w-8 h-8" />, color: 'text-green-400', bg: 'bg-green-500/10' },
];

const Trending = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-th-base relative overflow-x-hidden pt-8 pb-20 px-6 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent-bg)' }}></span><span className="relative inline-flex rounded-full h-3 w-3" style={{ background: 'var(--accent-bg)' }}></span></span>
              <span className="text-th-secondary font-mono text-xs tracking-widest uppercase">Live Trending Skills</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-th-primary tracking-tight">Trending <span className="text-th-muted">Now</span></h1>
            <p className="text-th-secondary mt-4 max-w-xl text-lg">The fastest growing technologies in the Government & Enterprise sector this week.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
            <div className="bg-[var(--bg-card)] border border-th-main rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><ArrowUpRight className="w-6 h-6" /></div>
              <div><div className="text-2xl font-bold text-th-primary">42%</div><div className="text-xs text-th-muted uppercase">MERN Demand</div></div>
            </div>
            <div className="bg-[var(--bg-card)] border border-th-main rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500"><Flame className="w-6 h-6" /></div>
              <div><div className="text-2xl font-bold text-th-primary">12</div><div className="text-xs text-th-muted uppercase">New Techs</div></div>
            </div>
          </motion.div>
        </div>
        <div className="grid gap-6">
          {trendingData.map((tech, index) => (<TrendingCard key={tech.name} tech={tech} index={index} navigate={navigate} />))}
        </div>
      </div>
    </div>
  );
};

const TrendingCard = ({ tech, index, navigate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
    onClick={() => navigate('/technologies')} className="group relative cursor-pointer">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-glow)] to-transparent rounded-2xl opacity-0 group-hover:opacity-50 blur transition duration-500" />
    <div className="relative bg-[var(--bg-card)] backdrop-blur-xl border border-th-main rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 transition-colors duration-300">
      <div className="flex-shrink-0 relative">
        <div className="text-6xl font-display font-bold text-th-dimmed opacity-30 group-hover:opacity-50 transition-colors">#{tech.rank}</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`w-16 h-16 rounded-2xl ${tech.bg} flex items-center justify-center border border-th-main group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
            <div className={tech.color}>{tech.icon}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
          <h3 className="text-2xl font-bold text-th-primary group-hover:text-th-secondary transition-colors">{tech.name}</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-th-pill text-th-muted border border-th-subtle">{tech.category}</span>
        </div>
        <p className="text-th-secondary max-w-2xl">{tech.description}</p>
      </div>
      <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-th-main pt-4 md:pt-0 md:pl-8 w-full md:w-auto justify-between md:justify-end">
        <div className="text-center"><div className="flex items-center justify-center gap-1 text-green-400 font-bold text-lg"><TrendingUp className="w-4 h-4" /> {tech.growth}</div><div className="text-xs text-th-muted uppercase tracking-wider">Growth</div></div>
        <div className="text-center"><div className="flex items-center justify-center gap-1 text-th-primary font-bold text-lg"><Activity className="w-4 h-4 text-orange-500" /> {tech.users}</div><div className="text-xs text-th-muted uppercase tracking-wider">Adoption</div></div>
        <div className="hidden md:block"><button className="p-3 rounded-full border border-th-main hover:bg-th-pill text-th-primary transition-colors"><ArrowUpRight className="w-5 h-5" /></button></div>
      </div>
    </div>
  </motion.div>
);

export default Trending;