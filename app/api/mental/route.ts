import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGemini } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileId, analysisData, userId = "default" } = body

    const prompt = `
    Analyze mental health indicators for wellness assessment. Consider:
    - Stress levels and anxiety markers
    - Mood stability and emotional regulation
    - Sleep quality and patterns
    - Coping mechanisms and resilience
    - Overall mental wellness indicators
    
    Provide supportive recommendations for mental health maintenance and improvement.
    Important: This is for wellness support only, not clinical diagnosis.
    ${analysisData ? `Additional context: ${JSON.stringify(analysisData)}` : ""}
    `

    const analysis = await analyzeWithGemini(prompt, "mental")

    const healthRecord = {
      id: `mental_${Date.now()}`,
      userId,
      category: "mental" as const,
      analysis,
      timestamp: new Date().toISOString(),
      fileInfo: fileId
        ? {
            fileName: `mental_assessment_${fileId}`,
            fileSize: 0,
            fileType: "audio/mp3",
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
      disclaimer:
        "This analysis is for informational purposes only and does not replace professional mental health evaluation.",
    })
  } catch (error) {
    console.error("Mental health analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze mental health data",
        message: "Please try again or seek professional support if you're experiencing distress",
      },
      { status: 500 },
    )
  }
}
