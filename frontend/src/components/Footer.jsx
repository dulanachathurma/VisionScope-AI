import { Link } from 'react-router-dom'
import { Eye, Github, Linkedin, Heart } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Footer() {
  const { dark } = useTheme()

  return (
    <footer className={`relative border-t transition-colors duration-300
      ${dark ? 'border-[rgba(0,245,255,0.08)] bg-[#020408]' : 'border-slate-200 bg-slate-50'}`}>

      {/* Top glow line (dark only) */}
      {dark && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-30" />}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-[#00f5ff]" />
              <span className="font-display text-sm font-bold tracking-widest text-[#00f5ff]">VISIONSCOPE AI</span>
            </div>
            <p className={`text-sm leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
              Real-time human body part detection using advanced AI and computer vision technology.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className={`font-display text-xs tracking-widest mb-4 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
              NAVIGATION
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/',           label: 'Home' },
                { to: '/live',       label: 'Live Detection' },
                { to: '/upload',     label: 'Upload Detection' },
                { to: '/attendance', label: 'Attendance System' },
                { to: '/about',      label: 'About Project' },
              ].map(link => (
                <Link key={link.to} to={link.to}
                  className={`text-sm transition-colors duration-200 hover:text-[#00f5ff]
                    ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className={`font-display text-xs tracking-widest mb-4 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
              BUILT WITH
            </h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Flask', 'OpenCV', 'Tailwind', 'Framer Motion'].map(tech => (
                <span key={tech}
                  className="px-2 py-1 text-xs font-mono-num text-[#00f5ff] border border-[rgba(0,245,255,0.2)] rounded-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4
          ${dark ? 'border-[rgba(255,255,255,0.05)]' : 'border-slate-200'}`}>
          <p className={`text-sm text-center ${dark ? 'text-slate-600' : 'text-slate-500'}`}>
            © 2026 <span className={dark ? 'text-slate-400' : 'text-slate-600'}>Dulana Chathurma</span>. All Rights Reserved.
          </p>
         
          <div className="flex items-center gap-3">
            <a href="https://github.com/dulanachathurma" target="_blank" rel="noopener noreferrer"
              className={`hover:text-[#00f5ff] transition-colors ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/in/dulana-chathurma" target="_blank" rel="noopener noreferrer"
              className={`hover:text-[#00f5ff] transition-colors ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
