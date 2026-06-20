import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Database, Zap, Loader, CheckCircle, AlertCircle, 
  ChevronDown, Search, Check 
} from 'lucide-react';
import { DOMAINS } from '../data/fieldsData';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const CustomSelect = ({ options, value, onChange, placeholder = "Select option..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (isOpen && searchInputRef.current) setTimeout(() => searchInputRef.current.focus(), 50);
    if (!isOpen) setTimeout(() => setSearchTerm(""), 200);
  }, [isOpen]);
  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter((option) => !searchTerm || (option.label || "").toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[var(--bg-input)] border rounded-xl px-4 py-4 text-left transition-all duration-200 outline-none
          ${isOpen ? 'border-[var(--border-input-focus)] ring-1 ring-[var(--border-input-focus)] bg-th-elevated' : 'border-th-input hover:border-[var(--border-input-focus)] hover:bg-[var(--bg-card-hover)]'}`}>
        <span className={`text-sm font-medium ${selectedOption ? 'text-th-primary' : 'text-th-muted'}`}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-th-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-th-elevated border border-th-main rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-th-subtle sticky top-0 bg-th-elevated z-10" onClick={(e) => e.stopPropagation()}>
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-th-muted" />
                <input ref={searchInputRef} type="text" placeholder="Search sectors..."
                  className="w-full bg-th-base border border-th-subtle rounded-lg pl-8 pr-3 py-2 text-xs text-th-primary focus:outline-none focus:border-[var(--border-input-focus)] transition-colors placeholder-th-dimmed"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} onClick={(e) => e.stopPropagation()} />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); setSearchTerm(""); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left group
                    ${value === option.value ? 'bg-th-pill text-th-primary' : 'text-th-secondary hover:bg-th-pill hover:text-th-primary'}`}>
                  <span>{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4" />}
                </button>
              )) : (<div className="px-4 py-8 text-center text-xs text-th-dimmed">No matching sectors found for "{searchTerm}".</div>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminCreate = () => {
  const navigate = useNavigate();
  const [selectedDomainId, setSelectedDomainId] = useState('');
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [techName, setTechName] = useState('');
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const selectedDomain = DOMAINS.find(d => d.id === selectedDomainId);
  const sectorOptions = selectedDomain ? selectedDomain.sectors.map(s => ({ value: s.id, label: s.name })) : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!techName || !selectedSectorId) return;
    setStatus('processing');
    addLog(`Initializing connection to Core...`);
    addLog(`Target Sector: ${selectedSectorId.toUpperCase()}`);
    addLog(`Subject: ${techName.toUpperCase()}`);
    try {
      addLog(`Requesting AI generation matrix...`);
      const res = await api.post('/technologies', { name: techName, fieldId: selectedSectorId });
      addLog(`> DATA RECEIVED: ${res.data?.data?.name || 'Unknown'}`);
      addLog(`> ROADMAP GENERATED: ${res.data?.data?.roadmap ? 'TRUE' : 'FALSE'}`);
      setStatus('success');
      toast.success('Technology created successfully!');
      setTimeout(() => { navigate(`/technologies/${res.data?.data?.slug || ''}`); }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      addLog(`CRITICAL ERROR: ${err.response?.data?.message || err.message}`);
      toast.error('Failed to create technology.');
    }
  };
  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  return (
    <div className="min-h-screen bg-th-base text-th-primary pt-8 pb-20 px-6 font-sans relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-th-secondary mb-3 font-mono text-xs tracking-[0.2em] uppercase"><Database className="w-4 h-4" /> Admin Console</div>
            <h1 className="text-5xl font-black leading-tight">Initialize <br /><span className="text-th-muted">New Protocol</span></h1>
            <p className="text-th-secondary mt-4 text-lg">Manually inject a new technology. The AI engine will auto-generate the roadmap structure.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-th-muted uppercase tracking-wider ml-1">Select Domain</label>
              <div className="grid grid-cols-2 gap-3">
                {DOMAINS.map((domain) => (
                  <button key={domain.id} type="button" onClick={() => { setSelectedDomainId(domain.id); setSelectedSectorId(''); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedDomainId === domain.id
                        ? 'bg-th-pill border-[var(--accent-bg)] text-th-primary shadow-lg' 
                        : 'bg-[var(--bg-card)] border-th-subtle text-th-secondary hover:bg-[var(--bg-card-hover)] hover:border-th-input'}`}>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${domain.color}`} /><span className="text-xs font-bold truncate">{domain.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence mode='wait'>
              {selectedDomain && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-visible relative z-50">
                  <label className="text-xs font-bold text-th-muted uppercase tracking-wider ml-1">Target Sector</label>
                  <CustomSelect options={sectorOptions} value={selectedSectorId} onChange={setSelectedSectorId} placeholder={`Select a ${selectedDomain.title.split(' ')[0]} Sector...`} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-2 relative z-0">
              <label className="text-xs font-bold text-th-muted uppercase tracking-wider ml-1">Technology Name</label>
              <div className="relative group">
                <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-muted group-focus-within:text-th-primary transition-colors" />
                <input type="text" value={techName} onChange={(e) => setTechName(e.target.value)} placeholder="e.g. Quantum Computing, Commercial Law"
                  className="w-full bg-[var(--bg-input)] border border-th-input rounded-xl pl-12 pr-4 py-4 text-th-primary focus:border-[var(--border-input-focus)] focus:ring-1 focus:ring-[var(--border-input-focus)] outline-none transition-all font-bold placeholder-th-dimmed" />
              </div>
            </div>
            <button type="submit" disabled={status === 'processing' || !techName || !selectedSectorId}
              className="w-full py-4 font-black rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)', boxShadow: `0 0 30px var(--accent-glow)` }}>
              {status === 'processing' ? <><Loader className="w-5 h-5 animate-spin" /> PROCESSING REQ...</> : <><Zap className="w-5 h-5" /> INITIALIZE GENERATION</>}
            </button>
          </form>
        </motion.div>

        {/* Terminal */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="relative h-full min-h-[500px] z-0">
          <div className="absolute inset-0 bg-[var(--bg-card)] border border-th-main rounded-[2rem] backdrop-blur-xl overflow-hidden flex flex-col transition-colors">
            <div className="flex items-center justify-between px-6 py-4 border-b border-th-subtle bg-th-pill">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" /></div>
              <div className="text-[10px] font-mono text-th-muted uppercase tracking-widest">SYSTEM_OUTPUT_V2.0</div>
            </div>
            <div className="flex-1 p-6 font-mono text-xs md:text-sm overflow-y-auto space-y-3 scrollbar-hide text-green-400/80">
              <p className="opacity-50">Waiting for input stream...</p>
              <AnimatePresence>
                {logs.map((log, i) => (<motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border-l-2 border-green-500/30 pl-3">{log}</motion.div>))}
              </AnimatePresence>
              {status === 'processing' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-th-primary"><Loader className="w-4 h-4 animate-spin" /><span className="animate-pulse">Generating Roadmap via Gemini...</span></motion.div>)}
              {status === 'success' && (<motion.div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 mt-4 flex items-center gap-3"><CheckCircle className="w-5 h-5" /><div><strong className="block text-green-300">SUCCESS</strong>Process complete. Redirecting to roadmap...</div></motion.div>)}
              {status === 'error' && (<motion.div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mt-4 flex items-center gap-3"><AlertCircle className="w-5 h-5" /><div><strong className="block text-red-300">FAILURE</strong>Process aborted. Check console.</div></motion.div>)}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCreate;