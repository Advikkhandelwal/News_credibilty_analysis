import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import History from './pages/History';
import { ShieldCheck, Search, History as HistoryIcon, Home as HomeIcon } from 'lucide-react';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ShieldCheck className="w-5 h-5 text-zinc-900" />
            <span className="font-semibold text-lg tracking-tight text-zinc-900">
              Credibility
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={<HomeIcon className="w-4 h-4" />} label="Home" currentPath={location.pathname} />
            <NavLink to="/analyze" icon={<Search className="w-4 h-4" />} label="Analyze" currentPath={location.pathname} />
            <NavLink to="/history" icon={<HistoryIcon className="w-4 h-4" />} label="History" currentPath={location.pathname} />
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-8 pb-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-100 py-10 bg-zinc-50">
        <div className="container mx-auto px-6 text-center flex flex-col items-center gap-2">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Credibility System
          </p>
          <p className="text-zinc-400 text-xs">
            Machine Learning & Language Models
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, icon, label, currentPath }) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={`text-sm font-medium flex items-center gap-1.5 transition-colors duration-200 ${
        isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
      }`}
    >
      {icon} {label}
    </Link>
  );
}

export default App;