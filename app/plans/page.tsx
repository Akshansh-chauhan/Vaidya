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

const healthPlans: HealthPlan[] = [
  {
    category: "posture",
    title: "Posture Correction Program",
    description: "Comprehensive exercises and habits to improve spinal alignment and reduce postural strain",
    icon: Activity,
    exercises: [
      {
        id: "p1",
        name: "Chin Tuck Exercise",
        duration: "2-3 minutes",
        difficulty: "beginner",
        frequency: "3 times daily",
        instructions: [
          "Sit or stand with your back straight",
          "Look straight ahead, keeping your shoulders relaxed",
          "Slowly pull your chin back, creating a double chin",
          "Hold for 5 seconds, then relax",
          "Repeat 10-15 times",
        ],
        benefits: ["Strengthens deep neck flexors", "Reduces forward head posture", "Alleviates neck tension"],
      },
      {
        id: "p2",
        name: "Wall Angels",
        duration: "5 minutes",
        difficulty: "beginner",
        frequency: "2 times daily",
        instructions: [
          "Stand with your back against a wall",
          "Place your arms against the wall in a 'W' position",
          "Slowly slide your arms up and down the wall",
          "Keep your back and arms in contact with the wall",
          "Perform 15-20 repetitions",
        ],
        benefits: ["Improves shoulder mobility", "Strengthens upper back muscles", "Corrects rounded shoulders"],
      },
      {
        id: "p3",
        name: "Cat-Cow Stretch",
        duration: "3-4 minutes",
        difficulty: "beginner",
        frequency: "Morning and evening",
        instructions: [
          "Start on hands and knees in tabletop position",
          "Arch your back and look up (Cow pose)",
          "Round your spine and tuck your chin (Cat pose)",
          "Move slowly between positions",
          "Repeat 10-15 times",
        ],
        benefits: ["Increases spinal flexibility", "Relieves back tension", "Improves posture awareness"],
      },
    ],
    tips: [
      "Set up an ergonomic workstation with monitor at eye level",
      "Take breaks every 30 minutes to stand and stretch",
      "Use a lumbar support cushion when sitting",
      "Sleep with a supportive pillow that maintains neck alignment",
      "Practice mindful posture checks throughout the day",
    ],
    goals: [
      "Reduce forward head posture by 50% in 4 weeks",
      "Eliminate daily neck and shoulder pain",
      "Improve spinal alignment and core strength",
      "Develop sustainable postural habits",
    ],
  },
  {
    category: "skin",
    title: "Dermatology Care Plan",
    description: "Evidence-based skincare routines and protective measures for optimal skin health",
    icon: Scan,
    exercises: [
      {
        id: "s1",
        name: "Daily Skincare Routine",
        duration: "10-15 minutes",
        difficulty: "beginner",
        frequency: "Twice daily",
        instructions: [
          "Cleanse with gentle, pH-balanced cleanser",
          "Apply vitamin C serum in the morning",
          "Use retinol or retinoid in the evening (start 2x/week)",
          "Apply broad-spectrum SPF 30+ sunscreen daily",
          "Moisturize with ceramide-containing products",
        ],
        benefits: ["Prevents premature aging", "Protects against UV damage", "Maintains skin barrier function"],
      },
      {
        id: "s2",
        name: "Weekly Exfoliation",
        duration: "5 minutes",
        difficulty: "intermediate",
        frequency: "1-2 times weekly",
        instructions: [
          "Use chemical exfoliant (AHA/BHA) in the evening",
          "Start with lower concentrations (5-10%)",
          "Apply to clean, dry skin",
          "Follow with moisturizer",
          "Always use sunscreen the next day",
        ],
        benefits: ["Removes dead skin cells", "Improves skin texture", "Enhances product absorption"],
      },
      {
        id: "s3",
        name: "Monthly Skin Assessment",
        duration: "15 minutes",
        difficulty: "beginner",
        frequency: "Monthly",
        instructions: [
          "Examine skin in good lighting using a mirror",
          "Check for new moles or changes in existing ones",
          "Look for asymmetry, irregular borders, color changes",
          "Document any concerns with photos",
          "Schedule dermatologist visit if needed",
        ],
        benefits: ["Early detection of skin changes", "Monitors treatment progress", "Maintains skin health awareness"],
      },
    ],
    tips: [
      "Wear protective clothing and wide-brimmed hats outdoors",
      "Avoid peak sun hours (10 AM - 4 PM) when possible",
      "Stay hydrated with 8+ glasses of water daily",
      "Eat antioxidant-rich foods (berries, leafy greens)",
      "Get adequate sleep (7-9 hours) for skin repair",
    ],
    goals: [
      "Establish consistent daily skincare routine",
      "Achieve 100% daily sun protection compliance",
      "Reduce signs of photoaging and improve skin texture",
      "Maintain regular dermatological monitoring",
    ],
  },
  {
    category: "eye",
    title: "Eye Health Optimization",
    description: "Comprehensive eye care exercises and habits to maintain and improve vision health",
    icon: Eye,
    exercises: [
      {
        id: "e1",
        name: "20-20-20 Rule",
        duration: "20 seconds",
        difficulty: "beginner",
        frequency: "Every 20 minutes",
        instructions: [
          "Set a timer for every 20 minutes during screen work",
          "Look at an object 20 feet away",
          "Focus on the distant object for 20 seconds",
          "Blink several times to refresh your eyes",
          "Return to your work with refreshed vision",
        ],
        benefits: ["Reduces digital eye strain", "Prevents dry eyes", "Maintains focusing flexibility"],
      },
      {
        id: "e2",
        name: "Eye Movement Exercises",
        duration: "5 minutes",
        difficulty: "beginner",
        frequency: "2-3 times daily",
        instructions: [
          "Sit comfortably and look straight ahead",
          "Slowly move eyes up and down 10 times",
          "Move eyes left and right 10 times",
          "Make clockwise circles 5 times",
          "Make counter-clockwise circles 5 times",
        ],
        benefits: ["Strengthens eye muscles", "Improves eye coordination", "Reduces eye fatigue"],
      },
      {
        id: "e3",
        name: "Palming Relaxation",
        duration: "3-5 minutes",
        difficulty: "beginner",
        frequency: "As needed for eye strain",
        instructions: [
          "Rub your palms together to generate warmth",
          "Cup your palms over closed eyes without pressure",
          "Ensure complete darkness under your palms",
          "Breathe deeply and relax for 3-5 minutes",
          "Slowly remove hands and open eyes",
        ],
        benefits: [
          "Deeply relaxes eye muscles",
          "Reduces eye strain and tension",
          "Improves blood circulation to eyes",
        ],
      },
    ],
    tips: [
      "Maintain proper lighting when reading or working",
      "Position screens 20-26 inches from your eyes",
      "Use artificial tears if you experience dry eyes",
      "Eat foods rich in omega-3s, lutein, and zeaxanthin",
      "Get regular comprehensive eye exams",
    ],
    goals: [
      "Eliminate digital eye strain symptoms",
      "Maintain optimal tear film and eye moisture",
      "Preserve and enhance visual acuity",
      "Prevent age-related eye conditions",
    ],
  },
  {
    category: "mental",
    title: "Mental Wellness Program",
    description: "Evidence-based practices for stress management, emotional regulation, and mental resilience",
    icon: Brain,
    exercises: [
      {
        id: "m1",
        name: "Mindfulness Meditation",
        duration: "10-20 minutes",
        difficulty: "beginner",
        frequency: "Daily",
        instructions: [
          "Find a quiet, comfortable place to sit",
          "Close your eyes and focus on your breath",
          "Notice when your mind wanders and gently return focus to breathing",
          "Start with 5 minutes and gradually increase duration",
          "Use guided meditation apps if helpful",
        ],
        benefits: ["Reduces stress and anxiety", "Improves emotional regulation", "Enhances focus and concentration"],
      },
      {
        id: "m2",
        name: "Progressive Muscle Relaxation",
        duration: "15-20 minutes",
        difficulty: "beginner",
        frequency: "3-4 times weekly",
        instructions: [
          "Lie down in a comfortable position",
          "Tense and then relax each muscle group for 5 seconds",
          "Start with your toes and work up to your head",
          "Focus on the contrast between tension and relaxation",
          "End with deep breathing and full-body relaxation",
        ],
        benefits: ["Reduces physical tension", "Promotes better sleep", "Increases body awareness"],
      },
      {
        id: "m3",
        name: "Gratitude Journaling",
        duration: "5-10 minutes",
        difficulty: "beginner",
        frequency: "Daily (evening)",
        instructions: [
          "Write down 3 things you're grateful for each day",
          "Be specific about why you're grateful",
          "Include both big and small positive experiences",
          "Reflect on how these things made you feel",
          "Review past entries weekly to reinforce positive patterns",
        ],
        benefits: [
          "Improves mood and life satisfaction",
          "Reduces negative thinking patterns",
          "Enhances overall well-being",
        ],
      },
    ],
    tips: [
      "Maintain a consistent sleep schedule (7-9 hours nightly)",
      "Limit caffeine intake, especially in the afternoon",
      "Engage in regular physical exercise (30 minutes daily)",
      "Practice saying 'no' to prevent overcommitment",
      "Seek professional help when needed - therapy is beneficial",
    ],
    goals: [
      "Develop daily stress management practices",
      "Improve emotional awareness and regulation",
      "Build resilience to life's challenges",
      "Maintain optimal mental health and well-being",
    ],
  },
]

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState("posture")
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [timerActive, setTimerActive] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)

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
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Nidan AI</span>
              </div>
            </div>
            <Button asChild>
              <Link href="/scan">New Scan</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Health Improvement Plans</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Personalized exercise routines and lifestyle recommendations to address your health concerns and optimize
            your well-being
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Your Progress</span>
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
                      {completed}/{total} exercises
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
                        Program Goals
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
                        Lifestyle Tips
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
                  <CardTitle>Exercise Program</CardTitle>
                  <CardDescription>Follow these exercises regularly for optimal results</CardDescription>
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
                                    className={`w-4 h-4 ${
                                      completedExercises.has(exercise.id)
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
                                {exercise.difficulty}
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
                              <h4 className="font-semibold mb-2">Instructions</h4>
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
                                <p className="text-sm font-medium mb-1">Frequency</p>
                                <p className="text-sm text-muted-foreground">{exercise.frequency}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Benefits</h4>
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
                                      Mark Incomplete
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Mark Complete
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
