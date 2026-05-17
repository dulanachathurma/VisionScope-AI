import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImagePlus, Loader2, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import DetectionCard from '../components/DetectionCard'
import { detectFromFile } from '../utils/api'
import { useDetectionHistory } from '../hooks/useDetectionHistory'

export default function UploadDetection() {
  const fileInputRef = useRef(null)

  const [file,         setFile]         = useState(null)
  const [preview,      setPreview]      = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [detections,   setDetections]   = useState([])
  const [annotated,    setAnnotated]    = useState(null)
  const [error,        setError]        = useState(null)
  const [dragActive,   setDragActive]   = useState(false)
  const [done,         setDone]         = useState(false)

  const { history, addDetection, clearHistory } = useDetectionHistory()

  // ── Handle file selection ─────────────────────────────────────────────────
  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP)')
      return
    }

    setFile(selectedFile)
    setDetections([])
    setAnnotated(null)
    setError(null)
    setDone(false)

    // Create local preview URL
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }, [])

  // ── Drag and drop handlers ────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragActive(false)
  }, [])

  // ── Run detection ─────────────────────────────────────────────────────────
  const runDetection = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const result = await detectFromFile(file)

      if (result.error) {
        setError(result.error)
      } else {
        setDetections(result.detections || [])
        setAnnotated(result.annotated_image || null)
        setDone(true)
        addDetection(result.detections || [], 'upload')
      }
    } catch (err) {
      setError(
        'Could not reach backend at localhost:5000. Make sure Flask is running:\n' +
        'cd backend && python app.py'
      )
    } finally {
      setLoading(false)
    }
  }, [file, addDetection])

  // ── Reset all ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setDetections([])
    setAnnotated(null)
    setError(null)
    setDone(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  // ── Download annotated image ──────────────────────────────────────────────
  const downloadAnnotated = useCallback(() => {
    if (!annotated) return
    const link = document.createElement('a')
    link.href = annotated
    link.download = 'visionscope-detection.jpg'
    link.click()
  }, [annotated])

  return (
    <div className="pt-20 min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Page Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-mono-num text-xs text-[#a855f7] tracking-widest mb-2">
            IMAGE ANALYSIS
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-3">
            UPLOAD <span className="gradient-text">IMAGE</span> DETECTION
          </h1>
          <p className="text-slate-400 max-w-xl">
            Upload any photo and the AI will detect all visible body parts,
            draw bounding boxes, and show confidence scores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Panel: Upload + Preview ─────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Drop Zone */}
            {!preview && (
              <motion.div
                className={`drop-zone p-16 flex flex-col items-center justify-center text-center ${dragActive ? 'active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full border border-[rgba(168,85,247,0.3)] flex items-center justify-center mb-6"
                  animate={{ scale: dragActive ? 1.1 : 1 }}
                >
                  <ImagePlus className="w-9 h-9 text-slate-500" />
                </motion.div>
                <p className="font-display text-sm font-bold text-slate-300 tracking-wider mb-2">
                  DROP IMAGE HERE
                </p>
                <p className="text-slate-500 text-sm mb-6">
                  or click to select a file
                </p>
                <div className="flex gap-2">
                  {['JPG', 'PNG', 'WEBP', 'BMP'].map(fmt => (
                    <span
                      key={fmt}
                      className="font-mono-num text-xs text-slate-600 border border-slate-700 px-2 py-0.5 rounded-sm"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </motion.div>
            )}

            {/* Image Preview */}
            {preview && (
              <motion.div
                className="glass-bright rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="relative">
                  {/* Show annotated or original */}
                  <img
                    src={annotated || preview}
                    alt="Preview"
                    className="w-full max-h-[480px] object-contain bg-black"
                  />

                  {/* Loading overlay */}
                  {loading && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-[rgba(0,245,255,0.2)] animate-spin-slow" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-[#00f5ff] animate-spin" />
                        </div>
                      </div>
                      <p className="font-mono-num text-sm text-[#00f5ff] tracking-widest animate-pulse">
                        ANALYZING...
                      </p>
                    </div>
                  )}

                  {/* Done badge */}
                  {done && !loading && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-3 py-1.5 rounded-sm">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="font-mono-num text-xs text-green-400">COMPLETE</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="p-4 flex flex-wrap gap-3">
                  <button
                    onClick={runDetection}
                    disabled={loading}
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" />ANALYZING</>
                      : <><Upload className="inline w-4 h-4 mr-2" />DETECT PARTS</>
                    }
                  </button>

                  {annotated && (
                    <button onClick={downloadAnnotated} className="btn-outline text-sm">
                      <Download className="inline w-4 h-4 mr-2" />
                      DOWNLOAD
                    </button>
                  )}

                  <button onClick={reset} className="btn-outline text-sm">
                    <RefreshCw className="inline w-4 h-4 mr-2" />
                    RESET
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="glass border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm font-mono-num whitespace-pre-line">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Panel: Results + History ───────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Detection results */}
            <div className="flex items-center justify-between">
              <div className="font-display text-xs tracking-widest text-slate-400">
                DETECTION RESULTS
              </div>
              {detections.length > 0 && (
                <div className="font-mono-num text-xs text-[#a855f7]">
                  {detections.length} PARTS
                </div>
              )}
            </div>

            {detections.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-slate-500 text-sm font-mono-num">
                  {preview ? 'Click DETECT PARTS to analyze' : 'Upload an image to begin'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {detections.map((det, i) => (
                    <DetectionCard key={`${det.label}-${i}`} detection={det} index={i} />
                  ))}
                </div>

                {/* Summary */}
                <motion.div
                  className="glass rounded-lg p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="font-display text-xs text-slate-500 tracking-widest mb-3">
                    ANALYSIS SUMMARY
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="font-mono-num text-2xl font-bold text-[#a855f7]">
                        {detections.length}
                      </div>
                      <div className="font-mono-num text-xs text-slate-600">PARTS FOUND</div>
                    </div>
                    <div>
                      <div className="font-mono-num text-2xl font-bold text-[#00f5ff]">
                        {Math.round(
                          detections.reduce((a, d) => a + d.confidence, 0) / detections.length * 100
                        )}%
                      </div>
                      <div className="font-mono-num text-xs text-slate-600">AVG CONFIDENCE</div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Detection History */}
            {history.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-display text-xs tracking-widest text-slate-400">
                    HISTORY
                  </div>
                  <button
                    onClick={clearHistory}
                    className="font-mono-num text-xs text-slate-600 hover:text-red-400 transition-colors"
                  >
                    CLEAR
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {history.slice(0, 5).map(entry => (
                    <div
                      key={entry.id}
                      className="glass rounded-sm px-3 py-2 flex items-center justify-between"
                    >
                      <span className="font-mono-num text-xs text-slate-500">
                        {entry.timestamp}
                      </span>
                      <span className="font-mono-num text-xs text-[#00f5ff]">
                        {entry.count} parts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
