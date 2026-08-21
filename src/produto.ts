/**
 * Camada de produto: o que o cliente compra e o que ele configura.
 *
 * O sistema é vendido por planos. O menu não é fixo no código — ele é renderizado a partir
 * dos módulos que o contrato do cliente habilita. Trocar de plano muda a navegação inteira,
 * e é assim que o mesmo produto atende grupos políticos diferentes.
 *
 * Os vocabulários também são do cliente, não nossos: a escala de status político, os tipos de
 * compromisso e o nome da divisão territorial mudam por contrato. Mato Grosso do Sul organiza
 * o estado em "mesorregiões"; a Bahia usa "territórios de identidade". Cravar um dos dois no
 * código transformaria o produto num sistema sob medida.
 */

export type Plano = 'essencial' | 'avancado' | 'inteligencia'

export const planos: { id: Plano; nome: string; resumo: string; preco: string }[] = [
  { id: 'essencial', nome: 'Essencial', resumo: 'Cadastro territorial e eleitoral, sem camada analítica.', preco: 'R$ 2.400/mês' },
  { id: 'avancado', nome: 'Avançado', resumo: 'Acrescenta operação de campo: agenda, reuniões, campanhas e prestação de contas.', preco: 'R$ 5.900/mês' },
  { id: 'inteligencia', nome: 'Inteligência', resumo: 'Acrescenta a camada derivada: insights, cruzamento de dados e base nacional.', preco: 'R$ 9.800/mês' },
]

/** Ordem dos planos: um módulo do plano N está incluído em todos os planos acima de N. */
export const ordemPlanos: Plano[] = ['essencial', 'avancado', 'inteligencia']

export type Modulo = {
  id: string
  label: string
  grupo: string
  plano: Plano
  descricao: string
  /** Núcleo do sistema: não pode ser desligado, senão o produto deixa de funcionar. */
  obrigatorio?: boolean
}

export const modulos: Modulo[] = [
  { id: 'bem-vindo', label: 'Bem-vindo', grupo: 'Início', plano: 'essencial', descricao: 'Porta de entrada com datas do dia e atalhos.', obrigatorio: true },
  { id: 'painel', label: 'Painel Executivo', grupo: 'Início', plano: 'essencial', descricao: 'Indicadores consolidados para decidir onde agir.', obrigatorio: true },

  { id: 'municipios', label: 'Municípios', grupo: 'Território', plano: 'essencial', descricao: 'Dossiê por município: oficiais do IBGE e observações da equipe.' },
  { id: 'mesorregioes', label: 'Mesorregiões', grupo: 'Território', plano: 'essencial', descricao: 'Visão agregada por mesorregião: municípios, cobertura e indicadores consolidados.' },
  { id: 'territorios', label: 'Territórios', grupo: 'Território', plano: 'avancado', descricao: 'Recortes próprios acima do município, com cobertura e prioridade.' },
  { id: 'eleicoes', label: 'Eleições', grupo: 'Território', plano: 'essencial', descricao: 'Apuração e resultados por cargo, turno e município.' },

  { id: 'quadro-eleitoral', label: 'Quadro Eleitoral', grupo: 'Relacionamento', plano: 'essencial', descricao: 'Quem concorreu ou concorre a eleição — atual e do passado — com avaliação política.' },
  { id: 'campanhas', label: 'Campanhas', grupo: 'Relacionamento', plano: 'avancado', descricao: 'Objetivos, frentes de trabalho e marcos.' },
  { id: 'agenda', label: 'Agenda', grupo: 'Relacionamento', plano: 'avancado', descricao: 'Viagens, visitas, reuniões e entrevistas, com rota entre municípios e encaminhamentos.' },
  { id: 'reunioes', label: 'Histórico', grupo: 'Relacionamento', plano: 'avancado', descricao: 'Registro de interações, visitas e contatos com candidatos e lideranças.' },
  { id: 'aniversarios', label: 'Aniversários', grupo: 'Relacionamento', plano: 'essencial', descricao: 'Datas de candidatos, municípios e padroeiras.' },

  { id: 'inteligencia', label: 'Inteligência', grupo: 'Análise', plano: 'inteligencia', descricao: 'Insights com evidência declarada e próximo passo.' },
  { id: 'cruzamento', label: 'Cruzamento de dados', grupo: 'Análise', plano: 'inteligencia', descricao: 'Perguntas em linguagem natural sobre as bases do sistema.' },
  { id: 'relatorios', label: 'Relatórios', grupo: 'Análise', plano: 'essencial', descricao: 'Comparação de candidaturas e desempenho municipal.' },
  { id: 'exportacoes', label: 'Exportações', grupo: 'Análise', plano: 'essencial', descricao: 'Extração em massa por módulo, seção e campo.' },

  { id: 'prestacao', label: 'Prestação de contas', grupo: 'Gestão', plano: 'avancado', descricao: 'Receitas, despesas e documentos por campanha, com trilha de auditoria.' },

  { id: 'base-nacional', label: 'Base Nacional', grupo: 'Administração', plano: 'inteligencia', descricao: 'Camada curada de TSE e IBGE e fila de vínculo de identidade.' },
  { id: 'equipe', label: 'Equipe', grupo: 'Administração', plano: 'essencial', descricao: 'Funcionários, colaboradores e prestadores.' },
  { id: 'usuarios', label: 'Usuários e Acessos', grupo: 'Administração', plano: 'essencial', descricao: 'Contas, perfis e permissão de escrita por módulo.', obrigatorio: true },
  { id: 'parametrizacoes', label: 'Parametrizações', grupo: 'Administração', plano: 'essencial', descricao: 'Vocabulários, planos e identidade do ambiente.', obrigatorio: true },
]

