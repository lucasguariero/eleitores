# Eleitores — protótipo interativo

Protótipo navegável da plataforma de inteligência político-territorial **Eleitores**.
Todo o conteúdo de pessoas, partidos, resultados, fontes e organizações é fictício. Não há APIs,
autenticação real, persistência ou conexão com sistemas em produção.

## Executar

Requer Node 20.19+ e pnpm 11 (via `corepack`).

```bash
corepack pnpm install
```

```bash
corepack pnpm run dev
```

Abra o endereço local exibido pelo Vite. Para validar a entrega:

```bash
corepack pnpm run build && corepack pnpm run lint && corepack pnpm run test:smoke
```

## Publicação

Configurado para a Vercel em [`vercel.json`](vercel.json): build `pnpm run build`, saída `dist`,
framework Vite.

Não há regra de *rewrite* de SPA porque a navegação é por **hash** (`#painel`, `#quadro-eleitoral/perfil/1`) —
toda URL servida é `/`, então não existe rota de servidor para reescrever. Um `rewrite` aqui seria
configuração inútil resolvendo problema que a aplicação não tem.

O cabeçalho `X-Robots-Tag: noindex, nofollow` é proposital: é protótipo de produto político, não
deve aparecer em busca.

## O protótipo é um produto, não um sistema sob medida

A decisão de arquitetura mais importante: **o menu não está escrito no código.** Ele é derivado do
contrato do cliente, em `src/produto.ts`. Trocar o plano em *Parametrizações → Planos e módulos*
muda a navegação inteira na hora — 19 itens no plano Inteligência, 11 no Essencial.

Módulo fora do plano **não some do produto**: a rota continua existindo e explica qual plano o
inclui. Sumir sem explicação é como o software perde venda.

Também são do cliente, não nossos:

| Parâmetro | Por quê |
|---|---|
| Escala de status político | É a régua com que a equipe classifica gente. O produto não escolhe por ela. |
| Nome da divisão territorial | Mato Grosso do Sul usa "mesorregião"; a Bahia usa "território de identidade". Cravar um dos dois faria um sistema sob medida. |
| Candidato principal e partido de referência | Mudam a cada contrato. |
| Identidade visual | Nome, logo e cores do ambiente. |

### A escala de status político

`Aliado` · `Aliado parcial` · `Neutro` · `Adversário` · `Não avaliado`

A régua herdada era `apoio integral / apoio parcial / indefinido` — **e não tinha como registrar
adversário.** Quem era declaradamente contra caía em "indefinido", o mesmo balde de quem ninguém
tinha avaliado. Qualquer contagem somava duas coisas opostas.

`Não avaliado` é **lacuna, não posição**: fica fora da distribuição e aparece como pendência de
trabalho, com filtro direto. Migrar a base antiga exige mandar todo `indefinido` para `Não avaliado`
e reclassificar à mão — não dá para separar automaticamente o que foi conclusão do que foi omissão.

## Navegação entregue

| Grupo | Módulos |
|---|---|
| Início | Bem-vindo, Painel Executivo |
| Território | Municípios (lista, divisões e dossiê), Territórios, Eleições |
| Relacionamento | Quadro Eleitoral (lista, carteira por status e ficha do candidato), Campanhas, Agenda (com rota de viagem), Reuniões, Aniversários |
| Análise | Inteligência, Cruzamento de dados, Relatórios, Exportações |
| Gestão | Prestação de contas |
| Administração | Base Nacional, Equipe, Usuários e Acessos, Parametrizações |
| Rodapé | Configurações |

### Padrões que o protótipo defende

- **Origem declarada.** Dado oficial (IBGE/TSE) e dado interno ficam em blocos separados, com selo
  de fonte e data de sincronização. Quem lê sabe o que é fato público e o que é leitura da equipe.
- **Lacuna é tarefa, não estado.** Nenhuma tela repete "não informado" campo a campo: o que falta vem
  agrupado num bloco "Completar cadastro", com o motivo de cada pendência importar.
