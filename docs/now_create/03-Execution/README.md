# 03 - Execution (Now Create)

This phase contains the detailed specifications and planning for building the solution.

## Subfolders

- **artifacts/**: Detailed specs for every component (tables, ACLs, flows, script includes, business rules, scheduled jobs, catalog items, dashboards). These are the authoritative descriptions that the Code Agent implements in `src/fluent/`.
- **sprint-planning/**: Sprint definitions.

## Relationship to Code

Every artifact here has (or should have) a corresponding implementation in `src/fluent/`.

The `mvp-guide.md` in `docs/implementation/` is the "single source of truth" execution guide that references these artifacts.
