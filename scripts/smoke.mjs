import assert from 'node:assert/strict'
import fs from 'node:fs'
import { monthCells, priorityColors } from '../src/data.ts'
import { statusPolitico } from '../src/dominio.ts'
 import { completude } from '../src/ficha.ts'
import { gruposOrdem, moduloIncluso, modulos, ordemPlanos, perfis, planos, tenantPadrao } from '../src/produto.ts'

// ─── Camada de produto ────────────────────────────────────────────────────────
// O menu é derivado do contrato. Se um plano mais barato liberar mais módulo que um mais
// caro, ou se o núcleo puder ser desligado, o produto deixa de ser vendável.
for (let i = 1; i < ordemPlanos.length; i++) {
  const menor = modulos.filter(m => moduloIncluso(m, ordemPlanos[i - 1])).length
  const maior = modulos.filter(m => moduloIncluso(m, ordemPlanos[i])).length
  assert.ok(maior > menor, `plano ${ordemPlanos[i]} precisa incluir mais módulos que ${ordemPlanos[i - 1]}`)
}
assert.ok(modulos.every(m => ordemPlanos.includes(m.plano)), 'todo módulo pertence a um plano existente')
assert.ok(modulos.every(m => gruposOrdem.includes(m.grupo)), 'todo módulo pertence a um grupo do menu')
assert.ok(modulos.filter(m => m.obrigatorio).every(m => m.plano === 'essencial'),
  'módulo de núcleo não pode exigir plano pago — ele nunca poderia ser desligado')
assert.equal(new Set(modulos.map(m => m.id)).size, modulos.length, 'ids de módulo são únicos')
assert.ok(planos.every(p => ordemPlanos.includes(p.id)), 'todo plano da vitrine existe na ordem')
assert.ok(tenantPadrao.ativos.every(id => modulos.some(m => m.id === id)), 'contrato só liga módulo existente')

// "Não avaliado" é lacuna, não posição: precisa existir na escala e ficar fora da distribuição.
const escala = tenantPadrao.escalaStatus
assert.ok(escala.some(s => s.valor === 'Adversário'),
  'a escala precisa conseguir registrar adversário — era exatamente o que faltava na régua antiga')
assert.equal(escala.filter(s => s.tom === 'pendente').length, 1, 'só "Não avaliado" é lacuna')
assert.equal(escala.find(s => s.tom === 'pendente').valor, 'Não avaliado')
const valores = new Set(escala.map(s => s.valor))
for (const [id, status] of Object.entries(statusPolitico)) {
  assert.ok(valores.has(status), `candidato ${id} tem status "${status}" fora da escala do cliente`)
}

// O Painel mostra a distribuição e as pendências como números separados. Se eles deixarem de
// somar o total, a tela passa a mentir sem dar erro — que é o pior modo de falhar.
const posicoes = escala.filter(s => s.tom !== 'pendente').map(s => s.valor)
const atribuidos = Object.values(statusPolitico)
const avaliadas = atribuidos.filter(s => posicoes.includes(s)).length
const naoAvaliadas = atribuidos.filter(s => s === 'Não avaliado').length
assert.equal(avaliadas + naoAvaliadas, atribuidos.length,
  'avaliadas + não avaliadas precisa fechar o total — senão o Painel exibe uma conta que não bate')
assert.ok(naoAvaliadas > 0, 'a demonstração precisa de pelo menos uma lacuna, senão o padrão de pendência fica invisível')

// A ficha precisa mostrar o gradiente de completude: cheia, parcial e vazia.
const pcts = Object.keys(statusPolitico).map(id => completude(Number(id)).pct)
assert.ok(pcts.some(p => p === 0), 'alguma ficha precisa estar vazia')
assert.ok(pcts.some(p => p > 0 && p < 100), 'alguma ficha precisa estar parcialmente preenchida')
// Placeholder textual conta como preenchido e mascara a lacuna — foi um bug real aqui.
const bruto = fs.readFileSync(new URL('../src/ficha.ts', import.meta.url), 'utf8')
assert.ok(!/'(Não|Nao|Not) informado'/i.test(bruto),
  'campo interno não pode guardar a string "não informado": isso finge preenchimento e some com a pendência')

// O wrapper de página não pode animar transform: se a animação travar (aba em segundo plano,
// dispositivo lento) a transform fica aplicada, vira containing block para position:fixed e
// distorce a largura da página. Aconteceu: 899px medidos numa viewport de 375.
const anim = fs.readFileSync(new URL('../src/animacao.css', import.meta.url), 'utf8')
const regraPagina = anim.match(/^\.pagina \{[^}]*\}/m)?.[0]
assert.ok(regraPagina, 'animacao.css precisa definir a entrada de página')
const nomeAnim = regraPagina.match(/animation:\s*([a-z-]+)/)?.[1]
const keyframes = anim.match(new RegExp(`@keyframes ${nomeAnim} \\{[^}]*\\}[^}]*\\}`))?.[0] || ''
assert.ok(!/transform/.test(keyframes), `a animação de página "${nomeAnim}" não pode mexer em transform`)

