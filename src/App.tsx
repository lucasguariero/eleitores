import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Bell, BriefcaseBusiness, Building2,
  CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Database, Download, FileText, Filter, Grid3X3,
  Handshake, Info, Layers3, LayoutDashboard, List, LockKeyhole, LogOut, Map,
  MapPin, Megaphone, Menu, MessageCircle, MoreHorizontal, Plus,
  RefreshCw, Search, Settings, Shield, ShieldCheck, SlidersHorizontal, Sparkles,
  Target, TrendingUp, UserCog, UsersRound, X, Link2, History, Edit,
  Vote, BookOpenCheck, Home, Cake, Workflow, Receipt, Route, Lock, Sigma, Paperclip, Palette, Sun, Moon, Monitor, Star,
  type LucideIcon,
} from 'lucide-react'
import { campaigns, electoralPeople, linkQueue, monthCells, pessoasTSE, priorityColors, relationships, team, territories, users, weekdays, type ElectoralPerson, type TPessoaTSE, type TeamMember } from './data'
import { aniversarios, apuracao, compromissosDoDia, compromissosDoMes, contas, cruzamentos, divisoes, encaminhamentosAbertos, exportacoes, festasPorMunicipio, municipios, responsaveisPorMunicipio, rota, statusPolitico, sugestoesCruzamento, tiposCompromisso, type Compromisso, type TipoCompromisso, vereadoresPorMunicipio } from './dominio'
import { cargosEquipe, gruposOrdem, moduloIncluso, modulos, perfilVe, perfis, planos, tenantPadrao, vinculosEquipe, type Perfil, type Plano, type Tenant } from './produto'
import { completude, dadosInternos } from './ficha'
import { aplicarTema, ouvirSistema, temaSalvo, type Tema } from './tema'

const TenantCtx = createContext<{ tenant: Tenant; setTenant: (t: Tenant) => void; perfil: Perfil; setPerfil: (p: Perfil) => void }>({ tenant: tenantPadrao, setTenant: () => {}, perfil: perfis[0], setPerfil: () => {} })
const useTenant = () => useContext(TenantCtx)

// A avaliação política é editável: a fila de triagem levava a uma ficha onde não dava para triar.
const AvaliacaoCtx = createContext<{ statusDe: (id: number) => string; avaliar: (id: number, valor: string) => void }>({ statusDe: () => 'Não avaliado', avaliar: () => {} })
const useAvaliacao = () => useContext(AvaliacaoCtx)

const TemaCtx = createContext<{ tema: Tema; setTema: (t: Tema) => void }>({ tema: 'sistema', setTema: () => {} })
const useTema = () => useContext(TemaCtx)

/** Ícone por módulo. Mora aqui porque produto.ts é configuração e não deve importar UI. */
const iconesModulo: Record<string, LucideIcon> = {
  'bem-vindo': Home, painel: LayoutDashboard, municipios: Building2, mesorregioes: Layers3, territorios: Map, eleicoes: Vote,
  'quadro-eleitoral': UsersRound, campanhas: Megaphone, agenda: CalendarDays, reunioes: Handshake,
  aniversarios: Cake, inteligencia: Sparkles, cruzamento: Workflow, relatorios: FileText,
  exportacoes: Download, prestacao: Receipt, 'base-nacional': Database, equipe: BriefcaseBusiness,
  usuarios: UserCog, parametrizacoes: SlidersHorizontal,
}

function StatusPill({ valor }: { valor: string }) {
  // Uma renderização só: antes eram quatro, e uma delas inventava vocabulário fora da escala.
  if (!valor || valor === 'Não avaliado') return <span className="pill-vago">Não avaliado</span>
  return <Pill tone={tomStatus[valor] || 'neutral'}>{valor}</Pill>
}

const tomStatus: Record<string, 'green' | 'blue' | 'neutral' | 'red' | 'purple'> = {
  Aliado: 'green', 'Aliado parcial': 'blue', Neutro: 'neutral', Adversário: 'red',
}

type Navigate = (route: string) => void

// Título de cada rota. Os módulos vêm do catálogo do produto; só o que não é módulo mora aqui.
const routeTitles: Record<string, string> = {
  ...Object.fromEntries(modulos.map(m => [m.id, m.label])),
  relacionamento: 'Relacionamento', configuracoes: 'Configurações',
}

function go(route: string) {
  window.location.hash = route
}

function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'blue' | 'amber' | 'red' | 'purple' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}

/** Ícone de origem TSE - indica que o dado vem do TSE */
function TSEIcon() {
  return <span className="tse-icon" title="Dado sincronizado do TSE"><RefreshCw size={12} /></span>
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`avatar avatar-${size}`} aria-hidden="true">{initials}</span>
}

function Progress({ value, label }: { value: number; label?: string }) {
  return <div className="progress-wrap" aria-label={label || `${value}%`}><div className="progress"><span style={{ width: `${value}%` }} /></div>{label && <small>{label}</small>}</div>
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 tabIndex={-1}>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-actions">{actions}</div>
    </header>
  )
}

function Metric({ label, value, delta, icon: Icon, onClick, tone }: { label: string; value: string; delta: string; icon: LucideIcon; onClick?: () => void; tone?: 'green' | 'amber' | 'red' }) {
  const body = <><span className="metric-icon"><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong><span className={`metric-delta ${tone ? `delta-${tone}` : ''}`}>{delta}</span></div></>
  return onClick ? <button className="metric-card" onClick={onClick}>{body}</button> : <article className="metric-card">{body}</article>
}

function Modal({ title, description, onClose, children }: { title: string; description?: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLElement>(null)
  useEffect(() => {
    const handle = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.focus()
    return () => previous?.focus()
  }, [])
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="modal" ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}><button className="icon-button modal-close" aria-label="Fechar" onClick={onClose}><X size={18} /></button><h2>{title}</h2>{description && <p>{description}</p>}{children}</section></div>
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><CircleHelp size={24} /><h3>{title}</h3><p>{text}</p>{action}</div>
}

function Dashboard({ navigate }: { navigate: Navigate }) {
  const { statusDe } = useAvaliacao()
  const { tenant } = useTenant()
  const [period, setPeriod] = useState('Últimos 30 dias')
  const bars = [58, 72, 64, 82, 76, 88]
  const posicoes = tenant.escalaStatus.filter(s => s.tom !== 'pendente')
  const contagem = posicoes.map(s => ({ ...s, n: electoralPeople.filter(p => statusDe(p.id) === s.valor).length }))
  const avaliadas = contagem.reduce((soma, c) => soma + c.n, 0)
  const semAvaliacao = electoralPeople.length - avaliadas
  const fracos = [...municipios].sort((a, b) => a.completude - b.completude).slice(0, 4)
  const dossieCompleto = municipios.filter(m => m.completude >= 80).length
  return <>
    <PageHeader eyebrow="Análise" title="Painel Executivo" description="O que a base já diz — e onde ela ainda não foi olhada. Dados simulados e explicáveis." actions={<select aria-label="Período" value={period} onChange={e => setPeriod(e.target.value)}><option>Últimos 30 dias</option><option>Trimestre atual</option><option>Ciclo eleitoral</option></select>} />
    <div className="metrics-grid">
      <Metric label="Candidatos no quadro" value={electoralPeople.length.toLocaleString('pt-BR')} delta="+38 neste ciclo" icon={UsersRound} onClick={() => navigate('quadro-eleitoral')} />
      <Metric label="Municípios com dossiê" value={`${dossieCompleto}/${municipios.length}`} delta="acima de 80% dos campos" icon={Building2} onClick={() => navigate('municipios')} />
      <Metric label="Cobertura territorial" value="69%" delta="+6 p.p. no trimestre" icon={Map} onClick={() => navigate('territorios')} />
      <Metric label="Compromissos no período" value="24" delta="6 viagens, 12 visitas" icon={CalendarDays} onClick={() => navigate('agenda')} />
    </div>
    <div className="dashboard-grid">
      <section className="card span-2">
        <div className="card-heading"><div><span className="eyebrow">Composição da base</span><h2>Candidatos por posição política</h2></div><Pill tone="blue">{avaliadas} avaliadas</Pill></div>
        <p className="section-description">A distribuição conta apenas quem já foi avaliado. Quem ninguém olhou fica de fora — ao lado, como trabalho a fazer.</p>
        <div className="barra-composicao" role="img" aria-label={`Distribuição: ${contagem.map(c => `${c.n} ${c.valor}`).join(', ')}`}>{contagem.map(c => <i key={c.valor} className={`faixa-${c.tom}`} style={{ flexGrow: c.n || 0.001 }} />)}</div>
        <div className="legenda-composicao">{contagem.map(c => <button key={c.valor} onClick={() => navigate('quadro-eleitoral')}><i className={`faixa-${c.tom}`} /><span><strong>{c.n}</strong><small>{c.valor}</small></span></button>)}</div>
      </section>
      <button className="card carteira-pendencia painel-pendencia" onClick={() => navigate('quadro-eleitoral/pendentes')}>
        <AlertTriangle size={20} />
        <div><strong className="pendencia-numero">{semAvaliacao}</strong><small>candidatos sem avaliação política</small><p>São lacunas, não posições. Enquanto ninguém as olhar, qualquer leitura da base está incompleta.</p></div>
        <span className="pendencia-acao">Abrir fila de triagem <ArrowRight size={14} /></span>
      </button>
    </div>
    <div className="dashboard-grid">
      <section className="card span-2">
        <div className="card-heading"><div><span className="eyebrow">Pulso territorial</span><h2>Evolução da cobertura qualificada</h2></div><Pill tone="blue">{period}</Pill></div>
        <div className="chart" aria-label="Gráfico de cobertura dos últimos seis períodos">{bars.map((height, index) => <div className="chart-column" key={height + index}><span className="chart-value">{height}%</span><i style={{ height: `${height}%` }} /><small>{['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'][index]}</small></div>)}</div>
      </section>
      <section className="card">
        <div className="card-heading"><div><span className="eyebrow">Onde a base está mais fraca</span><h2>Dossiês incompletos</h2></div></div>
        <p className="section-description">Municípios com menor preenchimento — é onde a decisão anda mais no escuro.</p>
        <div className="fracos-lista">{fracos.map(m => <button key={m.id} onClick={() => navigate(`municipios/perfil/${m.id}`)}><div><strong>{m.nome}</strong><small>{m.divisao}</small></div><Progress value={m.completude} /><b>{m.completude}%</b><ChevronRight size={15} /></button>)}</div>
      </section>
    </div>
    <div className="dashboard-grid equal">
      <section className="card"><div className="card-heading"><div><span className="eyebrow">Leitura recomendada</span><h2>Oportunidades em foco</h2></div><button className="text-button" onClick={() => navigate('inteligencia')}>Ver inteligência <ArrowRight size={15} /></button></div><div className="insight-compact"><Sparkles size={20} /><div><strong>Serra Alta combina prioridade alta e dossiê incompleto</strong><p>É o território de maior prioridade cujo dossiê municipal está abaixo de 50%, e onde dois candidatos aliados não recebem visita há mais de 90 dias.</p></div></div></section>
      <section className="card"><div className="card-heading"><div><span className="eyebrow">Atividade recente</span><h2>Relacionamento</h2></div><button className="text-button" onClick={() => navigate('reunioes')}>Abrir histórico <ArrowRight size={15} /></button></div>{relationships.slice(0, 3).map(item => <div className="activity-row" key={item.person}><Avatar initials={item.person.split(' ').slice(0, 2).map(n => n[0]).join('')} size="sm" /><div><strong>{item.person}</strong><small>{item.type} por {item.by}</small></div><time>{item.when}</time></div>)}</section>
    </div>
  </>
}

function ElectoralBoard({ navigate, route }: { navigate: Navigate; route: string }) {
  const { statusDe } = useAvaliacao()
  const profileId = Number(route.split('/')[2])
  const searched = route.split('/')[1] === 'busca' ? decodeURIComponent(route.split('/')[2] || '') : ''
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [query, setQuery] = useState(searched)
  const [party, setParty] = useState('Todos os partidos')
  const [running, setRunning] = useState('Todos')
  const [page, setPage] = useState(1)
  const { tenant } = useTenant()
  // Chegando por #quadro-eleitoral/pendentes, a lista já abre filtrada nas que ninguém avaliou.
  const [status, setStatus] = useState(route.split('/')[1] === 'pendentes' ? 'Não avaliado' : 'Todos')
  const filtered = electoralPeople.filter(person => person.name.toLowerCase().includes(query.toLowerCase()) && (party === 'Todos os partidos' || person.party === party) && (running === 'Todos' || (running === 'Concorrendo' ? person.running : !person.running)) && (status === 'Todos' || statusDe(person.id) === status))
  const semAvaliacao = electoralPeople.filter(p => statusDe(p.id) === 'Não avaliado').length
  const pageSize = 6
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  useEffect(() => { if (page > pages) setPage(1) }, [page, pages])
  useEffect(() => { if (searched) { setQuery(searched); setPage(1) } }, [searched])
  if (profileId) { const pessoa = electoralPeople.find(p => p.id === profileId)
    if (!pessoa) return <EmptyState title="Candidato não encontrado" text={`Nenhum registro com o identificador ${profileId}. O link pode estar velho, ou o registro foi inativado.`} action={<button className="primary-button" onClick={() => navigate('quadro-eleitoral')}>Voltar à lista</button>} />
    return <ElectoralProfileExpanded person={pessoa} navigate={navigate} /> }
  return <>
    <PageHeader eyebrow="Análise" title="Quadro Eleitoral" description="Quem concorreu ou concorre a eleição, atual e do passado. Candidatura e desempenho vêm do TSE; a avaliação política é da equipe." actions={<><button className="secondary-button"><Download size={16} /> Exportar visão</button><button className="primary-button" onClick={() => document.getElementById('busca-pessoa')?.focus()}><Search size={16} /> Localizar pessoa</button></>} />
    <div className="carteira-faixa">{tenant.escalaStatus.filter(s => s.tom !== 'pendente').map(s => { const n = electoralPeople.filter(p => statusDe(p.id) === s.valor).length; return <button key={s.valor} className={`card carteira-item ${status === s.valor ? 'ativo' : ''}`} onClick={() => { setStatus(status === s.valor ? 'Todos' : s.valor); setPage(1) }}><small>{s.valor}</small><strong>{n}</strong><Pill tone={tomStatus[s.valor] || 'neutral'}>{Math.round(n / electoralPeople.length * 100)}%</Pill></button> })}
      <button className={`card carteira-pendencia ${status === 'Não avaliado' ? 'ativo' : ''}`} onClick={() => { setStatus(status === 'Não avaliado' ? 'Todos' : 'Não avaliado'); setPage(1) }}><AlertTriangle size={17} /><div><strong>{semAvaliacao} sem avaliação</strong><small>lacuna, não é posição — fica fora da distribuição</small></div><ArrowRight size={15} /></button>
    </div>
    <section className="card toolbar-card">
      <div className="search-field"><Search size={17} /><input id="busca-pessoa" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} placeholder="Buscar por nome" aria-label="Buscar pessoa eleitoral" /></div>
      <select value={party} onChange={e => setParty(e.target.value)} aria-label="Filtrar por partido"><option>Todos os partidos</option>{[...new Set(electoralPeople.map(p => p.party))].map(value => <option key={value}>{value}</option>)}</select>
      <select value={running} onChange={e => setRunning(e.target.value)} aria-label="Filtrar candidatura"><option>Todos</option><option>Concorrendo</option><option>Não concorrendo</option></select>
      <button className="filter-button"><Filter size={16} /> Mais filtros</button>
      <div className="view-toggle" aria-label="Alternar visualização"><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="Lista"><List size={17} /></button><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Grade"><Grid3X3 size={17} /></button></div>
    </section>
    <div className="result-meta"><span><strong>{filtered.length}</strong> pessoas encontradas</span><span><Info size={14} /> Dados inteiramente fictícios</span></div>
    {pageItems.length === 0 ? <EmptyState title="Nenhuma pessoa encontrada" text="Ajuste os filtros ou limpe a busca para voltar à lista completa." action={<button className="primary-button" onClick={() => { setQuery(''); setParty('Todos os partidos'); setRunning('Todos') }}>Limpar filtros</button>} /> : view === 'list' ? <div className="table-card"><table><thead><tr><th>Pessoa</th><th>Partido e cargo</th><th>Status político</th><th>Última candidatura</th><th>Desempenho</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{pageItems.map(person => <tr key={person.id} onClick={() => navigate(`quadro-eleitoral/perfil/${person.id}`)}><td><div className="person-cell"><Avatar initials={person.initials} /><div><strong>{person.name}</strong><small>{person.territory}</small></div></div></td><td><strong>{person.party}</strong><TSEIcon /><small>{person.office}</small></td><td><StatusPill valor={statusDe(person.id)} /></td><td><strong>{person.history[0].year} · {person.history[0].office}</strong><small>{person.history[0].result} · fonte TSE</small></td><td><strong>{person.votes.toLocaleString('pt-BR')} votos</strong><Progress value={person.performance} /></td><td><button className="icon-button" aria-label={`Abrir perfil de ${person.name}`}><ChevronRight size={17} /></button></td></tr>)}</tbody></table></div> : <div className="people-grid">{pageItems.map(person => <button className="person-card" key={person.id} onClick={() => navigate(`quadro-eleitoral/perfil/${person.id}`)}><div className="person-card-top"><Avatar initials={person.initials} size="lg" />{person.running && <Pill tone="blue">Em disputa</Pill>}</div><h3>{person.name}</h3><p>{person.office} · {person.party}</p><div className="person-stats"><span><small>Votos recentes</small><strong>{person.votes.toLocaleString('pt-BR')}</strong></span><span><small>Índice</small><strong>{person.performance}</strong></span></div><Progress value={person.performance} label={person.status} /></button>)}</div>}
    <div className="pagination"><span>Página {page} de {pages}</span><div><button className="icon-button" disabled={page === 1} onClick={() => setPage(value => value - 1)} aria-label="Página anterior"><ChevronLeft size={17} /></button>{Array.from({ length: pages }, (_, i) => i + 1).map(value => <button className={`page-button ${page === value ? 'active' : ''}`} onClick={() => setPage(value)} key={value}>{value}</button>)}<button className="icon-button" disabled={page === pages} onClick={() => setPage(value => value + 1)} aria-label="Próxima página"><ChevronRight size={17} /></button></div></div>
  </>
}

