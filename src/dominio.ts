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

/**
 * O que separa reunião de compromisso de agenda é o que sobra depois: deliberação com dono
 * e prazo. Sem isso é só um evento no calendário.
 */
export const reunioes = [
  {
    id: 1, titulo: 'Coordenação regional — Centro Norte', data: '14 ago, 09:00', local: 'Aurora do Cerrado', status: 'Realizada', participantes: 7, pauta: 3,
    encaminhamentos: [
      { texto: 'Fechar calendário de visitas do ciclo', dono: 'Sofia Linhares', prazo: '20 ago', situacao: 'Em dia' },
      { texto: 'Levantar lideranças sem avaliação em Serra Alta', dono: 'Rafael Guimar', prazo: '18 ago', situacao: 'Atrasado' },
    ],
  },
  {
    id: 2, titulo: 'Alinhamento de prestação de contas', data: '12 ago, 15:30', local: 'Sede', status: 'Realizada', participantes: 4, pauta: 2,
    encaminhamentos: [
      { texto: 'Anexar comprovantes do deslocamento aéreo', dono: 'Breno Valadares', prazo: '16 ago', situacao: 'Concluído' },
    ],
  },
  { id: 3, titulo: 'Escuta com conselho comunitário', data: '21 ago, 10:00', local: 'Ipê Verde', status: 'Agendada', participantes: 12, pauta: 4, encaminhamentos: [] },
]

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
    pergunta: 'Quais municípios têm liderança aliada mas nenhuma visita nos últimos 90 dias?',
    resposta: 'Três municípios combinam presença política e ausência de agenda: Serra Alta, Rio Doce do Norte e Pedra Branca.',
    bases: ['Lideranças', 'Agenda', 'Municípios'], registros: 1284, confianca: 'Alta',
    linhas: [['Serra Alta', '2 aliados', 'última visita há 134 dias'], ['Rio Doce do Norte', '1 aliado', 'última visita há 97 dias'], ['Pedra Branca', '1 aliado', 'sem visita registrada']],
  },
  {
    pergunta: 'Onde a base cresceu sem que a cobertura territorial acompanhasse?',
    resposta: 'Campo Novo do Horizonte concentra 26% das lideranças novas do ciclo e tem o dossiê municipal mais incompleto da carteira.',
    bases: ['Lideranças', 'Municípios'], registros: 947, confianca: 'Média',
    linhas: [['Campo Novo do Horizonte', '+38 lideranças', 'dossiê 23% completo'], ['Serra Alta', '+11 lideranças', 'dossiê 42% completo']],
  },
]

export const sugestoesCruzamento = [
  'Quais lideranças aliadas estão em municípios sem prefeito aliado?',
  'Que municípios têm aniversário no próximo mês e nenhuma presença agendada?',
  'Onde houve queda de desempenho entre os dois últimos ciclos?',
]

export const aniversarios = [
  { dia: 3, categoria: 'Município', nome: 'Pedra Branca', detalhe: 'Aniversário da cidade', agendado: false },
  { dia: 11, categoria: 'Município', nome: 'Serra Alta', detalhe: 'Aniversário da cidade', agendado: true },
  { dia: 14, categoria: 'Liderança', nome: 'Aline Campos Leal', detalhe: 'Vereadora · Campo Novo do Horizonte', agendado: false },
  { dia: 22, categoria: 'Padroeira', nome: 'Ipê Verde', detalhe: 'Festa de Santa Rita', agendado: false },
  { dia: 26, categoria: 'Liderança', nome: 'Tomás de Alencar', detalhe: 'Senador · Vale Claro', agendado: true },
]

export const exportacoes = [
  { id: 1, solicitado: '10 ago, 15:25', concluido: '10 ago, 15:25', usuario: 'Eduardo Molina', modulo: 'Lideranças', formato: 'XLSX', situacao: 'Concluído', tamanho: '20 KB' },
  { id: 2, solicitado: '12 ago, 09:02', concluido: null, usuario: 'Sofia Linhares', modulo: 'Municípios', formato: 'XLSX', situacao: 'Processando', tamanho: '—' },
  { id: 3, solicitado: '02 ago, 11:40', concluido: '02 ago, 11:41', usuario: 'Breno Valadares', modulo: 'Eleições', formato: 'PDF', situacao: 'Expirado', tamanho: '1,4 MB' },
]

/** Status político por liderança — chaveado pelo id em electoralPeople. */
export const statusPolitico: Record<number, string> = {
  1: 'Aliado', 2: 'Adversário', 3: 'Aliado', 4: 'Neutro', 5: 'Aliado',
  6: 'Aliado parcial', 7: 'Não avaliado', 8: 'Adversário', 9: 'Aliado parcial',
  10: 'Não avaliado', 11: 'Aliado', 12: 'Neutro',
}
