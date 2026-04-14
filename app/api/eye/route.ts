import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGemini } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"
import { getAuthContext } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { fileId, analysisData } = body

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
      userId: auth.userId,
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

    const saved = await saveHealthRecord(healthRecord, auth.accessToken)

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
