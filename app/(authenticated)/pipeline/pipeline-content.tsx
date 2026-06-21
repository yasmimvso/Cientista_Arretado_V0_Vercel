"use client"

import { useState, useMemo } from "react"
import { 
  boletinsOcorrencia, 
  investigacoes, 
  type BoletimOcorrencia,
  type Investigacao 
} from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter,
  GripVertical,
  Clock,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ArrowRight,
  Calendar,
  MapPin,
  Scale
} from "lucide-react"

type PipelineItem = {
  id: string
  type: "infopol" | "investigation"
  title: string
  status: string
  priority: string
  assignedTo: string
  dueDate?: string
  createdAt: string
  location?: string
  crimeType?: string
  data: BoletimOcorrencia | Investigacao
}

const INFOPOL_COLUMNS = [
  { id: "triagem", title: "Triagem", color: "bg-muted" },
  { id: "analise_recorrencia", title: "Análise de Recorrência", color: "bg-chart-2/20" },
  { id: "em_analise", title: "Em Análise", color: "bg-chart-1/20" },
  { id: "aguardando_instauracao", title: "Aguardando Instauração", color: "bg-warning/20" },
  { id: "arquivado", title: "Arquivado", color: "bg-muted" },
]

const INVESTIGATION_COLUMNS = [
  { id: "instaurado", title: "Instaurado", color: "bg-chart-2/20" },
  { id: "diligencias", title: "Em Diligências", color: "bg-chart-1/20" },
  { id: "aguardando_pericia", title: "Aguardando Perícia", color: "bg-warning/20" },
  { id: "relatorio_final", title: "Relatório Final", color: "bg-chart-4/20" },
  { id: "remetido_justica", title: "Remetido à Justiça", color: "bg-success/20" },
]

function mapCaseStatus(maturacao: string): string {
  const mapping: Record<string, string> = {
    "pendente": "triagem",
    "observacao": "analise_recorrencia",
    "amadurecimento": "em_analise",
    "pronto": "aguardando_instauracao",
  }
  return mapping[maturacao] || "triagem"
}

function mapInvestigationStatus(status: string): string {
  const mapping: Record<string, string> = {
    "instaurado": "instaurado",
    "em_andamento": "diligencias",
    "aguardando_pericia": "aguardando_pericia",
    "relatorio_final": "relatorio_final",
    "concluido": "remetido_justica",
    "arquivado": "remetido_justica",
  }
  return mapping[status] || "instaurado"
}

