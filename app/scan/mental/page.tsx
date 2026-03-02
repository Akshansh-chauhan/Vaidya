"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain } from "lucide-react"
import HealthChatbot from "@/components/health-chatbot"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"

export default function MentalHealthPage() {
  const [lang] = useLanguage()
  const t = getSubPageTranslations(lang)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/scan">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.common.backScan}
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Vaidya</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t.scanPages.mental.title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.scanPages.mental.desc}</p>
        </div>
        <HealthChatbot scanType="mental" title={t.scanPages.mental.title} description={t.scanPages.mental.chatDesc} acceptedFiles="audio/*" />
      </div>
    </div>
  )
}
