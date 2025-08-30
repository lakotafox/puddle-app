"use client"

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
}

export function Particles({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * -200 - 50,
        size: Math.random() * 8 + 4,
        color: ['#22c55e', '#10b981', '#34d399', '#86efac'][Math.floor(Math.random() * 4)]
      }))
      setParticles(newParticles)
      
      setTimeout(() => {
        setParticles([])
      }, 3000)
    }
  }, [trigger])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: '50%',
            bottom: '40%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            animation: `particle-float 3s ease-out forwards`,
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}