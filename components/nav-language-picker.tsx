"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"
import { LANGUAGE_NAMES, type Language } from "@/lib/translations"
import { useLanguage } from "@/lib/use-language"

export function NavLanguagePicker() {
    const [lang, setLang] = useLanguage()
    const [open, setOpen] = useState(false)
    const [showScrollHint, setShowScrollHint] = useState(true)
    const ref = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const handleScroll = () => {
        if (!listRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = listRef.current
        setShowScrollHint(scrollTop + clientHeight < scrollHeight - 8)
    }

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 bg-transparent hover:bg-secondary/50 transition-colors text-sm font-medium cursor-pointer"
            >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">{LANGUAGE_NAMES[lang]}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-[100] overflow-hidden">
                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        className="nav-lang-scroll py-1 max-h-56 overflow-y-auto"
                        style={{ scrollbarWidth: "none" }}
                    >
                        <style>{`.nav-lang-scroll::-webkit-scrollbar { display: none; }`}</style>
                        {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
                            <button
                                key={code}
                                onClick={() => { setLang(code); setOpen(false) }}
                                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-secondary/60 transition-colors ${lang === code ? "bg-secondary/40 font-medium" : ""
                                    }`}
                            >
                                {LANGUAGE_NAMES[code]}
                                {lang === code && <Check className="w-3.5 h-3.5 text-primary" />}
                            </button>
                        ))}
                    </div>
                    {showScrollHint && (
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1 pt-4 bg-gradient-to-t from-card via-card/90 to-transparent pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
