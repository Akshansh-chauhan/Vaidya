"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { Language } from "@/lib/translations"

function getLanguage(): Language {
    if (typeof window === "undefined") return "en"
    return (sessionStorage.getItem("preferred-language") as Language) || "en"
}

function subscribe(cb: () => void) {
    window.addEventListener("storage", cb)
    return () => window.removeEventListener("storage", cb)
}

export function useLanguage() {
    const lang = useSyncExternalStore(subscribe, getLanguage, () => "en" as Language)

    const setLang = useCallback((code: Language) => {
        sessionStorage.setItem("preferred-language", code)
        // Force re-render in current tab
        window.dispatchEvent(new Event("storage"))
    }, [])

    return [lang, setLang] as const
}
