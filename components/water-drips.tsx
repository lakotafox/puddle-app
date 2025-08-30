"use client"

import { useEffect, useState } from "react"

export function WaterDrips() {
  const [drips, setDrips] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random drips
    const newDrips = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2,
    }))
    setDrips(newDrips)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drips.map((drip) => (
        <div
          key={drip.id}
          className="absolute water-drip"
          style={{
            left: `${drip.left}%`,
            animationDelay: `${drip.delay}s`,
            animationDuration: `${drip.duration}s`,
          }}
        >
          <div className="drip-shape" />
        </div>
      ))}
      
      <style jsx>{`
        .water-drip {
          animation: drip-fall infinite ease-in;
        }
        
        .drip-shape {
          width: 6px;
          height: 10px;
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.8) 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
          animation: inherit;
          animation-name: drip-shape-fall;
        }
        
        
        @keyframes drip-fall {
          0%, 100% {
            transform: translateY(-10vh);
          }
        }
        
        @keyframes drip-shape-fall {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          2% {
            opacity: 1;
          }
          100% {
            transform: translateY(300vh);
            opacity: 1;
          }
        }
        
        .water-drip:nth-child(odd) .drip-shape {
          width: 5px;
          height: 8px;
        }
        
        .water-drip:nth-child(even) {
          animation-duration: 4s;
        }
        
        .water-drip:nth-child(3n) .drip-shape {
          background: linear-gradient(180deg, rgba(96, 165, 250, 0.5) 0%, rgba(96, 165, 250, 0.7) 100%);
        }
      `}</style>
    </div>
  )
}