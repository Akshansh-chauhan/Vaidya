"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"

export default function ScanPage() {
  const [lang] = useLanguage()
  const t = getSubPageTranslations(lang)

  const categories = [
    { id: "posture", title: t.scan.posture, description: t.scan.postureDesc, icon: Activity, route: "/scan/posture" },
    { id: "skin", title: t.scan.skin, description: t.scan.skinDesc, icon: Scan, route: "/scan/skin" },
    { id: "eye", title: t.scan.eye, description: t.scan.eyeDesc, icon: Eye, route: "/scan/eye" },
    { id: "mental", title: t.scan.mental, description: t.scan.mentalDesc, icon: Brain, route: "/scan/mental" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.common.backHome}
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">AI Vaidya</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t.scan.heading}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.scan.subtitle}</p>
          <Badge variant="secondary" className="mt-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            {t.scan.badge}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <CardDescription className="text-balance mb-4">{category.description}</CardDescription>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span>{t.scan.aiChat}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Brain className="w-4 h-4" />
                        <span>{t.scan.voiceText}</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={category.route}>
                        {t.scan.startChat}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold mb-4">{t.scan.quickAccess}</h3>
            <p className="text-muted-foreground mb-6">{t.scan.quickAccessDesc}</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/reports">{t.scan.viewReports}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/plans">{t.scan.getPlans}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
