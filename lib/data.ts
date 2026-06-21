// Tipos do sistema de inteligência policial

export type MaturacaoStatus = "pendente" | "observacao" | "amadurecimento" | "pronto"
export type InvestigacaoStatus = "triagem" | "em_maturacao" | "aguardando_instauracao" | "em_investigacao" | "diligencia" | "minuta" | "concluido"
export type EtapaInvestigacao = "portaria" | "diligencias" | "oitivas" | "minutas" | "relatorio"

export interface BoletimOcorrencia {
  id: string
  bo: string
  dataRegistro: string
  natureza: string
  motivacao: string
  situacao: string
  delegacia: string
  dataFato: string
  horaFato: string
  endereco: string
  bairro: string
  municipio: string
  estado: string
  latitude: string
  longitude: string
  envolvimento: string
  nome: string
  sexo: string
  tipoPessoa: string
  dataNascimento: string
  nomeMae: string
  nomePai: string
  celular: string
  imei: string
  tipoDocumento: string
  numeroDocumento: string
  tipoObjeto: string
  envolvimentoObjeto: string
  categoriaObjeto: string
  objeto: string
  descricaoObjeto: string
  marca: string
  modelo: string
  historico: string
  // Campos calculados/derivados
  maturacao: MaturacaoStatus
  scoreMaturacao: number
  correlacoes: string[]
  evidencias: string[]
  bloqueado: boolean
  delegaciaBloqueio?: string
}

export interface Correlacao {
  id: string
  boA: string
  boB: string
  score: number
  evidencias: string[]
  descricao: string
}

export interface Investigacao {
  id: string
  codigo: string
  nome: string
  boOrigem: string
  bosVinculados: string[]
  status: InvestigacaoStatus
  etapaAtual: EtapaInvestigacao
  responsavel: string
  delegacia: string
  dataInstauracao: string
  ultimaAtualizacao: string
  prioridade: "baixa" | "media" | "alta" | "urgente"
  prazo: string
  pendencias: string[]
  bloqueado: boolean
}

export interface Playbook {
  id: string
  codigo: string
  nome: string
  tipoCrime: string
  descricao: string
  objetivo: string
  condicaoUso: string
  passos: string[]
  responsaveis: string[]
  documentos: string[]
  diligenciasSugeridas: string[]
  status: "ativo" | "inativo" | "em_revisao"
}

export interface Minuta {
  id: string
  titulo: string
  boRelacionado: string
  investigacaoId?: string
  status: "rascunho" | "revisao" | "publicado"
  conteudo: string
  ultimaAtualizacao: string
  responsavel: string
  camposPendentes: string[]
  playbookVinculado?: string
}

export interface Oficio {
  id: string
  minutaId: string
  empresas: string[]
  parametroBusca: "cpf" | "telefone" | "email" | "valor_personalizado"
  valorBusca: string
  periodo: string
  resumoInvestigacao: string
  prazo: string
  emailsAdicionais: string[]
  status: "rascunho" | "gerado" | "enviado"
}

export interface Usuario {
  id: string
  nome: string
  cargo: string
  delegacia: string
  perfil: "agente" | "escrivao" | "delegado" | "coordenador"
  email: string
}

export interface Delegacia {
  id: string
  nome: string
  codigo: string
  municipio: string
  estado: string
  bairrosAbrangencia: string[]
}

// Dados mock baseados no CSV fornecido e expandidos para demonstração

export const delegacias: Delegacia[] = [
  {
    id: "1",
    nome: "Delegacia pela Internet",
    codigo: "DPI",
    municipio: "Recife",
    estado: "Pernambuco",
    bairrosAbrangencia: ["Boa Viagem", "Pina", "Imbiribeira", "Brasília Teimosa"]
  },
  {
    id: "2",
    nome: "1ª Delegacia de Jaboatão",
    codigo: "1DJ",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    bairrosAbrangencia: ["Prazeres", "Piedade", "Candeias", "Centro"]
  },
  {
    id: "3",
    nome: "2ª Delegacia de Jaboatão",
    codigo: "2DJ",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    bairrosAbrangencia: ["Cajueiro Seco", "Curado", "Socorro", "Muribeca"]
  },
  {
    id: "4",
    nome: "Delegacia de Olinda",
    codigo: "DOL",
    municipio: "Olinda",
    estado: "Pernambuco",
    bairrosAbrangencia: ["Casa Caiada", "Bairro Novo", "Rio Doce", "Jardim Atlântico"]
  }
]

