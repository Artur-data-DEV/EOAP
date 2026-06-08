# Sprint 1 — Foundation Layer

| Atributo | Valor |
|----------|-------|
| **Duração** | 2 semanas |
| **Objetivo** | Construir a base de dados, segurança e governança do MVP |
| **Sprint Board** | Visual Task Board |
| **Status** | To Do |

---

## Sprint Board
| Coluna | Cartões |
|--------|---------|
| **To Do** | SP1-001, SP1-002, SP1-003, SP1-004, SP1-005, SP1-006 |
| **In Progress** | |
| **Done** | |

---

## Histórias e Tasks
### STORY-001 — Criar tabela `x_eoap_user_access`
**Cartão**: SP1-001  
**MVP Component**: `x_eoap_user_access`  
**Artefato Relacionado**: `03-Execution/Artifacts/tables/x_eoap_user_access.md`

#### Tasks
- [ ] Criar tabela `x_eoap_user_access` (standalone) no escopo `x_eoap`
- [ ] Adicionar campos conforme especificação
- [ ] Criar índices: `user`, `application`, `status`
- [ ] Criar formulário e lista
- [ ] Adicionar ao menu `EOAP`

#### Definition of Done
- [ ] Tabela existe no escopo correto
- [ ] Todos os campos criados com tipos e referências válidas
- [ ] Índices configurados
- [ ] Formulário e lista acessíveis
- [ ] Teste: Criar registro manualmente como `x_eoap_admin` com sucesso

---

### STORY-002 — Criar tabela `x_eoap_audit_trail`
**Cartão**: SP1-002  
**MVP Component**: `x_eoap_audit_trail`  
**Artefato Relacionado**: `03-Execution/Artifacts/tables/x_eoap_audit_trail.md`

#### Tasks
- [ ] Criar tabela `x_eoap_audit_trail` (standalone) no escopo `x_eoap`
- [ ] Adicionar campos conforme especificação
- [ ] Criar índices: `entity_type`, `entity_sys_id`, `correlation_id`
- [ ] Criar formulário e lista
- [ ] Adicionar ao menu `EOAP`

#### Definition of Done
- [ ] Tabela existe no escopo correto
- [ ] Todos os campos criados com tipos e referências válidas
- [ ] Índices configurados
- [ ] Formulário e lista acessíveis
- [ ] Teste: Criar registro manualmente como `x_eoap_admin` com sucesso

---

### STORY-003 — Adicionar campo `x_eoap_access_owner`
**Cartão**: SP1-003  
**MVP Component**: `x_eoap_access_owner`

#### Tasks
- [ ] Adicionar campo `x_eoap_access_owner` à tabela `cmdb_ci_business_app`
- [ ] Tipo: `Reference → sys_user`
- [ ] Adicionar ao formulário padrão de Business Application
- [ ] Configurar ACL para permitir `x_eoap_admin` editar

#### Definition of Done
- [ ] Campo existe na tabela global
- [ ] Campo é visível no formulário
- [ ] `x_eoap_admin` pode editar, outros não

---

### STORY-004 — Criar roles
**Cartão**: SP1-004  
**MVP Component**: RBAC

#### Tasks
- [ ] Criar role `x_eoap_admin`
- [ ] Criar role `x_eoap_auditor`
- [ ] Atribuir `x_eoap_admin` ao usuário de desenvolvimento

#### Definition of Done
- [ ] Roles existem no sistema
- [ ] Role atribuída corretamente
- [ ] Roles aparecem na lista de roles

---

### STORY-005 — Configurar ACLs
**Cartão**: SP1-005  
**MVP Component**: ACLs

#### Tasks
- [ ] Configurar ACLs para `x_eoap_user_access`
  - `create`: `system/service only`
  - `read`: `x_eoap_admin`, `x_eoap_auditor`
  - `write`: `x_eoap_admin`
  - `delete`: `none`
- [ ] Configurar ACLs para `x_eoap_audit_trail`
  - `create`: `EOAP_AuditLogger only` (service context)
  - `read`: `x_eoap_admin`, `x_eoap_auditor`
  - `write`: `none`
  - `delete`: `none`

#### Definition of Done
- [ ] Todas as ACLs aplicadas
- [ ] Teste: Usuário sem role não consegue acessar
- [ ] Teste: `x_eoap_auditor` só lê, não edita
- [ ] Teste: `x_eoap_admin` tem acesso completo

---

### STORY-006 — Criar Business Rules de proteção
**Cartão**: SP1-006  
**MVP Component**: Business Rules

#### Tasks
- [ ] Criar `BR_EOAP_UserAccess_Delete_Protect`
  - Table: `x_eoap_user_access`
  - When: `Before`
  - Operation: `Delete`
  - Condition: `true`
  - Action: `Abort action`
- [ ] Criar `BR_EOAP_AuditTrail_Protect_Write`
  - Table: `x_eoap_audit_trail`
  - When: `Before`
  - Operation: `Write`
  - Condition: `true`
  - Action: `Abort action`
- [ ] Criar `BR_EOAP_AuditTrail_Protect_Delete`
  - Table: `x_eoap_audit_trail`
  - When: `Before`
  - Operation: `Delete`
  - Condition: `true`
  - Action: `Abort action`

#### Definition of Done
- [ ] Todas as BR existem e estão ativas
- [ ] Teste: Tentar deletar `x_eoap_user_access` → abortado
- [ ] Teste: Tentar editar/deletar `x_eoap_audit_trail` → abortado

---

## Traceability
| Story | Cartão | MVP Component | Artefato |
|-------|--------|----------------|----------|
| STORY-001 | SP1-001 | x_eoap_user_access | artifacts/tables/x_eoap_user_access.md |
| STORY-002 | SP1-002 | x_eoap_audit_trail | artifacts/tables/x_eoap_audit_trail.md |
| STORY-003 | SP1-003 | x_eoap_access_owner | |
| STORY-004 | SP1-004 | RBAC | |
| STORY-005 | SP1-005 | ACLs | artifacts/acls/ |
| STORY-006 | SP1-006 | Business Rules | artifacts/business-rules/ |
