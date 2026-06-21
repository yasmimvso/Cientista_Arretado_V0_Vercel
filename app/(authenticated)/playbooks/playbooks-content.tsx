"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  Download,
  Edit,
  CheckCircle2,
  FileText,
  Filter,
  Plus,
  Trash2,
  X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { playbooks, type Playbook } from "@/lib/data"

const tiposCrime = [...new Set(playbooks.map(p => p.tipoCrime))]

interface NovoPlaybook {
  nome: string
  codigo: string
  tipoCrime: string
  descricao: string
  objetivo: string
  condicaoUso: string
  passos: string[]
  responsaveis: string[]
  documentos: string[]
  diligenciasSugeridas: string[]
}

const emptyPlaybook: NovoPlaybook = {
  nome: "",
  codigo: "",
  tipoCrime: "",
  descricao: "",
  objetivo: "",
  condicaoUso: "",
  passos: [""],
  responsaveis: [""],
  documentos: [""],
  diligenciasSugeridas: [""]
}

export default function PlaybooksContent() {
  const [search, setSearch] = useState("")
  const [tipoCrime, setTipoCrime] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [novoPlaybook, setNovoPlaybook] = useState<NovoPlaybook>(emptyPlaybook)
  const [createStep, setCreateStep] = useState(1)

  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesSearch = 
      playbook.nome.toLowerCase().includes(search.toLowerCase()) ||
      playbook.codigo.toLowerCase().includes(search.toLowerCase()) ||
      playbook.descricao.toLowerCase().includes(search.toLowerCase())
    
    const matchesTipo = tipoCrime === "all" || playbook.tipoCrime === tipoCrime
    
    return matchesSearch && matchesTipo
  })

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
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Playbooks</h1>
            <p className="text-sm text-muted-foreground">
              Procedimentos operacionais padrão para investigações
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Criar Playbook</span>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar playbook..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tipoCrime} onValueChange={setTipoCrime}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 size-4" />
            <SelectValue placeholder="Tipo de crime" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {tiposCrime.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid de playbooks */}
      {filteredPlaybooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Nenhum playbook encontrado</p>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros de busca.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlaybooks.map((playbook) => (
            <Card 
              key={playbook.id} 
              className="transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(playbook.status)}>
                    {getStatusLabel(playbook.status)}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {playbook.codigo}
                  </span>
                </div>
                <CardTitle className="mt-3 text-lg">{playbook.nome}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {playbook.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{playbook.tipoCrime}</Badge>
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="size-3" />
                    {playbook.passos.length} passos
                  </Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/playbooks/${playbook.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="mr-1 size-4" />
                      Abrir
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de criação de playbook */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open)
        if (!open) {
          setNovoPlaybook(emptyPlaybook)
          setCreateStep(1)
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Playbook</DialogTitle>
            <DialogDescription>
              Passo {createStep} de 3 - {createStep === 1 ? "Informações básicas" : createStep === 2 ? "Procedimentos" : "Recursos"}
            </DialogDescription>
          </DialogHeader>

          {/* Indicador de progresso */}
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step <= createStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Informações básicas */}
          {createStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Playbook</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Investigação de Roubo"
                    value={novoPlaybook.nome}
                    onChange={(e) => setNovoPlaybook({ ...novoPlaybook, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="Ex: PB-ROUBO-001"
                    value={novoPlaybook.codigo}
                    onChange={(e) => setNovoPlaybook({ ...novoPlaybook, codigo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoCrime">Tipo de Crime</Label>
                <Select
                  value={novoPlaybook.tipoCrime}
                  onValueChange={(v) => setNovoPlaybook({ ...novoPlaybook, tipoCrime: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de crime" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCrime.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Breve descrição do playbook..."
                  value={novoPlaybook.descricao}
                  onChange={(e) => setNovoPlaybook({ ...novoPlaybook, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo</Label>
                <Textarea
                  id="objetivo"
                  placeholder="Qual o objetivo deste procedimento?"
                  value={novoPlaybook.objetivo}
                  onChange={(e) => setNovoPlaybook({ ...novoPlaybook, objetivo: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condicaoUso">Condição de Uso</Label>
                <Textarea
                  id="condicaoUso"
                  placeholder="Quando este playbook deve ser aplicado?"
                  value={novoPlaybook.condicaoUso}
                  onChange={(e) => setNovoPlaybook({ ...novoPlaybook, condicaoUso: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 2: Procedimentos */}
          {createStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Passos do Procedimento</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNovoPlaybook({
                      ...novoPlaybook,
                      passos: [...novoPlaybook.passos, ""]
                    })}
                  >
                    <Plus className="mr-1 size-4" />
                    Adicionar Passo
                  </Button>
                </div>
                <div className="space-y-2">
                  {novoPlaybook.passos.map((passo, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`Passo ${index + 1}...`}
                        value={passo}
                        onChange={(e) => {
                          const newPassos = [...novoPlaybook.passos]
                          newPassos[index] = e.target.value
                          setNovoPlaybook({ ...novoPlaybook, passos: newPassos })
                        }}
                        className="flex-1"
                      />
                      {novoPlaybook.passos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newPassos = novoPlaybook.passos.filter((_, i) => i !== index)
                            setNovoPlaybook({ ...novoPlaybook, passos: newPassos })
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Diligências Sugeridas</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNovoPlaybook({
                      ...novoPlaybook,
                      diligenciasSugeridas: [...novoPlaybook.diligenciasSugeridas, ""]
                    })}
                  >
                    <Plus className="mr-1 size-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {novoPlaybook.diligenciasSugeridas.map((dilig, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Input
                        placeholder="Diligência..."
                        value={dilig}
                        onChange={(e) => {
                          const newDilig = [...novoPlaybook.diligenciasSugeridas]
                          newDilig[index] = e.target.value
                          setNovoPlaybook({ ...novoPlaybook, diligenciasSugeridas: newDilig })
                        }}
                        className="w-40"
                      />
                      {novoPlaybook.diligenciasSugeridas.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            const newDilig = novoPlaybook.diligenciasSugeridas.filter((_, i) => i !== index)
                            setNovoPlaybook({ ...novoPlaybook, diligenciasSugeridas: newDilig })
                          }}
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Recursos */}
          {createStep === 3 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Responsáveis</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNovoPlaybook({
                      ...novoPlaybook,
                      responsaveis: [...novoPlaybook.responsaveis, ""]
                    })}
                  >
                    <Plus className="mr-1 size-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {novoPlaybook.responsaveis.map((resp, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Input
                        placeholder="Cargo/Função..."
                        value={resp}
                        onChange={(e) => {
                          const newResp = [...novoPlaybook.responsaveis]
                          newResp[index] = e.target.value
                          setNovoPlaybook({ ...novoPlaybook, responsaveis: newResp })
                        }}
                        className="w-40"
                      />
                      {novoPlaybook.responsaveis.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            const newResp = novoPlaybook.responsaveis.filter((_, i) => i !== index)
                            setNovoPlaybook({ ...novoPlaybook, responsaveis: newResp })
                          }}
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Documentos Relacionados</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNovoPlaybook({
                      ...novoPlaybook,
                      documentos: [...novoPlaybook.documentos, ""]
                    })}
                  >
                    <Plus className="mr-1 size-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {novoPlaybook.documentos.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Nome do documento..."
                        value={doc}
                        onChange={(e) => {
                          const newDocs = [...novoPlaybook.documentos]
                          newDocs[index] = e.target.value
                          setNovoPlaybook({ ...novoPlaybook, documentos: newDocs })
                        }}
                        className="flex-1"
                      />
                      {novoPlaybook.documentos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newDocs = novoPlaybook.documentos.filter((_, i) => i !== index)
                            setNovoPlaybook({ ...novoPlaybook, documentos: newDocs })
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-2 font-medium">Resumo do Playbook</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Nome:</span> {novoPlaybook.nome || "-"}</p>
                  <p><span className="font-medium text-foreground">Código:</span> {novoPlaybook.codigo || "-"}</p>
                  <p><span className="font-medium text-foreground">Tipo:</span> {novoPlaybook.tipoCrime || "-"}</p>
                  <p><span className="font-medium text-foreground">Passos:</span> {novoPlaybook.passos.filter(p => p).length}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {createStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateStep(createStep - 1)}
              >
                Voltar
              </Button>
            )}
            {createStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCreateStep(createStep + 1)}
                disabled={createStep === 1 && (!novoPlaybook.nome || !novoPlaybook.codigo)}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  // Aqui seria a lógica para salvar o playbook
                  setShowCreateDialog(false)
                  setNovoPlaybook(emptyPlaybook)
                  setCreateStep(1)
                }}
              >
                <CheckCircle2 className="mr-2 size-4" />
                Criar Playbook
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
