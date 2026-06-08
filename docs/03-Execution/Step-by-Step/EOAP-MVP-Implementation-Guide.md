# EOAP — MVP Implementation Guide (Fonte Única da Verdade)

| Atributo | Valor |
|----------|-------|
| **Documento** | EOAP-MVP-Implementation-Guide.md |
| **Status** | Final |
| **Fonte Única da Verdade** | Sim |
| **Plataforma** | ServiceNow — PDI |
| **Escopo da Aplicação** | `x_eoap` (aplicação escopada, **não global**) |

---

## 1. Definição da Aplicação
A EOAP é uma **aplicação escopada no ServiceNow** (`x_eoap`), não usa o escopo global. Ela reside na **PDI (Personal Developer Instance)** do ServiceNow.

---

## 2. Inventário Completo dos Componentes
| Tipo | Componente | Artefato Relacionado |
|------|------------|----------------------|
| **Tabelas** | `x_eoap_user_access`, `x_eoap_audit_trail` | `tables/` |
| **Campo Global** | `x_eoap_access_owner` em `cmdb_ci_business_app` | — |
| **Script Includes** | `EOAP_AuditLogger`, `EOAP_AccessGovernanceService` | `script-includes/` |
| **Flows** | `EOAP_Flow_Employee_Offboarding`, `EOAP_Flow_Access_Revocation` | `flows/` |
| **Business Rules** | 3 regras de proteção | `business-rules/` |
| **ACLs** | 5 regras deny-by-default | `acls/` |
| **Roles** | `x_eoap_admin`, `x_eoap_auditor` | `roles/` |
| **Dashboard** | `EOAP Access Governance Dashboard` | `dashboards/` |
| **Catalog Item** | `EOAP Manual Offboarding` | `catalog-items/` |
| **Scheduled Job** | `EOAP_Job_Reconciliation` | `scheduled-jobs/` |

---

## 3. Passo-a-Passo Completo
### Sprint 0: Setup
1. Acessar a PDI ServiceNow como admin.
2. Criar a **aplicação escopada** `x_eoap`:
   - Nome: `EOAP - Enterprise Operations Automation Platform`
   - Escopo: `x_eoap`
   - Ativar a aplicação.
3. Criar o menu principal `EOAP`.
4. Criar o **Visual Task Board** (template Scrum Agile).
5. Adicionar stories do Sprint 1 ao board.

---

### Sprint 1: Foundation
1. Criar tabela `x_eoap_user_access` (ver `tables/x_eoap_user_access.md`).
2. Criar tabela `x_eoap_audit_trail` (ver `tables/x_eoap_audit_trail.md`).
3. Adicionar campo `x_eoap_access_owner` a `cmdb_ci_business_app`.
4. Criar roles `x_eoap_admin` e `x_eoap_auditor` (ver `roles/README.md`).
5. Configurar ACLs (ver `acls/README.md`).
6. Criar Business Rules (ver `business-rules/README.md`).

---

### Sprint 2: Governance Core
1. Criar Script Include `EOAP_AuditLogger` (ver `script-includes/EOAP_AuditLogger.md`).
2. Criar Script Include `EOAP_AccessGovernanceService` (ver `script-includes/EOAP_AccessGovernanceService.md`).
3. Criar Flow `EOAP_Flow_Employee_Offboarding` (ver `flows/EOAP_Flow_Employee_Offboarding.md`).
4. Criar Flow `EOAP_Flow_Access_Revocation` (ver `flows/EOAP_Flow_Access_Revocation.md`).
5. Criar Catalog Item `EOAP Manual Offboarding` (ver `catalog-items/EOAP_Manual_Offboarding.md`).

---

### Sprint 3: Automation & Reporting
1. Criar Scheduled Job `EOAP_Job_Reconciliation` (ver `scheduled-jobs/EOAP_Job_Reconciliation.md`).
2. Criar Access Governance Dashboard (ver `dashboards/Access_Governance_Dashboard.md`).

---

### Sprint 4: Demo & Polish
1. Realizar testes end-to-end.
2. Corrigir bugs.
3. Preparar demonstração de 10 minutos.
4. Salvar evidências no `05-Evidence/`.

---

## 4. Roteiro de Demonstração (10 minutos)
1. **Problema (2 min)**: Mostrar o problema do offboarding manual.
2. **Arquitetura (2 min)**: Apresentar a estrutura do MVP.
3. **Demo (4 min)**:
   - Criar usuário de teste, Business Application, acesso ativo.
   - Mostrar dashboard (Total Active Accesses = 1).
   - Marcar usuário como `terminated` → ver revogação automática.
   - Ver audit trail.
   - Ver dashboard atualizado (Total Active Accesses = 0).
4. **Diferenciais (2 min)**: Mostrar o valor da solução.

---

## 5. Por que o MVP É Tão Simples? (Justificativa das Escolhas)
O MVP **não é uma plataforma enterprise** — é a **menor solução que resolve um problema real** (offboarding manual + governança de acessos). Abaixo, as justificativas para cada escolha:

| Componente (ou falta dele) | Justificativa |
|-----------------------------|----------------|
| **Apenas 2 tabelas customizadas** | `x_eoap_user_access` resolve o problema de governança de acessos (não existe OOB com lifecycle completo), e `x_eoap_audit_trail` resolve o audit trail semântico (não técnico). |
| **Apenas 2 Script Includes** | O mínimo necessário para centralizar lógica reutilizável (audit logging e acesso). |
| **Sem Decision Tables** | Não há necessidade de regras complexas no MVP — regras são simples e diretas no Flow/Script Includes. |
| **Sem Subflows** | Os flows são curtos o suficiente para não precisar de modularização no MVP. |
| **Sem Record Producer** | O Catalog Item é suficiente para o offboarding manual; Record Producer não adiciona valor inicial. |
| **Audit Trail customizado (não OOB)** | O audit trail nativo do ServiceNow é **técnico** (log de campos alterados, sem contexto de negócio). O audit trail customizado é **semântico**: registra *por que* a ação foi feita, *qual foi o resultado*, e tem `correlation_id` para tracing end-to-end — essencial para compliance. |

---

## 6. Princípios Aplicados
- **Implementation is the Source of Truth**: Este guia é a referência final.
- **OOB First**: Usar recursos nativos do ServiceNow sempre que possível.
- **Configuration over Code**: Preferir Flow Designer/Decision Tables a scripts.
- **Auditability by Design**: Todas as ações são logadas.
- **Deny-by-Default**: ACLs começam bloqueando tudo.
