(function executeRule(current, previous /*null when async*/) {
  gs.addErrorMessage('Registro de acesso (x_eoap_user_access) não pode ser excluído. Use revogação (status = revoked) para manter audit trail.');
  current.setAbortAction(true);
})(current, previous);
