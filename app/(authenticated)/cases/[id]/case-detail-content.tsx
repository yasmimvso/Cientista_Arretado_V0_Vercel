"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  MapPin,
  Calendar,
  User,
  Phone,
  CreditCard,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  ChevronRight,
  Scale,
  FileSearch,
  Link2,
  Lightbulb,
  BookOpen,
  Send,
  Info,
  TrendingUp,
  Shield,
  Target,
  Zap,
  Users,
  Building2,
  Hash,
  Plus,
  X,
  Mail,
  MessageSquare,
  Truck,
  Search,
  UserPlus,
  Check,
  Eye,
  ListChecks,
  ClipboardList,
  Rocket,
  Sparkles,
  Edit,
  Copy,
  Save,
  Pencil,
  ShieldAlert,
  Network
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  boletinsOcorrencia,
  investigacoes,
  correlacoes,
  playbooks,
  getMaturacaoColor,
  getMaturacaoLabel,
  getStatusColor,
  getStatusLabel,
  type BoletimOcorrencia,
  type Investigacao,
  type Playbook
} from "@/lib/data"

// Tipo para pessoa envolvida
interface PessoaEnvolvida {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  tipo: "vitima" | "testemunha" | "suspeito" | "informante" | "outro"
  selecionada: boolean
  isNew?: boolean
}

// Tipos de ofícios disponíveis
interface TipoOficio {
  id: string
  nome: string
  descricao: string
  icone: "phone" | "bank" | "camera" | "car" | "document" | "police" | "hospital" | "company"
  cor: string
  campos: {
    id: string
    label: string
    tipo: "text" | "select" | "date" | "textarea"
    obrigatorio: boolean
    opcoes?: string[]
    placeholder?: string
  }[]
}

const tiposOficios: TipoOficio[] = [
  {
    id: "operadora",
    nome: "Requisição de Dados Telefônicos",
    descricao: "Solicitar dados cadastrais e registros de chamadas às operadoras",
    icone: "phone",
    cor: "blue",
    campos: [
      { id: "operadora", label: "Operadora", tipo: "select", obrigatorio: true, opcoes: ["Vivo", "Claro", "TIM", "Oi", "Todas"] },
      { id: "numero", label: "Número do Telefone", tipo: "text", obrigatorio: true, placeholder: "(00) 00000-0000" },
      { id: "periodo_inicio", label: "Período Inicial", tipo: "date", obrigatorio: true },
      { id: "periodo_fim", label: "Período Final", tipo: "date", obrigatorio: true },
      { id: "tipo_dados", label: "Tipo de Dados", tipo: "select", obrigatorio: true, opcoes: ["Dados Cadastrais", "Registros de Chamadas", "Localização ERBs", "Todos"] },
    ]
  },
  {
    id: "banco",
    nome: "Requisição de Dados Bancários",
    descricao: "Solicitar extratos e informações de contas bancárias",
    icone: "bank",
    cor: "emerald",
    campos: [
      { id: "banco", label: "Instituição Financeira", tipo: "select", obrigatorio: true, opcoes: ["Banco do Brasil", "Caixa Econômica", "Itaú", "Bradesco", "Santander", "Nubank", "Inter", "Outro"] },
      { id: "tipo_conta", label: "Tipo de Conta", tipo: "select", obrigatorio: true, opcoes: ["Conta Corrente", "Poupança", "PIX", "Todas"] },
      { id: "cpf_titular", label: "CPF do Titular", tipo: "text", obrigatorio: true, placeholder: "000.000.000-00" },
      { id: "periodo_inicio", label: "Período Inicial", tipo: "date", obrigatorio: true },
      { id: "periodo_fim", label: "Período Final", tipo: "date", obrigatorio: true },
    ]
  },
  {
    id: "cameras",
    nome: "Requisição de Imagens de Câmeras",
    descricao: "Solicitar imagens de câmeras de segurança públicas ou privadas",
    icone: "camera",
    cor: "amber",
    campos: [
      { id: "local", label: "Local/Endereço", tipo: "text", obrigatorio: true, placeholder: "Endereço completo" },
      { id: "orgao", label: "Órgão/Estabelecimento", tipo: "select", obrigatorio: true, opcoes: ["Prefeitura", "DETRAN", "Estabelecimento Comercial", "Condomínio", "Outro"] },
      { id: "data_hora", label: "Data e Hora do Fato", tipo: "text", obrigatorio: true, placeholder: "DD/MM/AAAA HH:MM" },
      { id: "descricao", label: "Descrição do que buscar", tipo: "textarea", obrigatorio: false, placeholder: "Descreva o que deve ser observado nas imagens" },
    ]
  },
  {
    id: "detran",
    nome: "Requisição DETRAN/CIRETRAN",
    descricao: "Solicitar informações de veículos e condutores",
    icone: "car",
    cor: "purple",
    campos: [
      { id: "tipo_consulta", label: "Tipo de Consulta", tipo: "select", obrigatorio: true, opcoes: ["Dados do Veículo", "Dados do Proprietário", "Infrações", "Histórico de Transferências"] },
      { id: "placa", label: "Placa do Veículo", tipo: "text", obrigatorio: false, placeholder: "ABC-1234" },
      { id: "renavam", label: "RENAVAM", tipo: "text", obrigatorio: false, placeholder: "00000000000" },
      { id: "cnh", label: "CNH", tipo: "text", obrigatorio: false, placeholder: "00000000000" },
    ]
  },
  {
    id: "cartorio",
    nome: "Requisição a Cartórios",
    descricao: "Solicitar certidões e documentos cartoriais",
    icone: "document",
    cor: "slate",
    campos: [
      { id: "tipo_cartorio", label: "Tipo de Cartório", tipo: "select", obrigatorio: true, opcoes: ["Registro Civil", "Registro de Imóveis", "Notas", "Protesto", "Títulos e Documentos"] },
      { id: "tipo_documento", label: "Tipo de Documento", tipo: "select", obrigatorio: true, opcoes: ["Certidão de Nascimento", "Certidão de Casamento", "Certidão de Óbito", "Matrícula de Imóvel", "Escritura", "Outro"] },
      { id: "nome_interessado", label: "Nome do Interessado", tipo: "text", obrigatorio: true },
      { id: "cpf_interessado", label: "CPF", tipo: "text", obrigatorio: false, placeholder: "000.000.000-00" },
    ]
  },
  {
    id: "delegacia",
    nome: "Ofício para Outras Delegacias",
    descricao: "Comunicação oficial com outras unidades policiais",
    icone: "police",
    cor: "indigo",
    campos: [
      { id: "delegacia_destino", label: "Delegacia de Destino", tipo: "text", obrigatorio: true, placeholder: "Nome da delegacia" },
      { id: "assunto", label: "Assunto", tipo: "select", obrigatorio: true, opcoes: ["Solicitação de Informações", "Encaminhamento de Procedimento", "Cumprimento de Diligência", "Comunicação de Prisão", "Outro"] },
      { id: "descricao", label: "Descrição/Solicitação", tipo: "textarea", obrigatorio: true, placeholder: "Descreva detalhadamente a solicitação" },
    ]
  },
  {
    id: "hospital",
    nome: "Requisição a Unidades de Saúde",
    descricao: "Solicitar prontuários e laudos médicos",
    icone: "hospital",
    cor: "red",
    campos: [
      { id: "unidade", label: "Unidade de Saúde", tipo: "text", obrigatorio: true, placeholder: "Nome do hospital/UPA" },
      { id: "tipo_documento", label: "Tipo de Documento", tipo: "select", obrigatorio: true, opcoes: ["Prontuário Médico", "Laudo de Atendimento", "Boletim de Ocorrência Médica", "Exame Toxicológico"] },
      { id: "nome_paciente", label: "Nome do Paciente", tipo: "text", obrigatorio: true },
      { id: "data_atendimento", label: "Data do Atendimento", tipo: "date", obrigatorio: false },
    ]
  },
  {
    id: "empresa",
    nome: "Requisição a Empresas Privadas",
    descricao: "Solicitar informações a empresas e estabelecimentos",
    icone: "company",
    cor: "cyan",
    campos: [
      { id: "empresa", label: "Nome da Empresa", tipo: "text", obrigatorio: true },
      { id: "cnpj", label: "CNPJ", tipo: "text", obrigatorio: false, placeholder: "00.000.000/0000-00" },
      { id: "tipo_informacao", label: "Tipo de Informação", tipo: "select", obrigatorio: true, opcoes: ["Dados Cadastrais de Cliente", "Registros de Compra/Venda", "Imagens de Câmeras", "Registros de Acesso", "Outro"] },
      { id: "descricao", label: "Descrição da Solicitação", tipo: "textarea", obrigatorio: true },
    ]
  },
]

