export type ElectoralPerson = {
  id: number
  name: string
  initials: string
  party: string
  office: string
  status: string
  running: boolean
  votes: number
  performance: number
  territory: string
  history: { year: number; office: string; votes: number; result: string }[]
}

export type Territory = {
  id: string
  name: string
  municipalities: number
  electorate: number
  coverage: number
  priority: 'Alta' | 'Média' | 'Estável'
  opportunity: string
  path: string
}

/**
 * O preenchimento do mapa é derivado da prioridade, não guardado por território:
 * é o que impede a legenda de mentir. Rampa sequencial do design system do Stitch.
 */
export const priorityColors: Record<Territory['priority'], string> = {
  Alta: '#0ea5e9',
  Média: '#38bdf8',
  Estável: '#7dd3fc',
}

export const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/** Células da grade mensal: `null` nos vazios antes do dia 1 e depois do último dia. */
export function monthCells(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null)
  for (let day = 1; day <= days; day++) cells.push(day)
  while (cells.length % 7) cells.push(null)
  return cells
}

export const electoralPeople: ElectoralPerson[] = [
  { id: 1, name: 'Helena Prado Nunes', initials: 'HN', party: 'Movimento Cívico 18', office: 'Deputada estadual', status: 'Mandato ativo', running: true, votes: 48270, performance: 78, territory: 'Vale do Ipê', history: [{ year: 2022, office: 'Deputada estadual', votes: 48270, result: 'Eleita' }, { year: 2018, office: 'Vereadora regional', votes: 12840, result: 'Eleita' }] },
  { id: 2, name: 'Caio Monteverde', initials: 'CM', party: 'Aliança Popular 44', office: 'Prefeito', status: 'Mandato ativo', running: false, votes: 36110, performance: 72, territory: 'Serra Clara', history: [{ year: 2024, office: 'Prefeito', votes: 36110, result: 'Eleito' }, { year: 2020, office: 'Prefeito', votes: 29730, result: '2º turno' }] },
  { id: 3, name: 'Aline Campos Leal', initials: 'AL', party: 'Rede Democrática 27', office: 'Vereadora', status: 'Mandato ativo', running: true, votes: 9260, performance: 67, territory: 'Campos do Norte', history: [{ year: 2024, office: 'Vereadora', votes: 9260, result: 'Eleita' }, { year: 2020, office: 'Vereadora', votes: 6780, result: 'Suplente' }] },
  { id: 4, name: 'Ravi Portela Dias', initials: 'RD', party: 'Partido Horizonte 31', office: 'Deputado federal', status: 'Ex-mandatário', running: true, votes: 71190, performance: 63, territory: 'Rota das Águas', history: [{ year: 2022, office: 'Deputado federal', votes: 71190, result: 'Suplente' }, { year: 2018, office: 'Deputado federal', votes: 82310, result: 'Eleito' }] },
  { id: 5, name: 'Marina Sol Queiroz', initials: 'MQ', party: 'União Comunitária 12', office: 'Prefeita', status: 'Mandato ativo', running: false, votes: 21450, performance: 81, territory: 'Pantanais do Sul', history: [{ year: 2024, office: 'Prefeita', votes: 21450, result: 'Eleita' }, { year: 2020, office: 'Vice-prefeita', votes: 19420, result: 'Eleita' }] },
  { id: 6, name: 'Tomás de Alencar', initials: 'TA', party: 'Movimento Cívico 18', office: 'Senador', status: 'Pré-candidatura', running: true, votes: 268400, performance: 74, territory: 'Capital Central', history: [{ year: 2022, office: 'Senador', votes: 268400, result: '2º colocado' }, { year: 2018, office: 'Deputado federal', votes: 105200, result: 'Eleito' }] },
  { id: 7, name: 'Beatriz Sampaio Luz', initials: 'BL', party: 'Aliança Popular 44', office: 'Vereadora', status: 'Suplência', running: false, votes: 5430, performance: 49, territory: 'Vale do Ipê', history: [{ year: 2024, office: 'Vereadora', votes: 5430, result: 'Suplente' }] },
  { id: 8, name: 'Davi Freire Bastos', initials: 'DB', party: 'Rede Democrática 27', office: 'Prefeito', status: 'Ex-mandatário', running: true, votes: 18870, performance: 58, territory: 'Serra Clara', history: [{ year: 2024, office: 'Prefeito', votes: 18870, result: 'Não eleito' }, { year: 2020, office: 'Prefeito', votes: 22440, result: 'Eleito' }] },
  { id: 9, name: 'Lívia Amaral Viana', initials: 'LV', party: 'Partido Horizonte 31', office: 'Deputada estadual', status: 'Mandato ativo', running: true, votes: 41360, performance: 76, territory: 'Campos do Norte', history: [{ year: 2022, office: 'Deputada estadual', votes: 41360, result: 'Eleita' }] },
  { id: 10, name: 'Nilo Brandão Reis', initials: 'NR', party: 'União Comunitária 12', office: 'Vice-prefeito', status: 'Mandato ativo', running: false, votes: 17980, performance: 61, territory: 'Rota das Águas', history: [{ year: 2024, office: 'Vice-prefeito', votes: 17980, result: 'Eleito' }] },
  { id: 11, name: 'Yara Figueira Melo', initials: 'YM', party: 'Movimento Cívico 18', office: 'Vereadora', status: 'Mandato ativo', running: true, votes: 11820, performance: 83, territory: 'Capital Central', history: [{ year: 2024, office: 'Vereadora', votes: 11820, result: 'Eleita' }, { year: 2020, office: 'Vereadora', votes: 7400, result: 'Eleita' }] },
  { id: 12, name: 'Otávio Paes Leme', initials: 'OP', party: 'Aliança Popular 44', office: 'Deputado estadual', status: 'Suplência', running: true, votes: 29550, performance: 55, territory: 'Pantanais do Sul', history: [{ year: 2022, office: 'Deputado estadual', votes: 29550, result: 'Suplente' }] },
]

