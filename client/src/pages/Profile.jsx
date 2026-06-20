import React, { useEffect, useState, useRef } from "react";
import { 
  User, Calendar, Award, Target, Clock, Zap, Edit3, Save, X, 
  Cpu, Shield, Terminal, Activity, ChevronRight, Fingerprint, 
  Hash, Mail, Sparkles
} from "lucide-react";
import { 
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate 
} from "framer-motion";
import api from "../services/api";

const AVATAR_PRESETS = [
  { id: "avatar1", label: "Alpha", color: "#a3a3a3", gradient: "from-neutral-600 to-neutral-400" },
  { id: "avatar2", label: "Beta", color: "#ec4899", gradient: "from-pink-600 to-rose-400" },
  { id: "avatar3", label: "Gamma", color: "#10b981", gradient: "from-emerald-600 to-teal-400" },
  { id: "avatar4", label: "Delta", color: "#f59e0b", gradient: "from-amber-600 to-orange-400" },
];

const TiltCard = ({ children, className = "" }) => {
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
    <motion.div ref={ref} onMouseMove={onMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: useTransform(mouseY, [-50, 50], [2, -2]), rotateY: useTransform(mouseX, [-50, 50], [-2, 2]), transformStyle: "preserve-3d" }}
      className={`relative group ${className}`}>
      <div style={{ transform: "translateZ(0px)" }} className="h-full bg-[var(--bg-card)] backdrop-blur-xl border border-th-main rounded-[2rem] overflow-hidden relative shadow-2xl transition-all duration-500">
        <motion.div style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, var(--bg-pill), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 h-full p-8">{children}</div>
      </div>
    </motion.div>
  );
};

