# EOAP_Job_Reconciliation — Job de Reconciliação

| Atributo | Valor |
|----------|-------|
| **Escopo** | x_eoap |
| **Nome** | EOAP Job Reconciliation |
| **Frequência** | Diária |
| **Horário** | 02:00 |
| **Ativo** | Sim |

---

## Script do Job
```javascript
(function execute() {
    var logger = new EOAP_AuditLogger();
    logger.log(
        gs.getUserID(),
        "scheduled_job",
        "EOAP_Job_Reconciliation",
        "execute",
        "success",
        "Job de reconciliação executado (mock para MVP)"
    );
    gs.info("EOAP_Job_Reconciliation executado com sucesso!");
})();
```
