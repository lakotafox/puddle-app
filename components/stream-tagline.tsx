"use client"

import { useState, useEffect } from "react"

export function StreamTagline() {
  const words = ["Movies", "Music", "Wages"]
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    // Only animate through first 2 words, then stop at wages (index 2)
    if (currentWordIndex >= 2) return

    const timer = setTimeout(() => {
      setCurrentWordIndex(prev => prev + 1)
    }, 1500) // Change word every 1.5 seconds

    return () => clearTimeout(timer)
  }, [currentWordIndex])

  return (
    <div className="text-center mb-16 opacity-0" style={{ 
      animation: 'fadeIn 0.8s ease-out 0.3s forwards',
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: '700',
      letterSpacing: '-0.02em'
    }}>
      <div className="inline-flex items-center">
        <span className="text-white" style={{ marginRight: '0.5em' }}>Stream</span>
        <div 
          className="relative inline-block"
          style={{ 
            height: '1.2em',
            width: '250px',
            overflow: 'hidden',
            verticalAlign: 'text-bottom'
          }}
        >
          <div
            className="absolute left-0"
            style={{
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateY(${-currentWordIndex * 1.2}em)`,
              width: '100%'
            }}
          >
            {words.map((word, index) => (
              <div
                key={word}
                className="text-left"
                style={{
                  height: '1.2em',
                  lineHeight: '1.2em',
                  color: index === 2 ? '#3b82f6' : '#94a3b8',
                  fontWeight: index === 2 ? '800' : '700'
                }}
              >
                {word}
                {index === 2 && '.'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}