function Territories({ navigate }: { navigate: Navigate }) {
  const { tenant } = useTenant()
  const [selectedId, setSelectedId] = useState('capital')
  const [priority, setPriority] = useState('Todas')
  const [mode, setMode] = useState<'list' | 'grid'>('list')
  const [tab, setTab] = useState<'mapa' | 'metricas'>('mapa')
  const selected = territories.find(item => item.id === selectedId) || territories[0]
  const shown = territories.filter(item => priority === 'Todas' || item.priority === priority)

  // Métricas consolidadas (antes eram do Mesorregioes)
  const totalMunicipios = municipios.length
  const totalEleitores = municipios.reduce((soma, m) => soma + m.eleitores, 0)
  const totalPopulacao = municipios.reduce((soma, m) => soma + m.populacao, 0)
  const coberturaMedia = Math.round(territories.reduce((soma, t) => soma + t.coverage, 0) / territories.length)

  // Calcula métricas por divisão territorial (antes Mesorregioes)
  const divisoesComCompletude = divisoes.map((d, idx) => {
    const municipiosDaDivisao = municipios.filter(m => m.divisao === d.nome)
    const completudeMedia = municipiosDaDivisao.length > 0
      ? Math.round(municipiosDaDivisao.reduce((soma, m) => soma + m.completude, 0) / municipiosDaDivisao.length)
      : 0
    const municipiosConsolidados = municipiosDaDivisao.filter(m => m.completude >= 80).length
    return { ...d, completudeMedia, municipiosConsolidados, municipiosTotal: municipiosDaDivisao.length, indice: idx + 1 }
  })

  return <>
    <PageHeader eyebrow="Análise" title="Territórios" description="Mapa interativo, métricas consolidadas e detalhamento de municípios." actions={<><button className="secondary-button"><RefreshCw size={16} /> Sincronizar IBGE</button><button className="primary-button"><Plus size={16} /> Criar agrupamento</button></>} />

    <div className="metrics-grid five">
      <Metric label="Territórios" value={String(territories.length)} delta="recortes cadastrados" icon={Map} />
      <Metric label="Municípios" value={String(totalMunicipios)} delta="no recorte" icon={Building2} />
      <Metric label="Eleitores" value={totalEleitores.toLocaleString('pt-BR')} delta="total no recorte" icon={UsersRound} />
      <Metric label="População" value={totalPopulacao.toLocaleString('pt-BR')} delta="estimada IBGE" icon={Map} />
      <Metric label="Cobertura média" value={`${coberturaMedia}%`} delta="dossiês consolidados" icon={Check} tone="green" />
    </div>

    <div className="segmented" style={{ marginBottom: '16px' }}>
      <button className={tab === 'mapa' ? 'active' : ''} onClick={() => setTab('mapa')}>Mapa interativo</button>
      <button className={tab === 'metricas' ? 'active' : ''} onClick={() => setTab('metricas')}>Por {tenant.divisaoTerritorial}</button>
    </div>

    {tab === 'mapa' && <>
      <section className="card map-toolbar"><div><label>Prioridade<select value={priority} onChange={e => setPriority(e.target.value)}><option>Todas</option><option>Alta</option><option>Média</option><option>Estável</option></select></label><label>Camada<select><option>Cobertura política</option><option>Potencial eleitoral</option><option>Relacionamentos</option></select></label></div><div className="legend"><span><i className="legend-high" /> Prioridade alta</span><span><i className="legend-medium" /> Prioridade média</span><span><i className="legend-stable" /> Estável</span></div></section>
      <div className="territory-layout">
        <section className="card map-card"><div className="map-title"><div><span className="eyebrow">Mapa abstrato</span><h2>Recorte territorial contratado</h2></div><Pill tone="blue">Interativo</Pill></div><svg className="territory-map" viewBox="20 0 490 320" role="img" aria-label="Mapa abstrato dos territórios fictícios">{territories.map(item => <path key={item.id} d={item.path} fill={priority !== 'Todas' && item.priority !== priority ? '#DDE5EF' : priorityColors[item.priority]} className={selectedId === item.id ? 'selected' : ''} onClick={() => setSelectedId(item.id)} onKeyDown={event => (event.key === 'Enter' || event.key === ' ') && setSelectedId(item.id)} tabIndex={0} role="button" aria-label={`${item.name}, prioridade ${item.priority}`} />)}</svg><p className="map-hint"><MapPin size={15} /> Selecione uma região para atualizar indicadores e oportunidades.</p></section>
        <aside className="card territory-detail"><span className="eyebrow">Território selecionado</span><h2>{selected.name}</h2><Pill tone={selected.priority === 'Alta' ? 'amber' : selected.priority === 'Estável' ? 'green' : 'blue'}>Prioridade {selected.priority.toLowerCase()}</Pill><div className="territory-numbers"><div><small>Eleitorado simulado</small><strong>{selected.electorate.toLocaleString('pt-BR')}</strong></div><small>Municípios fictícios</small><strong>{selected.municipalities}</strong></div><label className="coverage-label"><span>Cobertura qualificada <strong>{selected.coverage}%</strong></span><Progress value={selected.coverage} /></label><div className="opportunity-box"><Sparkles size={18} /><div><strong>Oportunidade</strong><p>{selected.opportunity}</p></div></div><button className="primary-button full" onClick={() => navigate(`territorios/perfil/${selected.id}`)}>Abrir visão detalhada <ArrowRight size={16} /></button></aside>
      </div>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">Comparativo</span><h2>Visão por território</h2></div><div className="view-toggle" aria-label="Alternar visualização"><button className={mode === 'list' ? 'active' : ''} onClick={() => setMode('list')} aria-label="Lista"><List size={17} /></button><button className={mode === 'grid' ? 'active' : ''} onClick={() => setMode('grid')} aria-label="Grade"><Grid3X3 size={17} /></button></div></div>{shown.length === 0 ? <EmptyState title="Nenhum território neste filtro" text="Escolha outra prioridade para comparar regiões." action={<button className="primary-button" onClick={() => setPriority('Todas')}>Mostrar todos</button>} /> : <div className={mode === 'grid' ? 'territory-grid' : 'territory-list'}>{shown.map(item => <button id={`territory-${item.id}`} className="territory-row" key={item.id} onClick={() => setSelectedId(item.id)}><i style={{ background: priorityColors[item.priority] }} /><div><strong>{item.name}</strong><small>{item.municipalities} municípios fictícios</small></div><span><small>Cobertura</small><strong>{item.coverage}%</strong></span><span><small>Eleitorado</small><strong>{item.electorate.toLocaleString('pt-BR')}</strong></span><Pill tone={item.priority === 'Alta' ? 'amber' : item.priority === 'Estável' ? 'green' : 'blue'}>{item.priority}</Pill><ChevronRight size={18} /></button>)}</div>}</section>
    </>}

    {tab === 'metricas' && <>
      <section className="card toolbar-card"><div className="search-field"><Search size={17} /><input placeholder={`Buscar ${tenant.divisaoTerritorial.toLowerCase()}`} aria-label={`Buscar ${tenant.divisaoTerritorial}`} /></div></section>
      <div className="municipios-grid">{divisoesComCompletude.map(d => <article className="card municipio-card" key={d.nome}><div className="municipio-topo"><div><h3>{d.nome}</h3><small>{d.municipiosTotal} município{d.municipiosTotal !== 1 ? 's' : ''}</small></div><Pill tone={d.completudeMedia >= 70 ? 'green' : d.completudeMedia >= 40 ? 'amber' : 'red'}>{d.completudeMedia}%</Pill></div><div className="municipio-nums"><span><small>População</small><strong>{d.populacao.toLocaleString('pt-BR')}</strong></span><span><small>Eleitores</small><strong>{d.eleitores.toLocaleString('pt-BR')}</strong></span></div><label className="coverage-label"><span>Cobertura <strong>{d.completudeMedia}%</strong></span><Progress value={d.completudeMedia} /></label><button className="secondary-button full" onClick={() => navigate(`territorios/perfil/${encodeURIComponent(d.nome.toLowerCase().replace(/\s+/g, '-'))}`)}>Ver detalhe <ArrowRight size={15} /></button></article>)}</div>
    </>}
  </>
}

function Campaigns() {
  const [modal, setModal] = useState(false)
  const [active, setActive] = useState(0)
  const [added, setAdded] = useState(false)
  return <>
    <PageHeader eyebrow="Execução coordenada" title="Campanhas" description="Objetivos, frentes de trabalho, calendário e acompanhamento no mesmo ciclo." actions={<button className="primary-button" onClick={() => { setAdded(false); setModal(true) }}><Plus size={16} /> Nova campanha</button>} />
    <div className="campaign-layout"><section className="campaign-list">{campaigns.map((campaign, index) => <button className={`card campaign-card ${active === index ? 'active' : ''}`} key={campaign.name} onClick={() => setActive(index)}><div className="campaign-top"><Pill tone={campaign.status === 'Em andamento' ? 'green' : 'blue'}>{campaign.status}</Pill><MoreHorizontal size={18} /></div><h2>{campaign.name}</h2><p>{campaign.objective}</p><Progress value={campaign.progress} label={`${campaign.progress}% concluído`} /><div className="campaign-meta"><span><CalendarDays size={15} /> {campaign.period}</span><span><Target size={15} /> {campaign.fronts} frentes</span></div></button>)}</section><section className="card campaign-detail"><div className="card-heading"><div><span className="eyebrow">Plano ativo</span><h2>{campaigns[active].name}</h2></div><button className="secondary-button">Editar plano</button></div><div className="objective-banner"><Target size={22} /><div><small>Objetivo principal</small><strong>{campaigns[active].objective}</strong></div><Pill tone="green">No ritmo</Pill></div><h3>Frentes de trabalho</h3><div className="front-list">{['Mapeamento e priorização', 'Agenda territorial', 'Mobilização de rede', 'Conteúdo de apoio'].slice(0, campaigns[active].fronts).map((name, index) => { const dono = team[index % team.length]; const atrasada = index >= 2; return <div key={name}><button className={`check-button ${index < 2 ? 'checked' : ''}`} aria-label={`Alternar ${name}`}><Check size={14} /></button><span><strong>{name}</strong><small>{atrasada ? 'Próxima entrega em 5 dias' : 'Dentro do prazo'}</small></span><span className="front-dono"><Avatar initials={dono.initials} size="sm" /><small>{dono.name}</small></span><Pill tone={atrasada ? 'amber' : 'green'}>{[84, 72, 41, 18][index]}%</Pill></div> })}</div><div className="mini-calendar"><div className="card-heading"><h3>Próximos marcos</h3><button className="text-button">Ver calendário</button></div>{[['14 ago', 'Revisão das prioridades regionais'], ['19 ago', 'Encontro de coordenação'], ['28 ago', 'Fechamento do ciclo de escuta']].map(([date, title]) => <div key={date}><time>{date}</time><span>{title}</span></div>)}</div></section></div>
    {modal && <Modal title="Criar campanha" description="Cadastre um objetivo e organize as frentes iniciais. Os dados ficam apenas em memória." onClose={() => setModal(false)}><form className="modal-form" onSubmit={event => { event.preventDefault(); setAdded(true); setTimeout(() => setModal(false), 700) }}><label>Nome da campanha<input required placeholder="Ex.: Escuta regional" /></label><label>Objetivo<textarea required placeholder="Resultado que deve ser alcançado" /></label><label>Período<input type="date" required /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancelar</button><button className="primary-button">{added ? <><Check size={16} /> Criada</> : 'Criar campanha'}</button></div></form></Modal>}
  </>
}

function Intelligence({ navigate }: { navigate: Navigate }) {
  const [dismissed, setDismissed] = useState<number[]>([])
  const insights = [
    { title: 'Campos do Norte precisa de agenda coordenada', text: 'É o maior território sem campanha ativa e reúne 18% dos candidatos sem contato recente.', level: 'Alta', action: 'Planejar agenda', route: 'territorios' },
    { title: 'A cobertura avançou onde houve recorrência', text: 'Regiões com ao menos duas visitas mensais cresceram 11 pontos no índice de relacionamento.', level: 'Oportunidade', action: 'Ver histórico', route: 'reunioes' },
    { title: 'Três perfis ganharam tração eleitoral', text: 'A evolução simulada de votação e presença territorial indica prioridade de acompanhamento.', level: 'Sinal', action: 'Abrir quadro eleitoral', route: 'quadro-eleitoral' },
  ]
  return <>
    <PageHeader eyebrow="Análise" title="Inteligência" description="Insights em linguagem simples, com evidências simuladas e próximo passo sugerido." actions={<button className="secondary-button"><RefreshCw size={16} /> Atualizar leitura</button>} />
    <section className="intelligence-intro"><div><Sparkles size={24} /><div><span className="eyebrow">Resumo executivo</span><h2>A operação avança, mas a cobertura está concentrada</h2><p>As ações recentes aumentaram o relacionamento em quatro territórios. Campos do Norte e Serra Clara ainda pedem uma agenda mais consistente.</p></div></div><span>Gerado a partir de 6 camadas fictícias</span></section>
    <div className="insights-list">{insights.map((insight, index) => dismissed.includes(index) ? null : <article className="card insight-card" key={insight.title}><button className="icon-button insight-info" aria-label="Mais informações"><Info size={17} /></button><div className="insight-content"><div className="pill-row"><Pill tone={insight.level === 'Alta' ? 'amber' : 'blue'}>{insight.level}</Pill><span className="evidence"><Layers3 size={14} /> 3 evidências relacionadas</span></div><h2>{insight.title}</h2><p>{insight.text}</p></div><div className="insight-actions"><button className="text-button" onClick={() => setDismissed(items => [...items, index])}>Dispensar</button><button className="primary-button" onClick={() => navigate(insight.route)}>{insight.action} <ArrowRight size={16} /></button></div></article>)}</div>
    {dismissed.length === insights.length && <EmptyState title="Leitura concluída" text="Você revisou todos os insights desta rodada." action={<button className="primary-button" onClick={() => setDismissed([])}>Restaurar recomendações</button>} />}
    <section className="card method-card"><div><ShieldCheck size={20} /><div><strong>Como esta recomendação foi formada</strong><p>O protótipo cruza apenas dados fictícios de território, desempenho, agenda e relacionamento. Não há modelo externo nem decisão automática.</p></div></div><button className="text-button">Ver critérios <ChevronRight size={15} /></button></section>
  </>
}

function Team() {
  const [novo, setNovo] = useState(false)
  const [criado, setCriado] = useState<string | null>(null)
  const [ordem, setOrdem] = useState<'nome' | 'vinculo' | 'cargo' | 'area' | 'perfil' | 'status'>('nome')
  const [direcao, setDirecao] = useState<'asc' | 'desc'>('asc')
  const lista = [...team].sort((a, b) => {
    const cmp = ordem === 'nome' ? a.name.localeCompare(b.name) : ordem === 'area' ? a.area.localeCompare(b.area) : ordem === 'status' ? a.status.localeCompare(b.status) : ordem === 'perfil' ? (a.hasAccess ? 1 : 0) - (b.hasAccess ? 1 : 0) : ordem === 'vinculo' ? a.bond.localeCompare(b.bond) : a.role.localeCompare(b.role)
    return direcao === 'asc' ? cmp : -cmp
  })
  const [form, setForm] = useState({ nome: '', email: '', vinculo: vinculosEquipe[0], cargo: cargosEquipe[0], area: 'Articulação', perfil: 'coordenacao', acesso: true })
  const criar = (e: { preventDefault: () => void }) => { e.preventDefault(); setCriado(form.nome || 'Novo integrante'); setNovo(false); setTimeout(() => setCriado(null), 2600) }
  const ordena = (col: 'nome' | 'vinculo' | 'cargo' | 'area' | 'perfil' | 'status') => { setOrdem(col); setDirecao(d => d === 'asc' ? 'desc' : 'asc') }
  return <>
    <PageHeader eyebrow="Administração" title="Equipe" description="Quem trabalha no grupo político. O cargo diz o que a pessoa faz; o acesso ao sistema é decidido logo abaixo, e são coisas independentes." actions={<>{criado && <span className="confirmacao"><Check size={15} /> {criado} cadastrado</span>}<button className="primary-button" onClick={() => setNovo(true)}><Plus size={16} /> Cadastrar pessoa</button></>} />

    <div className="domain-note"><Info size={18} /><div><strong>Cargo e perfil de acesso são campos diferentes, de propósito.</strong><p>Cargo é o que a pessoa faz no grupo — "Analista territorial". Perfil é o que ela pode fazer no sistema — "Leitura executiva". Amarrar um ao outro impediria dois analistas de terem permissões diferentes, que é o caso comum quando um é sênior e o outro entrou ontem.</p></div></div>

    <div className="metrics-grid three"><Metric label="Integrantes" value={String(team.length)} delta="ativos no ciclo" icon={UsersRound} /><Metric label="Com acesso ao sistema" value={String(team.filter(p => p.hasAccess).length)} delta="contas habilitadas" icon={ShieldCheck} /><Metric label="Sem acesso" value={String(team.filter(p => !p.hasAccess).length)} delta="trabalham sem conta" icon={Lock} /></div>

    <div className="table-card"><table><thead><tr><th onClick={() => ordena('nome')} style={{cursor:'pointer'}}>Pessoa {ordem === 'nome' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('vinculo')} style={{cursor:'pointer'}}>Vínculo {ordem === 'vinculo' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('cargo')} style={{cursor:'pointer'}}>Cargo no grupo {ordem === 'cargo' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('area')} style={{cursor:'pointer'}}>Área {ordem === 'area' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('perfil')} style={{cursor:'pointer'}}>Perfil de acesso {ordem === 'perfil' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('status')} style={{cursor:'pointer'}}>Situação {ordem === 'status' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th></tr></thead><tbody>{lista.map(pessoa => <tr key={pessoa.name}>
      <td><div className="person-cell"><Avatar initials={pessoa.initials} /><div><strong>{pessoa.name}</strong><small>{pessoa.area}</small>{(pessoa as TeamMember).liderancaId && <span className="vinculo-tag"><Link2 size={10} /> Liderança</span>}</div></div></td>
      <td>{pessoa.bond}</td>
      <td><strong>{pessoa.role}</strong><small>o que faz no grupo</small></td>
      <td>{pessoa.area}</td>
      <td>{pessoa.hasAccess ? <Pill tone="blue">{pessoa.name === 'Sofia Linhares' ? 'Administrador' : 'Coordenação'}</Pill> : <span className="pill-vago">Sem conta</span>}</td>
      <td><Pill tone={pessoa.status.startsWith('Ativ') ? 'green' : 'amber'}>{pessoa.status}</Pill></td>
    </tr>)}</tbody></table></div>

    {novo && <Modal title="Cadastrar pessoa na equipe" description="Os dois últimos campos respondem perguntas diferentes: o que ela faz, e o que ela pode." onClose={() => setNovo(false)}>
      <form className="modal-form" onSubmit={criar}>
        <label>Nome completo<input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome e sobrenome" /></label>
        <label>E-mail<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="nome.sobrenome@exemplo.invalid" /></label>
        <div className="form-grid">
          <label>Vínculo<select value={form.vinculo} onChange={e => setForm({ ...form, vinculo: e.target.value })}>{vinculosEquipe.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Área<select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}><option>Articulação</option><option>Inteligência</option><option>Relacionamento</option><option>Campanhas</option><option>Base Nacional</option></select></label>
        </div>
        <label>Cargo no grupo <span className="ajuda-campo">o que a pessoa faz</span><select value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })}>{cargosEquipe.map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="toggle-row"><span><strong>Dar acesso ao sistema</strong><small>Nem todo integrante precisa de conta. Sem acesso, a pessoa existe no cadastro e não entra na plataforma.</small></span><input type="checkbox" checked={form.acesso} onChange={e => setForm({ ...form, acesso: e.target.checked })} /></label>
        {form.acesso && <label>Perfil de acesso <span className="ajuda-campo">o que a pessoa pode fazer no sistema</span>
          <select value={form.perfil} onChange={e => setForm({ ...form, perfil: e.target.value })}>{perfis.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select>
          <small className="descricao-perfil">{perfis.find(p => p.id === form.perfil)?.descricao}</small>
        </label>}
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setNovo(false)}>Cancelar</button><button className="primary-button" type="submit">Cadastrar</button></div>
      </form>
    </Modal>}
  </>
}

