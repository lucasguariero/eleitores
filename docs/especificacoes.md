# Grupo Início

---

## Tela Bem-vindo

### Visão Geral

- **Nome:** Bem-vindo
- **Localização:** Início → Bem-vindo (página inicial)
- **Objetivo:** Porta de entrada com datas do dia e atalhos.

---

## Painel Executivo

### Visão Geral

- **Nome:** Painel Executivo
- **Localização:** Início → Painel Executivo
- **Objetivo:** Indicadores consolidados para decidir onde agir.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Início
- Título: Painel Executivo
- Subtítulo: O que a base já diz — e onde ela ainda não foi olhada...
- Ações: Dropdown de período (Últimos 30 dias / Trimestre atual / Ciclo eleitoral)

#### Seção 2: Métricas (4 cards)

- Card 1: Candidatos no quadro + informação de contexto
- Card 2: Municípios com dossiê + informação de contexto
- Card 3: Cobertura territorial + informação de contexto
- Card 4: Compromissos no período + informação de contexto

#### Seção 3: Composição da base

- Eyebrow: Composição da base
- Título: Candidatos por posição política
- Badge: X avaliadas
- Descrição: "A distribuição conta apenas quem já foi avaliado..."
- Barra visual de composição por status político
- Legenda com botões para cada status (número + nome)

#### Seção 4: Pendência

- Card de alerta com:
  - Ícone: AlertTriangle
  - Número: X candidatos sem avaliação política
  - Texto: "São lacunas, não posições..."
  - Botão: Abrir fila de triagem

#### Seção 5: Evolução

- Eyebrow: Pulso territorial
- Título: Evolução da cobertura qualificada
- Badge de período
- Gráfico de barras com 6 colunas (Mar, Abr, Mai, Jun, Jul, Ago) com valores

#### Seção 6: Dossiês incompletos

- Eyebrow: Onde a base está mais fraca
- Título: Dossiês incompletos
- Descrição: "Municípios com menor preenchimento..."
- Lista de municípios com: nome, divisão, progresso, %, seta

#### Seção 7: Oportunidades em foco

- Eyebrow: Leitura recomendada
- Título: Oportunidades em foco
- Card com: ícone Sparkles, título, texto descritivo

#### Seção 8: Atividade recente

- Eyebrow: Atividade recente
- Título: Relacionamento
- Botão: Abrir histórico
- Lista de atividades com: avatar, nome, tipo, autor, data




---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Data atual (ex: "12 de agosto de 2026")
- Título: "Bem-vindo, [nome do usuário]"
- Subtítulo: Nome do ambiente + "dados inteiramente fictícios"

#### Seção 2: Datas do dia

- Card com ícone Cake
- Texto: X data(s) comemorativa(s) hoje + nomes / ou "Nenhum aniversário..."
- Botão: Ver o mês → navega para Aniversários

#### Seção 3: Atalhos

- Grid de cards com: ícone, nome do módulo, descrição, seta
- Módulos: Quadro Eleitoral, Municípios, Eleições, Painel, Agenda, Aniversários

#### Seção 4: O que mudou

- Eyebrow: Desde seu último acesso
- Título: O que mudou
- 3 botões com: número grande, descrição (candidatos cadastrados, dossiês completados, candidatos sem avaliação política)

---

# Grupo Território

---

## Módulo Municípios

### Visão Geral

- **Nome do módulo:** Municípios
- **Localização no menu:** Território → Municípios
- **Objetivo:** Gerenciar dossiês municipais com dados oficiais (IBGE/TSE) e observações internas da equipe.

---

### Tela 1: Lista de Municípios

#### Seção 1: Header

- Eyebrow: Território
- Título: Municípios
- Subtítulo: Dossiê por município: dados oficiais do IBGE e observações da equipe
- Ações: Botões de ação primária e secundária

#### Seção 2: Métricas (5 cards)

- Card 1: Total de municípios com valor e informação de contexto
- Card 2: Total de eleitores com valor e informação de contexto
- Card 3: Dossiê consolidado (acima de 80%) com valor e informação de contexto
- Card 4: Dossiê parcial (40% - 80%) com valor e informação de contexto
- Card 5: Dossiê crítico (abaixo de 40%) com valor e informação de contexto

#### Seção 3: Filtros

- Busca: Campo de texto com ícone de lupa
- Dropdown: Selecionar divisão territorial para filtrar
- Toggle: Alternar entre "Todos" e "Favoritos"

#### Seção 4: Lista de Cards

Cada card:

