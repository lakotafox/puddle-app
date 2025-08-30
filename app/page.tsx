"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WaterDrips } from "@/components/water-drips"
import Counter from "@/components/rolling-counter"
import { DemoCard } from "@/components/demo-card"
import { StreamTagline } from "@/components/stream-tagline"
import {
  Clock,
  Zap,
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  Smartphone,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail
} from "lucide-react"

export default function PuddleLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [balanceInCents, setBalanceInCents] = useState(0)
  const [isClocked, setIsClocked] = useState(false)
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [digitCount, setDigitCount] = useState(1)
  const [digitsFaded, setDigitsFaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [catchingUp, setCatchingUp] = useState(false)
  const [showGradient, setShowGradient] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [timeWorkedSeconds, setTimeWorkedSeconds] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const missedTime = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const baseHourlyRate = 25 // Base rate for multiplier
  const minHourlyRate = 7.25 // Minimum hourly rate

  // Time worked counter - speeds up with multiplier
  useEffect(() => {
    if (isClocked) {
      // Adjust interval based on speed multiplier
      const intervalTime = 1000 / speedMultiplier // Faster interval for higher multiplier
      timeIntervalRef.current = setInterval(() => {
        setTimeWorkedSeconds(prev => prev + 1)
      }, intervalTime)
    } else {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current)
      }
    }
    
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current)
      }
    }
  }, [isClocked, speedMultiplier])

  // Animated wage counter - matches puddle app exactly
  useEffect(() => {
    if (isClocked && !isTransitioning) {
      const actualHourlyRate = baseHourlyRate * speedMultiplier // Always $25/hour at 1x
      let perIntervalRate = (actualHourlyRate * 100) / 3600 / 10 // cents per 100ms
      
      if (catchingUp) {
        perIntervalRate *= 3 // Speed up 3x when catching up
      }
      
      intervalRef.current = setInterval(() => {
        setBalanceInCents(prev => {
          let newValue = prev + perIntervalRate
          
          // Check if we've caught up
          if (catchingUp && prev >= missedTime.current) {
            setCatchingUp(false)
            missedTime.current = 0
          }
          
          // Check for $10 threshold
          if (prev < 999 && newValue >= 999) {
            setIsTransitioning(true)
            setDigitsFaded(true)
            
            setTimeout(() => {
              setBalanceInCents(1000)
              setDigitCount(2)
              
              setTimeout(() => {
                setDigitsFaded(false)
                setShowGradient(true)
                
                setTimeout(() => {
                  setShowGradient(false)
                  const totalTransitionTime = 4.9
                  missedTime.current = 1000 + (actualHourlyRate * 100 * totalTransitionTime / 3600)
                  setCatchingUp(true)
                  setIsTransitioning(false)
                }, 3000)
              }, 900)
            }, 1000)
            
            return 999
          }
          
          // Check for $25 threshold
          if (prev < 2499 && newValue >= 2499) {
            setIsTransitioning(true)
            setDigitsFaded(true)
            
            setTimeout(() => {
              setBalanceInCents(2500)
              
              setTimeout(() => {
                setDigitsFaded(false)
                setShowGradient(true)
                
                setTimeout(() => {
                  setShowGradient(false)
                  const totalTransitionTime = 4.9
                  missedTime.current = 2500 + (actualHourlyRate * 100 * totalTransitionTime / 3600)
                  setCatchingUp(true)
                  setIsTransitioning(false)
                }, 3000)
              }, 900)
            }, 1000)
            
            return 2499
          }
          
          // Check for $100 threshold
          if (prev < 9999 && newValue >= 9999) {
            setIsTransitioning(true)
            setDigitsFaded(true)
            
            setTimeout(() => {
              setBalanceInCents(10000)
              setDigitCount(3)
              
              setTimeout(() => {
                setDigitsFaded(false)
                setShowGradient(true)
                
                setTimeout(() => {
                  setShowGradient(false)
                  const totalTransitionTime = 4.9
                  missedTime.current = 10000 + (actualHourlyRate * 100 * totalTransitionTime / 3600)
                  setCatchingUp(true)
                  setIsTransitioning(false)
                }, 3000)
              }, 900)
            }, 1000)
            
            return 9999
          }
          
          return newValue
        })
      }, 100) // Update every 100ms like the original
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isClocked, speedMultiplier, isTransitioning, catchingUp])

  const resetDemo = () => {
    setBalanceInCents(0)
    setIsClocked(false)
    setShowPaymentConfirm(false)
    setShowGradient(false)
    setDigitCount(1)
    setDigitsFaded(false)
    setIsTransitioning(false)
    setCatchingUp(false)
    setTimeWorkedSeconds(0)
    missedTime.current = 0
  }
  
  const handleClockIn = () => {
    setIsClocked(true)
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 2000)
  }

  const handleClockOut = () => {
    setIsClocked(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">PUDDL3</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#how-it-works" className="text-white hover:text-blue-400 transition-colors">
                  How It Works
                </a>
                <a href="#wage-streaming" className="text-white hover:text-blue-400 transition-colors">
                  Wage Streaming
                </a>
                <a href="#demo" className="text-white hover:text-blue-400 transition-colors">
                  Demo
                </a>
                <a href="#benefits" className="text-white hover:text-blue-400 transition-colors">
                  Benefits
                </a>
                <a href="#contact" className="text-white hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Button size="icon" variant="ghost" className="text-white hover:text-blue-400">
                <Phone className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:text-blue-400">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:text-blue-400">
                <Mail className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
                <a href="#how-it-works" className="block px-3 py-2 text-white hover:text-blue-400">
                  How It Works
                </a>
                <a href="#wage-streaming" className="block px-3 py-2 text-white hover:text-blue-400">
                  Wage Streaming
                </a>
                <a href="#demo" className="block px-3 py-2 text-white hover:text-blue-400">
                  Demo
                </a>
                <a href="#benefits" className="block px-3 py-2 text-white hover:text-blue-400">
                  Benefits
                </a>
                <a href="#contact" className="block px-3 py-2 text-white hover:text-blue-400">
                  Contact
                </a>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Book Demo</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* All main sections with continuous water drops and gradient */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(to bottom, #111827 0%, #111827 33%, #581c87 39%, #111827 55%, #111827 79%, #1e40af 81%, #111827 90%)'
      }}>
        <WaterDrips />
        
        {/* Hero Section */}
        <section id="wage-streaming" className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
            {/* Stream Tagline */}
            <StreamTagline />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 opacity-0" style={{ animation: 'fadeInUp 2s ease-out 4.5s forwards' }}>
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-balance text-white">
                    Pay by the <span className="text-blue-400">Second</span>
                  </h1>
                  <p className="text-xl text-gray-300 text-pretty">
                    <span className="text-green-400">Real-time</span> payroll.<br />
                    The ability to stream payments in real time is here.
                  </p>
                </div>

              </div>

              {/* Interactive Demo */}
              <div id="demo" className="relative opacity-0" style={{ animation: 'fadeInUp 2s ease-out 4.8s forwards' }}>
                <DemoCard
                  balanceInCents={balanceInCents}
                  isClocked={isClocked}
                  showGradient={showGradient}
                  digitCount={digitCount}
                  digitsFaded={digitsFaded}
                  speedMultiplier={speedMultiplier}
                  setSpeedMultiplier={setSpeedMultiplier}
                  handleClockIn={handleClockIn}
                  handleClockOut={handleClockOut}
                  resetDemo={resetDemo}
                  showParticles={showParticles}
                  timeWorkedSeconds={timeWorkedSeconds}
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - continues in same container */}
        <section id="how-it-works" className="py-48 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">How It <span className="text-blue-400">Works</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              {/* Simple Black and White Clock */}
              <div className="relative w-24 h-24 mx-auto">
                <div className="w-full h-full bg-black rounded-2xl shadow-2xl flex items-center justify-center">
                  {/* Clock face */}
                  <div className="relative w-16 h-16 bg-white rounded-full">
                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => (
                      <div key={i}
                           className="absolute w-0.5 h-2 bg-black"
                           style={{
                             top: '4px',
                             left: '50%',
                             transform: `translateX(-50%) rotate(${i * 30}deg)`,
                             transformOrigin: 'center 28px'
                           }}></div>
                    ))}
                    {/* Clock hands */}
                    <div className="absolute w-0.5 h-5 bg-black"
                         style={{ 
                           top: '50%',
                           left: '50%',
                           transform: 'translateX(-50%) translateY(-100%)',
                           transformOrigin: '50% 100%',
                           animation: 'clockHandSimple 10s linear infinite'
                         }}></div>
                    <div className="absolute w-1 h-4 bg-black"
                         style={{ 
                           top: '50%',
                           left: '50%',
                           transform: 'translateX(-50%) translateY(-100%)',
                           transformOrigin: '50% 100%',
                           animation: 'clockHandSimple 120s linear infinite'
                         }}></div>
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">1. Clock In</h3>
              <p className="text-gray-300">
                Clock in, start earning
              </p>
            </div>

            <div className="text-center space-y-4">
              {/* 3D Water Fill Animation */}
              <div className="relative w-24 h-24 mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl transform -rotate-6 group-hover:-rotate-12 transition-transform duration-300 opacity-20"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:scale-110"
                     style={{
                       transformStyle: 'preserve-3d'
                     }}>
                  {/* Water fill effect */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400/50 to-cyan-300/30"
                       style={{
                         height: '60%',
                         animation: 'waterRise 6s ease-in-out infinite',
                       }}>
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/20"
                         style={{
                           animation: 'wave 4s linear infinite',
                         }}></div>
                  </div>
                  {/* Dollar sign overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/90">$</span>
                  </div>
                  {/* Floating coins */}
                  <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full"
                       style={{ animation: 'floatCoin 4s ease-in-out infinite' }}></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-yellow-400 rounded-full"
                       style={{ animation: 'floatCoin 4s ease-in-out infinite 1s' }}></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">2. Wages Stream</h3>
              <p className="text-gray-300">
                Wages accumulate in real-time
              </p>
            </div>

            <div className="text-center space-y-4">
              {/* 3D Rocket Launch */}
              <div className="relative w-24 h-24 mx-auto">
                {/* Speed lines behind rocket */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}
                         className="absolute w-0.5 bg-gradient-to-b from-transparent via-white to-transparent"
                         style={{
                           height: '40px',
                           left: `${25 + i * 12}%`,
                           top: '-20px',
                           animation: 'speedLineVertical 0.8s ease-out infinite',
                           animationDelay: `${i * 0.1}s`,
                           opacity: 0
                         }}></div>
                  ))}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Rocket */}
                  <div className="relative"
                       style={{
                         animation: 'rocketFloat 3s ease-in-out infinite',
                         transform: 'translateY(0)'
                       }}>
                    {/* Flame effect - placed first in DOM to appear behind */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <div className="w-6 h-8 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full"
                             style={{
                               animation: 'flame 0.3s ease-in-out infinite alternate',
                               filter: 'blur(2px)',
                               boxShadow: '0 10px 20px rgba(251, 146, 60, 0.8)'
                             }}></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-white via-yellow-200 to-orange-400 rounded-b-full"
                             style={{
                               animation: 'flame 0.2s ease-in-out infinite alternate',
                               filter: 'blur(1px)'
                             }}></div>
                      </div>
                    </div>
                    {/* Rocket body - placed after flame to appear on top */}
                    <div className="w-8 h-16 bg-gradient-to-b from-orange-500 to-orange-600 rounded-t-full relative mx-auto"
                         style={{
                           boxShadow: '0 0 20px rgba(251, 146, 60, 0.5)'
                         }}>
                      {/* Blue nose cone */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-blue-500 rounded-t-full"></div>
                      {/* Window */}
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border border-gray-400"></div>
                      {/* Fins */}
                      <div className="absolute bottom-0 -left-2 w-0 h-0"
                           style={{
                             borderLeft: '8px solid transparent',
                             borderRight: '0px solid transparent',
                             borderBottom: '12px solid #3b82f6'
                           }}></div>
                      <div className="absolute bottom-0 -right-2 w-0 h-0"
                           style={{
                             borderLeft: '0px solid transparent',
                             borderRight: '8px solid transparent',
                             borderBottom: '12px solid #3b82f6'
                           }}></div>
                    </div>
                    {/* Smoke particles */}
                    {[...Array(3)].map((_, i) => (
                      <div key={i}
                           className="absolute bottom-0 left-1/2 w-2 h-2 bg-gray-400 rounded-full"
                           style={{
                             animation: `smoke ${1 + i * 0.3}s ease-out infinite`,
                             animationDelay: `${i * 0.2}s`,
                             opacity: 0,
                             zIndex: 1
                           }}></div>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">3. Instant Transfer</h3>
              <p className="text-gray-300">
                Done.
              </p>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes fadeInUp {
              from { 
                opacity: 0;
                transform: translateY(30px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes clockHandSimple {
              from { transform: translateX(-50%) translateY(-100%) rotate(0deg); }
              to { transform: translateX(-50%) translateY(-100%) rotate(360deg); }
            }
            @keyframes waterRise {
              0%, 100% { height: 30%; }
              50% { height: 70%; }
            }
            @keyframes wave {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes floatCoin {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(180deg); }
            }
            @keyframes rocketFloat {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              25% { transform: translateY(-3px) rotate(-1deg); }
              75% { transform: translateY(3px) rotate(1deg); }
            }
            @keyframes flame {
              0% { transform: scaleY(1); }
              100% { transform: scaleY(1.2); }
            }
            @keyframes smoke {
              0% { transform: translate(-50%, 0) scale(0); opacity: 0.6; }
              50% { opacity: 0.3; }
              100% { transform: translate(-50%, 30px) scale(3); opacity: 0; }
            }
            @keyframes speedLineVertical {
              0% { transform: translateY(-20px); opacity: 0; }
              20% { opacity: 0.8; }
              80% { opacity: 0.8; }
              100% { transform: translateY(120px); opacity: 0; }
            }
          `}</style>
        </div>
      </section>

      {/* For Employers Section - continues in same container */}
      <section id="benefits" className="py-48 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                From Burden → <span className="text-blue-400">Benefit</span>
              </h2>
              <p className="text-xl text-gray-300">
                Clock in, start getting paid.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30 mx-auto">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-white text-lg">Empower Your Team</h3>
                  <p className="text-gray-300">Payroll that supports as well as you do</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30 mx-auto">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-white text-lg">Flexible Payment</h3>
                  <p className="text-gray-300">
                    Pay on your schedule, not the calendar's.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30 mx-auto">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-white text-lg">Enhance Employee Experience</h3>
                  <p className="text-gray-300">
                    Empower with Real-Time Pay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - continues in same container */}
      <section className="py-48 text-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Join the Wage Streaming Revolution</h2>
            <p className="text-xl opacity-90">
              Schedule a demo see how Puddle can transform your business and employees
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50,000+</div>
                <p className="text-white/80">Workers paid instantly</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">$10M+</div>
                <p className="text-white/80">Processing monthly</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <p className="text-white/80">Access to earned wages</p>
              </div>
            </div>

            <div className="pt-16" id="contact">
              <Button 
                onClick={() => setShowModal(true)}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white shadow-xl transition-all transform hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Get Started Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Get Started</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company" className="text-white">
                  Company Size
                </Label>
                <select 
                  className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  autoFocus
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@company.com"
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold">
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="text-2xl font-bold text-blue-400">PUDDL3</div>
              <p className="text-sm text-gray-400">The future of payroll is real-time payments</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400">Powered by</p>
                <svg width="60" height="16" viewBox="0 0 80 20" className="fill-current text-gray-400">
                  <circle cx="10" cy="10" r="8" fill="currentColor"/>
                  <text x="22" y="14" fontSize="12" fontWeight="600">Stellar</text>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400">© 2025 Puddle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
