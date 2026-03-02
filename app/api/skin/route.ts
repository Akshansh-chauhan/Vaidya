import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGemini } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileId, analysisData, userId = "default" } = body

    const prompt = `
    Analyze skin health data for dermatological assessment. Consider:
    - Skin texture, color, and pigmentation
    - Presence of lesions, moles, or abnormalities
    - Signs of aging, sun damage, or environmental effects
    - Acne, inflammation, or other skin conditions
    - Overall skin health indicators
    
    Provide specific skincare recommendations and monitoring advice.
    ${analysisData ? `Additional context: ${JSON.stringify(analysisData)}` : ""}
    `

    const analysis = await analyzeWithGemini(prompt, "skin")

    const healthRecord = {
      id: `skin_${Date.now()}`,
      userId,
      category: "skin" as const,
      analysis,
      timestamp: new Date().toISOString(),
      fileInfo: fileId
        ? {
            fileName: `skin_scan_${fileId}`,
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
    console.error("Skin analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze skin data",
        message: "Please ensure image quality is sufficient and try again",
      },
      { status: 500 },
    )
  }
}
