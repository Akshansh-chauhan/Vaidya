const JSONBLOB_BASE_URL = "https://jsonblob.com/api"
const BLOB_ID = "1413824672096772096"

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

// Get all data from JSONBlob
export async function getHealthData(): Promise<UserData> {
  try {
    const response = await fetch(`${JSONBLOB_BASE_URL}/jsonBlob/${BLOB_ID}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      // Initialize with empty data if blob doesn't exist
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

    return await response.json()
  } catch (error) {
    console.error("Error fetching health data:", error)
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
}

// Save health record to JSONBlob
export async function saveHealthRecord(record: HealthRecord): Promise<boolean> {
  try {
    const currentData = await getHealthData()

    // Add new record
    currentData.healthRecords.push(record)

    // Update summary scores
    const categoryRecords = currentData.healthRecords.filter((r) => r.category === record.category)
    const avgScore =
      categoryRecords.length > 0
        ? categoryRecords.reduce((sum, r) => sum + Number.parseFloat(r.analysis.confidence.replace("%", "")), 0) /
          categoryRecords.length
        : 0

    currentData.summary.categoryScores[record.category] = avgScore
    currentData.summary.lastUpdated = new Date().toISOString()

    // Calculate overall score
    const scores = Object.values(currentData.summary.categoryScores)
    currentData.summary.overallScore =
      scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0

    // Save to JSONBlob
    const response = await fetch(`${JSONBLOB_BASE_URL}/jsonBlob/${BLOB_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(currentData),
    })

    return response.ok
  } catch (error) {
    console.error("Error saving health record:", error)
    return false
  }
}

// Get user's health records
export async function getUserHealthRecords(userId = "default"): Promise<HealthRecord[]> {
  try {
    const data = await getHealthData()
    return data.healthRecords.filter((record) => record.userId === userId)
  } catch (error) {
    console.error("Error fetching user records:", error)
    return []
  }
}
