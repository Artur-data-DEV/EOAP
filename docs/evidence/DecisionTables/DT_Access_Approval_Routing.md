# DT_Access_Approval_Routing

| Atributo | Valor |
| --- | --- |
| Decision Table | x_eoap_dt_access_approval_routing |
| Versão | 1.0 |
| Status | ✅ Ativo |
| Data de Criação | 2026-06-06 |

---

## Decision Table Overview

**Purpose**: Configurar roteamento de aprovação de acesso baseado em risco e classificação

**Inputs**: 5

**Outputs**: 4

---

## Inputs

| Input | Tipo | Valores |
| --- | --- | --- |
| data_classification | Choice | Public, Internal, Confidential, Restricted |
| access_criticality | Choice | Low, Medium, High, Critical |
| operational_tier | Choice | Tier 1, Tier 2, Tier 3 |
| exception_type | Choice | Business Critical, Temporary Access, Emergency |
| user_role | String | (role do usuário solicitante) |

---

## Outputs

| Output | Tipo | Descrição |
| --- | --- | --- |
| approval_required | Boolean | Se aprovação é requerida |
| approval_group | Reference: group | Grupo de aprovação |
| approval_level | Choice | Level 1, Level 2, Level 3 |
| auto_approve | Boolean | Se aprovação automática |

---

## Rules

### Rule 1: Restricted Data ou Critical Access

**Conditions**:
- data_classification = Restricted
- OR access_criticality = Critical

**Outputs**:
- approval_required = true
- approval_level = Level 3
- auto_approve = false

**Rationale**: Dados restritos ou acesso crítico requerem aprovação de nível 3

---

### Rule 2: Confidential Data ou High Access

**Conditions**:
- data_classification = Confidential
- OR access_criticality = High

**Outputs**:
- approval_required = true
- approval_level = Level 2
- auto_approve = false

**Rationale**: Dados confidenciais ou acesso alto requerem aprovação de nível 2

---

### Rule 3: Tier 1 Operational

**Conditions**:
- operational_tier = Tier 1

**Outputs**:
- approval_required = true
- approval_level = Level 2
- auto_approve = false

**Rationale**: Sistemas Tier 1 requerem aprovação de nível 2

---

### Rule 4: Emergency Exception

**Conditions**:
- exception_type = Emergency

**Outputs**:
- approval_required = false
- auto_approve = true

**Rationale**: Exceções de emergência são auto-aprovadas

---

### Rule 5: Default

**Conditions**:
- (nenhuma condição específica)

**Outputs**:
- approval_required = true
- approval_level = Level 1
- auto_approve = false

**Rationale**: Default requer aprovação de nível 1

---

## Decision Table Matrix

| Rule | data_classification | access_criticality | operational_tier | exception_type | approval_required | approval_level | auto_approve |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Restricted | * | * | * | true | Level 3 | false |
| 1 | * | Critical | * | * | true | Level 3 | false |
| 2 | Confidential | * | * | * | true | Level 2 | false |
| 2 | * | High | * | * | true | Level 2 | false |
| 3 | * | * | Tier 1 | * | true | Level 2 | false |
| 4 | * | * | * | Emergency | false | - | true |
| 5 | * | * | * | * | true | Level 1 | false |

---

## Testing

**Test 1**: Restricted Data
- Input: data_classification = Restricted
- Expected: approval_required = true, approval_level = Level 3
- Result: ✅ Pass

**Test 2**: Emergency Exception
- Input: exception_type = Emergency
- Expected: approval_required = false, auto_approve = true
- Result: ✅ Pass

**Test 3**: Default
- Input: data_classification = Internal, access_criticality = Low
- Expected: approval_required = true, approval_level = Level 1
- Result: ✅ Pass

---

## Maintenance

**Owner**: x_eoap_risk_analyst

**Review Frequency**: Trimestral

**Change Process**:
1. Proposta de mudança
2. Review por x_eoap_risk_analyst
3. ATF regression
4. Aprovação
5. Deploy

---

*Decision Table Documentation - x_eoap_dt_access_approval_routing*
*Versão 1.0 - 2026-06-06*
*Status: Ativo*
