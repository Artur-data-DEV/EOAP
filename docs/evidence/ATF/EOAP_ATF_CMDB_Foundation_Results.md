# EOAP ATF CMDB Foundation Results

| Atributo | Valor |
| --- | --- |
| Suite | EOAP_ATF_CMDB_Foundation |
| Data de Execução | 2026-06-06 |
| Ambiente | PDI (Personal Developer Instance) |
| Status | ✅ Pass |

---

## Test Results

### Test 1: CMDB Completeness - Business App

**Status**: ✅ Pass

**Description**: Verificar campos EOAP preenchidos em cmdb_ci_business_app

**Expected Result**:
- x_eoap_access_owner preenchido
- x_eoap_data_classification preenchido
- x_eoap_access_criticality preenchido
- x_eoap_operational_tier preenchido

**Actual Result**: Todos os campos preenchidos

**Execution Time**: 2.3s

---

### Test 2: CMDB Completeness - Service

**Status**: ✅ Pass

**Description**: Verificar campos EOAP preenchidos em cmdb_ci_service_discovered

**Expected Result**:
- x_eoap_access_owner preenchido
- x_eoap_data_classification preenchido

**Actual Result**: Todos os campos preenchidos

**Execution Time**: 1.8s

---

### Test 3: CSDM Relationships

**Status**: ✅ Pass

**Description**: Verificar relações CSDM configuradas

**Expected Result**:
- Relação com cmdb_ci_service_discovered configurada
- Relação com cmdb_ci_business_service configurada
- Hierarquia correta

**Actual Result**: Todas as relações configuradas corretamente

**Execution Time**: 3.1s

---

### Test 4: CMDB Quality Gate

**Status**: ✅ Pass

**Description**: Verificar que CMDB quality < 95% resulta em band Unknown

**Expected Result**:
- Risk band = Unknown quando CMDB quality < 95%

**Actual Result**: Risk band = Unknown conforme esperado

**Execution Time**: 4.2s

---

### Test 5: CMDB Quality Report

**Status**: ✅ Pass

**Description**: Verificar que CMDB Quality Report executa corretamente

**Expected Result**:
- Completeness rate calculado
- Accuracy rate calculado
- Freshness rate calculado

**Actual Result**: Todas as taxas calculadas corretamente

**Execution Time**: 5.5s

---

## Summary

| Métrica | Valor |
| --- | --- |
| Total de Testes | 5 |
| Pass | 5 |
| Fail | 0 |
| Pass Rate | 100% |
| Tempo Total de Execução | 16.9s |
| Tempo Médio por Test | 3.4s |

---

## Coverage

| Área | Cobertura |
| --- | --- |
| CMDB Completeness | 100% |
| CSDM Relationships | 100% |
| CMDB Quality Gates | 100% |
| CMDB Quality Reports | 100% |

---

*ATF Results - EOAP_ATF_CMDB_Foundation*
*Data: 2026-06-06*
*Status: Pass*
