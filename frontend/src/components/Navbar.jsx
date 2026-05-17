import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Menu, X, Zap, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { path: '/',           label: 'HOME' },
  { path: '/live',       label: 'LIVE DETECT' },
  { path: '/upload',     label: 'UPLOAD' },
  { path: '/attendance', label: 'ATTENDANCE' },
  { path: '/about',      label: 'ABOUT' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle } = useTheme()

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300
        ${dark
          ? 'glass-bright border-[rgba(0,245,255,0.1)]'
          : 'bg-white/90 backdrop-blur-lg border-slate-200 shadow-sm'
        }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500 opacity-20 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <Eye className="w-5 h-5 text-[#00f5ff] relative z-10" />
          </div>
          <div>
            <span className="font-display text-sm font-bold tracking-widest text-[#00f5ff] text-glow-cyan">
              VISIONSCOPE
            </span>
            <div className={`text-[10px] font-mono-num tracking-widest -mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              AI DETECTION v2.0
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 font-display text-xs tracking-widest transition-colors duration-200
                  ${isActive
                    ? 'text-[#00f5ff]'
                    : dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 border ${dark ? 'bg-[rgba(0,245,255,0.08)] border-[rgba(0,245,255,0.2)]' : 'bg-[rgba(0,245,255,0.06)] border-[rgba(0,245,255,0.3)]'}`}
                    layoutId="nav-active"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Status */}
          <div className={`flex items-center gap-2 glass px-3 py-1.5 rounded-sm ${dark ? '' : 'bg-slate-100 border-slate-200'}`}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono-num text-xs text-green-400">AI READY</span>
            <Zap className="w-3 h-3 text-green-400" />
          </div>

          {/* Dark/Light toggle */}
          <button
            onClick={toggle}
            className={`w-9 h-9 rounded-sm border flex items-center justify-center transition-all duration-200 hover:scale-110
              ${dark
                ? 'border-[rgba(0,245,255,0.2)] text-[#00f5ff] hover:bg-[rgba(0,245,255,0.1)]'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggle}
            className={`w-8 h-8 rounded-sm border flex items-center justify-center
              ${dark ? 'border-[rgba(0,245,255,0.2)] text-[#00f5ff]' : 'border-slate-300 text-slate-600'}`}
            aria-label="Toggle theme">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className={`transition-colors ${dark ? 'text-slate-400 hover:text-[#00f5ff]' : 'text-slate-500 hover:text-[#00f5ff]'}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={`md:hidden border-t ${dark ? 'glass-bright border-[rgba(0,245,255,0.1)]' : 'bg-white border-slate-200'}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 font-display text-xs tracking-widest border-l-2 transition-colors
                      ${isActive
                        ? 'border-[#00f5ff] text-[#00f5ff] bg-[rgba(0,245,255,0.05)]'
                        : dark
                          ? 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-400'
                      }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
