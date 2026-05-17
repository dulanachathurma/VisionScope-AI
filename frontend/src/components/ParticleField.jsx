import { useEffect, useRef } from 'react'

// Canvas-based animated particle field for the hero background
export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width  = canvas.width  = window.innerWidth
    let height = canvas.height = window.innerHeight
    let animId

    // Create particles
    const PARTICLE_COUNT = 80
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:      Math.random() * width,
      y:      Math.random() * height,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      alpha:  Math.random() * 0.5 + 0.1,
      color:  Math.random() > 0.5 ? '#00f5ff' : '#a855f7',
    }))

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(')', `, ${p.alpha})`).replace('rgb', 'rgba')
          .replace('#00f5ff', `rgba(0, 245, 255, ${p.alpha})`)
          .replace('#a855f7', `rgba(168, 85, 247, ${p.alpha})`)
        ctx.fill()

        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    // Handle resize
    const handleResize = () => {
      width  = canvas.width  = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
