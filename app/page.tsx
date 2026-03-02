"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, Shield, Zap, Target, ArrowRight, CheckCircle, Globe, ChevronDown, Check } from "lucide-react"
import { translations, LANGUAGE_NAMES, type Language } from "@/lib/translations"
import { useLanguage } from "@/lib/use-language"

function LanguagePicker({ lang, onSwitch }: { lang: Language; onSwitch: (l: Language) => void }) {
  const [open, setOpen] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleScroll = () => {
    if (!listRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    setShowScrollHint(scrollTop + clientHeight < scrollHeight - 8)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 bg-transparent hover:bg-secondary/50 transition-colors text-sm font-medium cursor-pointer"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline">{LANGUAGE_NAMES[lang]}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-[100] overflow-hidden">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="lang-scroll py-1 max-h-56 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`.lang-scroll::-webkit-scrollbar { display: none; }`}</style>
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
              <button
                key={code}
                onClick={() => { onSwitch(code); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-secondary/60 transition-colors ${lang === code ? "bg-secondary/40 font-medium" : ""
                  }`}
              >
                {LANGUAGE_NAMES[code]}
                {lang === code && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
          </div>
          {/* Scroll hint */}
          {showScrollHint && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1 pt-4 bg-gradient-to-t from-card via-card/90 to-transparent pointer-events-none">
              <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [lang, switchLanguage] = useLanguage()
  const t = translations[lang]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AI Vaidya</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.healthScan}
              </Link>
              <Link href="/reports" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.reports}
              </Link>
              <Link href="/plans" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.plans}
              </Link>
              <LanguagePicker lang={lang} onSwitch={switchLanguage} />
            </div>
            {/* Mobile language switcher */}
            <div className="md:hidden">
              <LanguagePicker lang={lang} onSwitch={switchLanguage} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              {t.hero.title} <span className="text-primary">{t.hero.highlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
              {t.hero.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/scan">
                {t.cta.startScan}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/reports">{t.cta.viewReports}</Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>{t.benefits.b1}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>{t.benefits.b2}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>{t.benefits.b3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">{t.features.heading}</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t.features.posture}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">{t.features.postureDesc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Scan className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{t.features.skin}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">{t.features.skinDesc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t.features.eye}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">{t.features.eyeDesc}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{t.features.mental}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">{t.features.mentalDesc}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">{t.tech.heading}</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              {t.tech.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.tech.secure}</h3>
              <p className="text-muted-foreground text-balance">{t.tech.secureDesc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.tech.instant}</h3>
              <p className="text-muted-foreground text-balance">{t.tech.instantDesc}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.tech.precise}</h3>
              <p className="text-muted-foreground text-balance">{t.tech.preciseDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">{t.ctaSection.heading}</h2>
          <p className="text-xl text-muted-foreground text-balance mb-8">
            {t.ctaSection.subtitle}
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/scan">
              {t.ctaSection.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AI Vaidya</span>
          </div>
          <p className="text-muted-foreground mb-2">{t.footer.tagline}</p>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AI Vaidya. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  )
}
