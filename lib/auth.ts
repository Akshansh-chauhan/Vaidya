import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server"

export interface AuthContext {
  userId: string
  accessToken: string
}

export function getAccessTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]?.trim()
  return token || null
}

// Server-side: extract user ID from the Supabase access token in the request
export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const token = getAccessTokenFromRequest(request)
  if (!token) {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase auth environment variables are not configured")
    return null
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { detectSessionInUrl: false }
  })
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return null
  }

  return user.id
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return null
  }

  const userId = await getAuthUserId(request)
  if (!userId) {
    return null
  }

  return { userId, accessToken }
}
