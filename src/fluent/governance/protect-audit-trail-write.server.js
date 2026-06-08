(function executeRule(current, previous /*null when async*/) {
  gs.addErrorMessage('Log de auditoria (x_eoap_audit_trail) é imutável. Não é permitido alterar registros existentes.');
  current.setAbortAction(true);
})(current, previous);
