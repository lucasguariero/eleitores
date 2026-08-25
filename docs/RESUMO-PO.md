# Resumo das Implementações - Eleitores

**Data:** 25 de Agosto de 2026

---

## O que foi feito?

Fizemos uma análise comparativa entre o sistema atual (K8s/União) e o protótipo Eleitores para identificar o que já existe e o que precisava ser melhorado.

---

## Funcionalidades Novas que Implementamos

| # | Funcionalidade | O que faz |
|---|----------------|-----------|
| 1 | **Lista Pessoas TSE** | Mostra pessoas que vêm do TSE mas ainda não são lideranças. Tem botão para "promover" para liderança. |
| 2 | **Ícone de Sync** | Um ícone de sincronização (🔄) ao lado do Partido para mostrar que aquele dado vem do TSE. |
| 3 | **Vínculo Equipe ↔ Liderança** | Quando alguém da equipe também é liderança, aparece uma tag avisando. |
| 4 | **Dados Pessoais na Minha Conta** | Nova aba na página "Minha Conta" com nome, e-mail, telefone e vínculos da pessoa. |

---

## Páginas que Já Existiam (Verificamos e estão OK)

| Página | Status |
|--------|--------|
| Perfil do Candidato (com Editar e Inativar) | ✅ Já funciona |
| Página do Município (com Festas, Responsáveis, Vereadores) | ✅ Já funciona |
| Agenda | ✅ Já funciona |
| Aniversários | ✅ Já funciona |
| Configurações / Parametrizações | ✅ Já funciona |

---

## Conceitos Importantes

Para entender o sistema, é bom saber a diferença entre:

- **Equipe** → Quem trabalha no grupo político (funcionários, prestadores, voluntários)
- **Liderança** → Pessoas avaliadas politicamente (candidatos, lideranças comunitárias)
- **Usuário** → Conta de acesso ao sistema (pode ser as duas coisas acima ou nenhuma)

Uma mesma pessoa pode ser:
- Só equipe
- Só liderança
- Equipe + Liderança (quando um funcionário também é candidato)
- Só usuário (quando alguém só acessa o sistema sem ser nenhuma das anteriores)

---

## Próximos Passos (se precisar)

Se quiser, podemos:

1. Implementar a página completa de Equipe (ficha detalhada como tem para candidato)
2. Definir os campos de parametrização (Atributos, Áreas, Grupos)
3. Adicionar mais campos no formulário de usuário

---

**Feito com análise e cuidado!** 🚀
