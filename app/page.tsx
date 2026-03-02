import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, Shield, Zap, Target, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
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
              <span className="text-xl font-bold text-foreground">Nidan AI</span>
              
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
                Health Scan
              </Link>
              <Link href="/reports" className="text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </Link>
              <Link href="/plans" className="text-muted-foreground hover:text-foreground transition-colors">
                Plans
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Your AI Health <span className="text-primary">Companion</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
              Advanced AI-powered health assistant providing comprehensive analysis for posture, skin conditions, eye
              health, and mental wellness. Get professional insights instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/scan">
                Start Health Scan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/reports">View Reports</Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Accessible Expertise</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Early Detection</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Actionable Guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Comprehensive Health Analysis</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Our AI-powered platform offers specialized analysis across multiple health domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Spine & Posture Analysis */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Spine & Posture Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">
                  Advanced posture assessment using computer vision to detect spinal alignment issues and provide
                  corrective recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Dermatology Scan */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Scan className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Dermatology Scan</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">
                  AI-powered skin analysis to identify potential skin conditions, moles, and lesions with
                  professional-grade accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Ophthalmology Check */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Ophthalmology Check</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">
                  Comprehensive eye health assessment including vision screening and detection of common eye conditions.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Mental Health Screening */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Mental Health Screening</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-balance">
                  Voice and behavioral analysis to assess mental wellness and provide personalized mental health
                  insights.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Built with cutting-edge technology for accurate and reliable health assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-balance">
                Your health data is encrypted and processed with the highest security standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground text-balance">
                Get comprehensive health analysis in seconds with our optimized AI models
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precise Analysis</h3>
              <p className="text-muted-foreground text-balance">
                Medical-grade accuracy powered by Gemini AI and advanced computer vision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-xl text-muted-foreground text-balance mb-8">
            Join thousands of users who trust Nidan AI for their health monitoring needs
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/scan">
              Begin Health Assessment
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
            <span className="text-lg font-semibold">Nidan AI</span>
          </div>
          <p className="text-muted-foreground mb-2">Built by Team Elite Coders for CodeVeda Hackathon</p>
          <p className="text-sm text-muted-foreground">Empowering healthcare through artificial intelligence</p>
        </div>
      </footer>
    </div>
  )
}
