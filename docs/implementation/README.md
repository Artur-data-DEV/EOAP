# Implementação

Guias práticos de implementação do EOAP.

## Arquivos principais

- [mvp-guide.md](./mvp-guide.md) — Guia completo do MVP (Fonte Única da Verdade para implementação)
- step-by-step/ — Guias detalhados passo a passo por sprint ou componente

## Como usar

O guia `mvp-guide.md` é o documento de referência para o que deve ser implementado e em que ordem.

Todo código em `src/fluent/` deve ter referência clara ao artefato ou seção correspondente neste diretório.

## Status

A implementação segue uma abordagem **Fluent SDK first** com elementos híbridos controlados quando o SDK ainda não cobre 100% do artefato (ex: Dashboards complexos, alguns Catalog Items).

Para o status atual dos componentes, consulte a tabela no início do `mvp-guide.md`.