// A legenda do mapa mentia: o preenchimento era cor de identidade, não de prioridade.
// CSS e dados guardam a rampa em lugares diferentes — aqui eles são obrigados a bater.
const css = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
for (const [prioridade, classe] of [['Alta', 'high'], ['Média', 'medium'], ['Estável', 'stable']]) {
  const naCss = css.match(new RegExp(`\\.legend-${classe} \\{ background: (#[0-9a-f]{6});`))?.[1]
  assert.equal(naCss, priorityColors[prioridade], `legenda de "${prioridade}" divergiu de priorityColors`)
}

// Agosto de 2026 começa num sábado: 6 vazios antes do dia 1, 31 dias e semanas fechadas.
const agosto = monthCells(2026, 8)
assert.equal(agosto.length % 7, 0, 'a grade do mês precisa fechar em semanas completas')
assert.deepEqual(agosto.slice(0, 7), [null, null, null, null, null, null, 1], 'o dia 1 precisa cair no sábado')
assert.equal(agosto.filter(Number.isInteger).length, 31, 'agosto tem 31 dias')
assert.deepEqual(monthCells(2026, 9).slice(0, 3), [null, null, 1], 'setembro de 2026 começa numa terça')

// A guarda de file:// roda também dentro do bundle.html: não pode redirecionar para si mesma.
const guard = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8').match(/if \(location\.protocol[^\n]*/)?.[0]
assert.ok(guard, 'index.html precisa da guarda de file://')
const runGuard = (protocol, pathname) => {
  let target = null
  new Function('location', guard)({ protocol, pathname, replace: to => { target = to } })
  return target
}
assert.equal(runGuard('file:', '/C:/p/index.html'), 'bundle.html', 'abrir o index do disco deve cair no bundle')
assert.equal(runGuard('file:', '/C:/p/bundle.html'), null, 'o bundle não pode redirecionar para si mesmo')
assert.equal(runGuard('http:', '/index.html'), null, 'servido por HTTP o index roda normalmente')

const app = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const data = fs.readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
// Toda rota do catálogo precisa existir no roteador, senão o menu leva a lugar nenhum.
const requiredRoutes = [...modulos.map(m => m.id), 'configuracoes']

// Perfil de acesso e cargo são campos independentes: amarrar um ao outro impediria dois
// analistas territoriais de terem permissões diferentes.
assert.ok(perfis.length >= 3, 'o produto precisa de mais de um perfil, senão permissão não existe')
assert.ok(perfis.some(p => p.ve === '*'), 'algum perfil precisa enxergar tudo')
assert.ok(perfis.some(p => Array.isArray(p.ve) && p.ve.length < modulos.length), 'algum perfil precisa enxergar menos que o catálogo, senão a ocultação nunca aparece')
assert.ok(perfis.every(p => p.ve === '*' || p.ve.every(id => modulos.some(m => m.id === id))), 'perfil só pode liberar módulo existente')
assert.ok(perfis.every(p => p.edita === '*' || p.ve === '*' || p.edita.every(id => p.ve.includes(id))), 'não dá para editar módulo que não se enxerga')
const missing = requiredRoutes.filter(route => !app.includes(`'${route}'`))

if (missing.length) {
  console.error(`Rotas ausentes: ${missing.join(', ')}`)
  process.exit(1)
}

if (!app.includes('view === \'list\'') || !app.includes("setView('grid')")) {
  console.error('Alternância lista/grade do Quadro Eleitoral não encontrada.')
  process.exit(1)
}

if (!app.includes('territory-map') || !app.includes('setSelectedId(item.id)')) {
  console.error('Mapa territorial não está ligado à seleção.')
  process.exit(1)
}

for (const capability of ['ElectoralProfileExpanded', 'TerritoryProfile', 'MunicipioFicha', 'PlanosModulos', 'Cruzamento', 'PrestacaoContas', 'AgendaDia', 'AgendaMes', 'AgendaAno', 'AgendaLista', 'IdentidadeAmbiente', 'DadosRetencao', 'ModuloBloqueado', 'ComparisonReport', 'AgendaModulo', 'LinkQueue', 'AuditPanel']) {
  if (!app.includes(`function ${capability}`)) {
    console.error(`Capacidade expandida ausente: ${capability}`)
    process.exit(1)
  }
}

for (const fragment of ['quadro-eleitoral/perfil/', 'territorios/perfil/', 'relatorios/comparativo', 'relatorios/consolidado']) {
  if (!app.includes(fragment)) {
    console.error(`Subrota ausente: ${fragment}`)
    process.exit(1)
  }
}

if (!data.includes('.invalid') || /@gmail\.com|@hotmail\.com|@outlook\.com/i.test(data)) {
  console.error('E-mails de demonstração devem usar domínio reservado .invalid.')
  process.exit(1)
}

console.log(`Smoke OK: ${requiredRoutes.length} rotas, alternâncias e dados fictícios verificados.`)
