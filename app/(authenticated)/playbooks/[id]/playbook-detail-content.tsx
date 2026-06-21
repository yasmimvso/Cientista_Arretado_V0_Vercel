"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  ArrowLeft,
  Target,
  AlertCircle,
  CheckCircle2,
  Users,
  FileText,
  Lightbulb,
  Download,
  Edit,
  Play,
  Clock,
  ChevronRight,
  Printer
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { playbooks, type Playbook } from "@/lib/data"

interface PlaybookDetailContentProps {
  playbookId: string
}

export default function PlaybookDetailContent({ playbookId }: PlaybookDetailContentProps) {
  const router = useRouter()

  const playbook = useMemo(() => {
    return playbooks.find(p => p.id === playbookId)
  }, [playbookId])

  if (!playbook) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <BookOpen className="size-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Playbook não encontrado</h2>
        <p className="mt-2 text-muted-foreground">O playbook solicitado não existe ou foi removido.</p>
        <Button className="mt-6" onClick={() => router.push("/playbooks")}>
          <ArrowLeft className="mr-2 size-4" />
          Voltar para Playbooks
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: Playbook["status"]) => {
    switch (status) {
      case "ativo": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "inativo": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "em_revisao": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    }
  }

  const getStatusLabel = (status: Playbook["status"]) => {
    switch (status) {
      case "ativo": return "Ativo"
      case "inativo": return "Inativo"
      case "em_revisao": return "Em revisão"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/playbooks" className="hover:text-foreground">
          Playbooks
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{playbook.nome}</span>
      </div>

      {/* Cabeçalho principal */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getStatusColor(playbook.status)}>
                {getStatusLabel(playbook.status)}
              </Badge>
              <span className="font-mono text-sm text-muted-foreground">
                {playbook.codigo}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{playbook.nome}</h1>
            <p className="mt-1 text-muted-foreground">{playbook.descricao}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 size-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 size-4" />
            Editar
          </Button>
          <Button size="sm">
            <Play className="mr-2 size-4" />
            Aplicar
          </Button>
        </div>
      </div>

      {/* Informações gerais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Target className="size-4 text-primary" />
              Objetivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{playbook.objetivo}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="size-4 text-amber-500" />
              Condição de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{playbook.condicaoUso}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4 text-blue-500" />
              Tipo de Crime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">
              {playbook.tipoCrime}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Passos do procedimento - coluna maior */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" />
                Passos do Procedimento
              </CardTitle>
              <CardDescription>
                Siga os passos abaixo na ordem indicada para execução correta do procedimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {playbook.passos.map((passo, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{passo.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <CheckCircle2 className="size-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Informações adicionais - coluna lateral */}
        <div className="space-y-4">
          {/* Responsáveis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-blue-500" />
                Responsáveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {playbook.responsaveis.map((resp, i) => (
                  <Badge key={i} variant="secondary">
                    {resp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diligências sugeridas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4 text-amber-500" />
                Diligências Sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {playbook.diligenciasSugeridas.map((dilig, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>{dilig}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Documentos relacionados */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-emerald-500" />
                Documentos Relacionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {playbook.documentos.map((doc, i) => (
                  <Link 
                    key={i} 
                    href={`/minutas?tipo=${doc.toLowerCase().replace(/\s+/g, '_')}`}
                    className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="flex-1">{doc}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botão voltar */}
      <div className="flex justify-start pt-4">
        <Button variant="outline" onClick={() => router.push("/playbooks")}>
          <ArrowLeft className="mr-2 size-4" />
          Voltar para Playbooks
        </Button>
      </div>
    </div>
  )
}
