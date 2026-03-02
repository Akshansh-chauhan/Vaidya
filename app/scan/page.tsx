"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"

type ScanCategory = "posture" | "skin" | "eye" | "mental"

const categories = [
  {
    id: "posture" as ScanCategory,
    title: "Spine & Posture Analysis",
    description: "AI-powered posture assessment with personalized recommendations",
    icon: Activity,
    inputType: "image/video",
    acceptedFiles: "image/*,video/*",
    route: "/scan/posture",
  },
  {
    id: "skin" as ScanCategory,
    title: "Dermatology Scan",
    description: "Advanced skin analysis for early detection and skincare guidance",
    icon: Scan,
    inputType: "image",
    acceptedFiles: "image/*",
    route: "/scan/skin",
  },
  {
    id: "eye" as ScanCategory,
    title: "Ophthalmology Check",
    description: "Comprehensive eye health assessment and vision screening",
    icon: Eye,
    inputType: "image/text",
    acceptedFiles: "image/*",
    route: "/scan/eye",
  },
  {
    id: "mental" as ScanCategory,
    title: "Mental Health Screening",
    description: "Confidential mental wellness evaluation with AI insights",
    icon: Brain,
    inputType: "audio/text",
    acceptedFiles: "audio/*",
    route: "/scan/mental",
  },
]

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Nidan AI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Health Assistant - 2025</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your health analysis category to start an interactive conversation with our specialized AI
            assistants. Each assistant provides personalized insights, real-time analysis, and evidence-based
            recommendations.
          </p>
          <Badge variant="secondary" className="mt-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Interactive Chat Experience
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 group"
                >
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
                        <span>Interactive AI Chat</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Brain className="w-4 h-4" />
                        <span>Voice & Text Support</span>
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={category.route}>
                        Start Chat Session
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold mb-4">Quick Access</h3>
            <p className="text-muted-foreground mb-6">Access your previous conversations and health reports</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/reports">View All Reports</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/plans">Get Exercise Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
