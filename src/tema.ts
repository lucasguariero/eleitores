/**
 * Tema claro/escuro.
 *
 * Três estados, não dois: `sistema` acompanha o SO, `claro` e `escuro` fixam a escolha.
 * Um alternador de dois estados obriga quem usa o SO no escuro a reescolher a cada máquina —
 * e faz o produto ignorar uma preferência que a pessoa já declarou uma vez.
 *
 * A aplicação acontece antes do React montar (ver o script em index.html), senão a página
 * pisca branco por um quadro no tema escuro.
 */

export type Tema = 'sistema' | 'claro' | 'escuro'

const CHAVE = 'eleitores:tema'

export function temaSalvo(): Tema {
  const v = localStorage.getItem(CHAVE)
  return v === 'claro' || v === 'escuro' || v === 'sistema' ? v : 'escuro'
}

/** O que efetivamente vai para o DOM depois de resolver `sistema`. */
export function temaEfetivo(tema: Tema): 'claro' | 'escuro' {
  if (tema !== 'sistema') return tema
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export function aplicarTema(tema: Tema) {
  localStorage.setItem(CHAVE, tema)
  document.documentElement.dataset.theme = temaEfetivo(tema) === 'escuro' ? 'dark' : 'light'
}

/** Enquanto a escolha for `sistema`, mudar o tema do SO reflete na hora, sem recarregar. */
export function ouvirSistema(tema: Tema, aoMudar: () => void) {
  if (tema !== 'sistema') return () => {}
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', aoMudar)
  return () => mq.removeEventListener('change', aoMudar)
}
