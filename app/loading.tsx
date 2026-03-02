import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/30 to-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Loading Nidan AI</h2>
          <p className="text-muted-foreground">Preparing your health assistant...</p>
        </div>
      </div>
    </div>
  )
}
