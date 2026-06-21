"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Calendar,
  FileText,
  Eye,
  Rocket,
  Scale,
  Target,
  Check,
  Lightbulb,
  Pencil,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { boletinsOcorrencia } from "@/lib/data"

// Dados das séries (mesmo do cases-content)
const seriesCorrelacoes = [
  {
    id: "1",
    nome: "Série de Roubos - Moto Vermelha",
    tipo: "Roubo",
    status: "pre-inquerito" as const,
    descricao: "Padrão identificado de abordagens por dois indivíduos em motocicleta Honda CG vermelha.",
    bairros: ["Prazeres", "Piedade", "Candeias"],
    periodo: "Jan/2025 - Presente",
    modusOperandi: [
      "Dois indivíduos em moto Honda CG vermelha",
      "Um dos autores porta arma de fogo",
      "Abordagem rápida em vias públicas",
      "Alvos: pedestres com celular visível",
      "Horário preferencial: 18h-20h"
    ],
    bosRelacionados: ["64I0319198004", "64I0319198006", "64I0319198007"],
    evidenciasChave: [
      { tipo: "Veículo", valor: "Moto Honda CG vermelha - Placa parcial MNO-XXX" },
      { tipo: "Arma", valor: "Arma de fogo (revólver)" },
      { tipo: "Suspeitos", valor: "2 indivíduos do sexo masculino" }
    ],
    scoreConfianca: 0.94,
    impacto: "alto" as const
  },
  {
    id: "2",
    nome: "Série de Estelionatos - Golpe do Falso Funcionário",
    tipo: "Estelionato",
    status: "em-inquerito" as const,
    descricao: "Padrão de fraudes telefônicas onde criminosos se passam por funcionários de banco.",
    bairros: ["Boa Viagem", "Setúbal", "Imbiribeira"],
    periodo: "Nov/2024 - Presente",
    modusOperandi: [
      "Ligação de número falso de banco",
      "Solicitação de dados pessoais e senhas",
      "Uso de engenharia social para ganhar confiança",
      "Transferências via PIX para contas laranjas"
    ],
    bosRelacionados: ["64I0319198003", "64I0319198005"],
    evidenciasChave: [
      { tipo: "Telefone", valor: "Números utilizados: (81) 9XXXX-YYYY" },
      { tipo: "Conta", valor: "PIX para CPF: XXX.XXX.XXX-XX" }
    ],
    scoreConfianca: 0.87,
    impacto: "medio" as const
  },
  {
    id: "3",
    nome: "Série de Furtos - Comércio Centro",
    tipo: "Furto",
    status: "pre-inquerito" as const,
    descricao: "Furtos em estabelecimentos comerciais no centro, com mesmo perfil de atuação.",
    bairros: ["Centro", "Santo Antônio", "São José"],
    periodo: "Dez/2024 - Presente",
    modusOperandi: [
      "Atuação em dupla ou trio",
      "Distração de funcionários",
      "Furto de produtos eletrônicos",
      "Horário: período da tarde"
    ],
    bosRelacionados: ["64I0319198008", "64I0319198009"],
    evidenciasChave: [
      { tipo: "Imagem", valor: "Câmeras de segurança - 3 suspeitos identificados" },
      { tipo: "Padrão", valor: "Mesma vestimenta em diferentes ocorrências" }
    ],
    scoreConfianca: 0.79,
    impacto: "baixo" as const
  }
]

