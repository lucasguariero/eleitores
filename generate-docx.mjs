import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import fs from 'fs';

const doc = new Document({
  styles: {
    default: {
      font: "Arial"
    }
  },
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        text: "Especificação de Tela: Módulo Municípios",
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      }),

      new Paragraph({
        children: [
          new TextRun({ text: "Visão Geral", bold: true, size: 28, font: "Arial" }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),

      new Paragraph({ text: "Nome do módulo: Municípios", spacing: { after: 100 } }),
      new Paragraph({ text: "Localização no menu: Território → Municípios", spacing: { after: 100 } }),
      new Paragraph({ text: "Objetivo: Gerenciar dossiês municipais com dados oficiais (IBGE/TSE) e observações internas da equipe.", spacing: { after: 300 } }),

      // Tela 1
      new Paragraph({
        children: [new TextRun({ text: "Tela 1: Lista de Municípios", bold: true, size: 28, font: "Arial" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),

      new Paragraph({ text: "Header", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Título: Nome da página", spacing: { after: 50 } }),
      new Paragraph({ text: "• Subtítulo: Descrição curta do propósito da página", spacing: { after: 50 } }),
      new Paragraph({ text: "• Ações: Botões de ação primária e secundária", spacing: { after: 200 } }),

      new Paragraph({ text: "Métricas (3 cards)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Card 1: Métrica principal com valor e delta", spacing: { after: 50 } }),
      new Paragraph({ text: "• Card 2: Métrica secundária", spacing: { after: 50 } }),
      new Paragraph({ text: "• Card 3: Métrica com alerta (cliqueável para filtro)", spacing: { after: 200 } }),

      new Paragraph({ text: "Abas", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Aba 1: Lista principal (ativa por padrão)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Aba 2: Visão alternativa (ex: divisões, grupos)", spacing: { after: 200 } }),

      new Paragraph({ text: "Filtros", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Busca: Campo de texto com ícone de lupa", spacing: { after: 50 } }),
      new Paragraph({ text: "• Dropdown: Selecionar categoria para filtrar", spacing: { after: 50 } }),
      new Paragraph({ text: "• Toggle: Alternar entre visualizações (ex: Todos / Favoritos)", spacing: { after: 200 } }),

      new Paragraph({ text: "Lista de Cards", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "Cada card:", spacing: { after: 100 } }),
      new Paragraph({ text: "• Identificação: Nome + código + categoria", spacing: { after: 50 } }),
      new Paragraph({ text: "• Badge: Status ou标签 (se aplicável)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Info principal: Pessoa-chave + partido/organização", spacing: { after: 50 } }),
      new Paragraph({ text: "• Métricas: Números relevantes (população, eleitores, etc)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Progresso: Barra de completude com %", spacing: { after: 50 } }),
      new Paragraph({ text: "• Ação: Botão para ir ao detalhe →", spacing: { after: 300 } }),

      // Tela 2
      new Paragraph({
        children: [new TextRun({ text: "Tela 2: Detalhe / Ficha", bold: true, size: 28, font: "Arial" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),

      new Paragraph({ text: "Rota: #módulo/perfil/{id}", spacing: { after: 200 } }),

      new Paragraph({ text: "Header", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Breadcrumb: Voltar para a lista", spacing: { after: 50 } }),
      new Paragraph({ text: "• Título: Nome do registro", spacing: { after: 50 } }),
      new Paragraph({ text: "• Subtítulo: Informações secundárias (divisão, distância, etc)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Ações: Navegar próximo | Exportar | Editar", spacing: { after: 200 } }),

      new Paragraph({ text: "Faixa de Completude", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Indicador visual grande com %", spacing: { after: 50 } }),
      new Paragraph({ text: "• Barra de progresso", spacing: { after: 50 } }),
      new Paragraph({ text: "• Meta: Quem atualizou + data", spacing: { after: 200 } }),

      new Paragraph({ text: "Bloco 1: Dados Oficiais (somente leitura)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Dados de fontes externas (IBGE, TSE, etc)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Badge indicando última sincronização", spacing: { after: 200 } }),

      new Paragraph({ text: "Bloco 2: Dados Internos (equipe)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Campos preenchidos pela equipe", spacing: { after: 50 } }),
      new Paragraph({ text: "• Estilo visual indica campos vazios vs preenchidos", spacing: { after: 200 } }),

      new Paragraph({ text: "Bloco 3: Registros Vinculados (accordion)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Lista de registros relacionados", spacing: { after: 50 } }),
      new Paragraph({ text: "• Cliqueável para navegar ao detalhe", spacing: { after: 200 } }),

      new Paragraph({ text: "Bloco 4: Histórico / Resultados (accordion)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Dados temporais (anos, períodos)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Visualização com barras ou gráficos", spacing: { after: 200 } }),

      new Paragraph({ text: "Sidebar: Pendências", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Lista de campos não preenchidos", spacing: { after: 50 } }),
      new Paragraph({ text: "• Justificativa do campo (por que é importante)", spacing: { after: 50 } }),
      new Paragraph({ text: "• Ação rápida para completar", spacing: { after: 300 } }),

      // Campos
      new Paragraph({
        children: [new TextRun({ text: "Campos do Dossiê Municipal", bold: true, size: 28, font: "Arial" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),

      new Paragraph({ text: "Dados Obrigatórios (IBGE/TSE)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Código: Identificação única do registro", spacing: { after: 50 } }),
      new Paragraph({ text: "• Nome: Nome oficial", spacing: { after: 50 } }),
      new Paragraph({ text: "• Campo numérico 1: Dado quantitativo principal", spacing: { after: 50 } }),
      new Paragraph({ text: "• Campo numérico 2: Dado quantitativo secundário", spacing: { after: 50 } }),
      new Paragraph({ text: "• Categoria: Divisão organizacional", spacing: { after: 50 } }),
      new Paragraph({ text: "• Campo de distância/localização", spacing: { after: 50 } }),
      new Paragraph({ text: "• Pessoa-chave 1: Nome + identificação", spacing: { after: 50 } }),
      new Paragraph({ text: "• Pessoa-chave 2: Nome + identificação", spacing: { after: 200 } }),

      new Paragraph({ text: "Dados Opcionais (Equipe)", bold: true, spacing: { after: 100 } }),
      new Paragraph({ text: "• Data comemorativa", spacing: { after: 50 } }),
      new Paragraph({ text: "• Informação cultural/regional", spacing: { after: 50 } }),
      new Paragraph({ text: "• Infraestrutura relevante", spacing: { after: 50 } }),
      new Paragraph({ text: "• Observações: Texto livre com contexto", spacing: { after: 300 } }),

      // Critérios
      new Paragraph({
        children: [new TextRun({ text: "Critérios de Completude", bold: true, size: 28, font: "Arial" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),

      new Paragraph({ text: "• Completo: ≥80% dos campos preenchidos", spacing: { after: 50 } }),
      new Paragraph({ text: "• Crítico: <40% — requer atenção imediata", spacing: { after: 300 } }),

      // Notas
      new Paragraph({
        children: [new TextRun({ text: "Notas Técnicas", bold: true, size: 28, font: "Arial" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),

      new Paragraph({ text: "• Dados fictícios no protótipo — API real virá de IBGE/TSE", spacing: { after: 50 } }),
      new Paragraph({ text: "• Divisão territorial configurável por tenant/contrato", spacing: { after: 50 } }),
      new Paragraph({ text: "• Completude calculada dinamicamente baseada nos campos preenchidos", spacing: { after: 50 } }),
      new Paragraph({ text: "• Histórico de alterações deve ser auditável (quem, quando)", spacing: { after: 50 } }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('MUNICIPIOS-spec-generic.docx', buffer);
  console.log('Documento criado: MUNICIPIOS-spec-generic.docx');
});