export const territories: Territory[] = [
  { id: 'serra', name: 'Serra Clara', municipalities: 11, electorate: 184200, coverage: 68, priority: 'Alta', opportunity: 'Consolidar presença em três municípios com crescimento acima da média.', path: 'M76 32 L169 18 L218 65 L190 134 L94 119 L48 72 Z' },
  { id: 'ipe', name: 'Vale do Ipê', municipalities: 9, electorate: 142800, coverage: 82, priority: 'Estável', opportunity: 'Ativar rede de apoiadores jovens em polos universitários fictícios.', path: 'M218 65 L310 41 L355 100 L321 163 L225 165 L190 134 Z' },
  { id: 'norte', name: 'Campos do Norte', municipalities: 14, electorate: 239600, coverage: 54, priority: 'Alta', opportunity: 'Território com maior eleitorado ainda sem agenda coordenada.', path: 'M310 41 L403 24 L470 77 L443 150 L355 171 L321 163 L355 100 Z' },
  { id: 'aguas', name: 'Rota das Águas', municipalities: 10, electorate: 167400, coverage: 73, priority: 'Média', opportunity: 'Aproximar lideranças comunitárias de dois corredores logísticos.', path: 'M94 119 L190 134 L225 165 L202 245 L101 257 L48 197 Z' },
  { id: 'capital', name: 'Capital Central', municipalities: 7, electorate: 412700, coverage: 61, priority: 'Alta', opportunity: 'Recuperar cobertura nos bairros de expansão e calendário de visitas.', path: 'M225 165 L321 163 L355 171 L364 249 L294 292 L202 245 Z' },
  { id: 'pantanais', name: 'Pantanais do Sul', municipalities: 12, electorate: 195300, coverage: 77, priority: 'Média', opportunity: 'Conectar pautas ambientais a agendas produtivas locais.', path: 'M355 171 L443 150 L480 213 L437 285 L364 249 Z' },
]

/**
 * Fila de conferência humana. O que torna uma linha acionável não é o percentual de
 * confiança — é saber QUAIS campos divergem entre os dois registros.
 */
