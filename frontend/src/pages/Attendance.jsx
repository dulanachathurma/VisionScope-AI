import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Camera, CheckCircle, Users, Clock, Trash2, Download } from 'lucide-react'
import { detectFromFrame } from '../utils/api'
import { useTheme } from '../context/ThemeContext'

// Simple in-memory "database" for registered faces + attendance log
// In production this would be a real backend with face embeddings
let registeredUsers = []
let attendanceLog   = []

export default function Attendance() {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const intervalRef= useRef(null)

  const [streaming,   setStreaming]   = useState(false)
  const [detecting,   setDetecting]   = useState(false)
  const [users,       setUsers]       = useState([])
  const [log,         setLog]         = useState([])
  const [newName,     setNewName]     = useState('')
  const [registering, setRegistering] = useState(false)
  const [lastMarked,  setLastMarked]  = useState(null)
  const [backendDown, setBackendDown] = useState(false)
  const [snapshot,    setSnapshot]    = useState(null)

  const { dark } = useTheme()
  const txt  = dark ? 'text-slate-400' : 'text-slate-600'
  const txt2 = dark ? 'text-white'     : 'text-slate-800'
  const panel = dark ? 'glass-bright' : 'bg-white border border-slate-200 shadow-lg'

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setStreaming(true)
    } catch { alert('Camera permission required.') }
  }, [])

  // ── Stop camera ───────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    clearInterval(intervalRef.current)
    setStreaming(false)
    setDetecting(false)
  }, [])

  // ── Capture snapshot from video ───────────────────────────────────────────
  const captureSnapshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null
    const video  = videoRef.current
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = video.videoWidth  || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [])

  // ── Register new person ───────────────────────────────────────────────────
  const registerPerson = useCallback(async () => {
    if (!newName.trim()) { alert('Enter a name first.'); return }
    if (!streaming)      { alert('Open the camera first.'); return }

    setRegistering(true)
    const snap = captureSnapshot()
    if (!snap) { setRegistering(false); return }

    try {
      const result = await detectFromFrame(snap)
      const hasFace = result.detections?.some(d => d.label === 'Face')

      if (!hasFace) {
        alert('No face detected. Please look at the camera clearly.')
        setRegistering(false)
        return
      }

      // Store user with their snapshot as their "face ID"
      const newUser = {
        id:        Date.now(),
        name:      newName.trim(),
        photo:     snap,
        registeredAt: new Date().toLocaleString(),
      }
      registeredUsers = [...registeredUsers, newUser]
      setUsers([...registeredUsers])
      setNewName('')
      alert(`✅ ${newUser.name} registered successfully!`)
    } catch {
      setBackendDown(true)
      alert('Backend not reachable. Start Flask first.')
    }
    setRegistering(false)
  }, [newName, streaming, captureSnapshot])

  // ── Auto attendance detection loop ────────────────────────────────────────
  const detectAttendance = useCallback(async () => {
    const snap = captureSnapshot()
    if (!snap) return

    setSnapshot(snap)

    try {
      const result = await detectFromFrame(snap)
      const hasFace = result.detections?.some(d => d.label === 'Face')

      if (hasFace && registeredUsers.length > 0) {
        // Simple simulation: mark the most recently registered person
        // In production, you'd compare face embeddings here
        const now = new Date()
        const todayKey = now.toDateString()

        // Check if already marked today
        const alreadyMarked = attendanceLog.some(
          e => e.date === todayKey && e.userId === registeredUsers[0].id
        )

        if (!alreadyMarked) {
          const entry = {
            id:     Date.now(),
            userId: registeredUsers[0].id,
            name:   registeredUsers[0].name,
            time:   now.toLocaleTimeString(),
            date:   todayKey,
            status: 'Present',
          }
          attendanceLog = [entry, ...attendanceLog]
          setLog([...attendanceLog])
          setLastMarked(entry.name)
          setTimeout(() => setLastMarked(null), 3000)
        }
      }
      setBackendDown(false)
    } catch {
      setBackendDown(true)
    }
  }, [captureSnapshot])

  const toggleDetection = useCallback(() => {
    if (detecting) {
      clearInterval(intervalRef.current)
      setDetecting(false)
    } else {
      setDetecting(true)
      intervalRef.current = setInterval(detectAttendance, 2000)
    }
  }, [detecting, detectAttendance])

  // ── Export attendance CSV ─────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    const csv = ['Name,Date,Time,Status',
      ...attendanceLog.map(e => `${e.name},${e.date},${e.time},${e.status}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'attendance.csv'
    a.click()
  }, [])

  const deleteUser = useCallback((id) => {
    registeredUsers = registeredUsers.filter(u => u.id !== id)
    setUsers([...registeredUsers])
  }, [])

  return (
    <div className="pt-20 min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono-num text-xs text-[#10b981] tracking-widest mb-2">REAL-WORLD USE CASE</div>
          <h1 className={`font-display text-3xl md:text-4xl font-black mb-3 ${txt2}`}>
            SMART <span className="gradient-text">ATTENDANCE</span> SYSTEM
          </h1>
          <p className={`max-w-xl text-sm ${txt}`}>
            Register faces, then let the AI auto-mark attendance when a face is detected.
            No manual check-in needed — perfect for classrooms and offices.
          </p>
        </motion.div>

        {backendDown && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${dark ? 'glass border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
            <span className="text-amber-500 text-sm font-mono-num">
              ⚠ Backend offline. Run: cd backend && python3 app.py
            </span>
          </div>
        )}

        {/* Success toast */}
        <AnimatePresence>
          {lastMarked && (
            <motion.div
              className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-green-500/20 border border-green-500/40"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-display text-sm tracking-wider">
                ✅ {lastMarked} — ATTENDANCE MARKED!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Camera + Register ────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Camera */}
            <div className={`rounded-xl overflow-hidden ${panel}`}>
              <div className="relative bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {!streaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera className="w-10 h-10 text-slate-600 mb-3" />
                    <p className="text-slate-500 font-mono-num text-sm">CAMERA OFFLINE</p>
                  </div>
                )}
                {streaming && <>
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#10b981] opacity-60" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#10b981] opacity-60" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#10b981] opacity-60" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#10b981] opacity-60" />
                </>}
                {detecting && (
                  <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono-num text-xs text-green-400">SCANNING</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-wrap gap-3">
                {!streaming
                  ? <button onClick={startCamera} className="btn-primary text-sm"><Camera className="inline w-4 h-4 mr-2" />OPEN CAMERA</button>
                  : <>
                      <button onClick={toggleDetection} className={detecting ? 'btn-outline text-sm' : 'btn-primary text-sm'}>
                        {detecting ? '⏹ STOP SCANNING' : '▶ START SCANNING'}
                      </button>
                      <button onClick={stopCamera} className="btn-outline text-sm">STOP CAMERA</button>
                    </>
                }
              </div>
            </div>

            {/* Register form */}
            <div className={`rounded-xl p-6 ${panel}`}>
              <div className="font-display text-xs text-[#10b981] tracking-widest mb-4">
                REGISTER NEW PERSON
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter full name..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && registerPerson()}
                  className={`flex-1 px-4 py-2.5 rounded-sm font-mono-num text-sm outline-none border transition-colors
                    ${dark
                      ? 'bg-[rgba(0,245,255,0.05)] border-[rgba(0,245,255,0.2)] text-white placeholder-slate-600 focus:border-[#00f5ff]'
                      : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-[#00f5ff]'
                    }`}
                />
                <button
                  onClick={registerPerson}
                  disabled={registering || !newName.trim()}
                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <UserPlus className="inline w-4 h-4 mr-2" />
                  {registering ? 'CAPTURING...' : 'REGISTER'}
                </button>
              </div>
              <p className={`text-xs mt-2 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                Face the camera clearly, then click Register.
              </p>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* ── Right: Registered users + log ──────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Registered users */}
            <div className={`rounded-xl p-5 ${panel}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`font-display text-xs tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  REGISTERED ({users.length})
                </div>
                <Users className="w-4 h-4 text-[#10b981]" />
              </div>

              {users.length === 0 ? (
                <p className={`text-xs font-mono-num text-center py-4 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                  No one registered yet
                </p>
              ) : (
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                  {users.map(u => (
                    <div key={u.id} className={`flex items-center gap-3 p-2 rounded-sm ${dark ? 'bg-[rgba(255,255,255,0.03)]' : 'bg-slate-50'}`}>
                      <img src={u.photo} alt={u.name}
                        className="w-10 h-10 rounded-sm object-cover border border-[rgba(0,245,255,0.2)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className={`font-display text-xs font-bold truncate ${txt2}`}>{u.name}</div>
                        <div className={`font-mono-num text-[10px] truncate ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                          {u.registeredAt}
                        </div>
                      </div>
                      <button onClick={() => deleteUser(u.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance log */}
            <div className={`rounded-xl p-5 flex-1 ${panel}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`font-display text-xs tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ATTENDANCE LOG ({log.length})
                </div>
                {log.length > 0 && (
                  <button onClick={exportCSV} title="Export CSV"
                    className="text-[#10b981] hover:scale-110 transition-transform">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>

              {log.length === 0 ? (
                <p className={`text-xs font-mono-num text-center py-4 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                  No attendance recorded yet
                </p>
              ) : (
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                  {log.map(entry => (
                    <motion.div key={entry.id}
                      className={`flex items-center justify-between p-2.5 rounded-sm ${dark ? 'bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)]' : 'bg-green-50 border border-green-200'}`}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <div>
                        <div className={`font-display text-xs font-bold ${txt2}`}>{entry.name}</div>
                        <div className={`font-mono-num text-[10px] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                          {entry.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono-num text-xs text-[#10b981] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {entry.time}
                        </div>
                        <div className="font-mono-num text-[10px] text-[#10b981]">{entry.status}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How it works note */}
        <motion.div
          className={`mt-8 rounded-xl p-6 ${dark ? 'glass' : 'bg-blue-50 border border-blue-200'}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="font-display text-xs text-[#3b82f6] tracking-widest mb-3">HOW THIS WORKS (INTERVIEW ANSWER)</div>
          <p className={`text-sm leading-relaxed ${txt}`}>
            <strong className={txt2}>Problem solved:</strong> Manual attendance wastes 5-10 minutes per class. This system auto-detects
            registered faces and logs attendance instantly. <strong className={txt2}>Tech used:</strong> OpenCV detects faces via Haar
            Cascades → Flask returns detection results → React matches detected faces to registered profiles and logs the entry with a
            timestamp. In production, you'd use face embeddings (FaceNet/DeepFace) for accurate identity matching instead of simulation.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
