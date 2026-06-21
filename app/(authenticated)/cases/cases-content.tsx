"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileSearch,
  Scale,
  List,
  Network,
  MapPin,
  Clock,
  AlertCircle,
  Link2,
  Eye,
  Lightbulb,
  Lock,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Circle,
  Play,
  Search,
  ArrowUpDown,
  Filter,
  Rocket,
  AlertTriangle,
  ChevronRight,
  Target,
  Car,
  Smartphone,
  Users,
  TrendingUp,
  ChevronLeft,
  Timer,
  Layers,
  SlidersHorizontal,
  Pencil,
  Check,
  X,
  Info,
  ShieldAlert,
  BookOpen,
  RefreshCw,
  Sparkles
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  boletinsOcorrencia,
  investigacoes,
  correlacoes,
  playbooks,
  getMaturacaoColor,
  getMaturacaoLabel,
  getStatusColor,
  getStatusLabel,
  getPrioridadeColor,
  getPrioridadeLabel,
  type BoletimOcorrencia,
  type Investigacao,
  type EtapaInvestigacao
} from "@/lib/data"

// Dados das séries de correlações
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
    bairros: ["Centro", "Boa Vista"],
    periodo: "Fev/2025 - Presente",
    modusOperandi: [
      "Ligação de número desconhecido",
      "Criminoso se identifica como funcionário do banco",
      "Alega tentativa de fraude na conta",
      "Induz vítima a transferir para conta de segurança"
    ],
    bosRelacionados: ["64I0319198008", "64I0319198009"],
    evidenciasChave: [
      { tipo: "Telefone", valor: "(81) 9XXXX-XXXX - mesmo número" },
      { tipo: "Conta", valor: "PIX para mesma conta destino" }
    ],
    scoreConfianca: 0.98,
    impacto: "alto" as const
  },
  {
    id: "3",
    nome: "Série de Furtos - Parada de Ônibus",
    tipo: "Furto",
    status: "pre-inquerito" as const,
    descricao: "Padrão de furtos de celulares em paradas de ônibus na região de Piedade.",
    bairros: ["Piedade"],
    periodo: "Jan/2025",
    modusOperandi: [
      "Abordagem em paradas de ônibus",
      "Vítimas distraídas aguardando transporte",
      "Furto de bolsas/mochilas"
    ],
    bosRelacionados: ["64I0319198003", "64I0319198005"],
    evidenciasChave: [
      { tipo: "Local", valor: "Paradas de ônibus - Piedade" },
      { tipo: "Horário", valor: "Horário de pico matinal" }
    ],
    scoreConfianca: 0.87,
    impacto: "medio" as const
  }
]

// Alertas ativos
const alertasAtivos = [
  {
    id: "1",
    tipo: "serie-ativa",
    titulo: "Nova Série Identificada",
    descricao: "Série de roubos com moto vermelha - 3 BOs correlacionados",
    serieId: "1",
    urgencia: "alta" as const,
    dataIdentificacao: "21/04/2025"
  },
  {
    id: "2",
    tipo: "correlacao-alta",
    titulo: "Correlação de 98%",
    descricao: "Golpe do falso funcionário - padrão confirmado em 2 casos",
    serieId: "2",
    urgencia: "alta" as const,
    dataIdentificacao: "20/04/2025"
  },
  {
    id: "3",
    tipo: "prazo-proximo",
    titulo: "Prazo de Instauração",
    descricao: "BO 64I0319198005 atinge 30 dias em breve",
    urgencia: "media" as const,
    dataIdentificacao: "19/04/2025"
  },
  {
    id: "4",
    tipo: "novo-bo-serie",
    titulo: "Novo BO na Série",
    descricao: "BO adicionado à série de furtos em paradas de ônibus",
    serieId: "3",
    urgencia: "media" as const,
    dataIdentificacao: "18/04/2025"
  }
]

