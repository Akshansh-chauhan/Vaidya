import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGeminiChat } from "@/lib/gemini"
import { saveHealthRecord } from "@/lib/database"
import { getAuthUserId } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const message = formData.get("message") as string
    const chatHistoryStr = formData.get("chatHistory") as string
    const file = formData.get("file") as File | null
    const language = (formData.get("language") as string) || "en"
    const sessionId = formData.get("sessionId") as string

    let chatHistory = []
    if (chatHistoryStr) {
      try {
        chatHistory = JSON.parse(chatHistoryStr)
      } catch (e) {
        console.error("Failed to parse chat history:", e)
      }
    }

    let imageData: string | undefined
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      imageData = buffer.toString("base64")
    }

    const result = await analyzeWithGeminiChat(
      message || "Please analyze the uploaded image for skin health assessment.",
      "skin",
      chatHistory,
      imageData,
      language,
    )

    const userId = await getAuthUserId(request)

    // Save to Supabase
    try {
      await saveHealthRecord({
        id: sessionId || `skin-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        userId,
        category: "skin",
        analysis: {
          userMessage: message || "Image uploaded for skin assessment",
          aiResponse: result.response,
          chatHistory: chatHistory,
          type: result.type,
          language,
          confidence: file ? "88%" : "72%",
          severity: "low",
          condition: "Skin Analysis",
        },
        timestamp: new Date().toISOString(),
        fileInfo: file
          ? {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            }
          : undefined,
      })
    } catch (dbError) {
      console.error("Failed to save skin record:", dbError)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Skin chat API error:", error)

    const errorMessages = {
      en: "I'm sorry, I encountered an error analyzing your skin. Please try again or consult with a dermatologist.",
      es: "Lo siento, encontré un error al analizar tu piel. Inténtalo de nuevo o consulta con un dermatólogo.",
      fr: "Je suis désolé, j'ai rencontré une erreur lors de l'analyse de votre peau. Veuillez réessayer ou consulter un dermatologue.",
      de: "Es tut mir leid, ich bin auf einen Fehler bei der Analyse Ihrer Haut gestoßen. Bitte versuchen Sie es erneut oder konsultieren Sie einen Dermatologen.",
      hi: "मुझे खेद है, मुझे आपकी त्वचा का विश्लेषण करने में त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या त्वचा विशेषज्ञ से सलाह लें।",
    }

    const errorMessage = errorMessages["en" as keyof typeof errorMessages] || errorMessages.en

    return NextResponse.json(
      {
        response: errorMessage,
        type: "text",
      },
      { status: 500 },
    )
  }
}
