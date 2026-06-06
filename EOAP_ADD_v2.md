  # EOAP — Architecture Design Document (ADD)

  | Atributo | Valor |
  | --- | --- |
  | Documento | Architecture Design Document (ADD) |
  | Solução | EOAP v2 — Enterprise Operations Automation Platform |
  | Plataforma | ServiceNow |
  | Ambiente-alvo | Personal Developer Instance (PDI) ServiceNow |
  | Autor | Artur Campos Batista |
  | Data | 2026-06-06 |
  | Versão | 2.2 — Capacity, STRIDE & Alerting (ARB operational deepening) |
  | Classificação | Confidencial — Documento de Arquitetura Corporativa |
  | Status | Aprovado para revisão ARB |
  | Documento complementar | EOAP_SDD_v2.md (Solution Design Document) |
  | Documento complementar | EOAP_Implementation_Guide_v2.md (Implementation Guide) |

  > **Escopo deste documento**: Este ADD contém EXCLUSIVAMENTE decisões arquiteturais, princípios, requisitos não funcionais, modelos lógicos, governança e riscos. Detalhes de implementação (flows, scripts, catalog items, decision tables) estão no **Solution Design Document (SDD)**. Plano de execução por sprint está no **Implementation Guide**.

  ---

  ## Sumário

  1. [Executive Summary](#1-executive-summary)
  2. [Business Context](#2-business-context)
  3. [Scope](#3-scope)
  4. [Architecture Principles](#4-architecture-principles)
  5. [Non Functional Requirements](#5-non-functional-requirements)
  6. [High Level Architecture](#6-high-level-architecture)
  7. [Logical Architecture](#7-logical-architecture)
  8. [Deployment Architecture](#8-deployment-architecture)
  9. [ServiceNow Capability Mapping](#9-servicenow-capability-mapping)
  10. [CSDM Architecture](#10-csdm-architecture)
  11. [Data Architecture](#11-data-architecture)
  12. [Security Architecture](#12-security-architecture)
  13. [Integration Architecture](#13-integration-architecture)
  14. [Event Architecture](#14-event-architecture)
  15. [Observability Architecture](#15-observability-architecture)
  16. [Governance Model](#16-governance-model)
  17. [Operational Runbook Requirements](#17-operational-runbook-requirements)
  18. [Disaster Recovery & Failure Scenarios](#18-disaster-recovery--failure-scenarios)
  19. [ADR Catalog](#19-adr-catalog)
  20. [Risks and Mitigations](#20-risks-and-mitigations)
  21. [Architecture Review Board Assessment](#21-architecture-review-board-assessment)
  22. [Appendix](#22-appendix)

  ---

  ## 1. Executive Summary

  ### 1.1 Visão

  A **EOAP — Enterprise Operations Automation Platform** é uma plataforma de governança operacional construída sobre ServiceNow como Scoped Application, projetada para unificar quatro domínios operacionais que normalmente evoluem de forma fragmentada e geram silos de dados e decisão:

  | Pilar | Propósito Arquitetural | Resultado Estratégico |
  | --- | --- | --- |
  | **CMDB Foundation** | Estabelecer base confiável de Business Applications, Application Services, Technical Services, ownership e relações críticas conforme CSDM. | Decisões de acesso, risco e lifecycle baseadas em dados confiáveis, auditáveis e governados. |
  | **Employee Lifecycle** | Orquestrar onboarding, movimentação e offboarding por fluxos controlados com rastreabilidade end-to-end. | Eliminação de tarefas manuais, redução de acessos órfãos e evidência auditável de cada transição. |
  | **Access Governance** | Gerenciar acessos como entidades governadas com owner, validade, justificativa, exceção, recertificação e trilha de auditoria. | Acessos explicáveis, auditáveis e alinhados a Least Privilege e Segregation of Duties. |
  | **Change Risk Guardian** | Calcular e explicar risco de mudanças com base em CIs, serviços impactados, criticidade, histórico e regras declarativas versionadas. | CAB com contexto técnico objetivo e governança de risco baseada em dados. |

  ### 1.2 Decisão Arquitetural Central

  A decisão arquitetural central da EOAP é **não criar silos customizados quando capacidades OOB do ServiceNow resolvem o problema**. A plataforma atua como camada de governança operacional sobre capacidades nativas — não substitui ITSM, CMDB, Change Management, Catalog ou Security; conecta essas capacidades em uma arquitetura coerente com ownership explícito, controles de qualidade, eventos e evidências de decisão.

  ### 1.3 Modelo de Rastreabilidade

  A EOAP define um modelo formal de rastreabilidade. Decisões de aprovação, alterações de owners, cálculo de risco, exceções de acesso, falhas de evento e ações de lifecycle geram evidências em uma trilha de auditoria aplicacional. Essa abordagem complementa logs técnicos e auditoria nativa com **semântica de negócio**, garantindo que o resultado de cada processo possa ser explicado por auditores, arquitetos e responsáveis operacionais.

  ### 1.4 Benefícios Esperados

  - Redução de customizações frágeis por aderência a OOB First
  - Aumento de transparência sobre decisões operacionais
  - Melhoria de qualidade da CMDB como ativo de governança
  - Padronização de aprovações por policies declarativas
  - Maior aderência a controles de segurança e compliance
  - Capacidade de demonstrar maturidade arquitetural em revisões técnicas
  - Arquitetura implementável em PDI com padrões que permitem evolução para instâncias corporativas

  ---

  ## 2. Business Context

  ### 2.1 Problem Statement

  Organizações que utilizam ServiceNow frequentemente enfrentam fragmentação entre dados de aplicação, processos de lifecycle, concessão de acessos e avaliação de risco de mudança. Em ambientes sem arquitetura integrada:

  - A **CMDB** é mantida como inventário passivo sem governança de qualidade
  - Solicitações de **acesso** se tornam tickets sem governança de ciclo de vida
  - **Mudanças** são avaliadas por julgamento manual sem contexto de dados
  - **Evidências de auditoria** ficam dispersas entre logs, comentários e aprovações isoladas
  - **Lifecycle de colaborador** não aciona automaticamente concessões e revogações rastreáveis

  A EOAP resolve esse problema consolidando o contexto operacional em torno da CMDB e do CSDM. A solução reconhece que risco de mudança depende de serviços e aplicações impactados; que acesso deve ser governado por owner e validade; e que lifecycle de colaborador precisa acionar concessões e revogações de forma rastreável.

  ### 2.2 Business Drivers

  | Driver | Descrição | Implicação Arquitetural |
  | --- | --- | --- |
  | Redução de risco operacional | Mudanças em serviços críticos devem ser avaliadas com contexto de dependência e histórico. | Change Risk Guardian precisa consultar CMDB, histórico e regras versionadas. |
  | Governança de acesso | Acesso a aplicações sensíveis precisa de owner, justificativa, validade e evidência. | User Access Registry e Access Owner são objetos arquiteturais, não meros campos opcionais. |
  | Eficiência operacional | Processos repetitivos de lifecycle devem ser automatizados por fluxos claros. | Flow Designer e Catalog devem ser usados como entrada e orquestração primária. |
  | Auditabilidade | Auditores precisam entender quem aprovou, por quê, com qual regra e em qual contexto. | Audit Trail aplicacional é necessário para capturar semântica de decisão. |
  | Manutenibilidade | Regras de decisão mudam com frequência e não devem exigir alteração de código. | Decision Tables devem separar política de implementação. |
  | Compliance regulatório | Organizações precisam demonstrar controles de acesso, segregação e rastreabilidade. | Security by Design e Governance by ADR são requisitos mandatórios. |

  ### 2.3 Success Criteria

  | Critério | Métrica | Evidência |
  | --- | --- | --- |
  | CMDB mínima confiável | 100% das Business Applications críticas possuem owner, access owner, classificação e pelo menos um Application Service relacionado. | Dashboard de completude e relatório de exceções. |
  | Lifecycle rastreável | 100% dos fluxos críticos geram evento, audit trail e estado final recuperável. | Registros em x_eoap_audit_trail e x_eoap_event_processing. |
  | Acesso governado | 100% dos acessos EOAP possuem owner, validade, justificativa e status. | Relatório de User Access Registry. |
  | Risco explicável | 100% dos scores de mudança possuem evidência por fator e rule_version. | Registros em x_eoap_risk_evidence. |
  | Segurança validada | Todos os papéis sensíveis possuem testes negativos de ACL. | Suite ATF de segurança com 100% pass rate. |
  | Princípios aplicados | Nenhuma extensão sem ADR aprovado. | Catálogo de ADRs com rastreabilidade de implementação. |

  ### 2.4 Architecture Drivers

  A arquitetura da EOAP v2 é moldada por três conjuntos de direcionadores (Drivers): as necessidades estratégicas de negócio (Business Needs), as restrições técnicas da plataforma (Technical Constraints) e os atributos de qualidade sistêmica (Quality Attributes).

  ```mermaid
  mindmap
    root((Architecture Drivers))
      Business Needs
        Conformidade SOX e ISO 27001
        Redução de Acessos Órfãos
        CAB Baseado em Dados Objetivos
      Technical Constraints
        PDI Limitations
        OOB-First Priority
        Scoped App Boundaries
      Quality Attributes
        Auditabilidade Fim-a-Fim
        Alta Resiliência Lógica
        Performance de Consultas
  ```

  #### 2.4.1 Business Needs (Necessidades de Negócio)
  - **Conformidade de Auditoria (SOX / ISO 27001)**: Exige trilha de auditoria aplicacional imutável contendo a justificativa e aprovação formal para cada privilégio ativo.
  - **Redução de Privilégios Órfãos (Employee Transition)**: Garantir que a saída ou movimentação de um funcionário revogue imediatamente seus acessos em sistemas satélites.
  - **Avaliação de Risco Baseada em Dependências**: A CAB deve deliberar sobre mudanças em produção com base no impacto de CIs e histórico de incidentes agregados na CMDB.

  #### 2.4.2 Technical Constraints (Restrições Técnicas)
  - **ServiceNow Scoped App Boundaries**: A plataforma deve rodar em escopo isolado (`x_eoap`) para garantir segurança e portabilidade, interagindo via cross-scope de forma performática com tabelas globais (`change_request`, `sys_user`, `cmdb_ci`).
  - **OOB-First Configuration**: Priorização total de configurações declarativas (Decision Tables e Flow Designer) sobre código JavaScript.
  - **Limitação de Recursos em PDI**: Ausência de integrações corporativas reais (IAM/HRIS). A arquitetura deve isolar essas conexões com mocks e aliases sem impactar o core.

  #### 2.4.3 Quality Attributes (Atributos de Qualidade)
  - **Auditabilidade Fim-a-Fim**: Rastreabilidade obrigatória de toda transição técnica de acesso até a aprovação de negócio e correlation_id.
  - **Alta Resiliência e Desacoplamento**: Falhas em integrações com IAM ou indisponibilidade de tabelas CMDB não podem bloquear o fluxo principal de mudanças (Change Request) ou eventos de onboarding.
  - **Performance de Consultas**: Garantir tempos de resposta de formulários interativos em <3s mesmo sob alta volumetria histórica de acessos e auditoria.

  ---

  ## 3. Scope

  ### 3.1 In Scope

  - Construção de Scoped Application EOAP em PDI
  - Modelagem inicial de CMDB/CSDM (Business Applications, Application Services, Technical Services, relações)
  - Definição de papéis, ACLs e personas com Segregation of Duties
  - Criação de tabelas customizadas justificadas por ADR
  - Arquitetura de fluxos de Employee Lifecycle
  - Arquitetura de Access Governance com entitlement, exceção e recertificação
  - Arquitetura de Change Risk Guardian com score explicável
  - Audit Trail aplicacional write-only
  - Arquitetura de eventos com idempotência, retry e observabilidade
  - Estratégia de observabilidade e monitoramento
  - Estratégia de testes ATF com cobertura de segurança
  - Governança por ADR e roadmap de implementação por sprint

  ### 3.2 Out of Scope

  - Integrações produtivas com HRIS (Workday, SAP HCM)
  - Integrações produtivas com IAM (Azure AD, Okta, SailPoint)
  - Integrações produtivas com SIEM (Splunk, Sentinel)
  - Discovery real (ITOM Discovery, Service Mapping)
  - GRC licenciado (Policy & Compliance, Risk Management)
  - Performance Analytics avançado
  - Portal corporativo completo (Employee Center, Service Portal customizado)
  - Automações que exijam plugins não disponíveis em PDI
  - Multi-domain separation (Domain Separation)
  - Federação CMDB e multi-source reconciliation

  > **Nota de extensibilidade**: O desenho reserva pontos de extensão para Workday, Azure AD, Okta, Qualys, SIEM e ferramentas de observabilidade. Interfaces, correlation_id e payloads são preparados para integração futura sem redesenho.

  ### 3.3 Assumptions

  | ID | Assumption | Impacto se Inválida |
  | --- | --- | --- |
  | A-001 | PDI ServiceNow com permissões administrativas completas. | Bloqueio total de implementação. |
  | A-002 | Acesso a Flow Designer, Catalog, Approvals, CMDB, Change Management, ACLs, Events e ATF. | Redução de escopo de pilares dependentes. |
  | A-003 | A solução será demonstrada como arquitetura de referência, não como implementação produtiva. | Métricas de performance são baselines relativos. |
  | A-004 | Dados de CMDB serão simulados com massa sintética controlada. | Scores e decisões representam cenários de demonstração. |
  | A-005 | Equipe de implementação possui conhecimento intermediário de ServiceNow. | Necessidade de documentação mais detalhada no SDD. |

  ### 3.4 Constraints

  | Restrição | Impacto | Tratamento Arquitetural |
  | --- | --- | --- |
  | PDI sem escala produtiva | Métricas de performance são baselines relativos, não garantias produtivas. | Definir NFRs mensuráveis e testes sintéticos proporcionais. |
  | Plugins limitados | Algumas capacidades corporativas podem não estar disponíveis. | Modelar extensões pragmáticas sem violar OOB First. |
  | Sem integrações reais | Eventos e serviços externos serão simulados. | Usar interfaces e correlation_id preparados para integração futura. |
  | Tempo de implementação | Necessidade de priorização por sprint com Definition of Done. | Sprint 0 forte e evolução incremental por pilar. |
  | Single developer environment | Segregation of Duties será simulada com impersonation. | Criar usuários de teste por persona para validação ATF. |

  ---

  ## 4. Architecture Principles

  Os princípios abaixo são **mandatórios** e funcionam como critérios de aceite de arquitetura. Toda exceção deve estar documentada por ADR com contexto, alternativas, consequências e riscos.

  ### 4.1 OOB First

  **Definição**: Toda capacidade nativa deve ser avaliada antes de qualquer extensão. Customização somente é aceita quando existir gap funcional, semântico, de governança ou de rastreabilidade que não possa ser resolvido por configuração OOB, Flow Designer, Decision Tables, Catalog ou campos existentes.

  **Critério de aceite**: Nenhuma extensão sem documentação de análise OOB, gap identificado e ADR aprovado.

  **Violações**: Criar tabelas paralelas ao CMDB, duplicar campos OOB existentes, construir workflow engine customizado, ou implementar sistema de aprovação proprietário.

  ### 4.2 CMDB Centric

  **Definição**: A CMDB é a espinha dorsal da solução. Business Applications, Application Services, dependências, owners, criticidade e risco são modelados como dados de plataforma, e não como atributos isolados em tabelas departamentais.

  **Critério de aceite**: Todo processo que depende de contexto de aplicação ou serviço deve consultar CMDB/CSDM como fonte primária.

  **Violações**: Criar catálogo paralelo de aplicações, armazenar ownership em tabelas isoladas, ou ignorar relações CSDM em decisões de risco.

  ### 4.3 Configuration over Code

  **Definição**: Todas as regras declarativas de negócio (como roteamento de aprovação, thresholds de score e fatores de risco) devem residir em Decision Tables sempre que tecnicamente viável, visando desacoplamento de código e versionamento. Script Includes são dedicados a lógicas procedurais, validações transacionais síncronas, consultas históricas e de CMDB, agregações, controle de idempotência de eventos e cálculos complexos.

  **Critério de aceite**: Todo Script Include deve possuir responsabilidade única e documentação justificando a necessidade de lógica procedural em vez do uso direto de Decision Tables e Flow Designer.

  **Violações**: Hardcode de regras declarativas em scripts, Business Rules executando cálculos de risco sem consultar as Decision Tables de peso, ou lógica procedural complexa embutida diretamente em ações do Flow Designer.

  ### 4.4 Security by Design

  **Definição**: Autorização, segregação de funções, rastreabilidade e minimização de privilégios são requisitos de arquitetura desde a Sprint 0, não controles adicionados ao final do projeto.

  **Critério de aceite**: Toda tabela e campo sensível deve ter ACL definida antes de uso funcional. Testes negativos ATF são obrigatórios.

  **Violações**: Controles apenas visuais (UI Policy sem ACL), roles amplos sem justificativa, ou ausência de testes negativos de segurança.

  ### 4.5 Event Driven Architecture

  **Definição**: Eventos desacoplam produtores e consumidores, permitem evolução modular e reduzem dependências síncronas entre pilares. Cada evento crítico deve ter observabilidade, retry e idempotência definidos.

  **Critério de aceite**: Todo evento publicado deve ter publisher, consumer, payload mínimo, idempotency_key, retry strategy e registro operacional definidos.

  **Violações**: Eventos sem consumer definido, payloads sem correlation_id, ou falhas assíncronas sem mecanismo de recuperação.

  ### 4.6 Least Privilege

  **Definição**: Cada persona recebe apenas os privilégios necessários ao seu papel operacional. Acesso técnico, acesso de governança e acesso de auditoria são separados por papéis e ACLs.

  **Critério de aceite**: Nenhuma persona acessa dados ou operações fora do seu escopo funcional. Validado por testes negativos ATF.

  **Violações**: Uso indiscriminado de admin ou itil, auto-aprovação, ou acesso de leitura irrestrito a dados sensíveis.

  ### 4.7 Governance by ADR

  **Definição**: Toda decisão estrutural — especialmente criação de tabela customizada, campo customizado, Script Include ou desvio OOB — deve possuir ADR com contexto, alternativas, decisão, consequências e riscos.

  **Critério de aceite**: Rastreabilidade entre ADR, artefato implementado, teste ATF e documentação de release.

  **Violações**: Customizações sem ADR, decisões estruturais em comentários de ticket, ou ADRs sem consequências documentadas.

  ### 4.8 ATF First

  **Definição**: Todo fluxo crítico deve nascer com testes automatizados mínimos, cobrindo happy path, exceções, ACLs, regressão e cenários negativos antes da promoção de update sets.

  **Critério de aceite**: Nenhum artefato crítico promovido sem suite ATF associada com pass rate de 100%.

  **Violações**: Promoção sem teste, testes manuais como único mecanismo de validação, ou ausência de testes negativos de ACL.

  ### 4.9 Aplicação Prática dos Princípios

  | Decisão Recorrente | Princípio Dominante | Critério de Aceite |
  | --- | --- | --- |
  | Criar tabela customizada | OOB First + Governance by ADR | Equivalente OOB avaliado, gap descrito, ADR aprovado e consequência documentada. |
  | Criar campo customizado | OOB First + CMDB Centric | Campo OOB avaliado e insuficiência semântica documentada. |
  | Criar Script Include | Configuration over Code | Flow Designer e Decision Tables avaliados; justificativa técnica documentada. |
  | Criar ACL | Least Privilege + Security by Design | Persona, operação, tabela, campo e teste negativo definidos. |
  | Publicar evento | Event Driven Architecture | Publisher, consumer, payload, idempotência, retry e observabilidade definidos. |
  | Alterar Decision Table | Governance by ADR | Teste de regressão ATF, evidência e aprovação do owner de governança. |
  | Promover update set | ATF First | Suite ATF com pass rate 100% e evidência anexada. |

  ---

  ## 5. Non Functional Requirements

  Os requisitos não funcionais são requisitos de arquitetura mensuráveis. Em PDI, servem como baseline técnico e critérios de disciplina. Em ambientes corporativos, exigiriam testes formais de carga e validação de capacidade.

  ### 5.1 Performance

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Operações interativas de formulário e lista | 95% das operações críticas de usuário respondem em até 3s em PDI saudável, excluindo latência externa. | Transaction Logs, métricas de Flow, testes manuais controlados e ATF. |
  | Risk Engine de mudança | Cálculo de score para Change com até 20 CIs relacionados completa em até 5s. | Teste de volume com massa sintética, baseline por sprint e logging de tempo de execução. |
  | Event processing | 99% dos eventos críticos processados em até 30s após publicação. | Event processing table com timestamps e métricas de duração. |

### 5.2 Scalability

Projeções de volume 1/3/5 anos e gates de capacidade estão na seção **11.10 Capacity Planning**.

| Escopo | Métrica | Validação |
| --- | --- | --- |
| Audit Trail | Suportar 100.000 registros sem impacto perceptível em formulários operacionais. | Índices por entity_type, entity_sys_id, correlation_id e created_on; política de retenção. |
  | User Access Registry | Suportar 50.000 registros de acesso com consultas por usuário/aplicação em <2s. | Índices por user, application, status e expiration_date. |
  | Risk Evidence | Suportar 10.000 registros de evidência com consultas por change em <1s. | Índice por change_sys_id e rule_version. |

  ### 5.3 Availability

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Disponibilidade lógica dos fluxos | Processos falham de forma controlada, com estados recuperáveis e fila de retry para eventos não concluídos. | Eventos com correlation_id, status de processamento e procedimento de reprocessamento. |
  | Degradação graciosa | Falha de CMDB não bloqueia o fluxo; gera score com confidence reduzida e tarefa de correção. | Teste de cenário com CMDB incompleta. |

  ### 5.4 Recoverability

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Falhas em eventos | Todo evento crítico possui mecanismo de reprocessamento manual e critério de reconciliação. | Tabela de controle de processamento, logs correlacionados e runbook de operação. |
  | Estado inconsistente | Reconciliação diária identifica divergências entre acesso governado e técnico. | Scheduled Job de reconciliação com relatório de exceções. |

  ### 5.5 Security

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Least Privilege | Nenhuma persona sem papel explícito pode ler ou alterar registros sensíveis. | ACLs de tabela, ACLs de campo, testes negativos ATF e revisão periódica. |
  | Audit Trail integrity | Registros de audit trail não podem ser editados ou deletados por nenhuma persona operacional. | ACL write-only, teste de tentativa de edição e deleção. |
  | Segregation of Duties | Nenhuma persona pode solicitar, aprovar e auditar sua própria decisão. | Validação por ATF com impersonation de personas. |
  | API Authentication | 100% das Scripted REST APIs EOAP exigem autenticação; acesso anônimo proibido em ambientes não-DEV. | OAuth 2.0 Client Credentials ou token de sessão autenticada; testes ATF de rejeição sem credencial. |
  | Transport Security | 100% das integrações inbound/outbound utilizam TLS 1.2+; Basic Auth desabilitado em TEST/PROD. | Connection & Credential Aliases com `use_mutual_auth` quando aplicável; revisão de endpoint por ambiente. |
  | Integration Auth | Integrações com HRIS/IAM/SIEM utilizam OAuth 2.0 ou certificado mútuo; credenciais nunca em código. | `sys_connection_alias` + rotação documentada; alerta de expiração de token. |

  ### 5.6 Auditability

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Rastreabilidade de decisões | 100% das aprovações, rejeições, mudanças de owner, alterações de score e exceções geram audit trail aplicacional. | Tabela write-only x_eoap_audit_trail, correlação por transaction_id e payload resumido. |
  | Correlation end-to-end | Todo fluxo tem correlation_id rastreável do evento ao audit trail. | Pesquisa por correlation_id retorna toda a cadeia de decisão. |
  | Critical event logging | 100% dos eventos críticos (catálogo seção 14.2) registram correlation_id em syslog estruturado e x_eoap_event_processing. | Revisão de amostra por sprint; ATF de publicação e consumo de evento. |

  ### 5.7 Maintainability

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Separação de responsabilidades | Nenhum Script Include concentra responsabilidades de múltiplos domínios. | Code review, naming convention, ADR e cobertura ATF. |
  | Evolução de regras | Alteração de regra de risco ou aprovação não requer deploy de código. | Decision Tables com versionamento e testes de regressão. |

  ### 5.8 Data Retention

  | Escopo | Métrica | Validação |
  | --- | --- | --- |
  | Audit Trail | Retenção mínima de 7 anos (SOX/ISO 27001); arquivamento após 2 anos na tabela operacional. | Política ADR-016; regras `sys_archive` e evidência de purge aprovado pelo Compliance Officer. |
  | Risk Evidence | Retenção mínima de 5 anos alinhada ao ciclo de vida da Change associada. | Archive rules e reconciliação com change_request. |
  | Event Processing | Retenção operacional de 90 dias; registros `failed_final` preservados até resolução manual. | Table Cleaner configurado; runbook EOAP-RUN-001. |
  | User Access Registry | Histórico de acessos revogados mantido por mínimo 2 anos; expurgo somente por requisição formal (LGPD). | Política documentada; sem auto-purge em x_eoap_user_access. |

  ---

  ## 6. High Level Architecture

  ### 6.1 C4 Level 1 — System Context Diagram

  O diagrama de contexto posiciona a EOAP no ecossistema corporativo, explicitando atores humanos, sistemas externos e a plataforma ServiceNow como host. Não descreve componentes internos — apenas fronteiras e fluxos de valor.

  ```mermaid
  flowchart TB
      subgraph Actors["Atores Humanos"]
          EMP[Colaborador / Requester]
          MGR[Gestor]
          AO[Access Owner]
          CM[Change Manager]
          AUD[Auditor]
          CAB[CAB]
      end

      subgraph EOAP_System["EOAP — Enterprise Operations Automation Platform"]
          SN[ServiceNow Instance]
      end

      subgraph External["Sistemas Externos — Futuro / Mock em PDI"]
          HRIS[HRIS — Workday / SAP HCM]
          IAM[IAM — Azure AD / Okta]
          VULN[Vulnerability — Qualys]
          SIEM[SIEM — Splunk / Sentinel]
      end

      EMP -->|Solicita acesso / lifecycle| SN
      MGR -->|Valida necessidade| SN
      AO -->|Aprova / recertifica acesso| SN
      CM -->|Submete Change| SN
      CAB -->|Delibera com contexto de risco| SN
      AUD -->|Consulta evidências| SN

      HRIS -.->|Employee events / Import Set| SN
      IAM -.->|Provision / Revoke| SN
      VULN -.->|Vulnerability context| SN
      SIEM -.->|Alertas / logs| SN
  ```

  | Fronteira | Descrição |
  | --- | --- |
  | EOAP ↔ Colaboradores | Catálogo, aprovações e notificações como System of Engagement. |
  | EOAP ↔ HRIS | Ingestão de eventos de lifecycle (joiner/mover/leaver); HRIS é System of Record para Employee. |
  | EOAP ↔ IAM | Provisionamento e revogação técnica; IAM é System of Action para identidade. |
  | EOAP ↔ ServiceNow CMDB | CMDB nativa é System of Record para Application e Service. |

  ### 6.2 C4 Level 2 — Container Diagram

  O diagrama de containers decompõe a EOAP em unidades deployáveis/lógicas dentro do escopo `x_eoap` e capacidades OOB da plataforma.

  ```mermaid
  flowchart TB
      subgraph Experience["Experience Containers"]
          CAT[Service Catalog]
          FORMS[Forms / Lists / Portal]
      end

      subgraph Orchestration["Orchestration Containers"]
          FD[Flow Designer Flows]
          APPR[Approval Engine]
          EVTQ[Event Queue — sysevent]
      end

      subgraph Domain["EOAP Domain Containers — Scoped App x_eoap"]
          AGS[Access Governance Service]
          LCS[Employee Lifecycle Orchestrator]
          RE[Risk Engine]
          EPR[Event Processor]
          AL[Audit Logger]
          CQS[CMDB Quality Service]
          DT[Decision Tables]
          API[Scripted REST API — /api/x_eoap/v1]
      end

      subgraph Data["Data Containers"]
          CMDB[(CMDB / CSDM — Global)]
          EOAPDB[(EOAP Custom Tables)]
          CHG[(change_request)]
          USR[(sys_user)]
      end

      subgraph Governance["Governance Containers"]
          ATF[ATF Suites]
          ADR[ADR Catalog — Git]
      end

      FORMS --> CAT
      CAT --> FD
      FD --> APPR
      FD --> AGS
      FD --> LCS
      FD --> RE
      FD --> EVTQ
      EVTQ --> EPR
      EPR --> AGS
      EPR --> AL
      AGS --> DT
      RE --> DT
      AGS --> EOAPDB
      RE --> EOAPDB
      AL --> EOAPDB
      EPR --> EOAPDB
      AGS --> CMDB
      RE --> CMDB
      RE --> CHG
      LCS --> USR
      API --> AGS
      ATF --> Domain
  ```

  ### 6.3 Camadas Arquiteturais

  A arquitetura é organizada em cinco camadas com responsabilidades claramente separadas:

  ```mermaid
  flowchart TB
      subgraph Experience["Experience Layer"]
          CI[Catalog Items]
          RP[Record Producers]
          FM[Forms / Lists]
          PT[Portal / Widgets]
      end

      subgraph Orchestration["Orchestration Layer"]
          FD[Flow Designer]
          SF[Subflows]
          AP[Approvals]
          EQ[Event Queue]
      end

      subgraph Decision["Decision Layer"]
          DT[Decision Tables]
          SI[Script Includes — Domain Services]
          BR[Business Rules — Controlled]
      end

      subgraph Data["Data Layer"]
          CMDB[CMDB / CSDM]
          CT[(Custom Tables — EOAP)]
          SU[sys_user / sys_user_group]
          CR[change_request]
      end

      subgraph Governance["Governance Layer"]
          AT[Audit Trail]
          EP[Event Processing]
          LG[Structured Logging]
          ATF[ATF Suites]
          ADR[ADR Catalog]
      end

      Experience --> Orchestration
      Orchestration --> Decision
      Orchestration --> EQ
      Decision --> Data
      EQ --> Decision
      Data --> Governance
      Decision --> Governance
      Orchestration --> Governance
  ```

  ### 6.4 Módulos

  | Módulo | Responsabilidade | Dependências Primárias | Artefatos Arquiteturais |
  | --- | --- | --- | --- |
  | CMDB Foundation | Estabelecer dados de aplicação, serviço, ownership e relacionamento. | CMDB, CSDM, ACLs, Data Quality Controls. | Business Applications, Application Services, relações e campos EOAP. |
  | Employee Lifecycle | Orquestrar eventos de entrada, movimentação e saída. | sys_user, Catalog, Flow Designer, Events. | Flows, eventos e audit trail. |
  | Access Governance | Controlar concessão, revogação, exceção e recertificação. | sys_user, CMDB, Approvals, Catalog, ACLs. | x_eoap_user_access, x_eoap_access_exception. |
  | Change Risk Guardian | Calcular e explicar risco de mudanças. | change_request, CMDB, incident/problem/outage, Decision Tables. | EOAP_RiskEngine, x_eoap_risk_evidence. |
  | Observability & Governance | Garantir rastreabilidade, testes e revisão. | syslog, sysevent, ATF, audit trail. | x_eoap_audit_trail, x_eoap_event_processing, ADRs. |

  ### 6.5 Dependências entre Módulos

  ```mermaid
  flowchart LR
      S0[Sprint 0 — Foundation] --> S1[Sprint 1 — CMDB Foundation]
      S1 --> S2[Sprint 2 — Employee Lifecycle]
      S1 --> S3[Sprint 3 — Access Governance]
      S2 --> S3
      S1 --> S4[Sprint 4 — Change Risk Guardian]
      S3 --> S5[Sprint 5 — Compliance & Recertification]
      S4 --> S5
      S5 --> S6[Sprint 6 — Hardening & ARB Package]
  ```

  A **CMDB Foundation** é predecessora de todos os demais pilares. Access Governance depende de Business Applications e Access Owners; Change Risk Guardian depende de Application Services e relações; Employee Lifecycle depende de sys_user e eventos bem definidos. **Observability e Security não são fases tardias, mas fundações implementadas desde a Sprint 0.**

  ### 6.6 Key Business Flows — Sequence Diagrams

  Os diagramas abaixo descrevem **interações arquiteturais** entre atores e containers. Detalhes de implementação (ações de Flow, campos, scripts) estão no SDD.

  #### 6.6.1 Joiner (Employee Onboarding)

  ```mermaid
  sequenceDiagram
      participant HRIS as HRIS (SoR Employee)
      participant SN as ServiceNow / EOAP
      participant LC as Lifecycle Flow
      participant EVT as Event Queue
      participant AG as Access Governance
      participant IAM as IAM (SoA Identity)
      participant AUD as Audit Trail

      HRIS->>SN: Import Set / eoap.employee.created
      SN->>LC: Trigger onboarding subflow
      LC->>EVT: Publish eoap.employee.created
      LC->>AUD: Log lifecycle start (correlation_id)
      EVT->>AG: Consume event — evaluate default entitlements
      AG->>SN: Create access requests (DT routing)
      SN->>AG: Approvals completed
      AG->>EVT: Publish eoap.access.approved
      EVT->>IAM: Provision (async, retry on failure)
      IAM-->>AG: Provision confirmation
      AG->>AUD: Log access granted
  ```

  #### 6.6.2 Access Request

  ```mermaid
  sequenceDiagram
      participant REQ as Requester
      participant CAT as Catalog
      participant FD as Access Flow
      participant DT as Decision Table
      participant APPR as Approval Engine
      participant AG as Access Governance
      participant AUD as Audit Trail

      REQ->>CAT: Submit access request
      CAT->>FD: Create request context
      FD->>DT: DT_Access_Approval_Routing
      DT-->>FD: Approval path
      FD->>APPR: Route to Access Owner
      APPR-->>FD: Approved / Rejected
      FD->>AG: Persist entitlement decision
      AG->>AUD: Audit trail (who, what, why, rule_version)
      FD->>REQ: Notification
  ```

  #### 6.6.3 Risk Calculation

  ```mermaid
  sequenceDiagram
      participant CM as Change Manager
      participant CHG as change_request
      participant RE as Risk Engine
      participant CMDB as CMDB
      participant DT as Decision Tables
      participant EVT as Event Queue
      participant AUD as Audit Trail

      CM->>CHG: Submit / update Change
      CHG->>RE: Trigger risk calculation
      RE->>CMDB: Query impacted CIs and services
      CMDB-->>RE: Context + completeness score
      RE->>DT: Apply weights and banding
      DT-->>RE: Score factors
      RE->>CHG: Persist score, band, explanation
      RE->>AUD: Write risk evidence (rule_version)
      RE->>EVT: Publish eoap.change.risk.calculated
  ```

  #### 6.6.4 Recertification

  ```mermaid
  sequenceDiagram
      participant JOB as Scheduled Job
      participant AG as Access Governance
      participant AO as Access Owner
      participant APPR as Approval Engine
      participant EVT as Event Queue
      participant IAM as IAM
      participant AUD as Audit Trail

      JOB->>AG: Identify due recertifications
      AG->>AO: Campaign task / approval
      AO->>APPR: Certify or revoke
      APPR-->>AG: Decision
      alt Certified
          AG->>AUD: Log recertification success
      else Revoked
          AG->>EVT: Publish eoap.access.revoked
          EVT->>IAM: Deprovision
          AG->>AUD: Log revocation (recertification_failed)
      end
  ```

  ---

  ## 7. Logical Architecture

  ### 7.1 Bounded Contexts (Domain Model)

  A EOAP é organizada em **quatro bounded contexts** com fronteiras explícitas. Comunicação entre contextos ocorre via eventos assíncronos, APIs REST ou leitura de dados compartilhados (CMDB/sys_user) — nunca por acoplamento direto de lógica procedural entre domínios.

  ```mermaid
  flowchart TB
      subgraph CMDB_CTX["CMDB Domain"]
          BA[Business Application]
          AS[Application Service]
          DQC[Data Quality Controls]
      end

      subgraph LIFECYCLE_CTX["Employee Lifecycle Domain"]
          ONB[Onboarding]
          MOV[Move / Transfer]
          OFF[Offboarding]
      end

      subgraph ACCESS_CTX["Access Governance Domain"]
          UAR[User Access Registry]
          EXC[Access Exception]
          REC[Recertification]
      end

      subgraph RISK_CTX["Risk Domain"]
          RE2[Risk Engine]
          REV[Risk Evidence]
          CAB2[CAB Context]
      end

      subgraph SHARED["Shared Kernel — Platform"]
          CMDB2[CMDB Tables]
          USER[sys_user]
          AUD2[Audit Trail]
          EVT2[Event Processing]
      end

      LIFECYCLE_CTX -->|eoap.employee.* events| ACCESS_CTX
      CMDB_CTX -->|read-only context| ACCESS_CTX
      CMDB_CTX -->|read-only context| RISK_CTX
      ACCESS_CTX -->|eoap.access.* events| SHARED
      RISK_CTX -->|eoap.change.risk.* events| SHARED
      LIFECYCLE_CTX -->|eoap.employee.* events| SHARED
  ```

  | Bounded Context | Responsabilidade | Entidades Principais | Integração com Outros Contextos |
  | --- | --- | --- | --- |
  | **CMDB Domain** | Qualidade, ownership e relações CSDM de aplicações e serviços. | Business Application, Application Service, relações cmdb_rel_ci. | Fornece contexto read-only para Access e Risk; publica `eoap.cmdb.quality.failed`. |
  | **Employee Lifecycle Domain** | Orquestração de joiner, mover e leaver. | sys_user, eventos de lifecycle. | Publica `eoap.employee.*`; não altera entitlements diretamente. |
  | **Access Governance Domain** | Ciclo de vida de entitlement, exceções e recertificação. | x_eoap_user_access, x_eoap_access_exception. | Consome eventos de lifecycle; consulta CMDB para routing; publica `eoap.access.*`. |
  | **Risk Domain** | Cálculo e explicação de risco de mudança. | x_eoap_risk_evidence, campos EOAP em change_request. | Consulta CMDB e histórico ITSM; publica `eoap.change.risk.calculated`. |

  **Regra de fronteira**: Script Includes de um contexto não invocam diretamente métodos de outro contexto. A orquestração cross-domain é responsabilidade do Event Processor ou de Subflows de propósito único.

### 7.2 C4 Level 3 — Component Diagram

Diagrama C4 de componentes dentro do container EOAP Scoped Application. Detalha Domain Services, Policy Layer e Storage — complementa o Container Diagram (seção 6.2).

```mermaid
  flowchart TB
      subgraph External["External Touchpoints — Future"]
          HRIS[HRIS — Workday/SAP]
          IAM[IAM — Azure AD/Okta]
          SIEM[SIEM — Splunk/Sentinel]
          DISC[Discovery — ITOM]
      end

      subgraph EOAP["EOAP Scoped Application"]
          subgraph Services["Domain Services"]
              AGS[AccessGovernanceService]
              RE[RiskEngine]
              AL[AuditLogger]
              EPR[EventProcessor]
              CQS[CMDBQualityService]
          end

          subgraph Policies["Policy Layer"]
              DT1[DT_Access_Approval_Routing]
              DT2[DT_Risk_Weights]
              DT3[DT_Risk_Banding]
              DT4[DT_Lifecycle_Actions]
          end

          subgraph Storage["EOAP Data"]
              UA[(x_eoap_user_access)]
              AE[(x_eoap_access_exception)]
              AuT[(x_eoap_audit_trail)]
              EP2[(x_eoap_event_processing)]
              RE2[(x_eoap_risk_evidence)]
          end
      end

      subgraph Platform["ServiceNow Platform"]
          CMDB2[CMDB / CSDM]
          CHG[Change Management]
          CAT[Service Catalog]
          APP[Approvals Engine]
          EVT[Event Queue]
          ATF2[ATF]
      end

      External -.->|Future| EOAP
      Services --> Policies
      Services --> Storage
      Services --> Platform
      Policies --> Platform
  ```

  ### 7.3 Separation of Concerns

  | Concern | Layer | Mechanism |
  | --- | --- | --- |
  | User interaction | Experience | Catalog Items, Record Producers, Forms |
  | Process orchestration | Orchestration | Flow Designer, Subflows, Approvals |
  | Business rules/policies | Decision | Decision Tables (declarative first) |
  | Reusable computation | Decision | Script Includes (quando DT não resolve) |
  | State persistence | Data | CMDB + Custom Tables |
  | Evidence & traceability | Governance | Audit Trail, Event Processing, Logs |
  | Validation | Governance | ATF, ACL Tests, Data Quality Controls |

  ---

  ## 8. Deployment Architecture

  ### 8.1 Environment Strategy

  | Environment | Propósito | Controle |
  | --- | --- | --- |
  | **DEV (PDI)** | Desenvolvimento, prototipagem e validação de conceito. | Update Sets por sprint, versionamento e ATF contínuo. |
  | **TEST** | Validação integrada, regressão e UAT (futuro). | Update Sets promovidos de DEV, suite ATF completa. |
  | **PROD** | Operação real com dados corporativos (futuro). | Update Sets aprovados, ATF obrigatório, rollback plan. |

  ### 8.2 Update Set Strategy

  | Princípio | Regra |
  | --- | --- |
  | Granularidade | Um Update Set por sprint ou feature lógica, nunca monolítico. |
  | Naming convention | `EOAP_Sprint{N}_{Feature}_{Date}` |
  | Dependências | Update Sets devem declarar predecessores. |
  | Validação pré-promoção | ATF suite com pass rate 100% obrigatório antes de promoção. |
  | Rollback | Back-out Update Set documentado para cada promoção crítica. |

  ### 8.3 Source Control Strategy

  | Aspecto | Decisão |
  | --- | --- |
  | Repositório | Git (GitHub) para documentação, ADRs e artefatos de configuração. |
  | Update Sets | Exportados como XML para versionamento complementar. |
  | Branching | `main` para releases aprovadas, `develop` para sprint ativo. |
  | Code Review | Obrigatório para Script Includes e Business Rules antes de merge. |

  ### 8.4 Versioning & Release Governance

  | Artefato | Estratégia de Versionamento | Convenção | Governança |
  | --- | --- | --- | --- |
  | **Decision Tables** | Snapshot exportado por sprint; campo `rule_version` persistido em risk_evidence e audit trail. | `DT_{Domain}_{Name}_v{major}.{minor}` — ex: `DT_EOAP_Risk_Weights_v1.2` | Alteração exige ATF regressão + aprovação Risk Analyst / Access Owner conforme domínio. |
  | **ADRs** | Versionamento semântico no repositório Git; status lifecycle (Proposed → Accepted → Deprecated → Superseded). | `ADR-{NNN}` com referência cruzada ao substituir | Novo ADR ou revisão formal no fechamento de sprint; ARB aprova decisões estruturais. |
  | **Update Sets** | Um Update Set por sprint/feature; XML exportado para Git após merge. | `EOAP_Sprint{N}_{Feature}_{YYYYMMDD}` | Promoção DEV→TEST→PROD com gate ATF 100%. |
  | **Scoped Application** | Release tag no Git alinhada ao sprint. | `eoap-v{major}.{minor}.{patch}` — SemVer para releases ARB | Major = breaking change de contrato de evento/API; Minor = nova capability; Patch = correção. |
  | **Event Contracts** | Versionamento no envelope (`schema_version`). | `1.0`, `1.1` — backward compatible; `2.0` = breaking | Breaking change exige novo ADR e período de coexistência de consumers. |
  | **Scripted REST API** | Path versionado na URL. | `/api/x_eoap/v1/` — `v2` somente com ADR | Deprecation notice de 1 sprint antes de remover endpoint. |

  #### 8.4.1 Release Cadence

  | Modelo | Aplicação EOAP | Descrição |
  | --- | --- | --- |
  | **Sprint-based delivery** | PDI / desenvolvimento | Entregas incrementais Sprint 0–6 com Definition of Done e ATF por sprint. |
  | **Release Train (futuro corporativo)** | TEST → PROD | Promoção quinzenal ou mensal após UAT; Update Sets agrupados por release tag `eoap-v*`. |
  | **Hotfix path** | PROD crítico | Patch Update Set com escopo mínimo, ATF targeted e back-out plan obrigatório. |

  ### 8.5 Promotion Strategy

  ```mermaid
  flowchart LR
      DEV["DEV (PDI)"] -->|Update Set + ATF| TEST["TEST"]
      TEST -->|UAT + ATF Suite| PROD["PROD"]

      DEV -->|Export XML| GIT["Git Repository"]
      GIT -->|Documentation + ADRs| ARB["ARB Package"]
  ```

  | Gate | Critério | Evidência |
  | --- | --- | --- |
  | DEV → TEST | ATF suite 100%, code review, ADR atualizado | Screenshot ATF, merge request aprovada |
  | TEST → PROD | UAT aprovado, regressão completa, rollback plan | UAT sign-off, ATF report, back-out plan |

  ---

  ## 9. ServiceNow Capability Mapping

  O mapeamento demonstra como a EOAP utiliza capacidades OOB antes de recorrer a extensões. Quando existe componente customizado, a justificativa está ligada a gap semântico documentado.

  | Capability | OOB Component | Custom Component | Gap Semântico | Referência |
  | --- | --- | --- | --- | --- |
  | CMDB Foundation | cmdb_ci_business_app, cmdb_ci_service_discovered, cmdb_rel_ci, ownership OOB | Campos de governança EOAP em Business Application e Application Service | owned_by ≠ access_owner; business_criticality ≠ access_criticality | CSDM [1] |
  | Employee Lifecycle | sys_user, sys_user_group, Flow Designer, Catalog, Approvals | Estados EOAP de lifecycle e eventos de orquestração | Plataforma não orquestra onboarding/offboarding end-to-end nativamente | Flow Designer [2] |
  | Access Governance | sys_user_has_role, sys_user_grmember, Approvals, Catalog | x_eoap_user_access, x_eoap_access_exception | OOB não modela entitlement com validade, owner, evidência e recertificação | ADR-011 |
  | Change Risk | change_request, cmdb_rel_ci, incident, problem, Decision Tables | EOAP_RiskEngine, x_eoap_risk_evidence | OOB não decompõe score em fatores explicáveis e auditáveis | Decision Tables [5] |
  | Security | Roles, ACLs, sys_audit, ATF | ACLs de escopo EOAP, audit trail write-only | sys_audit não captura semântica de decisão de negócio | ACLs [4] |
  | Observability | System Logs, Event Queue, Flow execution | x_eoap_audit_trail, x_eoap_event_processing | Logs técnicos não oferecem governança operacional de eventos | ADR-006 |
  | Approvals | Approval Engine, sysapproval_approver | Decision Tables de roteamento | Roteamento deve ser declarativo e configurável por política | ADR-002 |
  | Testing | ATF, sys_atf_test, sys_atf_test_suite | Suites específicas por pilar e segurança | ATF OOB, mas suites precisam ser desenhadas | ATF [3] |

  ---

  ## 10. CSDM Architecture

  ### 10.1 Aderência ao CSDM

  A EOAP adere ao CSDM ao tratar as seguintes entidades como elementos distintos, porém relacionados. O objetivo não é apenas preencher CMDB, mas estruturar dados de forma que governança de acesso e risco de mudança possam consumir relações confiáveis.

  | Entidade CSDM | Tabela ServiceNow | Uso na EOAP | Validação de Aderência |
  | --- | --- | --- | --- |
  | Business Capability | cmdb_ci_business_capability | Contextualizar criticidade de aplicação e impacto operacional. | ✅ Consumida, não estendida. |
  | Business Application | cmdb_ci_business_app | Concentra ownership, access owner, classificação e governança. | ✅ Estendida com campos EOAP justificados por ADR-008 e ADR-009. |
  | Application Service | cmdb_ci_service_discovered | Serviço operacional consumido por Risk Guardian e Access Governance. | ✅ Estendida com operational_tier por ADR-010. |
  | Technical Service | cmdb_ci_service_technical | Contexto de sustentação e impacto técnico. | ✅ Consumida, não estendida. |
  | Infrastructure | cmdb_ci_* (servers, network, etc.) | Contexto de impacto de mudança em CIs técnicos. | ✅ Consumida via cmdb_rel_ci. |
  | Information Object | cmdb_ci_information_object | Alimenta classificações de acesso e risco. | ✅ Consumida para data_classification. |

  ### 10.2 Relacionamentos CSDM

  ```mermaid
  erDiagram
      BUSINESS_CAPABILITY ||--o{ BUSINESS_APPLICATION : "é suportada por"
      BUSINESS_APPLICATION ||--o{ APPLICATION_SERVICE : "é fornecida por"
      APPLICATION_SERVICE ||--o{ TECHNICAL_SERVICE : "depende de"
      TECHNICAL_SERVICE ||--o{ INFRASTRUCTURE_CI : "executa em"
      BUSINESS_APPLICATION ||--o{ INFORMATION_OBJECT : "processa"
      BUSINESS_APPLICATION ||--o{ EOAP_USER_ACCESS : "governa acessos de"
      APPLICATION_SERVICE ||--o{ EOAP_RISK_EVIDENCE : "impacta risco de"
      BUSINESS_APPLICATION }o--|| ACCESS_OWNER : "tem access owner"
  ```

  ### 10.3 CSDM Compliance Assessment

  | Critério CSDM | Status | Observação |
  | --- | --- | --- |
  | Business Application como entidade primária de governança | ✅ Conforme | Owner técnico e access owner definidos. |
  | Application Service como unidade de impacto | ✅ Conforme | Usado em Risk Guardian e Access Governance. |
  | Relações via cmdb_rel_ci | ✅ Conforme | Não são criadas tabelas de relação paralelas. |
  | Information Objects para classificação | ✅ Conforme | Alimenta data_classification e risco. |
  | Technical Services preservados | ✅ Conforme | Consumidos, não modificados. |
  | Não duplicação de entidades CSDM | ✅ Conforme | Nenhuma tabela paralela ao CSDM. |
  | Extensões justificadas por gap | ✅ Conforme | Todos os campos EOAP possuem ADR. |

  ---

  ## 11. Data Architecture

  ### 11.1 Logical Data Model

  O modelo preserva tabelas nativas como fonte de verdade. Tabelas customizadas são introduzidas apenas para entidades de governança sem equivalente OOB suficiente.

  ```mermaid
  erDiagram
      SYS_USER ||--o{ X_EOAP_USER_ACCESS : "recebe acesso"
      CMDB_CI_BUSINESS_APP ||--o{ X_EOAP_USER_ACCESS : "concede acesso a"
      CMDB_CI_BUSINESS_APP ||--o{ CMDB_CI_SERVICE_DISCOVERED : "fornece"
      CHANGE_REQUEST ||--o{ X_EOAP_RISK_EVIDENCE : "tem evidência"
      X_EOAP_USER_ACCESS ||--o{ X_EOAP_ACCESS_EXCEPTION : "pode ter exceção"
      X_EOAP_USER_ACCESS ||--o{ X_EOAP_AUDIT_TRAIL : "auditado por"
      X_EOAP_EVENT_PROCESSING ||--o{ X_EOAP_AUDIT_TRAIL : "registra"
      X_EOAP_RISK_EVIDENCE ||--o{ X_EOAP_AUDIT_TRAIL : "evidenciado em"
  ```

  ### 11.2 Custom Tables — Justificação Arquitetural

  | Tabela | Propósito | Equivalente OOB Avaliado | Gap | ADR |
  | --- | --- | --- | --- | --- |
  | x_eoap_user_access | Registro governado de acesso com validade, owner, justificativa e recertificação. | sys_user_has_role, sys_user_grmember | OOB não modela lifecycle de entitlement como objeto auditável. | ADR-011 |
  | x_eoap_access_exception | Exceções temporárias com risco, aprovação, validade e compensating controls. | sysapproval_approver, task, sc_req_item | OOB não conserva semântica de exceção de controle com expiração e reconciliação. | ADR-014 |
  | x_eoap_audit_trail | Trilha de auditoria write-only para decisões, score e exceções. | sys_audit, syslog | sys_audit não captura contexto semântico de decisão de negócio. | ADR-006 |
  | x_eoap_event_processing | Controle de eventos com status, retry, correlation_id e idempotency_key. | sysevent, syslog | sysevent não oferece governança operacional e reconciliação de processo. | ADR-012 |
  | x_eoap_risk_evidence | Evidências de cálculo de risco por fator, regra e version. | change_request fields | Campos em change_request não suportam decomposição auditável de fatores. | ADR-010 |

  ### 11.3 Custom Fields — Justificação Arquitetural

  | Tabela | Campo | Tipo | Gap OOB | ADR |
  | --- | --- | --- | --- | --- |
  | cmdb_ci_business_app | x_eoap_access_owner | Reference (sys_user) | owned_by ≠ responsável de governança de acesso. | ADR-009 |
  | cmdb_ci_business_app | x_eoap_data_classification | Choice | Campos OOB de criticidade ≠ taxonomia de sensibilidade de dados. | ADR-008 |
  | cmdb_ci_business_app | x_eoap_access_criticality | Choice | business_criticality ≠ criticidade de entitlement/acesso. | ADR-008 |
  | cmdb_ci_service_discovered | x_eoap_operational_tier | Choice | Classificação precisa alinhar ao modelo de risco EOAP. | ADR-010 |
  | change_request | x_eoap_risk_score | Integer | OOB risk ≠ score composto, explicável e versionado. | ADR-010 |
  | change_request | x_eoap_risk_band | Choice | Banda EOAP derivada por Decision Table com thresholds próprios. | ADR-010 |
  | change_request | x_eoap_risk_explanation | String | Work notes ≠ campo estruturado de decisão. | ADR-010 |

  ### 11.4 Data Ownership

  | Objeto de Dado | Owner Primário | Data Steward | Critério de Qualidade |
  | --- | --- | --- | --- |
  | Business Application | Application Owner | CMDB Manager | Owner, access owner, criticidade, classificação e status preenchidos. |
  | Application Service | Service Owner | CMDB Manager | Relação com Business Application e CIs relevantes definida. |
  | User Access Registry | Access Owner | Access Governance Admin | Usuário, aplicação, validade, justificativa e status definidos. |
  | Access Exception | Access Owner | Risk Analyst | Validade, risco, compensating control e aprovação registrados. |
  | Risk Evidence | Change Manager | Risk Analyst | Score, regra, fator e referência de Change registrados. |
  | Audit Trail | Platform Owner | Auditor | Imutabilidade, correlation_id e payload mínimo. |

  ### 11.4.1 System of Record / Engagement / Action Matrix

  Esta matriz formaliza **quem é dono do dado** e qual papel cada sistema exerce no ecossistema. Em PDI, sistemas externos são simulados por mocks; a matriz permanece válida para evolução corporativa.

  | Dado / Entidade | System of Record (SoR) | System of Engagement (SoE) | System of Action (SoA) | Sincronização |
  | --- | --- | --- | --- | --- |
  | Employee (identidade humana) | HRIS — Workday / SAP HCM | ServiceNow (forms, notificações) | — | Import Set diário + evento `eoap.employee.*` |
  | Identity (conta técnica, grupos AD) | Azure AD / Okta | ServiceNow Catalog | IAM — provisionamento/revogação | Outbound REST + reconciliação diária |
  | Business Application | ServiceNow CMDB (`cmdb_ci_business_app`) | EOAP dashboards / forms | — | CMDB Manager + Data Quality Controls |
  | Application Service | ServiceNow CMDB (`cmdb_ci_service_discovered`) | EOAP Risk / Access views | — | CMDB relações + Discovery futuro |
  | Access Registry (entitlement governado) | EOAP (`x_eoap_user_access`) | ServiceNow Catalog + Approvals | IAM para execução técnica | Event-driven + reconciliation job |
  | Access Exception | EOAP (`x_eoap_access_exception`) | Catalog + Approvals | IAM (se aplicável) | Flow + audit trail |
  | Change Request | ServiceNow ITSM (`change_request`) | Change form / CAB | — | OOB Change Management |
  | Risk Score & Evidence | EOAP (`x_eoap_risk_evidence` + campos EOAP) | Change form (contexto CAB) | — | Risk Engine on submit/update |
  | Audit Evidence (decisões) | EOAP (`x_eoap_audit_trail`) | Relatórios / dashboards auditoria | SIEM (futuro) | Append-only; export para SIEM |
  | Vulnerability context | Qualys (futuro) | EOAP Risk views | — | Import Set / API (futuro) |
  | Decision Policies | EOAP Decision Tables (versionadas) | — | — | Update Set + Git backup por sprint |

  **Princípio**: Em caso de divergência entre SoR e SoA (ex: grupo ativo no AD sem registro em `x_eoap_user_access`), o **reconciliation job** trata como drift e o Access Owner decide mitigação conforme runbook EOAP-RUN-002.

  ### 11.5 Data Classification

  | Classificação | Descrição | Controles |
  | --- | --- | --- |
  | Public | Dados de conhecimento público sem impacto de divulgação. | ACLs básicas, sem restrição especial. |
  | Internal | Dados de uso interno com impacto limitado. | ACLs de role, logging padrão. |
  | Confidential | Dados sensíveis com impacto significativo de divulgação. | ACLs restritivas, field ACLs, audit trail obrigatório. |
  | Restricted | Dados altamente sensíveis com impacto severo. | ACLs mínimas, SoD, aprovação multi-nível, audit trail e monitoramento. |

  ### 11.6 Data Lifecycle

  | Entidade | Criação | Atualização | Encerramento | Retenção |
  | --- | --- | --- | --- | --- |
  | Business Application | CMDB Manager ou import controlado. | Application Owner com ACL. | Lifecycle de aplicação. | Enquanto ativa + período de auditoria. |
  | User Access Registry | Solicitação aprovada ou evento de lifecycle. | Mudança de validade, status ou owner. | Revogação, expiração ou desligamento. | Mínimo 2 anos; parametrizável. |
  | Access Exception | Solicitação justificada e aprovada. | Compensating control ou validade. | Expiração automática ou manual. | Conforme política de auditoria. |
  | Risk Evidence | Cálculo de risco. | Write-once; sem alteração funcional. | Vinculada à Change. | Mínimo 1 ano. |
  | Audit Trail | Evento de decisão. | Write-only; sem atualização. | Não aplicável. | Conforme ADR-016. |
  | Event Processing | Publicação de evento. | Status de processamento. | Após retenção. | 90 dias operacional; arquivamento posterior. |

  ### 11.7 Retention & Archiving Strategy

  Para garantir que a plataforma mantenha alta performance operacional em tabelas de grande volume sem comprometer a auditabilidade regulatória, a EOAP implementa uma estratégia de **Data Lifecycle Management (DLM)** dividida em três fases: **Retenção Operacional**, **Arquivamento** e **Expurgo (Purge)**, utilizando as capacidades nativas do ServiceNow de **Data Archiving** e **Table Cleaner (Auto-Flush)**.

  | Tabela | Volume Estimado (Anual) | Retenção Operacional (Main Table) | Destino do Arquivamento (sys_archive) | Política de Expurgo (Purge) |
  | --- | --- | --- | --- | --- |
  | `x_eoap_audit_trail` | ~5.000.000 registros | 2 anos (pesquisável em listas ativas) | Moved para `ar_x_eoap_audit_trail` | Expurgo após 7 anos (requisito SOX / ISO 27001) sob aprovação explícita do Compliance Officer. |
  | `x_eoap_event_processing` | ~10.000.000 registros | 90 dias (utilizado para retries) | Não aplicável (payloads descartáveis) | Purge automático via **Table Cleaner** (`sys_cleaner`) após 90 dias para eventos processados. |
  | `x_eoap_risk_evidence` | ~1.500.000 registros | 1 ano (atrelada à auditoria de Changes) | Moved para `ar_x_eoap_risk_evidence` | Expurgo após 5 anos, acompanhando a política padrão da Change Request associada. |
  | `x_eoap_user_access` | ~200.000 registros | Enquanto ativo + 2 anos após revogação | Não aplicável (mantido para histórico de acessos) | Sem expurgo automático. Expurgo somente mediante requisição formal da DPO sob regras de privacidade (LGPD). |
  | `x_eoap_access_exception` | ~50.000 registros | 2 anos após encerramento/expiração | Moved para `ar_x_eoap_access_exception` | Expurgo após 5 anos. |

  #### 11.7.1 Mecanismo de Arquivamento (ServiceNow Data Archiving)
  O arquivamento utiliza regras nativas do ServiceNow (`sys_archive`):
  - **Archive Rules**: Criadas para mover registros baseados na coluna `sys_created_on` (ou `valid_to` para exceções) atingindo os limites da tabela acima.
  - **Preservação de Performance**: Registros arquivados são deletados fisicamente da tabela principal e gravados nas tabelas de arquivo (prefixadas com `ar_`), reduzindo drasticamente o tamanho das tabelas operacionais e maximizando o hit rate dos índices.
  - **Acesso de Auditoria**: Auditores corporativos e administradores utilizam as tabelas de arquivo (`ar_x_eoap_audit_trail`) para reconstituir decisões históricas de mais de 2 anos, garantindo trilha de auditoria completa.

  #### 11.7.2 Mecanismo de Expurgo (ServiceNow Table Cleaner / Auto-Flush)
  - **Table Cleaner (`sys_cleaner`)**: Configurado nativamente como job em background executado diariamente em janelas de baixa concorrência (ex: 03:30 AM).
  - **Event Cleanup Rules**: A tabela `x_eoap_event_processing` recebe auto-flush para registros com status `processed` ou `ignored_duplicate` com mais de 90 dias. Registros em estado de erro persistente (`failed_final`) são preservados para fins de depuração e exigem análise do administrador antes do descarte manual.

  ### 11.8 Data Quality Controls

  | Controle | Regra | Ação quando Falha |
  | --- | --- | --- |
  | Completeness de Business Application | Owner, access owner, criticidade e classificação obrigatórios para apps críticas. | Bloquear uso em aprovações críticas ou gerar exceção de qualidade. |
  | Relacionamento Application Service | Application Service crítico deve estar relacionado a Business Application. | Sinalizar dashboard e reduzir confiança do risk score. |
  | Access Owner válido | x_eoap_access_owner deve referenciar usuário ativo ou grupo autorizado. | Impedir aprovação automática e escalar ao CMDB Manager. |
  | Validade de acesso | Acesso temporário deve possuir data de expiração. | Gerar evento de expiração e tarefa de revisão. |
  | Evidência de risco | Toda Change avaliada deve possuir risk evidence. | Bloquear promoção de estado ou gerar tarefa de correção. |
  | Índices obrigatórios | Tabelas de alto volume devem ter índices por campos de consulta frequente. | Validação em Sprint 0 e revisão por sprint. |

  ### 11.9 Access Domain — Escopo ADD vs SDD

  O **ciclo de vida de entitlement** (estados, transições, atores e gatilhos de `x_eoap_user_access`) é **design de solução**, não decisão arquitetural. Neste ADD, a decisão arquitetural relevante está em ADR-011 (User Access Registry como entidade governada) e na matriz SoR/SoE/SoA (seção 11.4.1).

> **Referência de implementação**: diagrama de estados, tabela de transições, campos e regras de integridade estão no [Solution Design Document — Seção 1.1 e 1.1 Transições de Estado](EOAP_SDD_v2.md#11-x_eoap_user_access--user-access-registry).

### 11.10 Capacity Planning

Projeção de crescimento para dimensionamento de índices, archiving e validação de NFRs. Premissas base: organização de **5.000 colaboradores**, **120 Business Applications**, média de **8 entitlements/usuário/ano**, **2.400 Changes/ano**, **~15 eventos EOAP/dia/usuário ativo** em cenário corporativo simulado.

| Tabela / Artefato | Ano 1 | Ano 3 | Ano 5 | Driver de Crescimento | Ação Arquitetural |
| --- | --- | --- | --- | --- | --- |
| `x_eoap_user_access` | 50.000 | 150.000 | 250.000 | Headcount + apps + recertificações | Índices user, application, status, valid_to; sem auto-purge |
| `x_eoap_audit_trail` | 500.000 | 2.000.000 | 5.000.000 | 1 registro por decisão/evento crítico | Archive após 2 anos; purge após 7 anos (ADR-016) |
| `x_eoap_event_processing` | 2.000.000 | 8.000.000 | 15.000.000 | Volume de eventos assíncronos | Table Cleaner 90 dias; monitorar `failed_final` |
| `x_eoap_risk_evidence` | 20.000 | 60.000 | 100.000 | Changes avaliadas × fatores de score | Archive após 1 ano; índice change_sys_id |
| `x_eoap_access_exception` | 5.000 | 15.000 | 25.000 | Exceções temporárias | Archive 2 anos pós-expiração |
| Business Applications (CMDB) | 120 | 180 | 250 | Portfólio de aplicações | Data Quality gate antes de PROD |

#### 11.10.1 Premissas de Cálculo

| Premissa | Valor | Impacto |
| --- | --- | --- |
| Crescimento de headcount | 8% a.a. | Escala user_access e eventos de lifecycle |
| Entitlements ativos por usuário | 6–10 (média 8) | Volume de x_eoap_user_access |
| Taxa de auditoria (audit trail / transação) | 1,2 registros por decisão | Volume de audit_trail |
| Changes com risk evaluation | 100% das Changes Normal/Emergency | Volume de risk_evidence |
| Concorrência operacional (PROD) | 50 usuários simultâneos; pico 150 | Baseline para NFR 5.1 (3s) |

#### 11.10.2 Gates de Capacidade

| Gate | Critério | Evidência |
| --- | --- | --- |
| PDI baseline | Massa sintética 10% do volume Ano 1 | ATF + Transaction Logs |
| Pré-PROD | Massa sintética 50% do volume Ano 1 | Load test documentado no Implementation Guide |
| PROD Ano 1 | Monitoramento vs. projeção trimestral | Dashboard capacity + revisão Platform Owner |

---

## 12. Security Architecture

  ### 12.1 Authentication

  | Aspecto | Decisão |
  | --- | --- |
  | Método primário | Autenticação nativa ServiceNow (local em PDI). |
  | SSO (futuro) | SAML 2.0 ou OpenID Connect via Azure AD/Okta. |
  | MFA (futuro) | Obrigatório para papéis administrativos e de governança. |
  | Service accounts | Contas de serviço dedicadas para integrações futuras com credenciais rotacionadas. |

  ### 12.2 Authorization

  | Aspecto | Decisão |
  | --- | --- |
  | Modelo | Role-Based Access Control (RBAC) com papéis de escopo EOAP. |
  | Granularidade | ACLs de tabela + ACLs de campo para dados sensíveis. |
  | Enforcement | ACLs são o mecanismo mandatório; UI Policy é complementar, nunca substituto. |
  | Princípio | Deny by default; grant explicitly. |

  ### 12.3 Roles

  | Role | Descrição | Operações Permitidas | Contains Roles |
  | --- | --- | --- | --- |
  | x_eoap.admin | Administrador funcional e técnico do escopo EOAP. | Configurar tabelas, regras, propriedades e rotinas administrativas. | x_eoap.cmdb_manager, x_eoap.access_owner |
  | x_eoap.cmdb_manager | Gestor de dados CMDB relevantes ao EOAP. | Criar e manter campos EOAP em Business Application e Application Service. | — |
  | x_eoap.access_owner | Owner de governança de acesso. | Aprovar, rejeitar, revisar e justificar acessos sob sua responsabilidade. | — |
  | x_eoap.change_manager | Gestor de mudança. | Consultar risk score, revisar evidências e aprovar exceções. | — |
  | x_eoap.risk_analyst | Analista de risco. | Manter Decision Tables de risco e analisar resultados. | — |
  | x_eoap.auditor | Auditor de leitura. | Ler audit trail, evidências e relatórios. Não altera registros. | — |
  | x_eoap.manager | Gestor de colaborador. | Solicitar/validar acessos e confirmar necessidade de negócio. | — |

  ### 12.4 ACL Strategy

  A estratégia de ACLs aplica **defesa em profundidade**:

  1. **Table ACLs** controlam acesso às operações CRUD por tabela
  2. **Field ACLs** protegem campos individuais sensíveis
  3. **UI Policies** e **Client Scripts** melhoram UX mas **não são controles de segurança**
  4. **Condition-based ACLs** restringem acesso por contexto (ex: Access Owner lê apenas seus registros)

  ### 12.5 Record ACLs

  | Tabela | Operação | Role Mínima | Condição |
  | --- | --- | --- | --- |
  | x_eoap_user_access | read | x_eoap.admin, x_eoap.auditor, x_eoap.access_owner | Access Owner lê registros sob sua responsabilidade. |
  | x_eoap_user_access | write | x_eoap.admin, x_eoap.access_owner | Somente status/justificativa permitidos por estado. |
  | x_eoap_user_access | create | x_eoap.admin, system | Criação por Flow ou Service; não manual. |
  | x_eoap_user_access | delete | none | Deleção proibida; use status de revogação. |
  | x_eoap_access_exception | create | x_eoap.access_owner, x_eoap.admin | Justificativa e validade obrigatórias. |
  | x_eoap_access_exception | delete | none | Deleção proibida. |
  | x_eoap_audit_trail | create | system/service only | Criação por EOAP_AuditLogger; sem criação manual. |
  | x_eoap_audit_trail | read | x_eoap.admin, x_eoap.auditor | Leitura controlada por papel. |
  | x_eoap_audit_trail | write | none | Write-only; sem edição. |
  | x_eoap_audit_trail | delete | none | Deleção proibida. |
  | x_eoap_risk_evidence | read | x_eoap.change_manager, x_eoap.risk_analyst, x_eoap.auditor | Conforme CAB, risco ou auditoria. |
  | x_eoap_risk_evidence | write | system/service only | Criação por RiskEngine; sem edição manual. |
  | x_eoap_event_processing | read | x_eoap.admin | Monitoramento operacional. |
  | x_eoap_event_processing | write | system/service only | Atualização por EventProcessor. |

  ### 12.6 Field ACLs

  | Campo | Regra | Justificativa |
  | --- | --- | --- |
  | x_eoap_user_access.risk_rating | Somente Risk Analyst/Admin escreve; Access Owner lê. | Evitar manipulação de classificação por aprovador interessado. |
  | x_eoap_user_access.justification | Solicitante/Access Owner escreve em estados permitidos. | Justificativa rastreável e controlada por estado. |
  | x_eoap_audit_trail.payload_summary | Auditor/Admin lê; demais sem acesso. | Pode conter contexto sensível. |
  | change_request.x_eoap_risk_score | Risk Engine escreve; Change Manager lê. | Score calculado, não editado manualmente. |
  | cmdb_ci_business_app.x_eoap_access_owner | CMDB Manager/Admin escreve; Access Owner lê. | Evitar autoatribuição de owner. |

  ### 12.7 Segregation of Duties

  | Separação | Regra | Validação |
  | --- | --- | --- |
  | Solicitante ≠ Aprovador | Quem solicita acesso não pode aprovar o próprio pedido. | Approval flow com exclusão de self-approval. |
  | Access Owner ≠ Risk Analyst | Quem governa acesso não calibra regras de risco. | Roles separados sem herança. |
  | Risk Analyst ≠ Change Manager | Quem define regras de risco não aprova exceções de mudança. | Roles separados. |
  | Operacional ≠ Auditor | Quem opera processos não altera evidências de auditoria. | Audit trail write-only + ACL de leitura para auditor. |
  | Admin ≠ Auditor exclusivo | Admin pode administrar, mas auditoria formal é papel separado. | Roles distintos com intersecção controlada. |

### 12.8 Threat Model (STRIDE)

Análise STRIDE aplicada aos componentes EOAP. Cada categoria mapeia ameaças identificadas aos controles arquiteturais já definidos neste ADD.

| STRIDE | Ameaça | Vetor / Superfície | Impacto | Controle Arquitetural |
| --- | --- | --- | --- | --- |
| **S**poofing | Persona ou integração se passa por Access Owner, admin ou sistema IAM. | APIs REST sem auth; credenciais compartilhadas; SSO ausente em PROD. | Decisões de acesso ou provisionamento fraudulentas. | OAuth 2.0 / SSO (NFR 5.5); service accounts dedicadas; Connection & Credential Aliases. |
| **S**poofing | Publicação de evento com `source` falsificado. | `sysevent` / Scripted REST inbound. | Concessão ou revogação indevida. | Validação de publisher; ACL system-only em consumers; idempotency_key. |
| **T**ampering | Edição de risk score, band ou audit trail. | Formulários change_request; listas audit_trail. | CAB decide com risco subestimado; perda de evidência. | Field ACL write-by-engine; audit trail write-only (seção 12.5); ATF negativo. |
| **T**ampering | Alteração de Decision Tables sem governança. | UI admin DT por role excessivo. | Roteamento ou score incorreto. | Role restrito (x_eoap.risk_analyst); versionamento DT (8.4); ATF regressão. |
| **R**epudiation | Negar aprovação ou concessão de acesso. | Ausência de trilha correlacionada. | Falha em auditoria SOX/ISO. | x_eoap_audit_trail append-only; correlation_id end-to-end (NFR 5.6). |
| **I**nformation Disclosure | Leitura de entitlements, exceções ou payload de auditoria. | ACLs amplas; logs com PII. | Exposição de dados classificados. | RBAC + Field ACLs; minimização em syslog (15.1); classificação de dados (11.5). |
| **I**nformation Disclosure | Exfiltração via relatórios de audit trail. | Role auditor com escopo irrestrito. | Vazamento de contexto sensível. | Field ACL em payload_summary; leitura auditor controlada. |
| **D**enial of Service | Saturação de event processing ou audit trail. | Flood de eventos; import massivo HRIS. | Filas `failed_final`; degradação de UI. | Idempotência; chunks de 200 registros (18.3); archiving (11.7); alertas (15.4). |
| **D**enial of Service | Lock contention em sys_user / user_access. | Import concorrente + lifecycle. | Timeouts transacionais. | Retry com backoff (14.7); transações curtas; capacity gates (11.10). |
| **E**levation of Privilege | Auto-atribuição de x_eoap.admin ou access_owner. | Role assignment ACL fraca. | Controle total da plataforma EOAP. | ACLs de role assignment; ATF negativo; revisão periódica de papéis. |
| **E**levation of Privilege | Self-approval de acesso ou exceção. | Approval flow mal configurado. | Violação SoD. | Exclusão self-approval (12.7); validação ATF por persona. |
| **E**levation of Privilege | x_eoap.admin cria entitlement manualmente. | ACL create permissiva. | Bypass de catálogo e aprovação. | create = system/service only em x_eoap_user_access (política 12.5). |

  ---

  ## 13. Integration Architecture

  A arquitetura de integração da EOAP é projetada sob o princípio do **desacoplamento seguro (loose coupling)**. Ela visa isolar o core da Scoped Application de sistemas externos (como HRIS Workday ou provedores IAM Okta/Azure AD) e garantir resiliência transacional através de Correlation IDs e estratégias robustas de retry.

  A matriz **System of Record / Engagement / Action** (seção 11.4.1) é a referência canônica para ownership de dados em integrações. Esta seção define **como** os sistemas se conectam; a matriz define **quem** é autoritativo.

  ### 13.0 Integration Landscape

  ```mermaid
  flowchart LR
      subgraph SoR["Systems of Record"]
          WD[Workday / SAP HCM]
          CMDB3[ServiceNow CMDB]
          EOAP_REG[EOAP Access Registry]
      end

      subgraph SoE["Systems of Engagement"]
          SN_CAT[ServiceNow Catalog]
          SN_CHG[Change Management]
      end

      subgraph SoA["Systems of Action"]
          AAD[Azure AD / Okta]
          QUALYS[Qualys]
      end

      WD -->|Import Set / REST| SN_CAT
      SN_CAT --> EOAP_REG
      EOAP_REG -->|Outbound REST| AAD
      CMDB3 --> SN_CHG
      QUALYS -.->|Future API| SN_CHG
  ```

  | Integração | Direção | Padrão | Status PDI | SoR / SoA |
  | --- | --- | --- | --- | --- |
  | Workday → Employee | Inbound | Import Set + Transform Map | Mock | Workday = SoR Employee |
  | EOAP → Azure AD / Okta | Outbound | Outbound REST + Event retry | Mock | EOAP = SoR entitlement; IAM = SoA |
  | Qualys → Risk context | Inbound | REST / Import Set | Futuro | Qualys = SoR vulnerability |
  | EOAP → SIEM | Outbound | Syslog / Event streaming | Futuro | EOAP audit = SoR decisões |
  | HRIS webhook → Lifecycle | Inbound | Scripted REST API | Futuro | HRIS = SoR; EOAP = orquestrador |

  ### 13.1 Princípios de Integração

  | Princípio | Descrição | Diretriz Técnica |
  | --- | --- | --- |
  | **Loose Coupling** | Integrações devem interagir com a EOAP apenas por endpoints ou tabelas de staging públicas, nunca acessando tabelas operacionais diretamente. | Utilizar Scripted REST APIs ou Import Sets dedicados. |
  | **Correlation ID** | Toda chamada de API (inbound ou outbound) e processamento de arquivo deve portar e propagar um identificador exclusivo. | Passado no HTTP header `X-Correlation-ID`. |
  | **Idempotência** | Operações de escrita de integração devem ser seguras para reexecução em caso de timeout. | Chaves de idempotência geradas com base no payload + transaction ID. |
  | **Connection Isolation** | Credenciais, endpoints e certificados de parceiros de integração não devem estar em código. | Uso obrigatório de **Connection & Credential Aliases** (`sys_connection_alias`). |
  | **Fail-Safe Processing** | Erros em payloads individuais em lote de importação não devem derrubar toda a transação. | Tratamento de erro a nível de linha no Import Set. |

  ### 13.2 Padrão REST (API Inbound & Outbound)

  As integrações síncronas de API na EOAP seguem especificações estritas de design:

  - **Scripted REST API**: Criadas no escopo `/api/x_eoap/v1/`.
  - **Autenticação**: Uso mandatório de **OAuth 2.0 (Client Credentials Flow)** com perfis específicos criados na plataforma (`oauth_entity`). Acesso por Basic Auth é desabilitado em ambientes produtivos.
  - **Formato de Resposta (Envelope REST)**: Todas as APIs inbound retornam um envelope padrão contendo `result`, `error` e `correlation_id`:
    ```json
    {
      "result": {
        "status": "success",
        "data": {
          "access_id": "x_eoap_user_access_sys_id",
          "state": "active"
        }
      },
      "error": null,
      "correlation_id": "EOAP-INT-ACC-20260606-abc123xyz"
    }
    ```
  - **Error Format**: Em caso de falha de validação ou erro de processamento interno (HTTP 400 ou 500):
    ```json
    {
      "result": null,
      "error": {
        "code": "INVALID_PAYLOAD",
        "message": "O campo 'user_sys_id' e obrigatorio e nao foi fornecido.",
        "details": "Validation failed on entity: user_access"
      },
      "correlation_id": "EOAP-INT-ACC-20260606-abc123xyz"
    }
    ```
  - **Outbound HTTP Messages**: Mensagens outbound (ex: provisionamento em IAM) utilizam **Outbound REST Message** configurado com Connection & Credential Aliases. Isso permite que os endpoints de DEV, TEST e PROD variem sem modificação lógica e suporta o uso de **MID Servers** caso o endpoint IAM esteja em rede privada.

  ### 13.3 Import Sets & Transform Maps

  Para cargas assíncronas e volumosas de dados (ex: carga diária de colaboradores do HRIS ou reconciliação de grupos de segurança):

  - **Staging Tables**: Criação de tabelas de importação exclusivas (`x_eoap_import_employee`, `x_eoap_import_access_recon`).
  - **Coalesce Keys**: Definição clara de campos chave para evitar registros duplicados. Exemplo: Para importação de colaboradores, `employee_number` é o coalesce.
  - **Robust Mapping Scripts (`onBefore`)**:
    - Validar campos essenciais (ex: verificar se o usuário de destino existe e está ativo na tabela `sys_user`).
    - Se a validação falhar, o script chama `error = true; error_message = "Motivo da falha";` e rejeita a linha individualmente (`status = 'error'`), permitindo que as outras linhas do lote continuem o processamento.
  - **Auditabilidade (`onAfter`)**: O script captura o resultado da importação (linhas inseridas, atualizadas, ignoradas, falhas) e cria um registro no `x_eoap_audit_trail` com o ID do Import Set (`sys_import_set`).

  ### 13.4 Integration Correlation ID Strategy

  A rastreabilidade fim-a-fim de transações entre sistemas é garantida pelo modelo de cabeçalho e rastreio:

  ```mermaid
  sequenceDiagram
      participant External as Sistema Externo (IAM/HRIS)
      participant API as Scripted REST API (EOAP)
      participant Engine as EOAP Engine (SI / Flows)
      participant Audit as x_eoap_audit_trail

      External->>API: HTTP POST /api/x_eoap/v1/access (Header X-Correlation-ID: EOAP-INT-999)
      Note over API: Captura X-Correlation-ID
      API->>Engine: Invocação de Servicos (passando correlation_id)
      Engine->>Audit: EOAP_AuditLogger.log(..., correlation_id: 'EOAP-INT-999')
      Engine->>API: Retorna resultado
      API->>External: HTTP 201 Created (Response Body contains correlation_id)
  ```

  1. **Inbound**: A Scripted REST API lê o header `X-Correlation-ID`. Se ausente, gera um novo ID no formato `EOAP-GEN-{module}-{sys_id}`.
  2. **Outbound**: O ServiceNow injeta o header `X-Correlation-ID` em todas as requisições HTTP externas.
  3. **Propagação**: O Correlation ID é repassado como argumento em todos os Script Includes, Subflows, Eventos (`sysevent`) e persistido na trilha de auditoria (`x_eoap_audit_trail`).

  ### 13.5 Retry & Error Handling Matrix

  A tolerância a falhas na integração de dados opera conforme a seguinte matriz de decisões:

  | Tipo de Erro | Código HTTP / Causa | Estratégia de Mitigação | Limite de Retries | Ação Pós-Limite / Alerta |
  | --- | --- | --- | --- | --- |
  | **Erro Transitório** | 502 / 503 / 504 / 429 (Rate Limit) | Retry automático assíncrono via **Event Processor** com backoff exponencial. | 3 tentativas (30s, 90s, 300s) | Marcar evento como `failed_final`, gravar erro em log e criar uma tarefa `SCTASK` para o Platform Owner. |
  | **Lock de Tabela** | Lock contention no banco ServiceNow | Subflow intercepta exceção de banco e re-insere o evento na fila com delay de 5 segundos. | 5 tentativas | Registrar no `x_eoap_audit_trail` como falha transacional e notificar o administrador. |
  | **Erro de Autenticação** | 401 Unauthorized / Expiração de Token | Não executar retry automático (evita bloqueio de conta). | 0 tentativas | Parar o fluxo imediatamente, alterar status do canal de integração para `offline` e disparar alerta crítico para o Security Lead. |
  | **Erro Funcional / Validação** | 400 Bad Request / Campo obrigatório ausente | Sem retry automático (o payload não se tornará válido sem correção na origem). | 0 tentativas | Rejeitar payload, gravar log estruturado e enviar email de notificação de inconsistência para a equipe responsável pelos dados de origem. |
  | **Timeout de Conexão** | Conexão externa sem resposta após 30s | Retry automático. | 2 tentativas | Registrar falha, salvar payload no `x_eoap_event_processing` para auditoria e notificar o Platform Owner. |

  ---

  ## 14. Event Architecture

  ### 14.1 Princípios

  - Eventos desacoplam produtores e consumidores sem perder rastreabilidade
  - Todo evento crítico possui publisher, consumer, payload, idempotency_key, retry e registro operacional
  - Eventos não são mecanismo invisível e sem controle
  - Falhas de evento devem ser visíveis e recuperáveis

  ### 14.2 Event Catalog

  | Evento | Publisher | Consumers | Payload Mínimo | Criticidade |
  | --- | --- | --- | --- | --- |
  | eoap.employee.created | Employee Lifecycle Flow | AccessGovernanceService, AuditLogger | user_sys_id, manager, department, correlation_id | Alta |
  | eoap.employee.moved | Employee Lifecycle Flow | AccessGovernanceService, CMDBQualityService, AuditLogger | user_sys_id, old_department, new_department, correlation_id | Alta |
  | eoap.employee.terminated | Employee Lifecycle Flow | AccessGovernanceService, AuditLogger | user_sys_id, termination_date, correlation_id | Crítica |
  | eoap.access.requested | Access Catalog Flow | AccessGovernanceService, AuditLogger | access_sys_id, requester, application, correlation_id | Média |
  | eoap.access.approved | Access Governance Flow | AccessGovernanceService, AuditLogger | access_sys_id, approver, decision, correlation_id | Alta |
  | eoap.access.revoked | AccessGovernanceService | AuditLogger | access_sys_id, reason, actor, correlation_id | Alta |
  | eoap.access.expired | Scheduled Job | AccessGovernanceService, AuditLogger | access_sys_id, expiration_date, correlation_id | Alta |
  | eoap.change.risk.calculated | RiskEngine | AuditLogger, Change Flow | change_sys_id, score, band, correlation_id | Média |
  | eoap.cmdb.quality.failed | CMDBQualityService | AuditLogger, Platform Owner notification | entity_sys_id, quality_issues, correlation_id | Média |
  | eoap.event.failed | EventProcessor | Platform Owner notification, AuditLogger | event_name, error, retry_count, correlation_id | Alta |

  ### 14.3 Publisher Contract

  Publishers devem:
  - Validar dados mínimos antes de publicação
  - Incluir correlation_id e idempotency_key
  - Registrar publicação em log com padrão EOAP
  - Não publicar evento sem persistir estado prerequisito

  ### 14.4 Consumer Contract

  Consumers devem:
  - Ser idempotentes (duplicidade reconhecida, não reprocessada)
  - Registrar status em x_eoap_event_processing
  - Logar resultado com correlation_id
  - Falhar de forma recuperável

  ### 14.5 Event Processing States

  ```mermaid
  stateDiagram-v2
      [*] --> received
      received --> processing
      processing --> processed
      processing --> failed
      failed --> retry_pending
      retry_pending --> processing
      retry_pending --> failed_final
      received --> ignored_duplicate
      failed_final --> [*]
      processed --> [*]
      ignored_duplicate --> [*]
  ```

  ### 14.6 Event Contract — Envelope Padrão

  Todo evento EOAP segue um envelope canônico. O `payload` varia por `event_name`; o envelope é estável entre versões até `schema_version` major.

  ```json
  {
    "schema_version": "1.0",
    "event_name": "eoap.access.granted",
    "event_id": "evt_8f3a2b1c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    "correlation_id": "EOAP-ACC-20260606-abc123",
    "idempotency_key": "sha256:access_sys_id+event_name+timestamp_bucket",
    "source": "x_eoap.AccessGovernanceService",
    "timestamp": "2026-06-06T14:32:01.000Z",
    "payload": {}
  }
  ```

  | Campo | Obrigatório | Descrição |
  | --- | --- | --- |
  | schema_version | Sim | Versão do contrato; breaking changes incrementam major. |
  | event_name | Sim | Nome canônico do catálogo (seção 14.2). |
  | event_id | Sim | UUID único por publicação. |
  | correlation_id | Sim | Rastreio end-to-end (NFR 5.6). |
  | idempotency_key | Sim | Chave determinística para deduplicação. |
  | source | Sim | Publisher (Flow, Script Include ou integração). |
  | timestamp | Sim | ISO 8601 UTC da publicação. |
  | payload | Sim | Dados específicos do evento (mínimo definido no catálogo). |

  #### 14.6.1 Exemplos de Payload por Evento

  **eoap.access.approved**
  ```json
  {
    "schema_version": "1.0",
    "event_name": "eoap.access.approved",
    "correlation_id": "EOAP-ACC-20260606-abc123",
    "idempotency_key": "sha256:x_eoap_user_access_sys_id+eoap.access.approved",
    "source": "Flow_EOAP_Access_Governance",
    "timestamp": "2026-06-06T14:32:01.000Z",
    "payload": {
      "access_sys_id": "a1b2c3d4e5f6789012345678abcdef01",
      "user_sys_id": "u1b2c3d4e5f6789012345678abcdef01",
      "application_sys_id": "app1234567890abcdef1234567890ab",
      "approver_sys_id": "apr1234567890abcdef1234567890ab",
      "decision": "approved",
      "rule_version": "DT_EOAP_Access_Approval_Routing_v1.0"
    }
  }
  ```

  **eoap.employee.terminated**
  ```json
  {
    "schema_version": "1.0",
    "event_name": "eoap.employee.terminated",
    "correlation_id": "EOAP-LC-20260606-xyz789",
    "idempotency_key": "sha256:sys_user_sys_id+eoap.employee.terminated+termination_date",
    "source": "Flow_EOAP_Employee_Offboarding",
    "timestamp": "2026-06-06T09:00:00.000Z",
    "payload": {
      "user_sys_id": "u1b2c3d4e5f6789012345678abcdef01",
      "termination_date": "2026-06-06",
      "manager_sys_id": "mgr1234567890abcdef1234567890ab"
    }
  }
  ```

  ### 14.7 Retry Strategy

  | Parâmetro | Valor | Justificativa |
  | --- | --- | --- |
  | Máximo de tentativas (erro transitório) | **3** | Evita loop infinito; alinhado à matriz de integração (seção 13.5). |
  | Máximo de tentativas (lock contention) | **5** | Contenção de banco é transitória por natureza. |
  | Backoff | Exponencial: 30s → 90s → 300s | Reduz pressão em sistemas degradados. |
  | Erros sem retry | 400, 401, 403, validação funcional | Payload inválido não se autocorrige. |
  | Job de retry | `EOAP_Job_Event_Retry` a cada 15 min | Reprocessa fila `retry_pending`. |

  Após esgotar tentativas, o evento transita para **`failed_final`** — equivalente funcional a **Dead Letter Queue (DLQ)** no contexto ServiceNow (não há fila SQS; a DLQ é a tabela `x_eoap_event_processing` com status terminal).

  ### 14.8 Dead Letter Queue (DLQ) — Modelo Operacional

  | Aspecto | Decisão |
  | --- | --- |
  | Implementação | Registros em `x_eoap_event_processing` com `status = failed_final`. |
  | Retenção DLQ | Preservados até resolução manual ou reprocessamento explícito (não auto-purge). |
  | Alerta | Evento `eoap.event.failed` notifica Platform Owner; severidade P2 se evento crítico. |
  | Reprocessamento | UI Action **Reprocess Event** após correção da causa raiz (runbook EOAP-RUN-001). |
  | Evolução corporativa | Export periódico de `failed_final` para SIEM ou fila externa (Service Bus) sem redesenho de contrato. |

  ### 14.9 Idempotência

  | Mecanismo | Descrição |
  | --- | --- |
  | **Geração da chave** | `idempotency_key = hash(entidade_primária + event_name + bucket_temporal_opcional)`. Ex: `user_sys_id + eoap.employee.terminated + termination_date`. |
  | **Verificação** | EventProcessor consulta `x_eoap_event_processing` por `idempotency_key` antes de processar. |
  | **Duplicata detectada** | Status `ignored_duplicate`; não reexecuta side effects (provisionamento, revogação, audit duplicado). |
  | **Janela de deduplicação** | 24 horas para eventos de lifecycle; 7 dias para eventos de acesso (configurável via system property). |
  | **Integrações REST** | Header `Idempotency-Key` aceito em APIs inbound; mesma semântica da fila interna. |

  ---

  ## 15. Observability Architecture

  ### 15.1 Logging

  | Aspecto | Decisão |
  | --- | --- |
  | Formato | `[EOAP][Module][Entity][Correlation_ID][Outcome] message` |
  | Níveis | `error` para falhas, `warn` para degradações, `info` para operações, `debug` em desenvolvimento. |
  | Dados sensíveis | Nunca despejar payloads integralmente em syslog; apenas IDs, resumo e correlation_id. |
  | Correlação | Todo log deve incluir correlation_id quando disponível. |

  ### 15.2 Monitoring

  | Camada | Mecanismo PDI | Evolução Corporativa |
  | --- | --- | --- |
  | Operacional | Listas, filtros, dashboards sobre tabelas EOAP. | Performance Analytics, dashboards executivos. |
  | Eventos | x_eoap_event_processing com filtros por status. | Alertas SIEM, integração com PagerDuty/ServiceNow ITOM. |
  | Segurança | Revisão periódica de papéis e ACL test suite. | SIEM integration, anomaly detection. |
  | Performance | Transaction Logs e Flow execution details. | APM, synthetic monitoring. |

  ### 15.3 Operational Metrics

  | Métrica | Descrição | Uso |
  | --- | --- | --- |
  | access_approval_cycle_time | Tempo entre solicitação e decisão de acesso. | Identificar gargalos de Access Owner. |
  | access_expired_open_count | Acessos expirados ainda ativos. | Risco de acesso órfão. |
  | event_failed_count | Eventos críticos com falha. | Priorizar suporte e retry. |
  | risk_engine_duration_ms | Tempo de execução do cálculo de risco. | Performance e regressão. |
  | cmdb_completeness_rate | Apps críticas com dados mínimos. | Governança CMDB. |
  | acl_negative_test_pass_rate | Testes negativos de ACL aprovados. | Evidência de segurança. |
| reconciliation_drift_count | Divergências entre acesso governado e técnico. | Integridade de dados. |

### 15.4 Alert Thresholds & SLOs

Cada métrica operacional possui threshold, severidade, ação automatizada e owner. Em PDI, alertas via notificação/email e dashboards; em PROD, evolução para Event Management / SIEM.

| Métrica | Threshold (Warning) | Threshold (Critical) | Severidade | Ação Automatizada | Owner |
| --- | --- | --- | --- | --- | --- |
| access_approval_cycle_time | > 48h (apps críticas) | > 72h (apps críticas) | P3 → P2 | Notificar Access Owner + escalonar ao manager | Access Owner |
| access_expired_open_count | ≥ 1 registro | ≥ 5 registros | P2 → P1 | Tarefa de revogação + evento eoap.access.expired | Access Owner |
| event_failed_count (`failed_final`) | ≥ 1 em 24h | ≥ 3 em 24h ou ≥ 1 em evento Crítico | P2 → P1 | Notificação Platform Owner; runbook EOAP-RUN-001 | Platform Owner |
| risk_engine_duration_ms | > 3.000ms (p95) | > 5.000ms (p95) | P3 → P2 | Log warn + revisão índices CMDB | Change Manager |
| cmdb_completeness_rate | < 95% apps críticas | < 90% apps críticas | P3 → P2 | Notificar CMDB Manager; runbook EOAP-RUN-003 | CMDB Manager |
| acl_negative_test_pass_rate | < 100% em release | Qualquer falha em produção | P2 → P1 | Bloquear promoção de Update Set | Platform Owner |
| reconciliation_drift_count | ≥ 1 drift | ≥ 5 drifts ou qualquer drift Restricted | P2 → P1 | Tarefa investigação Access Owner; runbook EOAP-RUN-002 | Access Owner |
| event_processing_lag | > 60s (p99) | > 120s (p99) | P3 → P2 | Escalonar Event Processor; revisar fila | Platform Owner |
| audit_trail_insert_rate_anomaly | +50% vs. média 7 dias | +100% vs. média 7 dias | P3 → P2 | Alerta segurança; possível flood ou loop | Security Lead |

#### 15.4.1 SLOs de Observabilidade

| SLO | Target | Janela de Medição | Validação |
| --- | --- | --- | --- |
| Disponibilidade lógica de fluxos críticos | 99,5% execuções sem falha não recuperável | Mensal | event_failed_count / total eventos críticos |
| Correlation coverage | 100% eventos críticos com correlation_id | Por release | Amostra ATF + auditoria seção 14.2 |
| MTTR eventos `failed_final` | < 8h (P2) | Por incidente | Timestamp failed_final → resolução runbook |
| CMDB completeness (apps críticas) | ≥ 95% | Semanal | Dashboard cmdb_completeness_rate |

### 15.5 Audit Trail Architecture

  A tabela `x_eoap_audit_trail` atua como o repositório lógico e central de evidências aplicacionais da EOAP. Ela é concebida como uma estrutura de dados **append-only** para garantir a integridade da trilha de conformidade corporativa. 

  Para assegurar a auditabilidade de ponta a ponta sem poluir os logs técnicos do sistema, a arquitetura do Audit Trail exige o registro estruturado de:
  - **Atribuição de Ações (Quem)**: Identificação unívoca do ator (sistema ou usuário aprovador humano) que disparou a alteração.
  - **Rastreabilidade Lógica (O que)**: Tipo de entidade de negócio impactada (acesso, exceção, change, aplicação) com referências a registros de origem.
  - **Contexto Semântico (Por quê)**: Resumo estruturado do estado de dados antes/depois da transição, a versão da regra avaliada e o Correlation ID distribuído.

  > [!NOTE]
  > O design físico detalhado da tabela, incluindo definições de colunas, tipos de dados e indexações recomendadas para performance, está disponível no [Solution Design Document (SDD) — Seção 1.3](file:///c:/Users/artur/Documents/GitHub/EOAP/EOAP_SDD_v2.md#L170).

  ---

  ## 16. Governance Model

  ### 16.1 Architecture Governance

  | Aspecto | Mecanismo |
  | --- | --- |
  | Decisões estruturais | ADR obrigatório com alternativas e consequências. |
  | Revisão de extensão | Avaliação contra princípios antes de aprovação. |
  | Critérios de aceite | NFRs mensuráveis e testes ATF por artefato. |
  | Cadência | Revisão ao final de cada sprint. |
  | Escalonamento | Divergências técnicas escalam ao Architecture Review Board. |

  ### 16.2 Change Governance

  | Aspecto | Mecanismo |
  | --- | --- |
  | Controle de mudanças EOAP | Update Set com descrição técnica e teste ATF. |
  | Decision Tables | Evidência de teste e aprovação do owner de governança. |
  | Script Includes | Code review obrigatório antes de merge. |
  | ACLs | Teste negativo ATF associado. |
  | Rollback | Back-out Update Set documentado para promoções críticas. |

  ### 16.3 ADR Governance

  | Status | Significado |
  | --- | --- |
  | Proposed | Decisão em avaliação. |
  | Accepted | Decisão aprovada e em vigor. |
  | Deprecated | Decisão superada por contexto novo. |
  | Superseded | Decisão substituída por ADR posterior (referência cruzada). |

  ADRs aceitos não são imutáveis, mas alteração exige novo ADR ou revisão formal com justificativa, impacto e plano de transição.

  ### 16.4 CMDB Governance

  | Aspecto | Mecanismo |
  | --- | --- |
  | Ownership | Todo CI EOAP deve ter owner e steward definidos. |
  | Qualidade | Controles de completude por sprint com dashboard. |
  | Relacionamento mínimo | Business Application deve ter pelo menos um Application Service. |
  | Revisão periódica | Trimestral em ambiente produtivo; por sprint em PDI. |
  | Ação de falha | Dados incompletos reduzem confiança, bloqueiam decisão ou abrem tarefa de correção. |

  ### 16.5 Personas & RACI

  | Atividade | Platform Owner | CMDB Manager | App Owner | Access Owner | Change Manager | Risk Analyst | Auditor |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | Definir princípios | A/R | C | I | I | I | I | I |
  | Aprovar ADR | A | C | C | C | C | C | I |
  | Manter CMDB | I | R/A | C | I | I | I | I |
  | Aprovar acesso | I | I | C | R/A | I | I | I |
  | Calcular risco | I | I | I | I | C | R/A | I |
  | Aprovar mudança | I | I | C | I | R/A | C | I |
  | Auditar evidência | I | I | I | I | I | I | R/A |
  | Revisar segurança | R/A | I | I | I | I | I | C |

  ---

  ## 17. Operational Runbook Requirements

  Esta seção estabelece os requisitos operacionais mínimos e os manuais de procedimentos (runbooks) para a equipe de sustentação da plataforma, garantindo a rápida resolução de anomalias nos pilares da EOAP.

  ### 17.1 Matriz de Severidade e Escalonamento

  Os incidentes gerados por falhas na EOAP são categorizados e escalados de acordo com a criticidade operacional dos dados:

  | Nível | Descrição do Cenário | SLA de Resposta | Ação de Escalonamento |
  | --- | --- | --- | --- |
  | **P1 — Critical** | Divergência de segurança identificada pelo Job de Reconciliação (acesso técnico ativo sem concessão governada na EOAP) ou falha total no Flow de Offboarding. | 2 horas | Disparar ticket de Incidente P1, on-call paging para o Platform Owner e time de IAM/Segurança da Informação. |
  | **P2 — High** | Falhas repetitivas de eventos críticos (`failed_final`) ou erro na execução do motor de risco de mudanças (`EOAP_RiskEngine`) que impacte o CAB. | 8 horas | Disparar ticket de Incidente P2 direcionado ao time de sustentação da EOAP e notificar o CMDB Manager. |
  | **P3 — Medium** | Gaps de qualidade na CMDB abaixo do threshold aceitável (90%) ou atrasos em aprovações de acesso de aplicações críticas. | 24 horas | Gerar tarefa técnica (`SCTASK`) para correção de dados e notificar os respectivos Access Owners. |

  ### 17.2 Runbooks de Operação

  #### 17.2.1 EOAP-RUN-001: Resolução de Eventos em Falha Crítica (`failed_final`)
  - **Indicação**: Alerta de falha gerado pela notificação `Event Processing Failed` ou monitoramento da tabela `x_eoap_event_processing`.
  - **Procedimento**:
    1. Localizar o registro com falha na tabela `x_eoap_event_processing` utilizando o `correlation_id` do log/alerta.
    2. Inspecionar as colunas `error_message` e `error_detail` para identificar a causa (ex: erro de payload, timeout HTTP com IAM externo, credencial expirada).
    3. Se for uma falha técnica (ex: MID Server indisponível ou API externa fora do ar), aguardar o reestabelecimento da infraestrutura e disparar a UI Action **"Reprocess Event"** para reenviar o evento.
    4. Se for erro funcional de dados (ex: e-mail de usuário inválido, Business App sem Access Owner), abrir tarefa de correção de dados direcionada à equipe HRIS/CMDB. Após correção, marcar o status como `ignored_duplicate` e justificar no log.

  #### 17.2.2 EOAP-RUN-002: Mitigação de Divergência de Acesso (Reconciliation Drift)
  - **Indicação**: Job de reconciliação (`EOAP_Job_Reconciliation`) identifica usuários com privilégios técnicos diretos sem registro correspondente ativo em `x_eoap_user_access`.
  - **Procedimento**:
    1. O relatório diário gera tarefas de investigação automáticas para cada Access Owner com a lista de drifts.
    2. **Acesso Órfão / Não Autorizado (Drift Negativo)**: Se o usuário possui acesso ativo no AD/Okta mas não possui registro ativo na EOAP, o Access Owner deve forçar a revogação técnica imediata via automação ou acionar a equipe de IAM. O evento e a ação devem ser gravados em `x_eoap_audit_trail` com o motivo `unauthorized_drift_mitigation`.
    3. **Acesso Não Provisionado (Drift Positivo)**: Se o usuário possui registro ativo na EOAP mas não tem o acesso ativo no sistema final, disparar manualmente o subflow de provisionamento para resgatar a consistência.

  #### 17.2.3 EOAP-RUN-003: Gaps de Qualidade na CMDB (Below 90% Completeness)
  - **Indicação**: Dashboard exibe indicador vermelho para o completude de Business Applications críticas.
  - **Procedimento**:
    1. Acessar a tabela `cmdb_ci_business_app` filtrando pelos campos customizados `x_eoap_access_owner` ou `x_eoap_data_classification` vazios.
    2. Enviar notificação automatizada ao Application Owner (campo `owned_by`).
    3. Se em 48 horas as informações de governança não forem cadastradas, a plataforma reduz automaticamente a "confiabilidade do cálculo de risco" nas mudanças daquela aplicação, gerando alertas no formulário da Change Request.

  ---

  ## 18. Disaster Recovery & Failure Scenarios

  A EOAP opera como uma camada crítica sobre o ServiceNow ITSM. A falha de infraestruturas locais ou barramentos de dados externos não deve paralisar as operações principais de negócio (alta resiliência lógica).

  ### 18.1 Queda de Conexão com IAM (MID Server Offline)
  - **Cenário**: O MID Server utilizado para integrar o ServiceNow aos diretórios de identidade locais (AD/Okta) perde a conexão.
  - **Comportamento da Plataforma**:
    - As solicitações de acesso são criadas, roteadas e aprovadas normalmente no ServiceNow (a lógica de governança reside inteiramente no escopo local).
    - O fluxo de provisionamento técnico falha ao tentar invocar a chamada externa.
    - O `EventProcessor` intercepta o erro, altera o status do evento para `retry_pending` e interrompe as chamadas subsequentes do lote.
    - O job `EOAP_Job_Event_Retry` tentará reprocessar a fila a cada 15 minutos. Quando a conectividade com o MID Server for restabelecida, o provisionamento é concluído automaticamente, garantindo zero perda de solicitações.

  ### 18.2 Falha/Indisponibilidade da CMDB
  - **Cenário**: Tabelas de CIs relacionais (`cmdb_rel_ci`) ou Business Applications tornam-se inacessíveis ou corrompidas.
  - **Comportamento da Plataforma**:
    - A execução de cálculo de risco (`EOAP_RiskEngine`) é envolvida em blocos `try/catch` de alto nível.
    - Se a consulta à CMDB falhar por tempo limite ou indisponibilidade, o motor captura a exceção, grava no campo `x_eoap_risk_explanation` a mensagem: *"Falha na consulta relacional da CMDB. Risco definido como Baixo (Default Seguro) com confiabilidade reduzida."*
    - O score de risco da change é definido provisoriamente como 25 (Low) para não interromper a submissão de Changes da empresa, e um Incidente P2 de infraestrutura da CMDB é criado automaticamente.

  ### 18.3 Saturação do Banco de Dados por Concorrência (Lock Contention)
  - **Cenário**: Importações massivas de dados de usuários do RH (HRIS Import contendo mais de 10.000 linhas) causam contenção e timeouts de lock no banco de dados nas tabelas `sys_user` ou `x_eoap_user_access`.
  - **Comportamento da Plataforma**:
    - Os transform maps e chamadas de escrita transacional são operados em chunks limitados a 200 registros por lote.
    - O `AuditLogger` utiliza inserções assíncronas assinaladas para não concorrer no mesmo thread de bloqueio do registro principal do usuário.
    - Em caso de timeout (`sql_exception`), a engine de eventos do ServiceNow retém o evento no status `retry_pending` e efetua backoff de tempo para evitar agravar a sobrecarga do banco.

  ---

  ## 19. ADR Catalog

  ### ADR-001 — CMDB como espinha dorsal arquitetural

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | EOAP depende de contexto confiável de aplicações, serviços e dependências. Sem CMDB, os pilares se tornam silos com regras duplicadas. |
  | Alternativas avaliadas | (1) Catálogo próprio fora da CMDB. (2) Texto livre em Catalog Items. (3) Tabelas customizadas EOAP isoladas. |
  | Decisão | Centralizar modelo em CMDB/CSDM e referenciar Business Applications e Application Services em todos os processos. |
  | Consequências | Consistência e governança; exige disciplina de qualidade e ownership da CMDB. |
  | Riscos | Baixa maturidade de CMDB pode comprometer score e approvals; mitigado por controles de qualidade e sprint de fundação. |
  | Rastreabilidade | Sprint 1, ATF CMDB Foundation Suite. |

  ### ADR-002 — Decision Tables antes de scripts para regras de decisão

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Regras de aprovação, classificação e thresholds devem ser alteráveis sem deploy de código. |
  | Alternativas avaliadas | (1) Business Rules para todas as regras. (2) Hardcode em Flow Designer. (3) System Properties sem modelo de decisão. |
  | Decisão | Decision Tables para regras declarativas; Script Includes somente para cálculo, agregação ou operações não expressáveis declarativamente. |
  | Consequências | Reduz débito técnico e aumenta auditabilidade; exige governança sobre quem altera Decision Tables. |
  | Riscos | Alteração indevida impacta risco; mitigado por roles restritos, versionamento e ATF. |
  | Rastreabilidade | Sprint 4, DT_EOAP_Risk_Weights, DT_EOAP_Risk_Banding, ATF Risk Suite. |

  ### ADR-003 — Scoped Application dedicada EOAP

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | A solução possui domínio próprio, papéis, tabelas justificadas e lógica reutilizável. |
  | Alternativas avaliadas | (1) Global scope. (2) Configurações soltas em múltiplos escopos. (3) App por pilar. |
  | Decisão | Implementar como Scoped Application para isolamento, governança e portabilidade. |
  | Consequências | Encapsulamento e governança; requer atenção a cross-scope access. |
  | Riscos | Runtime access blocks; mitigado por revisão de cross-scope privileges em Sprint 0. |
  | Rastreabilidade | Sprint 0, configuração de scope. |

  ### ADR-004 — Flow Designer como mecanismo primário de orquestração

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Processos de lifecycle e aprovação exigem clareza visual, manutenibilidade e participação de process owners. |
  | Alternativas avaliadas | (1) Legacy Workflow. (2) Business Rules para orquestração. (3) Script Include controlando fluxo humano. |
  | Decisão | Flow Designer para orquestração, aprovações, notificações e tarefas, com design de propósito único. |
  | Consequências | Clareza e aderência moderna; lógica complexa deve ficar fora do Flow em Script Includes. |
  | Riscos | Flows muito grandes tornam-se frágeis; mitigado por subflows e propósito único. |
  | Rastreabilidade | Sprint 2-4, Flows de lifecycle, access e risk. |

  ### ADR-005 — Catálogo como entrada controlada para solicitações humanas

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Usuários devem solicitar acessos e lifecycle actions por experiência padronizada. |
  | Alternativas avaliadas | (1) Formulários diretos em tabelas customizadas. (2) E-mail/manual. (3) Scripts administrativos. |
  | Decisão | Catalog Items e Record Producers para interação humana estruturada. |
  | Consequências | Experiência, rastreabilidade e governança; exige manutenção de variáveis e políticas. |
  | Riscos | Catálogo mal desenhado gera dados ruins; mitigado por validações e instruções. |
  | Rastreabilidade | Sprint 2-3, Catalog Items de lifecycle e acesso. |

  ### ADR-006 — Audit Trail aplicacional customizado e write-only

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | A solução precisa registrar decisões de negócio com contexto funcional que sys_audit não captura. |
  | Alternativas avaliadas | (1) Apenas sys_audit. (2) Apenas syslog. (3) Work notes. |
  | Decisão | Criar x_eoap_audit_trail com escrita por EOAP_AuditLogger e leitura restrita. |
  | Consequências | Auditoria explicável e consultável; adiciona volume e exige retenção. |
  | Riscos | Crescimento excessivo degrada consultas; mitigado por índices, retenção e archiving (ADR-016). |
  | Rastreabilidade | Sprint 0, EOAP_AuditLogger, ATF Audit Suite. |

  ### ADR-007 — Modelo de papéis EOAP segregado por persona

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Acesso administrativo amplo viola Least Privilege e dificulta auditoria. |
  | Alternativas avaliadas | (1) Apenas admin. (2) Reutilizar itil. (3) Controle somente por UI Policy. |
  | Decisão | Papéis específicos: eoap_admin, eoap_cmdb_manager, eoap_access_owner, eoap_change_manager, eoap_risk_analyst, eoap_auditor, eoap_manager. |
  | Consequências | Reduz risco de acesso indevido; permite testes negativos. |
  | Riscos | Papéis excessivos dificultam administração; mitigado por RACI e documentação. |
  | Rastreabilidade | Sprint 0, ACL definitions, ATF Security Suite. |

  ### ADR-008 — Classificação de dados e criticidade de acesso em Business Application

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Access Governance e Change Risk precisam considerar sensibilidade e criticidade de acesso, distintos de business_criticality. |
  | Alternativas avaliadas | (1) business_criticality para tudo. (2) Tabela paralela. (3) Tags informais. |
  | Decisão | Campos EOAP de data_classification e access_criticality em cmdb_ci_business_app. |
  | Consequências | Melhora cálculo e aprovações; exige governança de preenchimento. |
  | Riscos | Classificação inconsistente gera score incorreto; mitigado por Data Quality Controls. |
  | Rastreabilidade | Sprint 1, CMDB Foundation, Data Quality Controls. |

  ### ADR-009 — Access Owner distinto de owned_by

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Owner técnico ≠ responsável por aprovar, recertificar e aceitar exceções de acesso. |
  | Alternativas avaliadas | (1) Reutilizar owned_by. (2) assignment_group. (3) Grupo textual. |
  | Decisão | Campo x_eoap_access_owner como referência explícita ao responsável de governança. |
  | Consequências | Separação clara de responsabilidades; exige manutenção por aplicação. |
  | Riscos | Campo desatualizado causa roteamento incorreto; mitigado por dashboard e revisão. |
  | Rastreabilidade | Sprint 1, CMDB Foundation, Access Governance. |

  ### ADR-010 — Risk Engine em camadas para Change Risk Guardian

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Risco de mudança depende de múltiplos fatores: CI, histórico, janela, tipo, serviços. |
  | Alternativas avaliadas | (1) Campo manual. (2) Business Rule monolítica. (3) Flow com queries embutidas. |
  | Decisão | EOAP_RiskEngine com camada declarativa (Decision Tables) e procedural (agregação e persistência). |
  | Consequências | Explicável, testável e evolutivo; requer testes de volume e versionamento. |
  | Riscos | Performance com histórico grande; mitigado por índices e baseline. |
  | Rastreabilidade | Sprint 4, EOAP_RiskEngine, Decision Tables, ATF Risk Suite. |

  ### ADR-011 — User Access Registry customizado para governança de entitlement

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | OOB registra papéis e grupos, mas não oferece entidade de entitlement com lifecycle governado. |
  | Alternativas avaliadas | (1) Apenas sys_user_has_role. (2) Apenas grupos. (3) RITM como registro permanente. |
  | Decisão | x_eoap_user_access referenciando sys_user, Business Application e access owner. |
  | Consequências | Lifecycle e auditoria; obrigação de reconciliação com dados técnicos. |
  | Riscos | Divergência com grupos reais; mitigado por job de reconciliação. |
  | Rastreabilidade | Sprint 3, Access Governance, Reconciliation Job. |

  ### ADR-012 — Arquitetura orientada a eventos com idempotência e retry

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | A plataforma EOAP engloba múltiplos domínios (Employee Lifecycle, Access Governance, Change Risk, Audit Trail). O acoplamento síncrono destas operações introduz alta fragilidade no sistema: falhas temporárias em integrações externas (ex: timeout ao provisionar no AD/Okta) ou lentidão no motor de risco impactariam diretamente a transação do usuário (ex: travamento na UI ao salvar uma change ou processar um onboarding). Além disso, novos requisitos operacionais exigiriam alterações intrusivas nos fluxos existentes. |
  | Alternativas avaliadas | **(1) Chamadas Síncronas (Direct Subflow execution)**: Execução direta de todas as etapas no mesmo thread. Gera alto acoplamento, risco de timeout de transação HTTP e indisponibilidade se sistemas externos estiverem lentos. <br>**(2) Chamadas Procedurais entre Script Includes**: Acoplamento rígido de código. Se a assinatura de um serviço de acesso mudar, os scripts de lifecycle de colaboradores quebram em cascata.<br>**(3) Event-Driven Architecture (EDA)**: Uso de eventos assíncronos (`sysevent`) complementado pela tabela de governança operacional `x_eoap_event_processing`. |
  | Decisão | Adotar **Event-Driven Architecture (EDA)** para a comunicação entre os módulos da EOAP. Toda ação de lifecycle ou governança publica um evento na fila e encerra sua transação imediata. Consumers assíncronos realizam o processamento off-thread, gerindo o estado operacional na tabela de controle. |
  | Consequências | **Desacoplamento e Extensibilidade**: Novos consumidores (como envio de alertas SIEM ou integrações com novos sistemas de segurança) podem subscrever-se aos eventos sem necessidade de alterar o código do publicador.<br>**Resiliência**: Falhas de integração não interrompem o fluxo de negócio principal; a transição fica registrada como pendente e segura para retries.<br>**Exigências Técnicas**: Torna mandatório o uso de chaves de idempotência, Correlation ID em todas as mensagens e lógica de retry com backoff exponencial. |
  | Riscos | Inconsistência eventual temporária (eventual consistency) entre os sistemas enquanto a fila de eventos é processada. Mitigado por monitoramento operacional e NFR de processamento de fila em menos de 30 segundos. |
  | Rastreabilidade | Sprint 0 (Fundações de Eventos), Sprint 2 (Lifecycle Flows), Sprint 3 (Access Governance), Sprint 4 (Risk Engine). |

  ### ADR-013 — Logging padronizado com correlation_id

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Sem padrão, investigação é lenta e dependente de conhecimento tácito. |
  | Alternativas avaliadas | (1) Logs livres. (2) gs.info genérico. (3) Work notes. |
  | Decisão | Padrão `[EOAP][Module][Entity][Correlation_ID][Outcome]` e contexto crítico em audit trail. |
  | Consequências | Suporte e troubleshooting melhorados; exige disciplina. |
  | Riscos | Excesso de logs polui syslog; mitigado por níveis e properties. |
  | Rastreabilidade | Sprint 0, todos os Script Includes. |

  ### ADR-014 — Controle formal de exceções de acesso

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Exceções temporárias precisam expiração, justificativa, aprovação e compensating controls. |
  | Alternativas avaliadas | (1) Aprovação por e-mail. (2) Comentário em registro. (3) Grupo temporário. |
  | Decisão | x_eoap_access_exception integrado a aprovações e audit trail. |
  | Consequências | Reduz risco de exceções esquecidas; melhora evidência. |
  | Riscos | Exceções virando permanentes; mitigado por expiração automática e alertas. |
  | Rastreabilidade | Sprint 3, Access Governance. |

  ### ADR-015 — CMDB Health e Data Quality Controls como pré-requisito

  | Campo | Descrição |
  | --- | --- |
  | Status | **Accepted** |
  | Contexto | Valor do EOAP depende de confiabilidade de Application Services e Business Applications. |
  | Alternativas avaliadas | (1) Aceitar dados incompletos. (2) Qualidade manual. (3) Ignorar relações. |
  | Decisão | Controles de qualidade, dashboards e gates mínimos antes de calcular risco ou aprovar acessos críticos. |
  | Consequências | Confiabilidade; exige esforço contínuo. |
  | Riscos | Adoção lenta; mitigado por sprint de fundação e critérios mínimos. |
  | Rastreabilidade | Sprint 1, EOAP_CMDBQualityService, dashboards. |

  ### ADR-016 — Retenção e arquivamento para tabelas de alto volume

  | Campo | Descrição |
  | --- | --- |
  | Status | **Proposed** |
  | Contexto | Audit trail, eventos e evidências crescem conforme uso. |
  | Alternativas avaliadas | (1) Retenção indefinida. (2) Exclusão manual. (3) Tudo em syslog. |
  | Decisão | Política por tipo de registro, índices e archiving antes de volume produtivo. |
  | Consequências | Performance e conformidade; adiciona responsabilidade. |
  | Riscos | Perda de evidência se agressiva; mitigado por política aprovada. |
  | Rastreabilidade | Sprint 6, Hardening. |

  ### ADR-017 — Cross-Scope Access Policy (NOVO)

  | Campo | Descrição |
  | --- | --- |
  | Status | **Proposed** |
  | Contexto | EOAP como Scoped Application precisa acessar tabelas globais (CMDB, change_request, sys_user) e pode ser acessada por processos globais. |
  | Alternativas avaliadas | (1) Acesso irrestrito. (2) API intermediária global. (3) Cross-scope access rules controladas. |
  | Decisão | Definir cross-scope access rules explícitas por tabela e Script Include. Documentar cada acesso cross-scope necessário e validar em Sprint 0. |
  | Consequências | Controle e rastreabilidade; pode gerar bloqueios de runtime que devem ser testados. |
  | Riscos | Runtime access block em produção; mitigado por testes ATF de cross-scope. |
  | Rastreabilidade | Sprint 0, configuração de scope. |

  ### ADR-018 — Indexing Strategy para tabelas customizadas (NOVO)

  | Campo | Descrição |
  | --- | --- |
  | Status | **Proposed** |
  | Contexto | Tabelas de alto volume (audit trail, event processing, risk evidence) precisam de índices definidos antes de volume operacional. |
  | Alternativas avaliadas | (1) Índices padrão da plataforma. (2) Índices ad-hoc quando performance degradar. (3) Índices planejados na Sprint 0. |
  | Decisão | Definir índices por tabela na Sprint 0, baseados em padrões de consulta previstos. |
  | Consequências | Performance previsível; overhead de escrita. |
  | Riscos | Índices incorretos ou excessivos; mitigado por revisão de query patterns por sprint. |
  | Rastreabilidade | Sprint 0, todas as tabelas customizadas. |

  ---

  ## 20. Risks and Mitigations

  | ID | Risco | Probabilidade | Impacto | Consequência | Mitigação | Owner |
  | --- | --- | --- | --- | --- | --- | --- |
  | R-001 | CMDB incompleta ou inconsistente | Alta | Alta | Score e approvals incorretos. | Sprint 0 CMDB, dashboard, owner obrigatório, relacionamento mínimo. | CMDB Manager |
  | R-002 | Crescimento excessivo de audit trail | Média | Alta | Degradação em consultas e relatórios. | Índices, retenção, archiving, filtros obrigatórios. | Platform Owner |
  | R-003 | Race condition em eventos assíncronos | Média | Alta | Processos parcialmente concluídos. | Idempotency key, event processing, retry, reconciliação. | Platform Owner |
  | R-004 | Papéis mal atribuídos | Média | Alta | Violação de Least Privilege. | Revisão periódica, grupos, testes negativos ATF, approval para role sensível. | Security Lead |
  | R-005 | Decision Tables alteradas sem governança | Média | Média | Score ou roteamento inesperado. | Role restrito, ADR, versionamento, ATF regressão. | Risk Analyst |
  | R-006 | Risk Engine lento com histórico grande | Média | Média | Atraso na avaliação de Change. | Índices, caching, limites de consulta, baseline. | Change Manager |
  | R-007 | Over-customization em PDI | Baixa | Alta | Dificuldade de evolução. | OOB First, ADR obrigatório, revisão por sprint. | Platform Owner |
  | R-008 | Ausência de testes automatizados | Média | Alta | Regressões silenciosas. | ATF First, DoD com teste, evidência de release. | QA Lead |
  | R-009 | Cross-scope access block em runtime | Média | Alta | Falha de fluxos que acessam tabelas globais. | Teste de cross-scope em Sprint 0, documentação de acessos necessários. | Platform Owner |
  | R-010 | Divergência entre acesso governado e técnico | Alta | Alta | Registros de acesso não refletem realidade. | Job de reconciliação diário, alertas de divergência. | Access Owner |
  | R-011 | Falta de versionamento de Decision Tables | Média | Média | Impossibilidade de rastrear qual regra gerou qual score. | Campo rule_version em risk_evidence, backup de DT por sprint. | Risk Analyst |
  | R-012 | Lock contention em tabelas compartilhadas | Baixa | Média | Timeout em operações concorrentes. | Transações curtas, GlideRecord em scope, testes de carga sintéticos. | Platform Owner |

  ---

  ## 21. Architecture Review Board Assessment

### 21.1 Assessment Summary (v2.2)

| Dimensão | Nota v2.1 | Nota v2.2 | Evolução |
| --- | --- | --- | --- |
| Arquitetura | 9/10 | **9/10** | C4 L3 explicitado (seção 7.2). |
| Enterprise Integration | 9/10 | **9/10** | Mantido. |
| Governança | 9/10 | **9/10** | Mantido. |
| Segurança | 8.5/10 | **9/10** | Threat model STRIDE (seção 12.8). |
| Event Architecture | 9/10 | **9/10** | Mantido. |
| ADD/SDD Separation | 9/10 | **9/10** | Mantido. |
| CSDM | 9/10 | **9/10** | Mantido. |
| Escalabilidade | 7/10 | **8.5/10** | Capacity planning 1/3/5 anos (seção 11.10). |
| Operação | 8/10 | **8.5/10** | Alert thresholds + SLOs (seção 15.4). |
| Observabilidade | 7.5/10 | **9/10** | Thresholds, severidade, owners e ações definidos. |
| Testabilidade | 8/10 | **8/10** | Test data management ainda no Implementation Guide. |

### 21.2 Nota Global

| Contexto de Avaliação | Nota | Comentário |
| --- | --- | --- |
| Portfólio CSA/CAD/CIS — Solution Architect ServiceNow | **9.5/10** | ADD completo para demonstração de maturidade arquitetural. |
| Architecture Review Board corporativo (enterprise-grade) | **9.0/10** | v2.2 fecha gaps operacionais documentais; MFA PROD e load test formal permanecem. |

**Veredito**: A EOAP v2.2 atinge o patamar documental esperado de **arquitetura sênior** para portfólio e revisão ARB. Gaps residuais são de **execução** (load test com evidência, MFA em PROD, CSDM Health Dashboard), não de estrutura do ADD.

### 21.3 O que Falta para 10/10 (execução)

| Dimensão | Gap Residual | Recomendação |
| --- | --- | --- |
| Escalabilidade | Load testing com evidência | Executar massa sintética 50% Ano 1 e anexar relatório ao Implementation Guide. |
| Segurança | MFA em PROD | Obrigatório para x_eoap.admin e x_eoap.risk_analyst antes de PROD. |
| Testabilidade | Test data management | Estratégia setup/teardown automatizado por suite ATF. |
| CSDM | Health Dashboard | Validação formal quando licenciado. |
| Governança | ARB independente | Review record externo assinado (não autoavaliação). |

  ---

  ## 22. Appendix

  ### 20.1 Glossário

  | Termo | Definição |
  | --- | --- |
  | ADD | Architecture Design Document — decisões, princípios e desenho arquitetural. |
  | SDD | Solution Design Document — design detalhado de componentes e implementação. |
  | ADR | Architecture Decision Record — registro formal de decisão com alternativas e consequências. |
  | CSDM | Common Service Data Model — modelo de referência ServiceNow para CMDB. |
  | CMDB | Configuration Management Database — repositório de CIs, serviços e relações. |
  | Business Application | Representação de aplicação sob perspectiva de negócio e governança. |
  | Application Service | Serviço operacional associado a aplicação. |
  | Access Owner | Responsável por aprovação, recertificação e exceção de acesso. |
  | Risk Engine | Componente de cálculo de score e explicação de risco. |
  | Correlation ID | Identificador de correlação end-to-end entre evento, log e audit trail. |
  | Idempotency Key | Chave que impede processamento duplicado. |
  | SoD | Segregation of Duties — separação de funções para controle. |
  | SoR | System of Record — fonte autoritativa do dado. |
  | SoE | System of Engagement — interface de interação com usuários. |
  | SoA | System of Action — sistema que executa ação técnica. |
  | DLQ | Dead Letter Queue — fila de eventos/mensagens não processáveis após retries. |
| Bounded Context | Fronteira de domínio com modelo e linguagem ubíqua próprios (DDD). |
| STRIDE | Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege — modelo de threat modeling. |
| SLO | Service Level Objective — meta mensurável de qualidade operacional. |

### 20.2 Abreviações

  | Abreviação | Significado |
  | --- | --- |
  | ACL | Access Control List |
  | ATF | Automated Test Framework |
  | CAB | Change Advisory Board |
  | CI | Configuration Item |
  | CSDM | Common Service Data Model |
  | GRC | Governance, Risk and Compliance |
  | IAM | Identity and Access Management |
  | ITOM | IT Operations Management |
  | ITSM | IT Service Management |
  | NFR | Non Functional Requirement |
  | OOB | Out of the Box |
  | PDI | Personal Developer Instance |
  | RACI | Responsible, Accountable, Consulted, Informed |
  | RITM | Requested Item |
  | SDD | Solution Design Document |
  | SoD | Segregation of Duties |

  ### 20.3 Referências

  | ID | Fonte | Descrição |
  | --- | --- | --- |
  | [1] | [ServiceNow CSDM](https://www.servicenow.com/docs/r/servicenow-platform/common-service-data-model-csdm/csdm-landing-page.html) | CSDM documentation |
  | [2] | [ServiceNow Flow Designer](https://www.servicenow.com/docs/r/application-development/flow-designer.html) | Flow Designer documentation |
  | [3] | [ServiceNow ATF](https://www.servicenow.com/docs/r/application-development/automated-test-framework-atf/atf-intro.html) | Automated Test Framework documentation |
  | [4] | [ServiceNow ACLs](https://www.servicenow.com/docs/r/platform-security/access-control/exploring-access-control-list.html) | Access Control documentation |
  | [5] | [ServiceNow Decision Tables](https://www.servicenow.com/docs/r/washingtondc/application-development/decision-tables/decision-table.html) | Decision Tables documentation |

  ### 20.4 ARB Readiness Checklist

  | Item | Critério | Status |
  | --- | --- | --- |
  | Princípios | Todos os princípios mandatórios descritos e aplicados com critério de aceite. | ✅ Completo |
  | NFRs | Métricas mensuráveis por categoria com validação definida. | ✅ Completo |
  | CSDM | Aderência validada, relações documentadas, compliance assessment. | ✅ Completo |
  | Data Architecture | Ownership, classification, lifecycle, retention e quality controls. | ✅ Completo |
  | Extensões | Toda extensão com ADR, gap OOB e consequências. | ✅ Completo |
  | Segurança | Roles, ACLs, Field ACLs, SoD, Threat Model STRIDE. | ✅ Completo |
  | Integração | Padrões REST, Import Sets, Correlation ID, Retry, SoR/SoE/SoA. | ✅ Completo |
  | Eventos | Catálogo, contracts, DLQ, idempotência, retry. | ✅ Completo |
  | C4 Model | System Context (L1), Container (L2) e Component (L3). | ✅ Completo |
| Capacity Planning | Projeção 1/3/5 anos com premissas e gates. | ✅ Completo |
| Threat Model STRIDE | Análise STRIDE com controles mapeados. | ✅ Completo |
| Alert Thresholds | Thresholds, SLOs, severidade e owners por métrica. | ✅ Completo |
  | Domain Model | Bounded contexts e fronteiras. | ✅ Completo |
  | Versionamento | DT, ADR, Update Sets, SemVer, event schema. | ✅ Completo |
  | Observabilidade | Logging, métricas, alert thresholds, SLOs, audit trail. | ✅ Completo |
  | Testes | ATF, segurança, regressão, ACL testing. | ✅ Completo |
  | Riscos | Matriz com probabilidade, impacto e mitigação. | ✅ Completo |
  | Deployment | Environments, Update Sets, Source Control, Promotion. | ✅ Completo |
  | Governança | ADR governance, Change governance, CMDB governance, RACI. | ✅ Completo |
  | Roadmap | Sprints com dependências e Definition of Done. | ✅ Completo (ver Implementation Guide) |

  ### 20.5 Document Control

  | Versão | Data | Autor | Descrição |
  | --- | --- | --- | --- |
  | 1.0 | 2026-06-06 | Artur Campos Batista | Versão inicial unificada (ADD + SDD + Implementation). |
  | 2.0 | 2026-06-06 | Architecture Review Board | Reestruturação: ADD separado de SDD e Implementation Guide. Adição de Logical Architecture, Deployment Architecture, Integration Architecture, Threat Model, Data Classification, CSDM Compliance Assessment, RACI, ADR-017, ADR-018 e ARB Assessment. |
  | 2.1 | 2026-06-06 | Architecture Review Board | Enterprise Architecture deepening: C4 L1/L2, bounded contexts, sequence diagrams, SoR/SoE/SoA matrix, event contracts, DLQ/retry/idempotency, versioning & release governance, NFRs reforçados, separação ADD/SDD (estado de entitlement → SDD). |
| 2.2 | 2026-06-06 | Architecture Review Board | Capacity planning (11.10), STRIDE threat model (12.8), alert thresholds & SLOs (15.4), C4 L3 label (7.2). |