export const usuarios: Usuario[] = [
  {
    id: "1",
    nome: "Dr. Carlos Eduardo Mendes",
    cargo: "Delegado",
    delegacia: "Delegacia pela Internet",
    perfil: "delegado",
    email: "carlos.mendes@pc.pe.gov.br"
  },
  {
    id: "2",
    nome: "Agente Ana Paula Silva",
    cargo: "Agente de Polícia",
    delegacia: "Delegacia pela Internet",
    perfil: "agente",
    email: "ana.silva@pc.pe.gov.br"
  },
  {
    id: "3",
    nome: "Escrivão Roberto Santos",
    cargo: "Escrivão",
    delegacia: "1ª Delegacia de Jaboatão",
    perfil: "escrivao",
    email: "roberto.santos@pc.pe.gov.br"
  }
]

// BOs mockados baseados no CSV e expandidos
export const boletinsOcorrencia: BoletimOcorrencia[] = [
  {
    id: "1",
    bo: "64I0319198002",
    dataRegistro: "23/09/2025",
    natureza: "EXTRAVIO",
    motivacao: "",
    situacao: "Consumado",
    delegacia: "Delegacia pela Internet",
    dataFato: "22/09/2025",
    horaFato: "14:00",
    endereco: "Rua Professor Carlos",
    bairro: "Prazeres",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    latitude: "-8.1627",
    longitude: "-34.9180",
    envolvimento: "VITIMA",
    nome: "Pedro Campos de Souza Lima",
    sexo: "M",
    tipoPessoa: "Física",
    dataNascimento: "20/08/1994",
    nomeMae: "Maria Vitória Barros Novaes",
    nomePai: "João Victor de Sá",
    celular: "",
    imei: "",
    tipoDocumento: "RG",
    numeroDocumento: "4265478",
    tipoObjeto: "CARTEIRA PORTA CÉDULA",
    envolvimentoObjeto: "OUTROS MOTIVOS",
    categoriaObjeto: "CARTEIRA PORTA CÉDULA",
    objeto: "CARTEIRA PORTA CEDULA",
    descricaoObjeto: "",
    marca: "NÃO SEI",
    modelo: "NÃO INFORMADO",
    historico: "Vítima relata que perdeu a carteira contendo documentos pessoais durante trajeto de ônibus.",
    maturacao: "pendente",
    scoreMaturacao: 0.2,
    correlacoes: [],
    evidencias: ["RG"],
    bloqueado: false
  },
  {
    id: "2",
    bo: "64I0319198003",
    dataRegistro: "24/09/2025",
    natureza: "FURTO",
    motivacao: "Subtração de bem móvel",
    situacao: "Consumado",
    delegacia: "Delegacia pela Internet",
    dataFato: "23/09/2025",
    horaFato: "18:30",
    endereco: "Av. Barreto de Menezes, 500",
    bairro: "Piedade",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    latitude: "-8.1580",
    longitude: "-34.9230",
    envolvimento: "VITIMA",
    nome: "Maria Fernanda Oliveira",
    sexo: "F",
    tipoPessoa: "Física",
    dataNascimento: "15/03/1988",
    nomeMae: "Joana Oliveira dos Santos",
    nomePai: "Carlos Alberto Oliveira",
    celular: "(81) 99876-5432",
    imei: "354789102345678",
    tipoDocumento: "CPF",
    numeroDocumento: "123.456.789-00",
    tipoObjeto: "CELULAR",
    envolvimentoObjeto: "SUBTRAÍDO",
    categoriaObjeto: "APARELHO ELETRÔNICO",
    objeto: "SMARTPHONE",
    descricaoObjeto: "iPhone 14 Pro Max, cor prata",
    marca: "Apple",
    modelo: "iPhone 14 Pro Max",
    historico: "Vítima relata que teve o celular furtado enquanto aguardava o ônibus na parada próxima ao shopping.",
    maturacao: "observacao",
    scoreMaturacao: 0.45,
    correlacoes: ["64I0319198005"],
    evidencias: ["CPF", "IMEI", "Localização"],
    bloqueado: false
  },
  {
    id: "3",
    bo: "64I0319198004",
    dataRegistro: "25/09/2025",
    natureza: "ROUBO",
    motivacao: "Subtração mediante grave ameaça",
    situacao: "Consumado",
    delegacia: "Delegacia pela Internet",
    dataFato: "24/09/2025",
    horaFato: "21:15",
    endereco: "Rua da Aurora, 150",
    bairro: "Boa Vista",
    municipio: "Recife",
    estado: "Pernambuco",
    latitude: "-8.0631",
    longitude: "-34.8811",
    envolvimento: "VITIMA",
    nome: "João Ricardo Almeida",
    sexo: "M",
    tipoPessoa: "Física",
    dataNascimento: "10/07/1990",
    nomeMae: "Sandra Almeida Costa",
    nomePai: "Ricardo José Almeida",
    celular: "(81) 98765-4321",
    imei: "867530012345678",
    tipoDocumento: "CPF",
    numeroDocumento: "987.654.321-00",
    tipoObjeto: "CELULAR",
    envolvimentoObjeto: "ROUBADO",
    categoriaObjeto: "APARELHO ELETRÔNICO",
    objeto: "SMARTPHONE",
    descricaoObjeto: "Samsung Galaxy S23 Ultra, cor preta",
    marca: "Samsung",
    modelo: "Galaxy S23 Ultra",
    historico: "Vítima foi abordada por dois indivíduos em motocicleta que mediante ameaça com arma de fogo subtraíram seu aparelho celular e carteira.",
    maturacao: "amadurecimento",
    scoreMaturacao: 0.72,
    correlacoes: ["64I0319198006", "64I0319198007"],
    evidencias: ["CPF", "IMEI", "Testemunha", "Câmera de segurança"],
    bloqueado: false
  },
  {
    id: "4",
    bo: "64I0319198005",
    dataRegistro: "25/09/2025",
    natureza: "FURTO",
    motivacao: "Subtração de bem móvel",
    situacao: "Consumado",
    delegacia: "Delegacia pela Internet",
    dataFato: "24/09/2025",
    horaFato: "17:45",
    endereco: "Av. Barreto de Menezes, 480",
    bairro: "Piedade",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    latitude: "-8.1582",
    longitude: "-34.9228",
    envolvimento: "VITIMA",
    nome: "Ana Clara Rodrigues",
    sexo: "F",
    tipoPessoa: "Física",
    dataNascimento: "22/11/1995",
    nomeMae: "Lucia Rodrigues",
    nomePai: "Marcos Paulo Rodrigues",
    celular: "(81) 97654-3210",
    imei: "123456789012345",
    tipoDocumento: "CPF",
    numeroDocumento: "456.789.123-00",
    tipoObjeto: "CELULAR",
    envolvimentoObjeto: "SUBTRAÍDO",
    categoriaObjeto: "APARELHO ELETRÔNICO",
    objeto: "SMARTPHONE",
    descricaoObjeto: "iPhone 13, cor azul",
    marca: "Apple",
    modelo: "iPhone 13",
    historico: "Vítima estava na parada de ônibus quando percebeu que seu celular havia sido furtado de sua bolsa.",
    maturacao: "pronto",
    scoreMaturacao: 0.89,
    correlacoes: ["64I0319198003"],
    evidencias: ["CPF", "IMEI", "Localização", "Padrão similar"],
    bloqueado: false
  },
  {
    id: "5",
    bo: "64I0319198006",
    dataRegistro: "26/09/2025",
    natureza: "ROUBO",
    motivacao: "Subtração mediante grave ameaça",
    situacao: "Consumado",
    delegacia: "1ª Delegacia de Jaboatão",
    dataFato: "25/09/2025",
    horaFato: "20:30",
    endereco: "Rua São João, 200",
    bairro: "Prazeres",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    latitude: "-8.1650",
    longitude: "-34.9200",
    envolvimento: "VITIMA",
    nome: "Felipe Santos Costa",
    sexo: "M",
    tipoPessoa: "Física",
    dataNascimento: "05/04/1985",
    nomeMae: "Marta Santos",
    nomePai: "José Costa",
    celular: "(81) 96543-2109",
    imei: "987654321098765",
    tipoDocumento: "CPF",
    numeroDocumento: "321.654.987-00",
    tipoObjeto: "CELULAR",
    envolvimentoObjeto: "ROUBADO",
    categoriaObjeto: "APARELHO ELETRÔNICO",
    objeto: "SMARTPHONE",
    descricaoObjeto: "Motorola Edge 40, cor grafite",
    marca: "Motorola",
    modelo: "Edge 40",
    historico: "Vítima abordada por dois indivíduos em motocicleta Honda CG vermelha. Suspeitos armados. Modus operandi similar a outros casos na região.",
    maturacao: "pronto",
    scoreMaturacao: 0.92,
    correlacoes: ["64I0319198004", "64I0319198007"],
    evidencias: ["CPF", "IMEI", "Testemunha", "Modus operandi", "Placa parcial"],
    bloqueado: false
  },
  {
    id: "6",
    bo: "64I0319198007",
    dataRegistro: "27/09/2025",
    natureza: "ROUBO",
    motivacao: "Subtração mediante grave ameaça",
    situacao: "Consumado",
    delegacia: "1ª Delegacia de Jaboatão",
    dataFato: "26/09/2025",
    horaFato: "19:45",
    endereco: "Av. Presidente Kennedy, 1500",
    bairro: "Candeias",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    latitude: "-8.1800",
    longitude: "-34.9150",
    envolvimento: "VITIMA",
    nome: "Carla Beatriz Melo",
    sexo: "F",
    tipoPessoa: "Física",
    dataNascimento: "18/09/1992",
    nomeMae: "Teresa Melo",
    nomePai: "Antônio Carlos Melo",
    celular: "(81) 95432-1098",
    imei: "456789012345678",
    tipoDocumento: "CPF",
    numeroDocumento: "654.321.987-00",
    tipoObjeto: "CELULAR",
    envolvimentoObjeto: "ROUBADO",
    categoriaObjeto: "APARELHO ELETRÔNICO",
    objeto: "SMARTPHONE",
    descricaoObjeto: "Samsung Galaxy A54, cor verde",
    marca: "Samsung",
    modelo: "Galaxy A54",
    historico: "Vítima relata que foi abordada por dois homens em moto vermelha. Um deles portava arma de fogo. Padrão consistente com série de roubos na região.",
    maturacao: "pronto",
    scoreMaturacao: 0.95,
    correlacoes: ["64I0319198004", "64I0319198006"],
    evidencias: ["CPF", "IMEI", "Câmera", "Modus operandi", "Veículo identificado"],
    bloqueado: false
  },
  {
    id: "7",
    bo: "64I0319198008",
    dataRegistro: "28/09/2025",
    natureza: "ESTELIONATO",
    motivacao: "Fraude eletrônica",
    situacao: "Consumado",
    delegacia: "Delegacia pela Internet",
    dataFato: "27/09/2025",
    horaFato: "10:30",
    endereco: "Rua do Futuro, 300",
    bairro: "Boa Viagem",
    municipio: "Recife",
    estado: "Pernambuco",
    latitude: "-8.1200",
    longitude: "-34.9000",
    envolvimento: "VITIMA",
    nome: "Roberto Carlos Ferreira",
    sexo: "M",
    tipoPessoa: "Física",
    dataNascimento: "12/01/1970",
    nomeMae: "Josefa Ferreira",
    nomePai: "Manuel Ferreira",
    celular: "(81) 94321-0987",
    imei: "",
    tipoDocumento: "CPF",
    numeroDocumento: "111.222.333-44",
    tipoObjeto: "DINHEIRO",
    envolvimentoObjeto: "TRANSFERIDO INDEVIDAMENTE",
    categoriaObjeto: "VALOR MONETÁRIO",
    objeto: "PIX",
    descricaoObjeto: "Transferência via PIX no valor de R$ 5.000,00",
    marca: "",
    modelo: "",
    historico: "Vítima recebeu ligação de suposto funcionário do banco informando sobre tentativa de fraude. Foi induzida a transferir valores para conta de segurança.",
    maturacao: "observacao",
    scoreMaturacao: 0.55,
    correlacoes: ["64I0319198009"],
    evidencias: ["CPF", "PIX", "Telefone origem", "Conta destino"],
    bloqueado: false
  },
  {
    id: "8",
    bo: "64I0319198009",
    dataRegistro: "29/09/2025",
    natureza: "ESTELIONATO",
    motivacao: "Fraude eletrônica",
    situacao: "Consumado",
    delegacia: "Delegacia pela Internet",
    dataFato: "28/09/2025",
    horaFato: "11:15",
    endereco: "Av. Conselheiro Aguiar, 800",
    bairro: "Boa Viagem",
    municipio: "Recife",
    estado: "Pernambuco",
    latitude: "-8.1180",
    longitude: "-34.8950",
    envolvimento: "VITIMA",
    nome: "Helena Maria Santos",
    sexo: "F",
    tipoPessoa: "Física",
    dataNascimento: "25/06/1965",
    nomeMae: "Rosa Santos",
    nomePai: "João Santos",
    celular: "(81) 93210-9876",
    imei: "",
    tipoDocumento: "CPF",
    numeroDocumento: "222.333.444-55",
    tipoObjeto: "DINHEIRO",
    envolvimentoObjeto: "TRANSFERIDO INDEVIDAMENTE",
    categoriaObjeto: "VALOR MONETÁRIO",
    objeto: "PIX",
    descricaoObjeto: "Transferência via PIX no valor de R$ 8.500,00",
    marca: "",
    modelo: "",
    historico: "Vítima recebeu ligação de pessoa se passando por funcionário do banco. Modus operandi idêntico ao caso 64I0319198008. Mesmo número de telefone origem.",
    maturacao: "amadurecimento",
    scoreMaturacao: 0.78,
    correlacoes: ["64I0319198008"],
    evidencias: ["CPF", "PIX", "Telefone origem", "Conta destino", "Padrão idêntico"],
    bloqueado: false
  },
  {
    id: "9",
    bo: "64I0319198010",
    dataRegistro: "30/09/2025",
    natureza: "FURTO QUALIFICADO",
    motivacao: "Arrombamento de veículo",
    situacao: "Consumado",
    delegacia: "2ª Delegacia de Jaboatão",
    dataFato: "29/09/2025",
    horaFato: "02:30",
    endereco: "Rua das Palmeiras, 50",
    bairro: "Cajueiro Seco",
    municipio: "Jaboatão dos Guararapes",
    estado: "Pernambuco",
    latitude: "-8.1500",
    longitude: "-34.9400",
    envolvimento: "VITIMA",
    nome: "Marcos Antônio Lima",
    sexo: "M",
    tipoPessoa: "Física",
    dataNascimento: "08/02/1980",
    nomeMae: "Francisca Lima",
    nomePai: "Pedro Lima",
    celular: "(81) 92109-8765",
    imei: "",
    tipoDocumento: "CPF",
    numeroDocumento: "333.444.555-66",
    tipoObjeto: "SOM AUTOMOTIVO",
    envolvimentoObjeto: "SUBTRAÍDO",
    categoriaObjeto: "ACESSÓRIO VEICULAR",
    objeto: "RÁDIO E CAIXAS DE SOM",
    descricaoObjeto: "Sistema de som Pioneer completo",
    marca: "Pioneer",
    modelo: "AVH-Z9280TV",
    historico: "Vítima encontrou veículo arrombado pela manhã. Vidro traseiro quebrado. Sistema de som subtraído.",
    maturacao: "pendente",
    scoreMaturacao: 0.25,
    correlacoes: [],
    evidencias: ["Placa veículo"],
    bloqueado: false
  },
  {
    id: "10",
    bo: "64I0319198011",
    dataRegistro: "01/10/2025",
    natureza: "AMEAÇA",
    motivacao: "Violência doméstica",
    situacao: "Consumado",
    delegacia: "Delegacia de Olinda",
    dataFato: "30/09/2025",
    horaFato: "23:00",
    endereco: "Rua do Sol, 120",
    bairro: "Casa Caiada",
    municipio: "Olinda",
    estado: "Pernambuco",
    latitude: "-7.9950",
    longitude: "-34.8500",
    envolvimento: "VITIMA",
    nome: "Juliana Costa Pereira",
    sexo: "F",
    tipoPessoa: "Física",
    dataNascimento: "14/12/1990",
    nomeMae: "Sônia Costa",
    nomePai: "Paulo Pereira",
    celular: "(81) 91098-7654",
    imei: "",
    tipoDocumento: "CPF",
    numeroDocumento: "444.555.666-77",
    tipoObjeto: "",
    envolvimentoObjeto: "",
    categoriaObjeto: "",
    objeto: "",
    descricaoObjeto: "",
    marca: "",
    modelo: "",
    historico: "Vítima relata que ex-companheiro a ameaçou de morte através de mensagens de WhatsApp. Apresenta prints das conversas.",
    maturacao: "amadurecimento",
    scoreMaturacao: 0.68,
    correlacoes: [],
    evidencias: ["Prints WhatsApp", "Testemunha"],
    bloqueado: false
  }
]

