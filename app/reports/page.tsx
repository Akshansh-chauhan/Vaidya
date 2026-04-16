"use client"

import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
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
  chatHistory?: { role: "user" | "model"; content: string }[]
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
  low: "Good",
  medium: "Moderate",
  high: "Attention",
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
  const [isNavVisible, setIsNavVisible] = useState(true)

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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
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
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20

    // Vaidya Watermark
    doc.setTextColor(245, 245, 245)
    doc.setFontSize(80)
    doc.text("VAIDYA AI", pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' })

    // Header strip
    doc.setFillColor(24, 24, 27) // zinc-900
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(28)
    doc.text("VAIDYA", margin, 26)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.text("AI Health Companion", margin, 33)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("CLINICAL ANALYSIS REPORT", pageWidth - margin, 26, { align: "right" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, pageWidth - margin, 33, { align: "right" })

    // Report Details Section
    let y = 50
    doc.setTextColor(31, 41, 55)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("REPORT DETAILS", margin, y)
    
    y += 6
    doc.setDrawColor(200, 200, 200)
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 2, 2, "FD")

    y += 9
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("Category:", margin + 5, y)
    doc.setFont("helvetica", "normal")
    doc.text(categoryLabelsDefault[report.category] || "General", margin + 30, y)

    doc.setFont("helvetica", "bold")
    doc.text("Confidence:", pageWidth / 2, y)
    doc.setFont("helvetica", "normal")
    doc.text(report.confidence, pageWidth / 2 + 25, y)

    y += 10
    doc.setFont("helvetica", "bold")
    doc.text("Condition:", margin + 5, y)
    doc.setFont("helvetica", "normal")
    doc.text(report.condition, margin + 30, y)

    doc.setFont("helvetica", "bold")
    doc.text("Severity:", pageWidth / 2, y)
    
    // Dynamic Severity color for PDF
    if (report.severity === "high") doc.setTextColor(220, 50, 50)
    else if (report.severity === "medium") doc.setTextColor(180, 100, 50)
    else doc.setTextColor(50, 150, 50)

    doc.setFont("helvetica", "bold")
    doc.text(report.severity.toUpperCase(), pageWidth / 2 + 25, y)
    doc.setTextColor(31, 41, 55) // Reset color

    y += 24
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("EXECUTIVE SUMMARY", margin, y)
    
    y += 8
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(report.description || report.summary || "", pageWidth - (margin * 2))
    doc.text(splitSummary, margin, y)
    y += (splitSummary.length * 5) + 6

    // Recommendations
    if (y > pageHeight - 60) { doc.addPage(); y = 30 }
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("KEY RECOMMENDATIONS", margin, y)
    
    y += 8
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    report.recommendations.forEach((rec, idx) => {
      if (y > pageHeight - 20) { doc.addPage(); y = 30 }
      const splitRec = doc.splitTextToSize(`•  ${rec}`, pageWidth - (margin * 2) - 5)
      doc.text(splitRec, margin + 5, y)
      y += (splitRec.length * 5) + 3
    })

    // Consultation History
    if (report.chatHistory && report.chatHistory.length > 0) {
      y += 10
      if (y > pageHeight - 60) { doc.addPage(); y = 30 }
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("CONSULTATION TRANSCRIPT", margin, y)
      y += 8

      report.chatHistory.forEach(msg => {
        if (y > pageHeight - 20) { doc.addPage(); y = 30 }
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        if (msg.role === "user") {
          doc.setTextColor(100, 100, 100)
          doc.text("PATIENT:", margin, y)
        } else {
          doc.setTextColor(24, 24, 27)
          doc.text("VAIDYA AI:", margin, y)
        }
        
        y += 5
        doc.setFont("helvetica", "normal")
        doc.setTextColor(50, 50, 50)
        const splitMsg = doc.splitTextToSize(msg.content || "", pageWidth - (margin * 2) - 5)
        doc.text(splitMsg, margin + 5, y)
        y += (splitMsg.length * 5) + 5
      })
    }

    // Footer Pagination
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFont("helvetica", "italic")
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)
      doc.text("Generated by Vaidya AI. This report is for informational purposes only and does not constitute medical advice.", pageWidth / 2, pageHeight - 10, { align: "center" })
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" })
    }

    doc.save(`Vaidya_Report_${categoryLabelsDefault[report.category]}_${new Date(report.date).toISOString().split('T')[0]}.pdf`)
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-50 text-red-700 border-red-100"
      case "medium": return "bg-amber-50 text-amber-700 border-amber-100"
      case "low": return "bg-emerald-50 text-emerald-700 border-emerald-100"
      default: return "bg-zinc-50 text-zinc-700 border-zinc-100"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return AlertCircle
      case "medium": return Clock
      case "low": return CheckCircle
      default: return CheckCircle
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-between items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto anim-fade-up pointer-events-none">
        
        {/* Left Side: Tight Pill mimicking Scan Page */}
        <nav
          className={`pointer-events-auto nav-glass rounded-full px-3 py-2 flex items-center gap-3 transition-all duration-300 ${
            isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}
        >
          <Button variant="ghost" size="sm" asChild className="text-zinc-600 hover:text-zinc-900 hover:bg-white/40">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {t.common.backHome}
            </Link>
          </Button>
          <div className="w-px h-5 bg-zinc-200/60" />
          <Link href="/" className="flex items-center gap-2 pr-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Vaidya</span>
          </Link>
        </nav>

        {/* Right Side: New Scan Button */}
        <div className={`pointer-events-auto pt-1.5 transition-all duration-300 ${
            isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}>
          <Button size="sm" asChild className="shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
            <Link href="/scan">{t.common.newScan}</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        {/* Header */}
        <div className="mb-10 anim-fade-up">
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{t.reports.heading}</h1>
          <p className="text-zinc-500 text-lg">{t.reports.subtitle}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 animate-pulse mb-4" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 anim-fade-up anim-delay-1">
              {[
                { label: t.reports.totalScans, value: reports.length, icon: Activity, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
                { label: t.reports.highPriority, value: reports.filter((r) => r.severity === "high").length, icon: AlertCircle, iconBg: "bg-red-50", iconColor: "text-red-500" },
                { label: t.reports.mediumPriority, value: reports.filter((r) => r.severity === "medium").length, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
                { label: t.reports.lowPriority, value: reports.filter((r) => r.severity === "low").length, icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
              ].map((stat, i) => (
                <div key={i} className="card-elevated p-5">
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                  <p className="text-sm text-zinc-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="card-elevated p-4 mb-10 anim-fade-up anim-delay-2">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder={t.reports.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-50 border-zinc-200 rounded-xl h-11 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-zinc-50 border-zinc-200 rounded-xl h-11 text-zinc-600">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-200">
                    <SelectItem value="all">{t.reports.allCategories}</SelectItem>
                    <SelectItem value="posture">{t.reports.posture}</SelectItem>
                    <SelectItem value="skin">{t.reports.dermatology}</SelectItem>
                    <SelectItem value="eye">{t.reports.eyeHealth}</SelectItem>
                    <SelectItem value="mental">{t.reports.mentalHealth}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-full md:w-48 bg-zinc-50 border-zinc-200 rounded-xl h-11 text-zinc-600">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-200">
                    <SelectItem value="all">{t.reports.allSeverities}</SelectItem>
                    <SelectItem value="high">{t.reports.highPriority}</SelectItem>
                    <SelectItem value="medium">{t.reports.mediumPriority}</SelectItem>
                    <SelectItem value="low">{t.reports.lowPriority}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((report, i) => {
                const Icon = categoryIcons[report.category]
                const SeverityIcon = getSeverityIcon(report.severity)

                return (
                  <div key={report.id} className="card-elevated p-6 flex flex-col anim-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-zinc-50 rounded-xl flex items-center justify-center">
                          <Icon className="w-4 h-4 text-zinc-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{report.condition}</h3>
                          <span className="text-[13px] text-zinc-400">{categoryLabelsDefault[report.category]}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${getSeverityStyle(report.severity)}`}>
                        <SeverityIcon className="w-3 h-3" />
                        {severityLabelsDefault[report.severity]}
                      </span>
                    </div>

                    <p className="text-[14px] text-zinc-500 line-clamp-2 mb-5 flex-1 leading-relaxed">{report.summary}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                      <span className="text-[13px] text-zinc-400 font-medium">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1.5">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {t.reports.viewDetails}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-zinc-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                                <Icon className="w-5 h-5 text-zinc-600" />
                                {report.condition}
                              </DialogTitle>
                              <DialogDescription className="text-zinc-500">
                                {categoryLabelsDefault[report.category]} • {new Date(report.date).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-5">
                              <div className="flex items-center justify-between">
                                <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${getSeverityStyle(report.severity)}`}>
                                  <SeverityIcon className="w-3 h-3" />
                                  {severityLabelsDefault[report.severity]} {t.reports.priority}
                                </span>
                                <span className="text-sm font-medium text-zinc-500">{t.reports.confidence}: {report.confidence}</span>
                              </div>

                              {report.chatHistory && report.chatHistory.length > 0 ? (
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-zinc-900 flex items-center gap-2 text-sm">
                                    <Activity className="w-4 h-4 text-zinc-500" />
                                    {t.reports.analysisSummary || "Conversation History"}
                                  </h4>
                                  <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-100 max-h-[40vh] overflow-y-auto">
                                    {report.chatHistory.map((msg, idx) => (
                                      <div key={idx} className={`p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-white ml-10 border border-zinc-100" : "bg-zinc-100 mr-10"}`}>
                                        <p className="text-[11px] font-semibold mb-1 text-zinc-400">{msg.role === "user" ? "You" : "Vaidya AI"}</p>
                                        <p className="text-zinc-700 whitespace-pre-wrap">{msg.content}</p>
                                      </div>
                                    ))}
                                    {report.description && (
                                      <div className="p-3 rounded-xl bg-zinc-100 mr-10">
                                        <p className="text-[11px] font-semibold mb-1 text-zinc-400">Vaidya AI</p>
                                        <p className="text-sm text-zinc-700 whitespace-pre-wrap">{report.description}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {report.userMessage && (
                                    <div>
                                      <h4 className="font-semibold mb-2 text-zinc-900 text-sm">Your Message</h4>
                                      <p className="text-zinc-600 bg-zinc-50 p-3 rounded-xl text-sm border border-zinc-100">{report.userMessage}</p>
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-semibold mb-2 text-zinc-900 text-sm">{t.reports.analysisSummary}</h4>
                                    <p className="text-zinc-600 whitespace-pre-wrap text-sm">{report.description}</p>
                                  </div>
                                </>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2 text-zinc-900 text-sm">{t.reports.recommendations}</h4>
                                <ul className="space-y-2">
                                  {report.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2.5 text-sm">
                                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-zinc-600">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <Button onClick={() => handleDownloadReport(report)} className="w-full h-12">
                                <Download className="w-4 h-4 mr-2" />
                                {t.reports.download}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)} className="text-zinc-400 hover:text-zinc-900 px-2">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-20 anim-fade-up">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Activity className="w-7 h-7 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{t.reports.noReports}</h3>
                <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
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
