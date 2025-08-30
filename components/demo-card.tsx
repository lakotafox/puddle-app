"use client"

import { Card } from "@/components/ui/card"
import Counter from "@/components/rolling-counter"
import ShinyText from "@/components/ShinyText"
import FadeContent from "@/components/FadeContent"
import GooeyButton from "@/components/GooeyButton"

interface DemoCardProps {
  balanceInCents: number
  isClocked: boolean
  showGradient: boolean
  digitCount: number
  digitsFaded: boolean
  speedMultiplier: number
  setSpeedMultiplier: (value: number) => void
  handleClockIn: () => void
  handleClockOut: () => void
  resetDemo: () => void
  showParticles: boolean
  timeWorkedSeconds: number
}

export function DemoCard({
  balanceInCents,
  isClocked,
  showGradient,
  digitCount,
  digitsFaded,
  speedMultiplier,
  setSpeedMultiplier,
  handleClockIn,
  handleClockOut,
  resetDemo,
  showParticles,
  timeWorkedSeconds
}: DemoCardProps) {
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative max-w-md mx-auto">
      <div 
        className="relative overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          border: '2px solid #334155'
        }}
      >
        {/* Water fill animation */}
        <div 
          className="water-fill" 
          style={{ 
            height: `${Math.min(20 + (timeWorkedSeconds / 28800) * 80, 100)}%`,
            background: 'linear-gradient(180deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.3) 100%)',
          }}
        />
        
        <div className="relative z-10 p-8 text-center">
          {/* Balance Display Box */}
          <div 
            className="relative mb-6 p-6 rounded-2xl flex flex-col items-center justify-center"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569'
            }}
          >
            {/* Counter Display */}
            <FadeContent show={!digitsFaded}>
              <div className="flex items-center justify-center mb-2">
                {/* Dollar sign */}
                <span style={{ 
                  fontSize: '3rem',
                  marginRight: '0.25rem',
                  opacity: digitsFaded ? 0 : 1,
                  transition: 'opacity 1s ease-out',
                  color: showGradient ? '#fbbf24' : '#22c55e'
                }}>$</span>
                
                {/* Dollar digits */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  opacity: digitsFaded ? 0 : 1,
                  transition: 'opacity 1s ease-out'
                }}>
                  {/* Hundreds digit */}
                  {digitCount >= 3 && (
                    <Counter
                      value={Math.floor((balanceInCents / 100) / 100) % 10}
                      places={[1]}
                      fontSize={48}
                      padding={5}
                      gap={0}
                      textColor={showGradient ? "#fbbf24" : "#22c55e"}
                      fontWeight={700}
                      gradientFrom="transparent"
                      gradientTo="transparent"
                    />
                  )}
                  
                  {/* Tens digit */}
                  {digitCount >= 2 && (
                    <Counter
                      value={Math.floor((balanceInCents / 100) / 10) % 10}
                      places={[1]}
                      fontSize={48}
                      padding={5}
                      gap={0}
                      textColor={showGradient ? "#fbbf24" : "#22c55e"}
                      fontWeight={700}
                      gradientFrom="transparent"
                      gradientTo="transparent"
                    />
                  )}
                  
                  {/* Ones digit */}
                  <Counter
                    value={Math.floor(balanceInCents / 100) % 10}
                    places={[1]}
                    fontSize={48}
                    padding={5}
                    gap={0}
                    textColor={showGradient ? "#fbbf24" : "#22c55e"}
                    fontWeight={700}
                    gradientFrom="transparent"
                    gradientTo="transparent"
                  />
                </div>
                
                {/* Decimal point */}
                <span style={{ 
                  fontSize: '3rem',
                  margin: '0 0.1rem',
                  opacity: digitsFaded ? 0 : 1,
                  transition: 'opacity 1s ease-out',
                  color: showGradient ? '#fbbf24' : '#22c55e'
                }}>.</span>
                
                {/* Cents */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  opacity: digitsFaded ? 0 : 1,
                  transition: 'opacity 1s ease-out'
                }}>
                  <Counter
                    value={Math.floor(balanceInCents % 100)}
                    places={[10, 1]}
                    fontSize={48}
                    padding={5}
                    gap={0}
                    textColor={showGradient ? "#fbbf24" : "#22c55e"}
                    fontWeight={700}
                    gradientFrom="transparent"
                    gradientTo="transparent"
                  />
                </div>
              </div>
            </FadeContent>

            {/* Time worked */}
            <div className="text-center">
              <p className="text-gray-400">Time Worked: {formatTime(timeWorkedSeconds)}</p>
            </div>
          </div>

          {/* Speed Slider */}
          <div className="mb-6 px-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Speed</span>
              <span className="text-white">{speedMultiplier}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="75"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(speedMultiplier / 75) * 100}%, #374151 ${(speedMultiplier / 75) * 100}%, #374151 100%)`
              }}
            />
          </div>

          {/* Button */}
          <div>
            <GooeyButton
              onClick={isClocked ? handleClockOut : handleClockIn}
              isClocked={isClocked}
            >
              {isClocked ? 'Clock Out' : 'Clock In'}
            </GooeyButton>
          </div>
        </div>
      </div>
    </div>
  )
}