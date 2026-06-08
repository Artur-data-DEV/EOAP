# Testes

Estratégia de testes e qualidade para o EOAP.

## Abordagem

- Testes manuais estruturados para o MVP (conforme roteiro de demo)
- Futuro: ATF (Automated Test Framework) para componentes críticos
- Validação de build (`npm run build`) como gate obrigatório
- Revisão por Validator Agent (agentic)

## O que testar

- Fluxos de offboarding automático
- Proteção do audit trail (imutabilidade)
- RBAC (roles + ACLs)
- Integração com CMDB (campo access_owner)

Consulte `docs/evidence/` para resultados de testes e demos.
