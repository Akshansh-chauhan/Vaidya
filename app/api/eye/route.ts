import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGemini } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileId, analysisData, userId = "default" } = body

    const prompt = `
    Analyze eye health data for comprehensive assessment. Consider:
    - Visual acuity and clarity indicators
    - Eye strain and fatigue symptoms
    - Tear film stability and dry eye signs
    - Digital eye strain from screen exposure
    - Overall eye health and comfort
    
    Provide specific eye care recommendations and preventive measures.
    ${analysisData ? `Additional context: ${JSON.stringify(analysisData)}` : ""}
    `

    const analysis = await analyzeWithGemini(prompt, "eye")

    const healthRecord = {
      id: `eye_${Date.now()}`,
      userId,
      category: "eye" as const,
      analysis,
      timestamp: new Date().toISOString(),
      fileInfo: fileId
        ? {
            fileName: `eye_scan_${fileId}`,
            fileSize: 0,
            fileType: "image/jpeg",
          }
        : undefined,
    }

    const saved = await saveHealthRecord(healthRecord)

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
      analysisId: healthRecord.id,
      processingTime: "Real-time AI analysis",
      saved,
    })
  } catch (error) {
    console.error("Eye analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze eye health data",
        message: "Please check your input data and try again",
      },
      { status: 500 },
    )
  }
}
