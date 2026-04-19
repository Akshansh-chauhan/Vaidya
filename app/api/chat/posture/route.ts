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

    let imageData: string | undefined
    if (file) {
      imageData = Buffer.from(await file.arrayBuffer()).toString("base64")
    }

    const result = await analyzeWithGeminiChat(
      message || "Please analyze the uploaded image for posture assessment.",
      "posture", chatHistory, imageData, language,
    )

    const recordId = sessionId || `posture-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const fileInfo = file ? { fileName: file.name, fileSize: file.size, fileType: file.type } : undefined
    const ts = new Date().toISOString()
    const base = {
      userMessage: message || "Image uploaded for posture assessment",
      aiResponse: result.response, chatHistory, language,
      confidence: "—", severity: "medium", condition: "Posture Analysis",
      type: result.type,
    }

    saveHealthRecord({ id: recordId, userId: auth.userId, category: "posture", analysis: base, timestamp: ts, fileInfo }, auth.accessToken).catch(() => {})

    setTimeout(() => {
      gradeAnalysis("posture", result.response, message, !!file)
        .then(grade => saveHealthRecord({ id: recordId, userId: auth.userId, category: "posture", analysis: { ...base, confidence: grade.confidence, severity: grade.priority, condition: grade.condition, urgency_reason: grade.urgency_reason }, timestamp: ts, fileInfo }, auth.accessToken))
        .catch(() => {})
    }, 8000)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Posture chat API error:", error)
    const errors: Record<string, string> = {
      en: "I'm sorry, I encountered an error analyzing your posture. Please try again or consult a healthcare professional.",
      es: "Lo siento, encontré un error al analizar tu postura. Inténtalo de nuevo o consulta con un profesional de la salud.",
      fr: "Je suis désolé, j'ai rencontré une erreur lors de l'analyse de votre posture. Veuillez réessayer ou consulter un professionnel.",
      de: "Es tut mir leid, beim Analysieren Ihrer Haltung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      hi: "मुझे खेद है, मुझे आपकी मुद्रा का विश्लेषण करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
      zh: "抱歉，分析您的姿势时出现错误。请重试或咨询医疗专业人员。",
      ja: "申し訳ありません、姿勢の分析中にエラーが発生しました。再試行してください。",
      ar: "آسف، واجهت خطأ أثناء تحليل وضعيتك. يرجى المحاولة مرة أخرى.",
      it: "Mi dispiace, si è verificato un errore. Riprova o consulta un professionista sanitario.",
      pt: "Desculpe, ocorreu um erro. Tente novamente ou consulte um profissional de saúde.",
    }
    return NextResponse.json({ response: errors[language] ?? errors.en, type: "text" }, { status: 500 })
  }
}