export default function CasesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") || "infopol"
  
  const [casosTab, setCasosTab] = useState<"todos" | "series">("todos")
  const [search, setSearch] = useState("")
  
  // Filtros para Padrão de recorrência
  const [filtroStatus, setFiltroStatus] = useState<"all" | "pendente" | "observacao" | "amadurecimento" | "pronto">("all")
  const [ordenacao, setOrdenacao] = useState<"score_desc" | "score_asc" | "data_desc" | "data_asc">("score_desc")
  
  // Estado para série selecionada (visualização detalhada)
  const [serieSelecionada, setSerieSelecionada] = useState<typeof seriesCorrelacoes[0] | null>(null)
  const [filtroStatusSerie, setFiltroStatusSerie] = useState<"all" | "pre-inquerito" | "em-inquerito">("all")
  
  // Filtros para modo Investigação
  const [filtroOrdenacaoInv, setFiltroOrdenacaoInv] = useState<"recente" | "antigo" | "prazo_proximo" | "prazo_distante">("recente")
  const [filtroStatusInv, setFiltroStatusInv] = useState<"all" | "triagem" | "em_maturacao" | "em_investigacao" | "diligencia" | "minuta" | "concluido">("all")
  const [filtroPrioridadeInv, setFiltroPrioridadeInv] = useState<"all" | "baixa" | "media" | "alta" | "urgente">("all")
  const [filtroTipoInv, setFiltroTipoInv] = useState<"all" | "serie" | "individual">("all")
  const [filtroEtapaInv, setFiltroEtapaInv] = useState<"all" | "portaria" | "diligencias" | "oitivas" | "minutas" | "relatorio">("all")
  
  // Estado para série em investigação selecionada (detalhes)
  const [selectedSerieInvestigacao, setSelectedSerieInvestigacao] = useState<{
    id: string;
    nome: string;
    tipo: string;
    prioridade: string;
    bosRelacionados: string[];
    bairros: string[];
    periodo: string;
    scoreConfianca: number;
    dataInicio: string;
  } | null>(null)
  
  // Estado para playbooks aplicados às séries
  const [playbooksSeriesAplicados, setPlaybooksSeriesAplicados] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playbooksSeriesAplicados")
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  
  // Função para obter playbook sugerido baseado no tipo da série
  const getPlaybookSugeridoParaSerie = (tipo: string) => {
    const tipoLower = tipo.toLowerCase()
    if (tipoLower.includes("roubo") || tipoLower.includes("assalto")) {
      return playbooks.find(p => p.codigo === "PLB-001") // Roubo
    } else if (tipoLower.includes("furto")) {
      return playbooks.find(p => p.codigo === "PLB-002") // Furto
    } else if (tipoLower.includes("golpe") || tipoLower.includes("estelionato") || tipoLower.includes("falso")) {
      return playbooks.find(p => p.codigo === "PLB-003") // Estelionato
    } else if (tipoLower.includes("lesão") || tipoLower.includes("agressão")) {
      return playbooks.find(p => p.codigo === "PLB-004") // Lesão Corporal
    } else if (tipoLower.includes("ameaça")) {
      return playbooks.find(p => p.codigo === "PLB-005") // Ameaça
    }
    return playbooks[0] // Default: primeiro playbook
  }
  
  // Função para aplicar playbook à série
  const aplicarPlaybookSerie = (serieId: string, playbookCodigo: string) => {
    const novosPlaybooks = { ...playbooksSeriesAplicados, [serieId]: playbookCodigo }
    setPlaybooksSeriesAplicados(novosPlaybooks)
    localStorage.setItem("playbooksSeriesAplicados", JSON.stringify(novosPlaybooks))
  }
  
  // Estados para edição de nome de BO/Série
  const [showEditarNomeDialog, setShowEditarNomeDialog] = useState(false)
  const [itemParaEditar, setItemParaEditar] = useState<{ tipo: "bo" | "serie"; id: string; nomeAtual: string } | null>(null)
  const [novoNome, setNovoNome] = useState("")
  const [nomesEditados, setNomesEditados] = useState<Record<string, string>>(() => {
    // Carregar nomes editados do localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nomesEditadosCasos")
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  
  // Função para obter nome (editado ou original)
  const getNomeEditado = (id: string, nomeOriginal: string) => {
    return nomesEditados[id] || nomeOriginal
  }
  
  // Função para salvar nome editado
  const salvarNomeEditado = () => {
    if (itemParaEditar && novoNome.trim()) {
      const novosNomes = {
        ...nomesEditados,
        [itemParaEditar.id]: novoNome.trim()
      }
      setNomesEditados(novosNomes)
      // Salvar no localStorage
      localStorage.setItem("nomesEditadosCasos", JSON.stringify(novosNomes))
      setShowEditarNomeDialog(false)
      setItemParaEditar(null)
      setNovoNome("")
    }
  }
  
  // Estados para iniciar investigação de série
  const [showIniciarInvestigacaoSerieDialog, setShowIniciarInvestigacaoSerieDialog] = useState(false)
  const [prioridadeInvestigacaoSerie, setPrioridadeInvestigacaoSerie] = useState<"baixa" | "media" | "alta" | "urgente">("media")
  const [investigacaoSerieIniciada, setInvestigacaoSerieIniciada] = useState(false)
  
  // Estados para modal de confirmação de instauração de BO individual
  const [showInstaurarBODialog, setShowInstaurarBODialog] = useState(false)
  const [boParaInstaurar, setBoParaInstaurar] = useState<BoletimOcorrencia | null>(null)
  const [observacaoInstauracao, setObservacaoInstauracao] = useState("")
  const [prioridadeInstauracaoBO, setPrioridadeInstauracaoBO] = useState<"baixa" | "media" | "alta" | "urgente">("media")
  const [instauracaoBOConfirmada, setInstauracaoBOConfirmada] = useState(false)
  
  // Estados para playbook sugerido na instauração de BO
  const [playbookDecisao, setPlaybookDecisao] = useState<"pendente" | "aceito" | "recusado">("pendente")
  const [playbookCodigoSelecionado, setPlaybookCodigoSelecionado] = useState<string>("")
  const [editandoPlaybook, setEditandoPlaybook] = useState(false)
  
  // Estados para prazo de investigação na instauração de BO
  const [prazoInvestigacao, setPrazoInvestigacao] = useState<string>("")
  const [editandoPrazo, setEditandoPrazo] = useState(false)
  
  // Função para sugerir prazo de investigação baseado na natureza e dados do caso
  const getPrazoSugeridoIA = (bo: BoletimOcorrencia): { dias: number; justificativa: string } => {
    const natureza = bo.natureza.toLowerCase()
    const score = bo.scoreMaturacao
    
    // Crimes mais complexos ou graves demandam prazos maiores
    if (natureza.includes("homicídio") || natureza.includes("latrocínio")) {
      return { dias: 90, justificativa: "Crime de natureza grave que demanda diligências complexas (perícias, oitivas múltiplas)." }
    }
    if (natureza.includes("roubo") || natureza.includes("assalto")) {
      return { dias: score > 0.7 ? 30 : 45, justificativa: "Alto índice de materialidade permite prazo otimizado para coleta de provas." }
    }
    if (natureza.includes("estelionato") || natureza.includes("golpe") || natureza.includes("falso")) {
      return { dias: 60, justificativa: "Investigação de fraude requer requisições bancárias e quebras de sigilo que demandam mais tempo." }
    }
    if (natureza.includes("furto")) {
      return { dias: 30, justificativa: "Crime patrimonial de menor complexidade investigativa." }
    }
    if (natureza.includes("lesão") || natureza.includes("agressão") || natureza.includes("ameaça")) {
      return { dias: 30, justificativa: "Prazo padrão considerando oitivas e exames de corpo de delito." }
    }
    return { dias: 30, justificativa: "Prazo padrão recomendado para a natureza do caso." }
  }
  
  // Função para calcular data limite a partir de dias
  const calcularDataLimite = (dias: number): string => {
    const data = new Date()
    data.setDate(data.getDate() + dias)
    return data.toLocaleDateString("pt-BR")
  }
  
  // Função para abrir modal de instauração de BO
  const abrirModalInstaurarBO = (bo: BoletimOcorrencia) => {
    setBoParaInstaurar(bo)
    setObservacaoInstauracao("")
    setPrioridadeInstauracaoBO("media")
    setInstauracaoBOConfirmada(false)
    // Inicializar playbook sugerido
    const playbookSugerido = getPlaybookSugeridoParaSerie(bo.natureza)
    setPlaybookCodigoSelecionado(playbookSugerido?.codigo || "")
    setPlaybookDecisao("pendente")
    setEditandoPlaybook(false)
    // Inicializar prazo sugerido
    const prazoSugerido = getPrazoSugeridoIA(bo)
    setPrazoInvestigacao(String(prazoSugerido.dias))
    setEditandoPrazo(false)
    setShowInstaurarBODialog(true)
  }
  
  // Função para confirmar instauração de BO
  const confirmarInstauracaoBO = () => {
    if (boParaInstaurar) {
      registrarInvestigacaoIniciada(boParaInstaurar.bo, prioridadeInstauracaoBO)
      setInstauracaoBOConfirmada(true)
    }
  }
  
  // Função para calcular indicadores de materialidade
  const getIndicadoresMaterialidade = (bo: BoletimOcorrencia) => {
    const indicadores: { texto: string; presente: boolean }[] = [
      { texto: "Objeto do crime identificado", presente: !!bo.objeto },
      { texto: "Local do fato registrado", presente: !!bo.endereco },
      { texto: "Data e hora do fato", presente: !!bo.dataFato && !!bo.horaFato },
      { texto: "Histórico detalhado", presente: bo.historico?.length > 100 },
      { texto: "Evidências documentadas", presente: bo.evidencias?.length > 0 },
    ]
    return indicadores
  }
  
  // Função para calcular indicadores de autoria
  const getIndicadoresAutoria = (bo: BoletimOcorrencia) => {
    const indicadores: { texto: string; presente: boolean }[] = [
      { texto: "Suspeito identificado", presente: bo.envolvimento === "Autor" || bo.historico?.toLowerCase().includes("suspeito") },
      { texto: "Características físicas descritas", presente: bo.historico?.toLowerCase().includes("altura") || bo.historico?.toLowerCase().includes("aparência") },
      { texto: "Veículo associado ao autor", presente: bo.historico?.toLowerCase().includes("moto") || bo.historico?.toLowerCase().includes("veículo") || bo.historico?.toLowerCase().includes("carro") },
      { texto: "Telefone ou IMEI vinculado", presente: !!bo.celular || !!bo.imei },
      { texto: "Testemunhas identificadas", presente: bo.historico?.toLowerCase().includes("testemunha") },
    ]
    return indicadores
  }
  
  // Função para gerar justificativa da IA
  const getJustificativaIA = (bo: BoletimOcorrencia) => {
    const razoes: string[] = []
    if (bo.maturacao === "pronto") {
      razoes.push("O caso atingiu maturidade suficiente para instauração")
    }
    if (bo.scoreMaturacao >= 0.7) {
      razoes.push(`Score de maturação elevado (${Math.round(bo.scoreMaturacao * 100)}%)`)
    }
    if (bo.correlacoes?.length > 0) {
      razoes.push(`${bo.correlacoes.length} correlação(ões) identificada(s) com outros casos`)
    }
    if (bo.evidencias?.length > 0) {
      razoes.push(`${bo.evidencias.length} evidência(s) documentada(s)`)
    }
    if (bo.envolvimento === "Autor") {
      razoes.push("Suspeito identificado no registro")
    }
    if (razoes.length === 0) {
      razoes.push("Análise padrão indica viabilidade investigativa")
    }
    return razoes
  }
  
  // Estado para investigações iniciadas localmente (persistido no localStorage)
  const [investigacoesLocais, setInvestigacoesLocais] = useState<Record<string, { prioridade: string; data: string }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("investigacoesLocais")
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  
  // Estado para séries em investigação (persistido no localStorage)
  const [seriesEmInvestigacao, setSeriesEmInvestigacao] = useState<Array<{
    id: string;
    nome: string;
    tipo: string;
    prioridade: string;
    bosRelacionados: string[];
    bairros: string[];
    periodo: string;
    scoreConfianca: number;
    dataInicio: string;
  }>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("seriesEmInvestigacao")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  // Função para registrar investigação iniciada
  const registrarInvestigacaoIniciada = (boId: string, prioridade: string) => {
    const novasInvestigacoes = {
      ...investigacoesLocais,
      [boId]: { prioridade, data: new Date().toLocaleDateString('pt-BR') }
    }
    setInvestigacoesLocais(novasInvestigacoes)
    localStorage.setItem("investigacoesLocais", JSON.stringify(novasInvestigacoes))
  }
  
  // Função para registrar série em investigação
  const registrarSerieEmInvestigacao = (serie: typeof seriesCorrelacoes[0], prioridade: string) => {
    const novaSerieInv = {
      id: serie.id,
      nome: getNomeEditado(serie.id, serie.nome),
      tipo: serie.tipo,
      prioridade,
      bosRelacionados: serie.bosRelacionados,
      bairros: serie.bairros,
      periodo: serie.periodo,
      scoreConfianca: serie.scoreConfianca,
      dataInicio: new Date().toLocaleDateString('pt-BR')
    }
    const novasSeries = [...seriesEmInvestigacao.filter(s => s.id !== serie.id), novaSerieInv]
    setSeriesEmInvestigacao(novasSeries)
    localStorage.setItem("seriesEmInvestigacao", JSON.stringify(novasSeries))
  }
  
  // Verificar se BO tem investigação local
  const getInvestigacaoLocal = (boId: string) => {
    return investigacoesLocais[boId] || null
  }
  
  // Helper para verificar se um BO tem investigação
  const boTemInvestigacao = useMemo(() => {
    const bosComInvestigacao = new Set(
      investigacoes.flatMap(inv => [inv.boOrigem, ...inv.bosVinculados])
    )
    return (boId: string) => bosComInvestigacao.has(boId)
  }, [])
  
  // Filtrar séries baseado no status e excluir as que já estão em investigação
  const seriesFiltradas = useMemo(() => {
    // IDs das séries que já foram para investigação
    const seriesEmInvIds = new Set(seriesEmInvestigacao.map(s => s.id))
    
    // BOs que já estão em investigação (oficial ou local)
    const bosEmInvestigacaoSet = new Set(
      investigacoes.flatMap(inv => [inv.boOrigem, ...inv.bosVinculados])
    )
    const bosEmInvestigacaoLocal = new Set(Object.keys(investigacoesLocais))
    
    // Filtrar séries que ainda não estão em investigação e cujos BOs não estão em investigação
    let series = seriesCorrelacoes.filter(s => {
      // Excluir se a série já foi para investigação
      if (seriesEmInvIds.has(s.id)) return false
      
      // Excluir se algum BO da série já está em investigação
      const temBoEmInvestigacao = s.bosRelacionados.some(boId => 
        bosEmInvestigacaoSet.has(boId) || bosEmInvestigacaoLocal.has(boId)
      )
      if (temBoEmInvestigacao) return false
      
      return true
    })
    
    if (filtroStatusSerie !== "all") {
      series = series.filter(s => s.status === filtroStatusSerie)
    }
    
    return series
  }, [filtroStatusSerie, seriesEmInvestigacao, investigacoesLocais])
  
  // BOs relacionados à série selecionada
  const bosRelacionadosSerie = useMemo(() => {
    if (!serieSelecionada) return []
    return boletinsOcorrencia.filter(bo => 
      serieSelecionada.bosRelacionados.includes(bo.bo)
    )
  }, [serieSelecionada])
  
  // Filtrar investigações para o modo investigação
  const investigacoesFiltradas = useMemo(() => {
    let invs = [...investigacoes]
    
    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase()
      invs = invs.filter(inv => 
        inv.codigo.toLowerCase().includes(searchLower) ||
        inv.nome.toLowerCase().includes(searchLower) ||
        inv.boOrigem.toLowerCase().includes(searchLower) ||
        inv.responsavel.toLowerCase().includes(searchLower)
      )
    }
    
    // Filtrar por status
    if (filtroStatusInv !== "all") {
      invs = invs.filter(inv => inv.status === filtroStatusInv)
    }
    
    // Filtrar por prioridade
    if (filtroPrioridadeInv !== "all") {
      invs = invs.filter(inv => inv.prioridade === filtroPrioridadeInv)
    }
    
    // Filtrar por etapa
    if (filtroEtapaInv !== "all") {
      invs = invs.filter(inv => inv.etapaAtual === filtroEtapaInv)
    }
    
    // Filtrar por tipo (série vs individual)
    if (filtroTipoInv !== "all") {
      if (filtroTipoInv === "serie") {
        invs = invs.filter(inv => inv.bosVinculados.length > 0)
      } else {
        invs = invs.filter(inv => inv.bosVinculados.length === 0)
      }
    }
    
    // Ordenar
    invs = invs.sort((a, b) => {
      switch (filtroOrdenacaoInv) {
        case "recente":
          return new Date(b.dataInstauracao).getTime() - new Date(a.dataInstauracao).getTime()
        case "antigo":
          return new Date(a.dataInstauracao).getTime() - new Date(b.dataInstauracao).getTime()
        case "prazo_proximo":
          return new Date(a.prazo).getTime() - new Date(b.prazo).getTime()
        case "prazo_distante":
          return new Date(b.prazo).getTime() - new Date(a.prazo).getTime()
        default:
          return 0
      }
    })
    
    return invs
  }, [search, filtroStatusInv, filtroPrioridadeInv, filtroEtapaInv, filtroTipoInv, filtroOrdenacaoInv])
  
  // Calcular dias restantes do prazo
  const calcularDiasRestantes = (prazo: string) => {
    const hoje = new Date()
    const dataPrazo = new Date(prazo)
    const diffTime = dataPrazo.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const getPrazoColor = (diasRestantes: number) => {
    if (diasRestantes < 0) return "text-red-600 dark:text-red-400"
    if (diasRestantes <= 7) return "text-amber-600 dark:text-amber-400"
    return "text-muted-foreground"
  }
  
  // Helpers de cores
  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case "alto": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "medio": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      default: return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }
  
  const getSerieStatusColor = (status: string) => {
    switch (status) {
      case "pre-inquerito": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "em-inquerito": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }
  
  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "alta": return "border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
      case "media": return "border-amber-300 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
      default: return "border-blue-300 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30"
    }
  }

  // Filtrar BOs baseado no modo, busca, status e ordenação
  const filteredBOs = useMemo(() => {
    let bos = boletinsOcorrencia
    
    // No modo InfoPol, mostrar apenas BOs que NÃO estão em investigação
    if (mode === "infopol") {
      const bosInvestigados = new Set(
        investigacoes.flatMap(inv => [inv.boOrigem, ...inv.bosVinculados])
      )
      // Filtrar BOs que não estão em investigação (nem na lista oficial nem nas locais)
      bos = bos.filter(bo => !bosInvestigados.has(bo.bo) && !investigacoesLocais[bo.bo])
    }
    
    if (mode === "investigacao") {
      const bosInvestigados = new Set(
        investigacoes.flatMap(inv => [inv.boOrigem, ...inv.bosVinculados])
      )
      bos = bos.filter(bo => bosInvestigados.has(bo.bo))
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      bos = bos.filter(bo => 
        bo.bo.toLowerCase().includes(searchLower) ||
        bo.natureza.toLowerCase().includes(searchLower) ||
        bo.bairro.toLowerCase().includes(searchLower) ||
        bo.vitima?.nome?.toLowerCase().includes(searchLower) ||
        bo.vitima?.cpf?.includes(search) ||
        bo.vitima?.telefone?.includes(search) ||
        bo.suspeito?.nome?.toLowerCase().includes(searchLower)
      )
    }
    
    // Filtrar por status (apenas no modo infopol)
    if (mode === "infopol" && filtroStatus !== "all") {
      bos = bos.filter(bo => bo.maturacao === filtroStatus)
    }
    
    // Ordenar
    bos = [...bos].sort((a, b) => {
      switch (ordenacao) {
        case "score_desc":
          return b.scoreMaturacao - a.scoreMaturacao
        case "score_asc":
          return a.scoreMaturacao - b.scoreMaturacao
        case "data_desc":
          return new Date(b.dataFato).getTime() - new Date(a.dataFato).getTime()
        case "data_asc":
          return new Date(a.dataFato).getTime() - new Date(b.dataFato).getTime()
        default:
          return 0
      }
    })
    
    return bos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, search, filtroStatus, ordenacao, Object.keys(investigacoesLocais).join(",")])

  // Séries (agrupamentos de BOs correlacionados)
  const series = useMemo(() => {
    const seriesMap = new Map<string, BoletimOcorrencia[]>()
    
    correlacoes.forEach(corr => {
      const key = [corr.boA, corr.boB].sort().join("-")
      const bosRelacionados = boletinsOcorrencia.filter(
        bo => bo.bo === corr.boA || bo.bo === corr.boB
      )
      if (!seriesMap.has(key)) {
        seriesMap.set(key, bosRelacionados)
      }
    })
    
    return Array.from(seriesMap.entries()).map(([key, bos]) => ({
      id: key,
      bos,
      correlacao: correlacoes.find(c => 
        key === [c.boA, c.boB].sort().join("-")
      )!
    }))
  }, [])

  const getEtapaStatus = (etapa: EtapaInvestigacao, etapaAtual: EtapaInvestigacao) => {
    const etapas: EtapaInvestigacao[] = ["portaria", "diligencias", "oitivas", "minutas", "relatorio"]
    const etapaIndex = etapas.indexOf(etapa)
    const atualIndex = etapas.indexOf(etapaAtual)
    
    if (etapaIndex < atualIndex) return "concluido"
    if (etapaIndex === atualIndex) return "em_andamento"
    return "pendente"
  }

  const getEtapaLabel = (etapa: EtapaInvestigacao) => {
    switch (etapa) {
      case "portaria": return "Portaria"
      case "diligencias": return "Diligências"
      case "oitivas": return "Oitivas"
      case "minutas": return "Minutas"
      case "relatorio": return "Relatório"
    }
  }



  return (
    <div className="space-y-6">
      {/* Cabeçalho do modo */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex size-12 items-center justify-center rounded-xl ${
            mode === "infopol" 
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}>
            {mode === "infopol" ? <FileSearch className="size-6" /> : <Scale className="size-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === "infopol" ? "Padrão de recorrência InfoPol" : "Investigação"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "infopol" 
                ? "Análise pré-instauração de BOs com potencial de virar inquérito"
                : "Casos já instaurados com timeline, diligências e minutas"
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={mode === "infopol" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href="/cases?mode=infopol">
              <FileSearch className="mr-2 size-4" />
              InfoPol
            </a>
          </Button>
          <Button
            variant={mode === "investigacao" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href="/cases?mode=investigacao">
              <Scale className="mr-2 size-4" />
              Investigação
            </a>
          </Button>
        </div>
      </div>

      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por BO, natureza, bairro, CPF, telefone, nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Alertas com scroll horizontal */}
      {mode === "infopol" && alertasAtivos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-medium">Alertas Ativos ({alertasAtivos.length})</h3>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-3">
              {alertasAtivos.map((alerta) => (
                <Card 
                  key={alerta.id} 
                  className={`min-w-[280px] max-w-[320px] cursor-pointer transition-all hover:shadow-md ${getUrgenciaColor(alerta.urgencia)}`}
                  onClick={() => {
                    if (alerta.serieId) {
                      const serie = seriesCorrelacoes.find(s => s.id === alerta.serieId)
                      if (serie) {
                        setSerieSelecionada(serie)
                        setCasosTab("series")
                      }
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={alerta.urgencia === "alta" 
                              ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400" 
                              : "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                            }
                          >
                            {alerta.urgencia === "alta" ? "Urgente" : "Atenção"}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm whitespace-normal">{alerta.titulo}</p>
                        <p className="text-xs text-muted-foreground whitespace-normal line-clamp-2">{alerta.descricao}</p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{alerta.dataIdentificacao}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Modo InfoPol */}
      {mode === "infopol" && (
        <>
          <Tabs value={casosTab} onValueChange={(v) => setCasosTab(v as "todos" | "series")}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="todos" className="gap-2">
                  <List className="size-4" />
                  Todos os casos
                </TabsTrigger>
                <TabsTrigger value="series" className="gap-2">
                  <Network className="size-4" />
                  Séries
                </TabsTrigger>
              </TabsList>

              {/* Filtros adaptáveis */}
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                
                {/* Filtro de Status - diferente para cada tab */}
                {casosTab === "todos" ? (
                  <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as typeof filtroStatus)}>
                    <SelectTrigger className="h-8 w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pendente">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-slate-400" />
                          Pendente
                        </div>
                      </SelectItem>
                      <SelectItem value="observacao">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-amber-400" />
                          Em observação
                        </div>
                      </SelectItem>
                      <SelectItem value="amadurecimento">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-orange-400" />
                          Em amadurecimento
                        </div>
                      </SelectItem>
                      <SelectItem value="pronto">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-emerald-500" />
                          Pronto
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as typeof filtroStatus)}>
                    <SelectTrigger className="h-8 w-[160px]">
                      <SelectValue placeholder="Status da série" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as séries</SelectItem>
                      <SelectItem value="observacao">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-amber-400" />
                          Em observação
                        </div>
                      </SelectItem>
                      <SelectItem value="amadurecimento">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-orange-400" />
                          Em amadurecimento
                        </div>
                      </SelectItem>
                      <SelectItem value="pronto">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-emerald-500" />
                          Pronto para instaurar
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {/* Ordenação por Score */}
                <Select value={ordenacao} onValueChange={(v) => setOrdenacao(v as typeof ordenacao)}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <ArrowUpDown className="mr-2 size-3" />
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_desc">Maior score</SelectItem>
                    <SelectItem value="score_asc">Menor score</SelectItem>
                    <SelectItem value="data_desc">Mais recente</SelectItem>
                    <SelectItem value="data_asc">Mais antigo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="todos" className="mt-4 space-y-3">
              {filteredBOs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="size-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Nenhum B.O. encontrado</p>
                    <p className="text-sm text-muted-foreground">
                      Não há ocorrências para os filtros selecionados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBOs.map((bo) => (
                    <Card
                      key={bo.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        bo.bloqueado ? "opacity-60" : ""
                      }`}
                      onClick={() => router.push(`/cases/${bo.bo}`)}
                    >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 size-3 rounded-full ${
                          bo.maturacao === "pendente" ? "bg-slate-300 dark:bg-slate-600" :
                          bo.maturacao === "observacao" ? "bg-amber-400" :
                          bo.maturacao === "amadurecimento" ? "bg-orange-400" :
                          "bg-emerald-500"
                        }`} />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-medium">{getNomeEditado(bo.bo, bo.bo)}</span>
                            <Badge variant="outline">{bo.natureza}</Badge>
                            <span className="text-sm text-muted-foreground">{bo.dataRegistro}</span>
                            {bo.bloqueado && (
                              <Badge variant="secondary" className="gap-1">
                                <Lock className="size-3" />
                                Bloqueado
                              </Badge>
                            )}
                            {(boTemInvestigacao(bo.bo) || getInvestigacaoLocal(bo.bo)) && (
                              <>
                                <Badge className="gap-1 bg-blue-600 hover:bg-blue-700">
                                  <Scale className="size-3" />
                                  Em Investigação
                                </Badge>
                                {getInvestigacaoLocal(bo.bo) && (
                                  <Badge className={`gap-1 ${
                                    getInvestigacaoLocal(bo.bo)?.prioridade === "baixa" ? "bg-slate-500 hover:bg-slate-600" :
                                    getInvestigacaoLocal(bo.bo)?.prioridade === "media" ? "bg-blue-500 hover:bg-blue-600" :
                                    getInvestigacaoLocal(bo.bo)?.prioridade === "alta" ? "bg-amber-500 hover:bg-amber-600" :
                                    "bg-red-500 hover:bg-red-600"
                                  }`}>
                                    {getInvestigacaoLocal(bo.bo)?.prioridade === "baixa" ? "Baixa" :
                                     getInvestigacaoLocal(bo.bo)?.prioridade === "media" ? "Média" :
                                     getInvestigacaoLocal(bo.bo)?.prioridade === "alta" ? "Alta" : "Urgente"}
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{bo.delegacia}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {bo.bairro}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {bo.horaFato}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {bo.evidencias.map((ev, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {ev}
                              </Badge>
                            ))}
                            {bo.correlacoes.length > 0 && (
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Link2 className="size-3" />
                                {bo.correlacoes.length} correlações
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getMaturacaoColor(bo.maturacao)}>
                            {getMaturacaoLabel(bo.maturacao)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Score:</span>
                            <Progress value={bo.scoreMaturacao * 100} className="h-2 w-20" />
                            <span className="text-xs font-medium">
                              {Math.round(bo.scoreMaturacao * 100)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Link href={`/cases/${bo.bo}`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="w-full cursor-pointer justify-start hover:bg-muted">
                              <Eye className="mr-1 size-4" />
                              Abrir BO
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full cursor-pointer justify-start hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation()
                              setItemParaEditar({ tipo: "bo", id: bo.bo, nomeAtual: getNomeEditado(bo.bo, bo.bo) })
                              setNovoNome(getNomeEditado(bo.bo, bo.bo))
                              setShowEditarNomeDialog(true)
                            }}
                          >
                            <Pencil className="mr-1 size-4" />
                            Editar nome
                          </Button>
                          {bo.correlacoes.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full cursor-pointer justify-start hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Encontrar a série que contém este BO
                                const serie = seriesCorrelacoes.find(s => s.bosRelacionados.includes(bo.bo))
                                if (serie) {
                                  setSerieSelecionada(serie)
                                  setCasosTab("series")
                                }
                              }}
                            >
                              <Link2 className="mr-1 size-4" />
                              Ver correlação
                            </Button>
                          )}
                          {!boTemInvestigacao(bo.bo) && !getInvestigacaoLocal(bo.bo) && (
                            <>
                            <Button 
                              size="sm" 
                              className="w-full cursor-pointer justify-start gap-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                abrirModalInstaurarBO(bo)
                              }}
                            >
                              <Rocket className="size-4" />
                              Instaurar Investigação
                            </Button>
                            <Link href={`/cases/${bo.bo}?iniciarVPI=true`} onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" variant="outline" className="w-full cursor-pointer justify-start gap-1">
                                <Scale className="size-4" />
                                Instaurar VPI
                              </Button>
                            </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="series" className="mt-4 space-y-4">
              {/* Visualização detalhada de série selecionada */}
              {serieSelecionada ? (
                <div className="space-y-6">
                  {/* Header da série */}
                  <div className="flex items-start gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0"
                      onClick={() => setSerieSelecionada(null)}
                    >
                      <ChevronLeft className="size-5" />
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-12 items-center justify-center rounded-xl ${
                          serieSelecionada.tipo === "Roubo" 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : serieSelecionada.tipo === "Estelionato"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                          <Network className="size-6" />
                        </div>
                    <div>
                      <h2 className="text-xl font-bold text-balance">{getNomeEditado(serieSelecionada.id, serieSelecionada.nome)}</h2>
                      <p className="text-muted-foreground">{serieSelecionada.tipo} - {serieSelecionada.periodo}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="cursor-pointer gap-1"
                    onClick={() => {
                      setItemParaEditar({ tipo: "serie", id: serieSelecionada.id, nomeAtual: getNomeEditado(serieSelecionada.id, serieSelecionada.nome) })
                      setNovoNome(getNomeEditado(serieSelecionada.id, serieSelecionada.nome))
                      setShowEditarNomeDialog(true)
                    }}
                  >
                    <Pencil className="size-4" />
                    Editar nome
                  </Button>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  {serieSelecionada.status === "pre-inquerito" && (
                    <div className="flex items-center gap-3">
                      <Button
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => setShowIniciarInvestigacaoSerieDialog(true)}
                      >
                        <Rocket className="size-4" />
                        Instaurar Investigação
                      </Button>
                      <Link href={`/cases/${serieSelecionada.bosRelacionados[0]}?iniciarVPI=true`}>
                        <Button variant="outline" className="gap-2">
                          <Scale className="size-4" />
                          Instaurar VPI
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Score de confiança */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Score de Confiança da Correlação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Progress value={serieSelecionada.scoreConfianca * 100} className="flex-1" />
                        <span className="text-2xl font-bold text-primary">
                          {Math.round(serieSelecionada.scoreConfianca * 100)}%
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {serieSelecionada.descricao}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Modus Operandi */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Target className="size-4" />
                          Modus Operandi Identificado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {serieSelecionada.modusOperandi.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Evidências-chave */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <FileText className="size-4" />
                          Evidências-chave
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {serieSelecionada.evidenciasChave.map((ev, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                              <Badge variant="outline" className="shrink-0">
                                {ev.tipo}
                              </Badge>
                              <span className="text-sm">{ev.valor}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Área de abrangência */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="size-4" />
                        Área de Abrangência
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {serieSelecionada.bairros.map(bairro => (
                          <Badge key={bairro} variant="secondary" className="gap-1">
                            <MapPin className="size-3" />
                            {bairro}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* BOs Correlacionados */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Link2 className="size-4" />
                        Boletins de Ocorrência Correlacionados
                      </CardTitle>
                      <CardDescription>
                        {bosRelacionadosSerie.length} BOs identificados nesta série
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bosRelacionadosSerie.map(bo => (
                          <Link key={bo.id} href={`/cases/${bo.bo}`}>
                            <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                              <div className="flex items-center gap-4">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                  <FileText className="size-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{bo.bo}</span>
                                    <Badge className={getMaturacaoColor(bo.maturacao)}>
                                      {getMaturacaoLabel(bo.maturacao)}
                                    </Badge>
                                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bo.natureza} - {getNomeEditado(bo.bo, bo.nome)}
                  </p>
                                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="size-3" />
                                      {bo.bairro}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {bo.dataFato}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-sm font-medium">
                                    {Math.round(bo.scoreMaturacao * 100)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">Maturação</div>
                                </div>
                                <ChevronRight className="size-5 text-muted-foreground" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ações */}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      Exportar Relatório
                    </Button>
                    {serieSelecionada.status === "pre-inquerito" ? (
                      <>
                        <Link href={`/cases/${serieSelecionada.bosRelacionados[0]}?iniciarVPI=true`}>
                          <Button variant="outline" className="gap-2">
                            <Scale className="size-4" />
                            Instaurar VPI
                          </Button>
                        </Link>
                        <Button
                          onClick={() => setShowIniciarInvestigacaoSerieDialog(true)}
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Rocket className="size-4" />
                          Instaurar Investigação
                        </Button>
                      </>
                    ) : (
                      <Button className="gap-2">
                        <Eye className="size-4" />
                        Ver Investigação
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Filtro de status das séries */}
                  <div className="flex items-center gap-2">
                    <Filter className="size-4 text-muted-foreground" />
                    <Select value={filtroStatusSerie} onValueChange={(v) => setFiltroStatusSerie(v as typeof filtroStatusSerie)}>
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Status da série" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as séries</SelectItem>
                        <SelectItem value="pre-inquerito">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-amber-400" />
                            Pré-inquérito
                          </div>
                        </SelectItem>
                        <SelectItem value="em-inquerito">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-400" />
                            Em inquérito
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de séries */}
                  {seriesFiltradas.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Network className="size-12 text-muted-foreground" />
                        <p className="mt-4 text-lg font-medium">Nenhuma série encontrada</p>
                        <p className="text-sm text-muted-foreground">
                          Não há séries com o filtro selecionado.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    seriesFiltradas.map((serie) => (
                      <Card 
                        key={serie.id} 
                        className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                        onClick={() => setSerieSelecionada(serie)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`flex size-10 items-center justify-center rounded-lg ${
                                serie.tipo === "Roubo" 
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : serie.tipo === "Estelionato"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}>
                                {serie.tipo === "Roubo" && <Car className="size-5" />}
                                {serie.tipo === "Estelionato" && <Smartphone className="size-5" />}
                                {serie.tipo === "Furto" && <Users className="size-5" />}
                              </div>
                    <div>
                      <CardTitle className="text-lg">{getNomeEditado(serie.id, serie.nome)}</CardTitle>
                      <CardDescription>{serie.periodo}</CardDescription>
                    </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSerieStatusColor(serie.status)}>
                                {serie.status === "pre-inquerito" ? "Pré-inquérito" : "Em inquérito"}
                              </Badge>
                              <Badge className={getImpactoColor(serie.impacto)}>
                                {serie.impacto}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{serie.descricao}</p>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm">
                                <FileText className="size-4 text-muted-foreground" />
                                <span>{serie.bosRelacionados.length} BOs</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="size-4 text-muted-foreground" />
                                <span>{serie.bairros.join(", ")}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {Math.round(serie.scoreConfianca * 100)}% confiança
                              </span>
                            </div>
                          </div>
                          
                          {/* Botões de ação */}
                          <div className="mt-3 flex items-center gap-2">
                            {serie.status === "pre-inquerito" && (
                              <>
                              <Button
                                size="sm"
                                className="h-7 gap-1.5 bg-emerald-600 px-3 text-xs hover:bg-emerald-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSerieSelecionada(serie)
                                  setShowIniciarInvestigacaoSerieDialog(true)
                                }}
                              >
                                <Rocket className="size-3" />
                                Instaurar Investigação
                              </Button>
                              <Link href={`/cases/${serie.bosRelacionados[0]}?iniciarVPI=true`} onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 gap-1 px-3 text-xs"
                                >
                                  <Scale className="size-3" />
                                  Instaurar VPI
                                </Button>
                              </Link>
                              </>
                            )}
                            <Link href={`/cases/series/${serie.id}`} onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 px-3 text-xs"
                              >
                                <Eye className="size-3" />
                                Ver detalhes
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Modo Investigação */}
      {mode === "investigacao" && (
        <div className="space-y-4">
          {/* Filtros de Investigação */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Ordenação */}
                <Select value={filtroOrdenacaoInv} onValueChange={(v) => setFiltroOrdenacaoInv(v as typeof filtroOrdenacaoInv)}>
                  <SelectTrigger className="h-9 w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recente">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3" />
                        Mais recentes
                      </div>
                    </SelectItem>
                    <SelectItem value="antigo">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3" />
                        Mais antigos
                      </div>
                    </SelectItem>
                    <SelectItem value="prazo_proximo">
                      <div className="flex items-center gap-2">
                        <Timer className="size-3" />
                        Prazo próximo
                      </div>
                    </SelectItem>
                    <SelectItem value="prazo_distante">
                      <div className="flex items-center gap-2">
                        <Timer className="size-3" />
                        Prazo distante
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Status */}
                <Select value={filtroStatusInv} onValueChange={(v) => setFiltroStatusInv(v as typeof filtroStatusInv)}>
                  <SelectTrigger className="h-9 w-[170px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="triagem">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-slate-400" />
                        Triagem
                      </div>
                    </SelectItem>
                    <SelectItem value="em_maturacao">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-400" />
                        Em Maturação
                      </div>
                    </SelectItem>
                    <SelectItem value="em_investigacao">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-400" />
                        Em Investigação
                      </div>
                    </SelectItem>
                    <SelectItem value="diligencia">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-purple-400" />
                        Diligência
                      </div>
                    </SelectItem>
                    <SelectItem value="minuta">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-cyan-400" />
                        Minuta
                      </div>
                    </SelectItem>
                    <SelectItem value="concluido">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-400" />
                        Concluído
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Prioridade */}
                <Select value={filtroPrioridadeInv} onValueChange={(v) => setFiltroPrioridadeInv(v as typeof filtroPrioridadeInv)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas prioridades</SelectItem>
                    <SelectItem value="urgente">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-red-500" />
                        Urgente
                      </div>
                    </SelectItem>
                    <SelectItem value="alta">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-orange-400" />
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="media">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-400" />
                        Média
                      </div>
                    </SelectItem>
                    <SelectItem value="baixa">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-slate-400" />
                        Baixa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Etapa */}
                <Select value={filtroEtapaInv} onValueChange={(v) => setFiltroEtapaInv(v as typeof filtroEtapaInv)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas etapas</SelectItem>
                    <SelectItem value="portaria">Portaria</SelectItem>
                    <SelectItem value="diligencias">Diligências</SelectItem>
                    <SelectItem value="oitivas">Oitivas</SelectItem>
                    <SelectItem value="minutas">Minutas</SelectItem>
                    <SelectItem value="relatorio">Relatório</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Tipo (Série vs Individual) */}
                <Select value={filtroTipoInv} onValueChange={(v) => setFiltroTipoInv(v as typeof filtroTipoInv)}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="serie">
                      <div className="flex items-center gap-2">
                        <Layers className="size-3" />
                        Série (múltiplos BOs)
                      </div>
                    </SelectItem>
                    <SelectItem value="individual">
                      <div className="flex items-center gap-2">
                        <FileText className="size-3" />
                        Individual
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Chips de filtros ativos */}
              {(filtroStatusInv !== "all" || filtroPrioridadeInv !== "all" || filtroEtapaInv !== "all" || filtroTipoInv !== "all") && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">Filtros ativos:</span>
                  {filtroStatusInv !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Status: {filtroStatusInv.replace("_", " ")}
                      <button onClick={() => setFiltroStatusInv("all")} className="ml-1 hover:text-destructive">&times;</button>
                    </Badge>
                  )}
                  {filtroPrioridadeInv !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Prioridade: {filtroPrioridadeInv}
                      <button onClick={() => setFiltroPrioridadeInv("all")} className="ml-1 hover:text-destructive">&times;</button>
                    </Badge>
                  )}
                  {filtroEtapaInv !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Etapa: {filtroEtapaInv}
                      <button onClick={() => setFiltroEtapaInv("all")} className="ml-1 hover:text-destructive">&times;</button>
                    </Badge>
                  )}
                  {filtroTipoInv !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Tipo: {filtroTipoInv === "serie" ? "Série" : "Individual"}
                      <button onClick={() => setFiltroTipoInv("all")} className="ml-1 hover:text-destructive">&times;</button>
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => {
                      setFiltroStatusInv("all")
                      setFiltroPrioridadeInv("all")
                      setFiltroEtapaInv("all")
                      setFiltroTipoInv("all")
                    }}
                  >
                    Limpar todos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Contador de resultados */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {investigacoesFiltradas.length + seriesEmInvestigacao.length} {(investigacoesFiltradas.length + seriesEmInvestigacao.length) === 1 ? "investigação encontrada" : "investigações encontradas"}
              {seriesEmInvestigacao.length > 0 && (
                <span className="ml-2 text-emerald-600">({seriesEmInvestigacao.length} {seriesEmInvestigacao.length === 1 ? "série" : "séries"})</span>
              )}
            </p>
          </div>
          
          {investigacoesFiltradas.length === 0 && seriesEmInvestigacao.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Scale className="size-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Nenhuma investigação encontrada</p>
                <p className="text-sm text-muted-foreground">
                  {search || filtroStatusInv !== "all" || filtroPrioridadeInv !== "all" || filtroEtapaInv !== "all" || filtroTipoInv !== "all"
                    ? "Tente ajustar os filtros ou a busca."
                    : "Não há inquéritos instaurados para sua delegacia."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="casos" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="casos" className="gap-2">
                  <FileText className="size-4" />
                  Casos Independentes
                  {investigacoesFiltradas.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{investigacoesFiltradas.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="series" className="gap-2">
                  <Layers className="size-4" />
                  Séries
                  {seriesEmInvestigacao.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{seriesEmInvestigacao.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              {/* Tab: Casos Independentes */}
              <TabsContent value="casos" className="space-y-4">
                {investigacoesFiltradas.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">Nenhum caso independente</p>
                      <p className="text-sm text-muted-foreground">
                        Não há investigações de casos individuais.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  investigacoesFiltradas.map((inv) => (
                    <Card 
                      key={inv.id} 
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => router.push(`/investigacoes/${inv.codigo}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{inv.nome}</CardTitle>
                            <CardDescription className="flex items-center gap-3 mt-1">
                              <span className="font-mono">{inv.codigo}</span>
                              <span>BO: {inv.boOrigem}</span>
                              <Badge variant="outline" className="text-xs">Individual</Badge>
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPrioridadeColor(inv.prioridade)}>
                              {getPrioridadeLabel(inv.prioridade)}
                            </Badge>
                            <Badge className={getStatusColor(inv.status)}>
                              {getStatusLabel(inv.status)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Timeline visual */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            {(["portaria", "diligencias", "oitivas", "minutas", "relatorio"] as EtapaInvestigacao[]).map((etapa, i, arr) => {
                              const status = getEtapaStatus(etapa, inv.etapaAtual)
                              return (
                                <div key={etapa} className="flex items-center">
                                  <div className="flex flex-col items-center">
                                    <div className={`flex size-8 items-center justify-center rounded-full ${
                                      status === "concluido" ? "bg-emerald-500 text-white" :
                                      status === "em_andamento" ? "bg-blue-500 text-white" :
                                      "bg-muted text-muted-foreground"
                                    }`}>
                                      {status === "concluido" ? (
                                        <CheckCircle2 className="size-4" />
                                      ) : status === "em_andamento" ? (
                                        <Play className="size-4" />
                                      ) : (
                                        <Circle className="size-4" />
                                      )}
                                    </div>
                                    <span className={`mt-1 text-xs ${
                                      status === "em_andamento" ? "font-medium" : "text-muted-foreground"
                                    }`}>
                                      {getEtapaLabel(etapa)}
                                    </span>
                                  </div>
                                  {i < arr.length - 1 && (
                                    <div className={`mx-2 h-0.5 w-12 ${
                                      status === "concluido" ? "bg-emerald-500" : "bg-muted"
                                    }`} />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <User className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Responsável:</span>
                              <span className="font-medium">{inv.responsavel}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileText className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Delegacia:</span>
                              <span className="font-medium">{inv.delegacia}</span>
                            </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Prazo:</span>
                                <span className="font-medium">{inv.prazo}</span>
                                {(() => {
                                  const dias = calcularDiasRestantes(inv.prazo)
                                  return (
                                    <span className={`text-sm ${getPrazoColor(dias)}`}>
                                      ({dias < 0 ? `${Math.abs(dias)} dias atrasado` : dias === 0 ? "Vence hoje" : `${dias} dias restantes`})
                                    </span>
                                  )
                                })()}
                              </div>
                          </div>
                          <Link href={`/investigacoes/${inv.codigo}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="mr-2 size-4" />
                              Ver detalhes
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              {/* Tab: Séries em Investigação */}
              <TabsContent value="series" className="space-y-4">
                {seriesEmInvestigacao.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Layers className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">Nenhuma série em investigação</p>
                      <p className="text-sm text-muted-foreground">
                        Não há séries de casos sendo investigadas.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  seriesEmInvestigacao.map((serieInv) => (
                    <Card 
                      key={serieInv.id} 
                      className="cursor-pointer transition-all hover:shadow-md border-l-4 border-l-emerald-500"
                      onClick={() => setSelectedSerieInvestigacao(serieInv)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Layers className="size-5 text-emerald-600" />
                              {serieInv.nome}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-3 mt-1">
                              <span className="font-mono">IP-{new Date().getFullYear()}/{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</span>
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Layers className="size-3" />
                                Série ({serieInv.bosRelacionados.length} BOs)
                              </Badge>
                              <span className="text-xs">{serieInv.tipo}</span>
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              serieInv.prioridade === "baixa" ? "bg-slate-500" :
                              serieInv.prioridade === "media" ? "bg-blue-500" :
                              serieInv.prioridade === "alta" ? "bg-amber-500" :
                              "bg-red-500"
                            }`}>
                              {serieInv.prioridade === "baixa" ? "Baixa" :
                               serieInv.prioridade === "media" ? "Média" :
                               serieInv.prioridade === "alta" ? "Alta" : "Urgente"}
                            </Badge>
                            <Badge className="bg-blue-600">
                              Em Investigação
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Timeline visual */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            {(["portaria", "diligencias", "oitivas", "minutas", "relatorio"] as EtapaInvestigacao[]).map((etapa, i, arr) => {
                              const isAtual = etapa === "portaria"
                              const isConcluido = false
                              return (
                                <div key={etapa} className="flex items-center">
                                  <div className="flex flex-col items-center">
                                    <div className={`flex size-8 items-center justify-center rounded-full ${
                                      isConcluido ? "bg-emerald-500 text-white" :
                                      isAtual ? "bg-blue-500 text-white" :
                                      "bg-muted text-muted-foreground"
                                    }`}>
                                      {isConcluido ? (
                                        <CheckCircle2 className="size-4" />
                                      ) : isAtual ? (
                                        <Play className="size-4" />
                                      ) : (
                                        <Circle className="size-4" />
                                      )}
                                    </div>
                                    <span className={`mt-1 text-xs ${
                                      isAtual ? "font-medium" : "text-muted-foreground"
                                    }`}>
                                      {getEtapaLabel(etapa)}
                                    </span>
                                  </div>
                                  {i < arr.length - 1 && (
                                    <div className={`mx-2 h-0.5 w-12 ${
                                      isConcluido ? "bg-emerald-500" : "bg-muted"
                                    }`} />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <User className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Responsável:</span>
                              <span className="font-medium">Del. João Santos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Bairros:</span>
                              <span className="font-medium">{serieInv.bairros.slice(0, 2).join(", ")}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Iniciado:</span>
                            <span className="font-medium">{serieInv.dataInicio}</span>
                          </div>
                        </div>

                        {/* BOs vinculados */}
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-2">BOs vinculados:</p>
                          <div className="flex flex-wrap gap-1">
                            {serieInv.bosRelacionados.slice(0, 5).map(boId => (
                              <Badge key={boId} variant="secondary" className="text-xs font-mono">
                                {boId}
                              </Badge>
                            ))}
                            {serieInv.bosRelacionados.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{serieInv.bosRelacionados.length - 5} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}

      {/* Dialog de Confirmação de Instauração de BO */}
      <Dialog open={showInstaurarBODialog} onOpenChange={(open) => {
        setShowInstaurarBODialog(open)
        if (!open) {
          setBoParaInstaurar(null)
          setObservacaoInstauracao("")
          setPrioridadeInstauracaoBO("media")
          setInstauracaoBOConfirmada(false)
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {instauracaoBOConfirmada ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="size-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Investigação Instaurada</h3>
              <p className="text-muted-foreground text-center mb-4">
                A investigação para o BO {boParaInstaurar?.bo} foi instaurada com sucesso.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <User className="size-4" />
                <span>Decisão registrada por: Usuário Atual</span>
                <span className="mx-2">|</span>
                <Calendar className="size-4" />
                <span>{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <Button onClick={() => setShowInstaurarBODialog(false)}>
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Rocket className="size-5" />
                  Confirmar Instauração de Investigação
                </DialogTitle>
                <DialogDescription>
                  Revise as informações antes de confirmar a instauração do inquérito.
                </DialogDescription>
              </DialogHeader>

              {boParaInstaurar && (
                <div className="space-y-4 py-4">
                  {/* Aviso de responsabilidade */}
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                    <ShieldAlert className="size-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Decisão Humana
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        A IA recomenda ações com base nos dados disponíveis, mas a decisão de instaurar investigação é de responsabilidade do usuário.
                      </p>
                    </div>
                  </div>

                  {/* Resumo do B.O. */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="size-4" />
                      Resumo do B.O.
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Número:</span>
                        <span className="font-mono font-medium">{boParaInstaurar.bo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Natureza:</span>
                        <span className="font-medium">{boParaInstaurar.natureza}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data do Fato:</span>
                        <span>{boParaInstaurar.dataFato}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Local:</span>
                        <span>{boParaInstaurar.bairro}, {boParaInstaurar.municipio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Score de Maturação:</span>
                        <Badge className={getMaturacaoColor(boParaInstaurar.maturacao)}>
                          {Math.round(boParaInstaurar.scoreMaturacao * 100)}%
                        </Badge>
                      </div>
                    </div>

                    {/* Prazo de Investigação */}
                    <div className="mt-4 pt-4 border-t">
                      {(() => {
                        const prazoSugerido = getPrazoSugeridoIA(boParaInstaurar)
                        const diasAtuais = Number(prazoInvestigacao) || prazoSugerido.dias
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium flex items-center gap-2">
                                <Clock className="size-4 text-blue-500" />
                                Prazo de Investigação
                              </h5>
                              <Badge variant="outline" className="text-blue-600 border-blue-300 gap-1">
                                <Sparkles className="size-3" />
                                Sugestão IA
                              </Badge>
                            </div>

                            {!editandoPrazo ? (
                              <div className="flex items-center justify-between rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3">
                                <div>
                                  <p className="text-sm font-medium">
                                    {diasAtuais} dias
                                    <span className="text-muted-foreground font-normal ml-2">
                                      (limite: {calcularDataLimite(diasAtuais)})
                                    </span>
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">{prazoSugerido.justificativa}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-1 flex-shrink-0"
                                  onClick={() => setEditandoPrazo(true)}
                                >
                                  <Pencil className="size-3" />
                                  Editar
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2 rounded-lg border p-3">
                                <Label htmlFor="prazo-dias" className="text-sm">Prazo em dias</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="prazo-dias"
                                    type="number"
                                    min={1}
                                    value={prazoInvestigacao}
                                    onChange={(e) => setPrazoInvestigacao(e.target.value)}
                                    className="w-32"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    dias (limite: {calcularDataLimite(diasAtuais)})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <Button 
                                    size="sm" 
                                    className="gap-1"
                                    onClick={() => setEditandoPrazo(false)}
                                  >
                                    <Check className="size-3" />
                                    Confirmar
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setPrazoInvestigacao(String(prazoSugerido.dias))
                                      setEditandoPrazo(false)
                                    }}
                                  >
                                    Restaurar sugestão
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Justificativa da recomendação da IA */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="size-4 text-amber-500" />
                      Justificativa da Recomendação da IA
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                      {getJustificativaIA(boParaInstaurar).map((razao, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{razao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Playbook Sugerido */}
                  {(() => {
                    const playbookSugerido = getPlaybookSugeridoParaSerie(boParaInstaurar.natureza)
                    const playbookSelecionado = playbookCodigoSelecionado
                      ? playbooks.find(p => p.codigo === playbookCodigoSelecionado)
                      : playbookSugerido
                    if (!playbookSelecionado) return null

                    const borderClass = playbookDecisao === "aceito"
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : playbookDecisao === "recusado"
                      ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                      : "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20"

                    return (
                      <div className={`rounded-lg border p-4 ${borderClass}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <BookOpen className="size-4 text-purple-500" />
                            Playbook Sugerido
                          </h4>
                          {playbookDecisao === "aceito" ? (
                            <Badge className="bg-emerald-600 gap-1">
                              <Check className="size-3" />
                              Aceito
                            </Badge>
                          ) : playbookDecisao === "recusado" ? (
                            <Badge variant="outline" className="text-red-600 border-red-300 gap-1">
                              <X className="size-3" />
                              Recusado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-purple-600 border-purple-300 gap-1">
                              <Sparkles className="size-3" />
                              Sugestão IA
                            </Badge>
                          )}
                        </div>

                        {playbookDecisao === "recusado" ? (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              Nenhum playbook será aplicado na instauração. As diligências poderão ser adicionadas manualmente depois.
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => setPlaybookDecisao("pendente")}
                            >
                              <RefreshCw className="size-3" />
                              Reconsiderar Sugestão
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {editandoPlaybook ? (
                              <div className="space-y-2">
                                <Label className="text-sm">Selecione o playbook</Label>
                                <Select 
                                  value={playbookCodigoSelecionado} 
                                  onValueChange={setPlaybookCodigoSelecionado}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {playbooks.map(p => (
                                      <SelectItem key={p.codigo} value={p.codigo}>
                                        {p.nome} ({p.codigo})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button 
                                  size="sm" 
                                  className="gap-1 mt-1"
                                  onClick={() => setEditandoPlaybook(false)}
                                >
                                  <Check className="size-3" />
                                  Confirmar Seleção
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <p className="font-medium">{playbookSelecionado.nome}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {playbookSelecionado.codigo} • {playbookSelecionado.etapas.length} etapas
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {playbookSelecionado.descricao}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {playbookSelecionado.diligenciasSugeridas?.slice(0, 5).map((d, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
                                  ))}
                                </div>
                              </>
                            )}

                            {!editandoPlaybook && (
                              <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                                {playbookDecisao !== "aceito" && (
                                  <Button 
                                    size="sm" 
                                    className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => setPlaybookDecisao("aceito")}
                                  >
                                    <Check className="size-3" />
                                    Aceitar
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-1"
                                  onClick={() => setEditandoPlaybook(true)}
                                >
                                  <Pencil className="size-3" />
                                  Editar
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-1 text-red-600 hover:text-red-700"
                                  onClick={() => setPlaybookDecisao("recusado")}
                                >
                                  <X className="size-3" />
                                  Recusar
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* Indicadores de materialidade e autoria */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Indicadores de Materialidade */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
                        <Target className="size-4 text-blue-500" />
                        Indicadores de Materialidade
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        {getIndicadoresMaterialidade(boParaInstaurar).map((ind, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {ind.presente ? (
                              <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <X className="size-3.5 text-red-400 flex-shrink-0" />
                            )}
                            <span className={ind.presente ? "text-muted-foreground" : "text-muted-foreground/60"}>
                              {ind.texto}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Indicadores de Autoria */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
                        <Users className="size-4 text-purple-500" />
                        Indicadores de Autoria
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        {getIndicadoresAutoria(boParaInstaurar).map((ind, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {ind.presente ? (
                              <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <X className="size-3.5 text-red-400 flex-shrink-0" />
                            )}
                            <span className={ind.presente ? "text-muted-foreground" : "text-muted-foreground/60"}>
                              {ind.texto}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Padrões recorrentes associados */}
                  {boParaInstaurar.correlacoes?.length > 0 && (
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Network className="size-4 text-indigo-500" />
                        Padrões Recorrentes Associados
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Este B.O. possui {boParaInstaurar.correlacoes.length} correlação(ões) identificada(s) com outros casos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {boParaInstaurar.correlacoes.map((corr, i) => (
                            <Badge key={i} variant="outline" className="font-mono">
                              {corr}
                            </Badge>
                          ))}
                        </div>
                        {boParaInstaurar.evidencias?.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Evidências compartilhadas:</p>
                            <div className="flex flex-wrap gap-1">
                              {boParaInstaurar.evidencias.map((ev, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {ev}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prioridade */}
                  <div className="space-y-2">
                    <Label>Prioridade da Investigação</Label>
                    <Select value={prioridadeInstauracaoBO} onValueChange={(v) => setPrioridadeInstauracaoBO(v as "baixa" | "media" | "alta" | "urgente")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campo de observação do usuário */}
                  <div className="space-y-2">
                    <Label htmlFor="observacao">Observação do Usuário (opcional)</Label>
                    <Textarea
                      id="observacao"
                      placeholder="Adicione observações ou justificativas adicionais para esta decisão..."
                      value={observacaoInstauracao}
                      onChange={(e) => setObservacaoInstauracao(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Suas observações serão registradas junto com a decisão de instauração.
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowInstaurarBODialog(false)}
                  className="sm:order-1"
                >
                  Cancelar
                </Button>
                {boParaInstaurar && (
                  <Link href={`/cases/${boParaInstaurar.bo}?iniciarVPI=true`}>
                    <Button 
                      variant="outline" 
                      className="gap-2 w-full sm:w-auto sm:order-2"
                      onClick={() => setShowInstaurarBODialog(false)}
                    >
                      <Scale className="size-4" />
                      Abrir VPI em vez de instaurar
                    </Button>
                  </Link>
                )}
                <Button 
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 sm:order-3"
                  onClick={confirmarInstauracaoBO}
                >
                  <CheckCircle2 className="size-4" />
                  Confirmar Instauração
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Nome */}
      <Dialog open={showEditarNomeDialog} onOpenChange={(open) => {
        setShowEditarNomeDialog(open)
        if (!open) {
          setItemParaEditar(null)
          setNovoNome("")
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-5" />
              Editar Nome
            </DialogTitle>
            <DialogDescription>
              {itemParaEditar?.tipo === "bo" 
                ? `Altere o nome de identificação do BO ${itemParaEditar?.id}`
                : `Altere o nome da série de correlação`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="novo-nome">Novo nome</Label>
              <Input
                id="novo-nome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Digite o novo nome..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    salvarNomeEditado()
                  }
                }}
              />
            </div>
            {itemParaEditar && (
              <p className="text-xs text-muted-foreground">
                Nome original: {itemParaEditar.nomeAtual}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEditarNomeDialog(false)}
            >
              <X className="mr-1 size-4" />
              Cancelar
            </Button>
            <Button 
              onClick={salvarNomeEditado}
              disabled={!novoNome.trim()}
            >
              <Check className="mr-1 size-4" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Instaurar Investigação de Série */}
      <Dialog open={showIniciarInvestigacaoSerieDialog} onOpenChange={(open) => {
        setShowIniciarInvestigacaoSerieDialog(open)
        if (!open) {
          setPrioridadeInvestigacaoSerie("media")
          setInvestigacaoSerieIniciada(false)
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          {investigacaoSerieIniciada ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Check className="size-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-4 text-lg font-medium">Investigação iniciada com sucesso!</p>
              <p className="text-sm text-muted-foreground">
                {serieSelecionada?.bosRelacionados.length} BOs vinculados à investigação
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Rocket className="size-5" />
                  Instaurar Investigação da Série
                </DialogTitle>
                <DialogDescription>
                  {serieSelecionada && (
                    <>Iniciar investigação para a série &quot;{getNomeEditado(serieSelecionada.id, serieSelecionada.nome)}&quot; com {serieSelecionada.bosRelacionados.length} BOs correlacionados</>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Resumo da série */}
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="text-sm font-medium">Resumo da Série</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="ml-2 font-medium">{serieSelecionada?.tipo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Score:</span>
                      <span className="ml-2 font-medium">{serieSelecionada && Math.round(serieSelecionada.scoreConfianca * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">BOs:</span>
                      <span className="ml-2 font-medium">{serieSelecionada?.bosRelacionados.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Período:</span>
                      <span className="ml-2 font-medium">{serieSelecionada?.periodo}</span>
                    </div>
                  </div>
                </div>

                {/* Seleção de Prioridade */}
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-3">Prioridade da Investigação</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      type="button"
                      variant={prioridadeInvestigacaoSerie === "baixa" ? "default" : "outline"}
                      size="sm"
                      className={prioridadeInvestigacaoSerie === "baixa" ? "bg-slate-600 hover:bg-slate-700" : ""}
                      onClick={() => setPrioridadeInvestigacaoSerie("baixa")}
                    >
                      Baixa
                    </Button>
                    <Button
                      type="button"
                      variant={prioridadeInvestigacaoSerie === "media" ? "default" : "outline"}
                      size="sm"
                      className={prioridadeInvestigacaoSerie === "media" ? "bg-blue-600 hover:bg-blue-700" : ""}
                      onClick={() => setPrioridadeInvestigacaoSerie("media")}
                    >
                      Média
                    </Button>
                    <Button
                      type="button"
                      variant={prioridadeInvestigacaoSerie === "alta" ? "default" : "outline"}
                      size="sm"
                      className={prioridadeInvestigacaoSerie === "alta" ? "bg-amber-600 hover:bg-amber-700" : ""}
                      onClick={() => setPrioridadeInvestigacaoSerie("alta")}
                    >
                      Alta
                    </Button>
                    <Button
                      type="button"
                      variant={prioridadeInvestigacaoSerie === "urgente" ? "default" : "outline"}
                      size="sm"
                      className={prioridadeInvestigacaoSerie === "urgente" ? "bg-red-600 hover:bg-red-700" : ""}
                      onClick={() => setPrioridadeInvestigacaoSerie("urgente")}
                    >
                      Urgente
                    </Button>
                  </div>
                </div>

                {/* O que vai acontecer */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">O que vai acontecer:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500" />
                      Inquérito será criado para a série
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500" />
                      Todos os BOs correlacionados serão vinculados
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500" />
                      Prioridade {prioridadeInvestigacaoSerie === "baixa" ? "baixa" : prioridadeInvestigacaoSerie === "media" ? "média" : prioridadeInvestigacaoSerie === "alta" ? "alta" : "urgente"} será aplicada
                    </li>
                  </ul>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowIniciarInvestigacaoSerieDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    // Registrar investigação para todos os BOs da série
                    if (serieSelecionada) {
                      serieSelecionada.bosRelacionados.forEach(boId => {
                        registrarInvestigacaoIniciada(boId, prioridadeInvestigacaoSerie)
                      })
                      // Registrar a série em investigação
                      registrarSerieEmInvestigacao(serieSelecionada, prioridadeInvestigacaoSerie)
                    }
                    setInvestigacaoSerieIniciada(true)
                    setTimeout(() => {
                      setShowIniciarInvestigacaoSerieDialog(false)
                      setInvestigacaoSerieIniciada(false)
                      // Redirecionar para o modo investigação
                      window.location.href = "/cases?mode=investigacao"
                    }, 1500)
                  }}
                >
                  <Rocket className="size-4" />
                  Confirmar e Iniciar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes da Série em Investigação */}
      <Dialog open={!!selectedSerieInvestigacao} onOpenChange={(open) => !open && setSelectedSerieInvestigacao(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedSerieInvestigacao && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Layers className="size-5 text-emerald-600" />
                      {selectedSerieInvestigacao.nome}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-3 mt-2">
                      <span className="font-mono">IP-{new Date().getFullYear()}/{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</span>
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Layers className="size-3" />
                        Série ({selectedSerieInvestigacao.bosRelacionados.length} BOs)
                      </Badge>
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      selectedSerieInvestigacao.prioridade === "baixa" ? "bg-slate-500" :
                      selectedSerieInvestigacao.prioridade === "media" ? "bg-blue-500" :
                      selectedSerieInvestigacao.prioridade === "alta" ? "bg-amber-500" :
                      "bg-red-500"
                    }`}>
                      {selectedSerieInvestigacao.prioridade === "baixa" ? "Baixa" :
                       selectedSerieInvestigacao.prioridade === "media" ? "Média" :
                       selectedSerieInvestigacao.prioridade === "alta" ? "Alta" : "Urgente"}
                    </Badge>
                    <Badge className="bg-blue-600">
                      Em Investigação
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Timeline visual */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Etapas da Investigação</h4>
                  <div className="flex items-center justify-between">
                    {(["portaria", "diligencias", "oitivas", "minutas", "relatorio"] as EtapaInvestigacao[]).map((etapa, i, arr) => {
                      const isAtual = etapa === "portaria"
                      const isConcluido = false
                      return (
                        <div key={etapa} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div className={`flex size-10 items-center justify-center rounded-full ${
                              isConcluido ? "bg-emerald-500 text-white" :
                              isAtual ? "bg-blue-500 text-white" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {isConcluido ? (
                                <CheckCircle2 className="size-5" />
                              ) : isAtual ? (
                                <Play className="size-5" />
                              ) : (
                                <Circle className="size-5" />
                              )}
                            </div>
                            <span className={`mt-1 text-xs ${
                              isAtual ? "font-medium" : "text-muted-foreground"
                            }`}>
                              {getEtapaLabel(etapa)}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`mx-3 h-0.5 w-16 ${
                              isConcluido ? "bg-emerald-500" : "bg-muted"
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Informações gerais */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium mb-3">Informações Gerais</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span className="font-medium">{selectedSerieInvestigacao.tipo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="font-medium">{selectedSerieInvestigacao.periodo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-medium">{Math.round(selectedSerieInvestigacao.scoreConfianca * 100)}% confiança</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Iniciado em:</span>
                        <span className="font-medium">{selectedSerieInvestigacao.dataInicio}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium mb-3">Responsável</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Delegado:</span>
                        <span className="font-medium">Del. João Santos</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Delegacia:</span>
                        <span className="font-medium">1ª Delegacia de Jaboatão</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Bairros:</span>
                        <span className="font-medium">{selectedSerieInvestigacao.bairros.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOs Vinculados */}
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-3">BOs Vinculados ({selectedSerieInvestigacao.bosRelacionados.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedSerieInvestigacao.bosRelacionados.map(boId => {
                      const boData = boletinsOcorrencia.find(b => b.bo === boId)
                      return (
                        <div key={boId} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="font-mono text-xs">{boId}</Badge>
                            {boData && (
                              <>
                                <span className="text-sm">{boData.natureza}</span>
                                <span className="text-xs text-muted-foreground">{boData.dataRegistro}</span>
                              </>
                            )}
                          </div>
                          <Link href={`/cases/${boId}`}>
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                              <Eye className="size-3" />
                              Ver BO
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Playbook Sugerido/Aplicado */}
                {(() => {
                  const playbookAplicadoCodigo = playbooksSeriesAplicados[selectedSerieInvestigacao.id]
                  const playbookAplicado = playbookAplicadoCodigo 
                    ? playbooks.find(p => p.codigo === playbookAplicadoCodigo)
                    : null
                  const playbookSugerido = getPlaybookSugeridoParaSerie(selectedSerieInvestigacao.tipo)
                  
                  return (
                    <div className={`rounded-lg border p-4 ${playbookAplicado ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <BookOpen className="size-4" />
                          {playbookAplicado ? "Playbook Aplicado" : "Playbook Sugerido"}
                        </h4>
                        {playbookAplicado ? (
                          <Badge className="bg-emerald-600">Aplicado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">Sugestão IA</Badge>
                        )}
                      </div>
                      
                      {(playbookAplicado || playbookSugerido) && (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{playbookAplicado?.nome || playbookSugerido?.nome}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {playbookAplicado?.codigo || playbookSugerido?.codigo} • {playbookAplicado?.etapas.length || playbookSugerido?.etapas.length} etapas
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {playbookAplicado?.descricao || playbookSugerido?.descricao}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(playbookAplicado?.diligenciasSugeridas || playbookSugerido?.diligenciasSugeridas)?.slice(0, 4).map((d, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            {!playbookAplicado && playbookSugerido && (
                              <Button 
                                size="sm" 
                                className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => aplicarPlaybookSerie(selectedSerieInvestigacao.id, playbookSugerido.codigo)}
                              >
                                <Check className="size-3" />
                                Adotar Playbook
                              </Button>
                            )}
                            <Link href={`/playbooks?codigo=${playbookAplicado?.codigo || playbookSugerido?.codigo}`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Eye className="size-3" />
                                Visualizar Playbook
                              </Button>
                            </Link>
                            <Link href="/playbooks">
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Pencil className="size-3" />
                                {playbookAplicado ? "Trocar Playbook" : "Escolher Outro"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Próximas ações sugeridas */}
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-3">Próximas Ações</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="size-4 text-amber-600" />
                      <span className="text-sm">Emitir portaria de instauração</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-sm">Agendar oitivas das vítimas</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-sm">Solicitar imagens de câmeras</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedSerieInvestigacao(null)}>
                  Fechar
                </Button>
                <Button className="gap-2">
                  <FileText className="size-4" />
                  Gerar Portaria
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
