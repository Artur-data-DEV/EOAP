# EOAP — MVP Implementation Guide (Fonte Única da Verdade)

| Atributo | Valor |
|----------|-------|
| **Documento** | EOAP-MVP-Implementation-Guide.md |
| **Status** | Final (atualizado com implementação via Fluent SDK) |
| **Fonte Única da Verdade** | Sim |
| **Plataforma** | ServiceNow — PDI |
| **Escopo da Aplicação** | `x_eoap` (aplicação escopada, **não global**) |
| **Abordagem** | Fluent SDK primeiro (Git como fonte da verdade) + híbrido controlado quando necessário |

---

## 1. Definição da Aplicação
A EOAP é uma **aplicação escopada no ServiceNow** (`x_eoap`), não usa o escopo global. Ela reside na **PDI (Personal Developer Instance)** do ServiceNow.

Todo artefato principal é definido em código em `src/fluent/` e deployado via `now-sdk`.

---

## 2. Inventário Completo dos Componentes (Status de Implementação)

| Tipo | Componente | Artefato Relacionado | Status no Código |
|------|------------|----------------------|------------------|
| **Tabelas** | `x_eoap_user_access`, `x_eoap_audit_trail` | `src/fluent/access/`, `src/fluent/governance/audit/` | ✅ Implementado (Fluent) |
| **Campo Global** | `x_eoap_access_owner` em `cmdb_ci_business_app` | `src/fluent/core/extensions/cmdb_ci_business_app.now.ts` | ✅ Esqueleto + procedimento híbrido documentado |
| **Script Includes** | `EOAP_AuditLogger`, `EOAP_AccessGovernanceService` | `src/fluent/governance/audit/`, `src/fluent/governance/services/` | ✅ Implementado (Fluent) |
| **Flows** | `EOAP_Flow_Employee_Offboarding`, `EOAP_Flow_Access_Revocation` | `src/fluent/automation/flows/` | ✅ Esqueletos implementados (refinar no Designer) |
| **Business Rules** | 3 regras de proteção | `src/fluent/governance/business-rules.now.ts` + protect scripts | ✅ Implementado |
| **ACLs** | 8 regras deny-by-default | `src/fluent/governance/rbac/acls.now.ts` | ✅ Implementado |
| **Roles** | `x_eoap_admin`, `x_eoap_auditor` | `src/fluent/governance/rbac/roles.now.ts` | ✅ Implementado |
| **Scheduled Job** | `EOAP_Job_Reconciliation` | `src/fluent/automation/jobs/` | ✅ Script Include + instruções de agendamento |
| **Dashboard** | `EOAP Access Governance Dashboard` | `docs/03-Execution/Artifacts/dashboards/` | ⏳ Pendente (pós Sprint 2) |
| **Catalog Item** | `EOAP Manual Offboarding` | `docs/03-Execution/Artifacts/catalog-items/` | ⏳ Pendente (pós Sprint 2) |

---

## 3. Passo-a-Passo Completo (atualizado para abordagem Fluent SDK)

### Sprint 0: Setup (Ação Manual na PDI + Configuração Local)

1. Acessar a PDI ServiceNow como admin.
2. Criar a **aplicação escopada** `x_eoap`:
   - Nome: `EOAP - Enterprise Operations Automation Platform`
   - Escopo: `x_eoap`
   - Ativar a aplicação.
3. Copiar o `sys_id` da aplicação (em `sys_app.do`).
4. No repositório local:
   - Editar `now.config.json` e preencher `"scopeId"`.
   - `npm install`
   - `npm run build`
5. Configurar autenticação:
   ```powershell
   npx now-sdk auth --add https://<seu-pdi>.service-now.com --alias pdi --type oauth
   ```
6. Criar o menu principal `EOAP` (pode ser feito manualmente ou via UI).
7. Criar o **Visual Task Board** (template Scrum Agile) e adicionar as stories.
8. Executar o primeiro deploy:
   ```powershell
   npm run deploy
   ```

### Sprint 1: Foundation (Majoritariamente em Código)

Os itens abaixo já estão implementados em `src/fluent/`:

1. Tabela `x_eoap_user_access` → `src/fluent/access/x_eoap_user_access.now.ts`
2. Tabela `x_eoap_audit_trail` → `src/fluent/governance/audit/x_eoap_audit_trail.now.ts`
3. Campo `x_eoap_access_owner` → procedimento em `src/fluent/core/extensions/cmdb_ci_business_app.now.ts`
4. Roles `x_eoap_admin` / `x_eoap_auditor` → `src/fluent/governance/rbac/roles.now.ts`
5. ACLs → `src/fluent/governance/rbac/acls.now.ts`
6. Business Rules de proteção → `src/fluent/governance/business-rules.now.ts` + scripts

**Ação**: Após preencher o scopeId e rodar `npm run build && npm run deploy`, as tabelas, roles, ACLs e BRs estarão na PDI.

### Sprint 2: Governance Core

1. Script Includes `EOAP_AuditLogger` e `EOAP_AccessGovernanceService` → já em `src/fluent/governance/`
2. Flow `EOAP_Flow_Employee_Offboarding` → `src/fluent/automation/flows/EOAP_Flow_Employee_Offboarding.now.ts`
3. Flow `EOAP_Flow_Access_Revocation` → `src/fluent/automation/flows/EOAP_Flow_Access_Revocation.now.ts`
4. Catalog Item `EOAP Manual Offboarding` → Pendente (recomendado criar via UI e documentar, ou Record producer futuro)

### Sprint 3: Automation & Reporting

1. Scheduled Job `EOAP_Job_Reconciliation` → `src/fluent/automation/jobs/EOAP_Job_Reconciliation.now.ts` (Script Include) + instruções de agendamento manual na PDI.
2. Access Governance Dashboard → Pendente.

### Sprint 4: Demo & Polish
Ver seção 4 abaixo.

---

## 4. Roteiro de Demonstração (10 minutos)
(Mantido do original — atualizar evidências após deploy real)

1. **Problema (2 min)**
2. **Arquitetura (2 min)**
3. **Demo (4 min)**
4. **Diferenciais (2 min)**

---

## 5. Como Executar o Deploy (Comandos Exatos)

```powershell
# 1. Preencher scopeId em now.config.json (obrigatório)
# 2. Instalar dependências (uma vez)
npm install

# 3. Build (sempre antes de deploy)
npm run build

# 4. Deploy
npm run deploy
```

Para reinstalar completamente (útil na primeira vez ou após grandes mudanças):
```powershell
npm run deploy:reinstall
```

---

## 6. Por que o MVP É Tão Simples? (Justificativa das Escolhas)
(Mantido do original, com nota de que a maioria dos componentes agora vive em código versionado no Git.)

---

## 7. Princípios Aplicados
- **Implementation is the Source of Truth**: Código em `src/fluent/` + `src/server/` é a referência.
- **Git como única fonte da verdade**
- **OOB First**
- **Configuration over Code** (sempre que possível)
- **Auditability by Design**
- **Deny-by-Default**
- **Híbrido Controlado**: Quando o SDK não cobre 100% (ex: Dashboards complexos, alguns Flows), documentamos o passo manual e o artefato.

---

**Última atualização**: Após reestruturação do template e introdução do sistema agentic (Supervisor + Agents).
