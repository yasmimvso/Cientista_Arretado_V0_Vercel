"use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import Link from "next/link"
import { 
  investigacoes, 
  boletinsOcorrencia, 
  playbooks,
  type Investigacao,
  type BoletimOcorrencia,
  type Playbook
} from "@/lib/data"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  Scale,
  Calendar,
  User,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  Circle,
  Play,
  AlertCircle,
  Link2,
  Target,
  ListChecks,
  Timer,
  Layers,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Check,
  Sparkles,
  Phone,
  CreditCard,
  Car,
  RefreshCw,
  Eye,
  X,
  Smartphone,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pause,
  Upload,
  Lightbulb,
  Plus,
  Ban,
  Send,
  Building2,
  RotateCcw,
  ExternalLink,
  Paperclip,
  Mic,
  MicOff,
  Square,
  PlayCircle,
  PauseCircle,
  Volume2,
  FileAudio,
  UserCircle2,
  MessageSquare,
  ClipboardList,
  Users,
  Hash
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function InvestigacaoDetailContent() {
  const params = useParams()
  const router = useRouter()
  const codigo = params.codigo as string

  // Etapas do inquérito em ordem
  const etapasOrdem = ["portaria", "diligencias", "oitivas", "minutas", "relatorio"]
  
  // Encontrar investigação pelo código
  const investigacaoOriginal = useMemo(() => {
    return investigacoes.find(inv => inv.codigo === codigo)
  }, [codigo])
  
  // Estados para controle local da etapa (simulando update)
  const [etapaAtualLocal, setEtapaAtualLocal] = useState<string | null>(null)
  const [showAvancarDialog, setShowAvancarDialog] = useState(false)
  const [avancando, setAvancando] = useState(false)
  const [avancouSucesso, setAvancouSucesso] = useState(false)
  
  // Estados para gerenciamento de diligências
  const [showExcluirDiligenciaDialog, setShowExcluirDiligenciaDialog] = useState(false)
  const [diligenciaParaExcluir, setDiligenciaParaExcluir] = useState<number | null>(null)
  const [motivoExclusao, setMotivoExclusao] = useState("")
  const [observacaoExclusao, setObservacaoExclusao] = useState("")
  const [showEditarDiligenciaDialog, setShowEditarDiligenciaDialog] = useState(false)
  const [diligenciaParaEditar, setDiligenciaParaEditar] = useState<number | null>(null)
  const [filtroStatusDiligencia, setFiltroStatusDiligencia] = useState<string>("all")
  const [abaAtiva, setAbaAtiva] = useState("sintese")
  
  // Tipo de diligência expandida
  type DiligenciaExtendida = {
    id: number
    tipo: string
    descricao: string
    origemSugestao: "IA" | "Manual" | "Playbook"
    documentoOrigem?: string
    entidadeVinculada?: string
    responsavel: string
    prazo: string
    status: "sugerida" | "confirmada" | "em_andamento" | "aguardando_retorno" | "cumprida" | "rejeitada" | "cancelada" | "vencida"
    impactoMaterialidade: boolean
    impactoAutoria: boolean
    explicacaoIA?: string
  }
  
  // Dados de diligências mockados
  const [diligenciasExtendidas, setDiligenciasExtendidas] = useState<DiligenciaExtendida[]>([
    {
      id: 1,
      tipo: "Requisição de CFTV",
      descricao: "Solicitar imagens de câmeras de segurança dos estabelecimentos próximos ao local do fato",
      origemSugestao: "IA",
      documentoOrigem: "BO 2024/001234",
      entidadeVinculada: "Supermercado Extra - Av. Brasil, 1500",
      responsavel: "Del. João Santos",
      prazo: "20/01/2025",
      status: "sugerida",
      impactoMaterialidade: true,
      impactoAutoria: true,
      explicacaoIA: "Imagens de CFTV podem identificar o autor e confirmar a dinâmica do fato descrito pela vítima. O estabelecimento possui câmeras com alcance para o local da ocorrência."
    },
    {
      id: 2,
      tipo: "Oitiva de Vítima",
      descricao: "Colher depoimento formal da vítima para esclarecimento dos fatos",
      origemSugestao: "Playbook",
      documentoOrigem: "PLB-001",
      entidadeVinculada: "Maria Silva",
      responsavel: "Esc. Ana Costa",
      prazo: "18/01/2025",
      status: "confirmada",
      impactoMaterialidade: true,
      impactoAutoria: false,
      explicacaoIA: "A oitiva da vítima é essencial para materialização do crime e pode fornecer detalhes adicionais sobre o autor."
    },
    {
      id: 3,
      tipo: "Requisição de ERBs",
      descricao: "Solicitar dados de estações rádio base para localização do celular subtraído",
      origemSugestao: "IA",
      documentoOrigem: "BO 2024/001234",
      entidadeVinculada: "IMEI: 353456789012345",
      responsavel: "Del. João Santos",
      prazo: "25/01/2025",
      status: "em_andamento",
      impactoMaterialidade: false,
      impactoAutoria: true,
      explicacaoIA: "O rastreamento do IMEI pode identificar o paradeiro do aparelho e, consequentemente, do autor do roubo."
    },
    {
      id: 4,
      tipo: "Reconhecimento Fotográfico",
      descricao: "Realizar reconhecimento fotográfico com a vítima a partir de suspeitos da região",
      origemSugestao: "IA",
      documentoOrigem: "BO 2024/001234",
      entidadeVinculada: "Maria Silva (Vítima)",
      responsavel: "Esc. Ana Costa",
      prazo: "22/01/2025",
      status: "aguardando_retorno",
      impactoMaterialidade: false,
      impactoAutoria: true,
      explicacaoIA: "A vítima descreveu características físicas do autor que coincidem com indivíduos com passagens pela região."
    },
    {
      id: 5,
      tipo: "Consulta INFOSEG",
      descricao: "Verificar antecedentes e passagens de suspeitos identificados",
      origemSugestao: "Manual",
      entidadeVinculada: "Base INFOSEG",
      responsavel: "Del. João Santos",
      prazo: "15/01/2025",
      status: "cumprida",
      impactoMaterialidade: false,
      impactoAutoria: true
    },
    {
      id: 6,
      tipo: "Perícia Papiloscópica",
      descricao: "Solicitar perícia para coleta de impressões digitais no local",
      origemSugestao: "IA",
      documentoOrigem: "BO 2024/001234",
      entidadeVinculada: "Local do fato",
      responsavel: "IC - Inst. Criminalística",
      prazo: "10/01/2025",
      status: "vencida",
      impactoMaterialidade: true,
      impactoAutoria: true,
      explicacaoIA: "A coleta de impressões digitais no local pode vincular o autor ao crime. Prazo crítico pois vestígios podem ser perdidos."
    }
  ])
  
  // Função para obter cor do status
  const getStatusDiligenciaColor = (status: DiligenciaExtendida["status"]) => {
    switch (status) {
      case "sugerida": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "confirmada": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "em_andamento": return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
      case "aguardando_retorno": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "cumprida": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "rejeitada": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "cancelada": return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
      case "vencida": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default: return "bg-muted text-muted-foreground"
    }
  }
  
  // Função para obter label do status
  const getStatusDiligenciaLabel = (status: DiligenciaExtendida["status"]) => {
    switch (status) {
      case "sugerida": return "Sugerida"
      case "confirmada": return "Confirmada"
      case "em_andamento": return "Em Andamento"
      case "aguardando_retorno": return "Aguardando Retorno"
      case "cumprida": return "Cumprida"
      case "rejeitada": return "Rejeitada"
      case "cancelada": return "Cancelada"
      case "vencida": return "Vencida"
      default: return status
    }
  }
  
  // Função para obter ícone do status
  const getStatusDiligenciaIcon = (status: DiligenciaExtendida["status"]) => {
    switch (status) {
      case "sugerida": return <Sparkles className="size-4" />
      case "confirmada": return <Check className="size-4" />
      case "em_andamento": return <Play className="size-4" />
      case "aguardando_retorno": return <Pause className="size-4" />
      case "cumprida": return <CheckCircle2 className="size-4" />
      case "rejeitada": return <X className="size-4" />
      case "cancelada": return <Ban className="size-4" />
      case "vencida": return <AlertTriangle className="size-4" />
      default: return <Circle className="size-4" />
    }
  }
  
  // Filtrar diligências
  const diligenciasFiltradas = useMemo(() => {
    if (filtroStatusDiligencia === "all") return diligenciasExtendidas
    return diligenciasExtendidas.filter(d => d.status === filtroStatusDiligencia)
  }, [diligenciasExtendidas, filtroStatusDiligencia])
  
  // Motivos de exclusão
  const motivosExclusao = [
    { value: "prazo_antigo", label: "Prazo muito antigo" },
    { value: "vestigio_nao_coletavel", label: "Vestígio não é mais coletável" },
    { value: "informacao_irrelevante", label: "Informação irrelevante" },
    { value: "ja_cumprida_fora_sistema", label: "Diligência já cumprida fora do sistema" },
    { value: "pessoa_nao_localizada", label: "Pessoa não localizada" },
    { value: "sugestao_incorreta_ia", label: "Sugestão incorreta da IA" },
    { value: "nao_se_aplica_tipo_penal", label: "Não se aplica ao tipo penal" },
    { value: "outro", label: "Outro" }
  ]
  
  // Tipo de etapa da timeline
  type EtapaTimeline = {
    id: string
    nome: string
    descricao: string
    status: "concluida" | "em_andamento" | "pendente" | "sugerida_ia" | "rejeitada" | "aguardando_retorno" | "vencida"
    dataInicio?: string
    dataConclusao?: string
    prazo?: string
    responsavel?: string
    itens?: {
      descricao: string
      status: "concluido" | "pendente" | "em_andamento"
      data?: string
    }[]
    sugestaoIA?: string
  }
  
  // Dados das etapas da timeline
  const [etapasTimeline] = useState<EtapaTimeline[]>([
    {
      id: "bo",
      nome: "B.O.",
      descricao: "Registro do boletim de ocorrência e análise inicial",
      status: "concluida",
      dataInicio: "10/01/2025",
      dataConclusao: "10/01/2025",
      itens: [
        { descricao: "BO registrado", status: "concluido", data: "10/01/2025" },
        { descricao: "Análise de viabilidade", status: "concluido", data: "10/01/2025" },
        { descricao: "Classificação do crime", status: "concluido", data: "10/01/2025" }
      ]
    },
    {
      id: "portaria",
      nome: "Portaria",
      descricao: "Instauração formal do inquérito policial",
      status: "concluida",
      dataInicio: "11/01/2025",
      dataConclusao: "11/01/2025",
      itens: [
        { descricao: "Portaria de instauração", status: "concluido", data: "11/01/2025" },
        { descricao: "Designação de responsável", status: "concluido", data: "11/01/2025" },
        { descricao: "Definição de prazo", status: "concluido", data: "11/01/2025" }
      ]
    },
    {
      id: "diligencias",
      nome: "Diligências",
      descricao: "Execução de diligências investigativas",
      status: "em_andamento",
      dataInicio: "12/01/2025",
      prazo: "25/01/2025",
      responsavel: "Del. João Santos",
      itens: [
        { descricao: "Requisição de CFTV", status: "em_andamento" },
        { descricao: "Requisição de ERBs", status: "em_andamento" },
        { descricao: "Consulta INFOSEG", status: "concluido", data: "15/01/2025" },
        { descricao: "Perícia papiloscópica", status: "pendente" }
      ],
      sugestaoIA: "Recomenda-se priorizar a requisição de imagens de CFTV enquanto os vestígios ainda estão disponíveis."
    },
    {
      id: "oitivas",
      nome: "Oitivas",
      descricao: "Depoimentos de vítimas, testemunhas e suspeitos",
      status: "pendente",
      prazo: "30/01/2025",
      responsavel: "Esc. Ana Costa",
      itens: [
        { descricao: "Oitiva da vítima", status: "pendente" },
        { descricao: "Oitiva de testemunhas", status: "pendente" },
        { descricao: "Reconhecimento fotográfico", status: "pendente" }
      ],
      sugestaoIA: "Sugere-se agendar oitiva da vítima antes do reconhecimento fotográfico para melhor direcionamento."
    },
    {
      id: "pericias",
      nome: "Perícias",
      descricao: "Exames periciais e laudos técnicos",
      status: "aguardando_retorno",
      prazo: "05/02/2025",
      itens: [
        { descricao: "Perícia papiloscópica", status: "em_andamento" },
        { descricao: "Laudo de local", status: "pendente" }
      ]
    },
    {
      id: "oficios",
      nome: "Ofícios",
      descricao: "Expedição de ofícios requisitórios",
      status: "sugerida_ia",
      prazo: "10/02/2025",
      sugestaoIA: "Baseado nos dados coletados, sugere-se oficiar operadoras de telefonia para dados cadastrais do IMEI rastreado."
    },
    {
      id: "retornos",
      nome: "Retornos Externos",
      descricao: "Aguardando respostas de órgãos externos",
      status: "aguardando_retorno",
      prazo: "15/02/2025",
      itens: [
        { descricao: "Resposta das operadoras", status: "pendente" },
        { descricao: "Resposta do IC", status: "em_andamento" }
      ]
    },
    {
      id: "minutas",
      nome: "Minutas",
      descricao: "Elaboração de minutas e documentos",
      status: "pendente",
      prazo: "20/02/2025"
    },
    {
      id: "relatorio",
      nome: "Relatório",
      descricao: "Elaboração do relatório final",
      status: "pendente",
      prazo: "25/02/2025",
      sugestaoIA: "O relatório deverá consolidar os elementos de materialidade e autoria identificados durante a investigação."
    },
    {
      id: "conclusao",
      nome: "Conclusão",
      descricao: "Encerramento e remessa ao Ministério Público",
      status: "pendente",
      prazo: "28/02/2025"
    }
  ])
  
  // Função para obter cor do status da etapa
  const getStatusEtapaColor = (status: EtapaTimeline["status"]) => {
    switch (status) {
      case "concluida": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300"
      case "em_andamento": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300"
      case "pendente": return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300"
      case "sugerida_ia": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300"
      case "rejeitada": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300"
      case "aguardando_retorno": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300"
      case "vencida": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300"
      default: return "bg-muted text-muted-foreground"
    }
  }
  
  // Função para obter label do status da etapa
  const getStatusEtapaLabel = (status: EtapaTimeline["status"]) => {
    switch (status) {
      case "concluida": return "Concluída"
      case "em_andamento": return "Em Andamento"
      case "pendente": return "Pendente"
      case "sugerida_ia": return "Sugerida pela IA"
      case "rejeitada": return "Rejeitada"
      case "aguardando_retorno": return "Aguardando Retorno"
      case "vencida": return "Vencida"
      default: return status
    }
  }
  
  // Função para obter ícone do status da etapa
  const getStatusEtapaIcon = (status: EtapaTimeline["status"]) => {
    switch (status) {
      case "concluida": return <CheckCircle2 className="size-5" />
      case "em_andamento": return <Play className="size-5" />
      case "pendente": return <Circle className="size-5" />
      case "sugerida_ia": return <Sparkles className="size-5" />
      case "rejeitada": return <X className="size-5" />
      case "aguardando_retorno": return <Pause className="size-5" />
      case "vencida": return <AlertTriangle className="size-5" />
      default: return <Circle className="size-5" />
    }
  }
  
  // Tipo de solicitação
  type Solicitacao = {
    id: number
    tipo: "oficio" | "requisicao" | "pedido_informacao" | "intimacao" | "notificacao"
    descricao: string
    orgaoDestinatario: string
    dataSolicitacao: string
    prazo: string
    status: "criada" | "enviada" | "aguardando_retorno" | "retornada" | "vencida" | "cancelada" | "inconclusiva" | "cumprida"
    responsavel: string
    retornoRecebido: boolean
    documentoAnexado?: string
    pendenciaVinculada?: string
    impactoProgresso: "materialidade" | "autoria" | "ambos" | "nenhum"
    dataRetorno?: string
    resumoRetorno?: string
  }
  
  // Dados de solicitações mockados
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([
    {
      id: 1,
      tipo: "requisicao",
      descricao: "Requisição de imagens de CFTV dos estabelecimentos próximos ao local do fato",
      orgaoDestinatario: "Supermercado Extra - Av. Brasil, 1500",
      dataSolicitacao: "12/01/2025",
      prazo: "22/01/2025",
      status: "aguardando_retorno",
      responsavel: "Del. João Santos",
      retornoRecebido: false,
      pendenciaVinculada: "Diligência #1 - Requisição de CFTV",
      impactoProgresso: "ambos"
    },
    {
      id: 2,
      tipo: "oficio",
      descricao: "Ofício requisitório de dados cadastrais e ERBs do IMEI 353456789012345",
      orgaoDestinatario: "Operadora Vivo",
      dataSolicitacao: "15/01/2025",
      prazo: "30/01/2025",
      status: "enviada",
      responsavel: "Del. João Santos",
      retornoRecebido: false,
      documentoAnexado: "OF-2025-001234.pdf",
      pendenciaVinculada: "Diligência #3 - Requisição de ERBs",
      impactoProgresso: "autoria"
    },
    {
      id: 3,
      tipo: "requisicao",
      descricao: "Requisição de perícia papiloscópica no local do fato",
      orgaoDestinatario: "Instituto de Criminalística - IC",
      dataSolicitacao: "11/01/2025",
      prazo: "15/01/2025",
      status: "vencida",
      responsavel: "Esc. Ana Costa",
      retornoRecebido: false,
      pendenciaVinculada: "Diligência #6 - Perícia Papiloscópica",
      impactoProgresso: "ambos"
    },
    {
      id: 4,
      tipo: "pedido_informacao",
      descricao: "Consulta de antecedentes criminais de suspeito identificado",
      orgaoDestinatario: "INFOSEG",
      dataSolicitacao: "14/01/2025",
      prazo: "18/01/2025",
      status: "cumprida",
      responsavel: "Del. João Santos",
      retornoRecebido: true,
      dataRetorno: "16/01/2025",
      resumoRetorno: "Suspeito possui 2 passagens por roubo na mesma região. Última ocorrência em 08/2024.",
      documentoAnexado: "consulta-infoseg-001.pdf",
      impactoProgresso: "autoria"
    },
    {
      id: 5,
      tipo: "oficio",
      descricao: "Ofício para instituição bancária solicitando dados de transações PIX",
      orgaoDestinatario: "Banco do Brasil - Gerência Regional",
      dataSolicitacao: "18/01/2025",
      prazo: "05/02/2025",
      status: "criada",
      responsavel: "Del. João Santos",
      retornoRecebido: false,
      impactoProgresso: "autoria"
    },
    {
      id: 6,
      tipo: "intimacao",
      descricao: "Intimação de testemunha para comparecimento e depoimento",
      orgaoDestinatario: "Carlos Pereira (Testemunha)",
      dataSolicitacao: "16/01/2025",
      prazo: "25/01/2025",
      status: "retornada",
      responsavel: "Esc. Ana Costa",
      retornoRecebido: true,
      dataRetorno: "20/01/2025",
      resumoRetorno: "Testemunha compareceu e prestou depoimento. Confirmou descrição do suspeito.",
      documentoAnexado: "termo-oitiva-carlos.pdf",
      pendenciaVinculada: "Oitiva de testemunhas",
      impactoProgresso: "autoria"
    }
  ])
  
  // Estado do filtro de solicitações
  const [filtroStatusSolicitacao, setFiltroStatusSolicitacao] = useState<string>("all")
  
  // Estado para modal de nova solicitação
  const [showNovaSolicitacaoDialog, setShowNovaSolicitacaoDialog] = useState(false)
  
  // Função para obter cor do status da solicitação
  const getStatusSolicitacaoColor = (status: Solicitacao["status"]) => {
    switch (status) {
      case "criada": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "enviada": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "aguardando_retorno": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "retornada": return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
      case "vencida": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "cancelada": return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
      case "inconclusiva": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "cumprida": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      default: return "bg-muted text-muted-foreground"
    }
  }
  
  // Função para obter label do status da solicitação
  const getStatusSolicitacaoLabel = (status: Solicitacao["status"]) => {
    switch (status) {
      case "criada": return "Criada"
      case "enviada": return "Enviada"
      case "aguardando_retorno": return "Aguardando Retorno"
      case "retornada": return "Retornada"
      case "vencida": return "Vencida"
      case "cancelada": return "Cancelada"
      case "inconclusiva": return "Inconclusiva"
      case "cumprida": return "Cumprida"
      default: return status
    }
  }
  
  // Função para obter ícone do tipo de solicitação
  const getTipoSolicitacaoIcon = (tipo: Solicitacao["tipo"]) => {
    switch (tipo) {
      case "oficio": return <FileText className="size-4" />
      case "requisicao": return <Send className="size-4" />
      case "pedido_informacao": return <Eye className="size-4" />
      case "intimacao": return <User className="size-4" />
      case "notificacao": return <AlertCircle className="size-4" />
      default: return <FileText className="size-4" />
    }
  }
  
  // Função para obter label do tipo de solicitação
  const getTipoSolicitacaoLabel = (tipo: Solicitacao["tipo"]) => {
    switch (tipo) {
      case "oficio": return "Ofício"
      case "requisicao": return "Requisição"
      case "pedido_informacao": return "Pedido de Informação"
      case "intimacao": return "Intimação"
      case "notificacao": return "Notificação"
      default: return tipo
    }
  }
  
  // Solicitações filtradas
  const solicitacoesFiltradas = useMemo(() => {
    if (filtroStatusSolicitacao === "all") return solicitacoes
    return solicitacoes.filter(s => s.status === filtroStatusSolicitacao)
  }, [solicitacoes, filtroStatusSolicitacao])
  
  // Contagem de solicitações vencidas (para alerta)
  const solicitacoesVencidas = useMemo(() => solicitacoes.filter(s => s.status === "vencida"), [solicitacoes])
  
  // Ações de solicitação
  const marcarComoEnviada = (id: number) => {
    setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: "enviada" as const } : s))
  }
  
  const marcarAguardandoRetornoSolicitacao = (id: number) => {
    setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: "aguardando_retorno" as const } : s))
  }
  
  const marcarCumpridaSolicitacao = (id: number) => {
    setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: "cumprida" as const, retornoRecebido: true } : s))
  }
  
  // Tipo de oitiva
  type Oitiva = {
    id: number
    tipo: "vitima" | "testemunha" | "suspeito" | "informante" | "perito"
    pessoa: string
    cpf?: string
    diligenciaVinculada?: string
    dataAgendada?: string
    horaAgendada?: string
    status: "agendada" | "em_gravacao" | "transcrita" | "em_revisao" | "minuta_gerada" | "aprovada" | "cancelada"
    responsavel: string
    audioUrl?: string
    duracaoAudio?: string
    transcricao?: string
    resumo?: string
    entidadesExtraidas?: {
      tipo: string
      valor: string
      relevancia: "alta" | "media" | "baixa"
    }[]
    interlocutores?: {
      nome: string
      papel: string
    }[]
    minutaGerada?: string
    diligenciasSugeridas?: string[]
  }
  
  // Dados de oitivas mockados
  const [oitivas, setOitivas] = useState<Oitiva[]>([
    {
      id: 1,
      tipo: "vitima",
      pessoa: "Maria Silva",
      cpf: "123.456.789-00",
      diligenciaVinculada: "Diligência #2 - Oitiva de Vítima",
      dataAgendada: "22/01/2025",
      horaAgendada: "14:00",
      status: "aprovada",
      responsavel: "Esc. Ana Costa",
      audioUrl: "/audio/oitiva-001.mp3",
      duracaoAudio: "45:32",
      transcricao: "Pergunta: A senhora pode nos relatar o que aconteceu no dia dos fatos?\n\nResposta: Eu estava saindo do supermercado por volta das 19h30 quando dois homens em uma moto preta se aproximaram. O garupa desceu e anunciou o assalto. Ele pegou meu celular e minha bolsa...\n\nPergunta: A senhora consegue descrever os autores?\n\nResposta: O que desceu da moto era moreno, alto, aparentava ter uns 25 anos. Usava capacete preto e uma jaqueta escura. O piloto eu não consegui ver bem...",
      resumo: "A vítima Maria Silva relatou ter sido abordada por dois indivíduos em uma motocicleta preta ao sair do Supermercado Extra. O autor que desceu da moto foi descrito como homem moreno, alto, aproximadamente 25 anos, usando capacete preto e jaqueta escura. Foram subtraídos um celular iPhone 13 e uma bolsa contendo documentos pessoais e R$ 350,00 em espécie.",
      entidadesExtraidas: [
        { tipo: "Veículo", valor: "Motocicleta preta", relevancia: "alta" },
        { tipo: "Horário", valor: "19h30", relevancia: "alta" },
        { tipo: "Local", valor: "Supermercado Extra", relevancia: "alta" },
        { tipo: "Objeto", valor: "iPhone 13", relevancia: "alta" },
        { tipo: "Valor", valor: "R$ 350,00", relevancia: "media" },
        { tipo: "Descrição física", valor: "Homem moreno, alto, ~25 anos", relevancia: "alta" },
        { tipo: "Vestimenta", valor: "Capacete preto, jaqueta escura", relevancia: "media" }
      ],
      interlocutores: [
        { nome: "Esc. Ana Costa", papel: "Entrevistador" },
        { nome: "Maria Silva", papel: "Vítima" }
      ],
      minutaGerada: "TERMO DE DECLARAÇÕES\n\nAos 22 dias do mês de janeiro de 2025, nesta cidade de São Paulo, compareceu perante esta autoridade policial MARIA SILVA, brasileira, portadora do CPF nº 123.456.789-00...",
      diligenciasSugeridas: [
        "Requisitar imagens de CFTV do Supermercado Extra",
        "Solicitar ERBs do IMEI do celular subtraído",
        "Realizar reconhecimento fotográfico com a vítima"
      ]
    },
    {
      id: 2,
      tipo: "testemunha",
      pessoa: "Carlos Pereira",
      cpf: "987.654.321-00",
      diligenciaVinculada: "Oitiva de testemunhas",
      dataAgendada: "25/01/2025",
      horaAgendada: "10:00",
      status: "minuta_gerada",
      responsavel: "Esc. Ana Costa",
      audioUrl: "/audio/oitiva-002.mp3",
      duracaoAudio: "28:15",
      transcricao: "Pergunta: O senhor presenciou os fatos ocorridos no dia 10 de janeiro?\n\nResposta: Sim, eu estava no estacionamento do supermercado quando ouvi gritos. Vi dois homens em uma moto abordando uma mulher...",
      resumo: "A testemunha Carlos Pereira confirmou ter presenciado a abordagem da vítima no estacionamento do supermercado. Corroborou a descrição do veículo (motocicleta preta) e informou que a moto fugiu em direção à Av. Principal. Declarou ter visto parcialmente a placa: começava com 'ABC'.",
      entidadesExtraidas: [
        { tipo: "Placa parcial", valor: "ABC-****", relevancia: "alta" },
        { tipo: "Direção da fuga", valor: "Av. Principal", relevancia: "alta" },
        { tipo: "Local", valor: "Estacionamento do supermercado", relevancia: "media" }
      ],
      interlocutores: [
        { nome: "Esc. Ana Costa", papel: "Entrevistador" },
        { nome: "Carlos Pereira", papel: "Testemunha" }
      ],
      minutaGerada: "TERMO DE DECLARAÇÕES\n\nAos 25 dias do mês de janeiro de 2025...",
      diligenciasSugeridas: [
        "Consultar placas iniciadas com ABC na base DETRAN",
        "Requisitar imagens de CFTV da Av. Principal"
      ]
    },
    {
      id: 3,
      tipo: "testemunha",
      pessoa: "Ana Rodrigues",
      diligenciaVinculada: "Oitiva de testemunhas",
      dataAgendada: "26/01/2025",
      horaAgendada: "15:00",
      status: "agendada",
      responsavel: "Esc. Ana Costa"
    },
    {
      id: 4,
      tipo: "suspeito",
      pessoa: "José Santos",
      cpf: "111.222.333-44",
      dataAgendada: "28/01/2025",
      horaAgendada: "09:00",
      status: "agendada",
      responsavel: "Del. João Santos"
    }
  ])
  
  // Estados da interface de oitiva
  const [oitivaSelecionada, setOitivaSelecionada] = useState<Oitiva | null>(null)
  const [modoOitiva, setModoOitiva] = useState<"lista" | "ambiente">("lista")
  const [modoEntradaOitiva, setModoEntradaOitiva] = useState<"gravar" | "escrever">("gravar")
  const [gravando, setGravando] = useState(false)
  const [tempoGravacao, setTempoGravacao] = useState(0)
  const [audioPlayer, setAudioPlayer] = useState<{playing: boolean, currentTime: number}>({ playing: false, currentTime: 0 })
  const [transcricaoManual, setTranscricaoManual] = useState("")
  const [filtroStatusOitiva, setFiltroStatusOitiva] = useState<string>("all")
  
  // Função para obter cor do status da oitiva
  const getStatusOitivaColor = (status: Oitiva["status"]) => {
    switch (status) {
      case "agendada": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "em_gravacao": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "transcrita": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "em_revisao": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "minuta_gerada": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "aprovada": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "cancelada": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default: return "bg-muted text-muted-foreground"
    }
  }
  
  // Função para obter label do status da oitiva
  const getStatusOitivaLabel = (status: Oitiva["status"]) => {
    switch (status) {
      case "agendada": return "Agendada"
      case "em_gravacao": return "Em Gravação"
      case "transcrita": return "Transcrita"
      case "em_revisao": return "Em Revisão"
      case "minuta_gerada": return "Minuta Gerada"
      case "aprovada": return "Aprovada"
      case "cancelada": return "Cancelada"
      default: return status
    }
  }
  
  // Função para obter ícone do tipo de oitiva
  const getTipoOitivaIcon = (tipo: Oitiva["tipo"]) => {
    switch (tipo) {
      case "vitima": return <User className="size-4" />
      case "testemunha": return <Users className="size-4" />
      case "suspeito": return <AlertTriangle className="size-4" />
      case "informante": return <MessageSquare className="size-4" />
      case "perito": return <ClipboardList className="size-4" />
      default: return <User className="size-4" />
    }
  }
  
  // Função para obter label do tipo de oitiva
  const getTipoOitivaLabel = (tipo: Oitiva["tipo"]) => {
    switch (tipo) {
      case "vitima": return "Vítima"
      case "testemunha": return "Testemunha"
      case "suspeito": return "Suspeito"
      case "informante": return "Informante"
      case "perito": return "Perito"
      default: return tipo
    }
  }
  
  // Oitivas filtradas
  const oitivasFiltradas = useMemo(() => {
    if (filtroStatusOitiva === "all") return oitivas
    return oitivas.filter(o => o.status === filtroStatusOitiva)
  }, [oitivas, filtroStatusOitiva])
  
  // Funções de controle de oitiva
  const iniciarGravacao = () => {
    setGravando(true)
    if (oitivaSelecionada) {
      setOitivas(prev => prev.map(o => o.id === oitivaSelecionada.id ? { ...o, status: "em_gravacao" as const } : o))
    }
  }
  
  const pararGravacao = () => {
    setGravando(false)
    setTempoGravacao(0)
  }
  
  const abrirAmbienteOitiva = (oitiva: Oitiva) => {
    setOitivaSelecionada(oitiva)
    setModoOitiva("ambiente")
  }
  
  const voltarParaLista = () => {
    setOitivaSelecionada(null)
    setModoOitiva("lista")
    setGravando(false)
    setTempoGravacao(0)
  }
  
  const aprovarMinuta = (id: number) => {
    setOitivas(prev => prev.map(o => o.id === id ? { ...o, status: "aprovada" as const } : o))
  }
  
  // Funções de ação
  const confirmarDiligencia = (id: number) => {
    setDiligenciasExtendidas(prev => prev.map(d => d.id === id ? { ...d, status: "confirmada" as const } : d))
  }
  
  const marcarEmAndamento = (id: number) => {
    setDiligenciasExtendidas(prev => prev.map(d => d.id === id ? { ...d, status: "em_andamento" as const } : d))
  }
  
  const marcarAguardandoRetorno = (id: number) => {
    setDiligenciasExtendidas(prev => prev.map(d => d.id === id ? { ...d, status: "aguardando_retorno" as const } : d))
  }
  
  const marcarCumprida = (id: number) => {
    setDiligenciasExtendidas(prev => prev.map(d => d.id === id ? { ...d, status: "cumprida" as const } : d))
  }
  
  const excluirDiligencia = () => {
    if (diligenciaParaExcluir !== null && motivoExclusao) {
      setDiligenciasExtendidas(prev => prev.map(d => 
        d.id === diligenciaParaExcluir ? { ...d, status: "rejeitada" as const } : d
      ))
      // Feedback registrado para aprendizado futuro
      setShowExcluirDiligenciaDialog(false)
      setDiligenciaParaExcluir(null)
      setMotivoExclusao("")
      setObservacaoExclusao("")
    }
  }
  
  // Investigação com etapa local (se alterada)
  const investigacao = useMemo(() => {
    if (!investigacaoOriginal) return null
    // Etapa efetiva (local sobrescreve a original quando alterada)
    const etapaEfetiva = (etapaAtualLocal ?? investigacaoOriginal.etapaAtual) as typeof investigacaoOriginal.etapaAtual
    // Progresso derivado da etapa: avança conforme as etapas são completadas
    const indexEtapa = etapasOrdem.indexOf(etapaEfetiva)
    const progressoCalculado = indexEtapa >= 0
      ? Math.round(((indexEtapa + 1) / etapasOrdem.length) * 100)
      : investigacaoOriginal.progresso
    return { ...investigacaoOriginal, etapaAtual: etapaEfetiva, progresso: progressoCalculado }
  }, [investigacaoOriginal, etapaAtualLocal])
  
  // Próxima etapa
  const proximaEtapa = useMemo(() => {
    if (!investigacao) return null
    const indexAtual = etapasOrdem.indexOf(investigacao.etapaAtual)
    if (indexAtual === -1 || indexAtual >= etapasOrdem.length - 1) return null
    return etapasOrdem[indexAtual + 1]
  }, [investigacao])
  
  // Verificar se é última etapa
  const isUltimaEtapa = useMemo(() => {
    if (!investigacao) return true
    return etapasOrdem.indexOf(investigacao.etapaAtual) === etapasOrdem.length - 1
  }, [investigacao])
  
  // Função para avançar etapa
  const handleAvancarEtapa = () => {
    if (!proximaEtapa) return
    setAvancando(true)
    
    // Simular delay de salvamento
    setTimeout(() => {
      setEtapaAtualLocal(proximaEtapa)
      setAvancando(false)
      setAvancouSucesso(true)
      
      setTimeout(() => {
        setShowAvancarDialog(false)
        setAvancouSucesso(false)
      }, 1500)
    }, 1000)
  }
  
  // Labels das etapas
  const getEtapaLabel = (etapa: string) => {
    switch (etapa) {
      case "portaria": return "Portaria"
      case "diligencias": return "Diligências"
      case "oitivas": return "Oitivas"
      case "minutas": return "Minutas"
      case "relatorio": return "Relatório"
      default: return etapa
    }
  }

  // BOs relacionados a esta investigação
  const bosRelacionados = useMemo(() => {
    if (!investigacao) return []
    const todosBos = [investigacao.boOrigem, ...investigacao.bosVinculados]
    return boletinsOcorrencia.filter(bo => todosBos.includes(bo.bo))
  }, [investigacao])

  // Playbook aplicado (estado local editável)
  const [playbookAplicado, setPlaybookAplicado] = useState<Playbook | null>(() => playbooks[0] ?? null)

  // Estados para gerenciamento do playbook
  const [showAplicarPlaybookDialog, setShowAplicarPlaybookDialog] = useState(false)
  const [showEditarPlaybookDialog, setShowEditarPlaybookDialog] = useState(false)
  const [showExcluirPlaybookDialog, setShowExcluirPlaybookDialog] = useState(false)
  const [playbookSelecionadoId, setPlaybookSelecionadoId] = useState<string>("")
  const [playbookEditNome, setPlaybookEditNome] = useState("")
  const [playbookEditDescricao, setPlaybookEditDescricao] = useState("")
  const [playbookEditPassos, setPlaybookEditPassos] = useState<string[]>([])

  // Aplicar um playbook selecionado da biblioteca
  const aplicarPlaybook = () => {
    const pb = playbooks.find((p) => p.id === playbookSelecionadoId)
    if (pb) {
      setPlaybookAplicado({ ...pb, passos: [...pb.passos] })
    }
    setShowAplicarPlaybookDialog(false)
    setPlaybookSelecionadoId("")
  }

  // Abrir dialog de edição preenchendo com o playbook atual
  const abrirEditarPlaybook = () => {
    if (!playbookAplicado) return
    setPlaybookEditNome(playbookAplicado.nome)
    setPlaybookEditDescricao(playbookAplicado.descricao)
    setPlaybookEditPassos([...playbookAplicado.passos])
    setShowEditarPlaybookDialog(true)
  }

  // Salvar edição do playbook
  const salvarEdicaoPlaybook = () => {
    if (!playbookAplicado) return
    setPlaybookAplicado({
      ...playbookAplicado,
      nome: playbookEditNome.trim() || playbookAplicado.nome,
      descricao: playbookEditDescricao.trim(),
      passos: playbookEditPassos.map((p) => p.trim()).filter(Boolean),
    })
    setShowEditarPlaybookDialog(false)
  }

  // Excluir playbook aplicado
  const excluirPlaybook = () => {
    setPlaybookAplicado(null)
    setShowExcluirPlaybookDialog(false)
  }

  // Calcular dias restantes do prazo
  const calcularDiasRestantes = (prazo: string) => {
    const hoje = new Date()
    const dataPrazo = new Date(prazo)
    const diffTime = dataPrazo.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Cores baseadas no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "triagem": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "em_maturacao": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "em_investigacao": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "diligencia": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "minuta": return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
      case "concluido": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "triagem": return "Triagem"
      case "em_maturacao": return "Em Maturação"
      case "em_investigacao": return "Em Investigação"
      case "diligencia": return "Diligência"
      case "minuta": return "Minuta"
      case "concluido": return "Concluído"
      default: return status
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "urgente": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "alta": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "media": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "baixa": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getEtapaIcon = (etapa: string) => {
    switch (etapa) {
      case "portaria": return <FileText className="size-4" />
      case "diligencias": return <Target className="size-4" />
      case "oitivas": return <User className="size-4" />
      case "minutas": return <FileText className="size-4" />
      case "relatorio": return <ListChecks className="size-4" />
      default: return <Circle className="size-4" />
    }
  }

  if (!investigacao) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="size-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Investigação não encontrada</h2>
        <p className="mt-2 text-muted-foreground">O código {codigo} não corresponde a nenhuma investigação.</p>
        <Button className="mt-6" onClick={() => router.push("/cases?mode=investigacao")}>
          <ChevronLeft className="mr-2 size-4" />
          Voltar para Investigações
        </Button>
      </div>
    )
  }

  const diasRestantes = calcularDiasRestantes(investigacao.prazo)

  // Página dedicada de condução de oitiva
  if (modoOitiva === "ambiente" && oitivaSelecionada) {
    return (
      <div className="space-y-6">
        {/* Header da página de oitiva */}
        <div className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={voltarParaLista}>
              <ChevronLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mic className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Realizar Oitiva</h1>
                <p className="text-muted-foreground">
                  {oitivaSelecionada.pessoa} • <span className="font-mono">{investigacao.codigo}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getTipoOitivaLabel(oitivaSelecionada.tipo)}</Badge>
            <Badge className={getStatusOitivaColor(oitivaSelecionada.status)}>
              {getStatusOitivaLabel(oitivaSelecionada.status)}
            </Badge>
            <Button variant="outline" className="gap-2" onClick={voltarParaLista}>
              <ChevronLeft className="size-4" />
              Voltar para Oitivas
            </Button>
          </div>
        </div>

        {/* Indicador de gravação ativa */}
        {gravando && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-red-600" />
            </span>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Gravação em andamento • {Math.floor(tempoGravacao / 60).toString().padStart(2, '0')}:{(tempoGravacao % 60).toString().padStart(2, '0')}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Informações da pessoa */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCircle2 className="size-4" />
                Dados do Depoente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{oitivaSelecionada.pessoa}</p>
                  </div>
                  {oitivaSelecionada.cpf && (
                    <div>
                      <span className="text-muted-foreground">CPF:</span>
                      <p className="font-medium">{oitivaSelecionada.cpf}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Qualificação:</span>
                    <p className="font-medium">{getTipoOitivaLabel(oitivaSelecionada.tipo)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Responsável:</span>
                    <p className="font-medium">{oitivaSelecionada.responsavel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modo de registro da oitiva */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="size-4" />
                  Como deseja registrar a oitiva?
                </CardTitle>
                <CardDescription>
                  Escolha gravar o áudio com transcrição automática ou registrar o depoimento por escrito.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModoEntradaOitiva("gravar")}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                      modoEntradaOitiva === "gravar"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-full ${
                      modoEntradaOitiva === "gravar" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <Mic className="size-5" />
                    </div>
                    <span className="text-sm font-medium">Gravar áudio</span>
                    <span className="text-xs text-muted-foreground">Grave ou faça upload e transcreva automaticamente</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoEntradaOitiva("escrever")}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                      modoEntradaOitiva === "escrever"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-full ${
                      modoEntradaOitiva === "escrever" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <Pencil className="size-5" />
                    </div>
                    <span className="text-sm font-medium">Escrever manualmente</span>
                    <span className="text-xs text-muted-foreground">Registre o depoimento diretamente por escrito</span>
                  </button>
                </div>
              </CardContent>
          </Card>

          {/* Registro: gravação + transcrição lado a lado */}
          <div className={`grid gap-4 ${modoEntradaOitiva === "gravar" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* Gravador de Áudio */}
            {modoEntradaOitiva === "gravar" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mic className="size-4" />
                  Gravação de Áudio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Controles de gravação */}
                <div className="flex flex-col items-center gap-4">
                  <div className={`flex size-24 items-center justify-center rounded-full ${
                    gravando ? "bg-red-100 dark:bg-red-900/30 animate-pulse" : "bg-muted"
                  }`}>
                    {gravando ? (
                      <MicOff className="size-10 text-red-600" />
                    ) : (
                      <Mic className="size-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-mono font-bold">
                      {Math.floor(tempoGravacao / 60).toString().padStart(2, '0')}:
                      {(tempoGravacao % 60).toString().padStart(2, '0')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {gravando ? "Gravando..." : "Pronto para gravar"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!gravando ? (
                      <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={iniciarGravacao}>
                        <Mic className="size-4" />
                        Iniciar Gravação
                      </Button>
                    ) : (
                      <Button className="gap-2" variant="destructive" onClick={pararGravacao}>
                        <Square className="size-4" />
                        Parar Gravação
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Upload de áudio */}
                <div className="space-y-2">
                  <Label className="text-sm">Ou faça upload de um áudio gravado:</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 flex-1">
                      <Upload className="size-4" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>

                {/* Player de áudio (se houver) */}
                {oitivaSelecionada.audioUrl && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm">Áudio gravado:</Label>
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <Button size="sm" variant="ghost" className="size-10 p-0">
                          {audioPlayer.playing ? (
                            <PauseCircle className="size-8" />
                          ) : (
                            <PlayCircle className="size-8" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="h-2 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: '30%' }} />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>00:00</span>
                            <span>{oitivaSelecionada.duracaoAudio}</span>
                          </div>
                        </div>
                        <Volume2 className="size-4 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            )}

            {/* Área de Transcrição / Registro Escrito */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="size-4" />
                    {modoEntradaOitiva === "gravar" ? "Transcrição" : "Depoimento Escrito"}
                  </CardTitle>
                  {modoEntradaOitiva === "gravar" && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Sparkles className="size-3" />
                        Transcrever com IA
                      </Button>
                    </div>
                  )}
                </div>
                {modoEntradaOitiva === "escrever" && (
                  <CardDescription>
                    Registre o depoimento por escrito. A IA poderá gerar resumo, extrair entidades e a minuta a partir do texto.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {oitivaSelecionada.transcricao && modoEntradaOitiva === "gravar" ? (
                  <ScrollArea className="h-64 rounded-lg border p-3">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{oitivaSelecionada.transcricao}</pre>
                  </ScrollArea>
                ) : (
                  <Textarea 
                    placeholder={
                      modoEntradaOitiva === "gravar"
                        ? "Digite a transcrição manualmente ou use a transcrição automática..."
                        : "Registre aqui o depoimento. Ex.: Pergunta: ... Resposta: ..."
                    }
                    className="min-h-64"
                    value={transcricaoManual}
                    onChange={(e) => setTranscricaoManual(e.target.value)}
                  />
                )}
                {modoEntradaOitiva === "escrever" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" className="gap-1">
                      <Check className="size-3" />
                      Salvar Depoimento
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Sparkles className="size-3" />
                      Analisar com IA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Análise e Resultados da IA */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Interlocutores identificados */}
            {oitivaSelecionada.interlocutores && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="size-4" />
                    Interlocutores Identificados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {oitivaSelecionada.interlocutores.map((interlocutor, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                        <div className="flex items-center gap-2">
                          <UserCircle2 className="size-5 text-muted-foreground" />
                          <span className="font-medium">{interlocutor.nome}</span>
                        </div>
                        <Badge variant="outline">{interlocutor.papel}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo */}
            {oitivaSelecionada.resumo && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="size-4" />
                    Resumo da Oitiva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{oitivaSelecionada.resumo}</p>
                </CardContent>
              </Card>
            )}

            {/* Entidades extraídas */}
            {oitivaSelecionada.entidadesExtraidas && oitivaSelecionada.entidadesExtraidas.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Hash className="size-4" />
                    Entidades Extraídas
                  </CardTitle>
                  <CardDescription>
                    Informações identificadas automaticamente pela IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {oitivaSelecionada.entidadesExtraidas.map((entidade, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{entidade.tipo}</Badge>
                          <span className="text-sm">{entidade.valor}</span>
                        </div>
                        <Badge className={
                          entidade.relevancia === "alta" ? "bg-red-100 text-red-700" :
                          entidade.relevancia === "media" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        }>
                          {entidade.relevancia}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Minuta gerada */}
            {oitivaSelecionada.minutaGerada && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ClipboardList className="size-4" />
                      Minuta Gerada
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Pencil className="size-3" />
                        Editar
                      </Button>
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => aprovarMinuta(oitivaSelecionada.id)}>
                        <Check className="size-3" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48 rounded-lg border p-3">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{oitivaSelecionada.minutaGerada}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Diligências sugeridas */}
            {oitivaSelecionada.diligenciasSugeridas && oitivaSelecionada.diligenciasSugeridas.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="size-4 text-purple-500" />
                    Diligências Sugeridas
                  </CardTitle>
                  <CardDescription>
                    Novas diligências identificadas a partir desta oitiva
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {oitivaSelecionada.diligenciasSugeridas.map((diligencia, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-purple-50 dark:bg-purple-950/20 p-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-purple-500" />
                          <span className="text-sm">{diligencia}</span>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Plus className="size-3" />
                          Criar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações finais */}
            {!oitivaSelecionada.minutaGerada && oitivaSelecionada.transcricao && (
              <Card className="lg:col-span-2">
                <CardContent className="pt-4">
                  <Button className="w-full gap-2">
                    <Sparkles className="size-4" />
                    Gerar Minuta e Análise com IA
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Página dedicada de Solicitações
  if (abaAtiva === "solicitacoes") {
    return (
      <div className="space-y-6">
        {/* Header da página de solicitações */}
        <div className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => setAbaAtiva("sintese")}>
              <ChevronLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Send className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Solicitações</h1>
                <p className="text-muted-foreground">
                  {solicitacoes.length} {solicitacoes.length === 1 ? "solicitação" : "solicitações"} • <span className="font-mono">{investigacao.codigo}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="size-4" />
              Gerar Ofício
            </Button>
            <Button className="gap-2" onClick={() => setShowNovaSolicitacaoDialog(true)}>
              <Plus className="size-4" />
              Nova Solicitação
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setAbaAtiva("sintese")}>
              <ChevronLeft className="size-4" />
              Voltar
            </Button>
          </div>
        </div>

        {/* Alerta de solicitações vencidas */}
        {solicitacoesVencidas.length > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <AlertTriangle className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {solicitacoesVencidas.length} {solicitacoesVencidas.length === 1 ? "solicitação vencida" : "solicitações vencidas"} requerem atenção
              </p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                {solicitacoesVencidas.map(s => s.orgaoDestinatario).join(", ")}
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => setFiltroStatusSolicitacao("vencida")}
            >
              Ver Vencidas
            </Button>
          </div>
        )}

        {/* Filtro por status */}
        <div className="flex items-center gap-2">
          <Label className="text-sm">Filtrar por status:</Label>
          <Select value={filtroStatusSolicitacao} onValueChange={setFiltroStatusSolicitacao}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="criada">Criadas</SelectItem>
              <SelectItem value="enviada">Enviadas</SelectItem>
              <SelectItem value="aguardando_retorno">Aguardando Retorno</SelectItem>
              <SelectItem value="retornada">Retornadas</SelectItem>
              <SelectItem value="cumprida">Cumpridas</SelectItem>
              <SelectItem value="vencida">Vencidas</SelectItem>
              <SelectItem value="cancelada">Canceladas</SelectItem>
              <SelectItem value="inconclusiva">Inconclusivas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de solicitações */}
        <div className="space-y-3">
          {solicitacoesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Send className="size-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Nenhuma solicitação encontrada</p>
                <p className="text-sm text-muted-foreground">
                  {filtroStatusSolicitacao !== "all" 
                    ? "Tente ajustar o filtro de status."
                    : "Crie uma nova solicitação para começar."}
                </p>
              </CardContent>
            </Card>
          ) : (
            solicitacoesFiltradas.map((solicitacao) => (
              <Card key={solicitacao.id} className={`transition-all ${
                solicitacao.status === "vencida" ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10" : ""
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Informações principais */}
                    <div className="flex-1 space-y-3">
                      {/* Header da solicitação */}
                      <div className="flex items-start gap-3">
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${getStatusSolicitacaoColor(solicitacao.status)}`}>
                          {getTipoSolicitacaoIcon(solicitacao.tipo)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{getTipoSolicitacaoLabel(solicitacao.tipo)}</h4>
                            <Badge className={getStatusSolicitacaoColor(solicitacao.status)}>
                              {getStatusSolicitacaoLabel(solicitacao.status)}
                            </Badge>
                            {solicitacao.retornoRecebido && (
                              <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300">
                                <Check className="size-3" />
                                Retorno Recebido
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{solicitacao.descricao}</p>
                        </div>
                      </div>

                      {/* Detalhes */}
                      <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Destinatário:</span>
                          <span className="text-xs truncate max-w-40">{solicitacao.orgaoDestinatario}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Data:</span>
                          <span className="text-xs">{solicitacao.dataSolicitacao}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Timer className={`size-4 ${solicitacao.status === "vencida" ? "text-red-500" : "text-muted-foreground"}`} />
                          <span className="text-muted-foreground">Prazo:</span>
                          <span className={`text-xs font-medium ${solicitacao.status === "vencida" ? "text-red-600" : ""}`}>
                            {solicitacao.prazo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Responsável:</span>
                          <span className="text-xs">{solicitacao.responsavel}</span>
                        </div>
                        {solicitacao.documentoAnexado && (
                          <div className="flex items-center gap-2">
                            <Paperclip className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Documento:</span>
                            <a href="#" className="text-xs text-primary hover:underline truncate max-w-32">
                              {solicitacao.documentoAnexado}
                            </a>
                          </div>
                        )}
                        {solicitacao.pendenciaVinculada && (
                          <div className="flex items-center gap-2">
                            <Link2 className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Vinculada:</span>
                            <span className="text-xs truncate max-w-32">{solicitacao.pendenciaVinculada}</span>
                          </div>
                        )}
                      </div>

                      {/* Impacto no progresso */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">Impacto:</span>
                        <div className="flex items-center gap-1">
                          <Target className={`size-3 ${solicitacao.impactoProgresso === "materialidade" || solicitacao.impactoProgresso === "ambos" ? "text-blue-500" : "text-muted-foreground/40"}`} />
                          <span className={solicitacao.impactoProgresso === "materialidade" || solicitacao.impactoProgresso === "ambos" ? "text-blue-600" : "text-muted-foreground/60"}>
                            Materialidade
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className={`size-3 ${solicitacao.impactoProgresso === "autoria" || solicitacao.impactoProgresso === "ambos" ? "text-purple-500" : "text-muted-foreground/40"}`} />
                          <span className={solicitacao.impactoProgresso === "autoria" || solicitacao.impactoProgresso === "ambos" ? "text-purple-600" : "text-muted-foreground/60"}>
                            Autoria
                          </span>
                        </div>
                      </div>

                      {/* Resumo do retorno (se houver) */}
                      {solicitacao.resumoRetorno && (
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-3">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                Retorno em {solicitacao.dataRetorno}
                              </p>
                              <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                                {solicitacao.resumoRetorno}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                      {solicitacao.status === "criada" && (
                        <>
                          <Button 
                            size="sm" 
                            className="gap-1"
                            onClick={() => marcarComoEnviada(solicitacao.id)}
                          >
                            <Send className="size-3" />
                            Marcar Enviada
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                          >
                            <FileText className="size-3" />
                            Gerar Ofício
                          </Button>
                        </>
                      )}
                      {solicitacao.status === "enviada" && (
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => marcarAguardandoRetornoSolicitacao(solicitacao.id)}
                        >
                          <Pause className="size-3" />
                          Aguardar Retorno
                        </Button>
                      )}
                      {solicitacao.status === "aguardando_retorno" && (
                        <>
                          <Button 
                            size="sm" 
                            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Upload className="size-3" />
                            Anexar Retorno
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                          >
                            <RotateCcw className="size-3" />
                            Reenviar
                          </Button>
                        </>
                      )}
                      {solicitacao.status === "retornada" && (
                        <>
                          <Button 
                            size="sm" 
                            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => marcarCumpridaSolicitacao(solicitacao.id)}
                          >
                            <CheckCircle2 className="size-3" />
                            Marcar Cumprida
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                          >
                            <Sparkles className="size-3" />
                            Reprocessar com IA
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                          >
                            <Link2 className="size-3" />
                            Vincular a Diligência
                          </Button>
                        </>
                      )}
                      {solicitacao.status === "vencida" && (
                        <>
                          <Button 
                            size="sm" 
                            className="gap-1"
                          >
                            <RefreshCw className="size-3" />
                            Reativar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                          >
                            <RotateCcw className="size-3" />
                            Reenviar
                          </Button>
                        </>
                      )}
                      {solicitacao.status === "cumprida" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-1"
                        >
                          <TrendingUp className="size-3" />
                          Atualizar Progresso
                        </Button>
                      )}
                      
                      {/* Menu de mais ações */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Eye className="size-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="size-4" />
                            Abrir Documento
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Upload className="size-4" />
                            Anexar Documento
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="size-4" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Aviso informativo */}
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <AlertCircle className="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Gerenciamento de Solicitações
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Acompanhe o status de ofícios, requisições e demais solicitações externas. Os retornos podem ser reprocessados pela IA para extração automática de informações relevantes ao caso.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/cases?mode=investigacao")}>
          <ChevronLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Scale className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{investigacao.nome}</h1>
              <p className="text-muted-foreground font-mono">{investigacao.codigo}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={abaAtiva === "solicitacoes" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setAbaAtiva("solicitacoes")}
          >
            <Send className="size-4" />
            Solicitações
            {solicitacoesVencidas.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                {solicitacoesVencidas.length}
              </Badge>
            )}
          </Button>
          <Badge className={getStatusColor(investigacao.status)}>
            {getStatusLabel(investigacao.status)}
          </Badge>
          <Badge className={getPrioridadeColor(investigacao.prioridade)}>
            Prioridade {investigacao.prioridade}
          </Badge>
          {investigacao.bosVinculados.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Layers className="size-3" />
              Série ({investigacao.bosVinculados.length + 1} BOs)
            </Badge>
          )}
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Instauração</p>
                <p className="font-medium">{investigacao.dataInstauracao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-lg ${
                diasRestantes < 0 
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : diasRestantes <= 7 
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}>
                <Timer className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prazo</p>
                <p className="font-medium">{investigacao.prazo}</p>
                <p className={`text-xs ${
                  diasRestantes < 0 
                    ? "text-red-600 dark:text-red-400"
                    : diasRestantes <= 7 
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  {diasRestantes < 0 
                    ? `${Math.abs(diasRestantes)} dias atrasado` 
                    : diasRestantes === 0 
                    ? "Vence hoje" 
                    : `${diasRestantes} dias restantes`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Responsável</p>
                <p className="font-medium">{investigacao.responsavel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                {getEtapaIcon(investigacao.etapaAtual)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Etapa Atual</p>
                <p className="font-medium capitalize">{investigacao.etapaAtual}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4" />
            Progresso da Investigação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={investigacao.progresso} className="flex-1" />
            <span className="text-2xl font-bold text-primary">{investigacao.progresso}%</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {["portaria", "diligencias", "oitivas", "minutas", "relatorio"].map((etapa, index) => {
              const etapas = ["portaria", "diligencias", "oitivas", "minutas", "relatorio"]
              const etapaAtualIndex = etapas.indexOf(investigacao.etapaAtual)
              const isCompleted = index < etapaAtualIndex
              const isCurrent = index === etapaAtualIndex
              
              return (
                <div key={etapa} className="flex flex-col items-center gap-1">
                  <div className={`flex size-8 items-center justify-center rounded-full ${
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : isCurrent
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="size-4" />
                    ) : isCurrent ? (
                      <Play className="size-4" />
                    ) : (
                      <Circle className="size-4" />
                    )}
                  </div>
                  <span className={`text-xs capitalize ${isCurrent ? "font-medium" : "text-muted-foreground"}`}>
                    {etapa}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs de conteúdo */}
      <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sintese" className="gap-2">
            <Sparkles className="size-4" />
            Síntese do Caso
          </TabsTrigger>
          <TabsTrigger value="bos" className="gap-2">
            <FileText className="size-4" />
            Boletins ({bosRelacionados.length})
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="size-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="playbook" className="gap-2">
            <BookOpen className="size-4" />
            Playbook
          </TabsTrigger>
          <TabsTrigger value="diligencias" className="gap-2">
            <Target className="size-4" />
            Diligências
          </TabsTrigger>
          <TabsTrigger value="oitivas" className="gap-2">
            <Mic className="size-4" />
            Oitivas
          </TabsTrigger>
        </TabsList>

        {/* Síntese do Caso */}
        <TabsContent value="sintese" className="space-y-4">
          {/* Ações do resumo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-amber-500" />
              <span>Resumo gerado automaticamente pela IA com base nos documentos do caso</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="size-4" />
                Ver documentos usados
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="size-4" />
                Atualizar resumo
              </Button>
            </div>
          </div>

          {/* Resumo Factual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                Resumo Factual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {bosRelacionados.length > 0 ? (
                  <>
                    Trata-se de investigação instaurada para apurar ocorrência de {investigacao.nome.toLowerCase().includes("roubo") ? "roubo" : investigacao.nome.toLowerCase().includes("furto") ? "furto" : "crime"} registrada no(s) boletim(ns) de ocorrência {bosRelacionados.map(bo => bo.bo).join(", ")}. 
                    O fato ocorreu em {bosRelacionados[0]?.dataFato || "data não informada"} no bairro {bosRelacionados[0]?.bairro || "não informado"}, município de {bosRelacionados[0]?.municipio || "não informado"}.
                    {bosRelacionados[0]?.historico && ` ${bosRelacionados[0].historico.substring(0, 200)}${bosRelacionados[0].historico.length > 200 ? "..." : ""}`}
                  </>
                ) : (
                  "Resumo não disponível - nenhum boletim de ocorrência vinculado."
                )}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {bosRelacionados.length > 1 ? (
                  `A investigação envolve ${bosRelacionados.length} boletins de ocorrência correlacionados, sugerindo possível padrão de atuação. Os fatos registrados apresentam similaridades em relação ao modus operandi, local e/ou período de ocorrência.`
                ) : (
                  `O inquérito foi instaurado em ${investigacao.dataInstauracao || "data não informada"} com prazo previsto para ${investigacao.prazo || "não definido"}.`
                )}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Pessoas Envolvidas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="size-4" />
                  Pessoas Envolvidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bosRelacionados.map((bo, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-sm">
                      <span className="font-medium">{bo.envolvido || "Vítima não identificada"}</span>
                      <Badge variant="outline" className="text-xs">
                        {bo.envolvimento || "Vítima"}
                      </Badge>
                    </div>
                  ))}
                  {bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("suspeito")) && (
                    <div className="flex items-center justify-between rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2 text-sm">
                      <span className="font-medium text-amber-700 dark:text-amber-400">Suspeito(s) mencionado(s) no histórico</span>
                      <Badge variant="outline" className="text-xs border-amber-300">
                        A identificar
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Endereços */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4" />
                  Endereços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bosRelacionados.map((bo, index) => (
                    <div key={index} className="rounded-lg bg-muted/50 p-2 text-sm">
                      <p className="font-medium">{bo.endereco || "Endereço não informado"}</p>
                      <p className="text-xs text-muted-foreground">{bo.bairro}, {bo.municipio}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Telefones */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Phone className="size-4" />
                  Telefones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bosRelacionados.filter(bo => bo.celular).length > 0 ? (
                    bosRelacionados.filter(bo => bo.celular).map((bo, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-sm">
                        <span className="font-mono">{bo.celular}</span>
                        <span className="text-xs text-muted-foreground">{bo.envolvido || "Vítima"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum telefone registrado</p>
                  )}
                  {bosRelacionados.filter(bo => bo.imei).length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">IMEIs registrados:</p>
                      {bosRelacionados.filter(bo => bo.imei).map((bo, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Smartphone className="size-3 text-muted-foreground" />
                          <span className="font-mono text-xs">{bo.imei}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chaves PIX */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CreditCard className="size-4" />
                  Chaves PIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("pix")) ? (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2 text-sm">
                      <p className="font-medium text-amber-700 dark:text-amber-400">Menção a PIX identificada</p>
                      <p className="text-xs text-muted-foreground">Verificar histórico para extração de chaves</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma chave PIX identificada</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Veículos/Placas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Car className="size-4" />
                  Veículos/Placas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bosRelacionados.filter(bo => bo.placa || bo.objeto?.toLowerCase().includes("veículo")).length > 0 ? (
                    bosRelacionados.filter(bo => bo.placa || bo.objeto?.toLowerCase().includes("veículo")).map((bo, index) => (
                      <div key={index} className="rounded-lg bg-muted/50 p-2 text-sm">
                        <p className="font-mono font-medium">{bo.placa || "Placa não informada"}</p>
                        <p className="text-xs text-muted-foreground">{bo.objeto}</p>
                      </div>
                    ))
                  ) : bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("moto") || bo.historico?.toLowerCase().includes("veículo")) ? (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2 text-sm">
                      <p className="font-medium text-amber-700 dark:text-amber-400">Veículo mencionado no histórico</p>
                      <p className="text-xs text-muted-foreground">Verificar histórico para identificação</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum veículo identificado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Linha do tempo básica */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="size-4" />
                  Linha do Tempo dos Fatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bosRelacionados.sort((a, b) => new Date(a.dataFato).getTime() - new Date(b.dataFato).getTime()).map((bo, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          {index + 1}
                        </div>
                        {index < bosRelacionados.length - 1 && (
                          <div className="h-full w-px bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-medium">{bo.dataFato} às {bo.horaFato || "hora não informada"}</p>
                        <p className="text-xs text-muted-foreground">{bo.natureza} - {bo.bairro}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{bo.bo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Elementos de materialidade e indícios de autoria */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Elementos de Materialidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="size-4 text-blue-500" />
                  Elementos de Materialidade
                </CardTitle>
                <CardDescription>
                  Evidências que comprovam a existência do fato criminoso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    { texto: "Boletim(ns) de ocorrência registrado(s)", presente: bosRelacionados.length > 0 },
                    { texto: "Local do fato identificado", presente: bosRelacionados.some(bo => bo.endereco) },
                    { texto: "Data e hora do fato registradas", presente: bosRelacionados.some(bo => bo.dataFato && bo.horaFato) },
                    { texto: "Objeto do crime especificado", presente: bosRelacionados.some(bo => bo.objeto) },
                    { texto: "Vítima identificada", presente: bosRelacionados.some(bo => bo.envolvido) },
                    { texto: "Evidências documentadas", presente: bosRelacionados.some(bo => bo.evidencias && bo.evidencias.length > 0) },
                    { texto: "Imagens de câmeras requisitadas", presente: bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("cftv") || bo.historico?.toLowerCase().includes("câmera")) },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      {item.presente ? (
                        <Check className="size-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="size-4 text-red-400 flex-shrink-0" />
                      )}
                      <span className={item.presente ? "text-foreground" : "text-muted-foreground"}>
                        {item.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Indícios de Autoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4 text-purple-500" />
                  Indícios de Autoria
                </CardTitle>
                <CardDescription>
                  Elementos que apontam para possível(eis) autor(es)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    { texto: "Suspeito identificado ou descrito", presente: bosRelacionados.some(bo => bo.envolvimento === "Autor" || bo.historico?.toLowerCase().includes("suspeito")) },
                    { texto: "Características físicas descritas", presente: bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("altura") || bo.historico?.toLowerCase().includes("aparência") || bo.historico?.toLowerCase().includes("tatuagem")) },
                    { texto: "Veículo utilizado identificado", presente: bosRelacionados.some(bo => bo.placa || bo.historico?.toLowerCase().includes("moto") || bo.historico?.toLowerCase().includes("carro")) },
                    { texto: "Telefone ou IMEI vinculado", presente: bosRelacionados.some(bo => bo.celular || bo.imei) },
                    { texto: "Testemunhas identificadas", presente: bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("testemunha")) },
                    { texto: "Padrão de modus operandi", presente: bosRelacionados.length > 1 },
                    { texto: "Correlação com outros casos", presente: bosRelacionados.some(bo => bo.correlacoes && bo.correlacoes.length > 0) },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      {item.presente ? (
                        <Check className="size-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="size-4 text-red-400 flex-shrink-0" />
                      )}
                      <span className={item.presente ? "text-foreground" : "text-muted-foreground"}>
                        {item.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pendências e Próximas Diligências */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pendências Principais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Pendências Principais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {investigacao.diligencias?.filter(d => d.status === "pendente").slice(0, 5).map((diligencia, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Circle className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{diligencia.tipo}</span>
                        <p className="text-xs text-muted-foreground">Prazo: {diligencia.prazo}</p>
                      </div>
                    </li>
                  ))}
                  {(!investigacao.diligencias || investigacao.diligencias.filter(d => d.status === "pendente").length === 0) && (
                    <li className="text-sm text-muted-foreground">Nenhuma pendência registrada</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Próximas Diligências Sugeridas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-amber-500" />
                  Próximas Diligências Sugeridas
                </CardTitle>
                <CardDescription>
                  Sugestões baseadas na análise do caso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    bosRelacionados.some(bo => bo.celular || bo.imei) && "Requisição de ERBs e dados cadastrais",
                    bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("câmera") || bo.historico?.toLowerCase().includes("cftv")) && "Requisição de imagens de CFTV",
                    bosRelacionados.some(bo => bo.placa) && "Consulta de histórico do veículo",
                    bosRelacionados.some(bo => bo.historico?.toLowerCase().includes("pix")) && "Requisição de dados bancários",
                    bosRelacionados.length > 1 && "Análise de correlação entre os casos",
                    "Oitiva da(s) vítima(s)",
                    "Reconhecimento fotográfico",
                  ].filter(Boolean).slice(0, 5).map((sugestao, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Sparkles className="size-3 text-amber-500 flex-shrink-0 mt-1" />
                      <span>{sugestao}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Aviso */}
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <AlertCircle className="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Este resumo é gerado automaticamente com base nos documentos disponíveis. As informações são apresentadas de forma objetiva, sem emitir opinião ou conclusão sobre a investigação. A análise e decisão final são de responsabilidade do(a) investigador(a).
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Boletins de Ocorrência */}
        <TabsContent value="bos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="size-4" />
                Boletins de Ocorrência Vinculados
              </CardTitle>
              <CardDescription>
                {bosRelacionados.length} {bosRelacionados.length === 1 ? "BO vinculado" : "BOs vinculados"} a esta investigação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bosRelacionados.map(bo => (
                  <Link key={bo.id} href={`/cases/${bo.bo}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <FileText className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{bo.bo}</span>
                            {bo.bo === investigacao.boOrigem && (
                              <Badge variant="outline" className="text-xs">Principal</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {bo.natureza} - {bo.nome}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {bo.bairro}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {bo.dataFato}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="size-5 rotate-180 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          {/* Visão geral das etapas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4" />
                Progresso Visual do Caso
              </CardTitle>
              <CardDescription>
                Acompanhe o andamento de cada etapa da investigação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Barra de progresso horizontal */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso geral</span>
                  <span className="text-sm text-muted-foreground">
                    {etapasTimeline.filter(e => e.status === "concluida").length} de {etapasTimeline.length} etapas concluídas
                  </span>
                </div>
                <div className="flex gap-1">
                  {etapasTimeline.map((etapa) => (
                    <div 
                      key={etapa.id}
                      className={`h-2 flex-1 rounded-full ${
                        etapa.status === "concluida" ? "bg-emerald-500" :
                        etapa.status === "em_andamento" ? "bg-blue-500" :
                        etapa.status === "aguardando_retorno" ? "bg-amber-500" :
                        etapa.status === "sugerida_ia" ? "bg-purple-500" :
                        etapa.status === "vencida" ? "bg-red-500" :
                        etapa.status === "rejeitada" ? "bg-red-300" :
                        "bg-muted"
                      }`}
                      title={`${etapa.nome}: ${getStatusEtapaLabel(etapa.status)}`}
                    />
                  ))}
                </div>
              </div>

              {/* Timeline vertical detalhada */}
              <div className="relative">
                {/* Linha conectora */}
                <div className="absolute left-5 top-0 h-full w-0.5 bg-border" />
                
                <div className="space-y-4">
                  {etapasTimeline.map((etapa, index) => (
                    <div 
                      key={etapa.id} 
                      className={`relative flex gap-4 ${
                        etapa.status === "em_andamento" ? "scale-[1.01]" : ""
                      }`}
                    >
                      {/* Ícone de status */}
                      <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${getStatusEtapaColor(etapa.status)}`}>
                        {getStatusEtapaIcon(etapa.status)}
                      </div>
                      
                      {/* Conteúdo da etapa */}
                      <div className={`flex-1 rounded-lg border p-4 ${
                        etapa.status === "em_andamento" ? "border-blue-300 bg-blue-50/50 dark:bg-blue-950/20" :
                        etapa.status === "vencida" ? "border-red-300 bg-red-50/50 dark:bg-red-950/20" :
                        etapa.status === "sugerida_ia" ? "border-purple-200 bg-purple-50/50 dark:bg-purple-950/20" :
                        ""
                      }`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{etapa.nome}</h4>
                              <Badge className={getStatusEtapaColor(etapa.status)}>
                                {getStatusEtapaLabel(etapa.status)}
                              </Badge>
                              {etapa.status === "sugerida_ia" && (
                                <Badge variant="outline" className="gap-1 text-purple-600 border-purple-300">
                                  <Sparkles className="size-3" />
                                  IA
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{etapa.descricao}</p>
                          </div>
                          
                          {/* Datas e prazo */}
                          <div className="flex flex-wrap gap-3 text-xs">
                            {etapa.dataInicio && (
                              <div className="flex items-center gap-1">
                                <Calendar className="size-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Início:</span>
                                <span>{etapa.dataInicio}</span>
                              </div>
                            )}
                            {etapa.dataConclusao && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="size-3 text-emerald-500" />
                                <span className="text-muted-foreground">Concluído:</span>
                                <span>{etapa.dataConclusao}</span>
                              </div>
                            )}
                            {etapa.prazo && etapa.status !== "concluida" && (
                              <div className="flex items-center gap-1">
                                <Timer className={`size-3 ${etapa.status === "vencida" ? "text-red-500" : "text-muted-foreground"}`} />
                                <span className="text-muted-foreground">Prazo:</span>
                                <span className={etapa.status === "vencida" ? "text-red-600 font-medium" : ""}>
                                  {etapa.prazo}
                                </span>
                              </div>
                            )}
                            {etapa.responsavel && (
                              <div className="flex items-center gap-1">
                                <User className="size-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Resp.:</span>
                                <span>{etapa.responsavel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Itens da etapa */}
                        {etapa.itens && etapa.itens.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Itens desta etapa:</p>
                            <div className="grid gap-1.5 sm:grid-cols-2">
                              {etapa.itens.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-2 text-sm">
                                  {item.status === "concluido" ? (
                                    <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                                  ) : item.status === "em_andamento" ? (
                                    <Play className="size-3.5 text-blue-500 flex-shrink-0" />
                                  ) : (
                                    <Circle className="size-3.5 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <span className={item.status === "concluido" ? "text-muted-foreground" : ""}>
                                    {item.descricao}
                                  </span>
                                  {item.data && (
                                    <span className="text-xs text-muted-foreground ml-auto">{item.data}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Sugestão da IA */}
                        {etapa.sugestaoIA && (
                          <div className="mt-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 p-3">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="size-4 text-purple-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-purple-700 dark:text-purple-400">Sugest��o da IA</p>
                                <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">{etapa.sugestaoIA}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Ações para etapa em andamento */}
                        {etapa.status === "em_andamento" && (
                          <div className="mt-3 pt-3 border-t flex items-center gap-2">
                            <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                              <CheckCircle2 className="size-3" />
                              Concluir Etapa
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="size-3" />
                              Ver Detalhes
                            </Button>
                          </div>
                        )}
                        
                        {/* Ações para etapa sugerida */}
                        {etapa.status === "sugerida_ia" && (
                          <div className="mt-3 pt-3 border-t flex items-center gap-2">
                            <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                              <Check className="size-3" />
                              Confirmar
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <X className="size-3" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                        
                        {/* Ações para etapa vencida */}
                        {etapa.status === "vencida" && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
                              <AlertTriangle className="size-4" />
                              <span className="font-medium">Etapa vencida - requer atenção</span>
                            </div>
                            <Button size="sm" className="gap-1">
                              <RefreshCw className="size-3" />
                              Reativar com Novo Prazo
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legenda dos status */}
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm font-medium mb-3">Legenda dos Status</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                  </div>
                  <span className="text-sm">Concluída</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Play className="size-3" />
                  </div>
                  <span className="text-sm">Em Andamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <Circle className="size-3" />
                  </div>
                  <span className="text-sm">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    <Sparkles className="size-3" />
                  </div>
                  <span className="text-sm">Sugerida pela IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Pause className="size-3" />
                  </div>
                  <span className="text-sm">Aguardando Retorno</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <AlertTriangle className="size-3" />
                  </div>
                  <span className="text-sm">Vencida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <X className="size-3" />
                  </div>
                  <span className="text-sm">Rejeitada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Playbook */}
        <TabsContent value="playbook" className="space-y-4">
          {/* Cabeçalho da aba com ações */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Playbook aplicado</h2>
              <p className="text-sm text-muted-foreground">
                Procedimento operacional padrão que orienta esta investigação.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {playbookAplicado && (
                <>
                  <Button variant="outline" size="sm" className="gap-2" onClick={abrirEditarPlaybook}>
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => setShowExcluirPlaybookDialog(true)}
                  >
                    <Trash2 className="size-4" />
                    Excluir
                  </Button>
                </>
              )}
              <Button
                size="sm"
                className="gap-2"
                onClick={() => {
                  setPlaybookSelecionadoId("")
                  setShowAplicarPlaybookDialog(true)
                }}
              >
                <Plus className="size-4" />
                {playbookAplicado ? "Trocar playbook" : "Adicionar playbook"}
              </Button>
            </div>
          </div>

          {playbookAplicado ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="size-4" />
                      {playbookAplicado.nome}
                    </CardTitle>
                    <CardDescription className="mt-1">{playbookAplicado.descricao}</CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0 font-mono">
                    {playbookAplicado.codigo}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Scale className="size-3" />
                    {playbookAplicado.tipoCrime}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Objetivo e condição de uso */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Target className="size-4 text-muted-foreground" />
                      Objetivo
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{playbookAplicado.objetivo}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <AlertCircle className="size-4 text-muted-foreground" />
                      Condição de uso
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{playbookAplicado.condicaoUso}</p>
                  </div>
                </div>

                <Separator />

                {/* Passos do procedimento com progresso por etapa */}
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <ListChecks className="size-4 text-muted-foreground" />
                    Passos do procedimento
                  </p>
                  <div className="space-y-3">
                    {playbookAplicado.passos.map((passo, index) => {
                      const total = playbookAplicado.passos.length
                      const etapaAtualIndex = etapasOrdem.indexOf(investigacao.etapaAtual)
                      const progresso = (etapaAtualIndex + 1) / etapasOrdem.length
                      const passoLimite = Math.round(progresso * total)
                      const isCompleted = index < passoLimite - 1
                      const isCurrent = index === passoLimite - 1

                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-3 rounded-lg border p-3 ${
                            isCurrent ? "border-primary bg-primary/5" : ""
                          }`}
                        >
                          <div
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : isCurrent
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex flex-1 items-center justify-between gap-2">
                            <p className="text-sm">{passo}</p>
                            {isCurrent && (
                              <Badge className="shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Atual
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                OK
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Responsáveis, documentos e diligências sugeridas */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Users className="size-4 text-muted-foreground" />
                      Responsáveis
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {playbookAplicado.responsaveis.map((r, i) => (
                        <Badge key={i} variant="secondary">{r}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <FileText className="size-4 text-muted-foreground" />
                      Documentos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {playbookAplicado.documentos.map((d, i) => (
                        <Badge key={i} variant="outline">{d}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Lightbulb className="size-4 text-muted-foreground" />
                      Diligências sugeridas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {playbookAplicado.diligenciasSugeridas.map((d, i) => (
                        <Badge key={i} variant="outline">{d}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="size-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Nenhum playbook aplicado</p>
                <p className="text-sm text-muted-foreground">
                  Esta investigação não tem um playbook associado.
                </p>
                <Button
                  className="mt-4 gap-2"
                  onClick={() => {
                    setPlaybookSelecionadoId("")
                    setShowAplicarPlaybookDialog(true)
                  }}
                >
                  <Plus className="size-4" />
                  Adicionar playbook
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Diligências */}
        <TabsContent value="diligencias" className="space-y-4">
          {/* Header com filtros e ações */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Filtrar por status:</Label>
              <Select value={filtroStatusDiligencia} onValueChange={setFiltroStatusDiligencia}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="sugerida">Sugeridas</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="aguardando_retorno">Aguardando Retorno</SelectItem>
                  <SelectItem value="cumprida">Cumpridas</SelectItem>
                  <SelectItem value="rejeitada">Rejeitadas</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2">
              <Plus className="size-4" />
              Nova Diligência
            </Button>
          </div>

          {/* Lista de diligências */}
          <div className="space-y-3">
            {diligenciasFiltradas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="size-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">Nenhuma diligência encontrada</p>
                  <p className="text-sm text-muted-foreground">
                    {filtroStatusDiligencia !== "all" 
                      ? "Tente ajustar o filtro de status."
                      : "Adicione uma nova diligência para começar."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              diligenciasFiltradas.map((diligencia) => (
                <Card key={diligencia.id} className={`transition-all ${
                  diligencia.status === "vencida" ? "border-red-300 dark:border-red-800" :
                  diligencia.status === "sugerida" ? "border-purple-200 dark:border-purple-800" : ""
                }`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      {/* Informações principais */}
                      <div className="flex-1 space-y-3">
                        {/* Header da diligência */}
                        <div className="flex items-start gap-3">
                          <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${getStatusDiligenciaColor(diligencia.status)}`}>
                            {getStatusDiligenciaIcon(diligencia.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium">{diligencia.tipo}</h4>
                              <Badge className={getStatusDiligenciaColor(diligencia.status)}>
                                {getStatusDiligenciaLabel(diligencia.status)}
                              </Badge>
                              {diligencia.origemSugestao === "IA" && (
                                <Badge variant="outline" className="gap-1 text-purple-600 border-purple-300">
                                  <Sparkles className="size-3" />
                                  IA
                                </Badge>
                              )}
                              {diligencia.origemSugestao === "Playbook" && (
                                <Badge variant="outline" className="gap-1 text-blue-600 border-blue-300">
                                  <BookOpen className="size-3" />
                                  Playbook
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{diligencia.descricao}</p>
                          </div>
                        </div>

                        {/* Detalhes */}
                        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          {diligencia.documentoOrigem && (
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Origem:</span>
                              <span className="font-mono text-xs">{diligencia.documentoOrigem}</span>
                            </div>
                          )}
                          {diligencia.entidadeVinculada && (
                            <div className="flex items-center gap-2">
                              <Link2 className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Entidade:</span>
                              <span className="text-xs truncate max-w-32">{diligencia.entidadeVinculada}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Responsável:</span>
                            <span className="text-xs">{diligencia.responsavel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Prazo:</span>
                            <span className={`text-xs font-medium ${
                              diligencia.status === "vencida" ? "text-red-600" : ""
                            }`}>{diligencia.prazo}</span>
                          </div>
                        </div>

                        {/* Impacto */}
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">Impacto:</span>
                          <div className="flex items-center gap-1">
                            <Target className={`size-3 ${diligencia.impactoMaterialidade ? "text-blue-500" : "text-muted-foreground/40"}`} />
                            <span className={diligencia.impactoMaterialidade ? "text-blue-600" : "text-muted-foreground/60"}>
                              Materialidade
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className={`size-3 ${diligencia.impactoAutoria ? "text-purple-500" : "text-muted-foreground/40"}`} />
                            <span className={diligencia.impactoAutoria ? "text-purple-600" : "text-muted-foreground/60"}>
                              Autoria
                            </span>
                          </div>
                        </div>

                        {/* Explicação da IA */}
                        {diligencia.explicacaoIA && (
                          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 p-3">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="size-4 text-purple-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-purple-700 dark:text-purple-400">Explicação da IA</p>
                                <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">{diligencia.explicacaoIA}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                        {diligencia.status === "sugerida" && (
                          <>
                            <Button 
                              size="sm" 
                              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => confirmarDiligencia(diligencia.id)}
                            >
                              <Check className="size-3" />
                              Confirmar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1"
                              onClick={() => {
                                setDiligenciaParaExcluir(diligencia.id)
                                setShowExcluirDiligenciaDialog(true)
                              }}
                            >
                              <X className="size-3" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        {diligencia.status === "confirmada" && (
                          <Button 
                            size="sm" 
                            className="gap-1"
                            onClick={() => marcarEmAndamento(diligencia.id)}
                          >
                            <Play className="size-3" />
                            Iniciar
                          </Button>
                        )}
                        {diligencia.status === "em_andamento" && (
                          <>
                            <Button 
                              size="sm" 
                              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => marcarCumprida(diligencia.id)}
                            >
                              <CheckCircle2 className="size-3" />
                              Marcar Cumprida
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1"
                              onClick={() => marcarAguardandoRetorno(diligencia.id)}
                            >
                              <Pause className="size-3" />
                              Aguardar Retorno
                            </Button>
                          </>
                        )}
                        {diligencia.status === "aguardando_retorno" && (
                          <>
                            <Button 
                              size="sm" 
                              className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => marcarCumprida(diligencia.id)}
                            >
                              <CheckCircle2 className="size-3" />
                              Marcar Cumprida
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1"
                            >
                              <Upload className="size-3" />
                              Anexar Retorno
                            </Button>
                          </>
                        )}
                        {(diligencia.status === "vencida") && (
                          <Button 
                            size="sm" 
                            className="gap-1"
                            onClick={() => marcarEmAndamento(diligencia.id)}
                          >
                            <RefreshCw className="size-3" />
                            Reativar
                          </Button>
                        )}
                        
                        {/* Menu de mais ações */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Pencil className="size-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Eye className="size-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Upload className="size-4" />
                              Anexar Documento
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 text-red-600"
                              onClick={() => {
                                setDiligenciaParaExcluir(diligencia.id)
                                setShowExcluirDiligenciaDialog(true)
                              }}
                            >
                              <Trash2 className="size-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Aviso sobre diligências da IA */}
          <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
            <Sparkles className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Diligências sugeridas pela IA
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                As sugestões são baseadas na análise dos documentos do caso. A confirmação ou rejeição das diligências é de responsabilidade do investigador. Seu feedback ajuda a melhorar as sugestões futuras.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Oitivas */}
        <TabsContent value="oitivas" className="space-y-4">
          {(
            <>
              {/* Header com filtros e ações */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filtrar por status:</Label>
                  <Select value={filtroStatusOitiva} onValueChange={setFiltroStatusOitiva}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="agendada">Agendadas</SelectItem>
                      <SelectItem value="em_gravacao">Em Gravação</SelectItem>
                      <SelectItem value="transcrita">Transcritas</SelectItem>
                      <SelectItem value="em_revisao">Em Revisão</SelectItem>
                      <SelectItem value="minuta_gerada">Minuta Gerada</SelectItem>
                      <SelectItem value="aprovada">Aprovadas</SelectItem>
                      <SelectItem value="cancelada">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Agendar Oitiva
                </Button>
              </div>

              {/* Lista de oitivas */}
              <div className="space-y-3">
                {oitivasFiltradas.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Mic className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">Nenhuma oitiva encontrada</p>
                      <p className="text-sm text-muted-foreground">
                        {filtroStatusOitiva !== "all" 
                          ? "Tente ajustar o filtro de status."
                          : "Agende uma nova oitiva para começar."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  oitivasFiltradas.map((oitiva) => (
                    <Card key={oitiva.id} className={`transition-all cursor-pointer hover:border-primary/50 ${
                      oitiva.status === "em_gravacao" ? "border-red-300 dark:border-red-800 animate-pulse" : ""
                    }`} onClick={() => abrirAmbienteOitiva(oitiva)}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          {/* Informações principais */}
                          <div className="flex-1 space-y-3">
                            {/* Header da oitiva */}
                            <div className="flex items-start gap-3">
                              <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${getStatusOitivaColor(oitiva.status)}`}>
                                {getTipoOitivaIcon(oitiva.tipo)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-medium">{oitiva.pessoa}</h4>
                                  <Badge variant="outline">{getTipoOitivaLabel(oitiva.tipo)}</Badge>
                                  <Badge className={getStatusOitivaColor(oitiva.status)}>
                                    {getStatusOitivaLabel(oitiva.status)}
                                  </Badge>
                                </div>
                                {oitiva.cpf && (
                                  <p className="text-sm text-muted-foreground mt-1">CPF: {oitiva.cpf}</p>
                                )}
                              </div>
                            </div>

                            {/* Detalhes */}
                            <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                              {oitiva.dataAgendada && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="size-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Data:</span>
                                  <span className="text-xs">{oitiva.dataAgendada} às {oitiva.horaAgendada}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <User className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Responsável:</span>
                                <span className="text-xs">{oitiva.responsavel}</span>
                              </div>
                              {oitiva.duracaoAudio && (
                                <div className="flex items-center gap-2">
                                  <Clock className="size-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Duração:</span>
                                  <span className="text-xs">{oitiva.duracaoAudio}</span>
                                </div>
                              )}
                              {oitiva.diligenciaVinculada && (
                                <div className="flex items-center gap-2">
                                  <Link2 className="size-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Vinculada:</span>
                                  <span className="text-xs truncate max-w-32">{oitiva.diligenciaVinculada}</span>
                                </div>
                              )}
                            </div>

                            {/* Resumo (se houver) */}
                            {oitiva.resumo && (
                              <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Resumo:</p>
                                <p className="text-sm line-clamp-2">{oitiva.resumo}</p>
                              </div>
                            )}

                            {/* Entidades extraídas (preview) */}
                            {oitiva.entidadesExtraidas && oitiva.entidadesExtraidas.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {oitiva.entidadesExtraidas.slice(0, 4).map((entidade, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {entidade.tipo}: {entidade.valor}
                                  </Badge>
                                ))}
                                {oitiva.entidadesExtraidas.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{oitiva.entidadesExtraidas.length - 4} mais
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Ações */}
                          <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end" onClick={(e) => e.stopPropagation()}>
                            {oitiva.status === "agendada" && (
                              <Button size="sm" className="gap-1" onClick={() => abrirAmbienteOitiva(oitiva)}>
                                <Mic className="size-3" />
                                Iniciar Oitiva
                              </Button>
                            )}
                            {oitiva.status === "minuta_gerada" && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => aprovarMinuta(oitiva.id)}
                                >
                                  <Check className="size-3" />
                                  Aprovar Minuta
                                </Button>
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Eye className="size-3" />
                                  Revisar
                                </Button>
                              </>
                            )}
                            {oitiva.status === "aprovada" && (
                              <Button size="sm" variant="outline" className="gap-1">
                                <FileText className="size-3" />
                                Ver Minuta
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2" onClick={() => abrirAmbienteOitiva(oitiva)}>
                                  <Eye className="size-4" />
                                  Abrir Ambiente
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Pencil className="size-4" />
                                  Editar
                                </DropdownMenuItem>
                                {oitiva.audioUrl && (
                                  <DropdownMenuItem className="gap-2">
                                    <FileAudio className="size-4" />
                                    Baixar Áudio
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-red-600">
                                  <X className="size-4" />
                                  Cancelar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}

          {/* Aviso informativo */}
          {modoOitiva === "lista" && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <Mic className="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Ambiente de Oitivas
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Grave, transcreva e analise depoimentos. A IA auxilia na transcrição, identificação de interlocutores, extração de entidades relevantes e geração de minutas estruturadas.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Exclusão/Rejeição de Diligência */}
      <Dialog open={showExcluirDiligenciaDialog} onOpenChange={(open) => {
        setShowExcluirDiligenciaDialog(open)
        if (!open) {
          setDiligenciaParaExcluir(null)
          setMotivoExclusao("")
          setObservacaoExclusao("")
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Justificar Exclusão/Rejeição
            </DialogTitle>
            <DialogDescription>
              {diligenciaParaExcluir && diligenciasExtendidas.find(d => d.id === diligenciaParaExcluir)?.origemSugestao === "IA" && (
                <span>Esta é uma sugestão da IA. Sua justificativa ajudará a melhorar as sugestões futuras.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Diligência sendo excluída */}
            {diligenciaParaExcluir && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-sm">
                  {diligenciasExtendidas.find(d => d.id === diligenciaParaExcluir)?.tipo}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {diligenciasExtendidas.find(d => d.id === diligenciaParaExcluir)?.descricao}
                </p>
              </div>
            )}
            
            {/* Motivo */}
            <div className="space-y-2">
              <Label>Motivo da exclusão *</Label>
              <Select value={motivoExclusao} onValueChange={setMotivoExclusao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent>
                  {motivosExclusao.map(motivo => (
                    <SelectItem key={motivo.value} value={motivo.value}>
                      {motivo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Observação */}
            <div className="space-y-2">
              <Label>Observação adicional (opcional)</Label>
              <Textarea
                placeholder="Adicione detalhes sobre a justificativa..."
                value={observacaoExclusao}
                onChange={(e) => setObservacaoExclusao(e.target.value)}
                rows={3}
              />
            </div>
            
            {/* Aviso de feedback */}
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
              <AlertCircle className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Este feedback será registrado para melhorar as sugestões da IA em casos futuros.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExcluirDiligenciaDialog(false)}>
              Cancelar
            </Button>
            <Button 
              className="gap-2 bg-red-600 hover:bg-red-700"
              onClick={excluirDiligencia}
              disabled={!motivoExclusao}
            >
              <Trash2 className="size-4" />
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Exportar Relatório
        </Button>
        <Button 
          onClick={() => setShowAvancarDialog(true)}
          disabled={isUltimaEtapa}
          className="gap-2"
        >
          <ArrowRight className="size-4" />
          {isUltimaEtapa ? "Última Etapa" : "Avançar Etapa"}
        </Button>
      </div>

      {/* Dialog de Avançar Etapa */}
      <Dialog open={showAvancarDialog} onOpenChange={setShowAvancarDialog}>
        <DialogContent className="sm:max-w-md">
          {avancouSucesso ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-4 text-lg font-medium">Etapa avançada com sucesso!</p>
              <p className="text-sm text-muted-foreground">
                Agora em: {getEtapaLabel(proximaEtapa || "")}
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowRight className="size-5" />
                  Avançar Etapa do Inquérito
                </DialogTitle>
                <DialogDescription>
                  Confirme o avanço da etapa da investigação {investigacao?.codigo}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Etapa atual e próxima */}
                <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <Play className="size-5" />
                    </div>
                    <span className="text-sm font-medium">{getEtapaLabel(investigacao?.etapaAtual || "")}</span>
                    <Badge variant="secondary">Atual</Badge>
                  </div>
                  
                  <ArrowRight className="size-6 text-muted-foreground" />
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Target className="size-5" />
                    </div>
                    <span className="text-sm font-medium">{getEtapaLabel(proximaEtapa || "")}</span>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Próxima
                    </Badge>
                  </div>
                </div>

                {/* Checklist de confirmação */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Antes de avançar, confirme:</p>
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-600" />
                      <span>Todas as tarefas da etapa atual foram concluídas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-600" />
                      <span>Os documentos necessários foram anexados</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-600" />
                      <span>As informações estão corretas e atualizadas</span>
                    </div>
                  </div>
                </div>

                {/* Aviso */}
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <p className="text-sm">
                    Esta ação irá registrar o avanço da etapa no histórico do inquérito e não pode ser desfeita.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAvancarDialog(false)}
                  disabled={avancando}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAvancarEtapa}
                  disabled={avancando}
                  className="gap-2"
                >
                  {avancando ? (
                    <>
                      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Avançando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="size-4" />
                      Confirmar Avanço
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Aplicar / Trocar Playbook */}
      <Dialog open={showAplicarPlaybookDialog} onOpenChange={setShowAplicarPlaybookDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{playbookAplicado ? "Trocar playbook" : "Adicionar playbook"}</DialogTitle>
            <DialogDescription>
              Selecione um procedimento operacional padrão da biblioteca para orientar esta investigação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Playbook</Label>
              <Select value={playbookSelecionadoId} onValueChange={setPlaybookSelecionadoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um playbook" />
                </SelectTrigger>
                <SelectContent>
                  {playbooks.map((pb) => (
                    <SelectItem key={pb.id} value={pb.id}>
                      {pb.codigo} — {pb.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {playbookSelecionadoId && (() => {
              const pb = playbooks.find((p) => p.id === playbookSelecionadoId)
              if (!pb) return null
              return (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm font-medium">{pb.nome}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pb.descricao}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{pb.tipoCrime}</Badge>
                    <Badge variant="outline">{pb.passos.length} passos</Badge>
                  </div>
                </div>
              )
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAplicarPlaybookDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={aplicarPlaybook} disabled={!playbookSelecionadoId} className="gap-2">
              <Check className="size-4" />
              {playbookAplicado ? "Trocar" : "Aplicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar Playbook */}
      <Dialog open={showEditarPlaybookDialog} onOpenChange={setShowEditarPlaybookDialog}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar playbook aplicado</DialogTitle>
            <DialogDescription>
              Ajuste o nome, a descrição e os passos do procedimento para esta investigação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="pb-nome">Nome</Label>
              <Input
                id="pb-nome"
                value={playbookEditNome}
                onChange={(e) => setPlaybookEditNome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pb-descricao">Descrição</Label>
              <Textarea
                id="pb-descricao"
                value={playbookEditDescricao}
                onChange={(e) => setPlaybookEditDescricao(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Passos do procedimento</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setPlaybookEditPassos([...playbookEditPassos, ""])}
                >
                  <Plus className="size-3" />
                  Adicionar passo
                </Button>
              </div>
              <div className="space-y-2">
                {playbookEditPassos.map((passo, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="mt-2.5 text-sm text-muted-foreground">{index + 1}.</span>
                    <Input
                      value={passo}
                      onChange={(e) => {
                        const novos = [...playbookEditPassos]
                        novos[index] = e.target.value
                        setPlaybookEditPassos(novos)
                      }}
                      placeholder="Descreva o passo"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => setPlaybookEditPassos(playbookEditPassos.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                {playbookEditPassos.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhum passo. Adicione ao menos um passo.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditarPlaybookDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarEdicaoPlaybook} className="gap-2">
              <Check className="size-4" />
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Excluir Playbook */}
      <Dialog open={showExcluirPlaybookDialog} onOpenChange={setShowExcluirPlaybookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir playbook</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o playbook
              {playbookAplicado ? ` "${playbookAplicado.nome}"` : ""} desta investigação? Esta ação
              pode ser desfeita aplicando o playbook novamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExcluirPlaybookDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluirPlaybook} className="gap-2">
              <Trash2 className="size-4" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