- Identificação: Nome + código + divisão territorial
- Badge: Status "Favorito" (se aplicável)
- Informações: Foto + nome + partido do prefeito
- Métricas: População + Eleitores
- Progresso: Barra de completude com %
- Ação: Botão "Ver dossiê" → navega para detalhe

---

### Tela 2: Ficha Município (Detalhe)

#### Seção 1: Header

- Breadcrumb: Voltar para a lista
- Título: [Nome do município] + Indicador de status (consolidado/parcial/crítico)
- Subtítulo: Divisão territorial + distância da capital
- Ações: Navegar próximo | Favoritar (star) | Exportar | Editar

#### Seção 2: Faixa de Completude

- Indicador visual grande com %
- Barra de progresso
- Meta: Quem atualizou + data

#### Seção 3: Dados Oficiais

- Título: Dados do IBGE e do TSE
- Subtítulo: Somente leitura
- Badge: Última sincronização
- Informações: População, número de eleitores, divisão territorial, distância até a capital, prefeito, vice-prefeito

#### Seção 4: Dados Internos

- Título: Dados internos
- Subtítulo: Preenchido pela equipe
- Campos: Aniversário da cidade, padroeira, pistas de pouso próximas, última observação

#### Seção 5: Candidatos Vinculados (accordion)

- Título: Candidatos vinculados
- Filtro: Por status político (Todos / Aliado / Aliado parcial / Neutro / Adversário / Não avaliado)
- Lista: Cada item com foto, nome, cargo, status político, seta para navegar

#### Seção 6: Resultados das Eleições (accordion)

- Título: Resultados das Eleições
- Anos: 2020, 2022, 2024
- Para cada ano:
  - Nome do candidato + partido
  - Número de votos
  - Percentual
  - Barra visual
  - Badge "Eleito" (se aplicável)

#### Seção 7: Sidebar - Pendências

- Título: Completar cadastro
- Subtítulo: O que falta e por que cada campo importa
- Lista de campos não preenchidos com justificativa
- Botão: Completar agora

---

## Módulo Mesorregiões

### Visão Geral

- **Nome do módulo:** Mesorregiões
- **Localização no menu:** Território → Mesorregiões
- **Objetivo:** Visão agregada por mesorregião: municípios, cobertura e indicadores consolidados.

---

### Tela 1: Lista de Mesorregiões

#### Seção 1: Header

- Eyebrow: Território
- Título: Mesorregiões
- Subtítulo: Visão agregada por {divisão territorial}: municípios, cobertura e indicadores consolidados
- Ações: Botão secundário "Sincronizar IBGE" + Botão primário "Exportar"

#### Seção 2: Métricas (5 cards)

- Card 1: Total de mesorregiões com valor e informação de contexto
- Card 2: Total de municípios com valor e informação de contexto
- Card 3: Total de eleitores com valor e informação de contexto
- Card 4: População total com valor e informação de contexto
- Card 5: Cobertura média com valor e informação de contexto

#### Seção 3: Filtros

- Busca: Campo de texto com ícone de lupa

#### Seção 4: Lista de Cards

Cada card:

- Nome da mesorregião
- Informações: Quantidade de municípios
- Pill: % de completude média (verde = consolidado acima de 80%)
- Métricas: População + Eleitores
- Progresso: Barra de cobertura %
- Ação: Botão "Ver detalhe" → navega para detalhe

---

### Tela 2: Detalhe Mesorregião

#### Seção 1: Header

- Breadcrumb: Voltar para a lista
- Eyebrow: Mesorregião
- Título: Nome da mesorregião
- Subtítulo: Quantidade de municípios · População
- Pill: Cobertura %
- Ações: Botão secundário "Exportar" + Botão primário "Editar"

#### Seção 2: Faixa de Completude

- Indicador visual grande com %
- Barra de progresso
- Meta: Quem atualizou + data

#### Seção 3: Métricas (5 cards)

- Card 1: Total de municípios + "nesta divisão"
- Card 2: Total de eleitores + "total na divisão"
- Card 3: População total + "total na divisão"
- Card 4: Municípios consolidados + "acima de 80%"
- Card 5: Municípios críticos + "abaixo de 40%"

#### Seção 4: Lista de Municípios

- Eyebrow: Municípios desta {divisão territorial}
- Título: Lista consolidada
- Grid de cards - cada card:
  - Nome do município + código
  - Pill: % de completude
  - Métricas: População + Eleitores
  - Progresso: Dossiê %
  - Botão: "Ver dossiê" → navega para detalhe do município

---

## Módulo Territórios

### Visão Geral