// Investigações já instauradas
export const investigacoes: Investigacao[] = [
  {
    id: "1",
    codigo: "IPL-2025-0001",
    nome: "Série de Roubos em Jaboatão",
    boOrigem: "64I0319198004",
    bosVinculados: ["64I0319198006", "64I0319198007"],
    status: "em_investigacao",
    etapaAtual: "diligencias",
    responsavel: "Agente Ana Paula Silva",
    delegacia: "1ª Delegacia de Jaboatão",
    dataInstauracao: "28/09/2025",
    ultimaAtualizacao: "02/10/2025",
    prioridade: "alta",
    prazo: "15/11/2025",
    pendencias: ["Aguardando laudo pericial", "Oitiva de testemunha pendente"],
    bloqueado: false
  },
  {
    id: "2",
    codigo: "IPL-2025-0002",
    nome: "Golpe do Falso Funcionário Bancário",
    boOrigem: "64I0319198008",
    bosVinculados: ["64I0319198009"],
    status: "diligencia",
    etapaAtual: "oitivas",
    responsavel: "Escrivão Roberto Santos",
    delegacia: "Delegacia pela Internet",
    dataInstauracao: "30/09/2025",
    ultimaAtualizacao: "01/10/2025",
    prioridade: "media",
    prazo: "30/11/2025",
    pendencias: ["Requisição bancária pendente", "Identificação de conta destino"],
    bloqueado: false
  }
]

