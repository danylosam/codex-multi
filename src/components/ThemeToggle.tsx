"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={!mounted}
      aria-label={mounted ? `Ativar tema ${isDark ? "claro" : "escuro"}` : "Alternar tema"}
      title={mounted ? `Tema ${isDark ? "escuro" : "claro"}` : "Alternar tema"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 rounded-xl text-muted-foreground"
    >
      {isDark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
