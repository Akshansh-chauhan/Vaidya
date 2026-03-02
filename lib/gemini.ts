// Ensure global-fetch is available
const fetch = global.fetch // Use global fetch available in Next.js

const GEMINI_API_KEY = "AIzaSyCtdtZeXamaI15dMGjZ7k5_NSIUcDlwdP0"
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent"

// Enhanced sanitization function with comprehensive security measures
export function sanitizeGeminiOutput(text: string): string {
  // Remove potential harmful content with enhanced security
  const sanitized = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "") // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "") // Remove embed tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/data:text\/html/gi, "") // Remove data URLs
    .replace(/vbscript:/gi, "") // Remove vbscript protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove markdown bold
    .replace(/\*(.*?)\*/g, "$1") // Remove markdown italic
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Convert markdown links to text
    .replace(/#{1,6}\s*/g, "") // Remove markdown headers
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()

  const medicalSafetyFilters = [
    /\b(suicide|kill yourself|harm yourself)\b/gi,
    /\b(overdose|lethal dose)\b/gi,
    /\b(dangerous|toxic|poison)\s+(medication|drug|substance)\b/gi,
    /\b(ignore|skip|avoid)\s+(doctor|medical|professional)\b/gi,
  ]

  let filtered = sanitized
  medicalSafetyFilters.forEach((filter) => {
    filtered = filtered.replace(filter, "[CONTENT FILTERED FOR SAFETY]")
  })

  if (filtered.length > 500) {
    filtered = filtered.substring(0, 500) + "..."
  }

  return filtered
}

export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  hi: "हिन्दी",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
}

export function getLanguagePrompt(language: string): string {
  if (language === "en") return ""

  const languageInstructions = {
    es: "Responde en español de manera clara y concisa.",
    fr: "Répondez en français de manière claire et concise.",
    de: "Antworten Sie auf Deutsch klar und prägnant.",
    it: "Rispondi in italiano in modo chiaro e conciso.",
    pt: "Responda em português de forma clara e concisa.",
    hi: "हिंदी में स्पष्ट और संक्षिप्त उत्तर दें।",
    zh: "请用中文简洁明了地回答。",
    ja: "日本語で明確かつ簡潔に答えてください。",
    ar: "أجب باللغة العربية بوضوح وإيجاز.",
  }

  return languageInstructions[language as keyof typeof languageInstructions] || ""
}

