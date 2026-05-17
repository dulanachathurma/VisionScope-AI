import { motion } from 'framer-motion'

// Color mapping for each body part label
const LABEL_COLORS = {
  'Face':          '#00f5ff',
  'Eye':           '#a855f7',
  'Left Eye':      '#a855f7',
  'Right Eye':     '#a855f7',
  'Nose':          '#f59e0b',
  'Mouth':         '#ec4899',
  'Ear':           '#10b981',
  'Left Ear':      '#10b981',
  'Right Ear':     '#10b981',
  'Left Hand':     '#3b82f6',
  'Right Hand':    '#3b82f6',
  'Hand':          '#3b82f6',
  'Thumb':         '#6366f1',
  'Index Finger':  '#6366f1',
  'Middle Finger': '#6366f1',
  'Ring Finger':   '#6366f1',
  'Pinky':         '#6366f1',
  'Finger':        '#6366f1',
}

// Emoji icons for each part
const LABEL_ICONS = {
  'Face':          '👤',
  'Eye':           '👁️',
  'Left Eye':      '👁️',
  'Right Eye':     '👁️',
  'Nose':          '👃',
  'Mouth':         '👄',
  'Ear':           '👂',
  'Left Ear':      '👂',
  'Right Ear':     '👂',
  'Left Hand':     '🤚',
  'Right Hand':    '🤚',
  'Hand':          '🤚',
  'Thumb':         '👍',
  'Index Finger':  '☝️',
  'Middle Finger': '🖕',
  'Ring Finger':   '💍',
  'Pinky':         '🤙',
  'Finger':        '👆',
}

export default function DetectionCard({ detection, index }) {
  const color   = detection.color || LABEL_COLORS[detection.label] || '#00f5ff'
  const icon    = LABEL_ICONS[detection.label] || '🔍'
  const pct     = Math.round(detection.confidence * 100)

  return (
    <motion.div
      className="detection-badge glass rounded-lg p-4 border-l-2"
      style={{ borderLeftColor: color }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label={detection.label}>{icon}</span>
          <span className="font-display text-xs font-bold tracking-wider" style={{ color }}>
            {detection.label.toUpperCase()}
          </span>
        </div>
        <span
          className="font-mono-num text-sm font-bold"
          style={{ color }}
        >
          {pct}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="w-full h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Confidence label */}
      <div className="mt-1.5 text-right">
        <span className="text-[10px] font-mono-num text-slate-600">
          CONFIDENCE
        </span>
      </div>
    </motion.div>
  )
}
