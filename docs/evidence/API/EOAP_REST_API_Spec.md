# EOAP REST API Specification

| Atributo | Valor |
| --- | --- |
| Documento | EOAP REST API Specification |
| Solução | EOAP v3.0 — Enterprise Operations Automation Platform |
| Plataforma | ServiceNow — Scoped Application `x_eoap` |
| Autor | Principal ServiceNow Architect |
| Data | 2026-06-06 |
| Versão | 1.0 |
| Status | **Aprovado ARB** |
| Classificação | Confidencial — Documento de API Corporativo |

> **Escopo deste documento**: Especificação completa da API REST da EOAP. Inclui endpoints, payloads, erros e autenticação.

---

## 1. API Overview

### 1.1 Base URL

```
https://<instance>.service-now.com/api/x_eoap/v1/
```

### 1.2 Authentication

**Type**: OAuth 2.0 (Client Credentials)

**Token Lifetime**: 1 hora

**Refresh Token**: 24 horas

**Scope**: `x_eoap.read`, `x_eoap.write`

### 1.3 Rate Limiting

**Limit**: 100 requests/minute

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

**Error Response** (429):
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60
  }
}
```

---

## 2. Endpoints

### 2.1 GET /access/{sys_id}

**Descrição**: Consultar detalhes de um registro de acesso

**Method**: GET

**Path Parameters**:
- `sys_id` (string, required): System ID do registro de acesso

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response 200**:
```json
{
  "result": {
    "sys_id": "string",
    "user": {
      "sys_id": "string",
      "name": "string",
      "email": "string"
    },
    "application": {
      "sys_id": "string",
      "name": "string"
    },
    "access_profile": "string",
    "status": "requested|pending_approval|approved|active|expired|revoked|rejected",
    "granted_by": {
      "sys_id": "string",
      "name": "string"
    },
    "granted_on": "ISO 8601 datetime",
    "valid_from": "ISO 8601 datetime",
    "valid_to": "ISO 8601 datetime",
    "risk_rating": "Low|Medium|High|Critical",
    "data_classification": "Public|Internal|Confidential|Restricted",
    "access_criticality": "Low|Medium|High|Critical",
    "operational_tier": "Tier 1|Tier 2|Tier 3",
    "justification": "string",
    "correlation_id": "string",
    "sys_created_on": "ISO 8601 datetime",
    "sys_updated_on": "ISO 8601 datetime"
  }
}
```

**Response 404**:
```json
{
  "error": {
    "message": "Record not found",
    "code": "NOT_FOUND",
    "detail": "Access record with sys_id <sys_id> not found"
  }
}
```

**Response 403**:
```json
{
  "error": {
    "message": "Forbidden",
    "code": "FORBIDDEN",
    "detail": "Insufficient permissions to access this record"
  }
}
```

**ACL**: x_eoap_admin, x_eoap_manager

---

### 2.2 POST /access

**Descrição**: Solicitar novo acesso

**Method**: POST

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "user_sys_id": "string",
  "application_sys_id": "string",
  "access_profile": "string",
  "justification": "string",
  "valid_from": "ISO 8601 datetime (optional)",
  "valid_to": "ISO 8601 datetime (optional)",
  "correlation_id": "string (optional)"
}
```

**Response 201**:
```json
{
  "result": {
    "sys_id": "string",
    "status": "requested",
    "correlation_id": "string",
    "message": "Access request submitted successfully"
  }
}
```

**Response 400**:
```json
{
  "error": {
    "message": "Bad request",
    "code": "BAD_REQUEST",
    "detail": "Invalid request body: <details>"
  }
}
```

**Response 403**:
```json
{
  "error": {
    "message": "Forbidden",
    "code": "FORBIDDEN",
    "detail": "Insufficient permissions to create access request"
  }
}
```

**ACL**: x_eoap_admin, x_eoap_manager

---

### 2.3 GET /risk/{change_sys_id}

**Descrição**: Consultar risco de uma mudança

**Method**: GET

**Path Parameters**:
- `change_sys_id` (string, required): System ID da mudança

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response 200**:
```json
{
  "result": {
    "change_sys_id": "string",
    "change_number": "string",
    "risk_score": 0-100,
    "risk_band": "Low|Medium|High|Critical|Unknown",
    "risk_explanation": "string",
    "calculated_on": "ISO 8601 datetime",
    "evidence": [
      {
        "risk_factor": "string",
        "risk_weight": 0-40,
        "risk_value": 0-40,
        "band": "Low|Medium|High|Critical"
      }
    ],
    "correlation_id": "string"
  }
}
```

**Response 404**:
```json
{
  "error": {
    "message": "Change not found",
    "code": "NOT_FOUND",
    "detail": "Change with sys_id <change_sys_id> not found"
  }
}
```

