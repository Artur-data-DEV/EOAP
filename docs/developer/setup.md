# Setup — Configuração do Ambiente de Desenvolvimento

Este documento descreve o processo **exato** para configurar uma PDI + Fluent SDK para trabalhar no EOAP ou em um projeto baseado neste template.

## 1. Pré-requisitos

- Node.js v20 ou superior
- npm (vem com o Node)
- Git
- Conta admin em uma **Personal Developer Instance (PDI)** do ServiceNow
- (Recomendado) Um editor com suporte a TypeScript (VS Code, Cursor, etc.)

## 2. Clonar o repositório

```powershell
git clone https://github.com/Artur-data-DEV/EOAP.git
cd EOAP
```

## 3. Instalar dependências

```powershell
npm install
```

## 4. Criar a aplicação escopada na PDI

1. Acesse sua PDI como admin.
2. Vá para **All > System Applications > Applications**.
3. Clique em **New**.
4. Preencha:
   - **Name**: `EOAP - Enterprise Operations Automation Platform`
   - **Scope**: `x_eoap`
   - **Description**: `Enterprise Operations Automation Platform - Official Template`
5. Salve e **ative** a aplicação.

## 5. Obter o scopeId

1. Após criar a app, abra o registro da aplicação (`sys_app.do`).
2. Copie o **sys_id** (32 caracteres hexadecimais).
3. Cole no arquivo `now.config.json`:

```json
{
  "scope": "x_eoap",
  "scopeId": "SEU_SYS_ID_AQUI",
  "name": "EOAP - Enterprise Operations Automation Platform",
  "tsconfigPath": "./src/server/tsconfig.json"
}
```

## 6. Configurar autenticação com now-sdk

```powershell
# Adicionar sua PDI como alias "pdi"
npx now-sdk auth --add https://<seu-pdi>.service-now.com --alias pdi --type oauth

# Verificar
npx now-sdk auth --list
```

> **Nota**: OAuth é recomendado. Siga o fluxo no browser quando solicitado.

## 7. Primeiro Build

```powershell
npm run build
```

Se o build passar sem erros, a estrutura Fluent está correta.

## 8. Primeiro Deploy

```powershell
npm run deploy
```

Ou, na primeira vez / após grandes mudanças:

```powershell
npm run deploy:reinstall
```

## 9. Verificação pós-deploy

- Abra `sys_app.do?sys_id=<scopeId>` na PDI e confirme a versão.
- Verifique se as tabelas `x_eoap_user_access` e `x_eoap_audit_trail` foram criadas.
- Confirme que as roles `x_eoap.admin` e `x_eoap.auditor` existem.

## Comandos úteis

```powershell
npm run build                 # Compila os artefatos Fluent
npm run deploy                # Instala/atualiza na PDI
npm run deploy:reinstall      # Reinstala completamente
npx now-sdk auth --list       # Lista conexões
npx now-sdk clean             # Limpa artefatos gerados
```

## Problemas comuns

- **scopeId inválido**: Deve ser exatamente 32 caracteres hex ou "global".
- **Auth expirado**: Rode novamente o comando `auth --add`.
- **Build falha**: Verifique imports (`@servicenow/sdk/core`) e uso de `Now.ID` onde obrigatório.

---

**Próximo passo**: Leia [fluent-guide.md](./fluent-guide.md) para entender os padrões de código.
