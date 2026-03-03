"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, MicOff, Volume2, VolumeX, Upload, Bot, User, FileText, Loader2, Globe, ChevronDown, Check } from "lucide-react"
import { LANGUAGE_NAMES, type Language } from "@/lib/translations"
import { useLanguage } from "@/lib/use-language"

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
        className="flex items-center gap-1.5 border border-border rounded-md px-2.5 py-1 bg-transparent hover:bg-secondary/50 transition-colors text-sm font-medium cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs">{LANGUAGE_NAMES[lang]}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-[100] overflow-hidden">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="chat-lang-scroll py-1 max-h-48 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`.chat-lang-scroll::-webkit-scrollbar { display: none; }`}</style>
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
              <button
                key={code}
                onClick={() => { onSwitch(code); setOpen(false) }}
                className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-secondary/60 transition-colors ${lang === code ? "bg-secondary/40 font-medium" : ""
                  }`}
              >
                {LANGUAGE_NAMES[code]}
                {lang === code && <Check className="w-3 h-3 text-primary" />}
              </button>
            ))}
          </div>
          {showScrollHint && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-0.5 pt-3 bg-gradient-to-t from-card via-card/90 to-transparent pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground animate-bounce" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HealthChatbot({ scanType, title, description, acceptedFiles }: HealthChatbotProps) {
  const [lang, setLang] = useLanguage()
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const getWelcomeMessage = (language: string, scanType: string) => {
    const welcomeMessages = {
      en: `Hello! I'm your AI health assistant for ${title.toLowerCase()}. I can analyze your images, answer questions, and provide personalized recommendations. You can speak to me using the microphone or type your messages. How can I help you today?`,
      es: `¡Hola! Soy tu asistente de salud con IA para ${title.toLowerCase()}. Puedo analizar tus imágenes, responder preguntas y proporcionar recomendaciones personalizadas. Puedes hablarme usando el micrófono o escribir tus mensajes. ¿Cómo puedo ayudarte hoy?`,
      fr: `Bonjour ! Je suis votre assistant santé IA pour ${title.toLowerCase()}. Je peux analyser vos images, répondre aux questions et fournir des recommandations personnalisées. Vous pouvez me parler en utilisant le microphone ou taper vos messages. Comment puis-je vous aider aujourd'hui ?`,
      de: `Hallo! Ich bin Ihr KI-Gesundheitsassistent für ${title.toLowerCase()}. Ich kann Ihre Bilder analysieren, Fragen beantworten und personalisierte Empfehlungen geben. Sie können mit mir über das Mikrofon sprechen oder Ihre Nachrichten tippen. Wie kann ich Ihnen heute helfen?`,
      hi: `नमस्ते! मैं ${title.toLowerCase()} के लिए आपका AI स्वास्थ्य सहायक हूं। मैं आपकी छवियों का विश्लेषण कर सकता हूं, प्रश्नों के उत्तर दे सकता हूं और व्यक्तिगत सिफारिशें प्रदान कर सकता हूं। आप माइक्रोफ़ोन का उपयोग करके मुझसे बात कर सकते हैं या अपने संदेश टाइप कर सकते हैं। आज मैं आपकी कैसे सहायता कर सकता हूं?`,
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

      recognition.onresult = (event) => {
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

      recognition.onerror = (event) => {
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
      if (uploadedFile) {
        formData.append("file", uploadedFile)
        setUploadedFile(null)
      }
      formData.append("message", inputMessage.trim())
      formData.append("chatHistory", JSON.stringify(messages))
      formData.append("language", currentLanguage)

      const response = await fetch(`/api/chat/${scanType}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`)
      }

      const result = await response.json()

      addMessage(result.response, "bot", result.type || "text")

      if (result.response && "speechSynthesis" in window) {
        speakText(result.response)
      }
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
    if (messages.length === 1 && "speechSynthesis" in window) {
      setTimeout(() => {
        speakText(messages[0].content)
      }, 1000)
    }
  }, [])

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-primary" />
              <span>{title} Assistant</span>
              <Badge variant="secondary" className="ml-2">
                AI Powered
              </Badge>
            </CardTitle>
            <ChatLanguagePicker lang={currentLanguage as Language} onSwitch={(l) => setCurrentLanguage(l)} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3" />
              <span>Voice Output: {isSpeaking ? "Speaking..." : "Ready"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mic className="w-3 h-3" />
              <span>Voice Input: {isRecording ? "Listening..." : isProcessingSTT ? "Processing..." : "Ready"}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}
                    >
                      {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 max-w-[80%] ${message.sender === "user" ? "text-right" : ""}`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                        }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</p>
                      {message.sender === "bot" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <p className="text-sm flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing your input...
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4 space-y-3">
            {uploadedFile && (
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="text-sm flex-1">{uploadedFile.name}</span>
                <Button size="sm" variant="ghost" onClick={() => setUploadedFile(null)}>
                  ×
                </Button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={isRecording ? "bg-red-100 text-red-600" : ""}
                  disabled={isProcessingSTT}
                >
                  {isProcessingSTT ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : () => { }}
                  disabled={!isSpeaking}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message, upload an image, or use voice input..."
                className="flex-1"
                disabled={isAnalyzing}
              />

              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !uploadedFile) || isAnalyzing}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
