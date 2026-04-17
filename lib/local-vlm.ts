/**
 * Vaidya VLM — local model inference interface.
 * Handles routing between local model (primary) and cloud fallback.
 *
 * Local model: fine-tuned LLaMA 3.2 90B Vision via PPO-RLHF
 * Fallback: NVIDIA NIM API (used during model training / when local unavailable)
 */

const LOCAL_VLM_ENDPOINT = process.env.LOCAL_VLM_ENDPOINT ?? "http://localhost:8080/v1"
const LOCAL_VLM_MODEL = process.env.LOCAL_VLM_MODEL ?? "vaidya-vlm-v1"
const LOCAL_VLM_TIMEOUT_MS = parseInt(process.env.LOCAL_VLM_TIMEOUT_MS ?? "15000")

export interface VLMRequest {
  prompt: string
  category: "posture" | "skin" | "eye" | "mental"
  language: string
  imageBase64?: string
  chatHistory?: { role: "user" | "assistant"; content: string }[]
  maxTokens?: number
  temperature?: number
}

export interface VLMResponse {
  text: string
  model: string
  source: "local" | "cloud"
  latencyMs: number
  tokensUsed?: number
}

export interface ModelStatus {
  available: boolean
  model: string
  version: string
  checkpoint_step: number
  device: string
  dtype: string
  uptime_seconds: number
}

/**
 * Check if local VLM is running and healthy.
 */
export async function getLocalModelStatus(): Promise<ModelStatus | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const res = await fetch(`${LOCAL_VLM_ENDPOINT}/health`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Run inference against local VLM.
 * Returns null if local model is unavailable or times out.
 */
async function inferLocal(request: VLMRequest): Promise<VLMResponse | null> {
  const start = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), LOCAL_VLM_TIMEOUT_MS)

    const messages = buildMessages(request)

    const res = await fetch(`${LOCAL_VLM_ENDPOINT}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: LOCAL_VLM_MODEL,
        messages,
        max_tokens: request.maxTokens ?? 2048,
        temperature: request.temperature ?? 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return null

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content ?? ""

    return {
      text,
      model: LOCAL_VLM_MODEL,
      source: "local",
      latencyMs: Date.now() - start,
      tokensUsed: data.usage?.total_tokens,
    }
  } catch {
    return null
  }
}

/**
 * Build message array from VLMRequest.
 */
function buildMessages(request: VLMRequest) {
  const messages: { role: string; content: unknown }[] = []

  if (request.chatHistory?.length) {
    messages.push(...request.chatHistory)
  }

  const userContent: unknown[] = [{ type: "text", text: request.prompt }]

  if (request.imageBase64) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${request.imageBase64}` },
    })
  }

  messages.push({ role: "user", content: userContent })
  return messages
}

/**
 * Primary inference entrypoint.
 * Tries local model first; falls back to cloud API if unavailable.
 */
export async function runInference(request: VLMRequest): Promise<VLMResponse> {
  const localResult = await inferLocal(request)
  if (localResult) return localResult

  // Cloud fallback — invoked by analyzeWithGemini in lib/gemini.ts
  const { analyzeWithGeminiChat } = await import("./gemini")
  const start = Date.now()

  const text = await analyzeWithGeminiChat(
    request.prompt,
    request.category,
    request.chatHistory?.map((m) => ({ role: m.role, content: m.content })) ?? [],
    request.imageBase64 ?? null,
    request.language
  )

  return {
    text,
    model: "meta/llama-3.2-90b-vision-instruct",
    source: "cloud",
    latencyMs: Date.now() - start,
  }
}
