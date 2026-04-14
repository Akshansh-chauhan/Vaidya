import { NextRequest, NextResponse } from "next/server"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { getAuthContext } from "@/lib/auth"

function getSupabase(accessToken: string): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

// GET: Fetch completed exercises for a user
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await getSupabase(auth.accessToken)
      .from("exercise_progress")
      .select("exercise_id")
      .eq("user_id", auth.userId)

    if (error) {
      console.error("Error fetching exercise progress:", error.message)
      return NextResponse.json({ completed: [] })
    }

    const completed = (data || []).map((row: any) => row.exercise_id)
    return NextResponse.json({ completed })
  } catch (error) {
    console.error("Exercise progress API error:", error)
    return NextResponse.json({ completed: [] })
  }
}

// POST: Toggle an exercise's completion status
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { exerciseId, completed } = await request.json()

    if (completed) {
      // Mark as completed — insert
      await getSupabase(auth.accessToken).from("exercise_progress").upsert({
        id: `${auth.userId}-${exerciseId}`,
        user_id: auth.userId,
        exercise_id: exerciseId,
        completed_at: new Date().toISOString(),
      })
    } else {
      // Mark as incomplete — delete
      await getSupabase(auth.accessToken)
        .from("exercise_progress")
        .delete()
        .eq("user_id", auth.userId)
        .eq("exercise_id", exerciseId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Exercise progress save error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
