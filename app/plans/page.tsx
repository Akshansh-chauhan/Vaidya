"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, ArrowLeft, Clock, Target, CheckCircle, RotateCcw, Check } from "lucide-react"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"
import { getPlansTranslations } from "@/lib/mock-data-translations"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

interface Exercise {
  id: string
  name: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  instructions: string[]
  benefits: string[]
  frequency: string
}

interface HealthPlan {
  category: "posture" | "skin" | "eye" | "mental"
  title: string
  description: string
  icon: any
  exercises: Exercise[]
  tips: string[]
  goals: string[]
}

export default function PlansPage() {
  const [lang] = useLanguage()
  const t = getSubPageTranslations(lang)
  const pt = getPlansTranslations(lang)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posture")
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [isNavVisible, setIsNavVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isNearTop = currentScrollY < 30

      if (isNearTop) {
        setIsNavVisible(true)
      } else if (currentScrollY > lastScrollY + 8) {
        setIsNavVisible(false)
      } else if (currentScrollY < lastScrollY - 8) {
        setIsNavVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Load completed exercises from Supabase on mount
  useEffect(() => {
    async function loadProgress() {
      if (!user) return
      try {
        const token = (await getSupabaseClient().auth.getSession()).data.session?.access_token
        const res = await fetch("/api/exercise-progress", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        })
        if (res.ok) {
          const data = await res.json()
          setCompletedExercises(new Set(data.completed || []))
        }
      } catch (error) {
        console.error("Failed to load exercise progress:", error)
      }
    }
    if (!authLoading && user) {
      loadProgress()
    }
  }, [user, authLoading])

  const toggleExerciseComplete = useCallback(async (exerciseId: string) => {
    const isCurrentlyCompleted = completedExercises.has(exerciseId)
    const newCompleted = new Set(completedExercises)

    // Optimistic update
    if (isCurrentlyCompleted) {
      newCompleted.delete(exerciseId)
    } else {
      newCompleted.add(exerciseId)
    }
    setCompletedExercises(newCompleted)

    // Persist to Supabase
    try {
      const token = (await getSupabaseClient().auth.getSession()).data.session?.access_token
      await fetch("/api/exercise-progress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          exerciseId,
          completed: !isCurrentlyCompleted,
        }),
      })
    } catch (error) {
      console.error("Failed to save exercise progress:", error)
      // Revert on failure
      const reverted = new Set(completedExercises)
      setCompletedExercises(reverted)
    }
  }, [completedExercises])

  const healthPlans: HealthPlan[] = [
    { category: "posture", title: pt.posture.title, description: pt.posture.description, icon: Activity, exercises: pt.posture.exercises.map((e, i) => ({ id: `p${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "beginner", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.posture.tips, goals: pt.posture.goals },
    { category: "skin", title: pt.skin.title, description: pt.skin.description, icon: Scan, exercises: pt.skin.exercises.map((e, i) => ({ id: `s${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "intermediate", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.skin.tips, goals: pt.skin.goals },
    { category: "eye", title: pt.eye.title, description: pt.eye.description, icon: Eye, exercises: pt.eye.exercises.map((e, i) => ({ id: `e${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "beginner", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.eye.tips, goals: pt.eye.goals },
    { category: "mental", title: pt.mental.title, description: pt.mental.description, icon: Brain, exercises: pt.mental.exercises.map((e, i) => ({ id: `m${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "beginner", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.mental.tips, goals: pt.mental.goals },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-emerald-50 text-emerald-700"
      case "intermediate": return "bg-amber-50 text-amber-700"
      case "advanced": return "bg-rose-50 text-rose-700"
      default: return "bg-zinc-50 text-zinc-700"
    }
  }

  const activePlan = healthPlans.find((plan) => plan.category === activeTab)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-between items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto anim-fade-up pointer-events-none">
        
        {/* Left Side: Tight Pill mimicking Scan Page */}
        <nav
          className={`pointer-events-auto nav-glass rounded-full px-3 py-2 flex items-center gap-3 transition-all duration-300 ${
            isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}
        >
          <Button variant="ghost" size="sm" asChild className="text-zinc-600 hover:text-zinc-900 hover:bg-white/40">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {t.common.backHome}
            </Link>
          </Button>
          <div className="w-px h-5 bg-zinc-200/60" />
          <Link href="/" className="flex items-center gap-2 pr-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>Vaidya</span>
          </Link>
        </nav>

        {/* Right Side: New Scan Button */}
        <div className={`pointer-events-auto pt-1.5 transition-all duration-300 ${
            isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          }`}>
          <Button size="sm" asChild className="shadow-[0_4px_14px_rgba(0,0,0,0.1)]">
            <Link href="/scan">{t.common.newScan}</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        {/* Header */}
        <div className="text-center mb-12 anim-fade-up">
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-[-0.02em] mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>{t.plans.heading}</h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">{t.plans.subtitle}</p>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 anim-fade-up anim-delay-1">
          {healthPlans.map((plan) => {
            const completed = plan.exercises.filter((ex) => completedExercises.has(ex.id)).length
            const total = plan.exercises.length
            const percentage = total > 0 ? (completed / total) * 100 : 0

            return (
              <button
                key={plan.category}
                onClick={() => setActiveTab(plan.category)}
                className={`card-elevated p-5 text-left cursor-pointer transition-all ${activeTab === plan.category ? "ring-2 ring-zinc-900 ring-offset-2" : ""}`}
              >
                <div className="w-9 h-9 bg-zinc-50 rounded-xl flex items-center justify-center mb-4">
                  <plan.icon className="w-4 h-4 text-zinc-600" />
                </div>
                <h4 className="font-semibold text-zinc-900 mb-2 text-sm">{plan.title.split(" ")[0]}</h4>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
                  <div className="bg-zinc-900 h-1.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                </div>
                <p className="text-[12px] text-zinc-400 font-medium">
                  {completed}/{total} {t.plans.exercises}
                </p>
              </button>
            )
          })}
        </div>

        {/* Active Plan Content */}
        {activePlan && (
          <div className="space-y-6 anim-fade-up anim-delay-2">
            {/* Overview */}
            <div className="card-elevated p-8 sm:p-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-zinc-900 mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>{activePlan.title}</h2>
                  <p className="text-zinc-500 text-[15px] leading-relaxed mb-6">{activePlan.description}</p>

                  <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-zinc-400" />
                    {t.plans.goals}
                  </h3>
                  <ul className="space-y-2.5">
                    {activePlan.goals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-600">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-px bg-zinc-100 hidden md:block" />

                <div className="md:max-w-xs flex-1">
                  <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-zinc-400" />
                    {t.plans.tips}
                  </h3>
                  <div className="space-y-2.5">
                    {activePlan.tips.slice(0, 4).map((tip, index) => (
                      <div key={index} className="bg-zinc-50 rounded-xl p-3.5 text-[14px] text-zinc-600 leading-relaxed border border-zinc-100">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises */}
            <div className="card-elevated p-8 sm:p-10">
              <h3 className="text-xl font-semibold text-zinc-900 mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>{t.plans.exerciseProgram}</h3>
              <p className="text-zinc-500 text-sm mb-6">{t.plans.exerciseDesc}</p>

              <Accordion type="single" collapsible className="space-y-3">
                {activePlan.exercises.map((exercise) => {
                  const isCompleted = completedExercises.has(exercise.id)
                  return (
                    <AccordionItem key={exercise.id} value={exercise.id} className="border border-zinc-100 rounded-2xl px-5 bg-zinc-50/50 data-[state=open]:bg-white data-[state=open]:shadow-sm transition-all">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExerciseComplete(exercise.id)
                              }}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${isCompleted ? "bg-zinc-900 border-zinc-900" : "border-zinc-300 hover:border-zinc-400"}`}
                            >
                              {isCompleted && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </button>
                            <span className={`font-medium text-[15px] transition-colors ${isCompleted ? "text-zinc-400 line-through" : "text-zinc-900"}`}>{exercise.name}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                              {t.plans[exercise.difficulty as "beginner" | "intermediate" | "advanced"]}
                            </span>
                            <span className="flex items-center gap-1 text-[13px] text-zinc-400 font-medium">
                              <Clock className="w-3 h-3" />
                              {exercise.duration}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-5">
                        <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-zinc-900 mb-3 text-sm">{t.plans.instructions}</h4>
                            <ol className="space-y-3">
                              {exercise.instructions.map((instruction, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm">
                                  <span className="bg-zinc-100 text-zinc-600 rounded-lg w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="text-zinc-600 leading-relaxed">{instruction}</span>
                                </li>
                              ))}
                            </ol>

                            <div className="mt-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
                              <p className="text-xs font-semibold text-zinc-500 mb-1">{t.plans.frequency}</p>
                              <p className="text-sm text-zinc-700">{exercise.frequency}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-zinc-900 mb-3 text-sm">{t.plans.benefits}</h4>
                            <ul className="space-y-2.5 mb-6">
                              {exercise.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-zinc-600">{benefit}</span>
                                </li>
                              ))}
                            </ul>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExerciseComplete(exercise.id)}
                              className="w-full"
                            >
                              {completedExercises.has(exercise.id) ? (
                                <>
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  {t.plans.markIncomplete}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {t.plans.markComplete}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
