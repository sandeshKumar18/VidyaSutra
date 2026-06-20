import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
  Layout, Target, Zap, Award, Sparkles, ChevronLeft, 
  CheckCircle2, Lock, PlayCircle, BookOpen, 
  Terminal, Shield, Trophy, Star, Flame, ArrowRight,
  Gift, Medal, Clock, TrendingUp, ChevronRight
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════
   GAMIFICATION CONFIG 
   ═══════════════════════════════════════════════ */
const XP_PER_STEP = 150;
const RANKS = [
  { min: 0,   label: 'Novice',     icon: '🌱', color: 'text-emerald-400' },
  { min: 150, label: 'Apprentice', icon: '⚡', color: 'text-blue-400' },
  { min: 300, label: 'Adept',      icon: '🔥', color: 'text-orange-400' },
  { min: 600, label: 'Expert',     icon: '💎', color: 'text-purple-400' },
  { min: 900, label: 'Master',     icon: '👑', color: 'text-yellow-400' },
];
const MILESTONES = [
  { id: 'first_step', label: 'First Blood', desc: 'Complete your first module', icon: '🎯', check: (c) => c >= 1 },
  { id: 'halfway',    label: 'Halfway Hero', desc: 'Complete 50% of the roadmap', icon: '⚡', check: (c, t) => t > 0 && c >= Math.ceil(t / 2) },
  { id: 'finisher',   label: 'Protocol Master', desc: 'Complete all modules',     icon: '👑', check: (c, t) => t > 0 && c >= t },
];

const getRank = (xp) => [...RANKS].reverse().find(r => xp >= r.min) || RANKS[0];
const getNextRank = (xp) => RANKS.find(r => r.min > xp) || null;

/* ═══════════════════════════════════════════════
   CONFETTI BURST (CSS-only, no deps)
   ═══════════════════════════════════════════════ */
