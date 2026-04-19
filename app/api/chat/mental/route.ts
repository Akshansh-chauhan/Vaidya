import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGeminiChat } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"
import { getAuthContext } from "@/lib/auth"
import { gradeAnalysis } from "@/lib/grading-engine"

export async function POST(request: NextRequest) {
  let language = "en"
  try {
    const auth = await getAuthContext(request)
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const message = (formData.get("message") as string) || ""
    const chatHistoryStr = formData.get("chatHistory") as string
    const file = formData.get("file") as File | null
    language = (formData.get("language") as string) || "en"
    const sessionId = formData.get("sessionId") as string

    let chatHistory: any[] = []
    if (chatHistoryStr) {
      try { chatHistory = JSON.parse(chatHistoryStr) } catch {}
    }

    const result = await analyzeWithGeminiChat(
      message || "Please provide mental health guidance and support.",
      "mental", chatHistory, undefined, language,
    )

    const recordId = sessionId || `mental-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const fileInfo = file ? { fileName: file.name, fileSize: file.size, fileType: file.type } : undefined
    const ts = new Date().toISOString()
    const base = {
      userMessage: message || "Mental health check-in",
      aiResponse: result.response, chatHistory, language,
      confidence: "—", severity: "medium", condition: "Mental Health Check",
      type: result.type,
    }

    saveHealthRecord({ id: recordId, userId: auth.userId, category: "mental", analysis: base, timestamp: ts, fileInfo }, auth.accessToken).catch(() => {})

    setTimeout(() => {
      gradeAnalysis("mental", result.response, message, false)
        .then(grade => saveHealthRecord({ id: recordId, userId: auth.userId, category: "mental", analysis: { ...base, confidence: grade.confidence, severity: grade.priority, condition: grade.condition, urgency_reason: grade.urgency_reason }, timestamp: ts, fileInfo }, auth.accessToken))
        .catch(() => {})
    }, 8000)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Mental chat API error:", error)
    const errors: Record<string, string> = {
      en: "I'm here to support you. If you're experiencing a mental health crisis, please contact a professional or crisis hotline immediately.",
      es: "Estoy aquí para apoyarte. Si estás en crisis, por favor contacta a un profesional de salud mental inmediatamente.",
      fr: "Je suis là pour vous soutenir. Si vous traversez une crise, veuillez contacter immédiatement un professionnel de santé mentale.",
      de: "Ich bin hier um Sie zu unterstützen. Wenn Sie sich in einer Krise befinden, wenden Sie sich bitte sofort an einen Fachmann.",
      hi: "मैं आपका समर्थन करने के लिए यहाँ हूँ। यदि आप संकट में हैं, तो कृपया तुरंत मानसिक स्वास्थ्य पेशेवर से संपर्क करें।",
      zh: "我在这里支持您。如果您正在经历心理健康危机，请立即联系专业人员或危机热线。",
      ja: "あなたをサポートするためにここにいます。危機的状況にある場合は、すぐに専門家に連絡してください。",
      ar: "أنا هنا لدعمك. إذا كنت تمر بأزمة صحة نفسية، يرجى الاتصال بمتخصص فوراً.",
      it: "Sono qui per supportarti. Se stai attraversando una crisi, contatta immediatamente un professionista.",
      pt: "Estou aqui para apoiá-lo. Se estiver em crise, entre em contato imediatamente com um profissional de saúde mental.",
    }
    return NextResponse.json({ response: errors[language] ?? errors.en, type: "text" }, { status: 500 })
  }
}
