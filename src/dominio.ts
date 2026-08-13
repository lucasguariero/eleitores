/**
 * Dados fictícios dos módulos acrescentados: municípios, eleições, agenda, reuniões,
 * prestação de contas e cruzamento. Tudo inventado — nenhum município, partido ou pessoa real.
 */

/** Oficiais (população, eleitores, código, prefeito) viriam do IBGE/TSE; o resto é da equipe. */
export type Municipio = {
  id: string
  nome: string
  codigo: string
  populacao: number
  eleitores: number
  divisao: string
  distanciaCapital: number
  prefeito: string
  partidoPrefeito: string
  vice: string
  aniversario: string
  padroeira: string | null
  pistaPouso: string | null
  completude: number
  favorito: boolean
}

export const municipios: Municipio[] = [
  { id: 'aurora', nome: 'Aurora do Cerrado', codigo: '9100101', populacao: 41280, eleitores: 31940, divisao: 'Centro Norte', distanciaCapital: 148, prefeito: 'Marina Sol Queiroz', partidoPrefeito: 'União Comunitária 12', vice: 'Nilo Brandão Reis', aniversario: '06 de fevereiro', padroeira: 'Nossa Senhora da Aurora', pistaPouso: 'Pista particular a 12 km', completude: 88, favorito: true },
  { id: 'ipe-verde', nome: 'Ipê Verde', codigo: '9100202', populacao: 28450, eleitores: 21870, divisao: 'Leste', distanciaCapital: 96, prefeito: 'Caio Monteverde', partidoPrefeito: 'Aliança Popular 44', vice: 'Beatriz Sampaio Luz', aniversario: '19 de março', padroeira: 'Santa Rita', pistaPouso: null, completude: 64, favorito: true },
  { id: 'serra-alta', nome: 'Serra Alta', codigo: '9100303', populacao: 63710, eleitores: 48120, divisao: 'Centro Norte', distanciaCapital: 212, prefeito: 'Davi Freire Bastos', partidoPrefeito: 'Rede Democrática 27', vice: 'Otávio Paes Leme', aniversario: '11 de agosto', padroeira: null, pistaPouso: 'Aeródromo municipal', completude: 42, favorito: false },
  { id: 'porto-lirio', nome: 'Porto Lírio', codigo: '9100404', populacao: 19630, eleitores: 15280, divisao: 'Pantanais', distanciaCapital: 305, prefeito: 'Yara Figueira Melo', partidoPrefeito: 'Movimento Cívico 18', vice: 'Ravi Portela Dias', aniversario: '02 de julho', padroeira: 'São Pedro', pistaPouso: 'Pista particular a 4 km', completude: 71, favorito: false },
  { id: 'campo-novo', nome: 'Campo Novo do Horizonte', codigo: '9100505', populacao: 87340, eleitores: 66910, divisao: 'Sudoeste', distanciaCapital: 74, prefeito: 'Aline Campos Leal', partidoPrefeito: 'Rede Democrática 27', vice: 'Lívia Amaral Viana', aniversario: '28 de outubro', padroeira: null, pistaPouso: null, completude: 23, favorito: false },
  { id: 'vale-claro', nome: 'Vale Claro', codigo: '9100606', populacao: 34990, eleitores: 26730, divisao: 'Leste', distanciaCapital: 167, prefeito: 'Tomás de Alencar', partidoPrefeito: 'Movimento Cívico 18', vice: 'Helena Prado Nunes', aniversario: '15 de maio', padroeira: 'Nossa Senhora do Vale', pistaPouso: 'Aeródromo compartilhado', completude: 95, favorito: true },
  { id: 'pedra-branca', nome: 'Pedra Branca', codigo: '9100707', populacao: 12480, eleitores: 9640, divisao: 'Pantanais', distanciaCapital: 388, prefeito: 'Nilo Brandão Reis', partidoPrefeito: 'União Comunitária 12', vice: 'Marina Sol Queiroz', aniversario: '30 de janeiro', padroeira: null, pistaPouso: null, completude: 12, favorito: false },
  { id: 'rio-doce', nome: 'Rio Doce do Norte', codigo: '9100808', populacao: 52170, eleitores: 39880, divisao: 'Centro Norte', distanciaCapital: 259, prefeito: 'Otávio Paes Leme', partidoPrefeito: 'Aliança Popular 44', vice: 'Davi Freire Bastos', aniversario: '07 de setembro', padroeira: 'Santo Antônio', pistaPouso: 'Pista particular a 21 km', completude: 57, favorito: false },
]

