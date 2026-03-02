import { type NextRequest, NextResponse } from "next/server"
import { getHealthData, getUserHealthRecords } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const healthData = await getHealthData()
    const userRecords = await getUserHealthRecords(userId)

    // Calculate category scores from actual records
    const categoryScores: Record<string, any> = {}
    const categories = ["posture", "skin", "eye", "mental"]

    categories.forEach((category) => {
      const categoryRecords = userRecords.filter((r) => r.category === category)
      if (categoryRecords.length > 0) {
        const latestRecord = categoryRecords.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]

        const confidence = Number.parseFloat(latestRecord.analysis.confidence?.replace("%", "") || "0")
        categoryScores[category] = {
          score: confidence,
          status: confidence >= 80 ? "good" : confidence >= 60 ? "moderate" : "needs_attention",
          lastScan: latestRecord.timestamp.split("T")[0],
          trend: "stable", // Could be enhanced with historical analysis
          condition: latestRecord.analysis.condition,
        }
      } else {
        categoryScores[category] = {
          score: 0,
          status: "no_data",
          lastScan: null,
          trend: "no_data",
          condition: "No assessment available",
        }
      }
    })

    // Calculate overall score
    const scores = Object.values(categoryScores)
      .filter((cat) => cat.score > 0)
      .map((cat) => cat.score)
    const overallScore =
      scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0

    const healthSummary = {
      overallScore,
      lastUpdated: healthData.summary.lastUpdated,
      totalScans: userRecords.length,
      categories: categoryScores,
      recommendations: [
        "Continue regular health monitoring",
        "Follow personalized recommendations from recent scans",
        "Maintain healthy lifestyle habits",
        "Schedule follow-up assessments as needed",
      ],
      nextActions: [
        "Review latest scan results",
        "Implement recommended health practices",
        "Track progress over time",
        "Consider professional consultation if needed",
      ],
    }

    return NextResponse.json({
      success: true,
      summary: healthSummary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health summary error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate health summary",
      },
      { status: 500 },
    )
  }
}