- **Nome do módulo:** Territórios
- **Localização no menu:** Território → Territórios
- **Objetivo:** Explore cobertura, potencial e oportunidades. O mapa filtra e atualiza a leitura ao lado.

---

### Tela 1: Lista de Territórios

#### Seção 1: Header

- Eyebrow: Território
- Título: Territórios
- Subtítulo: Explore cobertura, potencial e oportunidades. O mapa filtra e atualiza a leitura ao lado.
- Ações: Botão primário "Criar agrupamento"

#### Seção 2: Filtros

- Dropdown: Selecionar prioridade (Todas / Alta / Média / Estável)
- Dropdown: Selecionar camada (Cobertura política / Potencial eleitoral / Relacionamentos)
- Legenda: Prioridade alta, Prioridade média, Estável

#### Seção 3: Mapa Interativo + Painel Lateral

- Mapa abstrato com regiões clicáveis
- Ao clicar: atualiza o painel lateral
- Painel lateral (cada território):
  - Eyebrow: Território selecionado
  - Título: Nome do território
  - Pill: Prioridade (Alta / Média / Estável)
  - Métricas: Eleitorado + Municípios
  - Progresso: Cobertura qualificada %
  - Oportunidade: Texto descritivo
  - Botão: "Abrir visão detalhada" → navega para detalhe

#### Seção 4: Lista de Territórios

- Eyebrow: Comparativo
- Título: Visão por território
- Toggle: Alternar entre visualização Lista e Grade
- Cada item:
  - Cor de prioridade (mesma do mapa)
  - Nome + quantidade de municípios
  - Métricas: Cobertura + Eleitorado
  - Pill: Prioridade (Alta / Média / Estável)
  - Seta para navegar

---

### Tela 2: Detalhe Território

#### Seção 1: Header

- Breadcrumb: Voltar para a lista
- Eyebrow: Perfil territorial · Município demonstrativo
- Título: Município de {nome}
- Subtítulo: Panorama socioterritorial, político e eleitoral em uma leitura única.
- Pills: Prioridade + Quantidade de eleitores
- Ações: Botão primário "Criar agenda"

#### Seção 2: Métricas (4 cards)

- Card 1: Cobertura com valor e informação de contexto
- Card 2: Representantes com valor e informação de contexto
- Card 3: Oportunidades com valor e informação de contexto
- Card 4: Agendas com valor e informação de contexto

#### Seção 3: Grid - Mapa + Quadro Eleitoral

- Mapa abstrato do território
- Eyebrow: Panorama
- Título: Mapa e indicadores
- Pill: Recorte municipal
- Indicadores: Urbanização, Renda índice, Engajamento
- Título: Representantes e aliados
- Lista de candidatos com foto, nome, cargo, status

#### Seção 4: Detalhes - Oportunidade + Observações

- Eyebrow: Oportunidade
- Título: Leitura socioterritorial
- Texto de oportunidade
- Informações: Dinâmica populacional, Principal polo, Pressão de agenda, Fonte
- Eyebrow: Registros auditáveis
- Título: Observações
- Toggle: Gerais / Políticas / Relacionamento
- Registro com título, descrição, autor e data

#### Seção 5: Histórico

- Eyebrow: Histórico
- Título: Resultados e agendas do município
- Anos: 2020, 2022, 2024
- Para cada ano: barra visual + quantidade de votos

---

## Módulo Eleições

### Visão Geral

- **Nome do módulo:** Eleições
- **Localização no menu:** Território → Eleições
- **Objetivo:** Apuração e resultados por cargo, turno e município — simulação sobre dados fictícios.

---

### Tela 1: Lista de Eleições

#### Seção 1: Header

- Eyebrow: Território
- Título: Eleições
- Subtítulo: Apuração e resultados por cargo, turno e município — simulação sobre dados fictícios.
- Ações: Botão secundário "Sincronizar TSE"

#### Seção 2: Faixa de Apuração

- Eyebrow: Recorte contratado
- Título: Estado fictício do Horizonte
- Pill: Dados atualizados

#### Seção 3: Métricas (3 cards)

- Card 1: Municípios apurados com valor e informação de contexto
- Card 2: Eleitores com valor e informação de contexto
- Card 3: Urnas apuradas com valor e informação de contexto

#### Seção 4: Filtros

- Dropdown: Selecionar ano (2026, 2024)
- Dropdown: Selecionar cargo (Todos os cargos, Governador, Prefeito)
- Dropdown: Selecionar turno (Todos os turnos, 1º turno, 2º turno)
- Dropdown: Selecionar município (Todos os município, ...)
- Botão: Aplicar

#### Seção 5: Lista de Cargos (accordion)