export const divisoes = [
  { nome: 'Centro Norte', municipios: 3, populacao: 157160, eleitores: 119940 },
  { nome: 'Leste', municipios: 2, populacao: 63440, eleitores: 48600 },
  { nome: 'Pantanais', municipios: 2, populacao: 32110, eleitores: 24920 },
  { nome: 'Sudoeste', municipios: 1, populacao: 87340, eleitores: 66910 },
]

export const apuracao = {
  ano: 2026, apuradas: 98.4, eleitores: 261370, candidatos: 14, votosValidos: 214880,
  cargos: [
    {
      cargo: 'Governador', turnos: [
        {
          turno: '1º turno', apurado: 100, nomes: [
            { nome: 'Helena Prado Nunes', partido: 'Movimento Cívico 18', pct: 47.2, votos: 101420, eleito: false },
            { nome: 'Caio Monteverde', partido: 'Aliança Popular 44', pct: 41.8, votos: 89820, eleito: false },
            { nome: 'Lívia Amaral Viana', partido: 'Partido Horizonte 31', pct: 11.0, votos: 23640, eleito: false },
          ],
        },
        {
          turno: '2º turno', apurado: 100, nomes: [
            { nome: 'Helena Prado Nunes', partido: 'Movimento Cívico 18', pct: 53.6, votos: 115180, eleito: true },
            { nome: 'Caio Monteverde', partido: 'Aliança Popular 44', pct: 46.4, votos: 99700, eleito: false },
          ],
        },
      ],
    },
    {
      cargo: 'Prefeito · Campo Novo do Horizonte', turnos: [
        {
          turno: 'Turno único', apurado: 96, nomes: [
            { nome: 'Aline Campos Leal', partido: 'Rede Democrática 27', pct: 58.3, votos: 39010, eleito: true },
            { nome: 'Beatriz Sampaio Luz', partido: 'Aliança Popular 44', pct: 41.7, votos: 27900, eleito: false },
          ],
        },
      ],
    },
  ],
}

export const rota = {
  nome: 'Ciclo Centro Norte — semana 34',
  paradas: [
    { ordem: 1, municipio: 'Aurora do Cerrado', data: '18 ago', tipo: 'Visita', km: 0, pista: true },
    { ordem: 2, municipio: 'Rio Doce do Norte', data: '18 ago', tipo: 'Reunião', km: 112, pista: true },
    { ordem: 3, municipio: 'Serra Alta', data: '19 ago', tipo: 'Entrevista', km: 87, pista: true },
    { ordem: 4, municipio: 'Vale Claro', data: '20 ago', tipo: 'Visita', km: 143, pista: true },
  ],
}


export const contas = {
  periodo: 'Ciclo 2026 · agosto',
  receitas: 486000, despesas: 391240, saldo: 94760,
  lancamentos: [
    { id: 1, data: '11 ago', descricao: 'Locação de veículo — ciclo Centro Norte', categoria: 'Deslocamento', valor: -18400, campanha: 'Presença Regional 360', documento: true, situacao: 'Conferido' },
    { id: 2, data: '10 ago', descricao: 'Doação de pessoa física', categoria: 'Receita', valor: 120000, campanha: '—', documento: true, situacao: 'Conferido' },
    { id: 3, data: '09 ago', descricao: 'Material gráfico — escuta comunitária', categoria: 'Comunicação', valor: -26700, campanha: 'Vozes da Comunidade', documento: false, situacao: 'Sem comprovante' },
    { id: 4, data: '08 ago', descricao: 'Hospedagem da equipe técnica', categoria: 'Deslocamento', valor: -9850, campanha: 'Presença Regional 360', documento: false, situacao: 'Sem comprovante' },
    { id: 5, data: '05 ago', descricao: 'Serviço de consultoria territorial', categoria: 'Serviços', valor: -42000, campanha: 'Agenda Jovem 2030', documento: true, situacao: 'Em conferência' },
  ],
}

/**
 * A resposta declara de quais bases saiu e quantos registros entraram na conta. Sem isso é
 * adivinhação com cara de relatório.
 */
export const cruzamentos = [
  {
    pergunta: 'Quais municípios têm candidato aliado mas nenhuma visita nos últimos 90 dias?',
    resposta: 'Três municípios combinam presença política e ausência de agenda: Serra Alta, Rio Doce do Norte e Pedra Branca.',
    bases: ['Quadro Eleitoral', 'Agenda', 'Municípios'], registros: 1284, confianca: 'Alta',
    linhas: [['Serra Alta', '2 aliados', 'última visita há 134 dias'], ['Rio Doce do Norte', '1 aliado', 'última visita há 97 dias'], ['Pedra Branca', '1 aliado', 'sem visita registrada']],
  },
  {
    pergunta: 'Onde a base cresceu sem que a cobertura territorial acompanhasse?',
    resposta: 'Campo Novo do Horizonte concentra 26% dos candidatos novos do ciclo e tem o dossiê municipal mais incompleto da carteira.',
    bases: ['Quadro Eleitoral', 'Municípios'], registros: 947, confianca: 'Média',
    linhas: [['Campo Novo do Horizonte', '+38 candidatos', 'dossiê 23% completo'], ['Serra Alta', '+11 candidatos', 'dossiê 42% completo']],
  },
]

