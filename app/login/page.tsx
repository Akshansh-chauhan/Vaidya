"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity, Mail, Lock, Loader2, ArrowRight, Heart, TrendingUp } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const supabase = getSupabaseClient()

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess("Check your email to confirm your account, then log in!")
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/scan")
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* ——— Left Panel: Background Image with glass overlays ——— */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 p-10 max-w-md">
          {/* Floating glass health cards over the image */}
          <div className="glass-card-dark p-6 mb-5 anim-float">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-white/70">Recovery Score</span>
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>87</span>
              <span className="text-emerald-400 font-bold text-xl mb-1">%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all" style={{ width: '87%' }} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="glass-card-dark p-4 flex-1 anim-float-reverse">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px] font-bold text-white/50">HRV</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>65.1 <span className="text-xs font-medium text-white/40">ms</span></p>
            </div>
            <div className="glass-card-dark p-4 flex-1 anim-float">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-bold text-white/50">BPM</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>52</p>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Right Panel: Auth Form ——— */}
      <div className="flex-1 flex items-center justify-center px-6 bg-[#fafafa] relative">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-10 anim-fade-up">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Vaidya</h1>
            <p className="text-zinc-500 mt-1.5 text-[15px]">Your AI Health Companion</p>
          </div>

          <div className="card-elevated p-8 sm:p-10 anim-fade-up anim-delay-1">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-zinc-500 text-[15px] mt-1.5">
                {isSignUp ? "Sign up to start your health journey" : "Sign in to access your health dashboard"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-0.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-xl h-12 focus:border-zinc-400 focus:ring-zinc-200 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-0.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-xl h-12 focus:border-zinc-400 focus:ring-zinc-200 transition-all"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-100">{error}</div>
              )}
              {success && (
                <div className="text-sm text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">{success}</div>
              )}

              <Button type="submit" className="w-full h-12 text-[15px] mt-2 shadow-[0_4px_14px_rgba(0,0,0,0.1)]" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center pt-5 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess("") }}
                className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
                disabled={loading}
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-8 max-w-xs mx-auto leading-relaxed">
            By continuing, you agree to use Vaidya for informational purposes only.
            <br />Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