- Cada cargo:
  - Nome do cargo
  - Ao expandir: turnos
  - Cada turno:
    - Nome do turno + % apurado
    - Lista de candidatos com:
      - Foto
      - Nome + partido
      - Status (Eleito / Não Eleito)
      - Percentual de votos
      - Número de votos
      - Barra de progresso

---

## Módulo Quadro Eleitoral

### Visão Geral

- **Nome do módulo:** Quadro Eleitoral
- **Localização no menu:** Relacionamento → Quadro Eleitoral
- **Objetivo:** Quem concorreu ou concorre a eleição, atual e do passado. Candidatura e desempenho vêm do TSE; a avaliação política é da equipe.

---

### Tela 1: Lista

- Seção 1: Header
- Seção 2: Faixa de Status
- Seção 3: Filtros
- Seção 4: Lista de Pessoas
- Seção 5: Paginação

#### Seção 1: Header

- Eyebrow: Relacionamento
- Título: Quadro Eleitoral
- Subtítulo: Quem concorreu ou concorre a eleição, atual e do passado. Candidatura e desempenho vêm do TSE; a avaliação política é da equipe.
- Ações: Botão secundário "Exportar visão" + Botão primário "Localizar pessoa"

#### Seção 2: Faixa de Status

- Cards para cada status: Aliado, Aliado parcial, Neutro, Adversário
- Card de pendência: "sem avaliação"

#### Seção 3: Filtros

- Busca com ícone
- Dropdown: Partido
- Dropdown: Situação (concorrendo / não concorrendo)
- Botão: Mais filtros
- Toggle: Lista / Grade

#### Seção 4: Lista de Pessoas

- Tabela ou grid com: Pessoa, Partido e cargo, Status político, Última candidatura, Desempenho, Ação

#### Seção 5: Paginação

- Controles de página

---

### Tela 2: Detalhe do Candidato

- Seção 1: Header
- Seção 2: Abas (Perfil completo / Interações / Auditoria)
- Seção 3: Avaliação Política
- Seção 4: Faixa de Completude
- Seção 5: Dados do TSE
- Seção 6: Histórico Eleitoral (accordion)
- Seção 7: Dados Internos (accordion)
- Seção 8: Sidebar - Desempenho e Pendências

#### Seção 1: Header

- Breadcrumb: Voltar para a lista
- Foto ilustrativa
- Eyebrow: Perfil eleitoral estruturado
- Título: Nome do candidato
- Subtítulo: Cargo · Partido · Território
- Pills: Status + Em disputa (se aplicável) + Atualizado há X dias
- Ações: Botão secundário "Auditoria" + Botão primário "Agendar interação"

#### Seção 2: Abas

- Aba 1: Perfil completo
- Aba 2: Interações
- Aba 3: Auditoria

#### Seção 3: Avaliação Política

- Eyebrow: Avaliação política
- Título: Como o grupo classifica esta pessoa
- Descrição: É a única informação da ficha que é julgamento da equipe, não fato do TSE
- Opções de status: Aliado, Aliado parcial, Neutro, Adversário, Não avaliado

#### Seção 4: Faixa de Completude

- Indicador visual grande com %
- Barra de progresso
- Meta: Quem atualizou + data

#### Seção 5: Dados do TSE

- Eyebrow: Origem oficial
- Título: Dados do TSE
- Subtítulo: Somente leitura
- Badge: Última sincronização
- Informações: Nome completo, Nome de urna, Partido, Cargo, Município, Situação

#### Seção 6: Histórico Eleitoral (accordion)

- Título: Histórico eleitoral
- Anos: Lista de eleições passadas
- Para cada ano: Cargo, Votos, Resultado

#### Seção 7: Dados Internos (accordion)

- Eyebrow: Preenchido pela equipe
- Título: Dados internos
- Campos preenchidos pela equipe

#### Seção 8: Sidebar - Desempenho e Pendências

- Desempenho eleitoral: Número grande + barra + mini bars
- Pendências: Lista de campos não preenchidos com justificativa

##### Aba Interações

- Título: Interações e encaminhamentos
- Linha do tempo com registros

##### Aba Auditoria

- Título: Auditoria compreensível
- Tabela com registros de alterações

---

## Módulo Campanhas

### Visão Geral

- **Nome do módulo:** Campanhas
- **Localização no menu:** Relacionamento → Campanhas
- **Objetivo:** Objetivos, frentes de trabalho, calendário e acompanhamento no mesmo ciclo.

---

### Tela 1: Lista