export const linkQueue = [
  { id: 1, personId: 1, nacional: 'Helena Prado Nunes', local: 'Helena P. Nunes', registro: 120, confianca: 92, divergencias: ['Nome abreviado'] },
  { id: 2, personId: 2, nacional: 'Caio Monteverde', local: 'Caio Monte Verde', registro: 121, confianca: 85, divergencias: ['Grafia do sobrenome', 'Município de registro'] },
  { id: 3, personId: 3, nacional: 'Aline Campos Leal', local: 'Aline C. Leal', registro: 122, confianca: 78, divergencias: ['Nome abreviado', 'Data de nascimento'] },
  { id: 4, personId: 4, nacional: 'Ravi Portela Dias', local: 'Ravi Portela', registro: 123, confianca: 64, divergencias: ['Sobrenome ausente', 'Partido', 'Data de nascimento'] },
]

export const campaigns = [
  { name: 'Presença Regional 360', objective: 'Aumentar cobertura territorial qualificada', progress: 68, owner: 'Núcleo de articulação', period: 'Ago — Nov', status: 'Em andamento', fronts: 4 },
  { name: 'Vozes da Comunidade', objective: 'Ouvir 1.200 lideranças locais', progress: 44, owner: 'Relacionamento', period: 'Set — Dez', status: 'Em andamento', fronts: 3 },
  { name: 'Agenda Jovem 2030', objective: 'Construir propostas com novos eleitores', progress: 22, owner: 'Conteúdo e dados', period: 'Out — Fev', status: 'Planejada', fronts: 5 },
]

export const relationships = [
  { person: 'Aline Campos Leal', type: 'Reunião', when: 'Hoje, 09:30', by: 'Sofia Linhares', territory: 'Campos do Norte', note: 'Alinhamento sobre calendário comunitário e prioridades locais.' },
  { person: 'Marina Sol Queiroz', type: 'Visita', when: 'Ontem, 16:10', by: 'Rafael Guimar', territory: 'Pantanais do Sul', note: 'Visita institucional registrada com três encaminhamentos.' },
  { person: 'Caio Monteverde', type: 'Contato', when: '10 ago, 11:45', by: 'Cecília Prado', territory: 'Serra Clara', note: 'Contato telefônico para confirmação da agenda regional.' },
  { person: 'Yara Figueira Melo', type: 'Reunião', when: '08 ago, 14:00', by: 'Sofia Linhares', territory: 'Capital Central', note: 'Debate sobre mobilização de voluntários e escuta de bairros.' },
]

export const team = [
  { name: 'Sofia Linhares', initials: 'SL', bond: 'Funcionária', role: 'Coordenação política', area: 'Articulação', status: 'Ativa', hasAccess: true, liderancaId: 1 },
  { name: 'Rafael Guimar', initials: 'RG', bond: 'Prestador', role: 'Analista territorial', area: 'Inteligência', status: 'Ativo', hasAccess: true },
  { name: 'Cecília Prado', initials: 'CP', bond: 'Colaboradora', role: 'Assessoria de agenda', area: 'Relacionamento', status: 'Ativa', hasAccess: false },
  { name: 'Breno Valadares', initials: 'BV', bond: 'Funcionário', role: 'Analista de dados', area: 'Base Nacional', status: 'Ativo', hasAccess: true },
  { name: 'Maya Ventura', initials: 'MV', bond: 'Prestadora', role: 'Design de comunicação', area: 'Campanhas', status: 'Pausada', hasAccess: false, liderancaId: 3 },
]

// Tipos de usuário: MASTER (acesso total), EDITOR (criar/editar), VISUALIZADOR (só ler), ATENDENTE (limitado)
export type UserType = 'MASTER' | 'EDITOR' | 'VISUALIZADOR' | 'ATENDENTE'

export type TeamMember = {
  name: string
  initials: string
  bond: string
  role: string
  area: string
  status: string
  hasAccess: boolean
  liderancaId?: number // ID da liderança vinculada (se a pessoa também é liderança)
}