function UsersAccess() {
  const [permissions, setPermissions] = useState(false)
  const [status, setStatus] = useState('Todos os status')
  const [ordem, setOrdem] = useState<'nome' | 'tipo' | 'escopo' | 'status' | 'liderancas'>('nome')
  const [direcao, setDirecao] = useState<'asc' | 'desc'>('asc')
  const shown = users.filter(user => status === 'Todos os status' || user.status === status).sort((a, b) => {
    const cmp = ordem === 'nome' ? a.name.localeCompare(b.name) : ordem === 'tipo' ? a.type.localeCompare(b.type) : ordem === 'escopo' ? a.scope.localeCompare(b.scope) : ordem === 'status' ? a.status.localeCompare(b.status) : a.createdLeaders - b.createdLeaders
    return direcao === 'asc' ? cmp : -cmp
  })
  const ordena = (col: 'nome' | 'tipo' | 'escopo' | 'status' | 'liderancas') => { setOrdem(col); setDirecao(d => d === 'asc' ? 'desc' : 'asc') }

  // Tipos de usuário com cor
  const tipoColor = (tipo: string) => {
    switch(tipo) {
      case 'MASTER': return 'red'
      case 'EDITOR': return 'blue'
      case 'VISUALIZADOR': return 'green'
      case 'ATENDENTE': return 'amber'
      default: return 'neutral'
    }
  }

  return <>
    <PageHeader eyebrow="Administração" title="Usuários e Acessos" description="Gerencie quem acessa o sistema e visualize as lideranças criadas por cada usuário." actions={<button className="primary-button"><Plus size={16} /> Criar usuário</button>} />
    <div className="domain-note"><LockKeyhole size={20} /><div><strong>Conta de acesso não é vínculo de equipe nem perfil eleitoral.</strong><p>Uma pessoa pode existir em mais de um domínio técnico, mas cada experiência tem finalidade e regras independentes.</p></div></div>
    <section className="card toolbar-card"><div className="search-field"><Search size={17} /><input placeholder="Buscar por nome ou e-mail" /></div><select value={status} onChange={e => setStatus(e.target.value)}><option>Todos os status</option><option>Ativo</option><option>Convidado</option><option>Suspenso</option></select><button className="secondary-button" onClick={() => setPermissions(true)}><Shield size={16} /> Gerenciar perfis</button></section>
    <div className="table-card"><table><thead><tr><th onClick={() => ordena('nome')} style={{cursor:'pointer'}}>Usuário {ordem === 'nome' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('tipo')} style={{cursor:'pointer'}}>Tipo {ordem === 'tipo' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('escopo')} style={{cursor:'pointer'}}>Escopo territorial {ordem === 'escopo' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('liderancas')} style={{cursor:'pointer'}}>Lideranças criadas {ordem === 'liderancas' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('status')} style={{cursor:'pointer'}}>Status {ordem === 'status' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{shown.map(user => <tr key={user.email}><td><div className="person-cell"><Avatar initials={user.initials} /><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td><Pill tone={tipoColor(user.type)}>{user.type}</Pill></td><td>{user.scope}</td><td>{user.createdLeaders > 0 ? <button className="text-button">{user.createdLeaders}</button> : <span className="text-muted">—</span>}</td><td><Pill tone={user.status === 'Ativo' ? 'green' : user.status === 'Convidado' ? 'blue' : 'red'}>{user.status}</Pill></td><td><button className="icon-button" aria-label="Mais ações"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>
    {permissions && <Modal title="Permissões por módulo" description="Configure o nível de acesso de cada usuário aos módulos do sistema." onClose={() => setPermissions(false)}>
      <div className="permission-info"><p>Funcionalidade de permissões por módulo em desenvolvimento.</p></div>
      <div className="modal-actions"><button className="secondary-button" onClick={() => setPermissions(false)}>Fechar</button></div>
    </Modal>}
  </>
}

function ParametrizacaoAparencia() {
  const { tema: temaGlobal, setTema: setTemaGlobal } = useTema()
  const [salvo, setSalvo] = useState(false)
  return <>
    <section className="card">
      <div className="card-heading"><div><span className="eyebrow">Tema padrão</span><h2>Visual padrão para todos os usuários</h2></div></div>
      <p className="section-description">Este é o tema que novos usuários verão ao acessar o sistema pela primeira vez. Cada usuário pode sobrescrever em "Minha conta".</p>
      <div className="tema-grid" role="radiogroup" aria-label="Tema global">
        {([['sistema', 'Seguir o sistema', 'Acompanha o tema do computador'], ['claro', 'Claro', 'Fundo claro'], ['escuro', 'Escuro', 'Fundo escuro']] as const).map(([id, titulo, texto]) =>
          <button key={id} role="radio" aria-checked={temaGlobal === id} className={`tema-opcao ${temaGlobal === id ? 'ativo' : ''}`} onClick={() => setTemaGlobal(id)}>
            <span className={`tema-amostra amostra-${id}`} aria-hidden="true"><i /><b /></span>
            <strong>{titulo}</strong><small>{texto}</small>
            {temaGlobal === id && <Pill tone="green"><Check size={12} /> Padrão</Pill>}
          </button>)}
      </div>
      <div className="settings-actions"><button className="primary-button" onClick={() => { setSalvo(true); setTimeout(() => setSalvo(false), 1800) }}>{salvo ? <><Check size={16} /> Salvo</> : 'Salvar padrão'}</button></div>
    </section>
    <section className="card">
      <div className="card-heading"><div><span className="eyebrow">Herança</span><h2>Como funciona</h2></div></div>
      <div className="info-grid">
        <span><small>Parametrizações → global</small><strong>Aplica a todos os usuários</strong></span>
        <span><small>Minha conta → individual</small><strong>Cada usuário pode sobrescrever</strong></span>
      </div>
      <p className="section-description">O tema definido aqui é o padrão. Se o usuário definir outro tema em "Minha conta", prevalece a escolha individual.</p>
    </section>
  </>
}

function ParametrizacaoNotificacoes() {
  const [togglesGlobal, setTogglesGlobal] = useState({ oportunidade: true, resumo: true, aniversario: true, prazo: true })
  const [salvo, setSalvo] = useState(false)
  const salvar = () => { setSalvo(true); setTimeout(() => setSalvo(false), 1800) }
  return <>
    <section className="card">
      <div className="card-heading"><div><span className="eyebrow">Notificações padrão</span><h2>Configuração padrão para novos usuários</h2></div></div>
      <p className="section-description">Estas são as notificações habilitadas por padrão para novos usuários. Cada usuário pode ajustar em "Minha conta".</p>
      {([['oportunidade', 'Território pedindo atenção', 'Quando um município de prioridade alta fica sem visita por mais de 90 dias.'], ['aniversario', 'Data comemorativa próxima', 'Aniversário de candidato, de município ou festa de padroeira nos próximos 7 dias.'], ['prazo', 'Prazo de prestação de contas', 'Lançamento sem comprovante às vésperas do fechamento do período.'], ['resumo', 'Resumo executivo semanal', 'Consolida avanços e pendências numa leitura curta, toda segunda.']] as const).map(([id, titulo, texto]) =>
        <label className="toggle-row" key={id}><span><strong>{titulo}</strong><small>{texto}</small></span><input type="checkbox" checked={togglesGlobal[id]} onChange={e => setTogglesGlobal(c => ({ ...c, [id]: e.target.checked }))} /></label>)}
      <div className="settings-actions"><button className="primary-button" onClick={salvar}>{salvo ? <><Check size={16} /> Salvo</> : 'Salvar padrão'}</button></div>
    </section>
    <section className="card">
      <div className="card-heading"><div><span className="eyebrow">Herança</span><h2>Como funciona</h2></div></div>
      <div className="info-grid">
        <span><small>Parametrizações → global</small><strong>Padrão para todos os usuários</strong></span>
        <span><small>Minha conta → individual</small><strong>Cada usuário pode ajustar</strong></span>
      </div>
      <p className="section-description">As notificações definidas aqui são o padrão. Se o usuário definir outras preferências em "Minha conta", prevalece a escolha individual.</p>
    </section>
  </>
}

function Parameters({ navigate, route }: { navigate: Navigate; route: string }) {
  const aba = route.split('/')[1] || 'valores'
  const abas = [{ label: 'Valores e vocabulários', route: 'parametrizacoes/valores' }, { label: 'Aparência', route: 'parametrizacoes/aparencia' }, { label: 'Notificações', route: 'parametrizacoes/notificacoes' }, { label: 'Identidade do ambiente', route: 'parametrizacoes/identidade' }, { label: 'Planos e módulos', route: 'parametrizacoes/planos' }, { label: 'Dados e retenção', route: 'parametrizacoes/dados' }]
  if (aba === 'identidade') return <><PageHeader eyebrow="Administração" title="Identidade do ambiente" description="Nome, sigla e referências do grupo político. Afeta o que todo mundo vê — por isso vive aqui, e não na conta pessoal." /><SubTabs items={abas} active="parametrizacoes/identidade" navigate={navigate} /><IdentidadeAmbiente /></>
  if (aba === 'dados') return <><PageHeader eyebrow="Administração" title="Dados e retenção" description="Por quanto tempo o ambiente guarda cada coisa, e de onde vem cada dado. Base política guarda opinião sobre pessoas identificadas: retenção não é detalhe técnico." /><SubTabs items={abas} active="parametrizacoes/dados" navigate={navigate} /><DadosRetencao navigate={navigate} /></>
  if (aba === 'aparencia') return <><PageHeader eyebrow="Administração" title="Aparência global" description="Configurações de tema que se aplicam a todos os usuários do ambiente." /><SubTabs items={abas} active="parametrizacoes/aparencia" navigate={navigate} /><ParametrizacaoAparencia /></>
  if (aba === 'notificacoes') return <><PageHeader eyebrow="Administração" title="Notificações globais" description="Configurações de notificação que se aplicam a todos os usuários do ambiente." /><SubTabs items={abas} active="parametrizacoes/notificacoes" navigate={navigate} /><ParametrizacaoNotificacoes /></>
  if (aba === 'planos') return <>
    <PageHeader eyebrow="Administração" title="Planos e módulos" description="O que este cliente contratou. Desligar um módulo o remove do menu — é assim que o mesmo produto atende grupos diferentes." actions={<button className="secondary-button" onClick={() => navigate('configuracoes')}><Settings size={16} /> Configurações gerais</button>} />
    <SubTabs items={abas} active="parametrizacoes/planos" navigate={navigate} />
    <PlanosModulos />
  </>
  return <ParametersValores navigate={navigate} abas={abas} />
}

function ParametersValores({ navigate, abas }: { navigate: Navigate; abas: { label: string; route: string }[] }) {
  const categories = [
    { id: 'tipos', icon: Layers3, title: 'Tipos e classificações', count: 12, values: ['Liderança comunitária', 'Representação setorial', 'Articulação regional'] },
    { id: 'status', icon: Activity, title: 'Status de acompanhamento', count: 8, values: ['Monitorado', 'Contato prioritário', 'Em aproximação'] },
    { id: 'territorios', icon: Map, title: 'Regras territoriais', count: 6, values: ['Região estratégica', 'Polo de influência', 'Área de cobertura'] },
    { id: 'areas', icon: BriefcaseBusiness, title: 'Áreas de atuação', count: 9, values: ['Educação', 'Saúde', 'Infraestrutura', 'Cultura', 'Meio ambiente', 'Economia', 'Esporte', 'Segurança'] },
    { id: 'atributos', icon: Star, title: 'Atributos de liderança', count: 6, values: ['Articuladora', 'Base comunitária', 'Técnica', 'Nome nacional', 'Base sindical', 'Mobilizadora'] },
    { id: 'grupos', icon: UsersRound, title: 'Grupos locais', count: 8, values: ['Conselho regional', 'Rede comunitária', 'Fórum setorial'] },
    { id: 'interacoes', icon: MessageCircle, title: 'Tipos de interação', count: 7, values: ['Reunião', 'Visita', 'Entrevista'] },
    { id: 'campos', icon: FileText, title: 'Campos complementares', count: 9, values: ['Tema prioritário', 'Canal preferencial', 'Nível de relacionamento'] },
    { id: 'governanca', icon: BookOpenCheck, title: 'Políticas de governança', count: 6, values: ['Revisão de vínculo', 'Retenção de histórico', 'Aprovação de campo sensível'] },
  ]
  const [selected, setSelected] = useState(categories[0])
  const [values, setValues] = useState<Record<string, string[]>>({})
  const [newValue, setNewValue] = useState('')
  const currentValues = values[selected.id] || selected.values
  return <>
    <PageHeader eyebrow="Administração" title="Parametrizações" description="Regras, tipos, cargos, status, territórios, papéis, campos e valores configuráveis do produto." actions={<button className="secondary-button" onClick={() => navigate('configuracoes')}><Settings size={16} /> Configurações gerais</button>} />
    <SubTabs items={abas} active="parametrizacoes/valores" navigate={navigate} />
    <VocabularioStatus />
    <div style={{marginTop: '24px'}} className="parameters-layout"><nav className="card parameter-nav" aria-label="Categorias de parametrização">{categories.map(category => { const Icon = category.icon; return <button className={selected.id === category.id ? 'active' : ''} key={category.id} onClick={() => setSelected(category)}><span><Icon size={18} /></span><div><strong>{category.title}</strong><small>{category.count} valores configurados</small></div><ChevronRight size={16} /></button> })}</nav><section className="card parameter-detail"><div className="card-heading"><div><span className="eyebrow">Categoria selecionada</span><h2>{selected.title}</h2></div><button className="primary-button" onClick={() => document.getElementById('new-parameter')?.focus()}><Plus size={16} /> Novo valor</button></div><p className="section-description">Valores usados de forma consistente nos cadastros e filtros. A estrutura do menu não é parametrizável.</p><div className="parameter-values">{currentValues.map((value, index) => <div key={value}><span className="drag-handle">⋮⋮</span><div><strong>{value}</strong><small>Código fictício: {selected.id.toUpperCase()}-{String(index + 1).padStart(2, '0')}</small></div><Pill tone="green">Ativo</Pill><button className="icon-button" aria-label="Mais ações"><MoreHorizontal size={17} /></button></div>)}</div><form className="inline-add" onSubmit={event => { event.preventDefault(); if (!newValue.trim()) return; setValues(current => ({ ...current, [selected.id]: [...currentValues, newValue.trim()] })); setNewValue('') }}><input id="new-parameter" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Adicionar novo valor" /><button className="primary-button">Adicionar</button></form></section></div>
  </>
}

function Historico({ navigate }: { navigate: Navigate }) {
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState<'data' | 'pessoa' | 'tipo' | 'territorio'>('data')
  const [direcao, setDirecao] = useState<'asc' | 'desc'>('desc')
  const lista = relationships.filter(r => (filtroTipo === 'Todos' || r.type === filtroTipo) && (r.person.toLowerCase().includes(busca.toLowerCase()) || r.territory.toLowerCase().includes(busca.toLowerCase()))).sort((a, b) => {
    const cmp = ordem === 'data' ? a.when.localeCompare(b.when) : ordem === 'pessoa' ? a.person.localeCompare(b.person) : ordem === 'tipo' ? a.type.localeCompare(b.type) : a.territory.localeCompare(b.territory)
    return direcao === 'asc' ? cmp : -cmp
  })
  const ordena = (col: 'data' | 'pessoa' | 'tipo' | 'territorio') => { setOrdem(col); setDirecao(d => d === 'asc' ? 'desc' : 'asc') }
  return <>
    <PageHeader eyebrow="Relacionamento" title="Histórico" description="Registro de interações, visitas e contatos com candidatos e lideranças." actions={<><button className="secondary-button" onClick={() => navigate('painel')}><ArrowLeft size={16} /> Voltar</button><button className="secondary-button"><Download size={16} /> Exportar</button></>} />
    <section className="card toolbar-card"><div className="search-field"><Search size={17} /><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por pessoa ou território" aria-label="Buscar" /></div><select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}><option>Todos</option><option>Reunião</option><option>Visita</option><option>Contato</option></select></section>
    <div className="table-card"><table><thead><tr><th onClick={() => ordena('data')} style={{cursor:'pointer'}}>Data {ordem === 'data' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('tipo')} style={{cursor:'pointer'}}>Tipo {ordem === 'tipo' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('pessoa')} style={{cursor:'pointer'}}>Pessoa {ordem === 'pessoa' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('territorio')} style={{cursor:'pointer'}}>Território {ordem === 'territorio' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th>Registrada por</th><th>Nota</th></tr></thead><tbody>{lista.map(r => <tr key={r.person + r.when}><td>{r.when}</td><td>{r.type}</td><td><strong>{r.person}</strong></td><td>{r.territory}</td><td>{r.by}</td><td><small>{r.note}</small></td></tr>)}</tbody></table></div>
  </>
}

function SettingsPage({ route, navigate }: { route: string; navigate: Navigate }) {
  const { tenant, setTenant, perfil, setPerfil } = useTenant()
  const { tema, setTema } = useTema()
  const aba = route.split('/')[1] || 'aparencia'
  const [salvo, setSalvo] = useState(false)
  const [toggles, setToggles] = useState({ oportunidade: true, resumo: true, confidencial: false, aniversario: true, prazo: true })
  const abas = [
    { id: 'perfil', label: 'Dados pessoais', icone: UserCog },
    { id: 'aparencia', label: 'Aparência', icone: Palette },
    { id: 'notificacoes', label: 'Notificações', icone: Bell },
    { id: 'seguranca', label: 'Segurança e sessão', icone: Shield },
  ]
  const salvar = () => { setSalvo(true); setTimeout(() => setSalvo(false), 1800) }
  return <>
    <PageHeader eyebrow="Configurações pessoais" title="Minha conta" description="Só o que afeta você neste dispositivo e nesta conta. O que vale para todo o ambiente — identidade, vocabulários, planos e retenção — mora em Administração → Parametrizações." actions={salvo ? <span className="confirmacao"><Check size={15} /> Alterações salvas</span> : undefined} />
    <div className="settings-layout">
      <nav className="card settings-nav" aria-label="Seções de configuração">{abas.map(a => { const Icone = a.icone; return <button key={a.id} className={aba === a.id ? 'active' : ''} onClick={() => navigate(`configuracoes/${a.id}`)}><Icone size={17} /> {a.label}</button> })}</nav>
      <section className="card settings-form">

        {aba === 'perfil' && <>
          <div className="card-heading"><div><span className="eyebrow">Sua conta</span><h2>Dados pessoais</h2></div></div>
          <p className="section-description">Estas informações são visíveis para outros usuários do sistema.</p>
          <div className="user-profile-header">
            <Avatar initials="SL" size="lg" />
            <div>
              <strong>Sofia Linhares</strong>
              <small>Coordenação política · Articulação</small>
              <span className="user-email">sofia.linhares@exemplo.invalid</span>
            </div>
          </div>
          <div className="form-grid">
            <label>Nome completo<input defaultValue="Sofia Linhares" /></label>
            <label>E-mail<input defaultValue="sofia.linhares@exemplo.invalid" type="email" /></label>
            <label>Telefone<input defaultValue="+55 (11) 99999-9999" type="tel" /></label>
          </div>
          <h3>Vínculos no sistema</h3>
          <div className="vinculos-grid">
            <div className="vinculo-card">
              <UsersRound size={18} />
              <div><strong>Equipe</strong><small>Funcionária · Coordenação política</small></div>
              <Pill tone="green">Ativo</Pill>
            </div>
            <div className="vinculo-card">
              <UserCog size={18} />
              <div><strong>Usuário</strong><small>Administrador · MASTER</small></div>
              <Pill tone="green">Acesso ativo</Pill>
            </div>
            <div className="vinculo-card">
              <Link2 size={18} />
              <div><strong>Liderança</strong><small>Helena Prado Nunes</small></div>
              <button className="text-button">Ver perfil</button>
            </div>
          </div>
          <div className="settings-actions"><button className="primary-button" onClick={salvar}>Salvar alterações</button></div>
        </>}

        {aba === 'aparencia' && <>
          <div className="card-heading"><div><span className="eyebrow">Aparência</span><h2>Tema da interface</h2></div></div>
          <p className="section-description">Três opções, não duas: "Seguir o sistema" respeita a preferência que você já declarou no seu computador, e muda junto com ele.</p>
          <div className="tema-grid" role="radiogroup" aria-label="Tema da interface">
            {([['sistema', 'Seguir o sistema', 'Acompanha o tema do seu computador'], ['claro', 'Claro', 'Fundo claro, ideal para sala iluminada'], ['escuro', 'Escuro', 'Menos cansativo em jornada longa']] as const).map(([id, titulo, texto]) =>
              <button key={id} role="radio" aria-checked={tema === id} className={`tema-opcao ${tema === id ? 'ativo' : ''}`} onClick={() => setTema(id)}>
                <span className={`tema-amostra amostra-${id}`} aria-hidden="true"><i /><b /></span>
                <strong>{titulo}</strong><small>{texto}</small>
                {tema === id && <Pill tone="green"><Check size={12} /> Em uso</Pill>}
              </button>)}
          </div>
          <h3>Acessibilidade</h3>
          <div className="info-grid"><span><small>Movimento reduzido</small><strong>{typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Ativo pelo sistema' : 'Desativado pelo sistema'}</strong></span><span><small>Contraste dos textos</small><strong>WCAG AA em ambos os temas</strong></span></div>
          <p className="section-description">O protótipo obedece à preferência de movimento reduzido do sistema operacional: as animações somem e o estado final permanece visível.</p>
        </>}

        {aba === 'organizacao' && <>
          <div className="card-heading"><div><span className="eyebrow">Identidade do ambiente</span><h2>{tenant.nome}</h2></div><Pill tone="blue">Plano {planos.find(p => p.id === tenant.plano)?.nome}</Pill></div>
          <div className="form-grid">
            <label>Nome exibido<input value={tenant.nome} onChange={e => setTenant({ ...tenant, nome: e.target.value })} /></label>
            <label>Sigla<input value={tenant.sigla} maxLength={4} onChange={e => setTenant({ ...tenant, sigla: e.target.value.toUpperCase() })} /></label>
            <label>Candidato principal<input value={tenant.candidatoPrincipal} onChange={e => setTenant({ ...tenant, candidatoPrincipal: e.target.value })} /></label>
            <label>Partido de referência<input value={tenant.partidoReferencia} onChange={e => setTenant({ ...tenant, partidoReferencia: e.target.value })} /></label>
            <label className="full-field">Descrição<textarea defaultValue="Ambiente inteiramente fictício para demonstração do produto Eleitores." /></label>
          </div>
          <div className="domain-note"><Info size={18} /><div><strong>O que você muda aqui aparece na hora no menu e nas telas.</strong><p>Sigla e nome alimentam o rodapé da barra lateral; candidato e partido de referência são usados para destacar registros do próprio grupo.</p></div></div>
          <div className="settings-actions"><button className="primary-button" onClick={salvar}>Salvar alterações</button></div>
        </>}

        {aba === 'aparencia' && <><h3>Ver o sistema como outro perfil</h3><p className="section-description">Recurso de demonstração: troque o perfil e o menu se reorganiza na hora. É assim que o produto esconde módulo de quem não tem permissão — o contrato diz o que o cliente comprou, o perfil diz o que a pessoa pode ver.</p><div className="perfil-grid">{perfis.map(p => <button key={p.id} className={`card perfil-opcao ${perfil.id === p.id ? 'ativo' : ''}`} onClick={() => setPerfil(p)}><div><strong>{p.nome}</strong><small>{p.descricao}</small></div><Pill tone={perfil.id === p.id ? 'green' : 'neutral'}>{p.ve === '*' ? modulos.length : p.ve.length} módulos</Pill></button>)}</div></>}

        {aba === 'notificacoes' && <>
          <div className="card-heading"><div><span className="eyebrow">Avisos</span><h2>O que merece interromper você</h2></div></div>
          <p className="section-description">Notificação demais vira ruído e some com o que importa. Cada item aqui existe porque a perda dele custa uma oportunidade concreta.</p>
          {([['oportunidade', 'Território pedindo atenção', 'Quando um município de prioridade alta fica sem visita por mais de 90 dias.'], ['aniversario', 'Data comemorativa próxima', 'Aniversário de candidato, de município ou festa de padroeira nos próximos 7 dias.'], ['prazo', 'Prazo de prestação de contas', 'Lançamento sem comprovante às vésperas do fechamento do período.'], ['resumo', 'Resumo executivo semanal', 'Consolida avanços e pendências numa leitura curta, toda segunda.']] as const).map(([id, titulo, texto]) =>
            <label className="toggle-row" key={id}><span><strong>{titulo}</strong><small>{texto}</small></span><input type="checkbox" checked={toggles[id]} onChange={e => setToggles(c => ({ ...c, [id]: e.target.checked }))} /></label>)}
          <div className="settings-actions"><button className="primary-button" onClick={salvar}>Salvar preferências</button></div>
        </>}

        {aba === 'seguranca' && <>
          <div className="card-heading"><div><span className="eyebrow">Acesso</span><h2>Segurança e sessão</h2></div></div>
          <div className="info-grid"><span><small>Perfil</small><strong>Administradora</strong></span><span><small>Autenticação em duas etapas</small><strong>Não configurada</strong></span><span><small>Último acesso</small><strong>Hoje, 10:42 · este dispositivo</strong></span><span><small>Expiração de sessão</small><strong>8 horas de inatividade</strong></span></div>
          <h3>Sessões ativas</h3>
          <div className="sessoes">{[['Este dispositivo', 'Windows · Chrome', 'agora', true], ['Notebook da coordenação', 'Windows · Edge', 'há 2 dias', false], ['Celular', 'Android · Chrome', 'há 6 dias', false]].map(([nome, onde, quando, atual]) =>
            <div key={nome as string}><div><strong>{nome}</strong><small>{onde} · {quando}</small></div>{atual ? <Pill tone="green">Sessão atual</Pill> : <button className="secondary-button">Encerrar</button>}</div>)}</div>
          <label className="toggle-row"><span><strong>Modo de alta confidencialidade</strong><small>Oculta telefones, observações políticas e valores ao compartilhar tela. Útil em reunião com terceiros.</small></span><input type="checkbox" checked={toggles.confidencial} onChange={e => setToggles(c => ({ ...c, confidencial: e.target.checked }))} /></label>
          <div className="source-warning"><AlertTriangle size={18} /><div><strong>Demonstração</strong><p>Nenhuma sessão, senha ou autenticação real existe neste protótipo. Os controles são ilustrativos.</p></div></div>
        </>}

        {aba === 'dados' && <>
          <div className="card-heading"><div><span className="eyebrow">Governança</span><h2>Dados e privacidade</h2></div></div>
          <p className="section-description">Base política guarda opinião sobre pessoas identificadas. Retenção e saída de dado não são detalhe técnico — são a diferença entre inteligência e passivo.</p>
          <div className="form-grid">
            <label>Retenção do histórico de interações<select defaultValue="5 anos"><option>2 anos</option><option>5 anos</option><option>Indeterminada</option></select></label>
            <label>Retenção de arquivos exportados<select defaultValue="7 dias"><option>7 dias</option><option>30 dias</option><option>90 dias</option></select></label>
          </div>
          <h3>Origem dos dados</h3>
          <div className="origem-lista">{[['TSE', 'Candidaturas, resultados e filiação', 'Sincronização manual hoje; automática prevista'], ['IBGE', 'População, malha territorial e códigos', 'Sincronização manual hoje; automática prevista'], ['ANAC', 'Pistas de pouso próximas aos municípios', 'Integração prevista, hoje preenchido à mão'], ['Equipe', 'Avaliação política, observações e vínculos', 'Sempre manual, sempre com autor e data']].map(([fonte, o, como]) =>
            <div key={fonte}><span className="origem-selo">{fonte}</span><div><strong>{o}</strong><small>{como}</small></div></div>)}</div>
          <h3>Seus dados</h3>
          <div className="acoes-dados">
            <button className="secondary-button" onClick={() => navigate('exportacoes')}><Download size={15} /> Exportar tudo</button>
            <button className="secondary-button"><FileText size={15} /> Registro de auditoria</button>
            <button className="secondary-button perigo"><AlertTriangle size={15} /> Solicitar exclusão do ambiente</button>
          </div>
          <p className="section-description">A exclusão é irreversível e passa por confirmação humana — por isso ela pede solicitação, não um botão que apaga na hora.</p>
        </>}

      </section>
    </div>
  </>
}


function SubTabs({ items, active, navigate }: { items: { label: string; route: string }[]; active: string; navigate: Navigate }) {
  return <nav className="subtabs" aria-label="Navegação da seção">{items.map(item => <button key={item.route} className={active === item.route ? 'active' : ''} onClick={() => navigate(item.route)}>{item.label}</button>)}</nav>
}

function AccordionBlock({ title, icon: Icon, children, open = false }: { title: string; icon: LucideIcon; children: ReactNode; open?: boolean }) {
  return <details className="detail-accordion card" open={open}><summary><span><Icon size={18} />{title}</span><ChevronDown size={17} /></summary><div className="detail-body">{children}</div></details>
}

/** Só o que foi preenchido aparece. Vazio não vira linha "não informado" — vira pendência. */
function DadosInternosBloco({ id, navigate }: { id: number; navigate: Navigate }) {
  const { statusDe } = useAvaliacao()
  const d = dadosInternos[id] || {}
  const vazio = !d.telefone && !d.areas?.length && !d.atributos?.length && !d.vinculos?.length && !d.observacao
  if (vazio) return <div className="muted-box">Nenhum dado interno registrado ainda. Tudo o que se sabe desta pessoa veio do TSE.</div>
  return <>
    <div className="info-grid">
      {d.telefone && <span><small>Telefone institucional</small><strong>{d.telefone}</strong></span>}
      {d.canal && <span><small>Canal preferencial</small><strong>{d.canal}</strong></span>}
      {d.conjuge && <span><small>Cônjuge</small><strong>{d.conjuge}</strong></span>}
    </div>
    {!!d.areas?.length && <div className="campo-chips"><small>Áreas de atuação</small><div className="pill-row">{d.areas.map(a => <Pill key={a} tone="blue">{a}</Pill>)}</div></div>}
    {!!d.atributos?.length && <div className="campo-chips"><small>Atributos de liderança</small><div className="pill-row">{d.atributos.map(a => <Pill key={a}>{a}</Pill>)}</div></div>}
    {!!d.vinculos?.length && <div className="campo-chips"><small>Vínculos com outros candidatos</small><div className="vinculo-lista">{d.vinculos.map(v => { const p = electoralPeople.find(x => x.id === v.pessoaId); if (!p) return null; return <button key={v.pessoaId} onClick={() => navigate(`quadro-eleitoral/perfil/${p.id}`)}><Avatar initials={p.initials} size="sm" /><span><strong>{p.name}</strong><small>{v.tipo}</small></span><StatusPill valor={statusDe(p.id)} /><ChevronRight size={15} /></button> })}</div></div>}
    {d.observacao && <div className="observacao"><p>{d.observacao.texto}</p><small>{d.observacao.autor} · {d.observacao.data} · edição rastreável</small></div>}
  </>
}

function ElectoralProfileExpanded({ person, navigate }: { person: ElectoralPerson; navigate: Navigate }) {
  const { statusDe, avaliar } = useAvaliacao()
  const { tenant } = useTenant()
  const [tab, setTab] = useState('perfil')
  return <>
    <button className="back-button" onClick={() => navigate('quadro-eleitoral')}><ChevronLeft size={16} /> Voltar ao quadro eleitoral</button>
    <section className="profile-hero card domain-hero electoral"><div className="profile-main"><div className="portrait-placeholder"><Avatar initials={person.initials} size="lg" /><small>Foto ilustrativa</small></div><div><span className="eyebrow">Perfil eleitoral estruturado</span><h1>{person.name}</h1><p>{person.office} · {person.party} · {person.territory}</p><div className="pill-row"><Pill tone="green">{person.status}</Pill>{person.running && <Pill tone="blue">Em disputa</Pill>}<Pill>Atualizado há 2 dias</Pill></div></div></div><div className="hero-actions"><button className="secondary-button danger-button"><X size={16} /> Inativar</button><button className="secondary-button" onClick={() => setTab('auditoria')}><History size={16} /> Auditoria</button><button className="secondary-button"><Edit size={16} /> Editar</button><button className="primary-button" onClick={() => navigate('agenda')}><CalendarDays size={16} /> Agendar interação</button></div></section>
    <div className="profile-tabs"><button className={tab === 'perfil' ? 'active' : ''} onClick={() => setTab('perfil')}>Perfil completo</button><button className={tab === 'interacoes' ? 'active' : ''} onClick={() => setTab('interacoes')}>Interações</button><button className={tab === 'auditoria' ? 'active' : ''} onClick={() => setTab('auditoria')}>Auditoria</button></div>
    {tab === 'perfil' && <><section className="card avaliacao-bloco"><div><span className="eyebrow">Avaliação política</span><h2>Como o grupo classifica esta pessoa</h2><p className="section-description">É a única informação da ficha que é julgamento da equipe, não fato do TSE. Trocar aqui atualiza a lista e o painel na hora.</p></div><div className="avaliacao-opcoes" role="radiogroup" aria-label="Status político">{tenant.escalaStatus.map(s => <button key={s.valor} role="radio" aria-checked={statusDe(person.id) === s.valor} className={statusDe(person.id) === s.valor ? 'ativo' : ''} onClick={() => avaliar(person.id, s.valor)} title={s.descricao}><StatusPill valor={s.valor} /></button>)}</div></section><FaixaCompletude valor={completude(person.id).pct} atualizadoPor={dadosInternos[person.id]?.observacao?.autor || 'ninguém ainda'} quando={dadosInternos[person.id]?.observacao?.data || '—'} />
    <div className="detail-layout"><div className="detail-stack">
      <section className="card"><div className="card-heading"><div><span className="eyebrow">Origem oficial</span><h2>Dados do TSE</h2></div><Pill tone="blue"><ShieldCheck size={12} /> Sinc. 12/08/2026</Pill></div><p className="section-description">Somente leitura. Divergência aqui se resolve na fila de vínculo da Base Nacional, não na ficha.</p><div className="info-grid"><span><small>Nome completo</small><strong>{person.name}</strong></span><span><small>Nome de urna</small><strong>{person.name.split(" ")[0]} {person.name.split(" ").at(-1)}</strong></span><span><small>Partido</small><strong>{person.party}</strong></span><span><small>Cargo</small><strong>{person.office}</strong></span><span><small>Município</small><strong>{person.territory}</strong></span><span><small>Situação</small><strong>{person.status}</strong></span></div></section>
      <AccordionBlock title="Histórico eleitoral" icon={Vote} open><p className="section-description">Cada disputa com votação e resultado, como publicado pelo TSE.</p><div className="timeline">{person.history.map(item => <div key={item.year}><span>{item.year}</span><div><strong>{item.office}</strong><p>{item.votes.toLocaleString("pt-BR")} votos</p></div><Pill tone={item.result.includes("Eleit") ? "green" : "amber"}>{item.result}</Pill></div>)}</div></AccordionBlock>
      <section className="card"><div className="card-heading"><div><span className="eyebrow">Preenchido pela equipe</span><h2>Dados internos</h2></div><button className="icon-button" aria-label="Editar dados internos"><Plus size={16} /></button></div><DadosInternosBloco id={person.id} navigate={navigate} /></section>
    </div><aside className="detail-aside"><section className="card performance-card"><span className="eyebrow">Desempenho eleitoral</span><strong className="big-number">{person.performance}</strong><Progress value={person.performance} label="Índice demonstrativo" /><div className="mini-bars">{[42,68,55,81,73].map((v,i)=><i key={i} style={{ height: `${v}%` }} />)}</div><button className="text-button" onClick={() => navigate("relatorios/municipios")}>Ver por município <ArrowRight size={14}/></button></section>
      <BlocoCompletar pendentes={completude(person.id).pendentes.map(c => ({ campo: c.label, porque: c.porque }))} />
    </aside></div></>}
    {tab === 'interacoes' && <section className="card"><div className="card-heading"><div><span className="eyebrow">Linha do tempo</span><h2>Interações e encaminhamentos</h2></div><button className="primary-button"><Plus size={15}/> Registrar</button></div><div className="audit-timeline">{relationships.map((r,i)=><div key={r.when}><span className={`audit-dot ${i===0?'purple':''}`}/><div><strong>{r.type} · {r.when}</strong><p>{r.note}</p><small>Registrado por {r.by} · vínculo auditável</small></div></div>)}</div></section>}
    {tab === 'auditoria' && <AuditPanel />}
  </>
}

function TerritoryProfile({ id, navigate }: { id: string; navigate: Navigate }) {
  const { tenant } = useTenant()
  const decodeId = decodeURIComponent(id)
  // Verifica se é um território original (tem ID do territories) ou uma divisão (tem nome da divisão)
  const territory = territories.find(t => t.id === decodeId)
  const divisao = divisoes.find(d => d.nome.toLowerCase().replace(/\s+/g, '-') === decodeId || d.nome === decodeId)

  // Se é uma divisão (视图 de Mesorregião)
  if (divisao) {
    const municipiosDaDivisao = municipios.filter(m => m.divisao === divisao.nome)
    const completudeMedia = municipiosDaDivisao.length > 0
      ? Math.round(municipiosDaDivisao.reduce((soma, m) => soma + m.completude, 0) / municipiosDaDivisao.length)
      : 0
    const consolidado = municipiosDaDivisao.filter(m => m.completude >= 80).length
    const critico = municipiosDaDivisao.filter(m => m.completude < 40).length
    return <>
      <button className="back-button" onClick={() => navigate('territorios')}><ChevronLeft size={16}/> Voltar aos territórios</button>
      <section className="profile-hero card domain-hero territory"><div><span className="eyebrow">{tenant.divisaoTerritorial}</span><h1>{divisao.nome}</h1><p>{municipiosDaDivisao.length} município{municipiosDaDivisao.length !== 1 ? 's' : ''} · {divisao.populacao.toLocaleString('pt-BR')} habitantes</p><div className="pill-row"><Pill tone={completudeMedia >= 70 ? 'green' : completudeMedia >= 40 ? 'amber' : 'red'}>Cobertura {completudeMedia}%</Pill></div></div><div className="hero-actions"><button className="secondary-button"><Download size={15} /> Exportar</button><button className="primary-button"><Plus size={15} /> Editar</button></div></section>
      <FaixaCompletude valor={completudeMedia} atualizadoPor="Sofia Linhares" quando="09 ago 2026" />
      <div className="metrics-grid five">
        <Metric label="Municípios" value={String(municipiosDaDivisao.length)} delta="nesta divisão" icon={Building2} />
        <Metric label="Eleitores" value={divisao.eleitores.toLocaleString('pt-BR')} delta="total na divisão" icon={UsersRound} />
        <Metric label="População" value={divisao.populacao.toLocaleString('pt-BR')} delta="total na divisão" icon={UsersRound} />
        <Metric label="Consolidados" value={String(consolidado)} delta="acima de 80%" icon={Check} tone="green" />
        <Metric label="Críticos" value={String(critico)} delta="abaixo de 40%" icon={AlertTriangle} tone="red" />
      </div>
      <section className="card"><div className="card-heading"><div><span className="eyebrow">Municípios desta {tenant.divisaoTerritorial}</span><h2>Lista consolidada</h2></div></div><div className="municipios-grid">{municipiosDaDivisao.map(m => <article className="card municipio-card" key={m.id}><div className="municipio-topo"><div><h3>{m.nome}</h3><small>Cód. {m.codigo}</small></div><Pill tone={m.completude >= 80 ? 'green' : m.completude >= 40 ? 'amber' : 'red'}>{m.completude}%</Pill></div><div className="municipio-nums"><span><small>População</small><strong>{m.populacao.toLocaleString('pt-BR')}</strong></span><span><small>Eleitores</small><strong>{m.eleitores.toLocaleString('pt-BR')}</strong></span></div><label className="coverage-label"><span>Dossiê <strong>{m.completude}%</strong></span><Progress value={m.completude} /></label><button className="secondary-button full" onClick={() => navigate(`municipios/perfil/${m.id}`)}>Ver dossiê <ArrowRight size={15} /></button></article>)}</div></section>
    </>
  }

  // Se é um território original (com mapa)
  const t = territory || territories[0]
  const [notes, setNotes] = useState('Gerais')
  return <><button className="back-button" onClick={() => navigate('territorios')}><ChevronLeft size={16}/> Voltar aos territórios</button><section className="profile-hero card domain-hero territory"><div><span className="eyebrow">Perfil territorial · Município demonstrativo</span><h1>Município de {t.name}</h1><p>Panorama socioterritorial, político e eleitoral em uma leitura única.</p><div className="pill-row"><Pill tone={t.priority==='Alta'?'amber':'green'}>Prioridade {t.priority}</Pill><Pill>{t.electorate.toLocaleString('pt-BR')} eleitores simulados</Pill></div></div><button className="primary-button" onClick={() => navigate('relacionamento/agenda')}><CalendarDays size={16}/> Criar agenda</button></section><div className="metrics-grid"><Metric label="Cobertura" value={`${t.coverage}%`} delta="+4 p.p. no ciclo" icon={Target}/><Metric label="Representantes" value="18" delta="5 aliados ativos" icon={UsersRound}/><Metric label="Oportunidades" value="7" delta="2 pedem ação" icon={Sparkles}/><Metric label="Agendas" value="12" delta="últimos 90 dias" icon={CalendarDays}/></div><div className="territory-profile-grid"><section className="card territory-visual"><div className="card-heading"><div><span className="eyebrow">Panorama</span><h2>Mapa e indicadores</h2></div><Pill tone="blue">Recorte municipal</Pill></div><svg viewBox="0 0 520 320" aria-label="Mapa abstrato"><path d={t.path} fill={priorityColors[t.priority]}/><circle cx="260" cy="150" r="12"/><circle cx="330" cy="210" r="7"/><path className="map-link" d="M260 150 L330 210"/></svg><div className="indicator-strip"><span><small>Urbanização</small><strong>76%</strong></span><span><small>Renda índice</small><strong>62/100</strong></span><span><small>Engajamento</small><strong>71/100</strong></span></div></section><section className="card"><div className="card-heading"><div><span className="eyebrow">Quadro eleitoral</span><h2>Representantes e aliados</h2></div></div>{electoralPeople.slice(0,4).map(p=><button className="leader-row" key={p.id} onClick={()=>navigate(`quadro-eleitoral/perfil/${p.id}`)}><Avatar initials={p.initials} size="sm"/><span><strong>{p.name}</strong><small>{p.office}</small></span><Pill tone={p.id%2?'green':'blue'}>{p.id%2?'Aliado':'Monitorado'}</Pill></button>)}</section></div><div className="dashboard-grid equal"><section className="card"><div className="card-heading"><div><span className="eyebrow">Oportunidade</span><h2>Leitura socioterritorial</h2></div><Sparkles size={20}/></div><div className="opportunity-callout">{t.opportunity}</div><div className="info-grid"><span><small>Dinâmica populacional</small><strong>Crescimento moderado</strong></span><span><small>Principal polo</small><strong>Distrito Aurora</strong></span><span><small>Pressão de agenda</small><strong>Alta</strong></span><span><small>Fonte</small><strong>IBGE fictício curado</strong></span></div></section><section className="card structured-notes"><div className="card-heading"><div><span className="eyebrow">Registros auditáveis</span><h2>Observações</h2></div><button className="icon-button" aria-label="Adicionar observação"><Plus size={16}/></button></div><div className="segmented">{['Gerais','Políticas','Relacionamento'].map(n=><button className={notes===n?'active':''} onClick={()=>setNotes(n)} key={n}>{n}</button>)}</div><article><strong>{notes === 'Gerais' ? 'Conectividade entre distritos' : notes === 'Políticas' ? 'Recomposição de alianças locais' : 'Retomar encontro com conselho regional'}</strong><p>Registro demonstrativo estruturado, com contexto curto e próximo passo.</p><small>Sofia Linhares · 10 ago 2026 · edição rastreável</small></article></section></div><section className="card"><div className="card-heading"><div><span className="eyebrow">Histórico</span><h2>Resultados e agendas do município</h2></div><button className="text-button" onClick={()=>navigate('relatorios/municipios')}>Abrir relatório <ArrowRight size={14}/></button></div><div className="result-comparison">{['2020','2022','2024'].map((year,i)=><div key={year}><strong>{year}</strong><span><i style={{width:`${58+i*12}%`}}/></span><b>{(24+i*7)} mil votos</b></div>)}</div></section></>
}

function Reports({ route, navigate }: { route: string; navigate: Navigate }) {
  const view = route.split('/')[1] || 'visao-geral'
  const tabs=[{label:'Visão geral',route:'relatorios/visao-geral'},{label:'Espelho comparativo',route:'relatorios/comparativo'},{label:'Consolidado',route:'relatorios/consolidado'}]
  const [candidate, setCandidate]=useState('Helena Prado Nunes')
  const [compare, setCompare]=useState(false)
  return <><PageHeader eyebrow="Análise" title="Relatórios eleitorais" description="Leituras simuladas para comparar ciclos, candidaturas e desempenho municipal — sem gerar PDF real." actions={<button className="secondary-button"><Download size={16}/> Exportação demonstrativa</button>}/><SubTabs items={tabs} active={`relatorios/${view}`} navigate={navigate}/><section className="card report-filters"><select><option>Eleição fictícia 2026</option><option>Eleição fictícia 2024</option></select><select value={candidate} onChange={e=>setCandidate(e.target.value)}>{electoralPeople.slice(0,4).map(p=><option key={p.id}>{p.name}</option>)}</select><select><option>Todos os territórios</option>{territories.map(t=><option key={t.id}>{t.name}</option>)}</select><button className="filter-button"><Filter size={15}/> Aplicar</button></section>{view==='visao-geral'&&<><div className="metrics-grid"><Metric label="Votos consolidados" value="482.760" delta="+8,4% sobre o ciclo" icon={Vote}/><Metric label="Municípios líderes" value="18" delta="7 acima da meta" icon={MapPin}/><Metric label="Conversão estimada" value="71%" delta="faixa demonstrativa" icon={TrendingUp}/><Metric label="Alertas" value="4" delta="2 riscos críticos" icon={AlertTriangle}/></div><div className="dashboard-grid equal"><section className="card"><div className="card-heading"><div><span className="eyebrow">Evolução</span><h2>Curva de desempenho</h2></div><Pill tone="blue">{candidate.split(' ')[0]}</Pill></div><div className="line-chart"><svg viewBox="0 0 500 210"><polyline points="10,170 95,140 180,155 265,92 350,110 435,48 490,62"/><line x1="10" y1="185" x2="490" y2="185"/></svg></div></section><section className="card report-map"><div className="card-heading"><div><span className="eyebrow">Mapa de resultado</span><h2>Distribuição territorial</h2></div><label className="compare-switch"><input type="checkbox" checked={compare} onChange={e=>setCompare(e.target.checked)}/> Comparar</label></div><svg viewBox="0 0 520 320">{territories.map((t,i)=><path key={t.id} d={t.path} fill={compare?(i%2?'#8b5cf6':'#0ea5e9'):priorityColors[t.priority]} onClick={()=>navigate(`territorios/perfil/${t.id}`)}/>)}</svg><div className="map-caption">Clique em um território para abrir o detalhe municipal.</div></section></div></>}{view==='comparativo'&&<ComparisonReport navigate={navigate}/>} {view==='consolidado'&&<ConsolidatedReport navigate={navigate}/>}</>
}

function ComparisonReport({navigate}:{navigate:Navigate}) { return <div className="comparison-grid">{electoralPeople.slice(0,3).map((p,i)=><section className={`card candidate-comparison c${i}`} key={p.id}><Avatar initials={p.initials} size="lg"/><h2>{p.name}</h2><p>{p.party} · {p.office}</p><strong className="big-number">{p.performance}</strong><Progress value={p.performance}/><dl><div><dt>Votos</dt><dd>{p.votes.toLocaleString('pt-BR')}</dd></div><div><dt>Municípios líderes</dt><dd>{14-i*3}</dd></div><div><dt>Crescimento</dt><dd>+{8-i*2},2%</dd></div></dl><button className="text-button" onClick={()=>navigate(`quadro-eleitoral/perfil/${p.id}`)}>Abrir perfil <ArrowRight size={14}/></button></section>)}</div> }
function ConsolidatedReport({navigate}:{navigate:Navigate}) { return <section className="card"><div className="card-heading"><div><span className="eyebrow">Drill-down</span><h2>Desempenho municipal consolidado</h2></div><Pill tone="purple">63 municípios fictícios</Pill></div><div className="municipal-ranking">{territories.map((t,i)=><button key={t.id} onClick={()=>navigate(`territorios/perfil/${t.id}`)}><b>{i+1}</b><span><strong>{t.name}</strong><small>{t.electorate.toLocaleString('pt-BR')} eleitores simulados</small></span><Progress value={88-i*7}/><strong>{(88-i*7)}%</strong><ChevronRight size={16}/></button>)}</div></section> }

function NationalBaseHub({ navigate }: { navigate: Navigate }) {
  const [tab,setTab]=useState('cadastros'); const tabs=['cadastros','pessoas-tse','vinculos','eleicoes','territorios'];
  const [subRota, setSubRota] = useState('')
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const partes = hash.split('/')
    if (partes[0] === 'base-nacional' && partes[1]) {
      setSubRota(partes[1])
      setTab('cadastros')
    } else {
      setSubRota('')
    }
    const handler = () => {
      const h = window.location.hash.replace('#', '')
      const p = h.split('/')
      if (p[0] === 'base-nacional' && p[1]) {
        setSubRota(p[1])
        setTab('cadastros')
      } else {
        setSubRota('')
      }
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  if (subRota) return <NationalRecords navigate={navigate} modo="detalhe" />
  return <><PageHeader eyebrow="Administração" title="Base Nacional" description="Cadastros curados, vínculos de identidade, eleições, sincronizações e catálogo territorial — tudo simulado." actions={<button className="secondary-button"><RefreshCw size={16}/> Nova sincronização simulada</button>}/><div className="source-warning"><AlertTriangle size={18}/><div><strong>Ambiente demonstrativo</strong><p>Nenhum registro, arquivo ou serviço real está conectado.</p></div></div><div className="profile-tabs">{tabs.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{({cadastros:'Cadastros curados','pessoas-tse':'Pessoas TSE',vinculos:'Fila de vínculos',eleicoes:'Eleições e sincronizações',territorios:'Catálogo territorial'} as Record<string,string>)[t]}</button>)}</div>{tab==='cadastros'&&<NationalRecords navigate={navigate}/>}{tab==='pessoas-tse'&&<PessoasTSEList/>}{tab==='vinculos'&&<LinkQueue/>}{tab==='eleicoes'&&<ElectionCatalog/>}{tab==='territorios'&&<TerritoryCatalog/>}</>
}
function NationalRecords({ navigate, modo }: { navigate: Navigate; modo?: 'lista' | 'detalhe' }) {
  const conjuntos = [
    { id: 'tse', nome: 'TSE', descricao: 'Candidaturas e resultados', status: 'Atualizado', campos: 1247, registros: '2,4 mi', ultimaSinc: 'Hoje, 09:15' },
    { id: 'ibge', nome: 'IBGE', descricao: 'Malhas e indicadores', status: 'Atualizado', campos: 892, registros: '5.570', ultimaSinc: 'Hoje, 08:30' },
    { id: 'curadoria', nome: 'Curadoria interna', descricao: 'Identidades e exceções', status: '18 pendências', campos: 156, registros: '42.381', ultimaSinc: 'Ontem, 17:20' },
  ]
  // Em modo detalhe, pega o ID direto da URL
  const idSelecionado = modo === 'detalhe'
    ? (window.location.hash.replace('#', '').split('/')[2] || 'tse')
    : ''
  const conjuntoSelecionado = modo === 'detalhe' ? conjuntos.find(c => c.id === idSelecionado) : null

  if (modo === 'detalhe' && conjuntoSelecionado) {
    return <>
      <button className="back-button" onClick={() => navigate('base-nacional')} style={{marginBottom: 16}}><ChevronLeft size={16} /> Voltar para Base Nacional</button>
      <section className="profile-hero card domain-hero"><div><span className="eyebrow">Conjunto de dados</span><h1>{conjuntoSelecionado.nome}</h1><p>{conjuntoSelecionado.descricao}</p><div className="pill-row"><Pill tone={conjuntoSelecionado.status === 'Atualizado' ? 'green' : 'amber'}>{conjuntoSelecionado.status}</Pill></div></div><div className="hero-actions"><button className="secondary-button"><RefreshCw size={16} /> Sincronizar</button></div></section>
      <section className="card" style={{marginBottom: 24}}><div className="card-heading"><div><span className="eyebrow">Informações</span><h2>Detalhes do conjunto</h2></div></div>
        <div className="info-grid">
          <span><small>Campos disponíveis</small><strong>{conjuntoSelecionado.campos}</strong></span>
          <span><small>Registros</small><strong>{conjuntoSelecionado.registros}</strong></span>
          <span><small>Última sincronização</small><strong>{conjuntoSelecionado.ultimaSinc}</strong></span>
        </div>
        <p className="section-description">{conjuntoSelecionado.descricao}</p>
      </section>
      <section className="card" style={{marginBottom: 16}}><div className="card-heading"><div><span className="eyebrow">Amostra</span><h2>Campos disponíveis</h2></div></div>
        <div className="table-card"><table><thead><tr><th>Campo</th><th>Tipo</th><th>Origem</th></tr></thead><tbody>
          {conjuntoSelecionado.id === 'tse' && [['nome_candidato','Texto','TSE'],['cpf_candidato','Número','TSE'],['cargo','Enumeração','TSE'],['partido','Texto','TSE'],['ano_eleicao','Número','TSE'],['resultado','Enumeração','TSE'],['votos_obtidos','Número','TSE']].map(([c, t, o]) => <tr key={c}><td>{c}</td><td>{t}</td><td>{o}</td></tr>)}
          {conjuntoSelecionado.id === 'ibge' && [['codigo_municipio','Número','IBGE'],['nome_municipio','Texto','IBGE'],['populacao','Número','IBGE'],['idh','Número','IBGE'],['area_km2','Número','IBGE'],['regiao','Texto','IBGE'],['estado','Texto','IBGE']].map(([c, t, o]) => <tr key={c}><td>{c}</td><td>{t}</td><td>{o}</td></tr>)}
          {conjuntoSelecionado.id === 'curadoria' && [['nome_razao','Texto','Equipe'],['cpf','Número','Equipe'],['telefone','Texto','Equipe'],['email','Texto','Equipe'],['observacoes','Texto','Equipe'],['vinculo_partidario','Enumeração','Equipe'],['avaliacao_politica','Enumeração','Equipe']].map(([c, t, o]) => <tr key={c}><td>{c}</td><td>{t}</td><td>{o}</td></tr>)}
        </tbody></table></div>
      </section>
    </>
  }
  return <><div className="metrics-grid three"><Metric label="Pessoas curadas" value="2,8 mi" delta="volume fictício" icon={UsersRound}/><Metric label="Territórios" value="5.570" delta="catálogo demonstrativo" icon={Map}/><Metric label="Qualidade" value="98,7%" delta="regras simuladas" icon={ShieldCheck}/></div><section className="card"><div className="card-heading"><div><span className="eyebrow">Camadas permanentes</span><h2>Conjuntos curados</h2></div></div><div className="dataset-list">{conjuntos.map(x => <div key={x.id}><span className="dataset-icon"><Database size={17}/></span><div><strong>{x.nome}</strong><small>{x.descricao}</small></div><Pill tone={x.status === 'Atualizado' ? 'green' : 'amber'}>{x.status}</Pill><button className="icon-button" aria-label={`Abrir ${x.nome}`} onClick={() => window.location.hash = `base-nacional/${x.id}`}><ChevronRight size={16}/></button></div>)}</div></section></>}

function PessoasTSEList() {
  const [pessoas, setPessoas] = useState<TPessoaTSE[]>(pessoasTSE)
  const [promovidos, setPromovidos] = useState<number[]>([])
  const [filtro, setFiltro] = useState('')
  const [filtroCargo, setFiltroCargo] = useState('Todos')
  const [filtroPartido, setFiltroPartido] = useState('Todos')
  const [filtroResultado, setFiltroResultado] = useState('Todos')

  const shown = pessoas.filter(p => {
    if (promovidos.includes(p.id)) return false
    if (filtro && !p.nome.toLowerCase().includes(filtro.toLowerCase())) return false
    if (filtroCargo !== 'Todos' && p.cargo !== filtroCargo) return false
    if (filtroPartido !== 'Todos' && p.partido !== filtroPartido) return false
    if (filtroResultado !== 'Todos' && p.resultado !== filtroResultado) return false
    return true
  })

  const cargos = [...new Set(pessoasTSE.map(p => p.cargo))]
  const partidos = [...new Set(pessoasTSE.map(p => p.partido))]
  const resultados = [...new Set(pessoasTSE.map(p => p.resultado))]

  const promover = (id: number) => {
    setPromovidos(prev => [...prev, id])
  }

  const restaurar = () => {
    setPromovidos([])
  }

  return (
    <section className="card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">Importação do TSE</span>
          <h2>Pessoas candidatas pendentes</h2>
        </div>
        <Pill tone="amber">{shown.length} pendências</Pill>
      </div>

      <div className="tse-filtros">
        <div className="search-field">
          <Search size={17} />
          <input
            placeholder="Buscar por nome..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </div>
        <select value={filtroCargo} onChange={e => setFiltroCargo(e.target.value)}>
          <option>Todos os cargos</option>
          {cargos.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filtroPartido} onChange={e => setFiltroPartido(e.target.value)}>
          <option>Todos os partidos</option>
          {partidos.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filtroResultado} onChange={e => setFiltroResultado(e.target.value)}>
          <option>Todos os resultados</option>
          {resultados.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title="Nenhuma pessoa pendente"
          text={promovidos.length > 0 ? "Todas as pessoas foram importadas nesta sessão." : "Nenhuma pessoa encontrada com os filtros selecionados."}
          action={promovidos.length > 0 ? <button className="primary-button" onClick={restaurar}>Restaurar demo</button> : undefined}
        />
      ) : (
        <div className="tse-lista">
          {shown.map(pessoa => (
            <div key={pessoa.id} className="tse-item">
              <div className="tse-info">
                <Avatar initials={pessoa.nome.split(' ').slice(0, 2).map(n => n[0]).join('')} />
                <div>
                  <strong>{pessoa.nome}</strong>
                  <small>
                    <span className="tse-origem"><RefreshCw size={12} /> {pessoa.origem}</span>
                    <span>· {pessoa.municipio}</span>
                  </small>
                </div>
              </div>
              <div className="tse-dados">
                <span className="tse-cargo">{pessoa.cargo}</span>
                <span className="tse-partido">{pessoa.partido}</span>
                <span className="tse-ano">{pessoa.ano}</span>
              </div>
              <div className="tse-resultado">
                <Pill tone={pessoa.resultado.includes('Eleit') ? 'green' : 'neutral'}>
                  {pessoa.resultado}
                </Pill>
                <small>{pessoa.votos.toLocaleString('pt-BR')} votos</small>
              </div>
              <div className="tse-acoes">
                <button className="primary-button" onClick={() => promover(pessoa.id)}>
                  <Plus size={14} /> Promover a liderança
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {promovidos.length > 0 && (
        <p className="tse-rodape">
          <Check size={14} /> {promovidos.length === 1 ? '1 pessoa importada' : `${promovidos.length} pessoas importadas`} nesta sessão
        </p>
      )}
    </section>
  )
}

function LinkQueue(){
  const [resolvidos,setResolvidos]=useState<Record<number,string>>({})
  const fila=linkQueue.filter(item=>!resolvidos[item.id])
  return <section className="card"><div className="card-heading"><div><span className="eyebrow">Resolução humana</span><h2>Fila de vínculo de identidade</h2></div><Pill tone="amber">{fila.length} pendências</Pill></div>
    {fila.length===0?<EmptyState title="Fila zerada" text="Todos os pareamentos desta rodada foram resolvidos." action={<button className="primary-button" onClick={()=>setResolvidos({})}>Restaurar fila de demonstração</button>}/>:<div className="link-queue">{fila.map(item=>{const pessoa=electoralPeople.find(p=>p.id===item.personId)!; return <article key={item.id}>
      <div><Avatar initials={pessoa.initials}/><span><strong>{item.nacional}</strong><small>Base nacional</small></span></div>
      <Link2 size={20}/>
      <div><Avatar initials={pessoa.initials}/><span><strong>{item.local}</strong><small>Quadro Eleitoral · registro #{item.registro}</small></span></div>
      <div className="link-divergencias"><small>Divergências</small><div className="pill-row">{item.divergencias.map(d=><Pill key={d} tone="amber">{d}</Pill>)}</div></div>
      <label className="link-confianca"><small>Confiança {item.confianca}%</small><Progress value={item.confianca}/></label>
      <div className="link-acoes"><button className="primary-button" onClick={()=>setResolvidos(a=>({...a,[item.id]:'vinculado'}))}>Confirmar vínculo</button><button className="secondary-button" onClick={()=>setResolvidos(a=>({...a,[item.id]:'separado'}))}>Separar</button></div>
    </article>})}</div>}
    {Object.keys(resolvidos).length>0&&fila.length>0&&<p className="link-rodape"><Check size={14}/> {Object.keys(resolvidos).length===1?'1 pareamento resolvido':`${Object.keys(resolvidos).length} pareamentos resolvidos`} nesta sessão · decisão registrada em auditoria</p>}
  </section>}
function ElectionCatalog(){return <section className="card"><div className="card-heading"><div><span className="eyebrow">Catálogo</span><h2>Eleições e sincronizações</h2></div></div><div className="catalog-grid">{[['2026','Eleição geral fictícia','Preparação'],['2024','Eleição municipal fictícia','Concluída'],['2022','Eleição geral fictícia','Concluída']].map((x,i)=><article key={x[0]}><Vote size={22}/><strong>{x[1]}</strong><small>Escopo nacional · leiaute v{3-i}.0</small><Pill tone={i?'green':'blue'}>{x[2]}</Pill><div className="sync-meta"><RefreshCw size={14}/> última simulação há {i+1} dias</div></article>)}</div></section>}
function TerritoryCatalog(){return <section className="card"><div className="card-heading"><div><span className="eyebrow">Parametrizável</span><h2>Recortes territoriais</h2></div><button className="primary-button"><Plus size={15}/> Novo recorte</button></div><div className="territory-tree"><div><strong>Brasil fictício</strong><small>1 unidade</small></div><div className="level-2"><strong>Regiões estratégicas</strong><small>6 recortes próprios</small></div><div className="level-3"><strong>Municípios</strong><small>5.570 registros demonstrativos</small></div><div className="level-3"><strong>Zonas e bairros</strong><small>parametrização opcional</small></div></div></section>}

function AuditPanel(){return <section className="card"><div className="card-heading"><div><span className="eyebrow">Rastreabilidade</span><h2>Auditoria compreensível</h2></div><button className="filter-button"><Filter size={15}/> Filtrar</button></div><div className="audit-table"><div className="audit-head"><b>Ator</b><b>Campo</b><b>Antes</b><b>Depois</b><b>Data</b></div>{[['Sofia Linhares','Status','Monitorado','Contato prioritário','Hoje, 10:42'],['Breno Valadares','Território','Serra Clara','Serra Clara + Vale do Ipê','Ontem, 18:20'],['Rafael Guimar','Canal','Telefone','Assessoria','10 ago, 14:05']].map(r=><div key={r[4]}>{r.map((x,i)=><span key={i}>{i===3?<Pill tone="blue">{x}</Pill>:x}</span>)}</div>)}</div></section>}

function BemVindo({ navigate }: { navigate: Navigate }) {
  const { statusDe } = useAvaliacao()
  const { tenant } = useTenant()
  const hoje = aniversarios.filter(a => a.dia === 12)
  const atalhos = modulos.filter(m => ['quadro-eleitoral', 'municipios', 'eleicoes', 'painel', 'agenda', 'aniversarios'].includes(m.id) && tenant.ativos.includes(m.id))
  const semAvaliacao = electoralPeople.filter(p => statusDe(p.id) === 'Não avaliado').length
  return <>
    <PageHeader eyebrow="12 de agosto de 2026" title="Bem-vindo, Eduardo" description={`${tenant.nome} · dados inteiramente fictícios`} />
    <section className={`card faixa-datas ${hoje.length ? 'tem' : ''}`}><Cake size={18} /><div>{hoje.length ? <><strong>{hoje.length} data comemorativa hoje</strong><small>{hoje.map(h => h.nome).join(', ')}</small></> : <><strong>Nenhum aniversário ou data comemorativa hoje</strong><small>A próxima é dia 14, aniversário de Aline Campos Leal.</small></>}</div><button className="text-button" onClick={() => navigate('aniversarios')}>Ver o mês <ArrowRight size={14} /></button></section>
    <div className="atalhos-grid">{atalhos.map(m => { const Icon = iconesModulo[m.id] || CircleHelp; return <button className="card atalho" key={m.id} onClick={() => navigate(m.id)}><span><Icon size={20} /></span><div><strong>{m.label}</strong><small>{m.descricao}</small></div><ArrowRight size={16} /></button> })}</div>
    <section className="card"><div className="card-heading"><div><span className="eyebrow">Desde seu último acesso</span><h2>O que mudou</h2></div></div><div className="mudou-grid">
      <button onClick={() => navigate('quadro-eleitoral')}><strong>+38</strong><small>candidatos cadastrados</small></button>
      <button onClick={() => navigate('municipios')}><strong>+6</strong><small>dossiês municipais completados</small></button>
      <button onClick={() => navigate('quadro-eleitoral/pendentes')}><strong>{semAvaliacao}</strong><small>candidatos sem avaliação política</small></button>
    </div></section>
  </>
}

function Municipios({ navigate }: { navigate: Navigate }) {
  const { tenant } = useTenant()
  const [divisao, setDivisao] = useState('Todas')
  const [busca, setBusca] = useState('')
  const [soFavoritos, setSoFavoritos] = useState(false)
  const lista = municipios.filter(m => (divisao === 'Todas' || m.divisao === divisao) && m.nome.toLowerCase().includes(busca.toLowerCase()) && (!soFavoritos || m.favorito))
  const totalEleitores = municipios.reduce((soma, m) => soma + m.eleitores, 0)
  const consolidado = municipios.filter(m => m.completude >= 80).length
  const critico = municipios.filter(m => m.completude < 40).length
  return <>
    <PageHeader eyebrow="Análise" title="Municípios" description={`Dossiê por município: dados oficiais do IBGE e observações da equipe. ${tenant.divisaoTerritorial} é a divisão contratada.`} actions={<><button className="secondary-button"><RefreshCw size={16} /> Sincronizar IBGE</button><button className="primary-button"><Download size={16} /> Exportar</button></>} />
    <div className="metrics-grid five">
      <Metric label="Municípios" value={String(municipios.length)} delta="recorte contratado" icon={Building2} />
      <Metric label="Eleitores" value={totalEleitores.toLocaleString('pt-BR')} delta="total no recorte" icon={UsersRound} />
      <Metric label="Dossiê consolidado" value={String(consolidado)} delta="acima de 80%" icon={Check} tone="green" />
      <Metric label="Dossiê parcial" value={String(municipios.filter(m => m.completude >= 40 && m.completude < 80).length)} delta="entre 40% e 80%" icon={SlidersHorizontal} tone="amber" />
      <Metric label="Dossiê crítico" value={String(critico)} delta="abaixo de 40%" icon={AlertTriangle} onClick={() => setDivisao('Todas')} tone="red" />
    </div>
    <section className="card toolbar-card"><div className="search-field"><Search size={17} /><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar município" aria-label="Buscar município" /></div><select value={divisao} onChange={e => setDivisao(e.target.value)} aria-label={`Filtrar por ${tenant.divisaoTerritorial}`}><option>Todas</option>{divisoes.map(d => <option key={d.nome}>{d.nome}</option>)}</select><div className="segmented"><button className={!soFavoritos ? 'active' : ''} onClick={() => setSoFavoritos(false)}>Todos</button><button className={soFavoritos ? 'active' : ''} onClick={() => setSoFavoritos(true)}>Favoritos</button></div></section>
      {lista.length === 0 ? <EmptyState title="Nenhum município neste filtro" text="Ajuste a busca ou volte ao recorte completo." action={<button className="primary-button" onClick={() => { setBusca(''); setDivisao('Todas'); setSoFavoritos(false) }}>Limpar filtros</button>} /> : <div className="municipios-grid">{lista.map(m => <article className="card municipio-card" key={m.id}><div className="municipio-topo"><div><h3>{m.nome}</h3><small>Cód. {m.codigo} · {m.divisao}</small></div>{m.favorito && <Pill tone="amber">Favorito</Pill>}</div><div className="municipio-prefeito"><Avatar initials={m.prefeito.split(' ').slice(0, 2).map(n => n[0]).join('')} size="sm" /><span><strong>{m.prefeito}</strong><small>{m.partidoPrefeito}</small></span></div><div className="municipio-nums"><span><small>População</small><strong>{m.populacao.toLocaleString('pt-BR')}</strong></span><span><small>Eleitores</small><strong>{m.eleitores.toLocaleString('pt-BR')}</strong></span></div><label className="coverage-label"><span>Dossiê <strong>{m.completude}%</strong></span><Progress value={m.completude} /></label><button className="secondary-button full" onClick={() => navigate(`municipios/perfil/${m.id}`)}>Ver dossiê <ArrowRight size={15} /></button></article>)}</div>}
  </>
}

function MunicipioFicha({ id, navigate }: { id: string; navigate: Navigate }) {
  const { statusDe } = useAvaliacao()
  const { tenant } = useTenant()
  const m = municipios.find(x => x.id === id) || municipios[0]
  const indice = municipios.findIndex(x => x.id === m.id)
  const proximo = municipios[(indice + 1) % municipios.length]
  const pendentes = [
    !m.padroeira && { campo: 'Padroeira', porque: 'define a festa religiosa onde a presença rende mais' },
    !m.pistaPouso && { campo: 'Pistas de pouso próximas', porque: 'condiciona o deslocamento aéreo do ciclo' },
    m.completude < 90 && { campo: 'Observações políticas', porque: 'é o que orienta a abordagem local' },
  ].filter(Boolean) as { campo: string; porque: string }[]
  const [favorito, setFavorito] = useState(m.favorito || false)
  const [filtroCandidato, setFiltroCandidato] = useState('Todos')
  const [aba, setAba] = useState<'informacoes' | 'vereadores' | 'responsaveis' | 'festas'>('informacoes')
  const statusMunicipio = m.completude >= 80 ? 'consolidado' : m.completude >= 40 ? 'parcial' : 'crítico'
  const statusTone = statusMunicipio === 'consolidado' ? 'green' : statusMunicipio === 'parcial' ? 'amber' : 'red'
  const candidatosFiltrados = electoralPeople.filter(p => filtroCandidato === 'Todos' || statusDe(p.id) === filtroCandidato).slice(0, 6)

  // Dados específicos
  const festas = festasPorMunicipio[m.id] || []
  const responsaveis = responsaveisPorMunicipio[m.id] || []
  const vereadores = vereadoresPorMunicipio[m.id] || []

  const resultados = [
    { ano: 2024, candidatos: [{ nome: 'Roberto Alves', partido: 'MDB', votos: 15230, elegido: true }, { nome: 'Maria Santos', partido: 'PT', votos: 10100, elegido: false }, { nome: 'Carlos Lima', partido: 'PSDB', votos: 3900, elegido: false }] },
    { ano: 2022, candidatos: [{ nome: 'Roberto Alves', partido: 'MDB', votos: 14100, elegido: true }, { nome: 'Ana Paula', partido: 'PT', votos: 11200, elegido: false }] },
    { ano: 2020, candidatos: [{ nome: 'Roberto Alves', partido: 'MDB', votos: 12800, elegido: true }, { nome: 'João Silva', partido: 'PSD', votos: 9500, elegido: false }] },
  ]

  const abas = [
    { id: 'informacoes', label: 'Informações gerais' },
    { id: 'vereadores', label: 'Vereadores' },
    { id: 'responsaveis', label: 'Responsáveis' },
    { id: 'festas', label: 'Festas e eventos' },
  ] as const

  return <>
    <button className="back-button" onClick={() => navigate('municipios')}><ChevronLeft size={16} /> Voltar aos municípios</button>
    <section className="profile-hero card domain-hero territory"><div><span className="eyebrow">Dossiê municipal · Cód. {m.codigo}</span><h1>{m.nome} <Pill tone={statusTone}>{statusMunicipio}</Pill></h1><p>{m.divisao} · {m.distanciaCapital} km da capital</p></div><div className="hero-actions"><button className="secondary-button" onClick={() => navigate(`municipios/perfil/${proximo.id}`)}>Próximo município <ChevronRight size={15} /></button><button className={`secondary-button ${favorito ? 'active' : ''}`} onClick={() => setFavorito(!favorito)}><Star size={15} fill={favorito ? '#f59e0b' : 'none'} /></button><button className="secondary-button"><Download size={15} /> Exportar PDF</button><button className="primary-button"><Plus size={15} /> Editar dossiê</button></div></section>

    {/* Abas estilo K8s */}
    <nav className="municipio-abas" aria-label="Seções do município">
      {abas.map(a => <button key={a.id} className={aba === a.id ? 'active' : ''} onClick={() => setAba(a.id)}>{a.label}</button>)}
    </nav>

    {aba === 'informacoes' && <>
      <FaixaCompletude valor={m.completude} atualizadoPor="Sofia Linhares" quando="09 ago 2026" />
      <div className="detail-layout"><div className="detail-stack">
        <section className="card"><div className="card-heading"><div><span className="eyebrow">Origem oficial</span><h2>Dados do IBGE e do TSE</h2></div><Pill tone="blue"><ShieldCheck size={12} /> Sinc. 12/08/2026</Pill></div><div className="info-grid"><span><small>População</small><strong>{m.populacao.toLocaleString('pt-BR')}</strong></span><span><small>Número de eleitores</small><strong>{m.eleitores.toLocaleString('pt-BR')}</strong></span><span><small>{tenant.divisaoTerritorial}</small><strong>{m.divisao}</strong></span><span><small>Distância até a capital</small><strong>{m.distanciaCapital} km</strong></span><span><small>Prefeito(a)</small><strong>{m.prefeito} · {m.partidoPrefeito}</strong></span><span><small>Vice-prefeito(a)</small><strong>{m.vice}</strong></span></div></section>
        <section className="card"><div className="card-heading"><div><span className="eyebrow">Preenchido pela equipe</span><h2>Dados internos</h2></div><button className="icon-button" aria-label="Editar dados internos"><Plus size={16} /></button></div><div className="info-grid"><span><small>Aniversário da cidade</small><strong>{m.aniversario}</strong></span><span><small>Padroeira</small><strong className={m.padroeira ? '' : 'vazio'}>{m.padroeira || 'a preencher'}</strong></span><span><small>Pistas de pouso próximas</small><strong className={m.pistaPouso ? '' : 'vazio'}>{m.pistaPouso || 'a preencher'}</strong></span><span><small>Última observação</small><strong>Sofia Linhares · 09 ago</strong></span></div></section>
        <AccordionBlock title="Candidatos vinculados" icon={UsersRound} open>
          <div className="filter-row"><select value={filtroCandidato} onChange={e => setFiltroCandidato(e.target.value)}><option>Todos</option><option>Aliado</option><option>Aliado parcial</option><option>Neutro</option><option>Adversário</option><option>Não avaliado</option></select></div>
          <div className="vinculo-lista">{candidatosFiltrados.map(p => <button key={p.id} onClick={() => navigate(`quadro-eleitoral/perfil/${p.id}`)}><Avatar initials={p.initials} size="sm" /><span><strong>{p.name}</strong><small>{p.office}</small></span><StatusPill valor={statusDe(p.id)} /><ChevronRight size={15} /></button>)}</div>
        </AccordionBlock>
        <AccordionBlock title="Resultados das eleições" icon={Vote}>
          <div className="resultados-ano">{resultados.map(r => { const total = r.candidatos.reduce((s, x) => s + x.votos, 0); return <div key={r.ano} className="resultado-ano"><h4>{r.ano} <small>{total.toLocaleString('pt-BR')} votos</small></h4>{r.candidatos.map((c, i) => <div key={i} className="resultado-candidato"><span className="candidato-info"><strong>{c.nome}</strong><small>{c.partido}</small></span><span className="candidato-votos"><b>{c.votos.toLocaleString('pt-BR')} votos</b><small>{Math.round(c.votos / total * 100)}%</small></span><div className="barra-votos"><i style={{ width: `${c.votos / r.candidatos[0].votos * 100}%` }} className={c.elegido ? 'vencedor' : ''} /></div>{c.elegido && <Pill tone="green">Eleito</Pill>}</div>)}</div> })}</div>
        </AccordionBlock>
      </div><aside className="detail-aside"><BlocoCompletar pendentes={pendentes} /></aside></div>
    </>}

    {aba === 'vereadores' && <>
      <div className="detail-layout"><div className="detail-stack">
        <section className="card"><div className="card-heading"><div><span className="eyebrow">Vereadores</span><h2>Câmara Municipal de {m.nome}</h2></div><button className="primary-button"><Plus size={15} /> Adicionar vereador</button></div>
          {vereadores.length === 0 ? <EmptyState title="Nenhum vereador cadastrado" text="Adicione os vereadores eleitos para acompanhar a composição da câmara." action={<button className="primary-button">Adicionar vereador</button>} /> : <div className="table-card"><table><thead><tr><th>Vereador</th><th>Partido</th><th>Mandato</th><th>Situação</th></tr></thead><tbody>{vereadores.map((v, i) => <tr key={i}><td><strong>{v.nome}</strong></td><td>{v.partido}</td><td>{v.mandato}</td><td><Pill tone={v.situacao === 'titular' ? 'green' : 'amber'}>{v.situacao === 'titular' ? 'Titular' : 'Suplente'}</Pill></td></tr>)}</tbody></table></div>}
        </section>
      </div></div>
    </>}

    {aba === 'responsaveis' && <>
      <div className="detail-layout"><div className="detail-stack">
        <section className="card"><div className="card-heading"><div><span className="eyebrow">Responsáveis</span><h2>Pessoas vinculadas a {m.nome}</h2></div><button className="primary-button"><Plus size={15} /> Adicionar responsável</button></div>
          {responsaveis.length === 0 ? <EmptyState title="Nenhum responsável cadastrado" text="Adicione coordenadores e articuladores responsáveis por este município." action={<button className="primary-button">Adicionar responsável</button>} /> : <div className="responsaveis-lista">{responsaveis.map((r, i) => <div key={i} className="responsavel-card"><Avatar initials={r.nome.split(' ').map(n => n[0]).join('')} size="lg" /><div><strong>{r.nome}</strong><small>{r.funcao}</small><span>{r.telefone} · {r.email}</span></div><button className="icon-button"><MoreHorizontal size={17} /></button></div>)}</div>}
        </section>
      </div></div>
    </>}

    {aba === 'festas' && <>
      <div className="detail-layout"><div className="detail-stack">
        <section className="card"><div className="card-heading"><div><span className="eyebrow">Festas e Eventos</span><h2>Calendário de festividades de {m.nome}</h2></div><button className="primary-button"><Plus size={15} /> Adicionar festa</button></div>
          {festas.length === 0 ? <EmptyState title="Nenhuma festa cadastrada" text="Adicione as festas religiosas, cívicas e culturais do município." action={<button className="primary-button">Adicionar festa</button>} /> : <div className="festas-lista">{festas.map((f, i) => <div key={i} className="festa-card"><div className="festa-icon"><CalendarDays size={20} /></div><div><strong>{f.nome}</strong><span>{f.data}</span><Pill tone={f.tipo === 'religiosa' ? 'blue' : f.tipo === 'cívica' ? 'green' : 'amber'}>{f.tipo}</Pill></div></div>)}</div>}
        </section>
      </div></div>
    </>}
  </>
}

function FaixaCompletude({ valor, atualizadoPor, quando }: { valor: number; atualizadoPor: string; quando: string }) {
  return <section className="card faixa-completude"><div><span className="eyebrow">Completude do cadastro</span><strong>{valor}%</strong></div><Progress value={valor} /><small>Última atualização por {atualizadoPor} em {quando}</small></section>
}

/** Lacuna é tarefa, não estado do mundo: por isso vem agrupada e com o motivo de cada uma. */
function BlocoCompletar({ pendentes }: { pendentes: { campo: string; porque: string }[] }) {
  if (!pendentes.length) return <section className="card"><div className="card-heading"><div><span className="eyebrow">Cadastro</span><h2>Nada pendente</h2></div><Check size={18} /></div><p className="section-description">Todos os campos relevantes deste registro estão preenchidos.</p></section>
  return <section className="card bloco-completar"><div className="card-heading"><div><span className="eyebrow">Pendências</span><h2>Completar cadastro</h2></div><Pill tone="amber">{pendentes.length}</Pill></div><p className="section-description">O que falta, e por que cada campo importa para a estratégia.</p>{pendentes.map(p => <div key={p.campo}><strong>{p.campo}</strong><small>{p.porque}</small></div>)}<button className="primary-button full">Completar agora <ArrowRight size={15} /></button></section>
}

function Mesorregioes({ navigate }: { navigate: Navigate }) {
  const { tenant } = useTenant()
  const [busca, setBusca] = useState('')
  const lista = divisoes.filter(d => d.nome.toLowerCase().includes(busca.toLowerCase()))
  const totalMunicipios = municipios.length
  const totalEleitores = municipios.reduce((soma, m) => soma + m.eleitores, 0)
  const totalPopulacao = municipios.reduce((soma, m) => soma + m.populacao, 0)
  // Calcula completude média por divisão
  const divisoesComCompletude = divisoes.map((d, idx) => {
    const municipiosDaDivisao = municipios.filter(m => m.divisao === d.nome)
    const completudeMedia = municipiosDaDivisao.length > 0
      ? Math.round(municipiosDaDivisao.reduce((soma, m) => soma + m.completude, 0) / municipiosDaDivisao.length)
      : 0
    const municipiosConsolidados = municipiosDaDivisao.filter(m => m.completude >= 80).length
    return { ...d, completudeMedia, municipiosConsolidados, municipiosTotal: municipiosDaDivisao.length, municipios: municipiosDaDivisao, indice: idx + 1 }
  })
  return <>
    <PageHeader eyebrow="Análise" title="Mesorregiões" description={`Visão agregada por ${tenant.divisaoTerritorial}: municípios, cobertura e indicadores consolidados.`} actions={<><button className="secondary-button"><RefreshCw size={16} /> Sincronizar IBGE</button><button className="primary-button"><Download size={16} /> Exportar</button></>} />
    <div className="metrics-grid five">
      <Metric label="Mesorregiões" value={String(divisoes.length)} delta="divisões cadastradas" icon={Layers3} />
      <Metric label="Municípios" value={String(totalMunicipios)} delta="no recorte" icon={Building2} />
      <Metric label="Eleitores" value={totalEleitores.toLocaleString('pt-BR')} delta="total no recorte" icon={UsersRound} />
      <Metric label="População" value={totalPopulacao.toLocaleString('pt-BR')} delta="estimada IBGE" icon={Map} />
      <Metric label="Cobertura média" value={`${Math.round(divisoesComCompletude.reduce((s, d) => s + d.completudeMedia, 0) / divisoesComCompletude.length)}%`} delta="dossiês consolidados" icon={Check} tone="green" />
    </div>
    <section className="card toolbar-card"><div className="search-field"><Search size={17} /><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar mesorregião" aria-label="Buscar mesorregião" /></div></section>
    {lista.length === 0 ? <EmptyState title="Nenhuma mesorregião neste filtro" text="Ajuste a busca para voltar ao recorte completo." action={<button className="primary-button" onClick={() => setBusca('')}>Limpar busca</button>} /> : <div className="municipios-grid">{divisoesComCompletude.filter(d => d.nome.toLowerCase().includes(busca.toLowerCase())).map(d => <article className="card municipio-card" key={d.nome}><div className="municipio-topo"><div><h3>{d.nome}</h3><small>{d.municipiosTotal} município{d.municipiosTotal !== 1 ? 's' : ''}</small></div><Pill tone={d.completudeMedia >= 70 ? 'green' : d.completudeMedia >= 40 ? 'amber' : 'red'}>{d.completudeMedia}%</Pill></div><div className="municipio-nums"><span><small>População</small><strong>{d.populacao.toLocaleString('pt-BR')}</strong></span><span><small>Eleitores</small><strong>{d.eleitores.toLocaleString('pt-BR')}</strong></span></div><label className="coverage-label"><span>Cobertura <strong>{d.completudeMedia}%</strong></span><Progress value={d.completudeMedia} /></label><button className="secondary-button full" onClick={() => navigate(`mesorregioes/perfil/${encodeURIComponent(d.nome)}`)}>Ver detalhe <ArrowRight size={15} /></button></article>)}</div>}
  </>
}

function MesorregiaoProfile({ id, navigate }: { id: string; navigate: Navigate }) {
  const { tenant } = useTenant()
  const decodeId = decodeURIComponent(id)
  const meso = divisoes.find(d => d.nome === decodeId) || divisoes[0]
  const municipiosDaDivisao = municipios.filter(m => m.divisao === decodeId)
  const completudeMedia = municipiosDaDivisao.length > 0
    ? Math.round(municipiosDaDivisao.reduce((soma, m) => soma + m.completude, 0) / municipiosDaDivisao.length)
    : 0
  const consolidado = municipiosDaDivisao.filter(m => m.completude >= 80).length
  const critico = municipiosDaDivisao.filter(m => m.completude < 40).length
  return <>
    <button className="back-button" onClick={() => navigate('mesorregioes')}><ChevronLeft size={16} /> Voltar às mesorregiões</button>
    <section className="profile-hero card domain-hero territory"><div><span className="eyebrow">{tenant.divisaoTerritorial}</span><h1>{decodeId}</h1><p>{municipiosDaDivisao.length} município{municipiosDaDivisao.length !== 1 ? 's' : ''} · {meso.populacao.toLocaleString('pt-BR')} habitantes</p><div className="pill-row"><Pill tone={completudeMedia >= 70 ? 'green' : completudeMedia >= 40 ? 'amber' : 'red'}>Cobertura {completudeMedia}%</Pill></div></div><div className="hero-actions"><button className="secondary-button"><Download size={15} /> Exportar</button><button className="primary-button"><Plus size={15} /> Editar</button></div></section>
    <FaixaCompletude valor={completudeMedia} atualizadoPor="Sofia Linhares" quando="09 ago 2026" />
    <div className="metrics-grid five">
      <Metric label="Municípios" value={String(municipiosDaDivisao.length)} delta="nesta divisão" icon={Building2} />
      <Metric label="Eleitores" value={meso.eleitores.toLocaleString('pt-BR')} delta="total na divisão" icon={UsersRound} />
      <Metric label="População" value={meso.populacao.toLocaleString('pt-BR')} delta="total na divisão" icon={UsersRound} />
      <Metric label="Consolidados" value={String(consolidado)} delta="acima de 80%" icon={Check} tone="green" />
      <Metric label="Críticos" value={String(critico)} delta="abaixo de 40%" icon={AlertTriangle} tone="red" />
    </div>
    <section className="card"><div className="card-heading"><div><span className="eyebrow">Municípios desta {tenant.divisaoTerritorial}</span><h2>Lista consolidada</h2></div></div><div className="municipios-grid">{municipiosDaDivisao.map(m => <article className="card municipio-card" key={m.id}><div className="municipio-topo"><div><h3>{m.nome}</h3><small>Cód. {m.codigo}</small></div><Pill tone={m.completude >= 80 ? 'green' : m.completude >= 40 ? 'amber' : 'red'}>{m.completude}%</Pill></div><div className="municipio-nums"><span><small>População</small><strong>{m.populacao.toLocaleString('pt-BR')}</strong></span><span><small>Eleitores</small><strong>{m.eleitores.toLocaleString('pt-BR')}</strong></span></div><label className="coverage-label"><span>Dossiê <strong>{m.completude}%</strong></span><Progress value={m.completude} /></label><button className="secondary-button full" onClick={() => navigate(`municipios/perfil/${m.id}`)}>Ver dossiê <ArrowRight size={15} /></button></article>)}</div></section>
  </>
}

function Eleicoes() {
  const [aberto, setAberto] = useState(0)
  return <>
    <PageHeader eyebrow="Análise" title="Eleições" description="Apuração e resultados por cargo, turno e município — simulação sobre dados fictícios." actions={<button className="secondary-button"><RefreshCw size={16} /> Sincronizar TSE</button>} />
    <section className="card apuracao-faixa"><div><span className="eyebrow">Recorte contratado</span><h2>Estado fictício do Horizonte</h2><Pill tone="green"><Check size={12} /> Dados atualizados</Pill></div></section>
    <div className="metrics-grid three">
      <Metric label="Municípios apurados" value={String(municipios.length)} delta="recorte contratado" icon={Building2} />
      <Metric label="Eleitores" value={apuracao.eleitores.toLocaleString('pt-BR')} delta="total no recorte" icon={UsersRound} />
      <Metric label="Urnas apuradas" value={`${apuracao.apuradas}%`} delta="apurados" icon={Check} tone="green" />
    </div>
    <section className="card report-filters"><select aria-label="Ano"><option>2026</option><option>2024</option></select><select aria-label="Cargo"><option>Todos os cargos</option><option>Governador</option><option>Prefeito</option></select><select aria-label="Turno"><option>Todos os turnos</option><option>1º turno</option><option>2º turno</option></select><select aria-label="Município"><option>Todos os municípios</option>{municipios.map(m => <option key={m.id}>{m.nome}</option>)}</select><button className="filter-button"><Filter size={15} /> Aplicar</button></section>
    {apuracao.cargos.map((c, i) => <section className="card cargo-bloco" key={c.cargo}><button className="cargo-cabeca" onClick={() => setAberto(aberto === i ? -1 : i)}><span><Vote size={17} /> {c.cargo}</span><ChevronDown size={17} className={aberto === i ? 'open' : ''} /></button>{aberto === i && <div className="turnos-grid">{c.turnos.map(t => <div key={t.turno}><div className="turno-cabeca"><strong>{t.turno}</strong><Pill tone="green">{t.apurado}% apurado</Pill></div>{t.nomes.map(n => <div className="candidato-linha" key={n.nome}><Avatar initials={n.nome.split(' ').slice(0, 2).map(x => x[0]).join('')} size="sm" /><span><strong>{n.nome}</strong><small>{n.partido}</small></span><Pill tone={n.eleito ? 'green' : 'neutral'}>{n.eleito ? 'Eleito' : 'Não eleito'}</Pill><b>{n.pct.toLocaleString('pt-BR')}%</b><small>{n.votos.toLocaleString('pt-BR')} votos</small><Progress value={n.pct} /></div>)}</div>)}</div>}</section>)}
  </>
}

function AgendaModulo({ navigate }: { navigate: Navigate }) {
  const [visao, setVisao] = useState<'dia' | 'mes' | 'ano' | 'lista' | 'rota'>('mes')
  const [mes, setMes] = useState('2026-08')
  const [dia, setDia] = useState('2026-08-14')
  const [tipo, setTipo] = useState<'Todos' | TipoCompromisso>('Todos')
  const [aberto, setAberto] = useState<Compromisso | null>(null)
  const ano = Number(mes.slice(0, 4)), mesNum = Number(mes.slice(5))
  const filtra = (lista: Compromisso[]) => tipo === 'Todos' ? lista : lista.filter(c => c.tipo === tipo)
  const doMes = filtra(compromissosDoMes(ano, mesNum))
  const abertos = encaminhamentosAbertos()
  const atrasados = abertos.filter(e => e.situacao === 'Atrasado')
  const totalKm = rota.paradas.reduce((s, p) => s + p.km, 0)
  const visoes = [['dia', 'Dia'], ['mes', 'Mês'], ['ano', 'Ano'], ['lista', 'Listagem'], ['rota', 'Rota de viagem']] as const

  return <>
    <PageHeader eyebrow="Análise" title="Agenda" description="Viagens, visitas, reuniões e entrevistas num só lugar. Reunião é um tipo de compromisso, não um módulo à parte — e qualquer tipo pode gerar encaminhamento com dono e prazo." actions={<button className="primary-button"><Plus size={16} /> Novo compromisso</button>} />

    <div className="metrics-grid">
      <Metric label="Compromissos no mês" value={String(doMes.length)} delta={tipo === 'Todos' ? 'todos os tipos' : `só ${tipo.toLowerCase()}`} icon={CalendarDays} />
      <Metric label="Encaminhamentos abertos" value={String(abertos.length)} delta="com dono definido" icon={Target} onClick={() => setVisao('lista')} />
      <Metric label="Em atraso" value={String(atrasados.length)} delta="pedem cobrança" icon={AlertTriangle} onClick={() => setVisao('lista')} />
      <Metric label="Quilometragem da rota" value={`${totalKm} km`} delta={`${rota.paradas.length} paradas`} icon={Route} onClick={() => setVisao('rota')} />
    </div>

    <section className="card agenda-controles">
      <div className="segmented" role="tablist" aria-label="Visão da agenda">{visoes.map(([id, rotulo]) => <button key={id} role="tab" aria-selected={visao === id} className={visao === id ? 'active' : ''} onClick={() => setVisao(id)}>{rotulo}</button>)}</div>
      {visao !== 'rota' && <div className="filtros-tipo">
        <button className={`chip-tipo ${tipo === 'Todos' ? 'ativo' : ''}`} onClick={() => setTipo('Todos')}>Todos</button>
        {tiposCompromisso.map(t => <button key={t} className={`chip-tipo tipo-${t.toLowerCase().replace('ã', 'a')} ${tipo === t ? 'ativo' : ''}`} onClick={() => setTipo(t)}>{t}</button>)}
      </div>}
      {(visao === 'mes' || visao === 'lista') && <select value={mes} onChange={e => setMes(e.target.value)} aria-label="Mês exibido"><option value="2026-08">Agosto 2026</option><option value="2026-09">Setembro 2026</option></select>}
      {visao === 'dia' && <input type="date" value={dia} onChange={e => setDia(e.target.value)} aria-label="Dia exibido" />}
      {visao === 'ano' && <select value={ano} aria-label="Ano exibido" onChange={e => setMes(`${e.target.value}-08`)}><option>2026</option></select>}
    </section>

    {visao === 'dia' && <AgendaDia iso={dia} tipo={tipo} aoAbrir={setAberto} />}
    {visao === 'mes' && <AgendaMes ano={ano} mes={mesNum} itens={doMes} aoAbrir={setAberto} />}
    {visao === 'ano' && <AgendaAno ano={ano} aoEscolherMes={m => { setMes(`${ano}-${String(m).padStart(2, '0')}`); setVisao('mes') }} />}
    {visao === 'lista' && <AgendaLista itens={doMes} aoAbrir={setAberto} />}
    {visao === 'rota' && <AgendaRota navigate={navigate} total={totalKm} />}

    {aberto && <Modal title={aberto.titulo} description={`${aberto.tipo} · ${aberto.hora} · ${aberto.municipio}`} onClose={() => setAberto(null)}>
      <div className="event-detail">
        <div className="pill-row"><Pill tone={aberto.situacao === 'Cumprido' ? 'green' : aberto.situacao === 'Descumprido' ? 'red' : 'blue'}>{aberto.situacao}</Pill><Pill tone="neutral">{aberto.tipo}</Pill>{aberto.vinculo && <Pill tone="purple">{aberto.vinculo}</Pill>}</div>
        <div className="info-grid"><span><small>Responsável</small><strong>{aberto.responsavel}</strong></span><span><small>Participantes</small><strong>{aberto.participantes}</strong></span></div>
        {!!aberto.pauta?.length && <div><small className="rotulo-bloco">Pauta</small><ol className="pauta-lista">{aberto.pauta.map(p => <li key={p}>{p}</li>)}</ol></div>}
        <div>
          <small className="rotulo-bloco">Encaminhamentos</small>
          {aberto.encaminhamentos.length === 0
            ? <div className="muted-box">Nada registrado. {aberto.situacao === 'Marcado' ? 'Encaminhamento se registra durante ou depois do compromisso.' : 'Um compromisso cumprido sem encaminhamento costuma indicar registro incompleto.'}</div>
            : <div className="encaminhamentos">{aberto.encaminhamentos.map(e => <div key={e.texto}><span className={`enc-dot ${e.situacao === 'Atrasado' ? 'atraso' : e.situacao === 'Concluído' ? 'ok' : ''}`} /><div><strong>{e.texto}</strong><small>{e.dono} · prazo {e.prazo}</small></div><Pill tone={e.situacao === 'Atrasado' ? 'red' : e.situacao === 'Concluído' ? 'green' : 'blue'}>{e.situacao}</Pill></div>)}</div>}
        </div>
      </div>
    </Modal>}
  </>
}

function AgendaDia({ iso, tipo, aoAbrir }: { iso: string; tipo: string; aoAbrir: (c: Compromisso) => void }) {
  const itens = compromissosDoDia(iso).filter(c => tipo === 'Todos' || c.tipo === tipo)
  const data = new Date(`${iso}T12:00:00`)
  const extenso = data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  if (!itens.length) return <EmptyState title={`Nada marcado em ${extenso}`} text="Dia livre. Aniversários do mês podem sugerir onde vale estar presente." action={<button className="primary-button" onClick={() => go('aniversarios')}>Ver aniversários do mês</button>} />
  return <section className="card"><div className="card-heading"><div><span className="eyebrow">{extenso}</span><h2>{itens.length} compromisso{itens.length > 1 ? 's' : ''}</h2></div></div>
    <div className="dia-linha">{itens.map(c => <button key={c.id} onClick={() => aoAbrir(c)}><time>{c.hora}</time><span className={`marca-tipo tipo-${c.tipo.toLowerCase().replace('ã', 'a')}`} /><div><strong>{c.titulo}</strong><small>{c.municipio} · {c.responsavel}</small></div><Pill tone={c.situacao === 'Cumprido' ? 'green' : c.situacao === 'Descumprido' ? 'red' : 'blue'}>{c.situacao}</Pill>{!!c.encaminhamentos.length && <Pill tone="amber">{c.encaminhamentos.length} encam.</Pill>}<ChevronRight size={15} /></button>)}</div></section>
}

function AgendaMes({ ano, mes, itens, aoAbrir }: { ano: number; mes: number; itens: Compromisso[]; aoAbrir: (c: Compromisso) => void }) {
  return <div className="calendar-grid">
    {weekdays.map(n => <div className="calendar-weekday" key={n}>{n}</div>)}
    {monthCells(ano, mes).map((d, i) => {
      if (!d) return <div className="calendar-cell empty" key={i} />
      const iso = `${ano}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const doDia = itens.filter(c => c.data === iso)
      return <div className="calendar-cell" key={i}><small>{d}</small>{doDia.map(c => <button key={c.id} className={`event tipo-${c.tipo.toLowerCase().replace('ã', 'a')}`} onClick={() => aoAbrir(c)}><b>{c.hora} · {c.tipo}</b>{c.titulo}</button>)}</div>
    })}
  </div>
}

function AgendaAno({ ano, aoEscolherMes }: { ano: number; aoEscolherMes: (m: number) => void }) {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return <div className="year-grid">{meses.map((m, i) => {
    const doMes = compromissosDoMes(ano, i + 1)
    const porTipo = tiposCompromisso.map(t => ({ t, n: doMes.filter(c => c.tipo === t).length })).filter(x => x.n)
    return <button key={m} onClick={() => aoEscolherMes(i + 1)}><strong>{m}</strong><span>{doMes.length ? `${doMes.length} compromisso${doMes.length > 1 ? 's' : ''}` : 'sem registro'}</span><div className="ano-barras">{porTipo.map(x => <i key={x.t} className={`tipo-${x.t.toLowerCase().replace('ã', 'a')}`} style={{ flexGrow: x.n }} />)}</div></button>
  })}</div>
}

function AgendaLista({ itens, aoAbrir }: { itens: Compromisso[]; aoAbrir: (c: Compromisso) => void }) {
  if (!itens.length) return <EmptyState title="Nenhum compromisso neste filtro" text="Troque o tipo ou o mês para ver outros registros." />
  return <div className="table-card"><table><thead><tr><th>Tipo</th><th>Quando</th><th>Compromisso</th><th>Município</th><th>Responsável</th><th>Encaminhamentos</th><th>Situação</th></tr></thead><tbody>{itens.map(c => <tr key={c.id} onClick={() => aoAbrir(c)}>
    <td><span className={`marca-tipo tipo-${c.tipo.toLowerCase().replace('ã', 'a')}`} /> {c.tipo}</td>
    <td><strong>{c.data.slice(8)}/{c.data.slice(5, 7)}</strong><small>{c.hora}</small></td>
    <td><strong>{c.titulo}</strong>{c.vinculo && <small>ligado a {c.vinculo}</small>}</td>
    <td>{c.municipio}</td><td>{c.responsavel}</td>
    <td>{c.encaminhamentos.length ? <Pill tone={c.encaminhamentos.some(e => e.situacao === 'Atrasado') ? 'red' : 'amber'}>{c.encaminhamentos.length}</Pill> : <span className="muted">—</span>}</td>
    <td><Pill tone={c.situacao === 'Cumprido' ? 'green' : c.situacao === 'Descumprido' ? 'red' : 'blue'}>{c.situacao}</Pill></td>
  </tr>)}</tbody></table></div>
}

function AgendaRota({ navigate, total }: { navigate: Navigate; total: number }) {
  return <div className="rota-layout">
    <section className="card"><div className="card-heading"><div><span className="eyebrow">{rota.nome}</span><h2>Paradas na ordem do trajeto</h2></div><Pill tone="blue">{total} km</Pill></div><div className="rota-lista">{rota.paradas.map((p, i) => <div key={p.ordem}><span className="rota-num">{p.ordem}</span><div><strong>{p.municipio}</strong><small>{p.data} · {p.tipo}</small></div>{p.pista && <Pill tone="purple">Pista próxima</Pill>}{i > 0 && <b>{p.km} km</b>}</div>)}</div><button className="secondary-button full"><Plus size={15} /> Adicionar parada</button></section>
    <section className="card"><div className="card-heading"><div><span className="eyebrow">Trajeto</span><h2>Mapa da rota</h2></div><button className="text-button" onClick={() => navigate('municipios')}>Ver municípios <ArrowRight size={14} /></button></div><svg className="rota-mapa" viewBox="0 0 400 300" role="img" aria-label="Trajeto abstrato entre os municípios da rota"><path d="M60 240 L150 170 L250 200 L330 90" /><g>{[[60, 240], [150, 170], [250, 200], [330, 90]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="15" /><text x={x} y={y + 5} textAnchor="middle">{i + 1}</text></g>)}</g></svg><p className="map-hint"><Info size={14} /> Trajeto ponto a ponto na ordem das paradas. Polígonos e distâncias são demonstrativos.</p></section>
  </div>
}

function Aniversarios({ navigate }: { navigate: Navigate }) {
  const [categoria, setCategoria] = useState('Todas')
  const lista = aniversarios.filter(a => categoria === 'Todas' || a.categoria === categoria)
  const dias = [...new Set(lista.map(a => a.dia))].sort((a, b) => a - b)
  return <>
    <PageHeader eyebrow="Análise" title="Aniversários" description="Datas de candidatos, municípios e padroeiras — e a presença que cada uma pode gerar." actions={<button className="secondary-button"><Download size={16} /> Exportar PDF</button>} />
    <div className="metrics-grid three"><Metric label="Datas no mês" value={String(aniversarios.length)} delta="agosto de 2026" icon={Cake} /><Metric label="Com presença agendada" value={String(aniversarios.filter(a => a.agendado).length)} delta="já na agenda" icon={Check} /><Metric label="Sem agendamento" value={String(aniversarios.filter(a => !a.agendado).length)} delta="oportunidade aberta" icon={AlertTriangle} /></div>
    <section className="card toolbar-card"><select value={categoria} onChange={e => setCategoria(e.target.value)} aria-label="Categoria"><option>Todas</option><option>Candidato</option><option>Município</option><option>Padroeira</option></select><select aria-label="Mês"><option>Agosto 2026</option><option>Setembro 2026</option></select></section>
    <div className="aniversarios-lista">{dias.map(dia => <section className="card" key={dia}><div className="dia-selo">Dia {dia}</div><div className="dia-eventos">{lista.filter(a => a.dia === dia).map(a => <div key={a.nome}><Pill tone={a.categoria === 'Candidato' ? 'blue' : a.categoria === 'Padroeira' ? 'purple' : 'neutral'}>{a.categoria}</Pill><div><strong>{a.nome}</strong><small>{a.detalhe}</small></div>{a.agendado ? <Pill tone="green"><Check size={12} /> Presença agendada</Pill> : <button className="secondary-button" onClick={() => navigate('agenda')}><CalendarDays size={14} /> Agendar presença</button>}</div>)}</div></section>)}</div>
  </>
}

function PrestacaoContas() {
  const [filtro, setFiltro] = useState('Todos')
  const [ordem, setOrdem] = useState<'data' | 'descricao' | 'categoria' | 'campanha' | 'documento' | 'situacao' | 'valor'>('data')
  const [direcao, setDirecao] = useState<'asc' | 'desc'>('desc')
  const lista = contas.lancamentos.filter(l => filtro === 'Todos' || l.situacao === filtro).sort((a, b) => {
    const cmp = ordem === 'data' ? a.data.localeCompare(b.data) : ordem === 'valor' ? a.valor - b.valor : ordem === 'categoria' ? a.categoria.localeCompare(b.categoria) : ordem === 'campanha' ? a.campanha.localeCompare(b.campanha) : ordem === 'documento' ? (a.documento ? 1 : 0) - (b.documento ? 1 : 0) : ordem === 'situacao' ? a.situacao.localeCompare(b.situacao) : a.descricao.localeCompare(b.descricao)
    return direcao === 'asc' ? cmp : -cmp
  })
  const semDoc = contas.lancamentos.filter(l => !l.documento).length
  const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
  const ordena = (col: 'data' | 'descricao' | 'categoria' | 'campanha' | 'documento' | 'situacao' | 'valor') => { setOrdem(col); setDirecao(d => d === 'asc' ? 'desc' : 'asc') }
  return <>
    <PageHeader eyebrow="Gestão" title="Prestação de contas" description={`Receitas, despesas e documentos do ${contas.periodo}. Valores fictícios, sem vínculo com qualquer prestação real.`} actions={<><button className="secondary-button"><Download size={16} /> Exportar</button><button className="primary-button"><Plus size={16} /> Novo lançamento</button></>} />
    <div className="source-warning"><AlertTriangle size={18} /><div><strong>Demonstração</strong><p>Esta tela não substitui o sistema oficial de prestação de contas eleitorais nem gera peça contábil válida.</p></div></div>
    <div className="metrics-grid"><Metric label="Receitas" value={brl(contas.receitas)} delta="no período" icon={TrendingUp} /><Metric label="Despesas" value={brl(contas.despesas)} delta="no período" icon={Receipt} /><Metric label="Saldo" value={brl(contas.saldo)} delta="disponível" icon={Sigma} /><Metric label="Sem comprovante" value={String(semDoc)} delta="bloqueiam o fechamento" icon={Paperclip} onClick={() => setFiltro('Sem comprovante')} /></div>
    <section className="card toolbar-card"><div className="segmented">{['Todos', 'Conferido', 'Em conferência', 'Sem comprovante'].map(v => <button key={v} className={filtro === v ? 'active' : ''} onClick={() => setFiltro(v)}>{v}</button>)}</div></section>
    {lista.length === 0 ? <EmptyState title="Nada neste filtro" text="Nenhum lançamento com essa situação no período." action={<button className="primary-button" onClick={() => setFiltro('Todos')}>Ver todos</button>} /> : <div className="table-card"><table><thead><tr><th onClick={() => ordena('data')} style={{cursor:'pointer'}}>Data {ordem === 'data' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('descricao')} style={{cursor:'pointer'}}>Descrição {ordem === 'descricao' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('categoria')} style={{cursor:'pointer'}}>Categoria {ordem === 'categoria' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('campanha')} style={{cursor:'pointer'}}>Campanha {ordem === 'campanha' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('documento')} style={{cursor:'pointer'}}>Documento {ordem === 'documento' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('situacao')} style={{cursor:'pointer'}}>Situação {ordem === 'situacao' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th><th onClick={() => ordena('valor')} style={{cursor:'pointer'}}>Valor {ordem === 'valor' ? (direcao === 'asc' ? '↑' : '↓') : ''}</th></tr></thead><tbody>{lista.map(l => <tr key={l.id}><td>{l.data}</td><td><strong>{l.descricao}</strong></td><td>{l.categoria}</td><td>{l.campanha}</td><td>{l.documento ? <Pill tone="green"><Paperclip size={11} /> Anexado</Pill> : <Pill tone="red">Faltando</Pill>}</td><td><Pill tone={l.situacao === 'Conferido' ? 'green' : l.situacao === 'Sem comprovante' ? 'red' : 'amber'}>{l.situacao}</Pill></td><td className={l.valor < 0 ? 'valor-neg' : 'valor-pos'}>{brl(l.valor)}</td></tr>)}</tbody></table></div>}
  </>
}

function Cruzamento() {
  const [ativo, setAtivo] = useState(0)
  const [pergunta, setPergunta] = useState('')
  const c = cruzamentos[ativo]
  return <>
    <PageHeader eyebrow="Análise" title="Cruzamento de dados" description="Perguntas em linguagem natural sobre as bases do sistema. A resposta sempre declara de onde saiu." actions={<Pill tone="purple"><Sparkles size={12} /> Camada derivada</Pill>} />
    <section className="card cruzamento-caixa"><Workflow size={20} /><form onSubmit={e => { e.preventDefault(); setAtivo(0) }}><input value={pergunta} onChange={e => setPergunta(e.target.value)} placeholder="Pergunte sobre candidatos, municípios, agenda ou eleições" aria-label="Pergunta para cruzamento" /><button className="primary-button">Cruzar</button></form></section>
    <div className="sugestoes-wrap"><span className="sugestoes-label">Experimente perguntar:</span><div className="sugestoes-row">{sugestoesCruzamento.map((s, i) => <button key={s} className="sugestao" onClick={() => { setPergunta(s); setAtivo(i % cruzamentos.length) }}>{s}</button>)}</div></div>
    <section className="card resposta-card"><div className="card-heading"><div><span className="eyebrow">Pergunta</span><h2>{c.pergunta}</h2></div><Pill tone={c.confianca === 'Alta' ? 'green' : 'amber'}>Confiança {c.confianca.toLowerCase()}</Pill></div>
      <p className="resposta-texto">{c.resposta}</p>
      <div className="table-card"><table><thead><tr><th>Município</th><th>Presença</th><th>Lacuna</th></tr></thead><tbody>{c.linhas.map(l => <tr key={l[0]}><td><strong>{l[0]}</strong></td><td>{l[1]}</td><td>{l[2]}</td></tr>)}</tbody></table></div>
      <div className="procedencia"><ShieldCheck size={16} /><div><strong>De onde saiu esta resposta</strong><p>Cruzamento de {c.registros.toLocaleString('pt-BR')} registros das bases {c.bases.join(', ')}. Nenhum modelo externo foi consultado e nenhuma decisão é tomada automaticamente — a leitura é sua.</p></div></div>
    </section>
  </>
}

function Exportacoes() {
  const [modulo, setModulo] = useState('')
  const [periodo, setPeriodo] = useState('todos')
  // O produto real gera o arquivo em segundo plano. Uma barra que anda torna isso crível —
  // e deixa visível que "Baixar" só aparece quando termina.
  const [progresso, setProgresso] = useState(38)
  const registros = modulo ? Math.floor(Math.random() * 5000) + 500 : 0
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setProgresso(p => (p >= 96 ? 38 : p + 2)), 700)
    return () => clearInterval(t)
  }, [])
  return <>
    <PageHeader eyebrow="Análise" title="Exportações" description="Extração em massa por módulo, seção e campo. Este módulo se chamava Dados — o nome não dizia o que ele faz." />
    <section className="card"><div className="card-heading"><div><span className="eyebrow">Nova exportação</span><h2>Filtros da extração</h2></div></div>
      <div className="form-grid"><label>Módulo <span className="obrigatorio">(obrigatório)</span><select value={modulo} onChange={e => setModulo(e.target.value)}><option value="">Selecione um módulo</option>{modulos.map(m => <option key={m.id}>{m.label}</option>)}</select></label><label>Seções<select disabled={!modulo}><option>Todas as seções</option></select></label><label>Campos<select disabled={!modulo}><option>Todos os campos</option></select></label><label>Formato<select><option>Planilha (XLSX)</option><option>PDF</option></select></label><label>Período<select value={periodo} onChange={e => setPeriodo(e.target.value)}><option value="todos">Todo o período</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="ano">Ano atual</option></select></label></div>
      <p className="section-description">Deixar seções e campos em branco exporta tudo. O arquivo é gerado em segundo plano — você é avisado quando ficar pronto.</p>
      {modulo && <p className="registros-count"><strong>{registros.toLocaleString('pt-BR')}</strong> registros serão exportados</p>}
      <button className="primary-button" disabled={!modulo}><Download size={16} /> Exportar</button></section>
    <section className="card"><div className="card-heading"><div><span className="eyebrow">Histórico</span><h2>Minhas exportações</h2></div></div><div className="table-card"><table><thead><tr><th>Solicitado</th><th>Usuário</th><th>Módulo</th><th>Formato</th><th>Situação</th><th>Tamanho</th><th><span className="sr-only">Ação</span></th></tr></thead><tbody>{exportacoes.map(e => <tr key={e.id}><td>{e.solicitado}</td><td>{e.usuario}</td><td>{e.modulo}</td><td>{e.formato}</td><td>{e.situacao === 'Processando' ? <div className="proc"><Pill tone="blue"><RefreshCw size={11} className="spin" /> Processando</Pill><Progress value={progresso} label={`${progresso}%`} /></div> : <Pill tone={e.situacao === 'Concluído' ? 'green' : 'neutral'}>{e.situacao}</Pill>}</td><td>{e.tamanho}</td><td>{e.situacao === 'Concluído' ? <button className="text-button"><Download size={14} /> Baixar</button> : e.situacao === 'Expirado' ? <small>arquivo expirou em 7 dias</small> : <small>—</small>}</td></tr>)}</tbody></table></div></section>
  </>
}

/** Onde o contrato do cliente é editado — a tela que transforma o sistema em produto. */
function PlanosModulos() {
  const { tenant, setTenant } = useTenant()
  const alterna = (id: string) => setTenant({ ...tenant, ativos: tenant.ativos.includes(id) ? tenant.ativos.filter(x => x !== id) : [...tenant.ativos, id] })
  const trocarPlano = (plano: Plano) => setTenant({ ...tenant, plano, ativos: modulos.filter(m => moduloIncluso(m, plano) || m.obrigatorio).map(m => m.id) })
  return <>
    <div className="planos-grid">{planos.map(p => <button key={p.id} className={`card plano-card ${tenant.plano === p.id ? 'ativo' : ''}`} onClick={() => trocarPlano(p.id)}><div className="plano-topo"><h3>{p.nome}</h3>{tenant.plano === p.id && <Pill tone="green"><Check size={12} /> Contratado</Pill>}</div><p>{p.resumo}</p><strong className="plano-preco">{p.preco}</strong><small>{modulos.filter(m => moduloIncluso(m, p.id)).length} módulos inclusos</small></button>)}</div>
    <section className="card"><div className="card-heading"><div><span className="eyebrow">Contrato</span><h2>Módulos habilitados</h2></div><Pill tone="blue">{tenant.ativos.length} de {modulos.length}</Pill></div>
      <p className="section-description">Desligar um módulo o remove do menu deste cliente. Módulos fora do plano continuam visíveis aqui, com o plano que os inclui.</p>
      {gruposOrdem.map(grupo => <div className="modulo-grupo" key={grupo}><span className="eyebrow">{grupo}</span>{modulos.filter(m => m.grupo === grupo).map(m => { const incluso = moduloIncluso(m, tenant.plano); const Icon = iconesModulo[m.id] || CircleHelp; return <label key={m.id} className={`modulo-linha ${incluso ? '' : 'fora'}`}><span className="modulo-icone"><Icon size={17} /></span><div><strong>{m.label}</strong><small>{m.descricao}</small></div>{m.obrigatorio ? <Pill>Núcleo</Pill> : !incluso ? <Pill tone="amber">Plano {planos.find(p => p.id === m.plano)?.nome}</Pill> : <input type="checkbox" checked={tenant.ativos.includes(m.id)} onChange={() => alterna(m.id)} aria-label={`Habilitar ${m.label}`} />}</label> })}</div>)}
    </section>
  </>
}

function VocabularioStatus() {
  const { tenant } = useTenant()
  return <section className="card"><div className="card-heading"><div><span className="eyebrow">Vocabulário do cliente</span><h2>Escala de status político</h2></div><button className="secondary-button"><Plus size={15} /> Novo valor</button></div>
    <p className="section-description">A régua com que a equipe classifica pessoas é do cliente, não do produto. "Não avaliado" é lacuna e fica fora da distribuição de resultado.</p>
    <div className="escala-lista">{tenant.escalaStatus.map(s => <div key={s.valor}><Pill tone={s.tom === 'pendente' ? 'neutral' : s.tom}>{s.valor}</Pill><small>{s.descricao}</small>{s.tom === 'pendente' && <Pill tone="amber">lacuna</Pill>}</div>)}</div>
    <div className="info-grid"><span><small>Divisão territorial contratada</small><strong>{tenant.divisaoTerritorial}</strong></span><span><small>Candidato principal</small><strong>{tenant.candidatoPrincipal}</strong></span><span><small>Partido de referência</small><strong>{tenant.partidoReferencia}</strong></span></div>
  </section>
}

function Sidebar({ route, navigate, mobileOpen, onClose }: { route: string; navigate: Navigate; mobileOpen: boolean; onClose: () => void }) {
  const { tenant, perfil } = useTenant()
  const active = route.split('/')[0]
  const select = (value: string) => { navigate(value); onClose() }
  // O menu é derivado do contrato, não escrito à mão: é o que faz disto um produto.
  // Duas perguntas diferentes: o cliente COMPROU o módulo, e este usuário PODE vê-lo.
  const visiveis = modulos.filter(m => tenant.ativos.includes(m.id) && perfilVe(perfil, m.id))
  return <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}><div className="brand"><span className="brand-mark"><span /><span /><span /></span><div><strong>ELEITORES</strong><small>Inteligência política</small></div><button className="icon-button sidebar-close" aria-label="Fechar menu" onClick={onClose}><X size={18} /></button></div><nav className="main-nav" aria-label="Navegação principal">{gruposOrdem.map(grupo => { const itens = visiveis.filter(m => m.grupo === grupo); if (!itens.length) return null; return <div key={grupo} className="nav-grupo"><span className="nav-grupo-label">{grupo}</span>{itens.map(m => { const Icon = iconesModulo[m.id] || CircleHelp; return <button key={m.id} className={active === m.id ? 'active' : ''} onClick={() => select(m.id)}><Icon size={18} /><span>{m.label}</span></button> })}</div> })}</nav><div className="sidebar-footer"><button className={active === 'configuracoes' ? 'active' : ''} onClick={() => select('configuracoes')}><Settings size={18} /><span>Minha conta</span></button><div className="tenant"><span>{tenant.sigla}</span><div><strong>{tenant.nome}</strong><small>Plano {planos.find(p => p.id === tenant.plano)?.nome} · ambiente fictício</small></div><MoreHorizontal size={16} /></div></div></aside>
}

/** Módulo fora do contrato não some do produto: ele explica o que é e como contratar. */
function ModuloBloqueado({ id, navigate }: { id: string; navigate: Navigate }) {
  const { tenant } = useTenant()
  const modulo = modulos.find(m => m.id === id)
  if (!modulo) return <EmptyState title="Módulo desconhecido" text="Esta rota não corresponde a nenhum módulo do produto." action={<button className="primary-button" onClick={() => navigate('painel')}>Voltar ao painel</button>} />
  const plano = planos.find(p => p.id === modulo.plano)!
  return <><PageHeader eyebrow="Do seu plano" title={modulo.label} description={modulo.descricao} />
    <section className="card bloqueio"><span className="bloqueio-icone"><Lock size={22} /></span>
      <div><h2>Disponível no plano {plano.nome}</h2><p>{plano.resumo}</p>
        <p className="bloqueio-preco">{plano.preco} · seu plano atual é {planos.find(p => p.id === tenant.plano)?.nome}</p></div>
      <button className="primary-button" onClick={() => navigate('parametrizacoes/planos')}>Ver planos e módulos <ArrowRight size={16} /></button>
    </section></>
}

function Topbar({ route, onMenu }: { route: string; onMenu: () => void }) {
  const [notifications, setNotifications] = useState(false)
  const [query, setQuery] = useState('')
  const base = route.split('/')[0]
  useEffect(() => {
    if (!notifications) return
    const outside = (event: Event) => !(event.target as Element).closest('.notification-wrap') && setNotifications(false)
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setNotifications(false)
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [notifications])
  const { tema, setTema } = useTema()
  // Um botão que cicla os três estados: alternador de dois obrigaria a abrir Configurações
  // para voltar a "seguir o sistema", que é justamente o padrão que a maioria quer.
  const proximoTema: Record<Tema, Tema> = { sistema: 'claro', claro: 'escuro', escuro: 'sistema' }
  const IconeTema = tema === 'claro' ? Sun : tema === 'escuro' ? Moon : Monitor
  const rotuloTema = tema === 'claro' ? 'Tema claro' : tema === 'escuro' ? 'Tema escuro' : 'Tema do sistema'
  return <header className="topbar"><button className="icon-button mobile-menu" onClick={onMenu} aria-label="Abrir menu"><Menu size={20} /></button><div className="breadcrumb"><span>Eleitores</span><ChevronRight size={14} /><strong>{routeTitles[base] || 'Painel Executivo'}</strong></div><form className="global-search" onSubmit={event => { event.preventDefault(); if (query.trim()) { go(`quadro-eleitoral/busca/${encodeURIComponent(query.trim())}`); setQuery('') } }}><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar pessoa, território ou campanha" aria-label="Busca global" /><kbd>⌘ K</kbd></form><div className="topbar-actions"><button className="icon-button" onClick={() => setTema(proximoTema[tema])} aria-label={`${rotuloTema}. Clique para alternar.`} title={rotuloTema}><IconeTema size={18} /></button><div className="notification-wrap"><button className="icon-button notification-button" aria-label="Notificações" onClick={() => setNotifications(value => !value)}><Bell size={19} /><span>3</span></button>{notifications && <div className="notification-popover"><div><strong>Notificações</strong><button className="text-button" onClick={() => setNotifications(false)}>Marcar como lidas</button></div><button onClick={() => { go('inteligencia'); setNotifications(false) }}><span className="dot amber" /><div><strong>Novo insight territorial</strong><small>Campos do Norte pede atenção</small></div></button><button onClick={() => { go('campanhas'); setNotifications(false) }}><span className="dot blue" /><div><strong>Marco se aproxima</strong><small>Revisão em dois dias</small></div></button><button onClick={() => { go('base-nacional'); setNotifications(false) }}><span className="dot green" /><div><strong>Camada validada</strong><small>Simulação concluída</small></div></button></div>}</div><button className="profile-button"><Avatar initials="SL" size="sm" /><span><strong>Sofia Linhares</strong><small>Administradora</small></span><ChevronDown size={14} /></button></div></header>
}

function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || 'bem-vindo')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tenant, setTenant] = useState<Tenant>(tenantPadrao)
  const [perfil, setPerfil] = useState<Perfil>(perfis[0])
  const [avaliacoes, setAvaliacoes] = useState<Record<number, string>>(statusPolitico)
  const statusDe = (id: number) => avaliacoes[id] || 'Não avaliado'
  const avaliar = (id: number, valor: string) => setAvaliacoes(a => ({ ...a, [id]: valor }))
  const [tema, setTemaEstado] = useState<Tema>(() => temaSalvo())
  const setTema = (t: Tema) => { setTemaEstado(t); aplicarTema(t) }
  // Enquanto a escolha for "sistema", seguir o SO em tempo real, sem recarregar.
  useEffect(() => ouvirSistema(tema, () => aplicarTema(tema)), [tema])
  useEffect(() => {
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setRoute(window.location.hash.replace('#', '') || 'bem-vindo'); window.scrollTo({ top: 0, behavior: calmo.matches ? 'auto' : 'smooth' }) }
    window.addEventListener('hashchange', update)
    if (!window.location.hash) window.location.hash = 'bem-vindo'
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const navigate = (value: string) => go(value)
  const page = useMemo(() => {
    const base = route.split('/')[0]
    // Módulo que existe no produto mas não no contrato do cliente não dá 404: explica o plano.
    const conhecido = modulos.some(m => m.id === base)
    if (conhecido && !tenant.ativos.includes(base)) return <ModuloBloqueado id={base} navigate={navigate} />
    switch (base) {
      case 'bem-vindo': return <BemVindo navigate={navigate} />
      case 'painel': return <Dashboard navigate={navigate} />
      case 'quadro-eleitoral': return <ElectoralBoard navigate={navigate} route={route} />
      case 'municipios': return route.includes('/perfil/') ? <MunicipioFicha id={route.split('/')[2]} navigate={navigate} /> : <Municipios navigate={navigate} />
      case 'territorios': return route.includes('/perfil/') ? <TerritoryProfile id={route.split('/')[2]} navigate={navigate} /> : <Territories navigate={navigate} />
      case 'eleicoes': return <Eleicoes />
      case 'campanhas': return <Campaigns />
      case 'agenda': return <AgendaModulo navigate={navigate} />
      case 'aniversarios': return <Aniversarios navigate={navigate} />
      case 'inteligencia': return <Intelligence navigate={navigate} />
      case 'cruzamento': return <Cruzamento />
      case 'relatorio': return <Reports route={route} navigate={navigate} />
      case 'exportacoes': return <Exportacoes />
      case 'prestacao': return <PrestacaoContas />
      case 'base-nacional': return <NationalBaseHub navigate={navigate} />
      case 'equipe': return <Team />
      case 'usuarios': return <UsersAccess />
      case 'parametrizacoes': return <Parameters navigate={navigate} route={route} />
      case 'configuracoes': return <SettingsPage route={route} navigate={navigate} />
      case 'reunioes': return <Historico navigate={navigate} />
      default: return <BemVindo navigate={navigate} />
    }
  }, [route, tenant])
  return <TemaCtx.Provider value={{ tema, setTema }}><TenantCtx.Provider value={{ tenant, setTenant, perfil, setPerfil }}><AvaliacaoCtx.Provider value={{ statusDe, avaliar }}><div className="app-shell"><a className="skip-link" href="#main-content">Pular para o conteúdo</a><Sidebar route={route} navigate={navigate} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />{mobileOpen && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />}<Topbar route={route} onMenu={() => setMobileOpen(true)} /><main id="main-content" className="main-content">{/* key força a animação de entrada a rodar de novo a cada troca de rota */}<div className="pagina" key={route}>{page}</div><footer className="prototype-footer"><span><Info size={14} /> Protótipo local · dados inteiramente fictícios · sem integrações reais</span><button className="text-button"><CircleHelp size={14} /> Ajuda</button><button className="text-button"><LogOut size={14} /> Sair</button></footer></main></div></AvaliacaoCtx.Provider></TenantCtx.Provider></TemaCtx.Provider>
}


function IdentidadeAmbiente() {
  const { tenant, setTenant } = useTenant()
  const [salvo, setSalvo] = useState(false)
  return <section className="card">
    <div className="card-heading"><div><span className="eyebrow">Contrato</span><h2>{tenant.nome}</h2></div>{salvo ? <span className="confirmacao"><Check size={15} /> Salvo</span> : <Pill tone="blue">Plano {planos.find(p => p.id === tenant.plano)?.nome}</Pill>}</div>
    <div className="form-grid">
      <label>Nome exibido<input value={tenant.nome} onChange={e => setTenant({ ...tenant, nome: e.target.value })} /></label>
      <label>Sigla<input value={tenant.sigla} maxLength={4} onChange={e => setTenant({ ...tenant, sigla: e.target.value.toUpperCase() })} /></label>
      <label>Candidato principal<input value={tenant.candidatoPrincipal} onChange={e => setTenant({ ...tenant, candidatoPrincipal: e.target.value })} /></label>
      <label>Partido de referência<input value={tenant.partidoReferencia} onChange={e => setTenant({ ...tenant, partidoReferencia: e.target.value })} /></label>
      <label>Divisão territorial contratada<select value={tenant.divisaoTerritorial} onChange={e => setTenant({ ...tenant, divisaoTerritorial: e.target.value })}><option>Mesorregião</option><option>Território de identidade</option><option>Região administrativa</option></select></label>
      <label>Cor de acento<input type="color" defaultValue="#06b6d4" /></label>
    </div>
    <div className="domain-note"><Info size={18} /><div><strong>Mude a sigla e olhe o rodapé da barra lateral.</strong><p>O que se edita aqui aparece na hora em todas as telas: é o mesmo contrato que alimenta o menu, o nome do ambiente e o vocabulário territorial.</p></div></div>
    <div className="settings-actions"><button className="primary-button" onClick={() => { setSalvo(true); setTimeout(() => setSalvo(false), 1800) }}>Salvar identidade</button></div>
  </section>
}

function DadosRetencao({ navigate }: { navigate: Navigate }) {
  return <>
    <section className="card">
      <div className="card-heading"><div><span className="eyebrow">Governança</span><h2>Retenção</h2></div></div>
      <div className="form-grid">
        <label>Histórico de interações<select defaultValue="5 anos"><option>2 anos</option><option>5 anos</option><option>Indeterminada</option></select></label>
        <label>Arquivos exportados<select defaultValue="7 dias"><option>7 dias</option><option>30 dias</option><option>90 dias</option></select></label>
        <label>Observações políticas<select defaultValue="Enquanto o contrato durar"><option>Enquanto o contrato durar</option><option>2 anos</option></select></label>
        <label>Registro de auditoria<select defaultValue="Indeterminada"><option>Indeterminada</option><option>5 anos</option></select></label>
      </div>
      <p className="section-description">Base política guarda opinião sobre pessoas identificadas. Retenção e saída de dado não são detalhe técnico — são a diferença entre inteligência e passivo.</p>
    </section>
    <section className="card">
      <div className="card-heading"><div><span className="eyebrow">Procedência</span><h2>De onde vem cada dado</h2></div></div>
      <div className="origem-lista">{[['TSE', 'Candidaturas, resultados e filiação', 'Sincronização manual hoje; automática prevista'], ['IBGE', 'População, malha territorial e códigos', 'Sincronização manual hoje; automática prevista'], ['ANAC', 'Pistas de pouso próximas aos municípios', 'Integração prevista, hoje preenchido à mão'], ['Equipe', 'Avaliação política, observações e vínculos', 'Sempre manual, sempre com autor e data']].map(([fonte, o, como]) =>
        <div key={fonte}><span className="origem-selo">{fonte}</span><div><strong>{o}</strong><small>{como}</small></div></div>)}</div>
      <div className="acoes-dados">
        <button className="secondary-button" onClick={() => navigate('exportacoes')}><Download size={15} /> Exportar tudo</button>
        <button className="secondary-button"><FileText size={15} /> Registro de auditoria</button>
        <button className="secondary-button perigo"><AlertTriangle size={15} /> Solicitar exclusão do ambiente</button>
      </div>
      <p className="section-description">A exclusão é irreversível e passa por confirmação humana — por isso pede solicitação, não um botão que apaga na hora.</p>
    </section>
  </>
}

export default App