// Pessoas mock do banco de dados
const pessoasBancoDados: PessoaEnvolvida[] = [
  { id: "p1", nome: "Maria Silva Santos", cpf: "123.456.789-00", telefone: "(81) 99999-1234", email: "maria.silva@email.com", tipo: "vitima", selecionada: false },
  { id: "p2", nome: "João Pedro Oliveira", cpf: "987.654.321-00", telefone: "(81) 98888-5678", email: "joao.oliveira@email.com", tipo: "testemunha", selecionada: false },
  { id: "p3", nome: "Ana Carolina Ferreira", cpf: "456.789.123-00", telefone: "(81) 97777-9012", email: "ana.ferreira@email.com", tipo: "testemunha", selecionada: false },
  { id: "p4", nome: "Carlos Eduardo Lima", cpf: "789.123.456-00", telefone: "(81) 96666-3456", email: "carlos.lima@email.com", tipo: "informante", selecionada: false },
]

// Score de maturação - fatores explicativos
const scoreFactors = [
  { label: "Evidências coletadas", weight: 0.25, description: "Quantidade e qualidade de evidências disponíveis" },
  { label: "Correlações identificadas", weight: 0.20, description: "Conexões com outros BOs similares" },
  { label: "Modus operandi definido", weight: 0.15, description: "Padrão de atuação identificado" },
  { label: "Identificação de suspeitos", weight: 0.15, description: "Informações sobre possíveis autores" },
  { label: "Gravidade do crime", weight: 0.10, description: "Impacto e classificação penal" },
  { label: "Testemunhas disponíveis", weight: 0.10, description: "Presença de testemunhas identificadas" },
  { label: "Prazo processual", weight: 0.05, description: "Urgência por prazos legais" },
]

// Passos para instauração de inquérito
const passosInstauracao = [
  {
    id: 1,
    titulo: "Verificar requisitos legais",
    descricao: "Confirmar que há indícios suficientes de autoria e materialidade do delito",
    documentos: ["Boletim de Ocorrência", "Relatório de análise de correlações"],
    responsavel: "Delegado",
    prazo: "Imediato"
  },
  {
    id: 2,
    titulo: "Elaborar portaria de instauração",
    descricao: "Redigir a portaria com fundamentação legal, descrição dos fatos e diligências iniciais",
    documentos: ["Modelo de Portaria"],
    responsavel: "Delegado",
    prazo: "1 dia"
  },
  {
    id: 3,
    titulo: "Designar responsáveis",
    descricao: "Definir equipe de investigação e atribuir responsabilidades",
    documentos: ["Designação de equipe"],
    responsavel: "Delegado",
    prazo: "1 dia"
  },
  {
    id: 4,
    titulo: "Iniciar diligências prioritárias",
    descricao: "Requisitar perícias, oitivas de testemunhas e outras medidas urgentes",
    documentos: ["Requisição de perícia", "Intimações"],
    responsavel: "Escrivão / Agente",
    prazo: "3 dias"
  },
  {
    id: 5,
    titulo: "Comunicar ao Ministério Público",
    descricao: "Enviar cópia da portaria de instauração ao MP",
    documentos: ["Ofício ao MP"],
    responsavel: "Escrivão",
    prazo: "24 horas"
  }
]

interface CaseDetailContentProps {
  caseId: string
}

