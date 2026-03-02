import { Loader2, Scan } from "lucide-react"

export default function ScanLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/30 to-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <Scan className="w-16 h-16 text-primary/20 mx-auto" />
          <Loader2 className="w-8 h-8 animate-spin text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Loading Health Scanner</h2>
          <p className="text-muted-foreground">Initializing AI analysis tools...</p>
        </div>
      </div>
    </div>
  )
}
