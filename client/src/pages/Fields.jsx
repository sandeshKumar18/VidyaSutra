import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Layers, Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DOMAINS } from '../data/fieldsData';

const Fields = () => {
  const navigate = useNavigate();
  const [activeDomainId, setActiveDomainId] = useState(DOMAINS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const allSectors = useMemo(() => DOMAINS.flatMap(d => d.sectors), []);

  const displayedSectors = useMemo(() => {
    if (!searchQuery.trim()) {
      return DOMAINS.find(d => d.id === activeDomainId)?.sectors || [];
    }
    return allSectors.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, activeDomainId, allSectors]);

  const activeDomain = DOMAINS.find(d => d.id === activeDomainId);

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Circle;
    return <Icon className="w-full h-full" />;
  };

  return (
    <div className="min-h-screen bg-th-base text-th-primary pt-8 pb-12 px-4 md:px-8 overflow-hidden transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto h-full">
        
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Choose Your <span className="text-th-muted">Path</span>.
            </h1>
            <p className="text-th-secondary text-lg max-w-2xl">
              Select a specialized industry domain to unlock professional-grade roadmaps.
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-th-muted group-focus-within:text-th-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sectors (e.g., 'AI', 'Finance')..."
              className="w-full pl-11 pr-10 py-4 bg-[var(--bg-input)] border border-th-input rounded-2xl text-th-primary placeholder-th-dimmed focus:outline-none focus:ring-2 focus:ring-[var(--border-input-focus)] focus:border-[var(--border-input-focus)] transition-all shadow-xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-4 flex items-center text-th-muted hover:text-th-primary">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[600px]">
          
          {/* LEFT SIDE: Domain Menu */}
          <div className={`lg:col-span-4 flex flex-col gap-4 transition-all duration-500 ${searchQuery ? 'opacity-50 pointer-events-none blur-sm' : 'opacity-100'}`}>
            {DOMAINS.map((domain) => {
              const isActive = activeDomainId === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`group relative w-full text-left p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                    isActive 
                      ? 'bg-th-elevated border-th-input shadow-2xl scale-[1.02]' 
                      : 'bg-[var(--bg-card)] border-th-subtle hover:bg-th-elevated hover:border-th-input'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${domain.color} opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-10' : 'group-hover:opacity-5'}`} />
                  {isActive && <motion.div layoutId="active-pill" className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b ${domain.color}`} />}
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 transition-colors ${isActive ? 'text-th-primary' : 'text-th-secondary group-hover:text-th-primary'}`}>{domain.title}</h3>
                      <p className="text-xs font-medium text-th-muted uppercase tracking-widest">{domain.sectors.length} Sectors</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? 'bg-[var(--accent-bg)] text-[var(--accent-text)] border-[var(--accent-bg)]' : 'bg-transparent text-th-dimmed border-th-main -rotate-45'}`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: Dynamic Grid */}
          <div className="lg:col-span-8 bg-[var(--bg-card)] rounded-[3rem] border border-th-subtle p-8 relative overflow-hidden min-h-[500px]">
            {!searchQuery && (
              <div className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-br ${activeDomain.color} opacity-[0.07] blur-[100px] rounded-full pointer-events-none transition-colors duration-1000`} />
            )}

            <AnimatePresence mode="popLayout">
              <motion.div 
                key={searchQuery ? 'search' : 'domain'}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
              >
               <div className="p-2 rounded-lg bg-th-pill border border-th-main text-th-secondary">
                  {searchQuery ? <Search className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
               </div>
               <h2 className="text-2xl font-bold text-th-primary">
                 {searchQuery ? `Search Results for "${searchQuery}"` : activeDomain.description}
               </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedSectors.length > 0 ? (
                  displayedSectors.map((sector) => (
                    <motion.div
                      layout
                      key={sector.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => navigate(`/technologies?sector=${sector.id}`)}
                      className="group cursor-pointer bg-th-base border border-th-subtle hover:border-th-input p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-th-elevated border border-th-subtle flex items-center justify-center text-th-secondary group-hover:scale-110 transition-transform duration-300">
                          {renderIcon(sector.icon)}
                        </div>
                        <ArrowRight className="w-5 h-5 text-th-dimmed group-hover:text-th-primary transition-colors" />
                      </div>

                      <h3 className="text-lg font-bold text-th-primary mb-2">{sector.name}</h3>
                      <p className="text-sm text-th-muted line-clamp-2">{sector.description}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-th-muted">
                    No sectors found matching "{searchQuery}".
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Fields;