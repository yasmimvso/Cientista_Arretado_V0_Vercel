"use client"

import Link from "next/link"
import {
  FileSearch,
  Scale,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  ArrowUpRight,
  MapPin
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  boletinsOcorrencia,
  investigacoes,
  correlacoes,
  getMaturacaoColor,
  getMaturacaoLabel,
  getPrioridadeColor,
  getPrioridadeLabel
} from "@/lib/data"

// BOs prioritários (prontos para instauração)
const bosPrioritarios = boletinsOcorrencia
  .filter(bo => bo.scoreMaturacao >= 0.7)
  .sort((a, b) => b.scoreMaturacao - a.scoreMaturacao)
  .slice(0, 5)

// Incidência por bairro
const incidenciaPorBairro = boletinsOcorrencia.reduce((acc, bo) => {
  acc[bo.bairro] = (acc[bo.bairro] || 0) + 1
  return acc
}, {} as Record<string, number>)

const bairrosOrdenados = Object.entries(incidenciaPorBairro)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Cards de entrada principais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-all hover:border-primary hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <FileSearch className="size-6" />
              </div>
              <Link href="/cases?mode=infopol">
                <ArrowUpRight className="size-5 text-muted-foreground transition-transform hover:translate-x-0.5 hover:-translate-y-0.5 hover:text-primary" />
              </Link>
            </div>
            <CardTitle className="mt-4 text-xl">Padrão de recorrência InfoPol</CardTitle>
            <CardDescription className="text-sm">
              Análise pré-instauração de BOs com potencial de virar inquérito.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Clock className="size-3" />
                {bosPrioritarios.length} casos maduros
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="size-3" />
                {correlacoes.length} correlações
              </Badge>
            </div>
            <Link href="/cases?mode=infopol">
              <Button className="w-full" variant="default">
                Abrir página
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-all hover:border-primary hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Scale className="size-6" />
              </div>
              <Link href="/cases?mode=investigacao">
                <ArrowUpRight className="size-5 text-muted-foreground transition-transform hover:translate-x-0.5 hover:-translate-y-0.5 hover:text-primary" />
              </Link>
            </div>
            <CardTitle className="mt-4 text-xl">Investigação</CardTitle>
            <CardDescription className="text-sm">
              Casos já instaurados com timeline, diligências e minutas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <FileText className="size-3" />
                {investigacoes.length} inquéritos
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="size-3" />
                {investigacoes.filter(i => i.pendencias.length > 0).length} com pendências
              </Badge>
            </div>
            <Link href="/cases?mode=investigacao">
              <Button className="w-full" variant="default">
                Abrir página
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alertas contextuais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Novo padrão recorrente detectado
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Série de roubos identificada em Jaboatão com modus operandi similar.
            </p>
            <Link href="/cases?mode=infopol&tab=series">
              <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-amber-700 dark:text-amber-300">
                Ver série
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                BO pronto para análise
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              BO 64I0319198007 atingiu score de maturação de 95%.
            </p>
            <Link href="/cases/6">
              <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-blue-700 dark:text-blue-300">
                Sugerir procedimento
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-red-600 dark:text-red-400" />
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">
                Prazo próximo do limite
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 dark:text-red-400">
              IPL-2025-0001 vence em 5 dias. Relatório conclusivo pendente.
            </p>
            <Link href="/cases/1?tab=timeline">
              <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-red-700 dark:text-red-300">
                Ver timeline
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e prioridades */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Lista de prioridade */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Casos prioritários</CardTitle>
                <CardDescription>BOs com maior score de maturação</CardDescription>
              </div>
              <Link href="/cases?mode=infopol">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bosPrioritarios.map((bo) => (
                <div
                  key={bo.id}
                  className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{bo.bo}</span>
                      <Badge variant="outline" className="text-xs">
                        {bo.natureza}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{bo.delegacia}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {bo.bairro}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getMaturacaoColor(bo.maturacao)}>
                      {getMaturacaoLabel(bo.maturacao)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Score: {Math.round(bo.scoreMaturacao * 100)}%
                    </span>
                  </div>
                  <Link href={`/cases/${bo.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver caso
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incidência por bairro */}
        <Card>
          <CardHeader>
            <CardTitle>Incidência por bairro</CardTitle>
            <CardDescription>Distribuição de ocorrências</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bairrosOrdenados.map(([bairro, count]) => (
                <div key={bairro} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{bairro}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <Progress value={(count / boletinsOcorrencia.length) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investigações em andamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investigações em andamento</CardTitle>
              <CardDescription>Inquéritos instaurados recentemente</CardDescription>
            </div>
            <Link href="/pipeline">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver pipeline
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {investigacoes.map((inv) => (
              <div
                key={inv.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{inv.nome}</h4>
                    <p className="text-sm text-muted-foreground">{inv.codigo}</p>
                  </div>
                  <Badge className={getPrioridadeColor(inv.prioridade)}>
                    {getPrioridadeLabel(inv.prioridade)}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{inv.delegacia}</Badge>
                  <span>BO: {inv.boOrigem}</span>
                  {inv.bosVinculados.length > 0 && (
                    <span>+{inv.bosVinculados.length} vinculados</span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Responsável:</span>
                    <span className="text-xs font-medium">{inv.responsavel}</span>
                  </div>
                  <Link href={`/cases/${inv.boOrigem}`}>
                    <Button variant="ghost" size="sm">
                      Abrir investigação
                    </Button>
                  </Link>
                </div>
                {inv.pendencias.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {inv.pendencias.slice(0, 2).map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                    {inv.pendencias.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{inv.pendencias.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
