import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scan } from "lucide-react"
import HealthChatbot from "@/components/health-chatbot"

export default function SkinScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/scan">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Scan
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scan className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Nidan AI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dermatology Scan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced AI-powered skin analysis for early detection and personalized skincare recommendations. Upload
            clear images of skin areas for comprehensive assessment.
          </p>
        </div>

        <HealthChatbot
          scanType="skin"
          title="Dermatology Scan"
          description="Upload high-quality images of skin areas for AI-powered dermatological analysis and recommendations"
          acceptedFiles="image/*"
        />
      </div>
    </div>
  )
}
