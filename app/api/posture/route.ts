import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGemini } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileId, analysisData, userId = "default" } = body

    const prompt = `
    Analyze posture data for health assessment. Consider the following factors:
    - Head and neck alignment
    - Shoulder positioning and balance
    - Spinal curvature and alignment
    - Overall postural stability
    - Risk factors for musculoskeletal issues
    
    Provide specific recommendations for posture improvement and preventive care.
    ${analysisData ? `Additional context: ${JSON.stringify(analysisData)}` : ""}
    `

    const analysis = await analyzeWithGemini(prompt, "posture")

    const healthRecord = {
      id: `posture_${Date.now()}`,
      userId,
      category: "posture" as const,
      analysis,
      timestamp: new Date().toISOString(),
      fileInfo: fileId
        ? {
            fileName: `posture_scan_${fileId}`,
            fileSize: 0,
            fileType: "image/jpeg",
          }
        : undefined,
    }

    const saved = await saveHealthRecord(healthRecord)

    if (!saved) {
      console.warn("Failed to save health record to database")
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
      analysisId: healthRecord.id,
      processingTime: "Real-time AI analysis",
      saved,
    })
  } catch (error) {
    console.error("Posture analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze posture data",
        message: "Please try again or contact support if the issue persists",
      },
      { status: 500 },
    )
  }
}
