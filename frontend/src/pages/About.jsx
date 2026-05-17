import { motion } from 'framer-motion'
import { Code2, Github, Linkedin, ExternalLink, Check, MapPin } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const TIMELINE = [
  { date: 'Jan 2026', title: 'Project Idea',        desc: 'Conceptualized VisionScope AI as an internship portfolio project with real-world use cases.' },
  { date: 'Feb 2026', title: 'Tech Research',        desc: 'Researched OpenCV, Flask, and React for the tech stack.' },
  { date: 'Mar 2026', title: 'Backend Built',        desc: 'Developed Flask backend with face detection, drowsiness detection, and attendance system.' },
  { date: 'Apr 2026', title: 'Frontend Built',       desc: 'Created React frontend with Tailwind, Framer Motion, and dark/light mode.' },
  { date: 'May 2026', title: 'Launch v2.0',          desc: 'Final testing, polish, and public launch of VisionScope AI v2.0.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Capture Input',       desc: 'User opens webcam or uploads a photo through the drag-and-drop interface.' },
  { step: '02', title: 'Send to AI',          desc: 'Image sent as base64 or multipart form data to Flask backend via REST API.' },
  { step: '03', title: 'OpenCV Detection',    desc: 'Haar Cascades identify faces, eyes, and mouth regions in the image.' },
  { step: '04', title: 'Drowsiness Check',    desc: 'Eye confidence monitored — eyes closed 3+ seconds triggers beep alert.' },
  { step: '05', title: 'Attendance Logging',  desc: 'Detected faces are matched to registered profiles and attendance auto-logged.' },
  { step: '06', title: 'Display Results',     desc: 'Framer Motion renders detection cards with confidence bars and annotated image.' },
]

const FUTURE = [
  'YOLOv8 integration for faster detection',
  'Full body pose estimation',
  'Emotion detection',
  'FaceNet for accurate identity matching',
  'Multi-person simultaneous detection',
  'Mobile app (React Native)',
  'Cloud deployment (AWS / GCP)',
  'Video file upload support',
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0 },
}

export default function About() {
  const { dark } = useTheme()
  const txt   = dark ? 'text-slate-400' : 'text-slate-600'
  const txt2  = dark ? 'text-white'     : 'text-slate-800'
  const panel = dark ? 'glass-bright'   : 'bg-white border border-slate-200 shadow-xl'
  const card  = dark ? 'glass'          : 'bg-white border border-slate-200 shadow-sm'

  return (
    <div className="pt-20 min-h-screen grid-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono-num text-xs text-[#10b981] tracking-widest mb-3">ABOUT THE PROJECT</div>
          <h1 className="font-display text-4xl md:text-5xl font-black gradient-text mb-6">VISIONSCOPE AI</h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${txt}`}>
             AI computer vision project demonstrating real-time
            human body part detection, drowsiness alerts, and smart attendance tracking.
          </p>
        </motion.div>

        {/* ── Creator Card with REAL photo ──────────────────────────── */}
        <motion.div
          className={`rounded-xl p-8 mb-16 ${panel}`}
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Real Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-xl overflow-hidden border-2 border-[#00f5ff] glow-cyan">
                <img
                  src="/dulana.jpg"
                  alt="Dulana Chathurma"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-green-400 border-2 border-[#020408] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="font-mono-num text-xs text-slate-500 tracking-widest mb-1">
                DEVELOPER & AI ENGINEER
              </div>
              <h2 className={`font-display text-2xl font-bold mb-1 ${txt2}`}>Dulana Chathurma</h2>
              <div className={`flex items-center gap-1 justify-center md:justify-start mb-4 text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                <MapPin className="w-3 h-3" />
                <span>Sri Lanka</span>
              </div>
              <p className={`text-sm leading-relaxed mb-5 ${txt}`}>
                Passionate about AI, computer vision, and full-stack development.
                Built VisionScope AI to showcase skills in machine learning, Python backend,
                and modern React — solving real-world problems like driver safety and smart attendance.
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                {['Python', 'React', 'OpenCV', 'Flask', 'AI/ML', 'Tailwind CSS'].map(skill => (
                  <span key={skill} className="font-mono-num text-xs px-2 py-1 rounded-sm border"
                    style={{ color: '#00f5ff', borderColor: 'rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.05)' }}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex justify-center md:justify-start gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm hover:text-[#00f5ff] transition-colors ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Github className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://linkedin.com/in/dulana-chathurma" target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm hover:text-[#00f5ff] transition-colors ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div className="mb-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="font-mono-num text-xs text-[#00f5ff] tracking-widest mb-3">PROCESS</div>
          <h2 className={`font-display text-2xl font-bold mb-8 ${txt2}`}>HOW THE AI WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step} className={`rounded-lg p-5 flex gap-4 ${card}`}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div className="font-display text-3xl font-black text-[rgba(0,245,255,0.15)] flex-shrink-0 w-10">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-display text-xs font-bold tracking-wider text-[#00f5ff] mb-1">
                    {step.title.toUpperCase()}
                  </h3>
                  <p className={`text-sm leading-relaxed ${txt}`}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div className="mb-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="font-mono-num text-xs text-[#a855f7] tracking-widest mb-3">TIMELINE</div>
          <h2 className={`font-display text-2xl font-bold mb-8 ${txt2}`}>PROJECT JOURNEY</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f5ff] via-[#a855f7] to-transparent" />
            <div className="flex flex-col gap-6 pl-12">
              {TIMELINE.map((item, i) => (
                <motion.div key={item.date} className="relative"
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="absolute -left-[34px] top-1.5 w-3 h-3 rounded-full bg-[#00f5ff] border-2 border-[#020408]" />
                  <div className="font-mono-num text-xs text-[#00f5ff] mb-1">{item.date}</div>
                  <h3 className={`font-display text-sm font-bold mb-1 ${txt2}`}>{item.title.toUpperCase()}</h3>
                  <p className={`text-sm ${txt}`}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Future */}
        <motion.div className="mb-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="font-mono-num text-xs text-[#f59e0b] tracking-widest mb-3">ROADMAP</div>
          <h2 className={`font-display text-2xl font-bold mb-8 ${txt2}`}>FUTURE IMPROVEMENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FUTURE.map((item, i) => (
              <motion.div key={item} className={`rounded-lg p-4 flex items-center gap-3 ${card}`}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="w-5 h-5 rounded-sm border border-[rgba(0,245,255,0.3)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#00f5ff]" />
                </div>
                <span className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Open Source */}
        <motion.div className={`rounded-xl p-8 text-center ${panel}`}
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Code2 className="w-10 h-10 text-[#00f5ff] mx-auto mb-4" />
          <h2 className={`font-display text-xl font-bold mb-3 ${txt2}`}>OPEN SOURCE</h2>
          <p className={`text-sm mb-6 max-w-md mx-auto ${txt}`}>
            VisionScope AI is open source. Feel free to fork, star, and contribute on GitHub.
          </p>
          <a href="https://github.com/dulanachathurma" target="_blank" rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2">
            <Github className="w-4 h-4" /> VIEW ON GITHUB
          </a>
        </motion.div>

      </div>
    </div>
  )
}
