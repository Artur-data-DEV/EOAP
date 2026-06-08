(function executeRule(current, previous /*null when async*/) {
  gs.addErrorMessage('Log de auditoria (x_eoap_audit_trail) é imutável. Não é permitido excluir registros.');
  current.setAbortAction(true);
})(current, previous);
