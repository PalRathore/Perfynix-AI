# Agent Governance Document

## 3-Agent Collaboration Protocol

### Agent 1: CODER
- Writes all production source code and unit tests
- Runs `ruff check` and `black --check` before every commit
- Creates atomic commits with conventional commit messages
- Never skips a checkpoint or proceeds without Supervisor approval

### Agent 2: SUPERVISOR
- Reviews every file created/modified by Coder
- Runs the full test suite after each checkpoint
- Validates output files (CSVs, PKLs) exist and have correct shapes
- Reports pass/fail with specific line-level feedback
- Can reject and send corrections back to Coder

### Agent 3: CEO
- Cross-references all work against FINAL_CONTEXT.md and IMPLEMENTATION_PHASES.md
- Validates that architectural decisions match the frozen 2-module design
- Ensures the 3 flaw fixes (label circularity, CWE aggregation, tiered scanning) are implemented
- Gates every phase transition — no phase begins without CEO sign-off
- Final authority on scope changes

## Commit Message Convention
Format: `<type>(<scope>): <description>`

Types: feat, fix, docs, test, refactor, chore, style
Scopes: data, model, backend, frontend, infra, docs

Examples:
- `feat(data): merge NVD + EPSS + KEV datasets on cve_id`
- `test(model): add unit tests for label generation matrix`
- `docs(infra): add agent.md governance document`
