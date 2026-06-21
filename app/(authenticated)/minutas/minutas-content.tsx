"use client"

import { useState } from "react"
import {
  FileEdit,
  Plus,
  Search,
  Copy,
  Send,
  Eye,
  FileText,
  Building2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  Mail
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { minutas, empresasOficio, boletinsOcorrencia, type Minuta } from "@/lib/data"

export default function MinutasContent() {
  const [search, setSearch] = useState("")
  const [selectedMinuta, setSelectedMinuta] = useState<Minuta | null>(null)
  const [oficioDialogOpen, setOficioDialogOpen] = useState(false)
  const [selectedEmpresas, setSelectedEmpresas] = useState<string[]>([])
  const [parametroBusca, setParametroBusca] = useState<string>("cpf")
  const [valorBusca, setValorBusca] = useState("")
  const [periodoInicio, setPeriodoInicio] = useState("")
  const [periodoFim, setPeriodoFim] = useState("")
  const [prazoResposta, setPrazoResposta] = useState("15")
  const [resumoInvestigacao, setResumoInvestigacao] = useState("")
  const [emailsAdicionais, setEmailsAdicionais] = useState("")

  const filteredMinutas = minutas.filter(minuta =>
    minuta.titulo.toLowerCase().includes(search.toLowerCase()) ||
    minuta.boRelacionado.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: Minuta["status"]) => {
    switch (status) {
      case "rascunho": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      case "revisao": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "publicado": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    }
  }

  const getStatusLabel = (status: Minuta["status"]) => {
    switch (status) {
      case "rascunho": return "Rascunho"
      case "revisao": return "Em revisão"
      case "publicado": return "Publicado"
    }
  }

  const getStatusIcon = (status: Minuta["status"]) => {
    switch (status) {
      case "rascunho": return <FileText className="size-4" />
      case "revisao": return <Clock className="size-4" />
      case "publicado": return <CheckCircle2 className="size-4" />
    }
  }

  const toggleEmpresa = (empresaId: string) => {
    setSelectedEmpresas(prev =>
      prev.includes(empresaId)
        ? prev.filter(id => id !== empresaId)
        : [...prev, empresaId]
    )
  }

  const empresasPorTipo = empresasOficio.reduce((acc, empresa) => {
    if (!acc[empresa.tipo]) acc[empresa.tipo] = []
    acc[empresa.tipo].push(empresa)
    return acc
  }, {} as Record<string, typeof empresasOficio>)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileEdit className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Minutas</h1>
            <p className="text-sm text-muted-foreground">
              Criação assistida de documentos e ofícios
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={oficioDialogOpen} onOpenChange={setOficioDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="mr-2 size-4" />
                Gerar ofício
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gerar Ofício</DialogTitle>
                <DialogDescription>
                  Configure os parâmetros para gerar ofícios para empresas e instituições
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Seleção de empresas */}
                <div className="space-y-3">
                  <FieldLabel>Selecione as empresas</FieldLabel>
                  <div className="space-y-3">
                    {Object.entries(empresasPorTipo).map(([tipo, empresas]) => (
                      <Collapsible key={tipo} defaultOpen={tipo === "Operadora"}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <Building2 className="size-4" />
                              {tipo}
                            </span>
                            <ChevronDown className="size-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            {empresas.map((empresa) => (
                              <label
                                key={empresa.id}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                  selectedEmpresas.includes(empresa.id)
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-muted/50"
                                }`}
                              >
                                <Checkbox
                                  checked={selectedEmpresas.includes(empresa.id)}
                                  onCheckedChange={() => toggleEmpresa(empresa.id)}
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{empresa.nome}</p>
                                  <p className="text-xs text-muted-foreground">{empresa.email}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                  {selectedEmpresas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEmpresas.map(id => {
                        const empresa = empresasOficio.find(e => e.id === id)
                        return empresa ? (
                          <Badge key={id} variant="secondary" className="gap-1">
                            {empresa.nome}
                            <button onClick={() => toggleEmpresa(id)}>
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Parâmetro de busca */}
                <FieldGroup>
                  <Field>
                    <FieldLabel>Parâmetro de busca</FieldLabel>
                    <Select value={parametroBusca} onValueChange={setParametroBusca}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="imei">IMEI</SelectItem>
                        <SelectItem value="pix">Chave PIX</SelectItem>
                        <SelectItem value="conta">Conta bancária</SelectItem>
                        <SelectItem value="valor_personalizado">Valor personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Valor</FieldLabel>
                    <Input
                      placeholder={
                        parametroBusca === "cpf" ? "000.000.000-00" :
                        parametroBusca === "telefone" ? "(00) 00000-0000" :
                        parametroBusca === "email" ? "exemplo@email.com" :
                        parametroBusca === "imei" ? "000000000000000" :
                        "Digite o valor"
                      }
                      value={valorBusca}
                      onChange={(e) => setValorBusca(e.target.value)}
                    />
                  </Field>
                </FieldGroup>

                <Separator />

                {/* Período */}
                <FieldGroup>
                  <Field orientation="horizontal">
                    <FieldLabel>Período da requisição</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={periodoInicio}
                        onChange={(e) => setPeriodoInicio(e.target.value)}
                      />
                      <span className="flex items-center text-sm text-muted-foreground">até</span>
                      <Input
                        type="date"
                        value={periodoFim}
                        onChange={(e) => setPeriodoFim(e.target.value)}
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel>Prazo para resposta (dias)</FieldLabel>
                    <Select value={prazoResposta} onValueChange={setPrazoResposta}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 dias</SelectItem>
                        <SelectItem value="15">15 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="45">45 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <Separator />

                {/* Resumo da investigação */}
                <Field>
                  <FieldLabel>Resumo da investigação</FieldLabel>
                  <FieldDescription>
                    Breve descrição do caso para contextualizar a requisição
                  </FieldDescription>
                  <Textarea
                    placeholder="Descreva brevemente os fatos relevantes da investigação..."
                    rows={4}
                    value={resumoInvestigacao}
                    onChange={(e) => setResumoInvestigacao(e.target.value)}
                  />
                </Field>

                {/* E-mails adicionais */}
                <Field>
                  <FieldLabel>E-mails adicionais para cópia</FieldLabel>
                  <Input
                    placeholder="email1@exemplo.com, email2@exemplo.com"
                    value={emailsAdicionais}
                    onChange={(e) => setEmailsAdicionais(e.target.value)}
                  />
                </Field>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setOficioDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 size-4" />
                  Gerar prévia
                </Button>
                <Button>
                  <FileText className="mr-2 size-4" />
                  Gerar documento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button>
            <Plus className="mr-2 size-4" />
            Nova minuta
          </Button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar minuta por título ou BO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs de status */}
      <Tabs defaultValue="todas">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="rascunho" className="gap-1">
            <FileText className="size-3" />
            Rascunhos
          </TabsTrigger>
          <TabsTrigger value="revisao" className="gap-1">
            <Clock className="size-3" />
            Em revisão
          </TabsTrigger>
          <TabsTrigger value="publicado" className="gap-1">
            <CheckCircle2 className="size-3" />
            Publicadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-4">
          <MinutasList 
            minutas={filteredMinutas} 
            onSelect={setSelectedMinuta}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="rascunho" className="mt-4">
          <MinutasList 
            minutas={filteredMinutas.filter(m => m.status === "rascunho")} 
            onSelect={setSelectedMinuta}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="revisao" className="mt-4">
          <MinutasList 
            minutas={filteredMinutas.filter(m => m.status === "revisao")} 
            onSelect={setSelectedMinuta}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>

        <TabsContent value="publicado" className="mt-4">
          <MinutasList 
            minutas={filteredMinutas.filter(m => m.status === "publicado")} 
            onSelect={setSelectedMinuta}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>
      </Tabs>

      {/* Sheet de edição da minuta */}
      <Sheet open={!!selectedMinuta} onOpenChange={() => setSelectedMinuta(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
          {selectedMinuta && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedMinuta.status)}>
                    {getStatusIcon(selectedMinuta.status)}
                    <span className="ml-1">{getStatusLabel(selectedMinuta.status)}</span>
                  </Badge>
                </div>
                <SheetTitle>{selectedMinuta.titulo}</SheetTitle>
                <SheetDescription>
                  BO: {selectedMinuta.boRelacionado} | Última atualização: {selectedMinuta.ultimaAtualizacao}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Editor principal */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Conteúdo</h4>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Sparkles className="size-3" />
                        Preencher automaticamente
                      </Button>
                    </div>
                    <Textarea
                      className="min-h-[400px] font-mono text-sm"
                      defaultValue={selectedMinuta.conteudo}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Salvar rascunho
                      </Button>
                      <Button variant="outline">
                        <Send className="mr-2 size-4" />
                        Enviar para revisão
                      </Button>
                      <Button>
                        Publicar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Painel lateral */}
                <div className="space-y-6">
                  {/* Dados do BO */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Dados do BO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {(() => {
                        const bo = boletinsOcorrencia.find(b => b.bo === selectedMinuta.boRelacionado)
                        if (!bo) return <p className="text-muted-foreground">BO não encontrado</p>
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Natureza:</span>
                              <span className="font-medium">{bo.natureza}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Data:</span>
                              <span className="font-medium">{bo.dataFato}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Vítima:</span>
                              <span className="font-medium">{bo.nome}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Local:</span>
                              <span className="font-medium">{bo.bairro}</span>
                            </div>
                          </>
                        )
                      })()}
                    </CardContent>
                  </Card>

                  {/* Campos pendentes */}
                  {selectedMinuta.camposPendentes.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
                          <AlertCircle className="size-4" />
                          Campos pendentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {selectedMinuta.camposPendentes.map((campo, i) => (
                            <li key={i} className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                              <div className="size-1.5 rounded-full bg-amber-500" />
                              {campo}
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 w-full border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
                        >
                          <Sparkles className="mr-2 size-3" />
                          Inserir sugestão
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Playbook vinculado */}
                  {selectedMinuta.playbookVinculado && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Playbook vinculado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {selectedMinuta.playbookVinculado}
                        </Badge>
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                          Ver procedimento completo
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Responsável */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span>{selectedMinuta.responsavel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span>{selectedMinuta.ultimaAtualizacao}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MinutasList({ 
  minutas, 
  onSelect,
  getStatusColor,
  getStatusLabel,
  getStatusIcon
}: { 
  minutas: Minuta[]
  onSelect: (minuta: Minuta) => void
  getStatusColor: (status: Minuta["status"]) => string
  getStatusLabel: (status: Minuta["status"]) => string
  getStatusIcon: (status: Minuta["status"]) => React.ReactNode
}) {
  if (minutas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileEdit className="size-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Nenhuma minuta criada ainda</p>
          <p className="text-sm text-muted-foreground">
            Crie uma nova minuta para começar.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {minutas.map((minuta) => (
        <Card 
          key={minuta.id} 
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={() => onSelect(minuta)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{minuta.titulo}</h3>
                  <Badge className={`gap-1 ${getStatusColor(minuta.status)}`}>
                    {getStatusIcon(minuta.status)}
                    {getStatusLabel(minuta.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-mono">BO: {minuta.boRelacionado}</span>
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {minuta.responsavel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {minuta.ultimaAtualizacao}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation()
                  onSelect(minuta)
                }}>
                  <Eye className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Copy className="size-4" />
                </Button>
                {minuta.status !== "publicado" && (
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Send className="size-4" />
                  </Button>
                )}
              </div>
            </div>
            {minuta.camposPendentes.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <AlertCircle className="size-4 text-amber-500" />
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  {minuta.camposPendentes.length} campo(s) pendente(s)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
