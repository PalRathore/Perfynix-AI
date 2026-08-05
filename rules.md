# Development Rules & Standards

## Code Quality
- Python formatter: `black` (line-length 100)
- Python linter: `ruff` (select = ["E", "F", "W", "I", "N", "UP"])
- Type checker: `mypy` (strict mode on src/ modules)
- All functions must have docstrings (Google style)
- All modules must have module-level docstrings
- No hardcoded file paths — use pathlib.Path and config constants
- No print() in production code — use Python logging module

## Git Rules
- Atomic commits: one logical change per commit
- Pre-commit hooks must pass before any commit is accepted
- No force-pushes to main/master branch
- Branch naming: `phase-N/checkpoint-M-description`
- Squash merge feature branches into master

## Testing
- Framework: pytest
- Minimum coverage: 80% for src/ modules
- Every function in src/ must have at least one test
- Test file naming: `test_<module_name>.py`

## Data Rules
- Raw datasets are NEVER modified — treat as immutable
- All intermediate outputs go to `AI_Model/datasets/merged/` or `AI_Model/datasets/processed/`
- Model artifacts go to `AI_Model/models/` with version suffixes
- Results (plots, CSVs) go to `AI_Model/results/`

## Security Rules
- See security.md for detailed security policies
- No API keys in source code — use .env files
- No PII in logs or committed files
- .env is in .gitignore and never committed