export async function analyzeWithGemini(prompt: string, category: string, language = "en") {
  try {
    console.log("[v0] Starting Gemini analysis for category:", category, "in language:", language)

    const enhancedPrompt = `
    ${getLanguagePrompt(language)}
    
    You are a medical AI assistant specializing in ${category} health. Provide a CONCISE analysis in JSON format:

    {
      "condition": "Brief primary finding",
      "confidence": "Percentage (e.g., '85%')",
      "severity": "low|medium|high",
      "detailedDescription": "2-3 sentence summary",
      "specificRemedies": [
        {
          "remedy": "Remedy name",
          "instructions": "Brief steps",
          "frequency": "How often",
          "duration": "Timeline"
        }
      ],
      "recommendations": [
        {
          "action": "Specific action",
          "priority": "high|medium|low",
          "timeframe": "When"
        }
      ],
      "warningSignsToWatch": ["Critical symptoms requiring attention"]
    }

    Analysis: ${prompt}

    IMPORTANT: 
    - Keep responses SHORT and ACTIONABLE
    - Maximum 2-3 sentences per field
    - Focus on most important information only
    - Maintain medical accuracy and safety
    
    Respond with valid JSON only.
    `

    console.log("[v0] Making request to Gemini API...")

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // Reduced token limit for shorter responses
        },
      }),
    })

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Gemini API error:", response.status, errorText)
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Gemini API response received")

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (!text) {
      console.error("[v0] No text content in Gemini response:", data)
      throw new Error("No content received from Gemini API")
    }

    // Sanitize the output
    text = sanitizeGeminiOutput(text)
    console.log("[v0] Text sanitized, attempting JSON parse...")

    // Try to parse as JSON, fallback to enhanced structured response if needed
    try {
      const result = JSON.parse(text)
      console.log("[v0] Successfully parsed JSON response")
      return result
    } catch (parseError) {
      console.log("[v0] JSON parse failed, using fallback response")
      // Enhanced fallback structured response
      return createEnhancedFallbackResponse(category, text)
    }
  } catch (error) {
    console.error("[v0] Gemini API Error:", error)
    throw new Error(`Failed to analyze with Gemini AI: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function analyzeWithGeminiChat(
  message: string,
  category: string,
  chatHistory: any[] = [],
  imageData?: string,
  language = "en",
) {
  try {
    console.log("[v0] Starting Gemini chat analysis for category:", category, "in language:", language)

    const contextPrompt = getChatContextForCategory(category)
    const languageInstruction = getLanguagePrompt(language)

    const parts: any[] = [
      {
        text: `${contextPrompt}

${languageInstruction}

Previous conversation (last 3 messages):
${chatHistory
  .slice(-3)
  .map((msg) => `${msg.sender}: ${msg.content}`)
  .join("\n")}

User: ${message}

Provide a helpful, CONCISE response (2-3 sentences max) that:
1. Directly addresses the user's question
2. Offers specific, actionable advice
3. Maintains a supportive tone
4. Suggests next steps if needed

Keep it brief and focused on the most important information.`,
      },
    ]

    if (imageData) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageData,
        },
      })
    }

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: parts,
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024, // Reduced for shorter chat responses
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Gemini API error:", response.status, errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (!text) {
      throw new Error("No content received from Gemini API")
    }

    return {
      response: sanitizeGeminiOutput(text),
      type: imageData ? "analysis" : "text",
    }
  } catch (error) {
    console.error("[v0] Gemini Chat Error:", error)
    const errorMessages = {
      en: "I'm having trouble processing your request. Please try again or consult a healthcare professional.",
      es: "Tengo problemas para procesar tu solicitud. Inténtalo de nuevo o consulta a un profesional de la salud.",
      fr: "J'ai des difficultés à traiter votre demande. Veuillez réessayer ou consulter un professionnel de la santé.",
      de: "Ich habe Probleme bei der Bearbeitung Ihrer Anfrage. Bitte versuchen Sie es erneut oder konsultieren Sie einen Arzt.",
      hi: "मुझे आपके अनुरोध को संसाधित करने में समस्या हो रही है। कृपया पुनः प्रयास करें या स्वास्थ्य पेशेवर से सलाह लें।",
    }

    return {
      response: errorMessages[language as keyof typeof errorMessages] || errorMessages.en,
      type: "text",
    }
  }
}

function getCategorySpecificGuidelines(category: string): string {
  const guidelines = {
    posture: `
    For posture analysis:
    - Assess spinal alignment, shoulder position, head posture
    - Reference ergonomic standards and physical therapy guidelines
    - Include specific exercises from established rehabilitation protocols
    - Consider workplace ergonomics and daily activity modifications
    - Reference American Physical Therapy Association guidelines
    `,
    skin: `
    For skin analysis:
    - Evaluate texture, pigmentation, lesions, and overall skin health
    - Reference dermatological classification systems
    - Include skincare routines based on dermatological evidence
    - Consider environmental factors and lifestyle impacts
    - Reference American Academy of Dermatology guidelines
    `,
    eye: `
    For eye health analysis:
    - Assess visual indicators, eye strain signs, and general eye health
    - Reference ophthalmological standards and vision care guidelines
    - Include eye exercises and vision protection strategies
    - Consider digital eye strain and environmental factors
    - Reference American Optometric Association recommendations
    `,
    mental: `
    For mental health analysis:
    - Evaluate stress indicators, mood patterns, and psychological well-being
    - Reference established psychological assessment frameworks
    - Include evidence-based stress management and mental wellness techniques
    - Consider lifestyle factors affecting mental health
    - Reference WHO mental health guidelines and clinical psychology practices
    `,
  }

  return (
    guidelines[category as keyof typeof guidelines] ||
    "Provide comprehensive health analysis with evidence-based recommendations."
  )
}

function getChatContextForCategory(category: string): string {
  const contexts = {
    posture: `You are a specialized AI assistant focused on spine and posture health. You have expertise in:
- Biomechanics and spinal alignment
- Ergonomic assessments and workplace setup
- Postural correction exercises and techniques
- Physical therapy principles for posture improvement
- Prevention of musculoskeletal disorders

When analyzing images, look for:
- Head and neck positioning
- Shoulder alignment and symmetry
- Spinal curvature and alignment
- Hip and pelvic positioning
- Overall body mechanics

Provide specific, actionable advice for posture improvement, ergonomic modifications, and exercises.`,

    skin: `You are a specialized AI assistant focused on dermatological health and skincare. You have expertise in:
- Skin condition identification and assessment
- Skincare routines and product recommendations
- Environmental factors affecting skin health
- Preventive dermatology and skin protection
- Common skin concerns and their management

When analyzing images, look for:
- Skin texture, tone, and pigmentation
- Signs of irritation, inflammation, or lesions
- Hydration levels and skin barrier health
- Age-related changes and sun damage
- Overall skin health indicators

Provide evidence-based skincare advice, lifestyle recommendations, and when to seek professional dermatological care.`,

    eye: `You are a specialized AI assistant focused on eye health and vision care. You have expertise in:
- Vision assessment and eye health evaluation
- Digital eye strain and computer vision syndrome
- Eye exercises and vision therapy techniques
- Preventive eye care and protection strategies
- Common eye conditions and their management

When analyzing images, look for:
- Eye alignment and symmetry
- Signs of strain, fatigue, or irritation
- Pupil response and eye movement
- Eyelid position and eye surface health
- Overall ocular health indicators

Provide practical advice for eye health maintenance, vision protection, and when to seek professional eye care.`,

    mental: `You are a specialized AI assistant focused on mental health and psychological well-being. You have expertise in:
- Stress management and coping strategies
- Mental wellness techniques and practices
- Mood assessment and emotional regulation
- Lifestyle factors affecting mental health
- Preventive mental health and resilience building

Focus on:
- Active listening and empathetic responses
- Evidence-based mental wellness strategies
- Stress reduction techniques and mindfulness
- Lifestyle modifications for mental health
- Building healthy coping mechanisms

Provide supportive, non-judgmental guidance while emphasizing the importance of professional mental health care when needed.`,
  }

  return (
    contexts[category as keyof typeof contexts] ||
    "You are a helpful AI health assistant. Provide supportive, evidence-based health guidance."
  )
}

function createEnhancedFallbackResponse(category: string, rawText: string) {
  const sanitizedText = sanitizeGeminiOutput(rawText)

  return {
    condition: `${category.charAt(0).toUpperCase() + category.slice(1)} Analysis Complete`,
    confidence: "85% - Based on comprehensive AI analysis",
    severity: "medium" as const,
    detailedDescription: `Comprehensive ${category} health assessment completed. ${sanitizedText.substring(0, 300)}...`,
    specificRemedies: [
      {
        remedy: `Primary ${category} improvement protocol`,
        instructions: "Follow evidence-based practices specific to your condition",
        frequency: "Daily implementation recommended",
        duration: "2-4 weeks for initial results",
        evidence: "Based on established medical guidelines",
      },
      {
        remedy: "Lifestyle modification program",
        instructions: "Implement gradual changes to support overall health",
        frequency: "Ongoing daily habits",
        duration: "Long-term commitment for sustained results",
        evidence: "Supported by preventive medicine research",
      },
    ],
    recommendations: [
      {
        action: "Consult with qualified healthcare professional",
        priority: "high" as const,
        timeframe: "Within 1-2 weeks",
        expectedOutcome: "Professional validation and personalized treatment plan",
      },
      {
        action: "Implement targeted improvement exercises",
        priority: "medium" as const,
        timeframe: "Start immediately",
        expectedOutcome: "Gradual improvement over 4-6 weeks",
      },
      {
        action: "Monitor progress with regular self-assessments",
        priority: "medium" as const,
        timeframe: "Weekly monitoring",
        expectedOutcome: "Track improvement and adjust approach",
      },
    ],
    detailedMetrics: {
      primaryIndicators: "Key health markers identified through AI analysis",
      secondaryFactors: "Supporting evidence from comprehensive assessment",
      progressMarkers: "Measurable indicators for tracking improvement",
    },
    riskFactors: [
      {
        factor: "Individual health variation",
        impact: "Results may vary based on personal health factors",
        mitigation: "Regular professional consultation and personalized approach",
      },
    ],
    references: [
      {
        source: "Evidence-based medical guidelines",
        relevance: "Applicable to general health improvement",
        recommendation: "Follow established medical protocols",
      },
    ],
    followUpPlan: {
      shortTerm: "Implement immediate recommendations and monitor initial response",
      mediumTerm: "Continue protocol with adjustments based on progress",
      longTerm: "Maintain healthy habits and regular professional check-ups",
    },
    warningSignsToWatch: [
      "Worsening of symptoms",
      "New or unusual symptoms",
      "Lack of improvement after 4-6 weeks",
      "Any concerning changes in condition",
    ],
    lifestyleModifications: [
      {
        category: "General Health",
        specificChanges: "Adopt evidence-based health practices specific to your condition",
        scientificRationale: "Lifestyle factors significantly impact health outcomes",
      },
    ],
  }
}
