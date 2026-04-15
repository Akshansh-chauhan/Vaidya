"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, Shield, Zap, Target, ArrowRight, CheckCircle, Globe, ChevronDown, Check, Heart, TrendingUp, BarChart3 } from "lucide-react"
import { translations, LANGUAGE_NAMES, type Language } from "@/lib/translations"
import { useLanguage } from "@/lib/use-language"
import { useAuth } from "@/components/auth-provider"

function LanguagePicker({
  lang,
  onSwitch,
  darkText = false,
}: {
  lang: Language
  onSwitch: (l: Language) => void
  darkText?: boolean
}) {
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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-sm font-medium cursor-pointer ${
          darkText
            ? "text-zinc-700 hover:text-zinc-900 hover:bg-black/5"
            : "text-white/80 hover:text-white hover:bg-white/30"
        }`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{LANGUAGE_NAMES[lang]}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_32px_rgba(0,0,0,0.14)] border border-white/90 z-[100] overflow-hidden p-1.5">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-56 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
              <button
                key={code}
                onClick={() => { onSwitch(code); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between rounded-xl transition-colors cursor-pointer ${lang === code ? "bg-zinc-900 text-white font-medium" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
              >
                {LANGUAGE_NAMES[code]}
                {lang === code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
          {showScrollHint && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1 pt-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none">
              <ChevronDown className="w-4 h-4 text-zinc-400 animate-bounce" />
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
  const { user, signOut } = useAuth()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [useDarkLogoText, setUseDarkLogoText] = useState(false)

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isNearTop = currentScrollY < 40
      const passedHero = currentScrollY > window.innerHeight * 0.72

      setUseDarkLogoText(passedHero)

      if (isNearTop) {
        setIsNavVisible(true)
      } else if (currentScrollY > lastScrollY + 8) {
        setIsNavVisible(false)
      } else if (currentScrollY < lastScrollY - 8) {
        setIsNavVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ═══════════════════════════════════════════
          HERO — Full bleed background image like Bevel
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

        {/* ——— Mobile Top Nav (non-floating) ——— */}
        <div className="md:hidden absolute top-5 left-0 right-0 z-30 px-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/25">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-[17px] font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                Vaidya
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguagePicker lang={lang} onSwitch={switchLanguage} />
              {user ? (
                <Button onClick={() => signOut()} size="sm" className="h-9 px-4">
                  Sign Out
                </Button>
              ) : (
                <Button size="sm" asChild className="h-9 px-4">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ——— Desktop Floating Navigation ——— */}
        <div className="hidden md:block fixed top-5 left-0 right-0 z-50 px-4 pointer-events-none">
          <div className="relative mx-auto max-w-6xl">
            <Link
              href="/"
              className={`pointer-events-auto absolute left-0 top-0 hidden md:flex items-center gap-2 px-4 py-3 rounded-full bg-white/8 backdrop-blur-md border border-white/18 shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-300 ${isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
                }`}
            >
              <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span
                className={`text-[17px] font-bold tracking-tight transition-colors duration-300 ${useDarkLogoText ? "text-zinc-900" : "text-white"
                  }`}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Vaidya
              </span>
            </Link>

            <div className="flex justify-center">
              <nav
                className={`pointer-events-auto nav-glass rounded-full px-3 py-2 flex items-center gap-1 sm:gap-2 w-auto max-w-2xl transition-all duration-300 ${isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
                  }`}
              >
                <div className="hidden md:flex items-center">
                  <Link href="/scan" className="text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/20 text-[14px] font-medium">
                    {t.nav.healthScan}
                  </Link>
                  <Link href="/reports" className="text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/20 text-[14px] font-medium">
                    {t.nav.reports}
                  </Link>
                  <Link href="/plans" className="text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/20 text-[14px] font-medium">
                    {t.nav.plans}
                  </Link>
                </div>

                <div className="flex items-center gap-1 md:pl-1">
                  <LanguagePicker lang={lang} onSwitch={switchLanguage} />
                  {user ? (
                    <Button onClick={() => signOut()} size="sm" className="ml-1">
                      Sign Out
                    </Button>
                  ) : (
                    <Button size="sm" asChild className="ml-1">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* ——— Hero Content (over image) ——— */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] pt-20 sm:pt-24 lg:pt-[4.5rem] px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="anim-fade-up text-4xl sm:text-6xl lg:text-[80px] font-semibold tracking-[-0.04em] text-white leading-[1.05] mb-4 sm:mb-6 max-w-[340px] sm:max-w-none mx-auto drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]" style={{ fontFamily: 'var(--font-outfit)' }}>
              {t.hero.title}{" "}
              <span className="text-white/80">{t.hero.highlight}</span>
            </h1>

            <p className="anim-fade-up anim-delay-1 text-base sm:text-xl text-white/75 text-balance max-w-[360px] sm:max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="anim-fade-up anim-delay-2 flex flex-col sm:flex-row gap-3 justify-center mb-8 sm:mb-16 px-2 sm:px-0">
              <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-white/90 text-base px-8 h-13 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <Link href="/scan">
                  {t.cta.startScan}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base px-8 h-13 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white">
                <Link href="/reports">{t.cta.viewReports}</Link>
              </Button>
            </div>

            {/* ——— Floating Glass Health Cards ——— */}
            <div className="anim-fade-up anim-delay-3 relative max-w-3xl mx-auto w-full h-[160px] sm:h-[300px] mt-2 sm:mt-0 block">
              {/* Center — Recovery Score */}
              <div className="glass-card-dark absolute left-1/2 -translate-x-1/2 top-0 w-[180px] sm:w-[260px] p-4 sm:p-6 z-30 anim-float">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[13px] font-semibold text-white/60">Recovery Score</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl sm:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>87</span>
                  <span className="text-emerald-400 font-bold text-lg mb-1">%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" style={{ width: '87%' }} />
                </div>
                <p className="text-[12px] text-emerald-400 font-semibold mt-2">Feeling great today</p>
              </div>

              {/* Left — HRV */}
              <div className="glass-card-dark absolute left-0 sm:left-4 top-8 sm:top-12 w-[132px] sm:w-[200px] p-3 sm:p-5 z-20 anim-float-reverse opacity-90">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-violet-400" />
                  </div>
                  <span className="text-[12px] font-semibold text-white/60">HRV</span>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>65.1 <span className="text-xs sm:text-sm font-medium text-white/40">ms</span></p>
                <svg viewBox="0 0 100 30" className="w-full h-6 mt-2">
                  <polyline fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" points="0,20 15,18 25,22 35,12 50,15 60,8 75,14 85,6 100,10" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Right — Resting HR */}
              <div className="glass-card-dark absolute right-0 sm:right-4 top-10 sm:top-16 w-[132px] sm:w-[200px] p-3 sm:p-5 z-20 anim-float opacity-85">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-rose-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-3 h-3 text-rose-400" />
                  </div>
                  <span className="text-[12px] font-semibold text-white/60">Resting HR</span>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>52 <span className="text-xs sm:text-sm font-medium text-white/40">bpm</span></p>
                <div className="flex gap-1 mt-2">
                  {[40, 55, 35, 65, 50, 70, 45, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-full bg-gradient-to-t from-rose-500/60 to-rose-400/40" style={{ height: `${h * 0.4}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="anim-fade-up anim-delay-4 flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:-mt-12 relative z-20">
            {[t.benefits.b1, t.benefits.b2, t.benefits.b3].map((b, i) => (
              <div key={i} className="glass-card-dark flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 !rounded-full text-[12px] sm:text-[14px] text-white/80 font-medium !shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE BENTO GRID
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-mesh-purple relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 anim-fade-up">
            <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-900 tracking-[-0.03em] mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
              {t.features.heading}
            </h2>
            <p className="text-lg text-zinc-500 text-balance max-w-xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large — Posture with 3D mockup */}
            <div className="lg:col-span-2 anim-fade-up anim-delay-1">
              <div className="glass-card p-8 sm:p-10 relative overflow-hidden min-h-[340px] md:min-h-[340px] flex flex-col justify-start md:justify-end group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-violet-50/60 rounded-[24px]" />
                <div className="perspective-card absolute right-3 md:right-8 top-6 md:top-8 w-[48%] max-w-[156px] md:max-w-[240px]">
                  <div className="tilted glass-card p-4 md:p-5 !shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-[10px] md:text-[12px] font-bold text-zinc-500 uppercase tracking-wider">Posture</span>
                    </div>
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 relative">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#ring-grad)" strokeWidth="3" strokeDasharray="92, 100" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm md:text-lg font-bold text-zinc-900">92%</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full w-full" />
                      <div className="h-2 bg-zinc-100 rounded-full w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="relative z-10 max-w-none md:max-w-sm">
                  <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center mt-1 mb-5 md:mt-0 md:mb-5">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-900 mb-2 mt-24 sm:mt-[100px] md:mt-0 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{t.features.posture}</h3>
                  <p className="text-zinc-500 leading-relaxed text-[15px] mt-4 md:mt-8">{t.features.postureDesc}</p>
                </div>
              </div>
            </div>

            {/* Skin */}
            <div className="anim-fade-up anim-delay-2">
              <div className="glass-card p-8 min-h-[260px] flex flex-col group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/70 via-transparent to-pink-50/50 rounded-[24px]" />
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-rose-100 rounded-2xl flex items-center justify-center mb-auto">
                    <Scan className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="mt-16">
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{t.features.skin}</h3>
                    <p className="text-zinc-500 text-[15px] leading-relaxed">{t.features.skinDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eye */}
            <div className="anim-fade-up anim-delay-3">
              <div className="glass-card p-8 min-h-[260px] flex flex-col group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/70 via-transparent to-cyan-50/50 rounded-[24px]" />
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-teal-100 rounded-2xl flex items-center justify-center mb-auto">
                    <Eye className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="mt-16">
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{t.features.eye}</h3>
                    <p className="text-zinc-500 text-[15px] leading-relaxed">{t.features.eyeDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Large — Mental */}
            <div className="lg:col-span-2 anim-fade-up anim-delay-4">
              <div className="glass-card p-8 sm:p-10 relative overflow-hidden min-h-[280px] flex flex-col group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-violet-50/30 rounded-[24px]" />
                <div className="absolute right-6 sm:right-10 top-6 flex gap-3">
                  <div className="glass-card !rounded-xl p-3 !shadow-sm anim-float">
                    <div className="text-[11px] font-bold text-zinc-400 mb-0.5">Stress</div>
                    <div className="text-lg font-bold text-amber-600" style={{ fontFamily: 'var(--font-outfit)' }}>Low</div>
                  </div>
                  <div className="glass-card !rounded-xl p-3 !shadow-sm anim-float-reverse">
                    <div className="text-[11px] font-bold text-zinc-400 mb-0.5">Mood</div>
                    <div className="text-lg font-bold text-emerald-600" style={{ fontFamily: 'var(--font-outfit)' }}>Good</div>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
                    <Brain className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-2xl font-semibold text-zinc-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{t.features.mental}</h3>
                    <p className="text-zinc-500 leading-relaxed">{t.features.mentalDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TECHNOLOGY / TRUST
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-[-0.03em] mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>{t.tech.heading}</h2>
            <p className="text-lg text-zinc-500 text-balance max-w-xl mx-auto">{t.tech.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: t.tech.secure, desc: t.tech.secureDesc, bg: "bg-blue-50", color: "text-blue-600" },
              { icon: Zap, title: t.tech.instant, desc: t.tech.instantDesc, bg: "bg-amber-50", color: "text-amber-600" },
              { icon: Target, title: t.tech.precise, desc: t.tech.preciseDesc, bg: "bg-emerald-50", color: "text-emerald-600" },
            ].map((item, i) => (
              <div key={i} className="card-elevated p-7 text-center group">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{item.title}</h3>
                <p className="text-zinc-500 text-[15px] leading-relaxed text-balance">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[32px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-blue-600/15 rounded-full blur-[80px]" />
            <div className="relative z-10 p-10 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] mb-4 text-white" style={{ fontFamily: 'var(--font-outfit)' }}>{t.ctaSection.heading}</h2>
              <p className="text-lg text-zinc-400 text-balance mb-8 max-w-xl mx-auto">{t.ctaSection.subtitle}</p>
              <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 text-base px-8 h-13 shadow-[0_8px_30px_rgba(255,255,255,0.15)]">
                <Link href="/scan">
                  {t.ctaSection.button}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Vaidya</span>
          </div>
          <p className="text-zinc-500 mb-2 text-sm">{t.footer.tagline}</p>
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} Vaidya. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  )
}
