"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import {
  Activity,
  Eye,
  Scan,
  Brain,
  ArrowLeft,
  Search,
  Calendar,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

interface HealthReport {
  id: string
  category: "posture" | "skin" | "eye" | "mental"
  condition: string
  confidence: string
  severity: "low" | "medium" | "high"
  date: string
  summary: string
  recommendations: string[]
  description: string
  userMessage?: string
}

const categoryIcons = {
  posture: Activity,
  skin: Scan,
  eye: Eye,
  mental: Brain,
}

const categoryLabelsDefault: Record<string, string> = {
  posture: "Spine & Posture",
  skin: "Dermatology",
  eye: "Eye Health",
  mental: "Mental Health",
}

const severityLabelsDefault: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export default function ReportsPage() {
  const [lang] = useLanguage()
  const t = getSubPageTranslations(lang)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<HealthReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch real reports from Supabase via API
  useEffect(() => {
    async function fetchReports() {
      if (!user) return
      try {
        const token = (await getSupabaseClient().auth.getSession()).data.session?.access_token
        const res = await fetch("/api/reports", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setReports(data.reports || [])
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      } finally {
        setLoading(false)
      }
    }
    if (!authLoading && user) {
      fetchReports()
    }
  }, [user, authLoading])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || report.category === filterCategory
    const matchesSeverity = filterSeverity === "all" || report.severity === filterSeverity

    return matchesSearch && matchesCategory && matchesSeverity
  })

  const handleDownloadReport = (report: HealthReport) => {
    const element = document.createElement("a")
    const file = new Blob(
      [
        `Vaidya Health Report - ${categoryLabelsDefault[report.category]}\n\n` +
        `Date: ${new Date(report.date).toLocaleDateString()}\n` +
        `Condition: ${report.condition}\n` +
        `Confidence: ${report.confidence}\n` +
        `Severity: ${report.severity.toUpperCase()}\n\n` +
        `Description:\n${report.description}\n\n` +
        `Recommendations:\n${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}`,
      ],
      { type: "text/plain" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `vaidya-report-${report.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertCircle
      case "medium":
        return Clock
      case "low":
        return CheckCircle
      default:
        return CheckCircle
    }
  }

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
                  {t.common.backHome}
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Vaidya</span>
              </div>
            </div>
            <Button asChild>
              <Link href="/scan">{t.common.newScan}</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.reports.heading}</h1>
          <p className="text-muted-foreground text-lg">{t.reports.subtitle}</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your health reports...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t.reports.totalScans}</p>
                      <p className="text-2xl font-bold">{reports.length}</p>
                    </div>
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t.reports.highPriority}</p>
                      <p className="text-2xl font-bold text-destructive">
                        {reports.filter((r) => r.severity === "high").length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t.reports.mediumPriority}</p>
                      <p className="text-2xl font-bold text-primary">
                        {reports.filter((r) => r.severity === "medium").length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t.reports.lowPriority}</p>
                      <p className="text-2xl font-bold text-accent">
                        {reports.filter((r) => r.severity === "low").length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder={t.reports.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.reports.allCategories}</SelectItem>
                      <SelectItem value="posture">{t.reports.posture}</SelectItem>
                      <SelectItem value="skin">{t.reports.dermatology}</SelectItem>
                      <SelectItem value="eye">{t.reports.eyeHealth}</SelectItem>
                      <SelectItem value="mental">{t.reports.mentalHealth}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.reports.allSeverities}</SelectItem>
                      <SelectItem value="high">{t.reports.highPriority}</SelectItem>
                      <SelectItem value="medium">{t.reports.mediumPriority}</SelectItem>
                      <SelectItem value="low">{t.reports.lowPriority}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const Icon = categoryIcons[report.category]
                const SeverityIcon = getSeverityIcon(report.severity)

                return (
                  <Card key={report.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {categoryLabelsDefault[report.category]}
                          </span>
                        </div>
                        <Badge variant={getSeverityColor(report.severity) as any} className="text-xs">
                          <SeverityIcon className="w-3 h-3 mr-1" />
                          {severityLabelsDefault[report.severity]}
                        </Badge>
                      </div>

                      <CardTitle className="text-lg line-clamp-2">{report.condition}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(report.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{report.confidence}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <CardDescription className="line-clamp-3 mb-4">{report.summary}</CardDescription>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => setSelectedReport(report)}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {t.reports.viewDetails}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Icon className="w-5 h-5 text-primary" />
                                <span>{report.condition}</span>
                              </DialogTitle>
                              <DialogDescription>
                                {categoryLabelsDefault[report.category]} • {new Date(report.date).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Badge variant={getSeverityColor(report.severity) as any}>
                                  <SeverityIcon className="w-3 h-3 mr-1" />
                                  {severityLabelsDefault[report.severity]} {t.reports.priority}
                                </Badge>
                                <span className="text-sm font-medium">{t.reports.confidence}: {report.confidence}</span>
                              </div>

                              {report.userMessage && (
                                <div>
                                  <h4 className="font-semibold mb-2">Your Message</h4>
                                  <p className="text-muted-foreground bg-secondary/30 p-3 rounded-lg">{report.userMessage}</p>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2">{t.reports.analysisSummary}</h4>
                                <p className="text-muted-foreground">{report.description}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">{t.reports.recommendations}</h4>
                                <ul className="space-y-1">
                                  {report.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm">
                                      <CheckCircle className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <Button onClick={() => handleDownloadReport(report)} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                {t.reports.download}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)}>
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t.reports.noReports}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterCategory !== "all" || filterSeverity !== "all"
                    ? t.reports.noReportsFilter
                    : t.reports.noReportsHint}
                </p>
                <Button asChild>
                  <Link href="/scan">{t.common.startFirst}</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
