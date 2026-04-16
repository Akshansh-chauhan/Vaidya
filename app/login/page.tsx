"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Activity, Mail, Lock, Loader2, ArrowRight, Heart, TrendingUp, Eye, EyeOff } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pendingUser, setPendingUser] = useState<{ id: string; email: string; password: string } | null>(null)

  // Real-time Polling for Email Verification
  useEffect(() => {
    if (!pendingUser) return;
    
    const checkVerification = async () => {
      const supabase = getSupabaseClient()
      try {
        const { data: isVerified, error } = await supabase.rpc('check_user_verified', { p_user_id: pendingUser.id })
        
        if (isVerified === true) {
          // Success! Stop polling and silently start genuine login session
          clearInterval(intervalId)
          setSuccess("Email verified! Logging you in seamlessly...")
          
          const { error: signInError } = await supabase.auth.signInWithPassword({ 
            email: pendingUser.email, 
            password: pendingUser.password 
          })
          
          if (!signInError) {
             setPendingUser(null)
             router.push("/")
          } else {
             setError(signInError.message)
          }
        }
      } catch (err) {
        console.error("Polling error:", err)
      }
    }

    const intervalId = setInterval(checkVerification, 3000)
    return () => clearInterval(intervalId)
  }, [pendingUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const supabase = getSupabaseClient()

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/?flow=signup`
          }
        })
        if (error) throw error
        
        // Save the user data to state to activate the polling hook
        if (data.user?.id) {
           setPendingUser({ id: data.user.id, email, password })
        }
        
        setSuccess("Check your email to confirm your account... waiting for confirmation. (Do not close this tab)")
        // We purposefully DO NOT set isSignUp(false) so the form stays open while polling
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
      <div className="hidden md:flex md:flex-1 relative overflow-hidden items-center justify-center">
        {/* Optimized Desktop Background image */}
        <div className="absolute inset-0 -z-30">
          <Image 
            src="/login-bg.png" 
            alt="Login Background" 
            fill 
            priority 
            className="object-cover object-center" 
            quality={80}
          />
        </div>
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 p-10 max-w-md">
          {/* Floating glass health cards over the image */}
          <div className="glass-card-login p-6 mb-5 anim-float">
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
            <div className="glass-card-login p-4 flex-1 anim-float-reverse">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px] font-bold text-white/50">HRV</span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-outfit)' }}>65.1 <span className="text-xs font-medium text-white/40">ms</span></p>
            </div>
            <div className="glass-card-login p-4 flex-1 anim-float">
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
      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-8 sm:py-0 md:py-6 bg-[#fafafa] relative overflow-hidden">
        {/* Mobile-only Optimized full background image */}
        <div className="absolute inset-0 md:hidden z-0">
          <Image 
            src="/login-bg.png" 
            alt="Mobile Login Background" 
            fill 
            priority 
            className="object-cover object-center" 
            quality={80}
          />
        </div>
        <div className="absolute inset-0 bg-black/35 md:hidden" />

        <div className="relative z-10 w-full max-w-[400px] md:max-w-[360px]">
          <div className="mb-8 sm:mb-10 anim-fade-up flex items-center gap-4 md:flex-col md:gap-0 md:text-center md:mt-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shrink-0 md:mb-5">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white md:text-zinc-900" style={{ fontFamily: "var(--font-outfit)" }}>
                Vaidya
              </h1>
              <p className="mt-1.5 text-[15px] text-white/85 md:text-zinc-500">Your AI Health Companion</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 anim-fade-up anim-delay-1 rounded-[28px] border border-white/26 bg-white/22 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] md:rounded-[24px] md:border-zinc-100 md:bg-white md:backdrop-blur-0 md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-outfit)' }}>
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-zinc-700 md:text-zinc-500 text-[15px] mt-1.5">
                {isSignUp ? "Sign up to start your health journey" : "Sign in to access your health dashboard"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800 md:text-zinc-700 ml-0.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 md:text-zinc-400 w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/75 md:bg-zinc-50 border-zinc-300 md:border-zinc-200 text-zinc-900 placeholder:text-zinc-500 md:placeholder:text-zinc-400 rounded-xl h-12 focus:border-zinc-400 focus:ring-zinc-200 transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800 md:text-zinc-700 ml-0.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 md:text-zinc-400 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/75 md:bg-zinc-50 border-zinc-300 md:border-zinc-200 text-zinc-900 placeholder:text-zinc-500 md:placeholder:text-zinc-400 rounded-xl h-12 focus:border-zinc-400 focus:ring-zinc-200 transition-all"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 md:text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
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
                className="text-sm text-zinc-700 md:text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
                disabled={loading}
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-white md:text-zinc-400 mt-8 max-w-xs mx-auto leading-relaxed px-4 py-2 rounded-xl bg-black/20 md:bg-transparent md:px-0 md:py-0">
            By continuing, you agree to use Vaidya for informational purposes only.
            <br />Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