export const sugestoesCruzamento = [
  'Quais candidatos aliados estão em municípios sem prefeito aliado?',
  'Que municípios têm aniversário no próximo mês e nenhuma presença agendada?',
  'Onde houve queda de desempenho entre os dois últimos ciclos?',
]

export const aniversarios = [
  { dia: 3, categoria: 'Município', nome: 'Pedra Branca', detalhe: 'Aniversário da cidade', agendado: false },
  { dia: 11, categoria: 'Município', nome: 'Serra Alta', detalhe: 'Aniversário da cidade', agendado: true },
  { dia: 14, categoria: 'Candidato', nome: 'Aline Campos Leal', detalhe: 'Vereadora · Campo Novo do Horizonte', agendado: false },
  { dia: 22, categoria: 'Padroeira', nome: 'Ipê Verde', detalhe: 'Festa de Santa Rita', agendado: false },
  { dia: 26, categoria: 'Candidato', nome: 'Tomás de Alencar', detalhe: 'Senador · Vale Claro', agendado: true },
]

export const exportacoes = [
  { id: 1, solicitado: '10 ago, 15:25', concluido: '10 ago, 15:25', usuario: 'Eduardo Molina', modulo: 'Quadro Eleitoral', formato: 'XLSX', situacao: 'Concluído', tamanho: '20 KB' },
  { id: 2, solicitado: '12 ago, 09:02', concluido: null, usuario: 'Sofia Linhares', modulo: 'Municípios', formato: 'XLSX', situacao: 'Processando', tamanho: '—' },
  { id: 3, solicitado: '02 ago, 11:40', concluido: '02 ago, 11:41', usuario: 'Breno Valadares', modulo: 'Eleições', formato: 'PDF', situacao: 'Expirado', tamanho: '1,4 MB' },
]

/** Status político por candidato — chaveado pelo id em electoralPeople. */
export const statusPolitico: Record<number, string> = {
  1: 'Aliado', 2: 'Adversário', 3: 'Aliado', 4: 'Neutro', 5: 'Aliado',
  6: 'Aliado parcial', 7: 'Não avaliado', 8: 'Adversário', 9: 'Aliado parcial',
  10: 'Não avaliado', 11: 'Aliado', 12: 'Neutro',
}

/**
 * Agenda unificada. Reunião não é um módulo irmão da agenda — é um TIPO de compromisso.
 * Manter os dois separados obrigava a equipe a lembrar em qual tela registrar cada coisa,
 * e deixava viagem e visita sem o que a reunião tinha de melhor: encaminhamento com dono
 * e prazo. Aqui todo compromisso pode gerar encaminhamento; o tipo só muda o que se espera
 * dele (reunião tem pauta, viagem tem trajeto).
 */
export type TipoCompromisso = 'Viagem' | 'Visita' | 'Reunião' | 'Entrevista'

export type Encaminhamento = {
  texto: string
  dono: string
  prazo: string
  situacao: 'Em dia' | 'Atrasado' | 'Concluído'
}

export type Compromisso = {
  id: number
  tipo: TipoCompromisso
  titulo: string
  /** ISO, para ordenar e agrupar sem depender de parsing de texto. */
  data: string
  hora: string
  municipio: string
  responsavel: string
  participantes: number
  situacao: 'Marcado' | 'Cumprido' | 'Descumprido'
  vinculo?: string
  pauta?: string[]
  encaminhamentos: Encaminhamento[]
}