**Response 403**:
```json
{
  "error": {
    "message": "Forbidden",
    "code": "FORBIDDEN",
    "detail": "Insufficient permissions to access risk information"
  }
}
```

**ACL**: x_eoap_admin, x_eoap_change_manager

---

### 2.4 GET /audit/{entity_sys_id}

**Descrição**: Consultar audit trail de uma entidade

**Method**: GET

**Path Parameters**:
- `entity_sys_id` (string, required): System ID da entidade

**Query Parameters**:
- `entity_type` (string, optional): Tipo de entidade (ex: x_eoap_user_access)
- `limit` (integer, optional): Limite de registros (default: 100)

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response 200**:
```json
{
  "result": [
    {
      "sys_id": "string",
      "event_type": "string",
      "entity_type": "string",
      "entity_sys_id": "string",
      "action": "string",
      "actor": {
        "sys_id": "string",
        "name": "string"
      },
      "timestamp": "ISO 8601 datetime",
      "payload_summary": "string",
      "correlation_id": "string",
      "source": "string"
    }
  ]
}
```

**Response 403**:
```json
{
  "error": {
    "message": "Forbidden",
    "code": "FORBIDDEN",
    "detail": "Insufficient permissions to access audit trail"
  }
}
```

**ACL**: x_eoap_admin, x_eoap_auditor

---

## 3. Error Codes

| Code | HTTP Status | Description |
| --- | --- | --- |
| NOT_FOUND | 404 | Recurso não encontrado |
| FORBIDDEN | 403 | Permissões insuficientes |
| UNAUTHORIZED | 401 | Token inválido ou expirado |
| BAD_REQUEST | 400 | Requisição inválida |
| RATE_LIMIT_EXCEEDED | 429 | Rate limit excedido |
| INTERNAL_ERROR | 500 | Erro interno do servidor |
| SERVICE_UNAVAILABLE | 503 | Serviço temporariamente indisponível |

---

## 4. Error Response Format

**Standard Error Response**:
```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "detail": "Detailed error information (optional)"
  }
}
```

---

## 5. OAuth 2.0 Authentication

### 5.1 Token Request

**Endpoint**: `https://<instance>.service-now.com/oauth_token.do`

**Method**: POST

**Headers**:
```
Content-Type: application/x-www-form-urlencoded
```

**Request Body**:
```
grant_type=client_credentials
&client_id=<client_id>
&client_secret=<client_secret>
```

**Response 200**:
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "x_eoap.read x_eoap.write"
}
```

### 5.2 Token Usage

**Headers**:
```
Authorization: Bearer <access_token>
```

---

## 6. Integration Examples

### 6.1 cURL Example - Get Access

```bash
curl -X GET \
  'https://<instance>.service-now.com/api/x_eoap/v1/access/<sys_id>' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json'
```

### 6.2 cURL Example - Create Access Request

```bash
curl -X POST \
  'https://<instance>.service-now.com/api/x_eoap/v1/access' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_sys_id": "<user_sys_id>",
    "application_sys_id": "<app_sys_id>",
    "access_profile": "standard_access",
    "justification": "Business requirement for project X"
  }'
```

### 6.3 Python Example

```python
import requests

# Get access token
token_url = 'https://<instance>.service-now.com/oauth_token.do'
token_data = {
    'grant_type': 'client_credentials',
    'client_id': '<client_id>',
    'client_secret': '<client_secret>'
}
token_response = requests.post(token_url, data=token_data)
access_token = token_response.json()['access_token']

# Get access
access_url = 'https://<instance>.service-now.com/api/x_eoap/v1/access/<sys_id>'
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}
access_response = requests.get(access_url, headers=headers)
access_data = access_response.json()
print(access_data)
```

---

## 7. Security Considerations

### 7.1 TLS

**Requirement**: TLS 1.2+

**Certificate**: Valid certificate from trusted CA

### 7.2 Token Security

**Storage**: Tokens devem ser armazenados de forma segura (ex: environment variables, secret management)

**Rotation**: Tokens devem ser rotacionados a cada 24 horas

**Revocation**: Tokens podem ser revogados via OAuth 2.0

### 7.3 IP Whitelisting (Optional)

**Configuration**: IP whitelisting pode ser configurado para endpoints críticos

---

## 8. Versioning

### 8.1 API Version

**Current Version**: v1

**Version Format**: `/api/x_eoap/v{version}/`

### 8.2 Version Policy

**Breaking Changes**: Nova versão major (v2)

**Non-Breaking Changes**: Mesma versão (v1)

**Deprecation**: 6 meses de aviso antes de remover endpoint

---

*REST API Specification - EOAP v3.0*
*Versão 1.0 - 2026-06-06*
*Aprovado por Architecture Review Board*
