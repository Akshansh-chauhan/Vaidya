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
    if (file && file.type.startsWith("audio/")) {
      // For mental health, we might receive audio files
      // In a real implementation, you'd convert audio to text first
      const result = await analyzeWithGeminiChat(
        message || "User provided an audio message for mental health assessment.",
        "mental",
        chatHistory,
        undefined,
        language,
      )
      return NextResponse.json(result)
    }

    const result = await analyzeWithGeminiChat(
      message || "Please provide mental health guidance and support.",
      "mental",
      chatHistory,
      imageData,
      language,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Mental health chat API error:", error)

    const formData = await request.formData()
    const language = (formData.get("language") as string) || "en"

    const errorMessages = {
      en: "I'm here to support you. If you're experiencing a mental health crisis, please contact a mental health professional or crisis hotline immediately. For general wellness, I'm happy to help with stress management and coping strategies.",
      es: "Estoy aquí para apoyarte. Si estás experimentando una crisis de salud mental, por favor contacta a un profesional de salud mental o línea de crisis inmediatamente. Para bienestar general, estoy feliz de ayudar con manejo del estrés y estrategias de afrontamiento.",
      fr: "Je suis là pour vous soutenir. Si vous traversez une crise de santé mentale, veuillez contacter immédiatement un professionnel de la santé mentale ou une ligne de crise. Pour le bien-être général, je suis heureux d'aider avec la gestion du stress et les stratégies d'adaptation.",
      de: "Ich bin hier, um Sie zu unterstützen. Wenn Sie eine psychische Krise erleben, wenden Sie sich bitte sofort an einen Fachmann für psychische Gesundheit oder eine Krisenhotline. Für allgemeines Wohlbefinden helfe ich gerne bei Stressmanagement und Bewältigungsstrategien.",
      hi: "मैं आपका समर्थन करने के लिए यहाँ हूँ। यदि आप मानसिक स्वास्थ्य संकट का सामना कर रहे हैं, तो कृपया तुरंत मानसिक स्वास्थ्य पेशेवर या संकट हॉटलाइन से संपर्क करें। सामान्य कल्याण के लिए, मैं तनाव प्रबंधन और मुकाबला रणनीतियों में मदद करने में खुश हूँ।",
    }

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