- Seção 1: Header
- Seção 2: Lista de Campanhas
- Seção 3: Detalhe da Campanha
- Seção 4: Modal de criar campanha

#### Seção 1: Header

- Eyebrow: Relacionamento
- Título: Campanhas
- Subtítulo: Objetivos, frentes de trabalho, calendário e acompanhamento no mesmo ciclo.
- Ações: Botão primário "Nova campanha"

#### Seção 2: Lista de Campanhas

- Lista de cards com: Status, Nome, Objetivo, Progresso, Período, Frentes

#### Seção 3: Detalhe da Campanha

- Eyebrow: Plano ativo
- Título: Nome da campanha ativa
- Botão: Editar plano
- Objetivo principal com status
- Frentes de trabalho com checkboxes, dono, progresso
- Mini calendário com próximos marcos

#### Seção 4: Modal

- Formulário para criar nova campanha

---

## Módulo Agenda

### Visão Geral

- **Nome do módulo:** Agenda
- **Localização no menu:** Relacionamento → Agenda
- **Objetivo:** Viagens, visitas, reuniões e entrevistas num só lugar. Reunião é um tipo de compromisso, não um módulo à parte — e qualquer tipo pode gerar encaminhamento com dono e prazo.

---

### Tela 1: Principal

- Seção 1: Header
- Seção 2: Métricas (4 cards)
- Seção 3: Controles (visões + filtros)
- Seção 4: Conteúdo (varia conforme visão)
- Seção 5: Modal de detalhe

#### Seção 1: Header

- Eyebrow: Relacionamento
- Título: Agenda
- Subtítulo: Viagens, visitas, reuniões e entrevistas num só lugar...
- Ações: Botão primário "Novo compromisso"

#### Seção 2: Métricas (4 cards)

- Card 1: Compromissos no mês com valor e informação de contexto
- Card 2: Encaminhamentos abertos com valor e informação de contexto
- Card 3: Em atraso com valor e informação de contexto
- Card 4: Quilometragem da rota com valor e informação de contexto

#### Seção 3: Controles (visões + filtros)

- Visões: Dia, Mês, Ano, Listagem, Rota
- Filtros por tipo de compromisso
- Seletor de período

#### Seção 4: Conteúdo (varia conforme visão)

- Visão Dia: grade do dia
- Visão Mês: calendário do mês
- Visão Ano: overview do ano
- Visão Listagem: lista de compromissos
- Visão Rota: planejamento de viagem

#### Seção 5: Modal de detalhe

- Título do compromisso
- Tipo, hora, município
- Status, tipo, vínculo
- Responsável e participantes
- Pauta
- Encaminhamentos

---

## Módulo Aniversários

### Visão Geral

- **Nome do módulo:** Aniversários
- **Localização no menu:** Relacionamento → Aniversários
- **Objetivo:** Datas de candidatos, municípios e padroeiras — e a presença que cada uma pode gerar.

---

### Tela 1: Lista

- Seção 1: Header
- Seção 2: Métricas (3 cards)
- Seção 3: Filtros
- Seção 4: Lista de datas

#### Seção 1: Header

- Eyebrow: Relacionamento
- Título: Aniversários
- Subtítulo: Datas de candidatos, municípios e padroeiras...
- Ações: Botão secundário "Exportar PDF"

#### Seção 2: Métricas (3 cards)

- Card 1: Datas no mês com valor e informação de contexto
- Card 2: Com presença agendada com valor e informação de contexto
- Card 3: Sem agendamento com valor e informação de contexto

#### Seção 3: Filtros

- Dropdown: Categoria (Todas, Candidato, Município, Padroeira)
- Dropdown: Mês

#### Seção 4: Lista de datas

- Agrupado por dia do mês
- Cada card:
  - Selo do dia: círculo de 54px com o número do dia, centralizado verticalmente
  - Lista de eventos do dia:
    - Pill de categoria (Candidato / Município / Padroeira)
    - Nome em destaque (15px)
    - Detalhe em texto secundário (14px)
    - Status: Pill "Presença agendada" (se agendado) ou botão "Agendar presença"
- Alinhamento: conteúdo centralizado verticalmente no card

---

## Módulo Inteligência

### Visão Geral

- **Nome do módulo:** Inteligência
- **Localização no menu:** Análise → Inteligência
- **Objetivo:** Insights em linguagem simples, com evidências simuladas e próximo passo sugerido.

---

### Tela 1: Lista de Insights

#### Seção 1: Header

- Eyebrow: Análise
- Título: Inteligência
- Subtítulo: Insights em linguagem simples, com evidências simuladas e próximo passo sugerido.
- Ações: Botão secundário "Atualizar leitura"

