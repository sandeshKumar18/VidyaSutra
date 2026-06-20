import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate 
} from 'framer-motion';
import { 
  Heart, Search, Zap, ChevronRight, Code2, Database, Cpu, 
  Trash2, Play, LayoutGrid, List, ChevronDown, Check, Clock, Sparkles
} from 'lucide-react';

const INITIAL_DATA = [
  { _id: '1', name: 'React.js', slug: 'reactjs', shortDescription: 'A JavaScript library for building user interfaces.', category: 'Frontend', isTrending: true, tags: ['frontend', 'ui'],
    icon: <Code2 className="w-full h-full" />, color: 'text-cyan-400', progress: { percentage: 68, lastUpdated: '2d ago' } },
  { _id: '3', name: 'MongoDB', slug: 'mongodb', shortDescription: 'Flexible NoSQL database for modern applications.', category: 'Database', isTrending: true, tags: ['database', 'backend'],
    icon: <Database className="w-full h-full" />, color: 'text-emerald-400', progress: { percentage: 25, lastUpdated: '1w ago' } },
  { _id: '5', name: 'Neural Nets', slug: 'neural-networks', shortDescription: 'Deep learning algorithms modeled after the brain.', category: 'AI/ML', isTrending: true, tags: ['ai', 'python'],
    icon: <Cpu className="w-full h-full" />, color: 'text-purple-400', progress: null },
];

const TiltCard = ({ children, className = "", onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }
  return (
    <motion.div ref={ref} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: useTransform(mouseY, [-50, 50], [2, -2]), rotateY: useTransform(mouseX, [-50, 50], [-2, 2]), transformStyle: "preserve-3d" }}
      className={`relative group cursor-pointer ${className}`}>
      <div style={{ transform: "translateZ(0px)" }} className="h-full bg-[var(--bg-card)] backdrop-blur-md border border-th-main rounded-[24px] overflow-hidden relative shadow-lg transition-all duration-500 group-hover:border-th-input">
        <motion.div style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, var(--bg-pill), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 h-full p-6">{children}</div>
      </div>
    </motion.div>
  );
};

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedLabel = options.find(o => o.value === value)?.label || value;
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-th-pill hover:bg-th-pill-active text-sm text-th-secondary transition-colors border border-transparent hover:border-th-main">
        <span className="text-th-muted font-medium">Sort:</span>
        <span className="text-th-primary font-bold">{selectedLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-40 bg-th-elevated border border-th-main rounded-xl shadow-2xl z-50 overflow-hidden">
            {options.map((option) => (
              <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-th-secondary hover:bg-th-pill hover:text-th-primary transition-colors">
                {option.label}{value === option.value && <Check className="w-3 h-3 text-th-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Favourites = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  const handleRemove = (e, id) => { e.stopPropagation(); setItems(prev => prev.filter(item => item._id !== id)); };

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'progress') return (b.progress?.percentage || 0) - (a.progress?.percentage || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-th-base text-th-primary pt-8 pb-20 px-6 relative overflow-hidden font-sans transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 relative z-50">
          <div>
            <div className="flex items-center gap-2 text-th-secondary mb-3 font-mono text-xs tracking-[0.2em] uppercase"><Heart className="w-4 h-4 fill-current animate-pulse" /><span>Saved Protocols</span></div>
            <h1 className="text-5xl font-black tracking-tight">My <span className="text-th-muted">Arsenal</span></h1>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-card)] backdrop-blur-xl border border-th-main rounded-2xl shadow-2xl relative z-50">
            <div className="relative group px-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-muted group-focus-within:text-th-primary transition-colors" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search favourites.."
                className="w-32 md:w-48 bg-transparent border-none text-sm text-th-primary placeholder-th-dimmed pl-9 pr-2 py-2 focus:ring-0 transition-all focus:w-56" />
            </div>
            <div className="w-px h-6 bg-th-main" />
            <CustomDropdown value={sortBy} onChange={setSortBy} options={[{ value: 'recent', label: 'Recent' }, { value: 'progress', label: 'Progress' }, { value: 'name', label: 'Name' }]} />
            <div className="w-px h-6 bg-th-main" />
            <div className="flex bg-th-base rounded-lg p-1 border border-th-subtle">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-th-pill-active text-th-primary shadow-inner' : 'text-th-muted hover:text-th-secondary'}`}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-th-pill-active text-th-primary shadow-inner' : 'text-th-muted hover:text-th-secondary'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <motion.div layout className={`grid gap-6 relative z-0 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((tech) => (
              <motion.div key={tech._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: 0.2 }}>
                <TiltCard onClick={() => navigate(`/technologies/${tech.slug}`)} className={viewMode === 'list' ? 'h-auto' : 'h-full'}>
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-8' : 'flex flex-col h-full'}`}>
                    <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/3' : 'mb-6'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-th-base border border-th-main shadow-inner group-hover:scale-110 transition-transform duration-300 ${tech.color}`}>{tech.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-th-primary group-hover:text-th-secondary transition-colors">{tech.name}</h3>
                          <span className="text-[10px] font-bold text-th-muted uppercase tracking-wider bg-th-pill px-2 py-0.5 rounded-full">{tech.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex-1 ${viewMode === 'list' ? 'px-4' : 'mb-8'}`}>
                      {tech.progress ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs"><span className="text-th-secondary font-medium">Sync Status</span><span className="text-th-primary font-bold">{tech.progress.percentage}%</span></div>
                          <div className="w-full bg-th-pill rounded-full h-1.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${tech.progress.percentage}%` }} className="h-full rounded-full" style={{ background: 'var(--accent-bg)', boxShadow: `0 0 12px var(--accent-glow)` }} />
                          </div>
                          {viewMode === 'grid' && <div className="flex items-center gap-1.5 text-[10px] text-th-muted"><Clock className="w-3 h-3" /><span>Last active {tech.progress.lastUpdated}</span></div>}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-th-pill border border-th-subtle"><div className="w-2 h-2 rounded-full bg-th-dimmed" /><span className="text-xs font-medium text-th-secondary">Not initialized</span></div>
                      )}
                    </div>
                    <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'w-52 shrink-0' : 'mt-auto'}`}>
                      <button className="flex-1 group/btn relative overflow-hidden rounded-xl font-bold py-3 px-6 transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          {tech.progress ? <Play className="w-4 h-4" style={{ fill: 'var(--accent-text)' }} /> : <Zap className="w-4 h-4" style={{ fill: 'var(--accent-text)' }} />}
                          <span className="text-sm">{tech.progress ? 'Resume' : 'Start'}</span>
                        </div>
                      </button>
                      <button onClick={(e) => handleRemove(e, tech._id)}
                        className="p-3 rounded-xl border border-th-main bg-[var(--bg-card)] text-th-muted hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all active:scale-95" title="Remove from arsenal">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 border border-dashed border-th-main rounded-[3rem] bg-[var(--bg-card)]">
            <div className="w-24 h-24 bg-th-elevated rounded-full flex items-center justify-center mb-6 border border-th-main shadow-inner"><Sparkles className="w-10 h-10 text-th-dimmed" /></div>
            <h3 className="text-2xl font-bold text-th-primary mb-2">Empty Arsenal</h3>
            <p className="text-th-muted mb-8 max-w-md text-center">Your saved protocols will appear here. Start exploring the radar to build your stack.</p>
            <button onClick={() => navigate('/technologies')} className="px-8 py-3 font-bold rounded-xl transition-all flex items-center gap-2"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
              <Zap className="w-4 h-4" /> Initialize Discovery
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favourites;