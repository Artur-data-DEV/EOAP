# EOAP_Operational_Overview Dashboard

| Atributo | Valor |
| --- | --- |
| Dashboard | EOAP_Operational_Overview |
| Versão | 1.0 |
| Status | ✅ Ativo |
| Data de Criação | 2026-06-06 |

---

## Dashboard Overview

**Purpose**: Visão geral operacional em tempo real da EOAP

**Refresh Rate**: Real-time

**Users**: x_eoap_admin, x_eoap_manager, x_eoap_auditor

---

## Widgets

### Widget 1: User Access by Status

**Type**: Donut chart

**Source**: x_eoap_user_access

**Group by**: status

**Time Range**: Real-time

**Alert**: Se revoked > 10% do total

**Data**:
- requested: 5%
- pending_approval: 10%
- approved: 15%
- active: 60%
- expired: 5%
- revoked: 3%
- rejected: 2%

---

### Widget 2: Access by Application

**Type**: Bar chart

**Source**: x_eoap_user_access

**Group by**: application

**Time Range**: 7 dias

**Alert**: Se application > 1000 acessos

**Top 5 Applications**:
1. CRM System: 1,200 acessos
2. ERP System: 950 acessos
3. HR Portal: 800 acessos
4. Finance System: 650 acessos
5. ITSM Tool: 500 acessos

---

### Widget 3: Risk Band Distribution

**Type**: Donut chart

**Source**: change_request

**Group by**: x_eoap_risk_band

**Time Range**: 7 dias

**Alert**: Se Critical > 20%

**Data**:
- Low: 45%
- Medium: 30%
- High: 20%
- Critical: 3%
- Unknown: 2%

---

### Widget 4: Event Processing Status

**Type**: Scorecard

**Source**: x_eoap_event_processing

**Metric**: % processed (última hora)

**Target**: ≥ 99%

**Alert**: Se < 95%

**Current Value**: 98.5%

**Trend**: ↗ (aumentando)

---

### Widget 5: CMDB Completeness Rate

**Type**: Scorecard

**Source**: CMDB Quality Report

**Metric**: % complete

**Target**: ≥ 95%

**Alert**: Se < 90%

**Current Value**: 96.2%

**Trend**: → (estável)

---

### Widget 6: Audit Trail Volume (7 dias)

**Type**: Line chart

**Source**: x_eoap_audit_trail

**Time Range**: 7 dias

**Alert**: Se volume > 100K registros/dia

**Data**:
- Day 1: 85K registros
- Day 2: 92K registros
- Day 3: 88K registros
- Day 4: 95K registros
- Day 5: 90K registros
- Day 6: 87K registros
- Day 7: 89K registros

**Average**: 89.4K registros/dia

---

## Filters

**Filtro por Período**:
- Última hora
- Últimas 24 horas
- Últimos 7 dias
- Últimos 30 dias
- Custom range

**Filtro por Aplicação**:
- Todas as aplicações
- Aplicação específica

**Filtro por Status**:
- Todos os status
- Status específico

---

## Drill-Down

**Clicar em Widget 1 (User Access by Status)**:
- Navega para lista de registros x_eoap_user_access
- Filtra por status selecionado

**Clicar em Widget 2 (Access by Application)**:
- Navega para lista de registros x_eoap_user_access
- Filtra por application selecionada

**Clicar em Widget 3 (Risk Band Distribution)**:
- Navega para lista de change_requests
- Filtra por risk_band selecionado

**Clicar em Widget 6 (Audit Trail Volume)**:
- Navega para lista de registros x_eoap_audit_trail
- Filtra por período selecionado

---

## Performance

**Load Time**: < 3s

**Refresh Time**: Real-time

**Data Freshness**: < 1 minuto

---

## Access Control

**Read**: x_eoap_admin, x_eoap_manager, x_eoap_auditor

**Edit**: x_eoap_admin apenas

---

*Dashboard Documentation - EOAP_Operational_Overview*
*Versão 1.0 - 2026-06-06*
*Status: Ativo*
