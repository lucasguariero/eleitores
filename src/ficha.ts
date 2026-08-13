/**
 * Camada interna da ficha do candidato — o que a equipe preenche à mão, separado do que
 * chega do TSE. Campos ausentes são propositais: é o que alimenta a completude e o bloco
 * "Completar cadastro". Uma ficha 100% preenchida esconderia o problema que o desenho resolve.
 */

export type DadosInternos = {
  telefone?: string
  conjuge?: string
  areas?: string[]
  atributos?: string[]
  canal?: string
  observacao?: { texto: string; autor: string; data: string }
  vinculos?: { pessoaId: number; tipo: string }[]
}

/** Peso estratégico de cada campo interno: define a ordem do bloco de pendências. */
export const camposInternos: { chave: keyof DadosInternos; label: string; porque: string }[] = [
  { chave: 'vinculos', label: 'Vínculos com outros candidatos', porque: 'é o que revela quem influencia quem na região' },
  { chave: 'areas', label: 'Áreas de atuação', porque: 'define em que pauta a aproximação faz sentido' },
  { chave: 'telefone', label: 'Telefone institucional', porque: 'sem ele a agenda não sai do papel' },
  { chave: 'atributos', label: 'Atributos de liderança', porque: 'orienta o tipo de abordagem' },
  { chave: 'conjuge', label: 'Cônjuge', porque: 'costuma ser porta de entrada em município pequeno' },
  { chave: 'canal', label: 'Canal preferencial', porque: 'evita contato pelo meio errado' },
  { chave: 'observacao', label: 'Observação política', porque: 'é o contexto que não cabe em campo estruturado' },
]

export const dadosInternos: Record<number, DadosInternos> = {
  1: {
    telefone: '(00) 90000-0101', areas: ['Educação', 'Saúde'],
    atributos: ['Articuladora', 'Base comunitária'], canal: 'Assessoria',
    observacao: { texto: 'Mantém diálogo aberto com o grupo desde o ciclo anterior. Prefere tratativas fora do período eleitoral.', autor: 'Sofia Linhares', data: '09 ago 2026' },
    vinculos: [{ pessoaId: 7, tipo: 'Mesma base municipal' }, { pessoaId: 11, tipo: 'Aliada em pauta de saúde' }],
  },
  2: {
    telefone: '(00) 90000-0202', areas: ['Infraestrutura'],
    observacao: { texto: 'Posição contrária declarada em pauta de saneamento. Evitar aproximação direta neste ciclo.', autor: 'Rafael Guimar', data: '02 ago 2026' },
    vinculos: [{ pessoaId: 8, tipo: 'Mesmo grupo local' }],
  },
  3: { telefone: '(00) 90000-0303', areas: ['Cultura', 'Juventude'], atributos: ['Mobilizadora'], canal: 'Direto', vinculos: [{ pessoaId: 9, tipo: 'Aliada regional' }] },
  4: { areas: ['Agronegócio'] },
  5: { telefone: '(00) 90000-0505', areas: ['Meio ambiente'], atributos: ['Técnica'], canal: 'Assessoria', vinculos: [{ pessoaId: 10, tipo: 'Chapa anterior' }] },
  6: { telefone: '(00) 90000-0606', areas: ['Economia'], atributos: ['Nome nacional'] },
  7: {},
  8: { areas: ['Infraestrutura'], observacao: { texto: 'Sem contato registrado desde a última eleição.', autor: 'Cecília Prado', data: '28 jul 2026' } },
  9: { telefone: '(00) 90000-0909', areas: ['Educação'], atributos: ['Base sindical'], vinculos: [{ pessoaId: 3, tipo: 'Aliada regional' }] },
  10: {},
  11: { telefone: '(00) 90000-1111', areas: ['Saúde'], atributos: ['Articuladora'], canal: 'Direto', vinculos: [{ pessoaId: 1, tipo: 'Aliada em pauta de saúde' }] },
  12: { areas: ['Esporte'] },
}

/** Quantos campos internos estão preenchidos, e quais faltam — na ordem de peso estratégico. */
export function completude(id: number) {
  const dados = dadosInternos[id] || {}
  const preenchidos = camposInternos.filter(c => {
    const v = dados[c.chave]
    return Array.isArray(v) ? v.length > 0 : Boolean(v)
  })
  return {
    preenchidos: preenchidos.length,
    total: camposInternos.length,
    pct: Math.round((preenchidos.length / camposInternos.length) * 100),
    pendentes: camposInternos.filter(c => !preenchidos.includes(c)),
  }
}
