# Now Create Structure Map - EOAP

| Atributo | Valor |
| --- | --- |
| Documento | Now Create Structure Map |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect, CTA |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Proposto** |
| Classificação | Confidencial — Documento de Estrutura Corporativa |

> **Propósito**: Mapear estrutura atual do projeto EOAP para a metodologia Now Create. Define onde cada documento deve ser organizado por fase.

---

## Now Create Phase Structure

Devido a restrições de criação de diretórios, a estrutura Now Create será implementada conceitualmente através de prefixo de arquivos e organização lógica.

**Convenção de Nomenclatura**:
```
[Phase]-[Document]-[Version].md

Exemplos:
01-Initiate-Project_Charter-v1.0.md
02-Plan-Project_Plan-v1.0.md
03-Design-ADD-v1.0.md
04-Build-Application_Scope-v1.0.md
05-Validate-UAT_Plan-v1.0.md
06-Deploy-Deployment_Strategy-v1.0.md
07-Operate-Support_Model-v1.0.md
```

---

## Phase 01 - Initiate

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| - | 01-Initiate | 01-Initiate-Project_Charter-v1.0.md | **Missing** |
| - | 01-Initiate | 01-Initiate-Stakeholder_Analysis-v1.0.md | **Missing** |
| - | 01-Initiate | 01-Initiate-Business_Case-v1.0.md | **Missing** |
| - | 01-Initiate | 01-Initiate-Requirements_Gathering-v1.0.md | **Missing** |
| ARB.md (executive summary) | 01-Initiate | 01-Initiate-Vision_Statement-v1.0.md | **Partial** |
| NFRs.md (parcial) | 01-Initiate | 01-Initiate-Success_Criteria-v1.0.md | **Partial** |
| - | 01-Initiate | 01-Initiate-Risk_Register-v1.0.md | **Missing** |
| - | 01-Initiate | 01-Initiate-Assumptions_Constraints-v1.0.md | **Missing** |

### Documentos a Criar (Critical)

1. **01-Initiate-Project_Charter-v1.0.md**
   - Escopo do projeto
   - Objetivos e KPIs
   - Stakeholders e RACI
   - Timeline e milestones

2. **01-Initiate-Business_Case-v1.0.md**
   - Problema de negócio
   - Solução proposta
   - ROI e benefícios
   - Análise de custo-benefício

3. **01-Initiate-Requirements_Gathering-v1.0.md**
   - Requisitos funcionais
   - Requisitos não-funcionais
   - Requisitos de compliance
   - Requisitos de integração

---

## Phase 02 - Plan

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| - | 02-Plan | 02-Plan-Project_Plan-v1.0.md | **Missing** |
| - | 02-Plan | 02-Plan-WBS-v1.0.md | **Missing** |
| - | 02-Plan | 02-Plan-Resource_Plan-v1.0.md | **Missing** |
| - | 02-Plan | 02-Plan-Schedule-v1.0.md | **Missing** |
| - | 02-Plan | 02-Plan-Communication_Plan-v1.0.md | **Missing** |
| - | 02-Plan | 02-Plan-Training_Plan-v1.0.md | **Missing** |
| - | 02-Plan | 02-Plan-Change_Management_Plan-v1.0.md | **Missing** |
| Test_Strategy.md, ATF_Strategy.md | 02-Plan | 02-Plan-Quality_Plan-v1.0.md | **Partial** |
| - | 02-Plan | 02-Plan-Budget_Cost_Plan-v1.0.md | **Missing** |

### Documentos a Criar (Critical)

1. **02-Plan-Project_Plan-v1.0.md**
   - WBS detalhado
   - Cronograma com milestones
   - Plano de recursos
   - Orçamento

2. **02-Plan-Communication_Plan-v1.0.md**
   - Stakeholders
   - Canais de comunicação
   - Frequência de updates
   - Escalação

3. **02-Plan-Training_Plan-v1.0.md**
   - Treinamento por role
   - Material de treinamento
   - Cronograma de treinamento
   - Validação de treinamento

---