// Correlações detectadas
export const correlacoes: Correlacao[] = [
  {
    id: "1",
    boA: "64I0319198003",
    boB: "64I0319198005",
    score: 0.87,
    evidencias: ["Localização próxima", "Horário similar", "Mesmo modus operandi"],
    descricao: "Ambos os furtos ocorreram na mesma região (Piedade) em horários próximos, sugerindo mesmo autor."
  },
  {
    id: "2",
    boA: "64I0319198004",
    boB: "64I0319198006",
    score: 0.92,
    evidencias: ["Moto vermelha", "Dois indivíduos", "Arma de fogo", "Região próxima"],
    descricao: "Padrão de abordagem idêntico: dois indivíduos em moto vermelha, um armado."
  },
  {
    id: "3",
    boA: "64I0319198006",
    boB: "64I0319198007",
    score: 0.95,
    evidencias: ["Moto Honda CG vermelha", "Dois indivíduos", "Mesmo horário", "Região contígua"],
    descricao: "Série confirmada: mesmo veículo identificado em câmeras. Placa parcial MNO-XXX."
  },
  {
    id: "4",
    boA: "64I0319198008",
    boB: "64I0319198009",
    score: 0.98,
    evidencias: ["Mesmo telefone origem", "Mesmo script", "Conta destino similar", "Vítimas idosas"],
    descricao: "Fraude em série: mesmo número de telefone, mesmo discurso, perfil de vítima idêntico."
  }
]

