"use client"

import { useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Bell,
  Moon,
  Sun,
  Filter,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { delegacias } from "@/lib/data"
import { useTheme } from "@/components/theme-provider"

const naturezas = [
  "EXTRAVIO",
  "FURTO",
  "ROUBO",
  "ESTELIONATO",
  "FURTO QUALIFICADO",
  "AMEAÇA"
]

// Simular delegacia do usuário logado (em produção viria do auth context)
const delegaciaUsuario = delegacias[1] // 1ª Delegacia de Jaboatão

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()

  // Bairros disponíveis são os da área de abrangência da delegacia do usuário
  const bairrosDisponiveis = useMemo(() => {
    return delegaciaUsuario?.bairrosAbrangencia || []
  }, [])

  const bairro = searchParams.get("bairro") || ""
  const natureza = searchParams.get("natureza") || ""
  const periodo = searchParams.get("periodo") || ""

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const activeFilters = [bairro, natureza, periodo].filter(Boolean).length

  return (
    <header className="sticky top-0 z-40 flex h-[68px] shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Indicador da delegacia do usuário */}
      <div className="hidden shrink-0 items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm lg:flex">
        <Building2 className="size-3.5 shrink-0 text-primary" />
        <span className="shrink-0 font-medium text-primary">{delegaciaUsuario?.codigo}</span>
        <span className="hidden text-muted-foreground xl:inline">|</span>
        <span className="hidden truncate text-muted-foreground xl:inline">{delegaciaUsuario?.nome}</span>
      </div>

      {/* Filtros rápidos - visíveis em desktop, escondidos no dashboard */}
      {pathname !== "/dashboard" && (
        <>
          <Separator orientation="vertical" className="mx-2 hidden h-4 lg:block" />

          <div className="hidden items-center gap-2 lg:flex">
            <Select value={bairro || "all"} onValueChange={(v) => updateFilter("bairro", v)}>
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {bairrosDisponiveis.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={natureza || "all"} onValueChange={(v) => updateFilter("natureza", v)}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="Natureza" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas naturezas</SelectItem>
                {naturezas.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={periodo || "all"} onValueChange={(v) => updateFilter("periodo", v)}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo período</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão de filtros para mobile */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 lg:hidden">
                <Filter className="size-4" />
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="start">
              <div className="space-y-3">
                {/* Indicador da delegacia do usuário no mobile */}
                <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-2 text-sm">
                  <Building2 className="size-3.5 text-primary" />
                  <span className="font-medium text-primary">{delegaciaUsuario?.codigo}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-xs text-muted-foreground">{delegaciaUsuario?.nome}</span>
                </div>

                <Select value={bairro || "all"} onValueChange={(v) => updateFilter("bairro", v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os bairros</SelectItem>
                    {bairrosDisponiveis.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={natureza || "all"} onValueChange={(v) => updateFilter("natureza", v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Natureza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas naturezas</SelectItem>
                    {naturezas.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={periodo || "all"} onValueChange={(v) => updateFilter("periodo", v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo período</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}

      {/* Spacer */}
      <div className="ml-auto" />

      {/* Ações */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-8">
              <Bell className="size-4" />
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <h4 className="font-medium">Notificações</h4>
              <div className="space-y-2">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Novo caso detectado</p>
                  <p className="text-xs text-muted-foreground">BO 64I0319198007 com padrão recorrente</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">BO pronto para análise</p>
                  <p className="text-xs text-muted-foreground">Score de maturação: 95%</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Prazo próximo do limite</p>
                  <p className="text-xs text-muted-foreground">IPL-2025-0001 vence em 5 dias</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </div>
    </header>
  )
}