## Phase 03 - Design

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| ADD.md | 03-Design | 03-Design-ADD-v1.0.md | **Complete** |
| ARB.md | 03-Design | 03-Design-ARB-v1.0.md | **Complete** |
| ARB_REVIEW.md | 03-Design | 03-Design-ARB_Review-v1.0.md | **Complete** |
| SDD.md | 03-Design | 03-Design-SDD-v1.0.md | **Complete** |
| NFRs.md | 03-Design | 03-Design-NFRs-v1.0.md | **Complete** |
| architecture/ADRs/* | 03-Design | 03-Design-ADRs-v1.0.md | **Complete** |
| Security_Model.md | 03-Design | 03-Design-Security_Design-v1.0.md | **Complete** |
| - | 03-Design | 03-Design-Integration_Design-v1.0.md | **Partial** |
| - | 03-Design | 03-Design-UI_UX_Design-v1.0.md | **Missing** |
| - | 03-Design | 03-Design-Process_Design-v1.0.md | **Partial** |
| - | 03-Design | 03-Design-Reporting_Design-v1.0.md | **Partial** |

### Documentos a Criar (High Priority)

1. **03-Design-Integration_Design-v1.0.md**
   - Design de integração IAM
   - Design de integração HRIS
   - Design de integração SIEM
   - Error handling e retry

2. **03-Design-Process_Design-v1.0.md**
   - BPMN diagrams
   - Process flows detalhados
   - Handoffs e approvals

---

## Phase 04 - Build

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| Installation_Guide.md | 04-Build | 04-Build-Application_Scope-v1.0.md | **Complete** |
| Installation_Guide.md | 04-Build | 04-Build-Tables_Fields-v1.0.md | **Complete** |
| Installation_Guide.md | 04-Build | 04-Build-Roles_Groups-v1.0.md | **Complete** |
| Installation_Guide.md | 04-Build | 04-Build-ACLs-v1.0.md | **Complete** |
| SDD.md | 04-Build | 04-Build-Business_Rules-v1.0.md | **Partial** |
| SDD.md | 04-Build | 04-Build-Script_Includes-v1.0.md | **Complete** |
| Configuration_Guide.md | 04-Build | 04-Build-Decision_Tables-v1.0.md | **Complete** |
| Configuration_Guide.md | 04-Build | 04-Build-Flows-v1.0.md | **Complete** |
| - | 04-Build | 04-Build-Subflows-v1.0.md | **Partial** |
| Configuration_Guide.md | 04-Build | 04-Build-Notifications-v1.0.md | **Partial** |
| Configuration_Guide.md | 04-Build | 04-Build-Catalog_Items-v1.0.md | **Partial** |
| - | 04-Build | 04-Build-Record_Producers-v1.0.md | **Missing** |
| - | 04-Build | 04-Build-Service_Portal_Pages-v1.0.md | **Missing** |
| - | 04-Build | 04-Build-Integration_Hub_Spokes-v1.0.md | **Missing** |
| EOAP_REST_API_Spec.md | 04-Build | 04-Build-REST_Messages-v1.0.md | **Partial** |
| SDD.md | 04-Build | 04-Build-Import_Sets-v1.0.md | **Partial** |
| - | 04-Build | 04-Build-Transform_Maps-v1.0.md | **Missing** |
| - | 04-Build | 04-Build-Scheduled_Jobs-v1.0.md | **Missing** |
| - | 04-Build | 04-Build-System_Properties-v1.0.md | **Missing** |

### Documentos a Criar (High Priority)

1. **04-Build-Subflows-v1.0.md**
   - Documentação completa de subflows
   - Inputs, outputs, error handling

2. **04-Build-Integration_Hub_Spokes-v1.0.md**
   - Spokes para IAM, HRIS, SIEM
   - Configuração e testes

3. **04-Build-Scheduled_Jobs-v1.0.md**
   - Jobs de reconciliação
   - Jobs de archiving
   - Jobs de CMDB quality

---

## Phase 05 - Validate

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| Test_Strategy.md | 05-Validate | 05-Validate-Test_Strategy-v1.0.md | **Complete** |
| ATF_Strategy.md | 05-Validate | 05-Validate-ATF_Strategy-v1.0.md | **Complete** |
| - | 05-Validate | 05-Validate-Unit_Test_Plan-v1.0.md | **Missing** |
| Test_Strategy.md | 05-Validate | 05-Validate-Integration_Test_Plan-v1.0.md | **Partial** |
| Test_Strategy.md | 05-Validate | 05-Validate-System_Test_Plan-v1.0.md | **Partial** |
| - | 05-Validate | 05-Validate-UAT_Plan-v1.0.md | **Missing** |
| ATF_Strategy.md | 05-Validate | 05-Validate-Security_Test_Plan-v1.0.md | **Partial** |
| - | 05-Validate | 05-Validate-Performance_Test_Plan-v1.0.md | **Missing** |
| ATF_Strategy.md | 05-Validate | 05-Validate-Test_Cases-v1.0.md | **Partial** |
| - | 05-Validate | 05-Validate-Test_Data_Strategy-v1.0.md | **Missing** |
| - | 05-Validate | 05-Validate-Defect_Management_Plan-v1.0.md | **Missing** |
| evidence/ATF/* | 05-Validate | 05-Validate-Test_Results-v1.0.md | **Partial** |

### Documentos a Criar (Critical)

1. **05-Validate-UAT_Plan-v1.0.md**
   - Scripts de UAT
   - Critérios de aceitação
   - Plano de execução
   - Sign-off process

2. **05-Validate-Performance_Test_Plan-v1.0.md**
   - Load test
   - Stress test
   - Capacity test
   - Performance targets

---

## Phase 06 - Deploy

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| - | 06-Deploy | 06-Deploy-Deployment_Strategy-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Deployment_Checklist-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Cutover_Plan-v1.0.md | **Missing** |
| Installation_Guide.md | 06-Deploy | 06-Deploy-Rollback_Plan-v1.0.md | **Partial** |
| - | 06-Deploy | 06-Deploy-Go_Live_Checklist-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Go_Live_Validation-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Hypercare_Plan-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Post_Go_Live_Validation-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Data_Migration_Plan-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Environment_Strategy-v1.0.md | **Missing** |
| - | 06-Deploy | 06-Deploy-Release_Notes-v1.0.md | **Missing** |

### Documentos a Criar (Critical)

1. **06-Deploy-Deployment_Strategy-v1.0.md**
   - Estratégia de implantação
   - Environment strategy
   - Release management

2. **06-Deploy-Cutover_Plan-v1.0.md**
   - Plano detalhado de cutover
   - Timeline
   - Rollback procedures
   - Communication plan

3. **06-Deploy-Go_Live_Checklist-v1.0.md**
   - Checklist pré-go-live
   - Checklist go-live
   - Checklist pós-go-live

---

## Phase 07 - Operate

### Estrutura Atual → Now Create Mapping

| Documento Atual | Now Create Phase | Novo Nome | Status |
| --- | --- | --- | --- |
| Support_Model.md | 07-Operate | 07-Operate-Support_Model-v1.0.md | **Complete** |
| Runbook.md | 07-Operate | 07-Operate-Runbook-v1.0.md | **Complete** |
| Monitoring.md | 07-Operate | 07-Operate-Monitoring_Strategy-v1.0.md | **Complete** |
| Runbook.md | 07-Operate | 07-Operate-Incident_Management_Plan-v1.0.md | **Partial** |
| - | 07-Operate | 07-Operate-Problem_Management_Plan-v1.0.md | **Missing** |
| - | 07-Operate | 07-Operate-Change_Management_Plan-v1.0.md | **Missing** |
| - | 07-Operate | 07-Operate-Knowledge_Management_Plan-v1.0.md | **Missing** |
| Support_Model.md | 07-Operate | 07-Operate-SLA_OLA_Definitions-v1.0.md | **Partial** |
| evidence/Dashboards/* | 07-Operate | 07-Operate-KPI_Dashboard-v1.0.md | **Partial** |
| - | 07-Operate | 07-Operate-Continuous_Improvement_Plan-v1.0.md | **Missing** |
| NFRs.md | 07-Operate | 07-Operate-Backup_Recovery_Plan-v1.0.md | **Partial** |
| NFRs.md | 07-Operate | 07-Operate-Disaster_Recovery_Plan-v1.0.md | **Partial** |

### Documentos a Criar (High Priority)

1. **07-Operate-Problem_Management_Plan-v1.0.md**
   - Processo de problem management
   - Root cause analysis
   - Known errors

2. **07-Operate-Knowledge_Management_Plan-v1.0.md**
   - Knowledge base
   - Article creation
   - Knowledge review

---

## Implementation Strategy

Devido a restrições de criação de diretórios, a implementação seguirá esta abordagem:

1. **Manter estrutura atual** (docs/architecture, docs/implementation, etc.)
2. **Criar novos documentos** com prefixo de fase
3. **Atualizar README.md** com referências cruzadas por fase
4. **Criar índice Now Create** para navegação por fase

---

## Next Steps

1. Criar documentos críticos ausentes (Phase 01, 02, 06)
2. Completar documentos parciais (Phase 04, 05, 07)
3. Criar plano de implementação completo por fase
4. Gerar backlog executável
5. Criar roadmap de construção

---

*Now Create Structure Map - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Status: Proposto*
