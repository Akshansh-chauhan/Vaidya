"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, Activity } from "lucide-react"
import HealthChatbot from "@/components/health-chatbot"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function MentalScanPage() {
  const [lang] = useLanguage()
  const t = getSubPageTranslations(lang)
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isNearTop = currentScrollY < 30

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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-zinc-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav
          className={`nav-glass mx-4 mt-4 rounded-full px-3 py-2 flex items-center gap-3 max-w-5xl lg:mx-auto transition-all duration-300 ${
            isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}
        >
          <Button variant="ghost" size="sm" asChild className="text-zinc-600 hover:text-zinc-900 hover:bg-white/50">
            <Link href="/scan">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {t.common.backScan}
            </Link>
          </Button>
          <div className="w-px h-5 bg-zinc-200/60" />
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Vaidya</span>
          </Link>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="text-center mb-6 anim-fade-up">
          <div className="inline-flex items-center gap-2 glass-card !rounded-full px-4 py-2 !shadow-sm text-sm font-medium text-amber-600 mb-4">
            <Brain className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{t.scanPages.mental.title}</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">{t.scanPages.mental.desc}</p>
        </div>
        <HealthChatbot scanType="mental" title={t.scanPages.mental.title} description={t.scanPages.mental.chatDesc} acceptedFiles="image/*" />
      </div>
    </div>
  )
}