export default function CaseDetailContent({ caseId }: CaseDetailContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const iniciarParam = searchParams.get("iniciar")
  const [showInstauracaoDialog, setShowInstauracaoDialog] = useState(false)
  
  // Estados para gerenciamento de pessoas na oitiva
  const [showOitivaDialog, setShowOitivaDialog] = useState(false)
  const [oitivaStep, setOitivaStep] = useState<"selecao" | "nova" | "envio" | "confirmacao">("selecao")
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<PessoaEnvolvida[]>([])
  const [searchPessoa, setSearchPessoa] = useState("")
  const [novaPessoa, setNovaPessoa] = useState<Omit<PessoaEnvolvida, "id" | "selecionada">>({
    nome: "", cpf: "", telefone: "", email: "", tipo: "testemunha"
  })
  const [metodoEnvio, setMetodoEnvio] = useState<"email" | "whatsapp" | "oficial">("email")
  const [enviarTodos, setEnviarTodos] = useState(true)
  
  // Filtrar pessoas do banco
  const pessoasFiltradas = useMemo(() => {
    if (!searchPessoa) return pessoasBancoDados
    const termo = searchPessoa.toLowerCase()
    return pessoasBancoDados.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.cpf.includes(termo) ||
      p.email.toLowerCase().includes(termo)
    )
  }, [searchPessoa])
  
  // Funções para gerenciar pessoas
  const togglePessoa = (pessoa: PessoaEnvolvida) => {
    const existe = pessoasSelecionadas.find(p => p.id === pessoa.id)
    if (existe) {
      setPessoasSelecionadas(pessoasSelecionadas.filter(p => p.id !== pessoa.id))
    } else {
      setPessoasSelecionadas([...pessoasSelecionadas, { ...pessoa, selecionada: true }])
    }
  }
  
  const adicionarNovaPessoa = () => {
    if (!novaPessoa.nome || !novaPessoa.cpf) return
    const nova: PessoaEnvolvida = {
      ...novaPessoa,
      id: `new-${Date.now()}`,
      selecionada: true,
      isNew: true
    }
    setPessoasSelecionadas([...pessoasSelecionadas, nova])
    setNovaPessoa({ nome: "", cpf: "", telefone: "", email: "", tipo: "testemunha" })
    setOitivaStep("selecao")
  }
  
  const removerPessoa = (id: string) => {
    setPessoasSelecionadas(pessoasSelecionadas.filter(p => p.id !== id))
  }
  
  const resetOitivaDialog = () => {
    setOitivaStep("selecao")
    setPessoasSelecionadas([])
    setSearchPessoa("")
    setNovaPessoa({ nome: "", cpf: "", telefone: "", email: "", tipo: "testemunha" })
    setMetodoEnvio("email")
  }
  
  // Estados para gerenciamento de ofícios
  const [showOficioDialog, setShowOficioDialog] = useState(false)
  const [oficioStep, setOficioStep] = useState<"lista" | "formulario" | "preview">("lista")
  const [tipoOficioSelecionado, setTipoOficioSelecionado] = useState<TipoOficio | null>(null)
  const [dadosOficio, setDadosOficio] = useState<Record<string, string>>({})
  const [searchOficio, setSearchOficio] = useState("")
  
  // Filtrar tipos de ofício baseado na busca
  const tiposOficiosFiltrados = useMemo(() => {
    if (!searchOficio) return tiposOficios
    const searchLower = searchOficio.toLowerCase()
    return tiposOficios.filter(tipo =>
      tipo.nome.toLowerCase().includes(searchLower) ||
      tipo.descricao.toLowerCase().includes(searchLower)
    )
  }, [searchOficio])
  
  const resetOficioDialog = () => {
    setOficioStep("lista")
    setTipoOficioSelecionado(null)
    setDadosOficio({})
    setSearchOficio("")
  }
  
  // Tipos de minutas disponíveis
  const tiposMinutas = [
    { id: "portaria", nome: "Portaria de Instauração", descricao: "Documento de abertura formal do inquérito policial", icone: "document" },
    { id: "oficio", nome: "Ofício", descricao: "Comunicação oficial para requisição de informações", icone: "mail" },
    { id: "relatorio", nome: "Relatório Final", descricao: "Relatório conclusivo do inquérito policial", icone: "file" },
    { id: "despacho", nome: "Despacho", descricao: "Decisão ou encaminhamento processual", icone: "check" },
    { id: "intimacao", nome: "Intimação", descricao: "Convocação para comparecimento ou ciência", icone: "user" },
    { id: "requisicao_pericia", nome: "Requisição de Perícia", descricao: "Solicitação de exame pericial", icone: "search" },
    { id: "termo_declaracao", nome: "Termo de Declaração", descricao: "Registro de declaração de testemunha ou vítima", icone: "mic" },
    { id: "auto_prisao", nome: "Auto de Prisão em Flagrante", descricao: "Documento de registro de prisão em flagrante", icone: "shield" },
  ]
  
  const resetMinutaDialog = () => {
    setMinutaStep("tipo")
    setTipoMinutaSelecionado("portaria")
    setTituloMinuta("")
    setConteudoMinuta("")
    setMinutaSalva(false)
  }
  
  // Gerar conteúdo sugerido para a minuta baseado no tipo e dados do BO
  const gerarConteudoSugerido = (tipo: string) => {
    const dataAtual = new Date().toLocaleDateString("pt-BR")
    const templates: Record<string, { titulo: string; conteudo: string }> = {
      portaria: {
        titulo: `Portaria de Instauração - ${bo?.bo}`,
        conteudo: `PORTARIA DE INSTAURAÇÃO DE INQUÉRITO POLICIAL

O DELEGADO DE POLÍCIA CIVIL, no uso de suas atribuições legais, com fundamento no art. 5º do Código de Processo Penal,

CONSIDERANDO o Boletim de Ocorrência nº ${bo?.bo}, registrado em ${bo?.dataFato};

CONSIDERANDO os fatos narrados, que configuram, em tese, o crime de ${bo?.natureza};

CONSIDERANDO a necessidade de apuração dos fatos e identificação da autoria;

RESOLVE:

INSTAURAR o presente INQUÉRITO POLICIAL para apurar as circunstâncias do fato ocorrido em ${bo?.bairro}, ${bo?.cidade}/${bo?.uf}.

DETERMINO:
1. A autuação desta Portaria;
2. A oitiva da vítima ${bo?.vitima?.nome || "[Nome da vítima]"};
3. A requisição de imagens de câmeras de segurança do local;
4. A realização de diligências para identificação do(s) autor(es);
5. As demais diligências necessárias à elucidação dos fatos.

${bo?.delegacia}, ${dataAtual}.

_______________________________
DELEGADO DE POLÍCIA`
      },
      oficio: {
        titulo: `Ofício de Requisição - ${bo?.bo}`,
        conteudo: `OFÍCIO Nº ___/${new Date().getFullYear()}

${bo?.delegacia}
Inquérito Policial: ${bo?.bo}

Ao(À)
[DESTINATÁRIO]
[ENDEREÇO]

Assunto: Requisição de informações

Senhor(a),

Cumprimentando-o(a) cordialmente, informo que tramita nesta Delegacia de Polícia o Inquérito Policial em epígrafe, instaurado para apurar o crime de ${bo?.natureza}, ocorrido em ${bo?.dataFato}.

Nesse sentido, REQUISITO, no prazo de 15 (quinze) dias, o envio das seguintes informações/documentos:

[ESPECIFICAR A REQUISIÇÃO]

Trata-se de medida necessária ao prosseguimento das investigações.

Atenciosamente,

${bo?.delegacia}, ${dataAtual}.

_______________________________
DELEGADO DE POLÍCIA`
      },
      relatorio: {
        titulo: `Relatório Final - ${bo?.bo}`,
        conteudo: `RELATÓRIO FINAL

Inquérito Policial nº ${bo?.bo}
Natureza: ${bo?.natureza}
Vítima: ${bo?.vitima?.nome || "[Nome da vítima]"}

Excelentíssimo Senhor Doutor Promotor de Justiça,

Cumpre-me relatar a Vossa Excelência o resultado das investigações procedidas neste Inquérito Policial.

1. DOS FATOS
Em ${bo?.dataFato}, no bairro ${bo?.bairro}, ${bo?.cidade}/${bo?.uf}, foi registrado o Boletim de Ocorrência nº ${bo?.bo}, relatando ${bo?.natureza.toLowerCase()}.

${bo?.resumo || "[Resumo dos fatos]"}

2. DAS DILIGÊNCIAS REALIZADAS
[Descrever as diligências realizadas]

3. DA AUTORIA E MATERIALIDADE
[Analisar os elementos de prova colhidos]

4. CONCLUSÃO
Diante do exposto, encaminho os presentes autos à apreciação de Vossa Excelência para as providências que entender cabíveis.

${bo?.delegacia}, ${dataAtual}.

_______________________________
DELEGADO DE POLÍCIA`
      },
      despacho: {
        titulo: `Despacho - ${bo?.bo}`,
        conteudo: `DESPACHO

Inquérito Policial nº ${bo?.bo}

Vistos.

[Conteúdo do despacho]

Cumpra-se.

${bo?.delegacia}, ${dataAtual}.

_______________________________
DELEGADO DE POLÍCIA`
      },
      intimacao: {
        titulo: `Intimação - ${bo?.bo}`,
        conteudo: `INTIMAÇÃO

O DELEGADO DE POLÍCIA, no uso de suas atribuições legais,

INTIMA [NOME], [QUALIFICAÇÃO], para comparecer nesta Delegacia de Polícia, situada em [ENDEREÇO], no dia [DATA], às [HORA], a fim de prestar declarações no Inquérito Policial nº ${bo?.bo}.

O não comparecimento injustificado importará em condução coercitiva, nos termos do art. 201, §1º, do Código de Processo Penal.

${bo?.delegacia}, ${new Date().toLocaleDateString("pt-BR")}.

_______________________________
DELEGADO DE POLÍCIA`
      },
      requisicao_pericia: {
        titulo: `Requisição de Perícia - ${bo?.bo}`,
        conteudo: `REQUISIÇÃO DE PERÍCIA

Inquérito Policial nº ${bo?.bo}

Ao Instituto de Criminalística

REQUISITO a realização de perícia [TIPO DE PERÍCIA] no(a) [OBJETO/LOCAL], relacionado ao crime de ${bo?.natureza}, ocorrido em ${bo?.dataFato}.

Quesitos:
1. [Quesito 1]
2. [Quesito 2]
3. [Quesito 3]

${bo?.delegacia}, ${new Date().toLocaleDateString("pt-BR")}.

_______________________________
DELEGADO DE POLÍCIA`
      },
      termo_declaracao: {
        titulo: `Termo de Declaração - ${bo?.bo}`,
        conteudo: `TERMO DE DECLARAÇÃO

Inquérito Policial nº ${bo?.bo}

Aos [DATA], nesta cidade de ${bo?.cidade}/${bo?.uf}, na ${bo?.delegacia}, presente o(a) Delegado(a) de Polícia, compareceu [NOME], [NACIONALIDADE], [ESTADO CIVIL], [PROFISSÃO], portador(a) do RG nº [RG] e CPF nº [CPF], residente em [ENDEREÇO], que, inquirido(a), declarou o seguinte:

[DECLARAÇÕES]

Nada mais disse nem lhe foi perguntado. Lido e achado conforme, vai devidamente assinado.

_______________________________
DECLARANTE

_______________________________
DELEGADO DE POLÍCIA`
      },
      auto_prisao: {
        titulo: `Auto de Prisão em Flagrante - ${bo?.bo}`,
        conteudo: `AUTO DE PRISÃO EM FLAGRANTE DELITO

Aos [DATA], às [HORA], nesta cidade de ${bo?.cidade}/${bo?.uf}, na ${bo?.delegacia}, presente o(a) Delegado(a) de Polícia, foi apresentado(a) [NOME DO PRESO], [QUALIFICAÇÃO], em flagrante delito pela prática, em tese, do crime de ${bo?.natureza}.

1. DA APRESENTAÇÃO
[Descrição da apresentação do preso]

2. DOS FATOS
[Narração dos fatos]

3. DAS PROVIDÊNCIAS
[Providências tomadas]

4. DA NOTA DE CULPA
Fica o(a) preso(a) ciente de que está sendo autuado(a) em flagrante delito pelo crime de ${bo?.natureza}, com fundamento no art. [ARTIGO] do Código Penal.

${bo?.delegacia}, ${new Date().toLocaleDateString("pt-BR")}.

_______________________________
DELEGADO DE POLÍCIA`
      }
    }
    
    return templates[tipo] || { titulo: "", conteudo: "" }
  }
  
  // Estados para gerenciamento de playbooks
  const [showPlaybookPreviewDialog, setShowPlaybookPreviewDialog] = useState(false)
  const [showPlaybookListDialog, setShowPlaybookListDialog] = useState(false)
  const [playbookSelecionado, setPlaybookSelecionado] = useState<Playbook | null>(null)
  const [playbookAplicado, setPlaybookAplicado] = useState<Playbook | null>(null)
  const [searchPlaybook, setSearchPlaybook] = useState("")
  
  // Estados para iniciar investigação
  const [showIniciarInvestigacaoDialog, setShowIniciarInvestigacaoDialog] = useState(false)
  const [playbookParaIniciar, setPlaybookParaIniciar] = useState<Playbook | null>(null)
  const [investigacaoIniciada, setInvestigacaoIniciada] = useState(false)
  const [showEscolherPlaybookIniciar, setShowEscolherPlaybookIniciar] = useState(false)
  const [prioridadeInvestigacao, setPrioridadeInvestigacao] = useState<"baixa" | "media" | "alta" | "urgente">("media")
  const [observacaoInstauracao, setObservacaoInstauracao] = useState("")
  
  // Funções para calcular indicadores
  const getIndicadoresMaterialidade = (boData: BoletimOcorrencia) => {
    const indicadores: { texto: string; presente: boolean }[] = [
      { texto: "Objeto do crime identificado", presente: !!boData.objeto },
      { texto: "Local do fato registrado", presente: !!boData.endereco },
      { texto: "Data e hora do fato", presente: !!boData.dataFato && !!boData.horaFato },
      { texto: "Histórico detalhado", presente: boData.historico?.length > 100 },
      { texto: "Evidências documentadas", presente: boData.evidencias?.length > 0 },
    ]
    return indicadores
  }
  
  const getIndicadoresAutoria = (boData: BoletimOcorrencia) => {
    const indicadores: { texto: string; presente: boolean }[] = [
      { texto: "Suspeito identificado", presente: boData.envolvimento === "Autor" || boData.historico?.toLowerCase().includes("suspeito") },
      { texto: "Características físicas descritas", presente: boData.historico?.toLowerCase().includes("altura") || boData.historico?.toLowerCase().includes("aparência") },
      { texto: "Veículo associado ao autor", presente: boData.historico?.toLowerCase().includes("moto") || boData.historico?.toLowerCase().includes("veículo") || boData.historico?.toLowerCase().includes("carro") },
      { texto: "Telefone ou IMEI vinculado", presente: !!boData.celular || !!boData.imei },
      { texto: "Testemunhas identificadas", presente: boData.historico?.toLowerCase().includes("testemunha") },
    ]
    return indicadores
  }
  
  const getJustificativaIA = (boData: BoletimOcorrencia) => {
    const razoes: string[] = []
    if (boData.maturacao === "pronto") {
      razoes.push("O caso atingiu maturidade suficiente para instauração")
    }
    if (boData.scoreMaturacao >= 0.7) {
      razoes.push(`Score de maturação elevado (${Math.round(boData.scoreMaturacao * 100)}%)`)
    }
    if (boData.correlacoes?.length > 0) {
      razoes.push(`${boData.correlacoes.length} correlação(ões) identificada(s) com outros casos`)
    }
    if (boData.evidencias?.length > 0) {
      razoes.push(`${boData.evidencias.length} evidência(s) documentada(s)`)
    }
    if (boData.envolvimento === "Autor") {
      razoes.push("Suspeito identificado no registro")
    }
    if (razoes.length === 0) {
      razoes.push("Análise padrão indica viabilidade investigativa")
    }
    return razoes
  }
  
  // Investigação local criada quando o usuário inicia (simulação)
  const [investigacaoLocal, setInvestigacaoLocal] = useState<Investigacao | null>(null)
  
  // Estados para criação de minuta
  const [showMinutaDialog, setShowMinutaDialog] = useState(false)
  const [tipoMinutaSelecionado, setTipoMinutaSelecionado] = useState<string>("portaria")
  const [tituloMinuta, setTituloMinuta] = useState("")
  const [conteudoMinuta, setConteudoMinuta] = useState("")
  const [minutaStep, setMinutaStep] = useState<"tipo" | "editor" | "preview">("tipo")
  const [minutaSalva, setMinutaSalva] = useState(false)
  
  // Estados para edição de nome de identificação
  const [isEditandoNome, setIsEditandoNome] = useState(false)
  const [nomeIdentificacao, setNomeIdentificacao] = useState("")
  const [nomeEditado, setNomeEditado] = useState<string | null>(null)
  
  // Filtrar playbooks baseado na busca
  const playbooksFiltrados = useMemo(() => {
    if (!searchPlaybook) return playbooks
    const searchLower = searchPlaybook.toLowerCase()
    return playbooks.filter(pb =>
      pb.nome.toLowerCase().includes(searchLower) ||
      pb.tipoCrime.toLowerCase().includes(searchLower) ||
      pb.descricao.toLowerCase().includes(searchLower)
    )
  }, [searchPlaybook])
  
  // Timeline dinâmica baseada no playbook aplicado
  const etapasTimeline = useMemo(() => {
    if (playbookAplicado) {
      // Retorna etapas baseadas nos passos do playbook
      return playbookAplicado.passos.slice(0, 5).map((passo, index) => ({
        id: `passo-${index}`,
        nome: passo.replace(/^\d+\.\s*/, ""), // Remove numeração
        completo: index < 2, // Primeiros 2 completos como exemplo
        atual: index === 2
      }))
    }
    // Etapas padrão
    return [
      { id: "portaria", nome: "Portaria de Instauração", completo: true, atual: false },
      { id: "diligencias", nome: "Diligências", completo: true, atual: false },
      { id: "oitivas", nome: "Oitivas", completo: false, atual: true },
      { id: "minutas", nome: "Minutas", completo: false, atual: false },
      { id: "relatorio", nome: "Relatório Final", completo: false, atual: false }
    ]
  }, [playbookAplicado])
  
  // Próximos passos dinâmicos baseados no playbook
  const proximosPassosDinamicos = useMemo(() => {
    if (playbookAplicado) {
      return playbookAplicado.diligenciasSugeridas.map((d, index) => ({
        id: `diligencia-${index}`,
        titulo: d,
        descricao: `Diligência do playbook ${playbookAplicado.codigo}`
      }))
    }
    return null // Usa os passos padrão
  }, [playbookAplicado])
  
  const getOficioIcone = (tipo: TipoOficio["icone"]) => {
    switch (tipo) {
      case "phone": return <Phone className="size-5" />
      case "bank": return <Building2 className="size-5" />
      case "camera": return <Target className="size-5" />
      case "car": return <Zap className="size-5" />
      case "document": return <FileText className="size-5" />
      case "police": return <Shield className="size-5" />
      case "hospital": return <AlertTriangle className="size-5" />
      case "company": return <Building2 className="size-5" />
    }
  }
  
  const getOficioCor = (cor: string) => {
    const cores: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      slate: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
      indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    }
    return cores[cor] || cores.blue
  }
  
  const getOficioBorderCor = (cor: string) => {
    const cores: Record<string, string> = {
      blue: "hover:border-blue-300 dark:hover:border-blue-700",
      emerald: "hover:border-emerald-300 dark:hover:border-emerald-700",
      amber: "hover:border-amber-300 dark:hover:border-amber-700",
      purple: "hover:border-purple-300 dark:hover:border-purple-700",
      slate: "hover:border-slate-300 dark:hover:border-slate-600",
      indigo: "hover:border-indigo-300 dark:hover:border-indigo-700",
      red: "hover:border-red-300 dark:hover:border-red-700",
      cyan: "hover:border-cyan-300 dark:hover:border-cyan-700",
    }
    return cores[cor] || cores.blue
  }
  
  // Buscar o BO pelo ID ou número do BO
  const bo = useMemo(() => {
  return boletinsOcorrencia.find(b => b.id === caseId || b.bo === caseId)
  }, [caseId])
  
  // Inicializar nome do caso quando BO é carregado (verificar localStorage)
  useEffect(() => {
    if (bo) {
      const saved = localStorage.getItem("nomesEditadosCasos")
      if (saved) {
        const nomesEditados = JSON.parse(saved)
        if (nomesEditados[bo.bo]) {
          setNomeEditado(nomesEditados[bo.bo])
          setNomeIdentificacao(nomesEditados[bo.bo])
          return
        }
      }
      if (!nomeEditado) {
        setNomeIdentificacao(bo.bo)
      }
    }
  }, [bo, nomeEditado])
  
  // Função para salvar nome editado
  const salvarNomeEditado = () => {
    if (nomeIdentificacao.trim() && bo) {
      setNomeEditado(nomeIdentificacao.trim())
      setIsEditandoNome(false)
      // Salvar no localStorage para sincronizar com a lista
      const saved = localStorage.getItem("nomesEditadosCasos")
      const nomesEditados = saved ? JSON.parse(saved) : {}
      nomesEditados[bo.bo] = nomeIdentificacao.trim()
      localStorage.setItem("nomesEditadosCasos", JSON.stringify(nomesEditados))
    }
  }
  
  // Nome do caso a ser exibido (editado ou número do BO original)
  const nomeExibido = nomeEditado || bo?.bo || ""
  
  // Buscar investigação relacionada (se existir) ou usar a local
  const investigacaoExistente = useMemo(() => {
    if (!bo) return null
    return investigacoes.find(inv => inv.boOrigem === bo.bo || inv.bosVinculados.includes(bo.bo))
  }, [bo])
  
  // Usar investigação local se criada, senão usar a existente
  const investigacao = investigacaoLocal || investigacaoExistente

  // Buscar correlações
  const correlacoesCaso = useMemo(() => {
    if (!bo) return []
    return correlacoes.filter(c => c.boA === bo.bo || c.boB === bo.bo)
  }, [bo])

  // Buscar BOs correlacionados
  const bosCorrelacionados = useMemo(() => {
    if (!bo) return []
    return boletinsOcorrencia.filter(b => bo.correlacoes.includes(b.bo))
  }, [bo])

  // Buscar playbook sugerido
  const playbookSugerido = useMemo(() => {
    if (!bo) return null
    return playbooks.find(p => p.tipoCrime.toLowerCase().includes(bo.natureza.toLowerCase()))
  }, [bo])

  // O playbook ativo é o aplicado ou o sugerido
  const playbookAtivo = playbookAplicado || playbookSugerido

  // Entidades extraídas do BO
  const entidadesExtraidas = useMemo(() => {
  if (!bo) return []
  const entidades = []
  
  if (bo.nome) entidades.push({ tipo: "Pessoa", valor: bo.nome, icone: User })
  if (bo.numeroDocumento) entidades.push({ tipo: bo.tipoDocumento, valor: bo.numeroDocumento, icone: CreditCard })
  if (bo.celular) entidades.push({ tipo: "Telefone", valor: bo.celular, icone: Phone })
  if (bo.imei) entidades.push({ tipo: "IMEI", valor: bo.imei, icone: Smartphone })
  if (bo.endereco) entidades.push({ tipo: "Endereço", valor: `${bo.endereco}, ${bo.bairro}`, icone: MapPin })
  if (bo.objeto) entidades.push({ tipo: "Objeto", valor: `${bo.objeto} - ${bo.marca} ${bo.modelo}`, icone: Target })
  
  return entidades
  }, [bo])

  // Calcular fatores do score
  const scoreDetalhado = useMemo(() => {
    if (!bo) return []
    
    return scoreFactors.map((factor, index) => {
      // Simular valores baseados nas evidências do BO
      let valor = 0
      
      switch (index) {
        case 0: // Evidências
          valor = Math.min(bo.evidencias.length / 5, 1)
          break
        case 1: // Correlações
          valor = Math.min(bo.correlacoes.length / 3, 1)
          break
        case 2: // Modus operandi
          valor = bo.historico.toLowerCase().includes("padrão") || bo.historico.toLowerCase().includes("modus") ? 0.9 : 0.4
          break
        case 3: // Suspeitos
          valor = bo.historico.toLowerCase().includes("identificado") ? 0.8 : 0.2
          break
        case 4: // Gravidade
          valor = bo.natureza === "ROUBO" ? 0.9 : bo.natureza === "FURTO" ? 0.5 : 0.3
          break
        case 5: // Testemunhas
          valor = bo.evidencias.includes("Testemunha") ? 0.9 : 0.1
          break
        case 6: // Prazo
          valor = 0.5
          break
      }
      
      return {
        ...factor,
        valor,
        contribuicao: valor * factor.weight
      }
    })
  }, [bo])

  if (!bo) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <AlertTriangle className="size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Caso não encontrado</h2>
        <p className="text-muted-foreground">O caso solicitado não foi encontrado no sistema.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>
      </div>
    )
  }

  const isProntoInstauracao = bo.maturacao === "pronto"
  const temInvestigacaoExistente = !!investigacaoExistente
  const isEmAndamento = !!investigacao || investigacaoIniciada
  
  // Abrir dialog automaticamente se vier com parâmetro iniciar=true
  useEffect(() => {
    if (iniciarParam === "true" && !temInvestigacaoExistente && !investigacaoIniciada) {
      setShowIniciarInvestigacaoDialog(true)
      if (!playbookParaIniciar) {
        setPlaybookParaIniciar(playbookSugerido || playbooks[0])
      }
    }
  }, [iniciarParam, temInvestigacaoExistente, investigacaoIniciada, playbookParaIniciar, playbookSugerido])
  
  return (
    <div className="space-y-6">
      {/* Header do caso */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              {isEditandoNome ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={nomeIdentificacao}
                    onChange={(e) => setNomeIdentificacao(e.target.value)}
                    className="h-9 w-64 text-xl font-bold"
                    autoFocus
                    placeholder="Nome do caso..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") salvarNomeEditado()
                      if (e.key === "Escape") {
                        setIsEditandoNome(false)
                        setNomeIdentificacao(nomeExibido)
                      }
                    }}
                  />
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={salvarNomeEditado}>
                    <Check className="size-4 text-emerald-600" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => {
                      setIsEditandoNome(false)
                      setNomeIdentificacao(nomeExibido)
                    }}
                  >
                    <X className="size-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{nomeExibido}</h1>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 w-7 p-0 cursor-pointer hover:bg-muted" 
                    onClick={() => {
                      setNomeIdentificacao(nomeExibido)
                      setIsEditandoNome(true)
                    }}
                    title="Editar nome do caso"
                  >
                    <Pencil className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              )}
              <Badge className={getMaturacaoColor(bo.maturacao)}>
                {getMaturacaoLabel(bo.maturacao)}
              </Badge>
              {isEmAndamento && (
                <Badge variant="outline" className="gap-1">
                  <Scale className="size-3" />
                  Em investigação
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">
              {bo.natureza} - {bo.nome}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {bo.dataFato}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {bo.bairro}, {bo.municipio}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="size-4" />
                {bo.delegacia}
              </span>
            </div>
          </div>
        </div>

        {/* Ações principais */}
        <div className="flex gap-2">
          {/* Botão Instaurar Investigação - para BOs sem investigação */}
          {!isEmAndamento && !investigacaoIniciada && (
            <Dialog 
              open={showIniciarInvestigacaoDialog} 
              onOpenChange={(open) => {
                setShowIniciarInvestigacaoDialog(open)
                if (open && !playbookParaIniciar) {
                  setPlaybookParaIniciar(playbookSugerido || playbooks[0])
                }
                if (!open) {
                  setShowEscolherPlaybookIniciar(false)
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Rocket className="size-4" />
                  Instaurar Investigação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                {!showEscolherPlaybookIniciar ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Rocket className="size-5" />
                        Confirmar Instauração de Investigação
                      </DialogTitle>
                      <DialogDescription>
                        Revise as informações antes de confirmar a instauração do inquérito para o BO {bo.bo}.
                      </DialogDescription>
                    </DialogHeader>
                    
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
                            <span className="font-mono font-medium">{bo.bo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Natureza:</span>
                            <span className="font-medium">{bo.natureza}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Data do Fato:</span>
                            <span>{bo.dataFato}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Local:</span>
                            <span>{bo.bairro}, {bo.municipio}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Score de Maturação:</span>
                            <Badge className={getMaturacaoColor(bo.maturacao)}>
                              {Math.round(bo.scoreMaturacao * 100)}%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Justificativa da recomendação da IA */}
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Lightbulb className="size-4 text-amber-500" />
                          Justificativa da Recomendação da IA
                        </h4>
                        <ul className="space-y-1.5 text-sm">
                          {getJustificativaIA(bo).map((razao, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                              <span className="text-muted-foreground">{razao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Indicadores de materialidade e autoria */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Indicadores de Materialidade */}
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
                            <Target className="size-4 text-blue-500" />
                            Indicadores de Materialidade
                          </h4>
                          <ul className="space-y-1.5 text-sm">
                            {getIndicadoresMaterialidade(bo).map((ind, i) => (
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
                            {getIndicadoresAutoria(bo).map((ind, i) => (
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
                      {bo.correlacoes?.length > 0 && (
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Network className="size-4 text-indigo-500" />
                            Padrões Recorrentes Associados
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              Este B.O. possui {bo.correlacoes.length} correlação(ões) identificada(s) com outros casos:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {bo.correlacoes.map((corr, i) => (
                                <Badge key={i} variant="outline" className="font-mono">
                                  {corr}
                                </Badge>
                              ))}
                            </div>
                            {bo.evidencias?.length > 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-1">Evidências compartilhadas:</p>
                                <div className="flex flex-wrap gap-1">
                                  {bo.evidencias.map((ev, i) => (
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
                      
                      {/* Seleção de Prioridade */}
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-3">Prioridade da Investigação</h4>
                        <div className="grid grid-cols-4 gap-2">
                          <Button
                            type="button"
                            variant={prioridadeInvestigacao === "baixa" ? "default" : "outline"}
                            size="sm"
                            className={prioridadeInvestigacao === "baixa" ? "bg-slate-600 hover:bg-slate-700" : ""}
                            onClick={() => setPrioridadeInvestigacao("baixa")}
                          >
                            Baixa
                          </Button>
                          <Button
                            type="button"
                            variant={prioridadeInvestigacao === "media" ? "default" : "outline"}
                            size="sm"
                            className={prioridadeInvestigacao === "media" ? "bg-blue-600 hover:bg-blue-700" : ""}
                            onClick={() => setPrioridadeInvestigacao("media")}
                          >
                            Média
                          </Button>
                          <Button
                            type="button"
                            variant={prioridadeInvestigacao === "alta" ? "default" : "outline"}
                            size="sm"
                            className={prioridadeInvestigacao === "alta" ? "bg-amber-600 hover:bg-amber-700" : ""}
                            onClick={() => setPrioridadeInvestigacao("alta")}
                          >
                            Alta
                          </Button>
                          <Button
                            type="button"
                            variant={prioridadeInvestigacao === "urgente" ? "default" : "outline"}
                            size="sm"
                            className={prioridadeInvestigacao === "urgente" ? "bg-red-600 hover:bg-red-700" : ""}
                            onClick={() => setPrioridadeInvestigacao("urgente")}
                          >
                            Urgente
                          </Button>
                        </div>
                      </div>

                      {/* Campo de observação do usuário */}
                      <div className="space-y-2">
                        <Label htmlFor="observacao-case">Observação do Usuário (opcional)</Label>
                        <Textarea
                          id="observacao-case"
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
                    
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowIniciarInvestigacaoDialog(false)}
                        className="sm:order-1"
                      >
                        Cancelar
                      </Button>
                      <Link href={`/cases/${bo.bo}?iniciarVPI=true`}>
                        <Button 
                          variant="outline" 
                          className="gap-2 w-full sm:w-auto sm:order-2"
                          onClick={() => setShowIniciarInvestigacaoDialog(false)}
                        >
                          <Scale className="size-4" />
                          Abrir VPI em vez de instaurar
                        </Button>
                      </Link>
                      <Button
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 sm:order-3"
                        onClick={() => {
                          setPlaybookAplicado(playbookParaIniciar)
                          setInvestigacaoIniciada(true)
                          // Criar investigação local simulada
                          if (bo) {
                            const hoje = new Date()
                            const prazo = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dias
                            setInvestigacaoLocal({
                              id: `inv-local-${Date.now()}`,
                              codigo: `IP-${hoje.getFullYear()}/${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
                              nome: `Investigação - ${bo.natureza}`,
                              boOrigem: bo.bo,
                              bosVinculados: [],
                              status: "em_investigacao",
                              etapaAtual: "portaria",
                              prioridade: prioridadeInvestigacao,
                              dataInstauracao: hoje.toLocaleDateString('pt-BR'),
                              prazo: prazo.toLocaleDateString('pt-BR'),
                              responsavel: "Del. João Santos",
                              delegacia: bo.delegacia,
                              playbookAplicado: playbookParaIniciar?.codigo || null,
                              historico: [
                                { data: hoje.toLocaleDateString('pt-BR'), acao: "Investigação iniciada", usuario: "Del. João Santos" },
                                { data: hoje.toLocaleDateString('pt-BR'), acao: `Playbook "${playbookParaIniciar?.nome}" aplicado`, usuario: "Sistema" }
                              ],
                              pendencias: ["Emitir portaria de instauração", "Agendar oitivas iniciais"],
                              diligenciasAgendadas: playbookParaIniciar?.diligenciasSugeridas.slice(0, 3).map((d, i) => ({
                                tipo: d,
                                data: new Date(hoje.getTime() + (i + 1) * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
                                status: "pendente" as const
                              })) || []
                            })
                            // Salvar no localStorage para sincronizar com a lista de casos
                            const saved = localStorage.getItem("investigacoesLocais")
                            const investigacoesLocais = saved ? JSON.parse(saved) : {}
                            investigacoesLocais[bo.bo] = { 
                              prioridade: prioridadeInvestigacao, 
                              data: hoje.toLocaleDateString('pt-BR') 
                            }
                            localStorage.setItem("investigacoesLocais", JSON.stringify(investigacoesLocais))
                          }
                          setShowIniciarInvestigacaoDialog(false)
                        }}
                      >
                        <CheckCircle2 className="size-4" />
                        Confirmar Instauração
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Escolher Playbook</DialogTitle>
                      <DialogDescription>
                        Selecione o playbook que será aplicado à investigação
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      {/* Campo de busca */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Buscar playbook..."
                          value={searchPlaybook}
                          onChange={(e) => setSearchPlaybook(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      
                      {/* Lista de playbooks */}
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-2">
                          {playbooksFiltrados.map((pb) => {
                            const isSelected = playbookParaIniciar?.id === pb.id
                            const isSugerido = playbookSugerido?.id === pb.id
                            return (
                              <div
                                key={pb.id}
                                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                                  isSelected 
                                    ? "border-primary bg-primary/5" 
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() => setPlaybookParaIniciar(pb)}
                              >
                                <div className={`flex size-5 items-center justify-center rounded border ${
                                  isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                                }`}>
                                  {isSelected && <Check className="size-3 text-primary-foreground" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{pb.nome}</p>
                                    {isSugerido && (
                                      <Badge variant="secondary" className="text-xs">Sugerido</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{pb.codigo} - {pb.tipoCrime}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowEscolherPlaybookIniciar(false)
                          setSearchPlaybook("")
                        }}
                      >
                        Voltar
                      </Button>
                      <Button onClick={() => {
                        setShowEscolherPlaybookIniciar(false)
                        setSearchPlaybook("")
                      }}>
                        Confirmar Seleção
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          )}

          {isProntoInstauracao && !isEmAndamento && !investigacaoIniciada && (
            <Dialog open={showInstauracaoDialog} onOpenChange={setShowInstauracaoDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Scale className="size-4" />
                  Instaurar VPI
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Instaurar VPI</DialogTitle>
                  <DialogDescription>
                    Siga o passo a passo para instauração correta do VPI
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto py-4">
                  <div className="space-y-4">
                    {passosInstauracao.map((passo, index) => (
                      <div key={passo.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                            {index + 1}
                          </div>
                          {index < passosInstauracao.length - 1 && (
                            <div className="mt-2 h-full w-0.5 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h4 className="font-medium">{passo.titulo}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{passo.descricao}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              <User className="mr-1 size-3" />
                              {passo.responsavel}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="mr-1 size-3" />
                              {passo.prazo}
                            </Badge>
                          </div>
                          {passo.documentos.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {passo.documentos.map((doc) => (
                                <Badge key={doc} variant="outline" className="text-xs">
                                  <FileText className="mr-1 size-3" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInstauracaoDialog(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      setShowInstauracaoDialog(false)
                      setTipoMinutaSelecionado("portaria")
                      const sugestao = gerarConteudoSugerido("portaria")
                      setTituloMinuta(sugestao.titulo)
                      setConteudoMinuta(sugestao.conteudo)
                      setMinutaStep("editor")
                      setShowMinutaDialog(true)
                    }}
                  >
                    <FileText className="size-4" />
                    Gerar Portaria
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

{/* Conteúdo principal */}
  <Tabs defaultValue={tabParam || (isEmAndamento ? "timeline" : "analise")} className="space-y-4">
        <TabsList>
          <TabsTrigger value="analise" className="gap-2">
            <FileSearch className="size-4" />
            Análise do Caso
          </TabsTrigger>
          <TabsTrigger value="entidades" className="gap-2">
            <Users className="size-4" />
            Entidades Extraídas
          </TabsTrigger>
          <TabsTrigger value="correlacoes" className="gap-2">
            <Link2 className="size-4" />
            Correlações
          </TabsTrigger>
        </TabsList>

        {/* Tab: Análise do Caso */}
        <TabsContent value="analise" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Informações do BO */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Boletim</CardTitle>
                <CardDescription>Dados registrados no BO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Histórico</h4>
                  <p className="text-sm text-muted-foreground">{bo.historico}</p>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Data/Hora do Fato</h4>
                    <p className="text-sm">{bo.dataFato} às {bo.horaFato}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Local</h4>
                    <p className="text-sm">{bo.endereco}, {bo.bairro}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Objeto</h4>
                    <p className="text-sm">{bo.objeto} - {bo.marca} {bo.modelo}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Situação</h4>
                    <p className="text-sm">{bo.situacao}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="mb-2 font-medium">Evidências Disponíveis</h4>
                  <div className="flex flex-wrap gap-2">
                    {bo.evidencias.map((ev) => (
                      <Badge key={ev} variant="secondary">
                        {ev}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score de Maturação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Score de Maturação
                  <span className="text-2xl font-bold text-primary">
                    {Math.round(bo.scoreMaturacao * 100)}%
                  </span>
                </CardTitle>
                <CardDescription>Indicador de prontidão para instauração</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={bo.scoreMaturacao * 100} className="mb-4 h-3" />
                <div className="space-y-3">
                  {bo.maturacao === "pronto" && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-100 p-3 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <CheckCircle2 className="size-4" />
                      Caso pronto para instauração de inquérito
                    </div>
                  )}
                  {bo.maturacao === "amadurecimento" && (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      <TrendingUp className="size-4" />
                      Caso em amadurecimento - aguarde mais evidências
                    </div>
                  )}
                  {bo.maturacao === "observacao" && (
                    <div className="flex items-center gap-2 rounded-lg bg-blue-100 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <Info className="size-4" />
                      Caso em observação - monitorando correlações
                    </div>
                  )}
                  
                  {/* Explicação detalhada da IA */}
                  <div className="mt-4 rounded-lg border p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="size-4 text-amber-500" />
                      {bo.maturacao === "pronto" 
                        ? "Por que este B.O. está pronto para instaurar?" 
                        : bo.maturacao === "amadurecimento"
                        ? "Por que este B.O. ainda precisa amadurecer?"
                        : "Por que este B.O. está em observação?"
                      }
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {/* Fatores positivos */}
                      {bo.vitima && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          possui vítima identificada;
                        </li>
                      )}
                      {bo.suspeito && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          possui suspeito citado;
                        </li>
                      )}
                      {bo.telefones && bo.telefones.length > 0 && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          possui {bo.telefones.length} telefone{bo.telefones.length > 1 ? "s" : ""} associado{bo.telefones.length > 1 ? "s" : ""};
                        </li>
                      )}
                      {bo.correlacoes && bo.correlacoes > 0 && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          há {bo.correlacoes} B.O.{bo.correlacoes > 1 ? "s" : ""} com padrão semelhante;
                        </li>
                      )}
                      {bo.endereco && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          há endereço registrado;
                        </li>
                      )}
                      {bo.cameras && bo.cameras.length > 0 && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          há indicação de {bo.cameras.length} câmera{bo.cameras.length > 1 ? "s" : ""} próxima{bo.cameras.length > 1 ? "s" : ""};
                        </li>
                      )}
                      {bo.veiculosEnvolvidos && bo.veiculosEnvolvidos.length > 0 && (
                        <li className="flex items-center gap-2">
                          <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                          há {bo.veiculosEnvolvidos.length} veículo{bo.veiculosEnvolvidos.length > 1 ? "s" : ""} identificado{bo.veiculosEnvolvidos.length > 1 ? "s" : ""};
                        </li>
                      )}
                      
                      {/* Fatores negativos / pendentes */}
                      {!bo.vitima && (
                        <li className="flex items-center gap-2">
                          <X className="size-3.5 text-red-500 flex-shrink-0" />
                          vítima não identificada;
                        </li>
                      )}
                      {!bo.suspeito && (
                        <li className="flex items-center gap-2">
                          <X className="size-3.5 text-red-500 flex-shrink-0" />
                          sem suspeito citado;
                        </li>
                      )}
                      {(!bo.telefones || bo.telefones.length === 0) && (
                        <li className="flex items-center gap-2">
                          <X className="size-3.5 text-red-500 flex-shrink-0" />
                          sem telefones associados;
                        </li>
                      )}
                      {(!bo.correlacoes || bo.correlacoes === 0) && (
                        <li className="flex items-center gap-2">
                          <X className="size-3.5 text-red-500 flex-shrink-0" />
                          sem correlações identificadas;
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Entidades Extraídas */}
        <TabsContent value="entidades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entidades Identificadas</CardTitle>
              <CardDescription>Informações extraídas automaticamente do BO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entidadesExtraidas.map((entidade, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg border p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <entidade.icone className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        {entidade.tipo}
                      </p>
                      <p className="truncate font-medium">{entidade.valor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vítima */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Vítima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div>
  <p className="text-xs font-medium uppercase text-muted-foreground">Nome</p>
  <p className="font-medium">{bo.nome}</p>
  </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Sexo</p>
                  <p className="font-medium">{bo.sexo === "M" ? "Masculino" : "Feminino"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{bo.dataNascimento}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">{bo.tipoDocumento}</p>
                  <p className="font-medium">{bo.numeroDocumento}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Nome da Mãe</p>
                  <p className="font-medium">{bo.nomeMae}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Nome do Pai</p>
                  <p className="font-medium">{bo.nomePai || "Não informado"}</p>
                </div>
                {bo.celular && (
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Celular</p>
                    <p className="font-medium">{bo.celular}</p>
                  </div>
                )}
                {bo.imei && (
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">IMEI</p>
                    <p className="font-mono text-sm">{bo.imei}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Correlações */}
        <TabsContent value="correlacoes" className="space-y-4">
          {bosCorrelacionados.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Casos Correlacionados</h3>
                  <p className="text-sm text-muted-foreground">
                    {bosCorrelacionados.length} caso(s) com padrões similares identificados
                  </p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {bosCorrelacionados.map((boCorr) => {
                  const corr = correlacoesCaso.find(c => c.boA === boCorr.bo || c.boB === boCorr.bo)
                  return (
                    <Card key={boCorr.id} className="transition-colors hover:bg-muted/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{boCorr.bo}</CardTitle>
                            <CardDescription>{boCorr.natureza} - {boCorr.nome}</CardDescription>
                          </div>
                          {corr && (
                            <Badge variant="secondary" className="gap-1">
                              <Zap className="size-3" />
                              {Math.round(corr.score * 100)}% similar
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {boCorr.dataFato}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {boCorr.bairro}
                          </span>
                        </div>
                        {corr && (
                          <div>
                            <p className="mb-2 text-xs font-medium text-muted-foreground">Evidências de correlação:</p>
                            <div className="flex flex-wrap gap-1">
                              {corr.evidencias.map((ev) => (
                                <Badge key={ev} variant="outline" className="text-xs">
                                  {ev}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link href={`/cases/${boCorr.id}`}>
                          <Button variant="ghost" size="sm" className="mt-3 w-full">
                            Ver detalhes
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Link2 className="mb-4 size-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Sem correlações identificadas</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Não foram encontrados casos com padrões similares a este BO.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Criar Minuta */}
      <Dialog open={showMinutaDialog} onOpenChange={(open) => {
        setShowMinutaDialog(open)
        if (!open) resetMinutaDialog()
      }}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-4xl">
          {minutaStep === "tipo" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Criar Nova Minuta
                </DialogTitle>
                <DialogDescription>
                  Selecione o tipo de documento para o caso {bo.bo}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="grid gap-3 py-4 sm:grid-cols-2">
                  {tiposMinutas.map((tipo) => (
                    <div
                      key={tipo.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all hover:bg-muted/50 ${
                        tipoMinutaSelecionado === tipo.id 
                          ? "border-primary bg-primary/5" 
                          : ""
                      }`}
                      onClick={() => setTipoMinutaSelecionado(tipo.id)}
                    >
                      <div className={`flex size-5 items-center justify-center rounded border ${
                        tipoMinutaSelecionado === tipo.id 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground/30"
                      }`}>
                        {tipoMinutaSelecionado === tipo.id && (
                          <Check className="size-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{tipo.nome}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tipo.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowMinutaDialog(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    const sugestao = gerarConteudoSugerido(tipoMinutaSelecionado)
                    setTituloMinuta(sugestao.titulo)
                    setConteudoMinuta(sugestao.conteudo)
                    setMinutaStep("editor")
                  }}
                >
                  Continuar
                </Button>
              </DialogFooter>
            </>
          )}
          
          {minutaStep === "editor" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="size-5" />
                  Editor de Minuta
                </DialogTitle>
                <DialogDescription>
                  {tiposMinutas.find(t => t.id === tipoMinutaSelecionado)?.nome} - Caso {bo.bo}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo-minuta">Título do Documento</Label>
                  <Input
                    id="titulo-minuta"
                    value={tituloMinuta}
                    onChange={(e) => setTituloMinuta(e.target.value)}
                    placeholder="Título da minuta"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="conteudo-minuta">Conteúdo</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-xs"
                      onClick={() => {
                        const sugestao = gerarConteudoSugerido(tipoMinutaSelecionado)
                        setConteudoMinuta(sugestao.conteudo)
                      }}
                    >
                      <Sparkles className="size-3" />
                      Regenerar sugestão
                    </Button>
                  </div>
                  <Textarea
                    id="conteudo-minuta"
                    value={conteudoMinuta}
                    onChange={(e) => setConteudoMinuta(e.target.value)}
                    placeholder="Conteúdo do documento..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setMinutaStep("tipo")}>
                  Voltar
                </Button>
                <Button 
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(conteudoMinuta)
                  }}
                >
                  <Copy className="size-4" />
                  Copiar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setMinutaStep("preview")}
                >
                  <Eye className="size-4 mr-1" />
                  Visualizar
                </Button>
                <Button 
                  className="gap-1"
                  onClick={() => {
                    setMinutaSalva(true)
                    setTimeout(() => {
                      setShowMinutaDialog(false)
                      resetMinutaDialog()
                    }, 1500)
                  }}
                >
                  <Save className="size-4" />
                  Salvar Minuta
                </Button>
              </DialogFooter>
            </>
          )}
          
          {minutaStep === "preview" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="size-5" />
                  Visualização da Minuta
                </DialogTitle>
                <DialogDescription>{tituloMinuta}</DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="rounded-lg border bg-white p-8 dark:bg-slate-950">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-serif">
                    {conteudoMinuta}
                  </div>
                </div>
              </ScrollArea>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setMinutaStep("editor")}>
                  Voltar ao Editor
                </Button>
                <Button 
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(conteudoMinuta)
                  }}
                >
                  <Copy className="size-4" />
                  Copiar
                </Button>
                <Button 
                  className="gap-1"
                  onClick={() => {
                    setMinutaSalva(true)
                    setTimeout(() => {
                      setShowMinutaDialog(false)
                      resetMinutaDialog()
                    }, 1500)
                  }}
                >
                  <Save className="size-4" />
                  Salvar Minuta
                </Button>
              </DialogFooter>
            </>
          )}
          
          {minutaSalva && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 rounded-lg bg-emerald-50 p-6 dark:bg-emerald-950/50">
                <CheckCircle2 className="size-12 text-emerald-600" />
                <p className="font-medium text-emerald-700 dark:text-emerald-400">Minuta salva com sucesso!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
