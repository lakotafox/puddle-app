"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Play, Square, RotateCcw } from "lucide-react"

export default function WageStreamingPage() {
  const { user } = useUser()
  const [isClocked, setIsClocked] = useState(false)
  const [balanceInCents, setBalanceInCents] = useState(0)
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeRef = useRef<NodeJS.Timeout | null>(null)

  const hourlyRate = 25 // $25/hour demo rate

  // Time counter
  useEffect(() => {
    if (isClocked) {
      timeRef.current = setInterval(() => {
        setTimeWorkedSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (timeRef.current) clearInterval(timeRef.current)
    }
    return () => {
      if (timeRef.current) clearInterval(timeRef.current)
    }
  }, [isClocked])

  // Wage accumulator
  useEffect(() => {
    if (isClocked) {
      const centsPerInterval = (hourlyRate * 100) / 3600 / 10
      intervalRef.current = setInterval(() => {
        setBalanceInCents((prev) => prev + centsPerInterval)
      }, 100)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isClocked])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const handleReset = () => {
    setIsClocked(false)
    setBalanceInCents(0)
    setTimeWorkedSeconds(0)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Wage Streaming</h1>
        <p className="text-gray-400 mt-1">
          Real-time wage tracking — clock in and watch earnings accumulate.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isClocked ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
            <span className="text-lg font-medium text-white">
              {isClocked ? "Clocked In" : "Clocked Out"}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            Rate: ${hourlyRate}/hr
          </span>
        </div>

        {/* Earnings Display */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-400 mb-2">Earned This Shift</p>
          <div className="text-6xl font-bold text-white tabular-nums">
            {formatMoney(balanceInCents)}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums">{formatTime(timeWorkedSeconds)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isClocked ? (
            <Button
              onClick={() => setIsClocked(true)}
              size="lg"
              className="px-8 bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-5 w-5 mr-2" />
              Clock In
            </Button>
          ) : (
            <Button
              onClick={() => setIsClocked(false)}
              size="lg"
              className="px-8 bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="h-5 w-5 mr-2" />
              Clock Out
            </Button>
          )}
          {!isClocked && balanceInCents > 0 && (
            <>
              <Button
                size="lg"
                className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Transfer to Account
              </Button>
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="px-4 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">How Wage Streaming Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-medium text-white">Clock In</h3>
            <p className="text-sm text-gray-400">
              Workers clock in via the app or connected time-tracking system.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="font-medium text-white">Wages Accumulate</h3>
            <p className="text-sm text-gray-400">
              Earnings stream in real-time based on the worker's hourly rate.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-yellow-400" />
            </div>
            <h3 className="font-medium text-white">Instant Access</h3>
            <p className="text-sm text-gray-400">
              Transfer earned wages to your Puddle account instantly, anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
