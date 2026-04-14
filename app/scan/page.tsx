"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ScanPage() {
  const [lang] = useLanguage()
  const t = getSubPageTranslations(lang)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-zinc-200 animate-pulse" />
      </div>
    )
  }

  const categories = [
    { id: "posture", title: t.scan.posture, description: t.scan.postureDesc, icon: Activity, route: "/scan/posture", gradientFrom: "from-blue-50/80", gradientTo: "to-violet-50/60", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { id: "skin", title: t.scan.skin, description: t.scan.skinDesc, icon: Scan, route: "/scan/skin", gradientFrom: "from-rose-50/80", gradientTo: "to-pink-50/60", iconBg: "bg-rose-100", iconColor: "text-rose-500" },
    { id: "eye", title: t.scan.eye, description: t.scan.eyeDesc, icon: Eye, route: "/scan/eye", gradientFrom: "from-teal-50/80", gradientTo: "to-cyan-50/60", iconBg: "bg-teal-100", iconColor: "text-teal-600" },
    { id: "mental", title: t.scan.mental, description: t.scan.mentalDesc, icon: Brain, route: "/scan/mental", gradientFrom: "from-amber-50/80", gradientTo: "to-orange-50/60", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  ]

  return (
    <div className="min-h-screen bg-mesh-purple relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[400px] h-[400px] bg-violet-300 top-[-5%] right-[10%]" style={{ animation: 'pulse-soft 8s ease-in-out infinite' }} />
      <div className="orb w-[300px] h-[300px] bg-blue-300 bottom-[10%] left-[5%]" style={{ animation: 'pulse-soft 10s ease-in-out infinite 3s' }} />

      {/* Nav */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 anim-fade-up">
        <nav className="nav-glass rounded-full px-3 py-2 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-zinc-600 hover:text-zinc-900 hover:bg-white/40">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {t.common.backHome}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 anim-fade-up">
          <div className="inline-flex items-center gap-2 glass-card !rounded-full px-4 py-2 !shadow-sm text-sm font-medium text-zinc-700 mb-6">
            <MessageCircle className="w-4 h-4 text-violet-500" />
            {t.scan.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-zinc-900 tracking-[-0.03em] leading-tight mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            {t.scan.heading}
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            {t.scan.subtitle}
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((category, i) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                className="glass-card p-7 sm:p-8 group anim-fade-up relative overflow-hidden"
                style={{ animationDelay: `${(i + 1) * 0.08}s` }}
              >
                {/* Pastel gradient wash */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} rounded-[24px] transition-opacity group-hover:opacity-100 opacity-70`} />

                <div className="relative z-10">
                  <div className="flex items-start gap-5 mb-6">
                    <div className={`w-12 h-12 ${category.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 mb-1.5 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{category.title}</h3>
                      <p className="text-zinc-500 text-[15px] leading-relaxed">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/40">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-zinc-400 font-medium">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {t.scan.aiChat}
                      </span>
                      <span className="flex items-center gap-1.5 text-[13px] text-zinc-400 font-medium">
                        <Brain className="w-3.5 h-3.5" />
                        {t.scan.voiceText}
                      </span>
                    </div>
                    <Button size="sm" asChild className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                      <Link href={category.route}>
                        {t.scan.startChat}
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Access */}
        <div className="text-center mt-20 anim-fade-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-semibold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{t.scan.quickAccess}</h3>
          <p className="text-zinc-500 mb-6">{t.scan.quickAccessDesc}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild className="bg-white/60 backdrop-blur-sm border-white/60 hover:bg-white/80">
              <Link href="/reports">{t.scan.viewReports}</Link>
            </Button>
            <Button variant="outline" asChild className="bg-white/60 backdrop-blur-sm border-white/60 hover:bg-white/80">
              <Link href="/plans">{t.scan.getPlans}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
