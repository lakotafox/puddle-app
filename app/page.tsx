"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"

export default function PuddleLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [wageAmount, setWageAmount] = useState(0)
  const [isClocked, setIsClocked] = useState(false)
  const [progress, setProgress] = useState(0)

  // Animated wage counter
  useEffect(() => {
    if (isClocked) {
      const interval = setInterval(() => {
        setWageAmount((prev) => prev + 0.25)
        setProgress((prev) => Math.min(prev + 2, 100))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isClocked])

  const resetDemo = () => {
    setWageAmount(0)
    setProgress(0)
    setIsClocked(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-emerald-500">PUDDL3</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#solutions" className="text-foreground hover:text-emerald-500 transition-colors">
                  Solutions
                </a>
                <a href="#employers" className="text-foreground hover:text-emerald-500 transition-colors">
                  For Employers
                </a>
                <a href="#workers" className="text-foreground hover:text-emerald-500 transition-colors">
                  For Workers
                </a>
                <a href="#pricing" className="text-foreground hover:text-emerald-500 transition-colors">
                  Pricing
                </a>
                <a href="#resources" className="text-foreground hover:text-emerald-500 transition-colors">
                  Resources
                </a>
                <a href="#company" className="text-foreground hover:text-emerald-500 transition-colors">
                  Company
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Book Demo</Button>
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
                <a href="#solutions" className="block px-3 py-2 text-foreground hover:text-emerald-500">
                  Solutions
                </a>
                <a href="#employers" className="block px-3 py-2 text-foreground hover:text-emerald-500">
                  For Employers
                </a>
                <a href="#workers" className="block px-3 py-2 text-foreground hover:text-emerald-500">
                  For Workers
                </a>
                <a href="#pricing" className="block px-3 py-2 text-foreground hover:text-emerald-500">
                  Pricing
                </a>
                <a href="#resources" className="block px-3 py-2 text-foreground hover:text-emerald-500">
                  Resources
                </a>
                <a href="#company" className="block px-3 py-2 text-foreground hover:text-emerald-500">
                  Company
                </a>
                <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">Book Demo</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-emerald-50/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Powered by XRP Ledger
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                  Pay Employees by the <span className="text-emerald-500">Second</span>, Not the Week
                </h1>
                <p className="text-xl text-muted-foreground text-pretty">
                  The first real-time payroll platform that streams wages directly to workers as they earn
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Schedule Demo with Connor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
                >
                  <Play className="mr-2 h-4 w-4" />
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  3-5 second settlements
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  Zero fees for workers
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Live Wage Demo</CardTitle>
                  <CardDescription>Watch wages accumulate in real-time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-500">${wageAmount.toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Earned this session</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wage Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>

                  <div className="flex gap-2">
                    {!isClocked ? (
                      <Button
                        onClick={() => setIsClocked(true)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Clock In
                      </Button>
                    ) : (
                      <Button onClick={() => setIsClocked(false)} variant="outline" className="flex-1">
                        Clock Out
                      </Button>
                    )}
                    <Button onClick={resetDemo} variant="outline" size="sm">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Bento Grid */}
      <section id="solutions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Transform Your Payroll, Transform Your Business</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the wage streaming revolution and give your employees the financial freedom they deserve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-emerald-500 mb-2" />
                <CardTitle className="text-2xl">Reduce Turnover by 40%</CardTitle>
                <CardDescription>Workers stay when they get paid daily</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Eliminate the financial stress that drives employees away. Real-time pay means real retention.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Zap className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Zero Integration Hassle</CardTitle>
                <CardDescription>Works with existing payroll systems</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Seamless integration with your current setup</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <Clock className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Instant Settlement</CardTitle>
                <CardDescription>XRP-powered transactions in 3-5 seconds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Lightning-fast blockchain settlements</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle className="text-2xl">Complete Transparency</CardTitle>
                <CardDescription>Workers see exactly what they've earned</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time visibility builds trust and eliminates payroll disputes forever.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How Puddle Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to revolutionize your payroll</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold">1. Clock In</h3>
              <p className="text-muted-foreground">
                Employees clock in through the Puddle app and start earning immediately
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">2. Wages Stream</h3>
              <p className="text-muted-foreground">
                Watch wages accumulate in real-time with our signature water-fill animation
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold">3. Instant Transfer</h3>
              <p className="text-muted-foreground">
                Transfer earned wages to any bank account instantly or free in 1-3 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section id="employers" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Turn Payroll from a Burden into a <span className="text-emerald-500">Benefit</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Your employees shouldn't wait 2 weeks for money they've already earned
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Attract Better Talent</h3>
                    <p className="text-muted-foreground">Stand out from competitors with instant pay benefits</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Reduce Payday Loan Dependence</h3>
                    <p className="text-muted-foreground">
                      Help employees avoid predatory lending with access to earned wages
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Improve Worker Satisfaction</h3>
                    <p className="text-muted-foreground">
                      Higher satisfaction scores lead to better productivity and retention
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Simple Monthly Billing</CardTitle>
                <CardDescription>No setup fees, no hidden costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-500">$5</div>
                  <p className="text-muted-foreground">per employee per month</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                    <span className="text-sm">Unlimited wage streaming</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                    <span className="text-sm">Instant transfers included</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                    <span className="text-sm">Volume discounts available</span>
                  </div>
                </div>

                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Start Free Trial</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built on <span className="text-blue-500">XRP Ledger</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise-grade blockchain technology that makes instant, low-cost payments possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>3-5 Seconds</CardTitle>
                <CardDescription>Settlement time</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <CardTitle>$0.0002</CardTitle>
                <CardDescription>Transaction fees</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Bank-Grade</CardTitle>
                <CardDescription>Security standards</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>RLUSD</CardTitle>
                <CardDescription>Stablecoin support</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join the Wage Streaming Revolution</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-500 mb-2">50,000+</div>
              <p className="text-muted-foreground">Workers paid instantly</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">$10M+</div>
              <p className="text-muted-foreground">Processing monthly</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-500 mb-2">40%</div>
              <p className="text-muted-foreground">Reduction in turnover</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to Revolutionize Your Payroll?</h2>
            <p className="text-xl opacity-90">
              Schedule a demo with Connor and see how Puddle can transform your business
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Schedule Demo with Connor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                Contact Sales
              </Button>
            </div>

            <div className="pt-8">
              <Card className="max-w-md mx-auto bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company" className="text-white">
                      Company Size
                    </Label>
                    <select className="w-full mt-1 p-2 rounded bg-white/20 border border-white/30 text-white">
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
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Get Started</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-emerald-500">PUDDL3</div>
              <p className="text-muted-foreground">The future of payroll is real-time payments</p>
              <p className="text-sm text-muted-foreground">Built with ❤️ on XRP Ledger</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>For Employers</div>
                <div>For Workers</div>
                <div>API Documentation</div>
                <div>Integrations</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Blog</div>
                <div>Help Center</div>
                <div>Security</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 Puddle. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                SOC 2 Compliant
              </Badge>
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                FDIC Insured
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
