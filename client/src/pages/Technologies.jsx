import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, X, Layers, LayoutGrid, ArrowRight, Code2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react'; 
import api from '../services/api';
import { DOMAINS, FIELDS } from '../data/fieldsData.jsx'; 

const Technologies = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSectorId = searchParams.get('sector') || 'cs';
  const currentSector = FIELDS.find(f => f.id === currentSectorId) || FIELDS[0];
  const parentDomain = DOMAINS.find(d => d.sectors.some(s => s.id === currentSectorId)) || DOMAINS[0];
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDomains, setOpenDomains] = useState([parentDomain.id]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/technologies', { params: { fieldId: currentSectorId, search: searchQuery || undefined } });
        setTechnologies(data.data.technologies);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    const timer = setTimeout(fetchTechnologies, 400);
    return () => clearTimeout(timer);
  }, [currentSectorId, searchQuery]);

  useEffect(() => {
    // Auto-open the parent domain when sector changes
    if (!openDomains.includes(parentDomain.id)) {
      setOpenDomains(prev => [...prev, parentDomain.id]);
    }
  }, [currentSectorId]);

  const toggleDomain = (domainId) => setOpenDomains(prev => prev.includes(domainId) ? prev.filter(id => id !== domainId) : [...prev, domainId]);
  const renderIcon = (iconName, className) => { const Icon = LucideIcons[iconName] || LucideIcons.Code2; return <Icon className={className} />; };

  return (
    <div className="min-h-screen bg-th-base text-th-primary font-sans transition-colors duration-300">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* ─── TOP BAR: Breadcrumb + Search ─── */}
        <div className="sticky top-20 z-30 bg-[var(--bg-nav)] backdrop-blur-xl border-b border-th-main px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Left: breadcrumb */}
            <div className="flex items-center gap-2 text-sm min-w-0">
              <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="lg:hidden p-1.5 rounded-lg bg-th-pill border border-th-subtle text-th-muted mr-1">
                <Layers className="w-4 h-4" />
              </button>
              <span className="text-th-muted font-medium hidden sm:inline">{parentDomain.title}</span>
              <ChevronRight className="w-3 h-3 text-th-dimmed hidden sm:inline flex-shrink-0" />
              <span className="font-bold text-th-primary truncate">{currentSector.name}</span>
              <span className="text-th-dimmed text-xs ml-2 hidden md:inline">({technologies.length} techs)</span>
            </div>
            {/* Right: search */}
            <div className="relative w-64 lg:w-80 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-muted" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search technologies..."
                className="w-full bg-th-base border border-th-input rounded-xl text-sm text-th-primary px-9 py-2 focus:border-[var(--border-input-focus)] focus:ring-1 focus:ring-[var(--border-input-focus)] outline-none placeholder-th-dimmed transition-all" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-th-pill text-th-muted"><X className="w-3.5 h-3.5" /></button>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          {/* ─── SIDEBAR ─── */}
          <aside className={`
            fixed lg:sticky top-[calc(5rem+3.5rem)] lg:top-[calc(5rem+3.5rem)] left-0 z-40 
            w-72 h-[calc(100vh-5rem-3.5rem)] overflow-y-auto
            bg-th-base lg:bg-transparent border-r border-th-main lg:border-r-0
            transition-transform duration-300 lg:translate-x-0
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            px-4 pt-6 pb-20 flex-shrink-0
          `}>
            {/* Mobile overlay backdrop */}
            {mobileSidebarOpen && (
              <div className="fixed inset-0 bg-black/30 z-[-1] lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            )}
            
            <div className="flex items-center justify-between mb-5 px-1">
              <h3 className="text-[10px] font-bold text-th-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Domains & Sectors
              </h3>
              <button className="lg:hidden p-1 rounded text-th-muted" onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {DOMAINS.map((domain) => {
                const isOpen = openDomains.includes(domain.id);
                const hasActiveSector = domain.sectors.some(s => s.id === currentSectorId);
                return (
                  <div key={domain.id}>
                    <button onClick={() => toggleDomain(domain.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left
                        ${hasActiveSector ? 'text-th-primary font-bold' : 'text-th-secondary hover:text-th-primary hover:bg-th-pill'}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${domain.color} flex-shrink-0`} />
                        <span className="text-xs font-semibold tracking-tight">{domain.title}</span>
                      </div>
                      <ChevronDown className={`w-3 h-3 text-th-dimmed transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden">
                          <div className="ml-4 pl-3 border-l border-th-subtle space-y-0.5 py-1">
                            {domain.sectors.map((sector) => {
                              const isActive = currentSectorId === sector.id;
                              return (
                                <button key={sector.id} onClick={() => { navigate(`/technologies?sector=${sector.id}`); setMobileSidebarOpen(false); }}
                                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-all text-[11px] font-medium
                                    ${isActive 
                                      ? 'bg-[var(--accent-bg)] text-[var(--accent-text)] font-bold shadow-sm' 
                                      : 'text-th-muted hover:text-th-primary hover:bg-th-pill'}`}>
                                  {renderIcon(sector.icon, "w-3.5 h-3.5 flex-shrink-0")}
                                  <span className="truncate">{sector.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <main className="flex-1 min-w-0 px-6 lg:px-8 py-8">
            {/* Section Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-th-pill border border-th-subtle text-th-secondary">
                  {renderIcon(currentSector.icon, "w-5 h-5")}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-th-primary tracking-tight">{currentSector.name}</h1>
                  <p className="text-xs text-th-muted mt-0.5">{currentSector.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Tech Grid */}
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-th-main border-t-[var(--accent-bg)] rounded-full animate-spin" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-th-dimmed uppercase">Loading...</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {technologies.map((tech) => (
                    <motion.div
                      key={tech._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => navigate(`/technologies/${tech.slug}`)}
                      className="group cursor-pointer bg-[var(--bg-card)] border border-th-main rounded-2xl p-5 hover:border-th-input hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-th-base border border-th-subtle text-th-secondary group-hover:text-th-primary group-hover:border-th-input transition-all">
                          {renderIcon(tech.icon, "w-5 h-5")}
                        </div>
                        <ArrowRight className="w-4 h-4 text-th-dimmed group-hover:text-th-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h3 className="text-sm font-bold text-th-primary mb-1 group-hover:text-th-secondary transition-colors">{tech.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-th-muted uppercase tracking-wider">{tech.category}</span>
                        {tech.isTrending && (
                          <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase">Hot</span>
                        )}
                      </div>
                      {/* Subtle progress hint bar */}
                      <div className="mt-4 w-full bg-th-pill rounded-full h-[3px] overflow-hidden">
                        <div className="h-full rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 w-full" style={{ background: 'var(--accent-bg)' }} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!loading && technologies.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-th-main rounded-2xl bg-[var(--bg-card)]">
                    <LayoutGrid className="w-8 h-8 text-th-dimmed mx-auto mb-3" />
                    <p className="text-sm font-bold text-th-muted mb-1">No technologies found</p>
                    <p className="text-xs text-th-dimmed">Try a different sector or search term.</p>
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Technologies;