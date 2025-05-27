import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="Formably Logo"
            className="h-8 w-8"
          />
          <span className="text-2xl font-cursive gradient-text">Formably</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Beautiful Forms <span className="gradient-text">in Minutes</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Formita makes it easy to create, customize, and share stunning survey forms. Get valuable insights
                    from your audience with our powerful analytics.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="rounded-full" asChild>
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full" asChild>
                    <Link href="/features">Learn More</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Free plan available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px]">
                  <div className="blob-shape bg-primary/10 w-[500px] h-[500px] absolute -top-20 -right-20 animate-float"></div>
                  <div className="relative z-10">
                    <div className="rounded-2xl overflow-hidden border shadow-xl">
                      <div className="bg-primary h-12 flex items-center px-4">
                        <div className="w-3 h-3 rounded-full bg-white/20 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                      </div>
                      <div className="bg-card p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold">Customer Feedback</h3>
                          <p className="text-sm text-muted-foreground">Help us improve our products and services</p>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">How satisfied are you with our product?</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  className={`w-8 h-8 rounded-md flex items-center justify-center ${num === 5 ? "bg-primary text-white" : "border"}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">What features do you like the most?</label>
                            <div className="h-20 border rounded-md"></div>
                          </div>
                          <Button className="w-full">Submit</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Formita provides all the tools you need to create, customize, and analyze your forms
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Easy Form Builder",
                  description: "Drag and drop interface to create beautiful forms in minutes",
                  icon: "🛠️",
                },
                {
                  title: "Customizable Design",
                  description: "Personalize colors, fonts, and layouts to match your brand",
                  icon: "🎨",
                },
                {
                  title: "Advanced Analytics",
                  description: "Get detailed insights and visualizations of your form responses",
                  icon: "📊",
                },
                {
                  title: "Multiple Question Types",
                  description: "Choose from various question types to collect the data you need",
                  icon: "❓",
                },
                {
                  title: "Conditional Logic",
                  description: "Create dynamic forms that change based on user responses",
                  icon: "🔄",
                },
                {
                  title: "Export & Sharing",
                  description: "Easily share forms and export data in multiple formats",
                  icon: "📤",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm card-hover"
                >
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Testimonials
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Loved by Thousands</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    See what our users have to say about Formita
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      quote:
                        "Formita has completely transformed how we collect customer feedback. The analytics are incredible!",
                      author: "Sarah Johnson",
                      role: "Product Manager at TechCorp",
                    },
                    {
                      quote:
                        "I was able to create a beautiful survey in just 10 minutes. The customization options are endless.",
                      author: "Michael Chen",
                      role: "Marketing Director at GrowthLabs",
                    },
                  ].map((testimonial, index) => (
                    <div key={index} className="rounded-lg border p-6 shadow-sm">
                      <div className="flex flex-col space-y-2">
                        <p className="text-muted-foreground">"{testimonial.quote}"</p>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Pricing
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Choose the plan that works for you
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border p-6 shadow-sm card-hover">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-xl font-bold">Free</h3>
                      <p className="text-muted-foreground">Perfect for getting started</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">$0</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>3 forms</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>100 responses/month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Basic analytics</span>
                        </li>
                      </ul>
                      <Button className="mt-4 w-full" variant="outline" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary bg-primary/5 p-6 shadow-sm card-hover">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-xl font-bold">Pro</h3>
                      <p className="text-muted-foreground">For professionals and teams</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">$29</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Unlimited forms</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Unlimited responses</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Custom branding</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                      <Button className="mt-4 w-full" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are creating beautiful forms with Formita
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="rounded-full" asChild>
                  <Link href="/signup">
                    Sign Up for Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent text-primary-foreground"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2023 Formita. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
