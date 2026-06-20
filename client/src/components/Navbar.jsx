import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, TrendingUp, Heart, User, 
  LogOut, Menu, X, PlusCircle, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, adminOnly: false },
    { name: 'Technologies', href: '/technologies', icon: BookOpen, adminOnly: false },
    { name: 'Trending', href: '/trending', icon: TrendingUp, adminOnly: false },
    { name: 'Favourites', href: '/favourites', icon: Heart, adminOnly: false },
    { name: 'Create', href: '/admin', icon: PlusCircle, adminOnly: true },
    { name: 'Profile', href: '/profile', icon: User, adminOnly: false },
  ];

  const navItems = allNavItems.filter(item => {
    if (item.adminOnly) return user?.role === 'admin';
    return true;
  });

  const isActiveRoute = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-th-main bg-[var(--bg-nav)] backdrop-blur-xl w-full transition-colors duration-300">
      <div className="w-full px-6 md:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-5 h-5 rounded-sm transition-shadow" style={{ background: 'var(--logo-bg)', boxShadow: `0 0 10px var(--logo-glow)` }} />
            <span className="font-semibold tracking-tight text-lg text-th-primary">VidyaSetu</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden xl:flex items-center bg-th-pill rounded-full p-1.5 border border-th-subtle">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-6 py-2.5 rounded-full transition-all duration-300 group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-th-pill-active rounded-full border border-th-main"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-th-primary' : 'text-th-muted group-hover:text-th-secondary'}`} />
                    <span className={`text-sm font-bold transition-colors ${isActive ? 'text-th-primary' : 'text-th-muted group-hover:text-th-secondary'}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-3">

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-th-subtle text-th-muted hover:text-th-primary hover:bg-th-pill transition-all duration-300"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* AVATAR PILL */}
            <div className="hidden md:flex items-center space-x-3 bg-th-elevated border border-th-subtle px-4 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-th-inverted shadow-inner" style={{ background: 'var(--accent-bg)' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-th-primary mb-0.5">
                  {user?.name?.split(' ')[0] || 'Operative'}
                </span>
                <span className="text-[9px] text-th-muted font-bold uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : 'Level 1'}
                </span>
              </div>
            </div>
            
            {/* Logout */}
            <button onClick={handleLogout} className="hidden xl:flex p-2.5 rounded-xl text-th-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>

            {/* HAMBURGER */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="xl:hidden p-2 rounded-xl text-th-secondary hover:text-th-primary hover:bg-th-pill"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="xl:hidden overflow-hidden border-t border-th-main bg-th-base"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 mx-2 rounded-xl text-sm font-medium text-th-muted hover:bg-th-pill hover:text-th-primary">
                    <item.icon className="w-5 h-5 mr-3" /> {item.name}
                  </Link>
                ))}
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 mx-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-5 h-5 mr-3" /> Disconnect Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;