// Playbooks operacionais
export const playbooks: Playbook[] = [
  {
    id: "1",
    codigo: "POP-001",
    nome: "Roubo com Emprego de Arma de Fogo",
    tipoCrime: "Roubo",
    descricao: "Procedimento padrão para investigação de roubos com emprego de arma de fogo.",
    objetivo: "Identificar autores e recuperar bens subtraídos através de investigação estruturada.",
    condicaoUso: "Aplicar quando houver relato de uso de arma de fogo na abordagem.",
    passos: [
      "1. Registrar BO com detalhes completos da abordagem",
      "2. Requisitar imagens de câmeras de segurança próximas",
      "3. Verificar correlações com outros BOs",
      "4. Requisitar geolocalização de dispositivo (se IMEI disponível)",
      "5. Ouvir vítima em termo circunstanciado",
      "6. Identificar e ouvir testemunhas",
      "7. Requisitar laudo pericial se houver vestígios",
      "8. Elaborar relatório conclusivo"
    ],
    responsaveis: ["Delegado", "Agente", "Escrivão"],
    documentos: ["Portaria", "Termo de declarações", "Requisição IMEI", "Ofício câmeras"],
    diligenciasSugeridas: ["Requisição IMEI", "Ofício para operadoras", "Reconhecimento fotográfico"],
    status: "ativo"
  },
  {
    id: "2",
    codigo: "POP-002",
    nome: "Estelionato Eletrônico - Golpe Bancário",
    tipoCrime: "Estelionato",
    descricao: "Procedimento para investigação de fraudes eletrônicas envolvendo transferências bancárias.",
    objetivo: "Identificar organização criminosa e rastrear valores transferidos.",
    condicaoUso: "Aplicar em casos de fraude envolvendo PIX, TED ou transferências induzidas.",
    passos: [
      "1. Registrar BO com todos os dados bancários",
      "2. Requisitar bloqueio cautelar da conta destino",
      "3. Oficiar instituição financeira origem",
      "4. Oficiar instituição financeira destino",
      "5. Requisitar quebra de sigilo telefônico",
      "6. Identificar padrão de fraude e correlacionar casos",
      "7. Elaborar relatório de inteligência",
      "8. Representar por medidas cautelares"
    ],
    responsaveis: ["Delegado", "Agente de Inteligência", "Escrivão"],
    documentos: ["Ofício bancário", "Requisição telefônica", "Representação judicial"],
    diligenciasSugeridas: ["Ofício Banco Central", "Requisição operadora", "Análise de metadados"],
    status: "ativo"
  },
  {
    id: "3",
    codigo: "POP-003",
    nome: "Furto de Celular com IMEI",
    tipoCrime: "Furto",
    descricao: "Procedimento para localização de aparelhos celulares furtados através do IMEI.",
    objetivo: "Localizar aparelho e identificar receptador/autor.",
    condicaoUso: "Aplicar quando a vítima possuir o IMEI do aparelho subtraído.",
    passos: [
      "1. Registrar BO com IMEI completo",
      "2. Cadastrar IMEI no sistema de bloqueio",
      "3. Oficiar operadoras para rastreamento",
      "4. Monitorar ativação do chip",
      "5. Localizar aparelho se houver sinal",
      "6. Realizar busca e apreensão se localizado",
      "7. Ouvir possuidor do aparelho",
      "8. Restituir bem à vítima"
    ],
    responsaveis: ["Agente", "Escrivão"],
    documentos: ["Ofício operadoras", "Mandado de busca", "Auto de apreensão"],
    diligenciasSugeridas: ["Cadastro IMEI", "Monitoramento chip", "Busca domiciliar"],
    status: "ativo"
  },
  {
    id: "4",
    codigo: "POP-004",
    nome: "Violência Doméstica - Lei Maria da Penha",
    tipoCrime: "Violência Doméstica",
    descricao: "Procedimento para casos de violência doméstica conforme Lei 11.340/2006.",
    objetivo: "Proteger a vítima e responsabilizar o agressor.",
    condicaoUso: "Aplicar em qualquer caso envolvendo violência no âmbito doméstico.",
    passos: [
      "1. Acolher vítima em ambiente reservado",
      "2. Registrar BO com detalhes da agressão",
      "3. Encaminhar para exame de corpo de delito",
      "4. Requisitar medidas protetivas de urgência",
      "5. Intimar agressor para oitiva",
      "6. Colher declarações de testemunhas",
      "7. Representar por prisão preventiva se necessário",
      "8. Remeter ao Juizado de Violência Doméstica"
    ],
    responsaveis: ["Delegado", "Agente", "Escrivão", "Psicólogo"],
    documentos: ["Representação MPU", "Termo vítima", "Requisição IML"],
    diligenciasSugeridas: ["Medida protetiva", "Exame IML", "Acompanhamento psicológico"],
    status: "ativo"
  }
]

