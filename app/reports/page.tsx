"use client"

import { useState } from "react"
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
} from "lucide-react"

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
}

const mockReports: HealthReport[] = [
  {
    id: "1",
    category: "posture",
    condition: "Mild Forward Head Posture",
    confidence: "87%",
    severity: "medium",
    date: "2024-01-15",
    summary: "Slight forward head positioning detected with potential for neck strain",
    description: "Analysis shows slight forward head positioning which may lead to neck strain and upper back tension.",
    recommendations: [
      "Perform neck stretches 3 times daily",
      "Adjust workstation ergonomics",
      "Consider physical therapy consultation",
      "Practice chin tuck exercises",
    ],
  },
  {
    id: "2",
    category: "skin",
    condition: "Benign Mole - Monitor",
    confidence: "92%",
    severity: "low",
    date: "2024-01-12",
    summary: "Benign mole identified with regular monitoring recommended",
    description:
      "The analyzed area shows characteristics of a benign mole with regular borders and uniform coloration.",
    recommendations: [
      "Monitor for any changes in size or color",
      "Schedule annual dermatology checkup",
      "Use broad-spectrum sunscreen daily",
      "Perform monthly self-examinations",
    ],
  },
  {
    id: "3",
    category: "eye",
    condition: "Mild Dry Eye Symptoms",
    confidence: "78%",
    severity: "low",
    date: "2024-01-10",
    summary: "Early signs of dry eye condition with manageable symptoms",
    description: "Analysis suggests mild dry eye condition based on visual indicators and screening responses.",
    recommendations: [
      "Use preservative-free artificial tears",
      "Take regular breaks from screen time",
      "Increase omega-3 fatty acid intake",
      "Consider humidifier for dry environments",
    ],
  },
  {
    id: "4",
    category: "mental",
    condition: "Mild Stress Indicators",
    confidence: "74%",
    severity: "medium",
    date: "2024-01-08",
    summary: "Elevated stress levels detected with anxiety markers present",
    description: "Voice analysis indicates elevated stress levels with some anxiety markers present.",
    recommendations: [
      "Practice daily mindfulness meditation",
      "Maintain regular sleep schedule",
      "Consider stress management counseling",
      "Engage in regular physical exercise",
    ],
  },
  {
    id: "5",
    category: "posture",
    condition: "Normal Spinal Alignment",
    confidence: "94%",
    severity: "low",
    date: "2024-01-05",
    summary: "Excellent posture with proper spinal alignment maintained",
    description: "Analysis shows optimal spinal alignment with no significant postural deviations detected.",
    recommendations: [
      "Continue current exercise routine",
      "Maintain ergonomic workspace setup",
      "Regular posture checks throughout day",
      "Consider preventive strengthening exercises",
    ],
  },
  {
    id: "6",
    category: "skin",
    condition: "Minor Sun Damage",
    confidence: "81%",
    severity: "low",
    date: "2024-01-03",
    summary: "Light sun damage detected with preventive care recommended",
    description: "Minor signs of UV exposure with early photoaging indicators in the analyzed area.",
    recommendations: [
      "Apply SPF 30+ sunscreen daily",
      "Use antioxidant skincare products",
      "Consider vitamin C serum",
      "Schedule dermatology consultation",
    ],
  },
]

const categoryIcons = {
  posture: Activity,
  skin: Scan,
  eye: Eye,
  mental: Brain,
}

const categoryLabels = {
  posture: "Posture Analysis",
  skin: "Dermatology Scan",
  eye: "Eye Health Check",
  mental: "Mental Health Screening",
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null)

  const filteredReports = mockReports.filter((report) => {
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
        `Nidan AI Health Report - ${categoryLabels[report.category]}\n\n` +
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
    element.download = `nidan-ai-report-${report.id}.txt`
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
            <Button asChild>
              <Link href="/scan">New Scan</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Health Reports</h1>
          <p className="text-muted-foreground text-lg">View and manage your health scan history and analysis results</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold">{mockReports.length}</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-destructive">
                    {mockReports.filter((r) => r.severity === "high").length}
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
                  <p className="text-sm font-medium text-muted-foreground">Medium Priority</p>
                  <p className="text-2xl font-bold text-primary">
                    {mockReports.filter((r) => r.severity === "medium").length}
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
                  <p className="text-sm font-medium text-muted-foreground">Low Priority</p>
                  <p className="text-2xl font-bold text-accent">
                    {mockReports.filter((r) => r.severity === "low").length}
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
                    placeholder="Search reports by condition or summary..."
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
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="posture">Posture Analysis</SelectItem>
                  <SelectItem value="skin">Dermatology</SelectItem>
                  <SelectItem value="eye">Eye Health</SelectItem>
                  <SelectItem value="mental">Mental Health</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
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
                        {categoryLabels[report.category]}
                      </span>
                    </div>
                    <Badge variant={getSeverityColor(report.severity) as any} className="text-xs">
                      <SeverityIcon className="w-3 h-3 mr-1" />
                      {report.severity.toUpperCase()}
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
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <span>{report.condition}</span>
                          </DialogTitle>
                          <DialogDescription>
                            {categoryLabels[report.category]} • {new Date(report.date).toLocaleDateString()}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant={getSeverityColor(report.severity) as any}>
                              <SeverityIcon className="w-3 h-3 mr-1" />
                              {report.severity.toUpperCase()} PRIORITY
                            </Badge>
                            <span className="text-sm font-medium">Confidence: {report.confidence}</span>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Analysis Summary</h4>
                            <p className="text-muted-foreground">{report.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Recommendations</h4>
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
                            Download Full Report
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
            <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== "all" || filterSeverity !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't completed any health scans yet"}
            </p>
            <Button asChild>
              <Link href="/scan">Start Your First Scan</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