function getImpactoColor(impacto: string) {
  switch (impacto) {
    case "alto":
      return "bg-red-500 text-white"
    case "medio":
      return "bg-amber-500 text-white"
    case "baixo":
      return "bg-blue-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

function getSerieStatusColor(status: string) {
  switch (status) {
    case "pre-inquerito":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    case "em-inquerito":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function SerieDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const serie = seriesCorrelacoes.find(s => s.id === id)
  
  const [showIniciarInvestigacaoDialog, setShowIniciarInvestigacaoDialog] = useState(false)
  const [nomeInvestigacao, setNomeInvestigacao] = useState("")
  const [responsavelInvestigacao, setResponsavelInvestigacao] = useState("")
  
  // BOs relacionados com detalhes
  const bosDetalhados = useMemo(() => {
    if (!serie) return []
    return serie.bosRelacionados.map(boNum => {
      const bo = boletinsOcorrencia.find(b => b.bo === boNum)
      return bo || { bo: boNum, natureza: "N/A", data: "N/A", bairro: "N/A" }
    })
  }, [serie])
  
  if (!serie) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Série não encontrada</h2>
          <p className="text-muted-foreground mb-4">A série solicitada não existe ou foi removida.</p>
          <Link href="/cases?mode=infopol">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Voltar para Cases
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const handleIniciarInvestigacao = () => {
    // Salvar no localStorage
    const seriesEmInvestigacao = JSON.parse(localStorage.getItem("seriesEmInvestigacao") || "[]")
    const novaInvestigacao = {
      id: serie.id,
      nome: nomeInvestigacao || serie.nome,
      tipo: serie.tipo,
      prioridade: serie.impacto,
      bosRelacionados: serie.bosRelacionados,
      bairros: serie.bairros,
      periodo: serie.periodo,
      scoreConfianca: serie.scoreConfianca,
      dataInicio: new Date().toLocaleDateString("pt-BR")
    }
    seriesEmInvestigacao.push(novaInvestigacao)
    localStorage.setItem("seriesEmInvestigacao", JSON.stringify(seriesEmInvestigacao))
    
    setShowIniciarInvestigacaoDialog(false)
    router.push("/cases?mode=investigacao")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/cases?mode=infopol&view=series">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{serie.nome}</h1>
              <Badge className={getSerieStatusColor(serie.status)}>
                {serie.status === "pre-inquerito" ? "Pré-inquérito" : "Em inquérito"}
              </Badge>
              <Badge className={getImpactoColor(serie.impacto)}>
                Impacto {serie.impacto}
              </Badge>
            </div>
            <p className="text-muted-foreground">{serie.descricao}</p>
          </div>
        </div>
        
        {/* Botões de ação */}
        {serie.status === "pre-inquerito" && (
          <div className="flex items-center gap-3">
            <Dialog open={showIniciarInvestigacaoDialog} onOpenChange={setShowIniciarInvestigacaoDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Rocket className="size-4" />
                  Instaurar Investigação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Rocket className="size-5" />
                    Instaurar Investigação da Série
                  </DialogTitle>
                  <DialogDescription>
                    Configure os dados iniciais para iniciar a investigação desta série
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Investigação</Label>
                    <Input
                      id="nome"
                      placeholder={serie.nome}
                      value={nomeInvestigacao}
                      onChange={(e) => setNomeInvestigacao(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      placeholder="Nome do investigador responsável"
                      value={responsavelInvestigacao}
                      onChange={(e) => setResponsavelInvestigacao(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>{serie.bosRelacionados.length}</strong> B.O.s serão vinculados a esta investigação
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowIniciarInvestigacaoDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleIniciarInvestigacao} className="bg-emerald-600 hover:bg-emerald-700">
                    Confirmar e Iniciar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Link href={`/cases/${serie.bosRelacionados[0]}?iniciarVPI=true`}>
              <Button variant="outline" className="gap-2">
                <Scale className="size-4" />
                Instaurar VPI
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Conteúdo principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score de Confiança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="size-5" />
                  Score de Confiança
                </span>
                <span className="text-2xl font-bold text-primary">
                  {Math.round(serie.scoreConfianca * 100)}%
                </span>
              </CardTitle>
              <CardDescription>Indicador de confiabilidade da correlação identificada</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={serie.scoreConfianca * 100} className="h-3 mb-4" />
              
              {/* Explicação da IA */}
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="size-4 text-amber-500" />
                  Por que esta série foi identificada?
                </h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                    {serie.bosRelacionados.length} B.O.s com padrão semelhante identificados;
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                    Modus operandi coincidente em {serie.modusOperandi.length} características;
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                    Região geográfica concentrada ({serie.bairros.join(", ")});
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                    {serie.evidenciasChave.length} evidências-chave em comum;
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Modus Operandi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Modus Operandi
              </CardTitle>
              <CardDescription>Padrão de atuação identificado nos casos correlacionados</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {serie.modusOperandi.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {index + 1}
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* B.O.s Relacionados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                B.O.s Relacionados
              </CardTitle>
              <CardDescription>{serie.bosRelacionados.length} boletins de ocorrência vinculados a esta série</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bosDetalhados.map((bo) => (
                  <div
                    key={bo.bo}
                    className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium font-mono">{bo.bo}</p>
                        <p className="text-sm text-muted-foreground">
                          {"natureza" in bo ? bo.natureza : "N/A"} • {"bairro" in bo ? bo.bairro : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/cases/${bo.bo}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="size-4" />
                          Abrir BO
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Informações gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{serie.tipo}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="font-medium">{serie.periodo}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bairros</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {serie.bairros.map((bairro) => (
                      <Badge key={bairro} variant="secondary" className="text-xs">
                        {bairro}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <FileText className="size-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">B.O.s vinculados</p>
                  <p className="font-medium">{serie.bosRelacionados.length} ocorrências</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Evidências-chave */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Evidências-chave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serie.evidenciasChave.map((evidencia, index) => (
                  <div key={index} className="rounded-lg border p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{evidencia.tipo}</p>
                    <p className="text-sm">{evidencia.valor}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
