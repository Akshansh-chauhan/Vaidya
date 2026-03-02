import { type NextRequest, NextResponse } from "next/server"
import { analyzeWithGeminiChat } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const message = formData.get("message") as string
    const chatHistoryStr = formData.get("chatHistory") as string
    const file = formData.get("file") as File | null
    const language = (formData.get("language") as string) || "en"

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
      message || "Please analyze the uploaded image for posture assessment.",
      "posture",
      chatHistory,
      imageData,
      language,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Posture chat API error:", error)

    const errorMessages = {
      en: "I'm sorry, I encountered an error analyzing your posture. Please try again or consult with a healthcare professional.",
      es: "Lo siento, encontré un error al analizar tu postura. Inténtalo de nuevo o consulta con un profesional de la salud.",
      fr: "Je suis désolé, j'ai rencontré une erreur lors de l'analyse de votre posture. Veuillez réessayer ou consulter un professionnel de la santé.",
      de: "Es tut mir leid, ich bin auf einen Fehler bei der Analyse Ihrer Haltung gestoßen. Bitte versuchen Sie es erneut oder konsultieren Sie einen Arzt.",
      hi: "मुझे खेद है, मुझे आपकी मुद्रा का विश्लेषण करने में त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या स्वास्थ्य पेशेवर से सलाह लें।",
    }

    const language = ((await request.formData()).get("language") as string) || "en"
    const errorMessage = errorMessages[language as keyof typeof errorMessages] || errorMessages.en

    return NextResponse.json(
      {
        response: errorMessage,
        type: "text",
      },
      { status: 500 },
    )
  }
}
