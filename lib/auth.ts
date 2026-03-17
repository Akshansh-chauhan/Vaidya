import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server"

// Server-side: extract user ID from the Supabase access token in the request
export async function getAuthUserId(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return "default"
  }

  const token = authHeader.split(" ")[1]
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return "default"
  }

  return user.id
}