// Minutas de exemplo
export const minutas: Minuta[] = [
  {
    id: "1",
    titulo: "Portaria de Instauração - IPL-2025-0001",
    boRelacionado: "64I0319198004",
    investigacaoId: "1",
    status: "publicado",
    conteudo: "PORTARIA Nº XXX/2025\n\nO DELEGADO DE POLÍCIA CIVIL, no uso de suas atribuições legais...",
    ultimaAtualizacao: "28/09/2025",
    responsavel: "Dr. Carlos Eduardo Mendes",
    camposPendentes: [],
    playbookVinculado: "POP-001"
  },
  {
    id: "2",
    titulo: "Ofício Requisição IMEI - Operadoras",
    boRelacionado: "64I0319198004",
    investigacaoId: "1",
    status: "rascunho",
    conteudo: "OFÍCIO Nº XXX/2025\n\nAo Sr. Representante Legal\n\nOperadora de Telefonia\n\nAssunto: Requisição de dados cadastrais e localização...",
    ultimaAtualizacao: "01/10/2025",
    responsavel: "Agente Ana Paula Silva",
    camposPendentes: ["IMEI", "Período solicitado", "Número do processo"],
    playbookVinculado: "POP-001"
  },
  {
    id: "3",
    titulo: "Ofício Instituição Financeira",
    boRelacionado: "64I0319198008",
    investigacaoId: "2",
    status: "revisao",
    conteudo: "OFÍCIO Nº XXX/2025\n\nAo Sr. Gerente Geral\n\nBanco do Brasil S/A\n\nAssunto: Requisição de informações bancárias...",
    ultimaAtualizacao: "02/10/2025",
    responsavel: "Escrivão Roberto Santos",
    camposPendentes: ["Conta destino", "Prazo de resposta"],
    playbookVinculado: "POP-002"
  }
]