- **Cruzamento declara procedência.** A resposta diz de quais bases saiu, quantos registros entraram
  na conta, e que nenhum modelo externo foi consultado. Sem isso é adivinhação com cara de relatório.
- **Reunião termina em encaminhamento** com dono e prazo. Sem isso é só um evento no calendário.

## Abrir sem servidor

`index.html` é a entrada do Vite: ele aponta para `src/main.tsx`, e navegador nenhum executa TSX.
Abrir esse arquivo por duplo clique dava tela em branco. Agora ele detecta `file://` e redireciona
sozinho para `bundle.html` — o arquivo autocontido (HTML + CSS + JS num só), gerado por
`corepack pnpm run bundle` e ignorado pelo Git.

Ou seja: duplo clique em qualquer um dos dois funciona. Sem internet, só as fontes Google caem
para a fonte do sistema; o resto continua igual.

## Movimento

Regras em [`src/animacao.css`](src/animacao.css), todas com motivo:

- **Só `transform` e `opacity`** — as duas propriedades que o compositor resolve sem recalcular
  layout. Animar `width`/`height`/`margin` engasga em tabela longa.
- **O wrapper de página anima só opacidade.** Transform num container de página vira containing
  block para `position: fixed` e distorce a medida de largura se a animação travar. Aconteceu
  aqui: a página passou a acusar 899px numa viewport de 375. Há teste no smoke impedindo a volta.
- **Cascata curta**: as linhas de tabela escalonam só até a quinta. Numa lista de 20, a última
  chegaria meio segundo depois e a tela pareceria lenta.
- **`prefers-reduced-motion` desliga tudo** preservando o estado final — barra de progresso
  continua cheia, coluna de gráfico continua alta. Desligar movimento não é esconder conteúdo.

## Design system

Os tokens vêm do design system **Intelligence Protocol**, exportado do projeto Stitch e guardado em
[`DESIGN.md`](DESIGN.md) — fonte da verdade, não anotação. Inter, corpo 14–16px, superfície `#f7f9fb`,
cards brancos com borda `#e2e8f0` e raio 12px, ciano `#06b6d4` como cor de ação e violeta `#8b5cf6`
para o que é derivado.

Contraste WCAG AA verificado em 22 rotas: zero reprovações. Nenhum botão só com ícone sem nome
acessível. `prefers-reduced-motion` corta deslocamento e rolagem animada preservando a mudança de estado.

## Limites

- Estado somente em memória; recarregar restaura a demonstração.
- Os polígonos e trajetos do mapa são abstratos e não representam divisões nem rotas reais.
- As camadas TSE, IBGE e ANAC exibidas são simulações visuais, não integrações.
- E-mails usam o domínio reservado `exemplo.invalid`.
- **Prestação de contas não substitui o sistema oficial** nem gera peça contábil válida.
- **Cruzamento de dados não consulta modelo externo**: cruza apenas as bases fictícias do protótipo.
- Os preços na tela de planos são fictícios e servem só para mostrar o formato da vitrine.

## Tema claro e escuro

Três estados, não dois: **Seguir o sistema**, **Claro**, **Escuro**. Um alternador de dois estados
obriga quem usa o SO no escuro a reescolher em cada máquina e ignora uma preferência já declarada.
Trocável no ícone da barra superior ou em *Configurações → Aparência*.

O tema é aplicado em [`index.html`](index.html) **antes do React montar** — se esperar o JS, a página
pisca branco por um quadro para quem usa o escuro.

O escuro **não é o claro invertido**. No escuro a sombra praticamente desaparece, então quem separa as
camadas passa a ser a diferença de luminância entre superfícies mais a borda; por isso `--superficie-2`
(card) é mais *clara* que o canvas ali, ao contrário do tema claro.

Pill, avatar e estado ativo carregam par cor+fundo casado: no escuro o par **inverte**, não muda de tom.
Por isso eles ficam num bloco de sobrescrita explícito em vez de virarem token.

Contraste WCAG AA verificado nos **dois temas**, rota a rota.
