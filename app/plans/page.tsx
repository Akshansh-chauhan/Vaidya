"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Activity, Eye, Scan, Brain, ArrowLeft, Clock, Target, CheckCircle, RotateCcw } from "lucide-react"
import { useLanguage } from "@/lib/use-language"
import { getSubPageTranslations } from "@/lib/sub-translations"
import { getPlansTranslations } from "@/lib/mock-data-translations"

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
  const [activeTab, setActiveTab] = useState("posture")
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [timerActive, setTimerActive] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const healthPlans: HealthPlan[] = [
    { category: "posture", title: pt.posture.title, description: pt.posture.description, icon: Activity, exercises: pt.posture.exercises.map((e, i) => ({ id: `p${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "beginner", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.posture.tips, goals: pt.posture.goals },
    { category: "skin", title: pt.skin.title, description: pt.skin.description, icon: Scan, exercises: pt.skin.exercises.map((e, i) => ({ id: `s${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "intermediate", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.skin.tips, goals: pt.skin.goals },
    { category: "eye", title: pt.eye.title, description: pt.eye.description, icon: Eye, exercises: pt.eye.exercises.map((e, i) => ({ id: `e${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "beginner", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.eye.tips, goals: pt.eye.goals },
    { category: "mental", title: pt.mental.title, description: pt.mental.description, icon: Brain, exercises: pt.mental.exercises.map((e, i) => ({ id: `m${i + 1}`, name: e.name, duration: e.duration, difficulty: (["beginner", "beginner", "beginner"] as const)[i], instructions: e.instructions, benefits: e.benefits, frequency: e.frequency })), tips: pt.mental.tips, goals: pt.mental.goals },
  ]

  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises)
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId)
    } else {
      newCompleted.add(exerciseId)
    }
    setCompletedExercises(newCompleted)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "secondary"
      case "intermediate":
        return "default"
      case "advanced":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const activePlan = healthPlans.find((plan) => plan.category === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.common.backHome}
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Vaidya</span>
              </div>
            </div>
            <Button asChild>
              <Link href="/scan">{t.common.newScan}</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t.plans.heading}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.plans.subtitle}</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>{t.plans.progress}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {healthPlans.map((plan) => {
                const completed = plan.exercises.filter((ex) => completedExercises.has(ex.id)).length
                const total = plan.exercises.length
                const percentage = total > 0 ? (completed / total) * 100 : 0

                return (
                  <div key={plan.category} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <plan.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{plan.title.split(" ")[0]}</h3>
                    <Progress value={percentage} className="h-2 mb-1" />
                    <p className="text-sm text-muted-foreground">
                      {completed}/{total} {t.plans.exercises}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Plans Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {healthPlans.map((plan) => (
              <TabsTrigger key={plan.category} value={plan.category} className="flex items-center space-x-2">
                <plan.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{plan.title.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {healthPlans.map((plan) => (
            <TabsContent key={plan.category} value={plan.category} className="space-y-6">
              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <plan.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{plan.title}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Goals */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        {t.plans.goals}
                      </h3>
                      <ul className="space-y-2">
                        {plan.goals.map((goal, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        {t.plans.tips}
                      </h3>
                      <ul className="space-y-2">
                        {plan.tips.slice(0, 4).map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exercises */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.plans.exerciseProgram}</CardTitle>
                  <CardDescription>{t.plans.exerciseDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {plan.exercises.map((exercise, index) => (
                      <AccordionItem key={exercise.id} value={exercise.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full mr-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleExerciseComplete(exercise.id)
                                  }}
                                  className="p-1 h-6 w-6"
                                >
                                  <CheckCircle
                                    className={`w-4 h-4 ${completedExercises.has(exercise.id)
                                      ? "text-accent fill-accent"
                                      : "text-muted-foreground"
                                      }`}
                                  />
                                </Button>
                                <span className="font-medium">{exercise.name}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getDifficultyColor(exercise.difficulty) as any} className="text-xs">
                                {t.plans[exercise.difficulty as "beginner" | "intermediate" | "advanced"]}
                              </Badge>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{exercise.duration}</span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">{t.plans.instructions}</h4>
                              <ol className="space-y-2">
                                {exercise.instructions.map((instruction, idx) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <span>{instruction}</span>
                                  </li>
                                ))}
                              </ol>

                              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">{t.plans.frequency}</p>
                                <p className="text-sm text-muted-foreground">{exercise.frequency}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">{t.plans.benefits}</h4>
                              <ul className="space-y-2 mb-4">
                                {exercise.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleExerciseComplete(exercise.id)}
                                  className="flex-1"
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
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