export const users = [
  { name: 'Sofia Linhares', initials: 'SL', email: 'sofia.linhares@exemplo.invalid', type: 'MASTER' as UserType, scope: 'Todo o território', status: 'Ativo', last: 'Hoje, 10:42', createdLeaders: 45 },
  { name: 'Rafael Guimar', initials: 'RG', email: 'rafael.guimar@exemplo.invalid', type: 'EDITOR' as UserType, scope: 'Serra Clara + 2', status: 'Ativo', last: 'Hoje, 08:15', createdLeaders: 23 },
  { name: 'Breno Valadares', initials: 'BV', email: 'breno.valadares@exemplo.invalid', type: 'EDITOR' as UserType, scope: 'Todo o território', status: 'Ativo', last: 'Ontem, 18:20', createdLeaders: 12 },
  { name: 'Iris Cordeiro', initials: 'IC', email: 'iris.cordeiro@exemplo.invalid', type: 'VISUALIZADOR' as UserType, scope: 'Capital Central', status: 'Convidado', last: 'Ainda não acessou', createdLeaders: 0 },
  { name: 'Lauro Quintana', initials: 'LQ', email: 'lauro.quintana@exemplo.invalid', type: 'ATENDENTE' as UserType, scope: 'Todo o território', status: 'Suspenso', last: '02 ago, 11:06', createdLeaders: 0 },
]

/**
 * Pessoas trazidas pela sincronização com o TSE que ainda não são lideranças cadastradas.
 * O sistema permite "promover" para liderança, o queemove da lista.
 */
export type TPessoaTSE = {
  id: number
  nome: string
  cpf: string
  cargo: string
  partido: string
  municipio: string
  ano: number
  votos: number
  resultado: string
  origem: 'TSE'
}

export const pessoasTSE: TPessoaTSE[] = [
  { id: 1, nome: 'Ricardo Souza Martins', cpf: '***.123.456-**', cargo: 'Prefeito', partido: 'MDB', municipio: 'Serra Clara', ano: 2024, votos: 28450, resultado: 'Eleito', origem: 'TSE' },
  { id: 2, nome: 'Juliana Alves Pinto', cpf: '***.234.567-**', cargo: 'Vereador', partido: 'PT', municipio: 'Capital Central', ano: 2024, votos: 8230, resultado: 'Eleita', origem: 'TSE' },
  { id: 3, nome: 'Marcos Antônio Ferreira', cpf: '***.345.678-**', cargo: 'Deputado Estadual', partido: 'PSD', municipio: 'Vale do Ipê', ano: 2022, votos: 45200, resultado: 'Eleito', origem: 'TSE' },
  { id: 4, nome: 'Carla Cristina Oliveira', cpf: '***.456.789-**', cargo: 'Prefeito', partido: 'PSB', municipio: 'Campos do Norte', ano: 2024, votos: 19870, resultado: 'Eleita', origem: 'TSE' },
  { id: 5, nome: 'Paulo Roberto Santos', cpf: '***.567.890-**', cargo: 'Vereador', partido: 'PL', municipio: 'Rota das Águas', ano: 2024, votos: 5120, resultado: 'Suplente', origem: 'TSE' },
  { id: 6, nome: 'Fernanda Lima Costa', cpf: '***.678.901-**', cargo: 'Deputado Federal', partido: 'UNIÃO', municipio: 'Pantanais do Sul', ano: 2022, votos: 89450, resultado: 'Eleita', origem: 'TSE' },
  { id: 7, nome: 'Bruno Mendes Silva', cpf: '***.789.012-**', cargo: 'Vice-Prefeito', partido: 'MDB', municipio: 'Serra Clara', ano: 2024, votos: 28450, resultado: 'Eleito', origem: 'TSE' },
  { id: 8, nome: 'Patrícia Andrade Reis', cpf: '***.890.123-**', cargo: 'Vereador', partido: 'REPUBLICANOS', municipio: 'Capital Central', ano: 2024, votos: 7650, resultado: 'Eleita', origem: 'TSE' },
  { id: 9, nome: 'Lucas Oliveira Souza', cpf: '***.901.234-**', cargo: 'Prefeito', partido: 'PP', municipio: 'Vale do Ipê', ano: 2024, votos: 22100, resultado: 'Não Eleito', origem: 'TSE' },
  { id: 10, nome: 'Ana Paula Ribeiro', cpf: '***.012.345-**', cargo: 'Deputado Estadual', partido: 'PDT', municipio: 'Campos do Norte', ano: 2022, votos: 32100, resultado: 'Suplente', origem: 'TSE' },
]
