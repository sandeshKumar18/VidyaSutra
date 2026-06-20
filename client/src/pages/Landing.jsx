import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  motion, useScroll, useTransform, useSpring, useMotionValue 
} from 'framer-motion';
import { 
  ArrowRight, Terminal, Cpu, Shield, Zap, Layout, 
  Code2, Command, Globe, BarChart3, Database,
  Server, Lock, Activity, CheckCircle2, Play, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const STREAM_1 = [
  { name: 'React', icon: Code2, color: 'text-blue-400' },
  { name: 'Node.js', icon: Server, color: 'text-emerald-400' },
  { name: 'TypeScript', icon: Terminal, color: 'text-blue-500' },
  { name: 'Docker', icon: Layout, color: 'text-blue-400' },
];
const STREAM_2 = [
  { name: 'Python', icon: Terminal, color: 'text-yellow-400' },
  { name: 'AWS', icon: Globe, color: 'text-orange-400' },
  { name: 'PostgreSQL', icon: Database, color: 'text-blue-300' },
  { name: 'Security', icon: Shield, color: 'text-red-400' },
];
const STREAM_3 = [
  { name: 'GraphQL', icon: Activity, color: 'text-pink-400' },
  { name: 'Rust', icon: Cpu, color: 'text-orange-500' },
  { name: 'Kubernetes', icon: Layout, color: 'text-blue-500' },
  { name: 'Auth0', icon: Lock, color: 'text-red-500' },
];

const CustomCursor = () => {
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 20, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  useEffect(() => {
    const moveCursor = (e) => { cursorX.set(e.clientX - 10); cursorY.set(e.clientY - 10); };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);
  return (
    <motion.div className="fixed top-0 left-0 w-5 h-5 mix-blend-difference rounded-full pointer-events-none z-[100] hidden md:block"
      style={{ translateX: cursorXSpring, translateY: cursorYSpring, background: 'var(--accent-bg)' }} />
  );
};

const TechCard = ({ name, icon: Icon, color }) => (
  <div className="group relative p-4 mb-4 rounded-xl border border-th-subtle bg-[var(--bg-card)] backdrop-blur-sm hover:bg-[var(--bg-card-hover)] transition-all duration-300 cursor-default hover:border-th-input hover:scale-105 hover:shadow-2xl">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-th-pill ${color} group-hover:scale-110 transition-transform duration-300`}><Icon className="w-6 h-6" /></div>
      <div>
        <div className="text-sm font-bold text-th-secondary group-hover:text-th-primary transition-colors">{name}</div>
        <div className="text-[10px] text-th-muted font-mono uppercase tracking-wider">Roadmap Available</div>
      </div>
    </div>
  </div>
);

const InfiniteColumn = ({ items, duration = 20, reverse = false }) => (
  <div className="relative flex flex-col overflow-hidden h-[600px] w-full opacity-30 hover:opacity-100 transition-opacity duration-700 mask-gradient">
    <motion.div className="flex flex-col" animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
      {[...items, ...items, ...items, ...items].map((item, i) => (<TechCard key={i} {...item} />))}
    </motion.div>
    <div className="absolute inset-x-0 top-0 h-32 z-10" style={{ background: 'linear-gradient(to bottom, var(--bg-base), transparent)' }} />
    <div className="absolute inset-x-0 bottom-0 h-32 z-10" style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }} />
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-th-base text-th-primary font-sans relative overflow-x-hidden transition-colors duration-300">
      <CustomCursor />
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-th-main bg-[var(--bg-nav)] backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm" style={{ background: 'var(--logo-bg)', boxShadow: `0 0 10px var(--logo-glow)` }} />
            <span className="font-semibold tracking-tight text-lg text-th-primary">VidyaSetu</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-th-subtle text-th-muted hover:text-th-primary hover:bg-th-pill transition-all">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm text-th-secondary hover:text-th-primary transition-colors">Log in</Link>
                <Link to="/register" className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>Sign up</Link>
              </>
            ) : (
              <Link to="/technologies" className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>Dashboard</Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-th-main bg-th-pill text-th-secondary text-xs mb-8 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Developed by Sandesh Kumar
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Master the Skills. <br /><span className="text-th-muted">Skip the noise.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-th-secondary max-w-md mb-10 leading-relaxed">
              VidyaSetu uses Gemini AI to generate precise, step-by-step learning roadmaps for any technology and skills. <br></br> Stop searching, start building.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4">
              <button onClick={() => navigate(isAuthenticated ? '/technologies' : '/register')}
                className="h-12 px-8 rounded-full font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
                {isAuthenticated ? 'Enter Dashboard' : 'Start Free'} <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-12 px-8 rounded-full border border-th-main hover:bg-th-pill transition-all text-th-secondary flex items-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-12 flex items-center gap-4 text-xs text-th-muted font-mono">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (<div key={i} className="w-8 h-8 rounded-full bg-th-elevated border-2 border-th-base flex items-center justify-center text-th-primary font-bold">{i}</div>))}
              </div>
              <p>Trusted by 10,000+ learners</p>
            </motion.div>
          </div>
          <div className="relative h-[600px] w-full hidden lg:flex gap-4 perspective-1000">
            <div className="absolute inset-0 z-20 pointer-events-none" style={{ background: `linear-gradient(to bottom, var(--bg-base), transparent, var(--bg-base))` }} />
            <div className="flex-1 pt-20"><InfiniteColumn items={STREAM_1} duration={45} /></div>
            <div className="flex-1"><InfiniteColumn items={STREAM_2} duration={35} reverse={true} /></div>
            <div className="flex-1 pt-40"><InfiniteColumn items={STREAM_3} duration={50} /></div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 border-y border-th-main bg-[var(--bg-card)] transition-colors">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox label="Active Users" value="12k+" icon={Globe} />
          <StatBox label="Roadmaps Generated" value="85k+" icon={Command} />
          <StatBox label="Sectors Covered" value="120+" icon={Layout} />
          <StatBox label="Completion Rate" value="94%" icon={CheckCircle2} />
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why VidyaSetu?</h2>
            <p className="text-th-secondary max-w-xl text-lg">We replaced static video tutorials with dynamic, interactive protocols.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoCard colSpan="md:col-span-2" title="AI-Powered Curriculum" desc="Enter 'Quantum Computing' or 'Salesforce'. Our engine builds a complete syllabus in seconds." icon={Zap} gradient="from-indigo-500/20 to-purple-500/20" />
            <BentoCard title="Progress Sync" desc="Cross-device synchronization for every node you complete." icon={Activity} gradient="from-emerald-500/20 to-teal-500/20" />
            <BentoCard title="Skill Verification" desc="Earn cryptographic badges for every sector you master." icon={Shield} gradient="from-orange-500/20 to-red-500/20" />
            <BentoCard colSpan="md:col-span-2" title="Global Taxonomy" desc="Access a database of 100+ specialized sectors, from Aerospace to Zoology." icon={Globe} gradient="from-blue-500/20 to-cyan-500/20" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter">Ready to <span className="text-th-dimmed">Ship?</span></h2>
          <p className="text-xl text-th-secondary mb-10">Join the new standard of technical education.</p>
          <button onClick={() => navigate(isAuthenticated ? '/technologies' : '/register')}
            className="px-10 py-5 text-xl font-bold rounded-full hover:scale-105 transition-transform"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 50px var(--accent-glow)` }}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-th-main bg-th-base transition-colors">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-th-muted text-sm">© 2026 VidyaSetu. All Rights Reserved. <br/>Transforming Educational Resources into Personalized Learning Paths.</div>
          <div className="flex gap-8 text-sm font-medium text-th-secondary">
            Connect with us
            <a href="https://www.linkedin.com/in/sandesh-kumar-1a3628328/" className="hover:text-th-primary transition-colors">LinkedIn</a>
            <a href="https://github.com/sandeshKumar18" className="hover:text-th-primary transition-colors">GitHub</a>
            <a href="mailto:sandeshbaghel7@gmail.com" className="hover:text-th-primary transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-th-muted mb-2"><Icon className="w-4 h-4" /><span className="text-xs font-mono uppercase tracking-wider">{label}</span></div>
    <div className="text-4xl font-bold text-th-primary">{value}</div>
  </div>
);

const BentoCard = ({ title, desc, icon: Icon, gradient, colSpan = "" }) => (
  <div className={`relative overflow-hidden rounded-3xl border border-th-subtle bg-[var(--bg-card)] p-8 hover:bg-[var(--bg-card-hover)] transition-colors group ${colSpan}`}>
    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradient} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-th-pill flex items-center justify-center mb-6 border border-th-subtle group-hover:scale-110 transition-transform"><Icon className="w-6 h-6 text-th-primary" /></div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-th-secondary leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Landing;