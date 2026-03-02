"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"

const LANGUAGES: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    hi: "हिन्दी",
    zh: "中文",
    ja: "日本語",
    ar: "العربية",
    it: "Italiano",
    pt: "Português",
}

export function HomepageLanguageSwitch() {
    const [selected, setSelected] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("preferred-language") || "en"
        }
        return "en"
    })

    const handleChange = useCallback((code: string) => {
        setSelected(code)
        localStorage.setItem("preferred-language", code)
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{LANGUAGES[selected]}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
                {Object.entries(LANGUAGES).map(([code, name]) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => handleChange(code)}
                        className="flex items-center justify-between"
                    >
                        {name}
                        {selected === code && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
