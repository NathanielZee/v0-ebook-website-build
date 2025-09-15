"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Users, Star, Download, Shield, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

// Currency conversion rates (base: NGN)
const currencyRates = {
  NGN: { rate: 1, symbol: "₦" },
  USD: { rate: 0.0012, symbol: "$" },
  EUR: { rate: 0.0011, symbol: "€" },
  GBP: { rate: 0.00095, symbol: "£" },
  CAD: { rate: 0.0016, symbol: "C$" },
  AUD: { rate: 0.0018, symbol: "A$" },
}

function PricingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currency, setCurrency] = useState("NGN")

  // Detect user's country and set currency
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        const countryCode = data.country_code

        const currencyMap = {
          US: "USD",
          CA: "CAD",
          GB: "GBP",
          AU: "AUD",
          DE: "EUR",
          FR: "EUR",
          IT: "EUR",
          ES: "EUR",
          NL: "EUR",
        }

        setCurrency(currencyMap[countryCode] || "NGN")
      } catch (error) {
        setCurrency("NGN") // Default to NGN if detection fails
      }
    }

    detectCurrency()
  }, [])

  const formatPrice = (priceInNGN) => {
    const rate = currencyRates[currency]
    const convertedPrice = Math.round(priceInNGN * rate.rate)
    return `${rate.symbol}${convertedPrice.toLocaleString()}`
  }

  const packages = [
    {
      title: "Online Mastery Program",
      originalPrice: 15000,
      price: 7500,
      badge: "Early Bird Special",
      features: [
        "7 comprehensive modules",
        "Step-by-step business blueprints",
        "Real income-generating project templates",
        "Lifetime access to all updates",
        "30-day transformation guarantee",
      ],
    },
    {
      title: "Complete Physical Package",
      price: 20000,
      badge: "Everything you need delivered to you",
      features: [
        "Full digital course access",
        "Printed materials and workbooks",
        "Bonus templates and checklists",
        "Direct support from Efezino's team",
        "Free delivery across Nigeria",
        "Save 5% when ordering 3+ copies",
      ],
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % packages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + packages.length) % packages.length)
  }

  return (
    <div className="relative">
      {/* Currency Selector */}
      <div className="flex justify-center mb-6">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          {Object.entries(currencyRates).map(([code, data]) => (
            <option key={code} value={code}>
              {code} ({data.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {packages.map((pkg, index) => (
          <Card
            key={index}
            className={`border-2 ${index === 0 ? "border-primary/20" : "border-border/50"} bg-card relative overflow-hidden`}
          >
            {index === 0 && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-b-lg">
                Best Value
              </div>
            )}
            <CardContent className="p-8 pt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.title}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground">{formatPrice(pkg.price)}</span>
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(pkg.originalPrice)}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{pkg.badge}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block">
                <Button size="lg" className="w-full text-base font-semibold">
                  Get Instant Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {packages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {packages.map((pkg, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <Card
                  className={`border-2 ${index === 0 ? "border-primary/20" : "border-border/50"} bg-card relative overflow-hidden`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-b-lg">
                      Best Value
                    </div>
                  )}
                  <CardContent className="p-6 pt-10">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{pkg.title}</h3>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-foreground">{formatPrice(pkg.price)}</span>
                        {pkg.originalPrice && (
                          <span className="text-base text-muted-foreground line-through">
                            {formatPrice(pkg.originalPrice)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{pkg.badge}</p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/sign-up" className="block">
                      <Button size="lg" className="w-full text-sm font-semibold">
                        Get Instant Access
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" size="sm" onClick={prevSlide} className="w-10 h-10 p-0 bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextSlide} className="w-10 h-10 p-0 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CodeCraft</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Success Stories
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="text-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              🚀 New Release Available
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Code Your Way to Financial Freedom
              </span>{" "}
              in 90 Days
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
              Transform your life in 3 months with our proven system. Learn AI-enhanced development, build
              income-generating applications, and discover how to package your skills into a profitable business - no
              degree or previous experience required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link href="/auth/sign-up">
                <Button size="lg" className="px-8 py-3 text-base font-semibold">
                  Start Reading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-base font-semibold bg-transparent">
                <Download className="mr-2 h-5 w-5" />
                Preview Sample
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10,000+ developers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Everything you need to build your business empire
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              The complete system to transform from developer to successful business owner in 90 days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Vibe Coding Mastery</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Master AI-enhanced development using ChatGPT, Claude, and modern tools to build applications 3x faster
                  than traditional methods. Learn to work WITH AI, not against it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Real Income-Generating Projects</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Build actual businesses like Alora (hotel booking platform) and HeroX (streaming platform) that
                  generate passive income. No toy projects - only applications that pay you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Business Owner Mindset</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Transform from job-seeker to opportunity-creator. Learn to package your skills as services, create
                  digital products, and build systems that work without you - just like Efezino did at 19.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Real results from students who transformed their lives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "From unemployed to earning ₦500,000/month in 4 months. The mindset shift alone was worth the entire
                  course price. Efezino doesn't just teach code - he teaches how to think like a business owner."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    AO
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Adaora Okafor</p>
                    <p className="text-sm text-muted-foreground">Freelance Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "I used to think you needed years of experience to compete. Wrong! The AI-enhanced development
                  techniques helped me deliver professional results from day one. My hotel booking app is now generating
                  steady income."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    DM
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">David Martinez</p>
                    <p className="text-sm text-muted-foreground">App Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "This course is pure gold for anyone tired of the traditional 'learn to code, get a job' path. I now
                  have multiple income streams and work on my own terms. Life-changing!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    SC
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sandra Chen</p>
                    <p className="text-sm text-muted-foreground">Digital Entrepreneur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Choose Your Path to Success
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Get lifetime access to all content and future updates
            </p>
          </div>
          <PricingCarousel />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">CodeCraft</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 CodeCraft. All rights reserved. Transform your coding journey today.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
