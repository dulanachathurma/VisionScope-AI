import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Upload, Cpu, Eye, Zap, Shield, Users, AlertTriangle } from 'lucide-react'
import ParticleField from '../components/ParticleField'
import AnimatedCounter from '../components/AnimatedCounter'
import { useTheme } from '../context/ThemeContext'

const STATS = [
  { value: 99,  suffix: '%',   label: 'Detection Accuracy', color: '#00f5ff' },
  { value: 30,  suffix: ' FPS',label: 'Real-time Speed',    color: '#a855f7' },
  { value: 12,  suffix: '+',   label: 'Body Parts Detected',color: '#f59e0b' },
  { value: 500, suffix: 'ms',  label: 'Avg Response Time',  color: '#10b981' },
]

const FEATURES = [
  { icon: Camera,       title: 'Live Webcam Detection',    desc: 'Stream your webcam and detect body parts in real-time at up to 30 FPS with bounding box overlays.',        color: '#00f5ff' },
  { icon: Upload,       title: 'Image Upload Analysis',    desc: 'Upload any photo and let the AI analyze all visible face and body parts with confidence scores.',            color: '#a855f7' },
  { icon: AlertTriangle,title: 'Drowsiness Detection',     desc: 'Monitors eye state in real-time. If eyes stay closed 3+ seconds, an audio alert fires — keeping drivers safe.', color: '#f59e0b' },
  { icon: Users,        title: 'Smart Attendance System',  desc: 'Register faces and auto-log attendance when detected. No manual check-in needed — perfect for classrooms.', color: '#ec4899' },
  { icon: Cpu,          title: 'OpenCV AI Engine',         desc: 'Powered by OpenCV Haar Cascades for fast, reliable face, eye, and mouth detection without GPU.',            color: '#10b981' },
  { icon: Shield,       title: 'Privacy First',            desc: 'All processing happens locally. Images are never stored permanently and are deleted after analysis.',         color: '#6366f1' },
]

const USE_CASES = [
  {
    icon: '🚗',
    title: 'Driver Safety',
    subtitle: 'Drowsiness Detection',
    desc: 'Monitors the driver\'s eyes in real-time. If eyes are closed for more than 3 seconds, the system plays a beep alert to prevent accidents. Solves a real road safety problem.',
    color: '#f59e0b',
    link: '/live',
    linkLabel: 'Try It →',
  },
  {
    icon: '🏫',
    title: 'Smart Classroom',
    subtitle: 'Attendance System',
    desc: 'Students register their face once. Every class, the camera auto-detects and logs attendance. No roll calls, no paper — saves teachers 10 minutes per session.',
    color: '#10b981',
    link: '/attendance',
    linkLabel: 'Try It →',
  },
]

const BODY_PARTS = [
  { label: 'Face',   icon: '👤', color: '#00f5ff' },
  { label: 'Eye',    icon: '👁️', color: '#a855f7' },
  { label: 'Nose',   icon: '👃', color: '#f59e0b' },
  { label: 'Mouth',  icon: '👄', color: '#ec4899' },
  { label: 'Ear',    icon: '👂', color: '#10b981' },
  { label: 'Hand',   icon: '🤚', color: '#3b82f6' },
  { label: 'Finger', icon: '☝️', color: '#6366f1' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0 },
}