// Empresas para ofícios
export const empresasOficio = [
  { id: "1", nome: "Claro S/A", tipo: "Operadora", email: "juridico@claro.com.br" },
  { id: "2", nome: "Vivo S/A", tipo: "Operadora", email: "juridico@vivo.com.br" },
  { id: "3", nome: "TIM S/A", tipo: "Operadora", email: "juridico@tim.com.br" },
  { id: "4", nome: "Banco do Brasil S/A", tipo: "Instituição Financeira", email: "juridico@bb.com.br" },
  { id: "5", nome: "Caixa Econômica Federal", tipo: "Instituição Financeira", email: "juridico@caixa.gov.br" },
  { id: "6", nome: "Itaú Unibanco S/A", tipo: "Instituição Financeira", email: "juridico@itau.com.br" },
  { id: "7", nome: "Bradesco S/A", tipo: "Instituição Financeira", email: "juridico@bradesco.com.br" },
  { id: "8", nome: "Nubank", tipo: "Instituição Financeira", email: "juridico@nubank.com.br" },
  { id: "9", nome: "PicPay", tipo: "Instituição de Pagamento", email: "juridico@picpay.com" },
  { id: "10", nome: "Mercado Pago", tipo: "Instituição de Pagamento", email: "juridico@mercadopago.com" },
  { id: "11", nome: "Google Brasil", tipo: "Tecnologia", email: "legal-br@google.com" },
  { id: "12", nome: "Meta Platforms", tipo: "Tecnologia", email: "legal@meta.com" },
  { id: "13", nome: "Apple Brasil", tipo: "Tecnologia", email: "legal@apple.com" }
]

