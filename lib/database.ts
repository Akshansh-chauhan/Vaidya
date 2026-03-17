import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("[Vaidya] WARNING: Supabase environment variables are not set!")
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}


export interface HealthRecord {
  id: string
  userId: string
  category: "posture" | "skin" | "eye" | "mental"
  analysis: any
  timestamp: string
  fileInfo?: {
    fileName: string
    fileSize: number
    fileType: string
  }
}

export interface UserData {
  users: Record<
    string,
    {
      id: string
      name: string
      email: string
      createdAt: string
    }
  >
  healthRecords: HealthRecord[]
  summary: {
    lastUpdated: string
    overallScore: number
    categoryScores: Record<string, number>
  }
}

// Get all health data (reconstructed from Supabase records)
export async function getHealthData(): Promise<UserData> {
  try {
    const { data: records, error } = await getSupabase()
      .from("health_records")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching health data:", error.message)
      return getEmptyData()
    }

    const healthRecords: HealthRecord[] = (records || []).map(mapRowToRecord)

    // Compute summary from records
    const categoryScores: Record<string, number> = {}
    const categories = ["posture", "skin", "eye", "mental"]

    categories.forEach((category) => {
      const catRecords = healthRecords.filter((r) => r.category === category)
      if (catRecords.length > 0) {
        const avgScore =
          catRecords.reduce(
            (sum, r) => sum + parseFloat(r.analysis?.confidence?.replace("%", "") || "0"),
            0,
          ) / catRecords.length
        categoryScores[category] = avgScore
      }
    })

    const scores = Object.values(categoryScores)
    const overallScore =
      scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        : 0

    return {
      users: {},
      healthRecords,
      summary: {
        lastUpdated: new Date().toISOString(),
        overallScore,
        categoryScores,
      },
    }
  } catch (error) {
    console.error("Error fetching health data:", error)
    return getEmptyData()
  }
}

// Save a health record to Supabase
export async function saveHealthRecord(record: HealthRecord): Promise<boolean> {
  try {
    const { error } = await getSupabase().from("health_records").insert({
      id: record.id,
      user_id: record.userId,
      category: record.category,
      analysis: record.analysis,
      timestamp: record.timestamp,
      file_name: record.fileInfo?.fileName || null,
      file_size: record.fileInfo?.fileSize || null,
      file_type: record.fileInfo?.fileType || null,
    })

    if (error) {
      console.error("Error saving health record:", error.message)
      return false
    }

    return true
  } catch (error) {
    console.error("Error saving health record:", error)
    return false
  }
}

// Get a user's health records
export async function getUserHealthRecords(userId = "default"): Promise<HealthRecord[]> {
  try {
    const { data: records, error } = await getSupabase()
      .from("health_records")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching user records:", error.message)
      return []
    }

    return (records || []).map(mapRowToRecord)
  } catch (error) {
    console.error("Error fetching user records:", error)
    return []
  }
}

// ── Helpers ──

function mapRowToRecord(row: any): HealthRecord {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    analysis: row.analysis,
    timestamp: row.timestamp,
    fileInfo:
      row.file_name
        ? {
            fileName: row.file_name,
            fileSize: row.file_size ?? 0,
            fileType: row.file_type ?? "",
          }
        : undefined,
  }
}

function getEmptyData(): UserData {
  return {
    users: {},
    healthRecords: [],
    summary: {
      lastUpdated: new Date().toISOString(),
      overallScore: 0,
      categoryScores: {},
    },
  }
}
