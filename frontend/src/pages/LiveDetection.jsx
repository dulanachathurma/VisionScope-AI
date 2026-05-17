import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CameraOff, Zap, Activity, Eye, AlertTriangle, ShieldCheck } from 'lucide-react'
import DetectionCard from '../components/DetectionCard'
import { detectFromFrame } from '../utils/api'
import { useTheme } from '../context/ThemeContext'

const DETECT_INTERVAL_MS = 800
// Eyes must be "closed" (low confidence) for this many consecutive checks before alert
const DROWSY_THRESHOLD = 4  // 4 × 800ms = ~3 seconds

export default function LiveDetection() {
  const videoRef    = useRef(null)
  const canvasRef   = useRef(null)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  const [streaming,    setStreaming]    = useState(false)
  const [detecting,    setDetecting]    = useState(false)
  const [detections,   setDetections]   = useState([])
  const [error,        setError]        = useState(null)
  const [fps,          setFps]          = useState(0)
  const [frameCount,   setFrameCount]   = useState(0)
  const [annotatedImg, setAnnotatedImg] = useState(null)
  const [backendDown,  setBackendDown]  = useState(false)

  // Drowsiness state
  const [drowsy,        setDrowsy]        = useState(false)
  const [drowsyCount,   setDrowsyCount]   = useState(0)
  const [drowsyAlerts,  setDrowsyAlerts]  = useState(0)
  const drowsyCountRef = useRef(0)

  const fpsRef      = useRef(0)
  const lastFpsTime = useRef(performance.now())

  const { dark } = useTheme()

  // ── Beep sound using Web Audio API ──────────────────────────────────────
  const playBeep = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      // Play 3 rapid beeps
      [0, 0.25, 0.5].forEach(delay => {
        const osc   = ctx.createOscillator()
        const gain  = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type      = 'square'
        osc.frequency.value = 880
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2)

        osc.start(ctx.currentTime + delay)
        osc.stop(ctx.currentTime + delay + 0.2)
      })
    } catch (e) {
      console.warn('Audio error:', e)
    }
  }, [])

  // ── Start webcam ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStreaming(true)
      }
    } catch {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }, [])

  // ── Stop webcam ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    clearInterval(intervalRef.current)
    setStreaming(false)
    setDetecting(false)
    setDetections([])
    setAnnotatedImg(null)
    setDrowsy(false)
    drowsyCountRef.current = 0
    setDrowsyCount(0)
  }, [])

  // ── Check drowsiness from detections ────────────────────────────────────
  const checkDrowsiness = useCallback((dets) => {
    const eyeDets = dets.filter(d => d.label.includes('Eye'))

    if (eyeDets.length === 0) {
      // No eyes detected = potentially closed
      drowsyCountRef.current++
    } else {
      // Eyes visible — reset counter
      drowsyCountRef.current = 0
      setDrowsy(false)
    }

    setDrowsyCount(drowsyCountRef.current)

    if (drowsyCountRef.current >= DROWSY_THRESHOLD) {
      setDrowsy(true)
      playBeep()
      setDrowsyAlerts(c => c + 1)
      drowsyCountRef.current = 0 // Reset after alert so it re-triggers if still closed
    }
  }, [playBeep])

  // ── Capture frame and detect ─────────────────────────────────────────────
  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return
    const video  = videoRef.current
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = video.videoWidth  || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0)

    const base64 = canvas.toDataURL('image/jpeg', 0.7)
    try {
      const result = await detectFromFrame(base64)
      if (result.detections) {
        setDetections(result.detections)
        checkDrowsiness(result.detections)
      }
      if (result.annotated_image) setAnnotatedImg(result.annotated_image)

      fpsRef.current++
      setFrameCount(c => c + 1)
      const now = performance.now()
      if (now - lastFpsTime.current >= 1000) {
        setFps(fpsRef.current)
        fpsRef.current = 0
        lastFpsTime.current = now
      }
      setBackendDown(false)
    } catch {
      setBackendDown(true)
    }
  }, [checkDrowsiness])

  // ── Toggle detection ─────────────────────────────────────────────────────
  const toggleDetection = useCallback(() => {
    if (detecting) {
      clearInterval(intervalRef.current)
      setDetecting(false)
      setDrowsy(false)
      drowsyCountRef.current = 0
    } else {
      setDetecting(true)
      intervalRef.current = setInterval(captureAndDetect, DETECT_INTERVAL_MS)
    }
  }, [detecting, captureAndDetect])

  useEffect(() => () => stopCamera(), [stopCamera])

  const txt  = dark ? 'text-slate-400' : 'text-slate-600'
  const txt2 = dark ? 'text-white'     : 'text-slate-800'
  const panelClass = dark ? 'glass-bright' : 'bg-white border border-slate-200 shadow-lg'

  return (
    <div className="pt-20 min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono-num text-xs text-[#00f5ff] tracking-widest mb-2">REAL-TIME DETECTION</div>
          <h1 className={`font-display text-3xl md:text-4xl font-black mb-3 ${txt2}`}>
            LIVE <span className="gradient-text">CAMERA</span> DETECTION
          </h1>
          <p className={`max-w-xl text-sm ${txt}`}>
            Real-time body part detection + drowsiness monitoring. Eyes closed for 3+ seconds triggers an audio alert.
          </p>
        </motion.div>

        {/* Backend warning */}
        {backendDown && (
          <motion.div className={`mb-6 border rounded-lg p-4 flex items-center gap-3 ${dark ? 'glass border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Activity className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-amber-500 text-sm">
              Backend not reachable. Run: <code className="font-mono-num">cd backend && python3 app.py</code>
            </p>
          </motion.div>
        )}

        {/* 🔴 DROWSINESS ALERT BANNER */}
        <AnimatePresence>
          {drowsy && (
            <motion.div
              className="mb-6 rounded-lg p-5 flex items-center gap-4 bg-red-500/20 border-2 border-red-500 alert-pulse"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 animate-bounce" />
              <div>
                <div className="font-display text-sm font-bold text-red-400 tracking-widest mb-1">
                  ⚠️ DROWSINESS DETECTED — WAKE UP!
                </div>
                <p className="text-red-300 text-sm">
                  Eyes have been closed for 3+ seconds. Please stay alert while driving!
                </p>
              </div>
              <div className="ml-auto font-mono-num text-xs text-red-400">
                {drowsyAlerts} ALERTS
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Video Panel ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <motion.div className={`rounded-xl overflow-hidden ${panelClass}`}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>

              {/* Viewport */}
              <div className="relative bg-black aspect-video flex items-center justify-center">
                {annotatedImg && streaming && (
                  <img src={annotatedImg} alt="Annotated" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <video ref={videoRef}
                  className={`w-full h-full object-cover ${annotatedImg ? 'opacity-0' : 'opacity-100'}`}
                  muted playsInline />

                {!streaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-[rgba(0,245,255,0.2)] flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-mono-num text-sm tracking-wider">CAMERA OFFLINE</p>
                  </div>
                )}

                {/* Corner brackets */}
                {streaming && <>
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#00f5ff] opacity-60" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#00f5ff] opacity-60" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#00f5ff] opacity-60" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#00f5ff] opacity-60" />
                </>}

                {detecting && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 glass px-3 py-1.5 rounded-sm">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="font-mono-num text-xs text-red-400">REC</span>
                  </div>
                )}

                {streaming && (
                  <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-sm">
                    <span className="font-mono-num text-xs text-[#00f5ff]">
                      {fps} FPS · {frameCount} frames
                    </span>
                  </div>
                )}

                {/* Drowsy eye-closed counter */}
                {detecting && (
                  <div className={`absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-sm glass
                    ${drowsyCount > 0 ? 'border border-red-500/50' : ''}`}>
                    <Eye className={`w-3 h-3 ${drowsyCount > 0 ? 'text-red-400' : 'text-green-400'}`} />
                    <span className={`font-mono-num text-xs ${drowsyCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {drowsyCount > 0 ? `CLOSING ${drowsyCount}/${DROWSY_THRESHOLD}` : 'EYES OPEN'}
                    </span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex flex-wrap items-center gap-3">
                {!streaming ? (
                  <button onClick={startCamera} className="btn-primary text-sm">
                    <Camera className="inline w-4 h-4 mr-2" />OPEN CAMERA
                  </button>
                ) : (
                  <>
                    <button onClick={toggleDetection}
                      className={detecting ? 'btn-outline text-sm' : 'btn-primary text-sm'}>
                      <Zap className="inline w-4 h-4 mr-2" />
                      {detecting ? 'STOP AI' : 'START AI'}
                    </button>
                    <button onClick={stopCamera} className="btn-outline text-sm">
                      <CameraOff className="inline w-4 h-4 mr-2" />STOP
                    </button>
                  </>
                )}
                {error && <span className="text-red-400 text-xs font-mono-num">{error}</span>}
              </div>
            </motion.div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Drowsiness info card */}
            <motion.div
              className={`mt-4 rounded-lg p-4 flex items-start gap-3 ${dark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            >
              <ShieldCheck className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-display text-xs text-[#10b981] tracking-widest mb-1">DROWSINESS DETECTION</div>
                <p className={`text-xs leading-relaxed ${txt}`}>
                  The AI monitors eye visibility every 800ms. If no eyes are detected for 3+ consecutive checks
                  (~3 seconds), a triple-beep audio alert fires. Designed to keep drivers awake.
                  Total alerts fired: <span className="font-mono-num text-red-400">{drowsyAlerts}</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`font-display text-xs tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                DETECTIONS
              </div>
              {detections.length > 0 && (
                <div className="font-mono-num text-xs text-[#00f5ff]">{detections.length} FOUND</div>
              )}
            </div>

            {detections.length === 0 ? (
              <div className={`rounded-xl p-8 text-center flex-1 ${dark ? 'glass' : 'bg-white border border-slate-200'}`}>
                <div className="w-12 h-12 rounded-full border border-[rgba(0,245,255,0.2)] flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-5 h-5 text-slate-600" />
                </div>
                <p className={`text-sm font-mono-num tracking-wide ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {streaming ? 'Start AI detection to see results' : 'Open camera to begin'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                {detections.map((det, i) => (
                  <DetectionCard key={`${det.label}-${i}`} detection={det} index={i} />
                ))}
              </div>
            )}

            {detections.length > 0 && (
              <motion.div className={`rounded-lg p-4 ${dark ? 'glass' : 'bg-white border border-slate-200'}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={`font-display text-xs tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  SUMMARY
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="font-mono-num text-2xl font-bold text-[#00f5ff]">{detections.length}</div>
                    <div className="font-mono-num text-xs text-slate-600">PARTS</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono-num text-2xl font-bold text-[#a855f7]">
                      {Math.round(detections.reduce((a, d) => a + d.confidence, 0) / detections.length * 100)}%
                    </div>
                    <div className="font-mono-num text-xs text-slate-600">AVG CONF</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