// Funções auxiliares
export function getMaturacaoColor(maturacao: MaturacaoStatus): string {
  switch (maturacao) {
    case "pendente": return "bg-muted text-muted-foreground"
    case "observacao": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "amadurecimento": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "pronto": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
  }
}

export function getMaturacaoLabel(maturacao: MaturacaoStatus): string {
  switch (maturacao) {
    case "pendente": return "Pendente"
    case "observacao": return "Em observação"
    case "amadurecimento": return "Em amadurecimento"
    case "pronto": return "Pronto para instauração"
  }
}

export function getStatusColor(status: InvestigacaoStatus): string {
  switch (status) {
    case "triagem": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    case "em_maturacao": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "aguardando_instauracao": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    case "em_investigacao": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "diligencia": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
    case "minuta": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case "concluido": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
  }
}

export function getStatusLabel(status: InvestigacaoStatus): string {
  switch (status) {
    case "triagem": return "Triagem"
    case "em_maturacao": return "Em maturação"
    case "aguardando_instauracao": return "Aguardando instauração"
    case "em_investigacao": return "Em investigação"
    case "diligencia": return "Diligência"
    case "minuta": return "Minuta"
    case "concluido": return "Concluído"
  }
}

export function getPrioridadeColor(prioridade: Investigacao["prioridade"]): string {
  switch (prioridade) {
    case "baixa": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    case "media": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    case "alta": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    case "urgente": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  }
}

export function getPrioridadeLabel(prioridade: Investigacao["prioridade"]): string {
  switch (prioridade) {
    case "baixa": return "Baixa"
    case "media": return "Média"
    case "alta": return "Alta"
    case "urgente": return "Urgente"
  }
}
