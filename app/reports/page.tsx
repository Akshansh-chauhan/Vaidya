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

  const handleDownloadReport = async (report: HealthReport) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const ml = 22   // margin left
    const mr = 22   // margin right
    const cw = W - ml - mr // content width
    const reportDate = new Date(report.date)
    const reportId = `VHR-${reportDate.getFullYear()}${String(reportDate.getMonth()+1).padStart(2,"0")}${String(reportDate.getDate()).padStart(2,"0")}-${report.id.slice(-6).toUpperCase()}`

    // Load logo
    let logoBase64: string | null = null
    try {
      const res = await fetch("/vaidya-logo.png")
      const blob = await res.blob()
      logoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch { /* logo optional */ }

    // ── helpers ──────────────────────────────────────────────────────────────
    const addPageIfNeeded = (need: number, cur: number) => {
      if (cur + need > H - 28) { doc.addPage(); applyWatermark(); return 32 }
      return cur
    }

    const sectionHeader = (label: string, y: number): number => {
      doc.setFillColor(245, 245, 246)
      doc.rect(ml, y, cw, 8, "F")
      doc.setDrawColor(220, 220, 222)
      doc.rect(ml, y, cw, 8, "S")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.setTextColor(80, 80, 90)
      doc.text(label, ml + 4, y + 5.3)
      return y + 12
    }

    const divider = (y: number) => {
      doc.setDrawColor(230, 230, 232)
      doc.setLineWidth(0.3)
      doc.line(ml, y, ml + cw, y)
      return y + 6
    }

    const severityColors: Record<string, [number,number,number]> = {
      high:   [220, 38, 38],
      medium: [217, 119, 6],
      low:    [16, 185, 129],
    }
    const [sr, sg, sb] = severityColors[report.severity] ?? [100, 100, 100]

    const applyWatermark = () => {
      doc.saveGraphicsState()
      doc.setTextColor(240, 240, 242)
      doc.setFontSize(62)
      doc.setFont("helvetica", "bold")
      doc.text("VAIDYA", W / 2, H / 2 + 10, { angle: 45, align: "center" })
      doc.restoreGraphicsState()
    }

    // ── Page 1: watermark ────────────────────────────────────────────────────
    applyWatermark()

    // ── HEADER ───────────────────────────────────────────────────────────────
    // Dark bar
    doc.setFillColor(18, 18, 20)
    doc.rect(0, 0, W, 44, "F")

    // Logo
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", ml, 11, 16, 16)
    } else {
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(ml, 11, 16, 16, 2, 2, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(18, 18, 20)
      doc.text("V", ml + 5.5, 22)
    }

    // Brand name
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text("VAIDYA", ml + 20, 21)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(180, 180, 185)
    doc.text("AI Health Companion", ml + 20, 28)

    // Right side — report type + meta
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.setTextColor(255, 255, 255)
    doc.text("CLINICAL ANALYSIS REPORT", W - mr, 18, { align: "right" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(160, 160, 168)
    doc.text(`Report ID: ${reportId}`, W - mr, 25.5, { align: "right" })
    doc.text(
      `${reportDate.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}  ${reportDate.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}`,
      W - mr, 32, { align: "right" }
    )

    // Thin accent line under header
    doc.setDrawColor(sr, sg, sb)
    doc.setLineWidth(0.8)
    doc.line(0, 44, W, 44)
    doc.setLineWidth(0.3)

    // ── REPORT DETAILS GRID ──────────────────────────────────────────────────
    let y = 53
    y = sectionHeader("REPORT DETAILS", y)

    // 5-cell metadata grid
    const cells = [
      { label: "Category",   value: categoryLabelsDefault[report.category] || report.category },
      { label: "Condition",  value: report.condition },
      { label: "Confidence", value: report.confidence },
      { label: "Severity",   value: report.severity.toUpperCase() },
      { label: "Time",       value: reportDate.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit", second:"2-digit" }) },
    ]
    const cellW = cw / cells.length
    const gridH = 16
    doc.setDrawColor(220, 220, 222)
    doc.setFillColor(252, 252, 253)
    doc.rect(ml, y, cw, gridH, "FD")
    cells.forEach((cell, i) => {
      const cx = ml + i * cellW
      // vertical separator
      if (i > 0) {
        doc.setDrawColor(220, 220, 222)
        doc.line(cx, y, cx, y + gridH)
      }
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(140, 140, 150)
      doc.text(cell.label.toUpperCase(), cx + cellW / 2, y + 5, { align: "center" })

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      if (cell.label === "Severity") {
        doc.setTextColor(sr, sg, sb)
      } else {
        doc.setTextColor(28, 28, 32)
      }
      const truncated = cell.value.length > 22 ? cell.value.slice(0, 20) + "…" : cell.value
      doc.text(truncated, cx + cellW / 2, y + 12, { align: "center" })
      doc.setTextColor(28, 28, 32)
    })
    y += gridH + 6

    // Urgency reason pill (if available)
    const urgencyReason = (report as any).urgency_reason
    if (urgencyReason) {
      doc.setFillColor(sr + 30 > 255 ? 255 : sr + 230, sg + 230 > 255 ? 255 : sg + 230, sb + 230 > 255 ? 255 : sb + 230)
      doc.roundedRect(ml, y - 2, cw, 10, 2, 2, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(7)
      doc.setTextColor(sr, sg, sb)
      doc.text("!", ml + 4, y + 4.5)
      doc.setFont("helvetica", "italic")
      doc.setFontSize(8.5)
      doc.text(`  ${urgencyReason}`, ml + 7, y + 4.5)
      doc.setTextColor(28, 28, 32)
      y += 14
    }

    // ── CLINICAL SUMMARY ─────────────────────────────────────────────────────
    y = addPageIfNeeded(50, y)
    y = sectionHeader("CLINICAL ASSESSMENT SUMMARY", y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
    doc.setTextColor(55, 55, 65)
    const summaryText = doc.splitTextToSize(report.description || report.summary || "No summary available.", cw - 2)
    summaryText.forEach((line: string) => {
      y = addPageIfNeeded(7, y)
      doc.text(line, ml, y)
      y += 5.5
    })
    y += 4

    // ── KEY RECOMMENDATIONS ───────────────────────────────────────────────────
    y = addPageIfNeeded(20, y)
    y = divider(y)
    y = sectionHeader("KEY RECOMMENDATIONS", y)

    report.recommendations.forEach((rec, idx) => {
      const recLines = doc.splitTextToSize(rec, cw - 13)
      const blockH = recLines.length * 5.2
      y = addPageIfNeeded(blockH + 4, y)

      // Text baseline for first line
      const textY = y + 2.8
      // Circle center aligned to text cap-height midpoint
      const circleY = textY - 1.2

      doc.setFillColor(28, 28, 32)
      doc.circle(ml + 3, circleY, 2.4, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(6.5)
      doc.setTextColor(255, 255, 255)
      doc.text(String(idx + 1), ml + 3, circleY + 0.8, { align: "center" })

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9.5)
      doc.setTextColor(55, 55, 65)
      recLines.forEach((line: string, li: number) => {
        doc.text(line, ml + 9, textY + li * 5.2)
      })

      y += blockH + 4
    })
    y += 2

    // ── CONSULTATION TRANSCRIPT ───────────────────────────────────────────────
    const transcriptTurns: { isUser: boolean; text: string }[] = []
    if (report.chatHistory && report.chatHistory.length > 0) {
      report.chatHistory.forEach((msg: any) => {
        const isUser = msg.role === "user" || msg.sender === "user"
        const text = msg.content || msg.text || ""
        if (text.trim()) transcriptTurns.push({ isUser, text })
      })
    }
    if (report.userMessage?.trim()) transcriptTurns.push({ isUser: true, text: report.userMessage })
    if (report.description?.trim()) transcriptTurns.push({ isUser: false, text: report.description })

    if (transcriptTurns.length > 0) {
      y = addPageIfNeeded(20, y)
      y = divider(y)
      y = sectionHeader("CONSULTATION TRANSCRIPT", y)

      transcriptTurns.forEach((turn, idx) => {
        const speaker = turn.isUser ? "PATIENT" : "VAIDYA AI"
        const msgLines = doc.splitTextToSize(turn.text, cw - 26)
        const blockH = msgLines.length * 5.2 + 2
        y = addPageIfNeeded(blockH + 8, y)

        // Speaker label — inline with first text line
        doc.setFont("helvetica", "bold")
        doc.setFontSize(7)
        doc.setTextColor(turn.isUser ? 28 : 90, turn.isUser ? 28 : 90, turn.isUser ? 32 : 190)
        doc.text(speaker, ml, y)

        // Message text — indented
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(55, 55, 65)
        msgLines.forEach((line: string, li: number) => {
          doc.text(line, ml + 26, y + li * 5.2)
        })

        y += blockH + 3

        // Thin rule between turns
        if (idx < transcriptTurns.length - 1) {
          doc.setDrawColor(232, 232, 236)
          doc.setLineWidth(0.2)
          doc.line(ml + 26, y - 1, ml + cw, y - 1)
          y += 3
        }
      })
    }

    // ── END OF REPORT marker ─────────────────────────────────────────────────
    y += 10
    doc.setDrawColor(220, 220, 222)
    doc.setLineWidth(0.3)
    doc.line(ml, y, ml + cw, y)
    y += 6
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(180, 180, 188)
    doc.text("-- End of Report --", W / 2, y, { align: "center" })

    // ── FOOTER (all pages) ────────────────────────────────────────────────────
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      // Footer bar
      doc.setFillColor(245, 245, 246)
      doc.rect(0, H - 18, W, 18, "F")
      doc.setDrawColor(220, 220, 222)
      doc.setLineWidth(0.3)
      doc.line(0, H - 18, W, H - 18)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(160, 160, 170)
      doc.text("This report is generated by Vaidya AI for informational purposes only and does not constitute medical advice.", ml, H - 12)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(7)
      doc.setTextColor(110, 110, 120)
      doc.text(`${reportId}`, ml, H - 6)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(160, 160, 170)
      doc.text(`Page ${i} / ${pageCount}`, W - mr, H - 6, { align: "right" })
    }

    doc.save(`Vaidya_Report_${categoryLabelsDefault[report.category]}_${reportDate.toISOString().split("T")[0]}.pdf`)
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
                              {(report as any).urgency_reason && (
                                <p className="text-[12px] text-zinc-400 bg-zinc-50 rounded-xl px-3 py-2 border border-zinc-100 italic">
                                  {(report as any).urgency_reason}
                                </p>
                              )}

                              {(() => {
                                // Build full conversation: chatHistory + userMessage + aiResponse
                                const turns: { role: "patient" | "ai"; text: string }[] = []

                                // Previous turns from chatHistory (skip bot-only welcome if it's the only entry)
                                if (report.chatHistory && report.chatHistory.length > 0) {
                                  report.chatHistory.forEach((msg: any) => {
                                    const isUser = msg.role === "user" || msg.sender === "user"
                                    const text = msg.content || msg.text || ""
                                    if (text.trim()) turns.push({ role: isUser ? "patient" : "ai", text })
                                  })
                                }

                                // Current user message
                                if (report.userMessage?.trim()) {
                                  turns.push({ role: "patient", text: report.userMessage })
                                }

                                // Latest AI response
                                if (report.description?.trim()) {
                                  turns.push({ role: "ai", text: report.description })
                                }

                                if (turns.length === 0) return null

                                return (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-zinc-900 flex items-center gap-2 text-sm">
                                      <Activity className="w-4 h-4 text-zinc-500" />
                                      Consultation Transcript
                                    </h4>
                                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100 max-h-[40vh] overflow-y-auto">
                                      {turns.map((turn, idx) => (
                                        <div key={idx} className={`flex gap-3 ${turn.role === "patient" ? "flex-row-reverse" : ""}`}>
                                          <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${turn.role === "patient" ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-600"}`}>
                                            {turn.role === "patient" ? "P" : "AI"}
                                          </div>
                                          <div className={`flex-1 max-w-[85%] ${turn.role === "patient" ? "text-right" : ""}`}>
                                            <p className={`text-[10px] font-semibold mb-1 ${turn.role === "patient" ? "text-zinc-500" : "text-zinc-400"}`}>
                                              {turn.role === "patient" ? "Patient" : "Vaidya AI"}
                                            </p>
                                            <div className={`inline-block px-3 py-2 rounded-xl text-[13px] leading-relaxed text-left ${turn.role === "patient" ? "bg-zinc-900 text-white rounded-tr-sm" : "bg-white border border-zinc-200 text-zinc-700 rounded-tl-sm"}`}>
                                              {turn.text}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })()}

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