export default function PipelineContent() {
  const [activeTab, setActiveTab] = useState<"infopol" | "investigation">("infopol")
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null)

  const infoPolItems: PipelineItem[] = useMemo(() => {
    return boletinsOcorrencia.map(bo => ({
      id: bo.id,
      type: "infopol" as const,
      title: `${bo.natureza} - ${bo.nome}`,
      status: mapCaseStatus(bo.maturacao),
      priority: bo.scoreMaturacao >= 0.9 ? "critica" : bo.scoreMaturacao >= 0.7 ? "alta" : bo.scoreMaturacao >= 0.4 ? "media" : "baixa",
      assignedTo: "Pendente designação",
      dueDate: undefined,
      createdAt: bo.dataRegistro,
      location: bo.bairro,
      crimeType: bo.natureza,
      data: bo,
    }))
  }, [])

  const investigationItems: PipelineItem[] = useMemo(() => {
    return investigacoes.map(inv => ({
      id: inv.id,
      type: "investigation" as const,
      title: inv.nome,
      status: mapInvestigationStatus(inv.status),
      priority: inv.prioridade,
      assignedTo: inv.responsavel,
      dueDate: inv.prazo,
      createdAt: inv.dataInstauracao,
      location: inv.delegacia,
      crimeType: undefined,
      data: inv,
    }))
  }, [])

  const items = activeTab === "infopol" ? infoPolItems : investigationItems
  const columns = activeTab === "infopol" ? INFOPOL_COLUMNS : INVESTIGATION_COLUMNS

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.crimeType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }, [items, searchTerm, priorityFilter])

  const getItemsForColumn = (columnId: string) => {
    return filteredItems.filter(item => item.status === columnId)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critica":
        return <AlertTriangle className="size-3 text-destructive" />
      case "alta":
        return <Circle className="size-3 fill-warning text-warning" />
      case "media":
        return <Circle className="size-3 fill-chart-1 text-chart-1" />
      default:
        return <Circle className="size-3 fill-muted-foreground text-muted-foreground" />
    }
  }

  const getColumnStats = (columnId: string) => {
    const columnItems = getItemsForColumn(columnId)
    const critical = columnItems.filter(i => i.priority === "critica").length
    const high = columnItems.filter(i => i.priority === "alta").length
    return { total: columnItems.length, critical, high }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critica": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "alta": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "media": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Pipeline de Trabalho
          </h1>
          <p className="text-muted-foreground">
            Visualização Kanban do fluxo de casos e investigações
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "infopol" | "investigation")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="infopol" className="gap-2">
              <FileText className="size-4" />
              Pré-Instauração
            </TabsTrigger>
            <TabsTrigger value="investigation" className="gap-2">
              <Scale className="size-4" />
              Pós-Instauração
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, crime ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="size-4 mr-2" />
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => {
            const stats = getColumnStats(column.id)
            const columnItems = getItemsForColumn(column.id)
            
            return (
              <div 
                key={column.id} 
                className="flex flex-col w-[300px] shrink-0"
              >
                {/* Column Header */}
                <div className={`rounded-t-lg px-3 py-2 ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{column.title}</h3>
                    <div className="flex items-center gap-2">
                      {stats.critical > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0">
                          {stats.critical}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {stats.total}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Column Content */}
                <ScrollArea className="flex-1 rounded-b-lg border border-t-0 bg-muted/30">
                  <div className="flex flex-col gap-2 p-2 min-h-[400px]">
                    {columnItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-2">
                          <CheckCircle2 className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Nenhum item
                        </p>
                      </div>
                    ) : (
                      columnItems.map((item) => (
                        <Card 
                          key={item.id}
                          className="cursor-pointer hover:shadow-md transition-shadow group"
                          onClick={() => setSelectedItem(item)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <GripVertical className="size-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {getPriorityIcon(item.priority)}
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {item.id}
                                  </span>
                                </div>
                                <h4 className="font-medium text-sm line-clamp-2 mb-2">
                                  {item.title}
                                </h4>
                                {item.crimeType && (
                                  <Badge variant="outline" className="text-xs mb-2">
                                    {item.crimeType}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="size-3" />
                                    <span className="truncate max-w-[80px]">
                                      {item.assignedTo.split(" ")[0]}
                                    </span>
                                  </div>
                                  {item.dueDate && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      <span>
                                        {new Date(item.dueDate).toLocaleDateString("pt-BR", { 
                                          day: "2-digit", 
                                          month: "short" 
                                        })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && getPriorityIcon(selectedItem.priority)}
              <span className="font-mono text-sm text-muted-foreground">
                {selectedItem?.id}
              </span>
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedItem?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getPriorityColor(selectedItem.priority)}>
                  {selectedItem.priority.charAt(0).toUpperCase() + selectedItem.priority.slice(1)}
                </Badge>
                {selectedItem.crimeType && (
                  <Badge variant="outline">{selectedItem.crimeType}</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Responsável</p>
                    <p className="font-medium">{selectedItem.assignedTo}</p>
                  </div>
                </div>
                {selectedItem.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Local</p>
                      <p className="font-medium">{selectedItem.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Criado em</p>
                    <p className="font-medium">
                      {new Date(selectedItem.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                {selectedItem.dueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Prazo</p>
                      <p className="font-medium">
                        {new Date(selectedItem.dueDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 gap-2">
                  Abrir Detalhes
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline">
                  Mover
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