#### Seção 2: Resumo Executivo

- Ícone: Sparkles (indicando IA)
- Título: Resumo executivo
- Texto descritivo da operação
- Badge: "Gerado a partir de X camadas fictícias"

#### Seção 3: Lista de Insights

- Cada card:
  - Botão de info no canto superior direito
  - Conteúdo:
    - Pill de nível (Alta / Oportunidade / Sinal)
    - Badge de evidências (X evidências relacionadas)
    - Título do insight
    - Texto descritivo
  - Ações (alinhadas à direita, na mesma altura do texto):
    - Botão "Dispensar"
    - Botão primário de ação com seta
  - Layout: grid 2 colunas (conteúdo | ações)

#### Seção 4: Metodologia

- Card com ícone ShieldCheck
- Título: Como esta recomendação foi formada
- Texto explicando que cruza apenas dados fictícios
- Botão "Ver critérios"

#### Seção 5: Empty State

- Título: Leitura concluída
- Texto: Você revisou todos os insights desta rodada.
- Botão: Restaurar recomendações

---

## Módulo Cruzamento de dados

### Visão Geral

- **Nome do módulo:** Cruzamento de dados
- **Localização no menu:** Análise → Cruzamento de dados
- **Objetivo:** Perguntas em linguagem natural sobre as bases do sistema. A resposta sempre declara de onde saiu.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Análise
- Título: Cruzamento de dados
- Subtítulo: Perguntas em linguagem natural sobre as bases do sistema...
- Ações: Badge "Camada derivada" com ícone (indicando IA)

#### Seção 2: Input de Pergunta

- Ícone: fluxo/conexões
- Campo de texto com placeholder
- Botão primário "Cruzar"

#### Seção 3: Sugestões

- Label: "Experimente perguntar:"
- Botões com sugestões de perguntas

#### Seção 4: Resposta

- Card com:
  - Eyebrow: "Pergunta"
  - Título: a pergunta feita
  - Pill de confiança (Alta / Média)
  - Texto da resposta
  - Tabela com resultados
  - Seção procedência (ícone ShieldCheck traduzido)

---

## Módulo Relatórios

### Visão Geral

- **Nome do módulo:** Relatórios
- **Localização no menu:** Análise → Relatórios
- **Objetivo:** Leituras simuladas para comparar ciclos, candidaturas e desempenho municipal.

---

### Tela 1: Visão Geral

#### Seção 1: Header

- Eyebrow: Análise
- Título: Relatórios eleitorais
- Subtítulo: Leituras simuladas para comparar ciclos...
- Ações: Botão secundário "Exportação demonstrativa"

#### Seção 2: Abas

- Abas: Visão geral, Espelho comparativo, Consolidado

#### Seção 3: Filtros

- Dropdown: Eleição (2026, 2024)
- Dropdown: Candidato
- Dropdown: Território
- Botão: Aplicar

#### Seção 4: Métricas (4 cards)

- Card 1: Votos consolidados
- Card 2: Municípios líderes
- Card 3: Conversão estimada
- Card 4: Alertas

#### Seção 5: Gráficos

- Card 1: Curva de desempenho (gráfico de linha)
- Card 2: Mapa de resultado (distribuição territorial)

---

### Tela 2: Espelho Comparativo

- Cards para cada candidato com: avatar, nome, partido/cargo, número grande de desempenho, barra de progresso, métricas

---

### Tela 3: Consolidado

- Ranking municipal com: posição, nome, eleitores, progresso, percentual

---

## Módulo Exportações

### Visão Geral

- **Nome do módulo:** Exportações
- **Localização no menu:** Análise → Exportações
- **Objetivo:** Extração em massa por módulo, seção e campo.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Análise
- Título: Exportações
- Subtítulo: Extração em massa por módulo...

#### Seção 2: Filtros da Extração

- Card com:
  - Label: Módulo (obrigatório)
  - Dropdown: Seções
  - Dropdown: Campos
  - Dropdown: Formato (XLSX / PDF)
  - Dropdown: Período (Todo o período / Últimos 30 dias / Últimos 90 dias / Ano atual)
  - Descrição: "Deixar seções e campos em branco exporta tudo..."
  - Contador de registros: "X registros serão exportados"
  - Botão: Exportar

#### Seção 3: Histórico

- Card com:
  - Eyebrow: Histórico
  - Título: Minhas exportações
  - Tabela com colunas: Solicitado, Usuário, Módulo, Formato, Situação, Tamanho, Ação

---

## Módulo Prestação de contas

### Visão Geral