const NeonRing = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx="80" cy="80" r={radius} stroke="var(--border-main)" strokeWidth="8" fill="transparent" />
        <circle cx="80" cy="80" r={radius} stroke="var(--accent-bg)" strokeWidth="8" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-th-primary">{percentage}%</span>
        <span className="text-[10px] uppercase tracking-widest text-th-muted">Synced</span>
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", experienceLevel: "Beginner", interestsText: "", avatarPreset: "avatar1", avatarColor: "#a3a3a3" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const res = await api.get("/users/profile");
        const user = res.data?.data?.user || res.data?.user || res.data;
        setProfile(user);
        setFormData({ name: user.name || "", bio: user.bio || "", experienceLevel: user.experienceLevel || "Beginner",
          interestsText: Array.isArray(user.interests) ? user.interests.join(", ") : "",
          avatarPreset: user.avatar?.presetOption || "avatar1", avatarColor: user.avatar?.color || "#a3a3a3" });
      } catch (err) { console.error("Failed to load profile:", err); }
      finally { setIsLoadingProfile(false); }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const interestsArray = formData.interestsText.split(",").map(s => s.trim()).filter(Boolean);
      const payload = { name: formData.name, bio: formData.bio, experienceLevel: formData.experienceLevel, interests: interestsArray,
        avatar: { type: "preset", presetOption: formData.avatarPreset, color: formData.avatarColor } };
      const res = await api.put("/users/profile", payload);
      setProfile(res.data?.data?.user || res.data?.user || payload);
      setIsEditing(false);
    } catch (err) { console.error("Update failed", err); }
    finally { setIsSaving(false); }
  };

  if (isLoadingProfile) return (
    <div className="min-h-screen bg-th-base flex items-center justify-center transition-colors">
      <div className="relative"><div className="w-20 h-20 border-4 border-t-[var(--accent-bg)] border-r-th-main border-b-transparent border-l-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-th-primary animate-pulse">LOAD</div></div>
    </div>
  );
  if (!profile) return null;

  const stats = profile.stats || { totalTechnologies: 0, completedTechnologies: 0, inProgressTechnologies: 0, totalHoursSpent: 0, streak: 0, level: 1 };
  const completionPct = stats.totalTechnologies > 0 ? Math.round((stats.completedTechnologies / stats.totalTechnologies) * 100) : 0;
  const recentProgress = [{ technology: "React.js", progress: 68, lastUpdated: "2d ago" }, { technology: "Node.js", progress: 45, lastUpdated: "1w ago" }, { technology: "MongoDB", progress: 30, lastUpdated: "2w ago" }];
  const currentAvatar = AVATAR_PRESETS.find(p => p.id === formData.avatarPreset) || AVATAR_PRESETS[0];
  const inputCls = "w-full bg-th-base border border-th-input rounded-xl px-4 py-3 text-th-primary focus:border-[var(--border-input-focus)] outline-none transition-colors font-mono text-sm";

  return (
    <div className="min-h-screen bg-th-base text-th-primary pt-8 pb-20 px-6 relative overflow-x-hidden font-sans transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-th-secondary mb-3 font-mono text-xs tracking-[0.2em] uppercase"><Fingerprint className="w-4 h-4" /> Account Overview</div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">User <span className="text-th-muted">Profile</span></h1>
          </div>
          <div className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-th-main flex items-center gap-3 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-bold text-th-secondary tracking-wider">YOUR DESCRIPTIVE INFORMATION</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <TiltCard className="h-full">
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative mb-8 group cursor-pointer">
                  <div className="relative w-36 h-36 rounded-full flex items-center justify-center text-5xl font-black text-white border-4 border-th-base shadow-2xl z-10 bg-gradient-to-br"
                    style={{ backgroundImage: `linear-gradient(135deg, ${currentAvatar.color}, #18181b)` }}>
                    {profile.name?.charAt(0).toUpperCase()}<div className="absolute inset-2 border border-white/20 rounded-full" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-th-base border border-th-main px-3 py-1 rounded-full text-xs font-bold text-th-primary shadow-xl z-20 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-th-secondary" /> LVL {stats.level}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-th-primary mb-1 tracking-tight">{profile.name}</h2>
                <div className="flex items-center gap-2 text-th-muted text-sm font-mono mb-6"><Mail className="w-3 h-3" /> {profile.email}</div>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <span className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wide ${
                    profile.experienceLevel === 'Beginner' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    profile.experienceLevel === 'Intermediate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{profile.experienceLevel}</span>
                  <span className="px-3 py-1 rounded-lg bg-th-pill border border-th-main text-xs text-th-secondary flex items-center gap-1">
                    <Calendar className="w-3 h-3" />Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="w-full bg-th-base rounded-2xl p-4 text-left border border-th-subtle mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: 'var(--accent-bg)', opacity: 0.3 }} />
                  <div className="text-[10px] font-mono text-th-muted mb-2 uppercase tracking-widest">Directive / Bio</div>
                  <p className="text-sm text-th-secondary leading-relaxed italic">"{profile.bio || "No directive established. Operative is currently in stealth mode."}"</p>
                </div>
                <button onClick={() => setIsEditing(!isEditing)}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
                  <Edit3 className="w-4 h-4" /> {isEditing ? 'Close Interface' : 'Update Credentials'}
                </button>
              </div>
            </TiltCard>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {isEditing && (
                <motion.div initial={{ opacity: 0, height: 0, y: -20 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -20 }} className="overflow-hidden">
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-th-main rounded-[2rem] p-8 shadow-2xl relative transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-bg)] to-transparent opacity-20" />
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold text-th-primary flex items-center gap-2"><Cpu className="w-5 h-5 text-th-secondary" /> Neural Configuration</h3>
                      <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-th-pill rounded-full transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputGroup label="Identity Name"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} /></InputGroup>
                        <InputGroup label="Clearance Level">
                          <select value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})} className={`${inputCls} appearance-none cursor-pointer`}>
                            <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                          </select>
                        </InputGroup>
                      </div>
                      <InputGroup label="Primary Directive (Bio)"><textarea rows={2} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={inputCls} /></InputGroup>
                      <InputGroup label="Active Protocols (Interests)">
                        <div className="relative"><Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-th-dimmed" />
                          <input type="text" value={formData.interestsText} onChange={e => setFormData({...formData, interestsText: e.target.value})} placeholder="e.g. React, Cybersecurity" className={`${inputCls} pl-10`} />
                        </div>
                      </InputGroup>
                      <div><label className="text-xs font-bold text-th-muted uppercase tracking-wider mb-3 block">Avatar Matrix</label>
                        <div className="flex gap-4">{AVATAR_PRESETS.map((preset) => (
                          <button key={preset.id} type="button" onClick={() => setFormData({...formData, avatarPreset: preset.id, avatarColor: preset.color})}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${formData.avatarPreset === preset.id ? 'border-[var(--accent-bg)] scale-110' : 'border-transparent opacity-50 hover:opacity-100 bg-th-pill'}`}
                            style={{ background: formData.avatarPreset === preset.id ? preset.color : undefined }}>
                            {formData.avatarPreset === preset.id && <Sparkles className="w-5 h-5 text-white" />}
                          </button>
                        ))}</div>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-th-subtle">
                        <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                          style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 20px var(--accent-glow)` }}>
                          {isSaving ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />} Save Configuration
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox icon={Target} label="Technologies" value={stats.totalTechnologies} color="text-cyan-400" />
              <StatBox icon={Clock} label="Uptime Hours" value={stats.totalHoursSpent} color="text-emerald-400" />
              <StatBox icon={Award} label="Sync Streak" value={stats.streak} color="text-amber-400" />
              <StatBox icon={Zap} label="User Level" value={stats.level} color="text-purple-400" />
            </div>
            <TiltCard>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6 w-full">
                  <div><h3 className="text-xl font-bold text-th-primary flex items-center gap-2 mb-2"><Activity className="w-5 h-5 text-th-secondary" /> System Completion</h3>
                    <p className="text-th-secondary text-sm">Overall synchronization across all active protocols.</p></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-th-base border border-th-subtle"><div className="text-xs text-th-muted uppercase tracking-widest mb-1">Done</div><div className="text-2xl font-black text-th-primary">{stats.completedTechnologies}</div></div>
                    <div className="p-4 rounded-2xl bg-th-base border border-th-subtle"><div className="text-xs text-th-muted uppercase tracking-widest mb-1">Active</div><div className="text-2xl font-black text-th-primary">{stats.inProgressTechnologies}</div></div>
                  </div>
                </div>
                <NeonRing percentage={completionPct} />
              </div>
            </TiltCard>
            <div className="bg-[var(--bg-card)] border border-th-main rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden transition-colors">
              <div className="flex items-center gap-2 mb-6 text-th-muted font-mono text-xs uppercase tracking-widest"><Terminal className="w-4 h-4" /> Recent_Activity</div>
              <div className="space-y-4">
                {recentProgress.map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-th-pill border border-th-subtle hover:bg-th-pill-active transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-th-base flex items-center justify-center text-th-secondary border border-th-subtle font-mono text-sm">0{i+1}</div>
                      <div><div className="text-th-primary font-bold">{item.technology}</div><div className="text-xs text-th-muted font-mono">UPDATED: {item.lastUpdated.toUpperCase()}</div></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block"><div className="text-sm font-bold text-th-primary">{item.progress}%</div><div className="text-[10px] text-th-dimmed uppercase">Synced</div></div>
                      <ChevronRight className="w-4 h-4 text-th-dimmed group-hover:text-th-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, color }) => (
  <div className="bg-[var(--bg-card)] border border-th-subtle p-5 rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-[var(--bg-card-hover)] transition-colors group">
    <div className={`mb-3 p-3 rounded-xl bg-th-base border border-th-main ${color} group-hover:scale-110 transition-transform shadow-lg`}><Icon className="w-5 h-5" /></div>
    <div className="text-2xl font-black text-th-primary">{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-th-muted font-bold mt-1">{label}</div>
  </div>
);

const InputGroup = ({ label, children }) => (
  <div className="space-y-2"><label className="text-xs font-bold text-th-muted uppercase tracking-wider ml-1">{label}</label>{children}</div>
);

export default Profile;