const ConfettiBurst = ({ trigger }) => {
  if (!trigger) return null;
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: -(Math.random() * 300 + 100),
    r: Math.random() * 720 - 360,
    s: Math.random() * 0.5 + 0.5,
    color: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c'][i % 6],
    delay: Math.random() * 0.3,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {particles.map((p) => (
        <motion.div key={p.id}
          initial={{ x: '50vw', y: '40vh', scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: `calc(50vw + ${p.x}px)`, y: `calc(40vh + ${p.y}px)`, scale: p.s, rotate: p.r, opacity: 0 }}
          transition={{ duration: 1.5, delay: p.delay, ease: 'easeOut' }}
          className="absolute w-3 h-3 rounded-sm" style={{ background: p.color }} />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   XP PROGRESS BAR
   ═══════════════════════════════════════════════ */
const XPBar = ({ currentXP, totalXP }) => {
  const rank = getRank(currentXP);
  const nextRank = getNextRank(currentXP);
  const pct = nextRank ? ((currentXP - rank.min) / (nextRank.min - rank.min)) * 100 : 100;

  return (
    <div className="bg-[var(--bg-card)] border border-th-main rounded-2xl p-5 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{rank.icon}</span>
          <div>
            <div className={`text-sm font-bold ${rank.color}`}>{rank.label}</div>
            <div className="text-[10px] text-th-muted font-mono">{currentXP} / {totalXP} XP</div>
          </div>
        </div>
        {nextRank && (
          <div className="flex items-center gap-1.5 text-[10px] text-th-dimmed">
            <span>{nextRank.min - currentXP} XP to</span>
            <span className={`font-bold ${nextRank.color}`}>{nextRank.icon} {nextRank.label}</span>
          </div>
        )}
      </div>
      <div className="w-full bg-th-pill rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)' }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" 
            style={{ animation: 'shimmer 2s infinite', backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MILESTONE BADGES
   ═══════════════════════════════════════════════ */
const MilestoneBadges = ({ completedCount, totalCount }) => (
  <div className="flex gap-3">
    {MILESTONES.map((m) => {
      const earned = m.check(completedCount, totalCount);
      return (
        <motion.div key={m.id}
          animate={earned ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
            earned 
              ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10' 
              : 'bg-[var(--bg-input)] border-th-subtle opacity-40 grayscale'}`}
          title={earned ? `${m.label}: ${m.desc}` : `🔒 ${m.desc}`}
        >
          <span className="text-lg">{m.icon}</span>
          <div className="hidden sm:block">
            <div className="text-[10px] font-bold text-th-primary">{m.label}</div>
            <div className="text-[9px] text-th-muted">{m.desc}</div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════════
   RESOURCE CARD
   ═══════════════════════════════════════════════ */
const ResourceCard = ({ resource, index }) => {
  const icons = {
    article: <BookOpen className="w-4 h-4" />,
    video: <PlayCircle className="w-4 h-4" />,
    quest: <Shield className="w-4 h-4" />,
    'pro-tip': <Sparkles className="w-4 h-4" />,
    interview: <Terminal className="w-4 h-4" />
  };
  const typeColors = {
    quest: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    video: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    article: 'bg-th-pill text-th-secondary border-th-subtle',
    'pro-tip': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    interview: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  return (
    <motion.a href={resource.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-th-main hover:border-th-input hover:shadow-md transition-all duration-200">
      <div className={`p-2.5 rounded-lg border ${typeColors[resource.type] || typeColors.article}`}>
        {icons[resource.type] || <BookOpen className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-th-primary group-hover:text-th-secondary transition-colors truncate">{resource.title}</h4>
        <span className="text-[10px] uppercase tracking-wider text-th-dimmed font-bold">{resource.type.replace('-', ' ')}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-th-dimmed group-hover:text-th-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </motion.a>
  );
};

/* ═══════════════════════════════════════════════
   STEP TIMELINE NODE
   ═══════════════════════════════════════════════ */
const StepNode = ({ step, index, isActive, isCompleted, isLocked, onClick }) => (
  <button onClick={() => !isLocked && onClick(index)} disabled={isLocked}
    className={`w-full text-left transition-all duration-200 ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all
      ${isActive ? 'bg-[var(--accent-bg)] border-[var(--accent-bg)] shadow-lg' : 
        isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' : 
        'bg-[var(--bg-card)] border-th-subtle hover:border-th-input'}`}>
      
      {/* Step indicator */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold
        ${isActive ? 'bg-[var(--accent-text)] text-[var(--accent-bg)]' : 
          isCompleted ? 'bg-emerald-500 text-white' : 
          isLocked ? 'bg-th-pill text-th-dimmed' : 'bg-th-pill text-th-secondary'}`}>
        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold truncate ${isActive ? 'text-[var(--accent-text)]' : isCompleted ? 'text-emerald-500' : 'text-th-primary'}`}>
          {step.title}
        </div>
        <div className={`text-[10px] font-mono ${isActive ? 'text-[var(--accent-text)] opacity-60' : 'text-th-muted'}`}>
          +{XP_PER_STEP} XP {isCompleted && '✓'}
        </div>
      </div>

      {/* Status badge */}
      {isCompleted && !isActive && (
        <div className="text-emerald-500"><Trophy className="w-4 h-4" /></div>
      )}
    </div>
  </button>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */
const TechnologyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [userProgress, setUserProgress] = useState({ steps: [] });
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const techRes = await api.get(`/technologies/${slug}`);
        const tech = techRes.data?.data?.technology;
        if (tech) {
          setTechnology(tech);
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const userRes = await api.get('/auth/me', { _skipAuthRedirect: true });
              const user = userRes.data?.data?.user;
              const progress = user?.progress?.find(p => {
                const pTechId = p.technology?._id || p.technology;
                return pTechId?.toString() === tech._id?.toString();
              });
              if (progress) setUserProgress(progress);
            } catch (authErr) {
              if (authErr.response?.status === 401) localStorage.removeItem('token');
            }
          }
        }
      } catch (err) {
        if (err.response?.status !== 401) toast.error("Could not load roadmap.");
      } finally { setLoading(false); }
    };
    fetchData();
  }, [slug]);

  const handleStatusUpdate = async (stepIndex, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Login to track progress");
    const previousProgress = { ...userProgress, steps: [...(userProgress.steps || [])] };
    
    setUserProgress(prev => {
      const newSteps = [...(prev?.steps || [])];
      const idx = newSteps.findIndex(s => s.stepIndex === stepIndex);
      const updatedStep = { stepIndex, status: newStatus, notes: newSteps[idx]?.notes || '' };
      if (idx >= 0) newSteps[idx] = updatedStep; else newSteps.push(updatedStep);
      return { ...prev, steps: newSteps };
    });

    if (newStatus === 'completed') {
      setJustCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => setJustCompleted(false), 1500);
    }

    try {
      await api.put(`/technologies/${slug}/progress`, { stepIndex, status: newStatus }, { _skipAuthRedirect: true });
      if (newStatus === 'completed') {
        const newCompleted = (userProgress?.steps?.filter(s => s.status === 'completed').length || 0) + 1;
        const total = technology?.roadmap?.length || 0;
        
        if (newCompleted === total) {
          toast('🏆 PROTOCOL MASTERED! All modules complete!', { duration: 4000, style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '2px solid #fbbf24' } });
        } else {
          toast.success(`Module Complete! +${XP_PER_STEP} XP`, { icon: '⚡', style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-main)' } });
        }
        // Auto-advance to next step
        if (stepIndex < total - 1) {
          setTimeout(() => setActiveStep(stepIndex + 1), 800);
        }
      }
    } catch (err) { 
      setUserProgress(previousProgress); 
      toast.error("Sync failed"); 
    }
  };

  const completedCount = userProgress?.steps?.filter(s => s.status === 'completed').length || 0;
  const totalCount = technology?.roadmap?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentXP = completedCount * XP_PER_STEP;
  const totalXP = totalCount * XP_PER_STEP;
  const currentRank = getRank(currentXP);

  if (loading) return (
    <div className="h-screen bg-th-base flex flex-col items-center justify-center gap-4 transition-colors">
      <div className="w-16 h-16 border-4 border-th-main border-t-[var(--accent-bg)] rounded-full animate-spin" />
      <div className="text-th-muted font-mono text-sm tracking-widest animate-pulse">LOADING ROADMAP...</div>
    </div>
  );

  if (!technology) return <div className="h-screen bg-th-base flex items-center justify-center text-th-muted transition-colors">Technology not found</div>;

  const currentStepData = technology.roadmap?.[activeStep];
  const currentStepStatus = userProgress?.steps?.find(s => s.stepIndex === activeStep)?.status || 'pending';
  const isCurrentCompleted = currentStepStatus === 'completed';

  return (
    <div className="min-h-screen bg-th-base text-th-primary transition-colors duration-300">
      <Toaster position="top-center" />
      <ConfettiBurst trigger={showConfetti} />

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>

      {/* ─── HERO HEADER ─── */}
      <div className="relative border-b border-th-main overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6 relative z-10">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold text-th-muted hover:text-th-primary mb-6 transition-colors">
            <div className="p-1.5 rounded-lg bg-th-pill border border-th-subtle group-hover:bg-th-pill-active transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></div>
            <span className="uppercase tracking-wider">Back to Radar</span>
          </button>

          {/* Title row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-th-pill border border-th-main text-th-secondary text-[10px] font-bold uppercase tracking-widest mb-3">
                <Target className="w-3 h-3" />{technology.sector || 'General'} Protocol
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{technology.name}</h1>
              <p className="text-th-secondary mt-2 max-w-xl text-sm">{technology.description}</p>
            </div>

            {/* Stats pills */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-th-main rounded-xl">
                <Flame className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-lg font-black text-th-primary leading-none">{currentXP}</div>
                  <div className="text-[9px] text-th-muted font-bold uppercase">Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-th-main rounded-xl">
                <span className="text-lg">{currentRank.icon}</span>
                <div>
                  <div className={`text-sm font-black leading-none ${currentRank.color}`}>{currentRank.label}</div>
                  <div className="text-[9px] text-th-muted font-bold uppercase">Current Rank</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-th-main rounded-xl">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="var(--border-main)" strokeWidth="3" fill="none" />
                    <circle cx="20" cy="20" r="16" stroke={progressPercent === 100 ? '#fbbf24' : 'var(--accent-bg)'} strokeWidth="3" fill="none"
                      strokeDasharray={2 * Math.PI * 16} strokeDashoffset={2 * Math.PI * 16 * (1 - progressPercent / 100)} strokeLinecap="round"
                      className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-th-primary">{progressPercent}%</div>
                </div>
                <div>
                  <div className="text-sm font-black text-th-primary leading-none">{completedCount}/{totalCount}</div>
                  <div className="text-[9px] text-th-muted font-bold uppercase">Modules</div>
                </div>
              </div>
            </div>
          </div>

          {/* XP Bar + Milestones */}
          <div className="space-y-4">
            <XPBar currentXP={currentXP} totalXP={totalXP} />
            <MilestoneBadges completedCount={completedCount} totalCount={totalCount} />
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Step Timeline */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-36">
            <h3 className="text-xs font-bold text-th-muted uppercase tracking-widest px-1 mb-4 flex items-center gap-2">
              <Layout className="w-3.5 h-3.5" /> Learning Path
            </h3>
            <div className="space-y-2">
              {technology.roadmap?.map((step, index) => {
                const stepStatus = userProgress?.steps?.find(s => s.stepIndex === index)?.status || 'pending';
                const isCompleted = stepStatus === 'completed';
                const isActive = activeStep === index;
                const isLocked = index > 0 && userProgress?.steps?.find(s => s.stepIndex === index - 1)?.status !== 'completed';
                return (
                  <StepNode key={index} step={step} index={index} isActive={isActive}
                    isCompleted={isCompleted} isLocked={isLocked} onClick={setActiveStep} />
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Active Step Detail */}
        <div className="lg:col-span-8 xl:col-span-9">
          <AnimatePresence mode='wait'>
            {currentStepData && (
              <motion.div key={activeStep}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Step Header Card */}
                <div className="bg-[var(--bg-card)] border border-th-main rounded-2xl p-6 md:p-8 transition-colors">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-th-pill text-xs font-mono text-th-secondary border border-th-subtle">
                      Module {activeStep + 1} of {totalCount}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-th-pill text-xs font-mono text-th-muted border border-th-subtle flex items-center gap-1">
                      <Clock className="w-3 h-3" />{currentStepData.duration || '~1 hour'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-xs font-bold text-amber-500 border border-amber-500/20 flex items-center gap-1">
                      <Zap className="w-3 h-3" />+{XP_PER_STEP} XP
                    </span>
                    {isCurrentCompleted && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-th-primary mb-3">{currentStepData.title}</h2>
                  <p className="text-th-secondary leading-relaxed">{currentStepData.description}</p>
                </div>

                {/* Action Bar */}
                <div className="bg-[var(--bg-card)] border border-th-main rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs text-th-muted font-bold uppercase">Completion Reward</div>
                      <div className="text-lg font-black text-th-primary">{XP_PER_STEP} XP + Rank Progress</div>
                    </div>
                  </div>

                  {isCurrentCompleted ? (
                    <button onClick={() => handleStatusUpdate(activeStep, 'pending')}
                      className="px-5 py-2.5 bg-th-pill hover:bg-th-pill-active text-th-primary text-xs font-bold rounded-xl border border-th-subtle transition-all">
                      ↩ Undo Completion
                    </button>
                  ) : (
                    <motion.button
                      onClick={() => handleStatusUpdate(activeStep, 'completed')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 font-bold rounded-xl flex items-center gap-2 text-sm transition-all relative overflow-hidden group"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 25px var(--accent-glow)` }}>
                      <span className="relative z-10 flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Complete & Earn XP
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.button>
                  )}
                </div>

                {/* Resources */}
                {currentStepData.resources?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-th-muted uppercase tracking-widest flex items-center gap-2 mb-4">
                      <BookOpen className="w-4 h-4" /> Study Materials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentStepData.resources.map((res, idx) => (
                        <ResourceCard key={idx} resource={res} index={idx} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Next step teaser */}
                {activeStep < totalCount - 1 && !isCurrentCompleted && (
                  <div className="bg-[var(--bg-input)] border border-dashed border-th-main rounded-2xl p-5 flex items-center gap-4 opacity-50">
                    <Lock className="w-5 h-5 text-th-dimmed flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-th-muted uppercase mb-0.5">Up Next</div>
                      <div className="text-sm text-th-secondary">{technology.roadmap[activeStep + 1]?.title}</div>
                    </div>
                  </div>
                )}

                {/* All complete celebration */}
                {progressPercent === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-8 text-center"
                  >
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="text-2xl font-black text-th-primary mb-2">Protocol Mastered!</h3>
                    <p className="text-th-secondary mb-4">You've completed all modules. Total XP earned: <strong className="text-amber-500">{totalXP}</strong></p>
                    <button onClick={() => navigate('/technologies')}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
                      Explore More Technologies
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default TechnologyDetail;