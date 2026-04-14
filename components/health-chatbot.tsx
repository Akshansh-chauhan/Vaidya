"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, MicOff, Volume2, VolumeX, Upload, Bot, User, FileText, Loader2, Globe, ChevronDown, Check, Sparkles, X } from "lucide-react"
import { LANGUAGE_NAMES, type Language } from "@/lib/translations"
import { useLanguage } from "@/lib/use-language"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "image" | "analysis"
}

interface HealthChatbotProps {
  scanType: "posture" | "skin" | "eye" | "mental"
  title: string
  description: string
  acceptedFiles?: string
}

function ChatLanguagePicker({ lang, onSwitch }: { lang: Language; onSwitch: (l: Language) => void }) {
  const [open, setOpen] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Stop speech when component unmounts (page navigation)
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  const handleScroll = () => {
    if (!listRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    setShowScrollHint(scrollTop + clientHeight < scrollHeight - 8)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/70 transition-colors text-[13px] font-medium text-zinc-600 cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-zinc-400" />
        <span>{LANGUAGE_NAMES[lang]}</span>
        <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-zinc-100 z-[100] overflow-hidden p-1.5">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="chat-lang-scroll max-h-48 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`.chat-lang-scroll::-webkit-scrollbar { display: none; }`}</style>
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
              <button
                key={code}
                onClick={() => { onSwitch(code); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between rounded-xl transition-colors cursor-pointer ${lang === code ? "bg-zinc-900 text-white font-medium" : "text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {LANGUAGE_NAMES[code]}
                {lang === code && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
          {showScrollHint && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-0.5 pt-3 bg-gradient-to-t from-white/90 to-transparent pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 animate-bounce" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HealthChatbot({ scanType, title, description, acceptedFiles }: HealthChatbotProps) {
  const [lang, setLang] = useLanguage()
  const { user } = useAuth()
  const currentLanguage = lang
  const setCurrentLanguage = setLang
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessingSTT, setIsProcessingSTT] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  
  // Create a stable session ID for this specific chat instance
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)

  const getWelcomeMessage = (language: string, scanType: string) => {
    const welcomeMessages = {
      en: `Hello! I'm your AI health assistant for ${title.toLowerCase()}. I can analyze your images, answer questions, and provide personalized recommendations. You can speak to me using the microphone or type your messages. How can I help you today?`,
      es: `¡Hola! Soy tu asistente de salud con IA para ${title.toLowerCase()}. Puedo analizar tus imágenes, responder preguntas y proporcionar recomendaciones personalizadas. Puedes hablarme usando el micrófono o escribir tus mensajes. ¿Cómo puedo ayudarte hoy?`,
      fr: `Bonjour ! Je suis votre assistant santé IA pour ${title.toLowerCase()}. Je peux analyser vos images, répondre aux questions et fournir des recommandations personnalisées. Vous pouvez me parler en utilisant le microphone ou taper vos messages. Comment puis-je vous aider aujourd'hui ?`,
      de: `Hallo! Ich bin Ihr KI-Gesundheitsassistent für ${title.toLowerCase()}. Ich kann Ihre Bilder analysieren, Fragen beantworten und personalisierte Empfehlungen geben. Sie können mit mir über das Mikrofon sprechen oder Ihre Nachrichten tippen. Wie kann ich Ihnen heute helfen?`,
      hi: `नमस्ते! मैं ${title.toLowerCase()} के लिए आपका AI स्वास्थ्य सहायक हूं। मैं आपकी छवियों का विश्लेषण कर सकता हूं, प्रश्नों के उत्तर दे सकता हूं और व्यक्तिगत सिफारिशें प्रदान कर सकता हूं। आप माइक्रोफ़ोन का उपयोग करके मुझसे बात कर सकते हैं या अपने संदेश टाइप कर सकते हैं। आज मैं आपकी कैसे सहायता कर सकता हूं?`,
      it: `Ciao! Sono il tuo assistente sanitario IA per ${title.toLowerCase()}. Posso analizzare le tue immagini, rispondere alle domande e fornire raccomandazioni personalizzate. Puoi parlarmi usando il microfono o digitare i tuoi messaggi. Come posso aiutarti oggi?`,
      pt: `Olá! Sou o seu assistente de saúde IA para ${title.toLowerCase()}. Posso analisar as suas imagens, responder a perguntas e fornecer recomendações personalizadas. Pode falar comigo usando o microfone ou digitar as suas mensagens. Como posso ajudá-lo hoje?`,
      zh: `你好！我是你的${title.toLowerCase()} AI 健康助手。我可以分析您的图像、回答问题并提供个性化建议。您可以使用麦克风对我说话或输入您的信息。今天我能如何帮助您？`,
      ja: `こんにちは！私はあなたの${title.toLowerCase()}のAI健康アシスタントです。画像の分析、質問への回答、パーソナライズされた推奨事項の提供が可能です。マイクを使って話しかけたり、メッセージを入力したりできます。今日はどのようなご用件でしょうか？`,
      ar: `مرحباً! أنا مساعدك الصحي المدعوم بالذكاء الاصطناعي لـ ${title.toLowerCase()}. يمكنني تحليل صورك والإجابة على الأسئلة وتقديم توصيات مخصصة. يمكنك التحدث إلي باستخدام الميكروفون أو كتابة رسائلك. كيف يمكنني مساعدتك اليوم؟`,
    }
    return welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en
  }

  useEffect(() => {
    const initialMessage = {
      id: "1",
      content: getWelcomeMessage(currentLanguage, scanType),
      sender: "bot" as const,
      timestamp: new Date(),
    }
    setMessages([initialMessage])
  }, [currentLanguage, scanType, title])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])




  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = true
      const languageCodes = {
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        it: "it-IT",
        pt: "pt-BR",
        hi: "hi-IN",
        zh: "zh-CN",
        ja: "ja-JP",
        ar: "ar-SA",
      }
      recognition.lang = languageCodes[currentLanguage as keyof typeof languageCodes] || "en-US"

      recognition.onstart = () => {
        setIsRecording(true)
        setIsProcessingSTT(false)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setInputMessage(finalTranscript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
        setIsProcessingSTT(false)

        const errorMessages = {
          en: {
            "not-allowed": "Microphone access denied. Please enable microphone permissions and try again.",
            "no-speech": "No speech detected. Please try speaking again.",
            default: "Speech recognition failed. Please try typing your message instead.",
          },
          es: {
            "not-allowed": "Acceso al micrófono denegado. Habilite los permisos del micrófono e intente nuevamente.",
            "no-speech": "No se detectó habla. Intente hablar nuevamente.",
            default: "El reconocimiento de voz falló. Intente escribir su mensaje.",
          },
          fr: {
            "not-allowed": "Accès au microphone refusé. Veuillez activer les autorisations du microphone et réessayer.",
            "no-speech": "Aucune parole détectée. Veuillez essayer de parler à nouveau.",
            default: "La reconnaissance vocale a échoué. Veuillez essayer de taper votre message.",
          },
        }

        const messages = errorMessages[currentLanguage as keyof typeof errorMessages] || errorMessages.en
        const errorMessage = messages[event.error as keyof typeof messages] || messages.default
        addMessage(errorMessage, "bot")
      }

      recognition.onend = () => {
        setIsRecording(false)
        setIsProcessingSTT(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [currentLanguage])

  const addMessage = (content: string, sender: "user" | "bot", type: "text" | "image" | "analysis" = "text") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type,
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedFile) return

    let userMessage = inputMessage.trim()
    if (uploadedFile) {
      userMessage = `[Uploaded ${uploadedFile.name}] ${userMessage}`
    }

    addMessage(userMessage, "user")
    setInputMessage("")
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append("message", inputMessage.trim())
      formData.append("language", currentLanguage)
      formData.append("chatHistory", JSON.stringify(messages))
      formData.append("sessionId", sessionId) // Pass sessionId to preserve the report record

      if (uploadedFile) {
        formData.append("file", uploadedFile)
        setUploadedFile(null)
      }

      const token = (await getSupabaseClient().auth.getSession()).data.session?.access_token

      const response = await fetch(`/api/chat/${scanType}`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`)
      }

      const result = await response.json()

      addMessage(result.response, "bot", result.type || "text")
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessages = {
        en: "I'm sorry, I encountered an error. Please try again or consult with a healthcare professional.",
        es: "Lo siento, encontré un error. Inténtalo de nuevo o consulta con un profesional de la salud.",
        fr: "Je suis désolé, j'ai rencontré une erreur. Veuillez réessayer ou consulter un professionnel de la santé.",
        de: "Es tut mir leid, ich bin auf einen Fehler gestoßen. Bitte versuchen Sie es erneut oder konsultieren Sie einen Arzt.",
        hi: "मुझे खेद है, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें या स्वास्थ्य पेशेवर से सलाह लें।",
      }
      addMessage(errorMessages[currentLanguage as keyof typeof errorMessages] || errorMessages.en, "bot")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window && !isSpeaking) {
      speechSynthesis.cancel()

      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)

      const voices = speechSynthesis.getVoices()

      // BCP-47 locale codes for proper accent/voice matching
      const languageLocaleMap: Record<string, string> = {
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        it: "it-IT",
        pt: "pt-BR",
        hi: "hi-IN",
        zh: "zh-CN",
        ja: "ja-JP",
        ar: "ar-SA",
      }

      const targetLocale = languageLocaleMap[currentLanguage] || "en-US"
      const targetLangPrefix = targetLocale.split("-")[0]

      // Set utterance language — this is critical for accent
      utterance.lang = targetLocale

      // Try exact locale match first, then prefix match, then default
      const preferredVoice =
        voices.find((v) => v.lang === targetLocale) ||
        voices.find((v) => v.lang.startsWith(targetLangPrefix + "-")) ||
        voices.find((v) => v.lang.startsWith(targetLangPrefix)) ||
        voices[0]

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.85
      utterance.pitch = 1.1
      utterance.volume = 0.8

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setIsSpeaking(false)
      }

      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const startRecording = async () => {
    if (recognitionRef.current && !isRecording) {
      try {
        setIsProcessingSTT(true)
        recognitionRef.current.start()
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
        setIsProcessingSTT(false)
        addMessage("Speech recognition is not available. Please type your message instead.", "bot")
      }
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-[650px] max-w-4xl mx-auto anim-fade-up anim-delay-1">
      {/* Chat container — glass card */}
      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-zinc-100/80">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-9 sm:h-9 bg-zinc-900 rounded-2xl sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-zinc-900 text-[15px] sm:text-[15px] leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>{title} Assistant</h3>
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">AI</span>
                </div>
                <p className="text-[12px] text-zinc-400 mt-0.5 leading-relaxed">{description}</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center gap-2 shrink-0">
              {/* Status indicators */}
              <div className="hidden sm:flex items-center gap-3 mr-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] text-zinc-400 font-medium">Voice</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] text-zinc-400 font-medium">Mic</span>
                </div>
              </div>
              <ChatLanguagePicker lang={currentLanguage as Language} onSwitch={(l) => setCurrentLanguage(l)} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 px-6 overflow-y-auto no-scrollbar">
          <div className="space-y-5 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-zinc-900 shadow-sm"
                    : "bg-zinc-100"
                }`}>
                  {message.sender === "user" 
                    ? <User className="w-3.5 h-3.5 text-white" />
                    : <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  }
                </div>

                {/* Message bubble */}
                <div className={`flex-1 max-w-[80%] ${message.sender === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                      message.sender === "user"
                        ? "bg-zinc-900 text-white rounded-br-md"
                        : "bg-zinc-100 text-zinc-700 rounded-bl-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${message.sender === "user" ? "justify-end" : ""}`}>
                    <p className="text-[11px] text-zinc-400">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {message.sender === "bot" && (
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer p-0.5"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isAnalyzing && (
              <div className="flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
                </div>
                <div className="bg-zinc-100 rounded-2xl rounded-bl-md px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="px-5 py-4 border-t border-zinc-100/80">
          {/* Uploaded file indicator */}
          {uploadedFile && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-blue-700 font-medium flex-1 truncate">{uploadedFile.name}</span>
              <button onClick={() => setUploadedFile(null)} className="text-blue-400 hover:text-blue-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Action buttons */}
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessingSTT}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-100 text-red-500 animate-pulse"
                    : "bg-zinc-100 hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {isProcessingSTT ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={isSpeaking ? stopSpeaking : () => { }}
                disabled={!isSpeaking}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  isSpeaking
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Text input */}
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message, upload an image, or use voice input..."
                className="bg-zinc-50 border-zinc-200 rounded-xl h-11 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-zinc-200 pr-12"
                disabled={isAnalyzing}
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !uploadedFile) || isAnalyzing}
              className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