export const gruposOrdem = ['Início', 'Território', 'Relacionamento', 'Análise', 'Gestão', 'Administração']

export function moduloIncluso(modulo: Modulo, plano: Plano) {
  return ordemPlanos.indexOf(modulo.plano) <= ordemPlanos.indexOf(plano)
}

/**
 * Configuração do inquilino. Tudo aqui é do cliente e some quando ele troca de contrato —
 * nada disso pode estar cravado numa tela.
 */
export type Tenant = {
  nome: string
  sigla: string
  plano: Plano
  ativos: string[]
  /** Como o cliente chama a divisão territorial acima do município. */
  divisaoTerritorial: string
  candidatoPrincipal: string
  partidoReferencia: string
  /** A régua com que a equipe classifica gente. O produto não escolhe por ela. */
  escalaStatus: { valor: string; tom: 'green' | 'blue' | 'neutral' | 'red' | 'pendente'; descricao: string }[]
}

export const tenantPadrao: Tenant = {
  nome: 'Instituto Horizonte Cívico',
  sigla: 'IHC',
  plano: 'inteligencia',
  ativos: modulos.filter(m => moduloIncluso(m, 'inteligencia')).map(m => m.id),
  divisaoTerritorial: 'Mesorregião',
  candidatoPrincipal: 'Helena Prado Nunes',
  partidoReferencia: 'Movimento Cívico 18',
  escalaStatus: [
    { valor: 'Aliado', tom: 'green', descricao: 'Apoio declarado e integral.' },
    { valor: 'Aliado parcial', tom: 'blue', descricao: 'Apoia com ressalva ou em pautas específicas.' },
    { valor: 'Neutro', tom: 'neutral', descricao: 'Foi avaliado: não é aliado nem adversário.' },
    { valor: 'Adversário', tom: 'red', descricao: 'Posição contrária declarada.' },
    { valor: 'Não avaliado', tom: 'pendente', descricao: 'Ninguém analisou ainda. É lacuna, não posição.' },
  ],
}

/**
 * Perfil de acesso ≠ cargo. São duas coisas que parecem uma só e não são:
 *
 *   CARGO   (em Equipe)   — o que a pessoa faz no grupo político.
 *                           "Analista territorial", "Coordenação política".
 *   PERFIL  (em Usuários) — o que a pessoa pode fazer NO SISTEMA.
 *                           "Administrador", "Editor", "Leitor".
 *
 * Amarrar um ao outro impediria dois analistas territoriais de terem permissões
 * diferentes — que é justamente o caso comum quando um é sênior e o outro entrou ontem.
 * Por isso a tela de Equipe pede os dois, separados e explicados.
 */
export type Perfil = {
  id: string
  nome: string
  descricao: string
  /** Módulos que o perfil enxerga. `'*'` vê tudo que o contrato liberou. */
  ve: string[] | '*'
  /** Onde pode escrever. Ver e editar são permissões diferentes. */
  edita: string[] | '*'
}

export const perfis: Perfil[] = [
  { id: 'admin', nome: 'Administrador', descricao: 'Enxerga e edita tudo, inclusive contrato e usuários.', ve: '*', edita: '*' },
  {
    id: 'coordenacao', nome: 'Coordenação', descricao: 'Opera o dia a dia: cadastro, agenda e campanhas. Não mexe em contrato nem em usuários.',
    ve: ['bem-vindo', 'painel', 'municipios', 'territorios', 'eleicoes', 'quadro-eleitoral', 'campanhas', 'agenda', 'aniversarios', 'inteligencia', 'cruzamento', 'relatorios', 'exportacoes', 'prestacao', 'equipe'],
    edita: ['quadro-eleitoral', 'municipios', 'campanhas', 'agenda', 'aniversarios'],
  },
  {
    id: 'analise', nome: 'Análise', descricao: 'Lê tudo o que é dado e produz leitura. Não altera cadastro.',
    ve: ['bem-vindo', 'painel', 'municipios', 'territorios', 'eleicoes', 'quadro-eleitoral', 'inteligencia', 'cruzamento', 'relatorios', 'exportacoes', 'base-nacional'],
    edita: ['exportacoes'],
  },
  {
    id: 'leitura', nome: 'Leitura executiva', descricao: 'Só consulta o consolidado. Não abre cadastro individual nem exporta.',
    ve: ['bem-vindo', 'painel', 'relatorios'], edita: [],
  },
]

export function perfilVe(perfil: Perfil, moduloId: string) {
  return perfil.ve === '*' || perfil.ve.includes(moduloId)
}
export function perfilEdita(perfil: Perfil, moduloId: string) {
  return perfil.edita === '*' || perfil.edita.includes(moduloId)
}

/** Cargos do grupo político — vocabulário do cliente, sem relação com permissão. */
export const cargosEquipe = ['Coordenação política', 'Analista territorial', 'Assessoria de agenda', 'Analista de dados', 'Design de comunicação', 'Articulação regional']
export const vinculosEquipe = ['Funcionário', 'Prestador', 'Colaborador', 'Voluntário']
