# EOAP_Flow_Access_Revocation — Flow de Revogação Manual

| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Trigger** | Record Updated (x_eoap_user_access) |
| **Condição Trigger** | `status` changes to `revoked` |
| **Ativo** | Sim |

---

## Steps do Flow
| Passo | Tipo | Descrição |
|-------|------|-----------|
| 1 | **Trigger** | Inicia quando `x_eoap_user_access.status` é marcado como `revoked` |
| 2 | **Script Step** | Chama `EOAP_AuditLogger.log()` para registrar a revogação |
| 3 | (Opcional) **REST Step** | Chama endpoint de IAM para deprovisionar (mock para MVP) |
| 4 | **End** | Fim do fluxo |
