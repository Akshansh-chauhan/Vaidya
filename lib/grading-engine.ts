const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || ""

export interface GradingResult {
  priority: "low" | "medium" | "high"
  confidence: string
  urgency_reason: string
  condition: string
}

const FALLBACK: GradingResult = {
  priority: "medium",
  confidence: "65%",
  urgency_reason: "Insufficient context for precise grading",
  condition: "Health Assessment",
}

export async function gradeAnalysis(
  category: string,
  aiResponse: string,
  userMessage: string,
  hasImage: boolean,
): Promise<GradingResult> {
  if (!NVIDIA_API_KEY) return FALLBACK

  const prompt = `You are a medical triage AI. Grade the following health consultation.

CATEGORY: ${category}
HAS_IMAGE: ${hasImage}
USER_MESSAGE: ${userMessage.slice(0, 300)}
AI_RESPONSE: ${aiResponse.slice(0, 600)}

Return ONLY valid JSON (no markdown, no explanation):
{
  "priority": "low|medium|high",
  "confidence": "XX%",
  "urgency_reason": "one short sentence explaining priority",
  "condition": "brief 2-4 word condition label"
}

PRIORITY RULES:
- high: urgent symptoms, pain, vision changes, acute mental health crisis, suspicious lesions, structural deformity — needs care soon
- medium: notable findings, chronic concerns, follow-up recommended within weeks
- low: routine wellness, minor concerns, preventive care only

CONFIDENCE RULES:
- 80-95%: image provided + specific symptoms + detailed exchange
- 60-79%: some specifics, moderate context
- 40-59%: vague or no image, minimal context`

  try {
    const res = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 150,
      }),
    })

    if (!res.ok) return FALLBACK

    const data = await res.json()
    const text: string = data.choices?.[0]?.message?.content || ""

    // Strip markdown fences if present
    const cleaned = text.replace(/```[a-z]*\n?/g, "").replace(/```/g, "").trim()

    const parsed = JSON.parse(cleaned) as GradingResult

    // Validate fields
    if (!["low", "medium", "high"].includes(parsed.priority)) parsed.priority = "medium"
    if (!parsed.confidence?.includes("%")) parsed.confidence = "65%"
    if (!parsed.urgency_reason) parsed.urgency_reason = FALLBACK.urgency_reason
    if (!parsed.condition) parsed.condition = `${category.charAt(0).toUpperCase() + category.slice(1)} Analysis`

    return parsed
  } catch {
    return FALLBACK
  }
}
