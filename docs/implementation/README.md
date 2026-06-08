# Implementation

This is the practical "how to build" section.

## Main Documents

- **mvp-guide.md** — The Single Source of Truth for the current MVP implementation. It maps every component to its code location in `src/fluent/` and tells you the exact order of work.
- **step-by-step/** — Detailed guides when needed (currently minimal; most detail lives in the artifact specs).

## How to use

1. Read `mvp-guide.md` to understand scope and status.
2. Go to the detailed specs in `now_create/03-Execution/artifacts/` for what each component must do.
3. Implement in `src/fluent/` following `developer/fluent-guide.md` and `developer/standards.md`.
4. Use the Agentic System (`npm run agent:orchestrate`) to help generate code and keep docs in sync.

The goal of this template is that the documentation in `now_create/` + `implementation/` + code in `src/fluent/` are always consistent.