- **Nome do módulo:** Prestação de contas
- **Localização no menu:** Gestão → Prestação de contas
- **Objetivo:** Receitas, despesas e documentos do período.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Gestão
- Título: Prestação de contas
- Subtítulo: Receitas, despesas e documentos do período...
- Ações: Botão secundário "Exportar" + Botão primário "Novo lançamento"

#### Seção 2: Aviso

- Banner de demonstração: "Esta tela não substitui o sistema oficial..."

#### Seção 3: Métricas (4 cards)

- Card 1: Receitas
- Card 2: Despesas
- Card 3: Saldo
- Card 4: Sem comprovante

#### Seção 4: Filtros

- Abas: Todos, Conferido, Em conferência, Sem comprovante

#### Seção 5: Tabela

- Colunas ordenáveis: Data, Descrição, Categoria, Campanha, Documento, Situação, Valor
- Cada coluna tem clique para ordenar (↑↓)

---

## Módulo Base Nacional

### Visão Geral

- **Nome do módulo:** Base Nacional
- **Localização no menu:** Administração → Base Nacional
- **Objetivo:** Cadastros curados, vínculos de identidade, eleições, sincronizações e catálogo territorial.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Administração
- Título: Base Nacional
- Subtítulo: Cadastros curados, vínculos de identidade...
- Ações: Botão secundário "Nova sincronização simulada"

#### Seção 2: Aviso

- Banner de demonstração: "Nenhum registro, arquivo ou serviço real está conectado."

#### Seção 3: Abas

- Abas: Cadastros curados, Fila de vínculos, Eleições e sincronizações, Catálogo territorial

#### Seção 4: Conteúdo por aba

- **Aba Cadastros curados**: Métricas + Lista de conjuntos (TSE, IBGE, Curadoria interna)
- **Aba Fila de vínculos**: Lista de pareamentos com: registros, divergências, confiança, ações
- **Aba Eleições e sincronizações**: Cards de eleições por ano
- **Aba Catálogo territorial**: Árvore de territórios

---

## Módulo Equipe

### Visão Geral

- **Nome do módulo:** Equipe
- **Localização no menu:** Administração → Equipe
- **Objetivo:** Quem trabalha no grupo político.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Administração
- Título: Equipe
- Subtítulo: Quem trabalha no grupo político...
- Ações: Confirmação de cadastro + Botão primário "Cadastrar pessoa"

#### Seção 2: Aviso

- Banner sobre cargo e perfil de acesso serem campos diferentes

#### Seção 3: Métricas (3 cards)

- Card 1: Integrantes
- Card 2: Com acesso ao sistema
- Card 3: Sem acesso

#### Seção 4: Tabela

- Colunas ordenáveis: Pessoa, Vínculo, Cargo no grupo, Área, Perfil de acesso, Situação
- Cada coluna tem clique para ordenar (↑↓)

#### Seção 5: Modal de cadastro

- Formulário com: Nome, E-mail, Vínculo, Área, Cargo, Toggle de acesso ao sistema, Perfil de acesso

---

## Módulo Usuários e Acessos

### Visão Geral

- **Nome do módulo:** Usuários e Acessos
- **Localização no menu:** Administração → Usuários e Acessos
- **Objetivo:** Contas, e-mails, perfis, permissões, status e último acesso.

---

### Tela 1: Principal

#### Seção 1: Header

- Eyebrow: Administração
- Título: Usuários e Acessos
- Subtítulo: Contas, e-mails, perfis...
- Ações: Botão primário "Convidar usuário"

#### Seção 2: Aviso

- Banner sobre conta de acesso não ser vínculo de equipe nem perfil eleitoral

#### Seção 3: Filtros

- Busca por nome ou e-mail
- Dropdown: Status (Todos / Ativo / Convidado / Suspenso)
- Botão: Gerenciar perfis

#### Seção 4: Tabela

- Colunas ordenáveis: Usuário, Perfil de acesso, Escopo territorial, Status, Último acesso
- Cada coluna tem clique para ordenar (↑↓)

#### Seção 5: Modal de permissões

- Título: Perfil: Coordenação regional
- Grid de módulos com selects de nível (Sem acesso / Leitor / Editor)

---

## Módulo Parametrizações

### Visão Geral

- **Nome do módulo:** Parametrizações
- **Localização no menu:** Administração → Parametrizações
- **Objetivo:** Regras, tipos, cargos, status, territórios, papéis, campos e valores configuráveis do produto.

---

### Tela 1: Valores e vocabulários

#### Seção 1: Header