export default function Home() {
  const { dark } = useTheme()
  const txt  = dark ? 'text-slate-400' : 'text-slate-600'
  const txt2 = dark ? 'text-white'     : 'text-slate-800'
  const card = dark ? 'card'           : 'bg-white border border-slate-200 shadow-sm rounded-lg p-6 transition-all duration-300 hover:-translate-y-1'

  return (
    <div className={`pt-16 grid-bg transition-colors duration-300`}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,245,255,0.05),transparent)]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm mb-8 ${dark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
            <span className="font-mono-num text-xs text-[#00f5ff] tracking-widest">AI DETECTION SYSTEM · ACTIVE</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="gradient-text">AI VISION</span>
            <br />
            <span className={txt2}>DETECTION</span>
            <br />
            <span className={`${txt} text-3xl md:text-4xl lg:text-5xl`}>SYSTEM</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${txt}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
          >
            Real-Time Human Feature Recognition · Driver Drowsiness Alerts · Smart Attendance System
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/live"   className="btn-primary"><Camera className="inline w-4 h-4 mr-2" />START CAMERA</Link>
            <Link to="/upload" className="btn-outline"><Upload className="inline w-4 h-4 mr-2" />UPLOAD IMAGE</Link>
          </motion.div>

          {/* Floating tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-14"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
          >
            {BODY_PARTS.map((part, i) => (
              <motion.div
                key={part.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm ${dark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              >
                <span>{part.icon}</span>
                <span className="font-mono-num text-xs font-bold" style={{ color: part.color }}>{part.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <span className={`font-mono-num text-[10px] tracking-widest ${dark ? 'text-slate-600' : 'text-slate-400'}`}>SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#00f5ff] to-transparent opacity-50" />
        </motion.div>
      </section>

      {/* ── Real-World Use Cases ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <div className="font-mono-num text-xs text-[#f59e0b] tracking-widest mb-3">REAL-WORLD IMPACT</div>
            <h2 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${txt2}`}>
              PROBLEMS THIS SOLVES
            </h2>
            <p className={`max-w-xl mx-auto text-sm ${txt}`}>
              VisionScope AI isn't just a demo — it solves real problems used in industry today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={uc.title}
                className={`rounded-xl p-8 border-l-4 transition-all duration-300 hover:-translate-y-1 ${dark ? 'glass-bright' : 'bg-white shadow-lg border-slate-200'}`}
                style={{ borderLeftColor: uc.color }}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              >
                <div className="text-4xl mb-4">{uc.icon}</div>
                <div className="font-mono-num text-xs tracking-widest mb-1" style={{ color: uc.color }}>
                  {uc.subtitle.toUpperCase()}
                </div>
                <h3 className={`font-display text-xl font-bold mb-3 ${txt2}`}>{uc.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${txt}`}>{uc.desc}</p>
                <Link to={uc.link}
                  className="font-display text-xs font-bold tracking-wider hover:underline transition-colors"
                  style={{ color: uc.color }}>
                  {uc.linkLabel}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {STATS.map(stat => (
              <motion.div
                key={stat.label}
                className={`rounded-lg p-6 text-center ${dark ? 'glass-bright glow-cyan' : 'bg-white border border-slate-200 shadow-md'}`}
                variants={fadeUp}
              >
                <div className="font-display text-4xl md:text-5xl font-black mb-2" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className={`font-mono-num text-xs tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <div className="font-mono-num text-xs text-[#00f5ff] tracking-widest mb-3">CAPABILITIES</div>
            <h2 className={`font-display text-3xl md:text-4xl font-bold ${txt2}`}>WHAT VISIONSCOPE CAN DO</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {FEATURES.map(f => (
              <motion.div key={f.title} className={card} variants={fadeUp}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-sm font-bold tracking-wider mb-3" style={{ color: f.color }}>
                  {f.title.toUpperCase()}
                </h3>
                <p className={`text-sm leading-relaxed ${txt}`}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            className={`rounded-xl p-12 relative overflow-hidden ${dark ? 'glass-bright' : 'bg-white border border-slate-200 shadow-xl'}`}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,245,255,0.05)] to-[rgba(168,85,247,0.05)]" />
            <Eye className="w-12 h-12 text-[#00f5ff] mx-auto mb-6 relative z-10" />
            <h2 className={`font-display text-2xl md:text-3xl font-bold mb-4 relative z-10 ${txt2}`}>READY TO DETECT?</h2>
            <p className={`mb-8 relative z-10 ${txt}`}>Try the AI detection system now with your webcam or upload an image.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/live"       className="btn-primary"><Camera className="inline w-4 h-4 mr-2" />OPEN CAMERA</Link>
              <Link to="/attendance" className="btn-outline"><Users  className="inline w-4 h-4 mr-2" />ATTENDANCE</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
