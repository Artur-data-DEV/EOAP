# Developer Getting Started — EOAP Template

Este documento explica como usar este repositório como **Template Oficial** para novos projetos ServiceNow Scoped Apps e como trabalhar no EOAP propriamente dito.

## 1. Pré-requisitos

- Node.js 20+
- npm
- Acesso a uma PDI ServiceNow como admin
- Git
- (Recomendado) now-sdk auth configurado

## 2. Bootstrap de um novo projeto a partir deste template

1. Clone ou use este repositório como template no GitHub.
2. Renomeie o pacote e escopo conforme necessário (substitua `x_eoap` e `eoap`).
3. Atualize `now.config.json`:
   ```json
   {
     "scope": "x_suaorg_seuapp",
     "scopeId": "<sys_id_da_app_na_pdi>",
     "name": "Nome da Sua Aplicação"
   }
   ```
4. `npm install`
5. Crie a aplicação escopada na PDI com o scope correspondente.
6. Cole o `scopeId`.
7. `npm run build`
8. Configure auth:
   ```powershell
   npx now-sdk auth --add https://<pdi>.service-now.com --alias dev --type oauth
   ```
9. `npm run deploy`

## 3. Comandos essenciais

```powershell
npm run build                 # Gera dist/ e src/fluent/generated/
npm run deploy                # Instala/atualiza na PDI (requer build prévio)
npm run deploy:reinstall      # Reinstala completamente (útil em problemas de escopo)
npm run auth:list             # Lista aliases configurados
```

## 4. Fluxo de desenvolvimento agentic (recomendado)

1. Abra uma issue ou forneça um prompt claro ao Supervisor.
2. Supervisor planeja e delega para Code Agent + Doc Agent + Validator Agent.
3. Código é gerado em `src/fluent/...` seguindo estrutura obrigatória.
4. Validator Agent emite relatório.
5. Doc Agent atualiza artefatos e ADRs.
6. Supervisor propõe commit + instruções de deploy + atualização de VTB.
7. Humano executa os comandos e confirma no VTB.

## 5. Estrutura que você deve respeitar

Ver `agents/README.md` e a estrutura de `src/fluent/` (core, access, governance, integrations, automation).

## 6. Resolvendo o scopeId

O `now.config.json` contém `"scopeId": "TO_BE_POPULATED_AFTER_APP_CREATION"`.

Após criar a aplicação na PDI:
- Abra a aplicação em `sys_app.do`
- Copie o sys_id de 32 caracteres hexadecimais
- Cole no arquivo
- Rode `npm run build` novamente

## 7. Híbrido controlado

- Tudo que o Fluent SDK suporta → código em `.now.ts`
- O que ainda exige UI (certos Flows complexos, Dashboards, Catalog Items completos, alguns campos em tabelas OOB) → documente o procedimento exato em `docs/03-Execution/Artifacts/` e no Implementation Guide, e planeie automação futura.

Nunca deixe artefatos manuais sem documentação de como reproduzi-los a partir do Git.