export const compromissos: Compromisso[] = [
  {
    id: 1, tipo: 'Reunião', titulo: 'Coordenação regional — Centro Norte', data: '2026-08-14', hora: '09:00',
    municipio: 'Aurora do Cerrado', responsavel: 'Sofia Linhares', participantes: 7, situacao: 'Cumprido',
    vinculo: 'Presença Regional 360',
    pauta: ['Calendário de visitas do ciclo', 'Candidatos sem avaliação', 'Orçamento de deslocamento'],
    encaminhamentos: [
      { texto: 'Fechar calendário de visitas do ciclo', dono: 'Sofia Linhares', prazo: '20 ago', situacao: 'Em dia' },
      { texto: 'Levantar candidatos sem avaliação em Serra Alta', dono: 'Rafael Guimar', prazo: '18 ago', situacao: 'Atrasado' },
    ],
  },
  {
    id: 2, tipo: 'Reunião', titulo: 'Alinhamento de prestação de contas', data: '2026-08-12', hora: '15:30',
    municipio: 'Sede', responsavel: 'Breno Valadares', participantes: 4, situacao: 'Cumprido',
    pauta: ['Comprovantes pendentes', 'Fechamento do período'],
    encaminhamentos: [{ texto: 'Anexar comprovantes do deslocamento aéreo', dono: 'Breno Valadares', prazo: '16 ago', situacao: 'Concluído' }],
  },
  {
    id: 3, tipo: 'Visita', titulo: 'Visita ao Polo Aurora', data: '2026-08-04', hora: '10:00',
    municipio: 'Aurora do Cerrado', responsavel: 'Sofia Linhares', participantes: 3, situacao: 'Cumprido',
    vinculo: 'Marina Sol Queiroz',
    encaminhamentos: [{ texto: 'Retornar com proposta de calendário comunitário', dono: 'Sofia Linhares', prazo: '22 ago', situacao: 'Em dia' }],
  },
  {
    id: 4, tipo: 'Entrevista', titulo: 'Entrevista com rádio regional', data: '2026-08-11', hora: '08:30',
    municipio: 'Ipê Verde', responsavel: 'Cecília Prado', participantes: 2, situacao: 'Cumprido',
    encaminhamentos: [],
  },
  {
    id: 5, tipo: 'Viagem', titulo: 'Viagem à Serra Alta', data: '2026-08-18', hora: '06:00',
    municipio: 'Serra Alta', responsavel: 'Rafael Guimar', participantes: 4, situacao: 'Marcado',
    vinculo: 'Ciclo Centro Norte',
    encaminhamentos: [{ texto: 'Confirmar pista de pouso e transporte terrestre', dono: 'Rafael Guimar', prazo: '16 ago', situacao: 'Atrasado' }],
  },
  {
    id: 6, tipo: 'Reunião', titulo: 'Escuta com conselho comunitário', data: '2026-08-21', hora: '10:00',
    municipio: 'Ipê Verde', responsavel: 'Sofia Linhares', participantes: 12, situacao: 'Marcado',
    pauta: ['Demandas de saneamento', 'Calendário de festas', 'Indicação de novas lideranças locais'],
    encaminhamentos: [],
  },
  {
    id: 7, tipo: 'Visita', titulo: 'Visita institucional à prefeitura', data: '2026-08-26', hora: '14:00',
    municipio: 'Campo Novo do Horizonte', responsavel: 'Cecília Prado', participantes: 3, situacao: 'Descumprido',
    vinculo: 'Aline Campos Leal',
    encaminhamentos: [{ texto: 'Remarcar — agenda do prefeito mudou na véspera', dono: 'Cecília Prado', prazo: '02 set', situacao: 'Atrasado' }],
  },
  {
    id: 8, tipo: 'Viagem', titulo: 'Rota das águas — três municípios', data: '2026-08-19', hora: '07:00',
    municipio: 'Rio Doce do Norte', responsavel: 'Rafael Guimar', participantes: 5, situacao: 'Marcado',
    vinculo: 'Ciclo Centro Norte', encaminhamentos: [],
  },
  {
    id: 9, tipo: 'Visita', titulo: 'Aniversário da cidade', data: '2026-08-11', hora: '19:00',
    municipio: 'Serra Alta', responsavel: 'Sofia Linhares', participantes: 6, situacao: 'Marcado',
    vinculo: 'Aniversário de Serra Alta', encaminhamentos: [],
  },
  {
    id: 10, tipo: 'Entrevista', titulo: 'Podcast regional sobre saneamento', data: '2026-09-03', hora: '11:00',
    municipio: 'Vale Claro', responsavel: 'Cecília Prado', participantes: 2, situacao: 'Marcado', encaminhamentos: [],
  },
]

export const tiposCompromisso: TipoCompromisso[] = ['Viagem', 'Visita', 'Reunião', 'Entrevista']

/** Agrupa por dia do mês pedido — o calendário e a visão de dia leem daqui. */
export function compromissosDoMes(ano: number, mes: number) {
  const prefixo = `${ano}-${String(mes).padStart(2, '0')}`
  return compromissos.filter(c => c.data.startsWith(prefixo))
}

export function compromissosDoDia(iso: string) {
  return compromissos.filter(c => c.data === iso).sort((a, b) => a.hora.localeCompare(b.hora))
}

/** Encaminhamentos abertos de qualquer compromisso — antes só existiam dentro de reunião. */
export function encaminhamentosAbertos() {
  return compromissos.flatMap(c => c.encaminhamentos.filter(e => e.situacao !== 'Concluído').map(e => ({ ...e, compromisso: c })))
}
