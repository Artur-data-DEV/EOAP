# EOAP Manual Offboarding — Catalog Item

| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Nome** | EOAP Manual Offboarding |
| **Publicado** | Sim |
| **Menu** | Service Catalog / EOAP |

---

## Variáveis
| Nome | Rótulo | Tipo | Obrigatório | Referência |
|------|--------|------|-------------|------------|
| `u_user` | Usuário | Reference | Sim | sys_user |

---

## Process Flow
| Passo | Ação |
|-------|------|
| 1 | Usuário (Manager) abre o Catalog Item |
| 2 | Seleciona o Usuário a ser desligado |
| 3 | Envia a solicitação |
| 4 | Inicia automaticamente o Flow `EOAP_Flow_Employee_Offboarding` |
