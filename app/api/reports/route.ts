import { NextRequest, NextResponse } from "next/server"
import { getUserHealthRecords } from "@/lib/database"
import { getAuthContext } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const records = await getUserHealthRecords(auth.userId, auth.accessToken)

    // Transform database records into the HealthReport format the frontend expects
    const reports = records.map((record) => ({
      id: record.id,
      category: record.category,
      condition: record.analysis?.condition || `${record.category.charAt(0).toUpperCase() + record.category.slice(1)} Analysis`,
      confidence: record.analysis?.confidence || "N/A",
      severity: record.analysis?.severity || "low",
      date: record.timestamp,
      summary: record.analysis?.aiResponse
        ? record.analysis.aiResponse.substring(0, 150) + (record.analysis.aiResponse.length > 150 ? "..." : "")
        : "Analysis completed",
      description: record.analysis?.aiResponse || "No detailed description available.",
      recommendations: extractRecommendations(record.analysis?.aiResponse || ""),
      userMessage: record.analysis?.userMessage || "",
      chatHistory: record.analysis?.chatHistory || [],
    }))

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ reports: [] }, { status: 500 })
  }
}

// Extract actionable recommendations from AI response text
function extractRecommendations(text: string): string[] {
  if (!text) return ["Consult a healthcare professional for personalized advice"]

  const recommendations: string[] = []

  // Try to find numbered or bulleted items
  const lines = text.split(/[\n.]+/)
  for (const line of lines) {
    const cleaned = line.trim()
    // Look for lines that start with action words or numbers
    if (
      cleaned.length > 15 &&
      cleaned.length < 200 &&
      /^(\d+[\.\):]?\s*|[-•]\s*|try|consider|practice|maintain|use|take|schedule|apply|perform|ensure|avoid|include|drink|eat|get|start|keep)/i.test(cleaned)
    ) {
      recommendations.push(cleaned.replace(/^\d+[\.\):]?\s*|^[-•]\s*/, "").trim())
    }
  }

  // If no recommendations found, generate generic ones based on content
  if (recommendations.length === 0) {
    recommendations.push(
      "Follow up with a healthcare professional for personalized advice",
      "Monitor your symptoms and track any changes",
      "Maintain a healthy lifestyle with regular exercise and proper nutrition",
    )
  }

  return recommendations.slice(0, 5) // Max 5 recommendations
}
