# Security Policy

## API Key Management
- All external API keys (Gemini, ZAP) stored in `.env` file
- `.env` is listed in `.gitignore` and NEVER committed
- Keys loaded via `python-dotenv` or `os.environ`
- `.env.example` committed with placeholder values only

## Data Privacy
- Raw scan results are ephemeral — purged after feature extraction
- Only anonymized 15-D/18-D feature vectors are persisted in PostgreSQL
- No target URLs, IP addresses, or authentication tokens stored in DB
- User-submitted URLs are hashed (SHA-256) before storage for deduplication

## Scanning Ethics
- System scans ONLY publicly accessible endpoints
- No destructive payloads (SQL DROP, file deletion) ever sent
- OWASP ZAP configured in "Safe" mode (no active exploitation)
- Rate limiting: max 10 requests/second to target
- User consent required before scan initiation (checkbox in UI)

## Dependency Security
- `pip-audit` run weekly to check for known vulnerable dependencies
- All dependencies pinned to exact versions in `requirements.txt`
- No wildcard version specifiers (e.g., `pandas>=2.0` not allowed)

## Model Security
- Trained model files (.pkl) are NOT user-uploadable
- Model deserialization uses `joblib.load()` with trusted source only
- No `pickle.loads()` on untrusted input — prevents arbitrary code execution
