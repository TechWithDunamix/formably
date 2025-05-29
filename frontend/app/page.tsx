"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Github, Sparkles, Zap, Shield } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleVisibility = () => setIsVisible(true)

    window.addEventListener("scroll", handleScroll)
    handleVisibility()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/20 rounded-full animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-400/25 rounded-full animate-ping"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-background/80 sticky top-0 z-50 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <img src="/logo.svg" alt="Formably Logo" className="h-8 w-8 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-xl sm:text-2xl font-cursive gradient-text">Formably</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Login
          </Link>
          <Button asChild className="relative overflow-hidden group">
            <Link href="/register">
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Animated curves */}
        <div className="absolute top-0 left-0 w-full overflow-hidden z-0">
          <svg className="w-full h-24 sm:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-primary/10 animate-slow-pulse"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            ></path>
          </svg>
        </div>

        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative z-10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div
                className={`flex flex-col justify-center space-y-6 ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>100% Free Forever</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Create Beautiful Forms <span className="gradient-text-animated">in Minutes</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
                    Formably makes it easy to create, customize, and share stunning survey forms. Get valuable insights
                    from your audience with our powerful analytics.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <Link href="/register">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                 
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="font-medium">100% Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium">No credit card</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <Zap className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span className="font-medium">No Google account</span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center justify-center ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}>
                <div className="relative w-full max-w-[500px]">
                  <div className="blob-shape bg-gradient-to-br from-primary/20 to-pink-500/20 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] absolute -top-10 sm:-top-20 -right-10 sm:-right-20 animate-float blur-xl"></div>
                  <div className="blob-shape bg-gradient-to-tl from-blue-500/10 to-purple-500/10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 animate-float-delayed blur-xl"></div>
                  <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                    <div className="rounded-2xl overflow-hidden border shadow-2xl bg-background/80 backdrop-blur-sm">
                      <div className="bg-gradient-to-r from-primary to-purple-600 h-12 flex items-center px-4">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-white/30 animate-pulse"></div>
                          <div
                            className="w-3 h-3 rounded-full bg-white/30 animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                          <div
                            className="w-3 h-3 rounded-full bg-white/30 animate-pulse"
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-card p-4 sm:p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-xl font-bold">Customer Feedback</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Help us improve our products and services
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-medium">
                              How satisfied are you with our product?
                            </label>
                            <div className="flex gap-1 sm:gap-2">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs sm:text-sm transition-all hover:scale-110 cursor-pointer ${
                                    num === 5
                                      ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
                                      : "border hover:border-primary/50"
                                  }`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-medium">
                              What features do you like the most?
                            </label>
                            <div className="h-16 sm:h-20 border rounded-md bg-muted/50"></div>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Wave separator */}
        <div className="w-full overflow-hidden">
          <svg className="w-full h-16 sm:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--muted))" />
                <stop offset="50%" stopColor="hsl(var(--primary) / 0.1)" />
                <stop offset="100%" stopColor="hsl(var(--muted))" />
              </linearGradient>
            </defs>
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              fill="url(#waveGradient)"
            ></path>
          </svg>
        </div>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground font-medium">
                  Features
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">Everything You Need</h2>
                <p className="max-w-[900px] text-muted-foreground text-base sm:text-lg md:text-xl/relaxed">
                  Formably provides all the tools you need to create, customize, and analyze your forms
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Easy Form Builder",
                  description: "Drag and drop interface to create beautiful forms in minutes",
                  icon: "🛠️",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Customizable Design",
                  description: "Personalize colors, fonts, and layouts to match your brand",
                  icon: "🎨",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "Advanced Analytics",
                  description: "Get detailed insights and visualizations of your form responses",
                  icon: "📊",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "Multiple Question Types",
                  description: "Choose from various question types to collect the data you need",
                  icon: "❓",
                  color: "from-orange-500 to-red-500",
                },
                {
                  title: "Conditional Logic",
                  description: "Create dynamic forms that change based on user responses",
                  icon: "🔄",
                  color: "from-indigo-500 to-purple-500",
                },
                {
                  title: "Export & Sharing",
                  description: "Easily share forms and export data in multiple formats",
                  icon: "📤",
                  color: "from-teal-500 to-blue-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border bg-background/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
                    <div className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Wave separator */}
        <div className="w-full overflow-hidden">
          <svg className="w-full h-16 sm:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-primary/10"
            ></path>
          </svg>
        </div>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-primary-foreground relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full -mt-16 sm:-mt-20 -mr-16 sm:-mr-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-white/5 rounded-full -mb-24 sm:-mb-40 -ml-24 sm:-ml-20 blur-2xl animate-slow-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-base sm:text-lg md:text-xl/relaxed opacity-90">
                  Join thousands of users who are creating beautiful forms with Formably - 100% free, forever!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full bg-white text-primary hover:bg-white/90 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link href="/register">
                    Sign Up for Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent text-primary-foreground border-white/30 hover:bg-white/10 transform hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="container px-4 md:px-6 py-8 sm:py-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 group">
              <img
                src="/nexios.svg"
                alt="Nexios Logo"
                className="h-6 transition-transform group-hover:scale-110"
              />
              <span className="text-sm font-medium">Built by Nexios Labs</span>
              <Link href="https://github.com/nexios-labs" className="text-sm hover:text-primary transition-colors">
                <Github className="h-4 w-4 hover:scale-110 transition-transform" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
              <p className="text-xs text-muted-foreground">© 2023 Formably. All rights reserved.</p>
              <nav className="flex gap-6">
                <Link
                  href="/terms"
                  className="text-xs hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-xs hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  Privacy
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