- Eyebrow: Administração
- Título: Parametrizações
- Subtítulo: Regras, tipos, cargos...
- Ações: Botão secundário "Configurações gerais"

#### Seção 2: Subtabs

- Abas: Valores e vocabulários, Identidade do ambiente, Planos e módulos, Dados e retenção

#### Seção 3: Escala de status político

- Eyebrow: Vocabulário do cliente
- Título: Escala de status político
- Botão: Novo valor
- Descrição: "A régua com que a equipe classifica pessoas é do cliente..."
- Lista de valores com: Pill de cor, nome, descrição, badge "lacuna" se pendente
- Info grid com: Divisão territorial contratada, Candidato principal, Partido de referência

#### Seção 4: Categorias de parametrização (menu lateral)

- Lista de categorias com: ícone, título, contagem de valores configurados
- Categorias: Tipos e classificações, Cargos e funções políticas, Status de acompanhamento, Regras territoriais, Papéis e perfis padrão, Campos complementares, Partidos e legendas, Grupos locais, Tipos de interação, Políticas de governança

#### Seção 5: Detalhe da categoria

- Eyebrow: Categoria selecionada
- Título da categoria
- Botão: Novo valor
- Descrição: "Valores usados de forma consistente nos cadastros e filtros..."
- Lista de valores com: nome, código fictício, status "Ativo", botão de ações
- Formulário inline para adicionar novo valor

---

### Tela 2: Identidade do ambiente

#### Seção 1: Card de identidade

- Eyebrow: Contrato
- Título: Nome do ambiente
- Badge: Plano atual
- Campos: Nome exibido, Sigla, Candidato principal, Partido de referência, Divisão territorial contratar, Cor de acento
- Aviso: "Mude a sigla e olhe o rodapé da barra lateral."
- Botão: Salvar identidade

---

### Tela 3: Planos e módulos

#### Seção 1: Grid de Planos

- Cards de planos com: nome, resumo, preço, quantidade de módulos inclusos
- Cada card tem: botão para selecionar, badge "Contratado" se ativo

#### Seção 2: Módulos habilitados

- Eyebrow: Contrato
- Título: Módulos habilitados
- Badge: X de Y módulos ativos
- Descrição: "Desligar um módulo o remove do menu deste cliente..."
- Lista agrupada por grupo de navegação (Território, Relacionamento, Análise, Gestão, Administração)
- Cada módulo: ícone, nome, descrição, checkbox de habilitação
- Badges: "Núcleo" para obrigatórios, "Plano [nome]" para fora do plano

---

## Minha conta

### Visão Geral

- **Nome:** Minha conta (localização no rodapé)
- **Objetivo:** Configurações pessoais que afetam só este dispositivo e conta.

---

### Tela 1: Aparência

#### Seção 1: Header

- Eyebrow: Configurações pessoais
- Título: Minha conta
- Subtítulo: Explica que é diferente de Administração → Parametrizações

#### Seção 2: Tema da interface

- Eyebrow: Aparência
- Título: Tema da interface
- Descrição: Três opções (Seguir o sistema, Claro, Escuro)
- Opções com amostra visual, descrição e badge "Em uso"

#### Seção 3: Acessibilidade

- Movimiento reduzido (do sistema)
- Contraste WCAG AA

#### Seção 4: Simulador de perfil

- Título: Ver o sistema como outro perfil
- Descrição sobre como funciona
- Grid de perfis com descrição e quantidade de módulos

---

### Tela 2: Notificações

- Eyebrow: Avisos
- Título: O que merece interromper você
- Lista de toggles: Oportunidade, Data comemorativa próxima, Prazo de prestação de contas, Resumo executivo semanal

---

### Tela 3: Segurança e sessão

- Eyebrow: Acesso
- Título: Segurança e sessão
- Info grid: Perfil, Autenticação 2 etapas, Último acesso, Expiração de sessão
- Sessões ativas: lista de dispositivos com opção de encerrar
- Toggle: Modo de alta confidencialidade
- Aviso de demonstração


---

### Tela 4: Dados e retenção

#### Seção 1: Retenção

- Eyebrow: Governança
- Título: Retenção
- Campos: Histórico de interações, Arquivos exportados, Observações políticas, Registro de auditoria
- Descrição sobre retenção de dados

#### Seção 2: Procedência

- Eyebrow: Procedência
- Título: De onde vem cada dado
- Lista de fontes: TSE, IBGE, ANAC, Equipe (origem, descrição, como é obtido)
- Ações: Exportar tudo, Registro de auditoria, Solicitar exclusão do ambiente
- Descrição sobre exclusão irreversível


