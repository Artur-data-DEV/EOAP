/**
 * Extensão de CMDB — Campo x_eoap_access_owner em cmdb_ci_business_app
 *
 * Spec: docs/03-Execution/Step-by-Step/EOAP-MVP-Implementation-Guide.md (Sprint 1)
 * ADR-001: CMDB como espinha dorsal (fonte de verdade para ownership de aplicações)
 *
 * NOTA IMPORTANTE (Fluent SDK + Scoped App):
 * Adicionar colunas a tabelas OOB (cmdb_ci_business_app) em uma aplicação escopada requer
 * que a instalação da aplicação crie o dicionário de coluna ou que o campo seja criado
 * manualmente na PDI após o primeiro deploy (abordagem controlada híbrida).
 *
 * Procedimento exato:
 * 1. Após `npm run deploy`, na PDI:
 *    - Navegue até cmdb_ci_business_app
 *    - Configure > Form Design ou Tables > cmdb_ci_business_app > New Column
 * 2. Nome do campo: x_eoap_access_owner
 * 3. Type: Reference → sys_user
 * 4. Label: Access Owner (EOAP)
 *
 * O campo é consumido por:
 * - EOAP_AccessGovernanceService.validateAccessOwner()
 * - Futuros Flows, Reports e Dashboards de governança
 *
 * Futuro: Quando o SDK suportar Dictionary updates declarativos de forma robusta,
 * mover esta definição para src/metadata/ ou um Record de sys_dictionary.
 */
