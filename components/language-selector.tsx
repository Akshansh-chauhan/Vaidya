"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { SUPPORTED_LANGUAGES } from "@/lib/gemini"

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void
  currentLanguage?: string
}

export function LanguageSelector({ onLanguageChange, currentLanguage = "en" }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage)

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferred-language") || "en"
    setSelectedLanguage(savedLanguage)
    onLanguageChange(savedLanguage)
  }, [onLanguageChange])

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    localStorage.setItem("preferred-language", language)
    onLanguageChange(language)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          {SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={selectedLanguage === code ? "bg-accent" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
