# 📋 IMPLEMENTATION PHASES — AI-Driven Intelligent Security & Performance Assessment Platform

> **Last Updated:** 2026-08-04
> **Status:** PRE-IMPLEMENTATION (All corrections applied)
> **Repository:** `D:\Capestone\Capstone_shit`
> **Python:** 3.12.5 | **Git User:** PalRahore

---

## 🔧 CORRECTIONS APPLIED (3 Flaws Fixed Before Any Code Is Written)

### ❌ FLAW 1: Label Circularity (CRITICAL — Project-Killer)

**Problem:** Original plan trained on 10 features (`cvss_score`, `attack_vector`, `attack_complexity`, `privileges_required`, `user_interaction`, `confidentiality`, `integrity`, `availability`, `epss_score`, `kev_status`) and generated labels from 3 of those same features (`cvss_score`, `epss_score`, `kev_status`). The model would just memorize our if-else rules. 96.4% accuracy would be suspicious, not impressive. Any reviewer would ask: *"Why not just use the rules directly?"*

**✅ Fix:** Add **5 NEW temporal/contextual features** that the label rule does NOT use:

| # | New Feature | Source | Why It Breaks Circularity |
|---|---|---|---|
| 1 | `days_since_published` | NVD `publishedDate` | Older CVEs with active EPSS are more dangerous than brand new ones |
| 2 | `days_since_modified` | NVD `lastModifiedDate` | Recently modified CVEs often indicate new exploit discovery |
| 3 | `cwe_category_frequency` | Computed from NVD | Common CWEs (CWE-79) behave differently from rare ones |
| 4 | `vendor_cve_count` | Computed from KEV | Vendors with repeated KEV entries have higher future exploit risk |
| 5 | `cvss_epss_divergence` | `cvss_score - (epss_score × 10)` | Captures anomalies where CVSS and EPSS disagree |

**Result:** Model trains on **15 features**, labels derived from only **3** → genuine ML learning, not memorization.

---

### ❌ FLAW 2: CWE-Level Aggregation Loses Specificity

**Problem:** At runtime, every SQL Injection finding maps to `CWE-89` and always gets the same averaged feature vector → same prediction every time. A SQLi in a `/admin/login` page should be riskier than one in `/blog/search`.

**✅ Fix:** Add **3 scanner-context features** at runtime:

| # | Context Feature | Source | What It Differentiates |
|---|---|---|---|
| 1 | `scanner_risk_level` | ZAP alert `risk` field | High=3, Medium=2, Low=1, Info=0 |
| 2 | `scanner_confidence` | ZAP alert `confidence` field | High=3, Medium=2, Low=1, FP=0 |
| 3 | `endpoint_sensitivity` | URL path heuristic | auth/admin=3, api=2, public=1, static=0 |

**Result:** Runtime inference vector = **18-D** (15 from threat intel + 3 from scanner context). Two SQLi findings can now produce **different priority predictions**.

---

### ❌ FLAW 3: OWASP ZAP Active Scan Takes 15–60 Minutes

**Problem:** Active ZAP scans (which test for SQLi, XSS by sending payloads) take 15-60 min, not 35 seconds.

**✅ Fix:** Implement **tiered scanning**:

| Tier | Type | Time | What It Catches |
|---|---|---|---|
| **Tier 1 (Instant)** | Headers + SSL + Lighthouse | ~15 sec | Performance KPIs, missing headers, SSL issues |
| **Tier 2 (Fast)** | ZAP Spider + Passive Scan | ~60-90 sec | Tech fingerprinting, info disclosure, cookies |
| **Tier 3 (Deep, Optional)** | ZAP Active Scan | 15-60 min | SQLi, XSS, Command Injection — runs async via Celery |

**Result:** Demo shows results in ~90 seconds. Deep scan is async background task with notification.

---

## 🤖 3-AGENT SYSTEM

| Agent | Role | Responsibility |
|---|---|---|
| 🔵 **Coder** | Writes code & commits | Implements each checkpoint, runs linters, makes atomic git commits |
| 🟡 **Supervisor** | Reviews & validates | Reviews every file, runs tests, validates data shapes and output files |
| 🔴 **CEO** | Strategic oversight | Cross-references against FINAL_CONTEXT.md, verifies flaw fixes, gates phase transitions |

---

## 📊 CORRECTED FEATURE VECTOR SUMMARY

### Training Time (Offline — 15-D)
```
Features X (15 columns):
├── Original 10 (from NVD + EPSS + KEV):
│   ├── cvss_score              (float, 0.0–10.0)
│   ├── attack_vector           (int, Network=3, Adjacent=2, Local=1, Physical=0)
│   ├── attack_complexity       (int, Low=1, High=0)
│   ├── privileges_required     (int, None=2, Low=1, High=0)
│   ├── user_interaction        (int, None=1, Required=0)
│   ├── confidentiality_impact  (int, High=2, Low=1, None=0)
│   ├── integrity_impact        (int, High=2, Low=1, None=0)
│   ├── availability_impact     (int, High=2, Low=1, None=0)
│   ├── epss_score              (float, 0.0–1.0)
│   └── kev_status              (int, 1 or 0)
│
└── NEW 5 Temporal/Contextual (Flaw 1 Fix):
    ├── days_since_published     (int, computed from NVD publishedDate)
    ├── days_since_modified      (int, computed from NVD lastModifiedDate)
    ├── cwe_category_frequency   (int, count of CVEs sharing same CWE)
    ├── vendor_cve_count         (int, count of vendor's CVEs in KEV)
    └── cvss_epss_divergence     (float, cvss_score - epss_score × 10)

Labels y (derived from ONLY 3 of 15 features — NO circularity):
├── CRITICAL (3): kev==1 OR cvss>=9.0 OR (cvss>=8.0 AND epss>=0.70)
├── HIGH     (2): cvss 7.0–8.99 AND epss>=0.30 AND kev==0
├── MEDIUM   (1): cvss 4.0–6.99 AND epss<0.30 AND kev==0
└── LOW      (0): cvss<4.0 AND epss<0.10 AND kev==0
```

### Runtime (Live Scan — 18-D)
```
Runtime Vector (18 columns):
├── 15 features from Threat Intelligence Index (CWE lookup + temporal)
│
└── NEW 3 Scanner Context (Flaw 2 Fix):
    ├── scanner_risk_level       (int, from ZAP alert risk field)
    ├── scanner_confidence       (int, from ZAP alert confidence field)
    └── endpoint_sensitivity     (int, heuristic from URL path)
```

---

---

# 🚀 PHASE 0: PROJECT BOOTSTRAP & INFRASTRUCTURE

**Duration:** ~1 hour
**Goal:** Repository skeleton, governance docs, git hooks, virtual environment

---

### ✅ Checkpoint 0.1 — Governance Documents

| File | Location | Purpose |
|---|---|---|
| `agent.md` | Project root | 3-agent collaboration protocol, commit conventions |
| `rules.md` | Project root | Code quality standards, git rules, testing policy |
| `security.md` | Project root | API key management, data privacy, scanning ethics |
| `.env.example` | Project root | Template for environment variables (no real keys) |
| `.gitignore` | Project root | Exclude venv, __pycache__, .pkl, .env, large datasets |

**Commit:** `docs(infra): add agent.md, rules.md, security.md, .gitignore, .env.example`

---

### ✅ Checkpoint 0.2 — Virtual Environment & Quality Gates

| Task | Command |
|---|---|
| Create venv | `python -m venv venv` |
| Activate | `.\venv\Scripts\activate` |
| Install deps | `pip install pre-commit black ruff mypy pytest pandas numpy scikit-learn xgboost matplotlib seaborn shap joblib python-dotenv` |
| Freeze | `pip freeze > requirements.txt` |
| Setup hooks | `pre-commit install` |

**Pre-commit hooks configured:**
- `black` (formatter, line-length 100)
- `ruff` (linter, rules E/F/W/I/N/UP)
- `mypy` (type checker)
- `trailing-whitespace` fixer
- `end-of-file` fixer
- `check-added-large-files` (max 5MB)

**Commit:** `chore(infra): setup venv, pre-commit hooks, requirements.txt`

---

### ✅ Checkpoint 0.3 — Folder Structure

```
D:\Capestone\Capstone_shit\
├── AI_Model/
│   ├── datasets/
│   │   ├── merged/          → merged_dataset.csv (output of Checkpoint 1.2)
│   │   └── processed/       → final_features.csv, X_train, X_test, y_train, y_test
│   ├── notebooks/           → Jupyter EDA & training notebooks
│   ├── models/              → best_model.pkl, scaler.pkl, encoder.pkl, cwe_threat_index.json
│   ├── results/             → confusion_matrix.png, shap_plot.png, metrics_comparison.csv
│   ├── src/
│   │   ├── __init__.py
│   │   ├── config.py        → All paths, feature names, encoding maps
│   │   ├── data_loader.py   → NVD/EPSS/KEV parsers
│   │   ├── merge_datasets.py
│   │   ├── build_threat_index.py
│   │   ├── preprocess.py    → Encoding + 5 new temporal features
│   │   ├── label_generator.py
│   │   ├── train.py         → RF + XGBoost training
│   │   └── evaluate.py      → Metrics, confusion matrix, ROC
│   └── tests/
│       ├── __init__.py
│       ├── test_merge.py
│       ├── test_preprocess.py
│       ├── test_labels.py
│       └── test_train.py
├── backend/                  → (Phase 2-3, created later)
├── frontend/                 → (Phase 4, created later)
├── dataset/                  → Raw NVD/EPSS/KEV files (already present, gitignored)
├── docs/
│   ├── FINAL_CONTEXT.md
│   ├── IMPLEMENTATION_PHASES.md  ← THIS FILE
│   └── ...
├── agent.md
├── rules.md
├── security.md
├── .gitignore
├── .pre-commit-config.yaml
├── .env.example
├── requirements.txt
└── README.md
```

**Commit:** `chore(infra): create full project folder structure`

#### 🔴 CEO Phase Gate: Phase 0 → Phase 1
- [ ] All governance docs exist and are complete
- [ ] `pre-commit run --all-files` passes
- [ ] `python -c "import pandas; import sklearn; import xgboost"` succeeds
- [ ] Folder structure matches FINAL_CONTEXT.md Section 9

---

---

# 🧠 PHASE 1: AI MODEL DEVELOPMENT PIPELINE

**Duration:** ~1–2 weeks
**Goal:** Train the "AI brain" — from raw datasets to a serialized `best_model.pkl`
**This is where ALL 3 flaw fixes are implemented.**

---

### ✅ Checkpoint 1.1 — Dataset Understanding & Schema Inspection

**What Coder does:**
- Write `AI_Model/src/config.py` — central config with all paths, feature names, encoding maps
- Write `AI_Model/src/data_loader.py` — parsers for NVD JSON (handles v1.0 and v2.0 formats), EPSS CSV, CISA KEV CSV
- Create `AI_Model/notebooks/01_Dataset_Understanding.ipynb` — inspect schemas, nulls, sample rows

**Supervisor validates:**
```powershell
ruff check AI_Model/src/
python -c "from AI_Model.src.data_loader import load_all_nvd, load_epss, load_kev; print('OK')"
```

**Expected output:** Console prints showing NVD ~200K+ records, EPSS ~200K+ records, KEV ~1100 records

**Commit:** `feat(data): add data_loader.py with NVD/EPSS/KEV parsers and config.py`

---

### ✅ Checkpoint 1.2 — Dataset Merging

**What Coder does:**
- Write `AI_Model/src/merge_datasets.py` — left-joins NVD + EPSS + KEV on `cve_id`
- Handle missing: `epss_score` fill with `0.0001`, `kev_status` fill with `0`
- Drop duplicates on `cve_id`
- Save `AI_Model/datasets/merged/merged_dataset.csv`

**Supervisor validates:**
```python
df = pd.read_csv("AI_Model/datasets/merged/merged_dataset.csv")
assert len(df) > 100_000
assert df["kev_status"].isin([0, 1]).all()
assert df["epss_score"].between(0, 1).all()
assert df["cvss_score"].between(0, 10).all()
```

**Commit:** `feat(data): merge NVD + EPSS + KEV datasets on cve_id`

---

### ✅ Checkpoint 1.3 — Build Threat Intelligence Index (CWE Lookup Table)

**What Coder does:**
- Write `AI_Model/src/build_threat_index.py`
- Group `merged_dataset.csv` by `cwe_id`
- Compute per CWE: `avg_cvss`, `avg_epss`, `kev_rate` (% of CVEs in KEV), `cve_count`, `composite_risk_weight`
- `composite_risk_weight = 0.40 × norm(avg_cvss) + 0.35 × avg_epss + 0.25 × kev_rate`
- Save `AI_Model/models/cwe_threat_index.json`

**Supervisor validates:**
```python
import json
with open("AI_Model/models/cwe_threat_index.json") as f:
    index = json.load(f)
assert len(index) > 50  # At least 50 unique CWE categories
assert "CWE-89" in index
assert "avg_cvss" in index["CWE-89"]
```

**Commit:** `feat(data): build CWE-based Threat Intelligence Index lookup table`

---

### ✅ Checkpoint 1.4 — Feature Engineering (⚠️ FLAW 1 FIX)

**What Coder does:**
- Write `AI_Model/src/preprocess.py`
- Encode categorical columns → integers using maps from `config.py`
- Compute **5 NEW temporal/contextual features:**
  ```python
  reference_date = pd.Timestamp("2026-08-01")  # Fixed reference point

  df["days_since_published"] = (reference_date - pd.to_datetime(df["published_date"])).dt.days
  df["days_since_modified"] = (reference_date - pd.to_datetime(df["modified_date"])).dt.days
  df["cwe_category_frequency"] = df.groupby("cwe_id")["cve_id"].transform("count")
  df["vendor_cve_count"] = df.groupby("kev_vendor")["cve_id"].transform("count").fillna(0)
  df["cvss_epss_divergence"] = df["cvss_score"] - (df["epss_score"] * 10)
  ```
- Select only the 15 training feature columns
- Save `AI_Model/datasets/processed/final_features.csv`

**🔴 CEO validates Flaw 1 Fix:**
```python
df = pd.read_csv("AI_Model/datasets/processed/final_features.csv")
assert "days_since_published" in df.columns      # Temporal feature exists
assert "cvss_epss_divergence" in df.columns       # Divergence feature exists
assert len([c for c in df.columns if c != "priority_label"]) == 15  # Exactly 15 features
# Verify label rule does NOT use any of the 5 new features
# (Label rule only uses cvss_score, epss_score, kev_status)
```

**Commit:** `feat(data): add 5 temporal/contextual features — Flaw 1 Fix (label circularity broken)`

---

### ✅ Checkpoint 1.5 — Label Generation

**What Coder does:**
- Write `AI_Model/src/label_generator.py`
- Apply multi-indicator rule matrix using ONLY `cvss_score`, `epss_score`, `kev_status`
- Append `priority_label` column to `final_features.csv`

**Supervisor validates:**
```python
label_counts = df["priority_label"].value_counts()
assert set(label_counts.index) == {0, 1, 2, 3}  # All 4 classes exist
assert label_counts.min() > 1000                  # No extreme imbalance
print(label_counts)
```

**Commit:** `feat(data): implement multi-indicator label generation matrix`

---

### ✅ Checkpoint 1.6 — Exploratory Data Analysis (EDA)

**What Coder does:**
- Create `AI_Model/notebooks/02_EDA.ipynb`
- Generate and save to `results/`:
  - `cvss_distribution.png` — histogram of CVSS scores
  - `epss_distribution.png` — histogram of EPSS scores
  - `class_balance.png` — bar chart of Critical/High/Medium/Low counts
  - `correlation_heatmap.png` — 15×15 feature correlation matrix
  - `feature_distributions.png` — violin plots of key features per class

**Supervisor validates:**
```powershell
Get-ChildItem AI_Model\results\*.png | Measure-Object  # Should be >= 4 files
```

**Commit:** `feat(data): add EDA notebook with publication-ready figures`

---

### ✅ Checkpoint 1.7 — Model Training

**What Coder does:**
- Write `AI_Model/src/train.py`
- 80/20 stratified train-test split
- Train **Random Forest** (primary):
  ```python
  RandomForestClassifier(n_estimators=200, max_depth=15, n_jobs=-1, random_state=42)
  ```
- Train **XGBoost** (comparison):
  ```python
  xgb.XGBClassifier(n_estimators=200, max_depth=8, learning_rate=0.1,
                     tree_method="hist", device="cuda", random_state=42)
  ```
- Save both models to `AI_Model/models/`

**Supervisor validates:**
```python
import joblib
model = joblib.load("AI_Model/models/random_forest_v1.pkl")
sample = [[9.8, 3, 1, 2, 1, 2, 2, 2, 0.91, 1, 500, 30, 1200, 15, -0.3]]
pred = model.predict(sample)
assert pred[0] == 3  # CRITICAL
print(f"Prediction: {pred[0]} (expected: 3/CRITICAL)")
```

**Commit:** `feat(model): train Random Forest and XGBoost on 15-D feature vector`

---

### ✅ Checkpoint 1.8 — Model Evaluation

**What Coder does:**
- Write `AI_Model/src/evaluate.py`
- Compute per-class and macro: Accuracy, Precision, Recall, F1-Score
- Generate and save:
  - `results/confusion_matrix.png` — 4×4 heatmap
  - `results/roc_curves.png` — one-vs-rest ROC per class
  - `results/metrics_comparison.csv` — RF vs XGBoost comparison table

**Supervisor validates:**
```python
import pandas as pd
metrics = pd.read_csv("AI_Model/results/metrics_comparison.csv")
assert "Random Forest" in metrics["model"].values
assert "XGBoost" in metrics["model"].values
rf_acc = metrics.loc[metrics["model"] == "Random Forest", "accuracy"].values[0]
assert 0.85 < rf_acc < 0.99  # Realistic range, not suspiciously perfect
print(f"Random Forest Accuracy: {rf_acc:.4f}")
```

**Commit:** `feat(model): evaluate models — confusion matrix, ROC, comparison table`

---

### ✅ Checkpoint 1.9 — SHAP Feature Importance Analysis

**What Coder does:**
- Use SHAP `TreeExplainer` on the Random Forest model
- Generate:
  - `results/shap_feature_importance.png` — global bar chart
  - `results/shap_beeswarm.png` — beeswarm plot showing feature impact distribution

**Supervisor validates:**
- [ ] SHAP plot shows importance spread across multiple features (not single-feature dominance)
- [ ] The 5 NEW temporal features show non-zero SHAP values (proving they contribute to predictions)

**Commit:** `feat(model): generate SHAP feature importance analysis`

---

### ✅ Checkpoint 1.10 — Model Serialization & Phase 1 Completion

**What Coder does:**
- Select best model (higher F1-score wins)
- Save final artifacts:
  - `AI_Model/models/best_model.pkl`
  - `AI_Model/models/feature_scaler.pkl`
  - `AI_Model/models/label_encoder.pkl`
  - `AI_Model/models/cwe_threat_index.json` (already exists from 1.3)

**Commit:** `feat(model): serialize trained model artifacts for runtime inference`

#### 🔴 CEO Phase Gate: Phase 1 → Phase 2

| # | Gate Check | Pass? |
|---|---|---|
| 1 | `merged_dataset.csv` exists with >100K rows | ☐ |
| 2 | `final_features.csv` has exactly 15 feature columns + target label | ☐ |
| 3 | 5 temporal features present and have non-zero variance | ☐ |
| 4 | Label distribution: all 4 classes present, no extreme imbalance | ☐ |
| 5 | `best_model.pkl` loads and `.predict()` returns valid class | ☐ |
| 6 | `cwe_threat_index.json` contains >50 CWE entries | ☐ |
| 7 | Accuracy is realistic (85–97%), NOT suspiciously >99% | ☐ |
| 8 | SHAP plot shows importance spread, new features contribute | ☐ |
| 9 | All tests pass: `pytest AI_Model/tests/ -v` | ☐ |
| 10 | All figures in `results/` ready for conference paper | ☐ |

**All 10 gates must pass before proceeding to Phase 2.**

---

---

# 🔍 PHASE 2: ASSESSMENT TOOLS INTEGRATION

**Duration:** ~1–2 weeks
**Goal:** Build Python wrappers that scan a target URL/API and output structured JSON reports

---

### ✅ Checkpoint 2.1 — Input Validation Module

**What Coder does:**
- Write `backend/app/services/assessment/input_validator.py`
- 3-tier validation:
  - **Tier 1 (Syntax):** Regex check for valid `http://` or `https://` URL
  - **Tier 2 (Reachability):** HTTP HEAD request, check for 200/301/302
  - **Tier 3 (HTTPS):** Check if target uses SSL — warn if not

**Commit:** `feat(backend): add 3-tier input validation module`

---

### ✅ Checkpoint 2.2 — Google Lighthouse Wrapper

**What Coder does:**
- Write `backend/app/services/assessment/lighthouse_wrapper.py`
- Runs Lighthouse CLI via `subprocess` with headless Chrome
- Extracts 8 performance KPIs: LCP, CLS, FCP, TBT, TTFB, Speed Index, Payload Size, DOM Size
- Returns structured JSON dict

**Commit:** `feat(backend): add Lighthouse performance scanner wrapper`

---

### ✅ Checkpoint 2.3 — HTTP Header & SSL Scanner

**What Coder does:**
- Write `backend/app/services/assessment/header_scanner.py` — checks CSP, HSTS, X-Frame, X-Content-Type, Referrer-Policy, Cookie Flags
- Write `backend/app/services/assessment/ssl_checker.py` — checks TLS version, cert expiry using `pyOpenSSL`

**Commit:** `feat(backend): add HTTP header and SSL/TLS scanner modules`

---

### ✅ Checkpoint 2.4 — OWASP ZAP Integration (⚠️ FLAW 3 FIX — Tiered Scanning)

**What Coder does:**
- Write `backend/app/services/assessment/zap_wrapper.py`
- Implement 3-tier architecture:

```python
class ZAPScanner:
    def tier1_passive(self, url: str) -> dict:
        """Spider + passive scan. ~60-90 seconds."""
        # Start spider, wait for completion, collect passive alerts
        ...

    def tier3_active(self, url: str) -> dict:
        """Full active scan. ~15-60 min. Runs async via Celery."""
        # Active scan with attack payloads (SQLi, XSS, etc.)
        ...
```

- Tier 1 (Headers/SSL/Lighthouse) already handled by Checkpoints 2.2-2.3
- Tier 2 (ZAP Passive) used for default scans
- Tier 3 (ZAP Active) triggered only when user opts in, runs via Celery background task

**Commit:** `feat(backend): add OWASP ZAP wrapper with tiered scanning — Flaw 3 Fix`

#### 🔴 CEO Phase Gate: Phase 2 → Phase 3

| # | Gate Check | Pass? |
|---|---|---|
| 1 | Input validator correctly rejects invalid URLs | ☐ |
| 2 | Lighthouse wrapper returns 8 KPIs as JSON | ☐ |
| 3 | Header scanner detects missing CSP/HSTS correctly | ☐ |
| 4 | SSL checker reports TLS version and cert expiry | ☐ |
| 5 | ZAP passive scan completes in <90 seconds | ☐ |
| 6 | All scanner outputs include CWE IDs where applicable | ☐ |

---

---

# 🔗 PHASE 3: BACKEND & CWE BRIDGE PIPELINE

**Duration:** ~1–2 weeks
**Goal:** Connect live scanner findings to the trained AI model via the CWE bridge

---

### ✅ Checkpoint 3.1 — FastAPI Project Setup

- Write `backend/app/main.py` — FastAPI app with CORS, health endpoint
- Write `backend/app/core/config.py` — loads `.env` variables
- Setup PostgreSQL connection pool via SQLAlchemy

**Commit:** `feat(backend): initialize FastAPI application with config and health endpoint`

---

### ✅ Checkpoint 3.2 — CWE Mapper & Threat Index Lookup

- Write `backend/app/services/intelligence/cwe_mapper.py` — maps scanner alert names to CWE IDs using ZAP's built-in CWE field + a 30-entry fallback dictionary
- Write `backend/app/services/intelligence/threat_index_lookup.py` — loads `cwe_threat_index.json` into memory, returns enriched features for a given CWE ID

**Commit:** `feat(backend): add CWE mapper and threat intelligence index lookup service`

---

### ✅ Checkpoint 3.3 — ML Inference Service (⚠️ FLAW 2 FIX — 18-D Runtime Vector)

- Write `backend/app/services/intelligence/ml_inference.py`
- Loads `best_model.pkl` at startup
- Constructs **18-D runtime feature vector**:
  ```python
  def build_runtime_vector(threat_features: list[float], scanner_context: dict) -> list[float]:
      """Combine 15 threat intel features + 3 scanner context features."""
      context = [
          scanner_context["risk_level"],      # ZAP risk encoded
          scanner_context["confidence"],       # ZAP confidence encoded
          scanner_context["endpoint_sensitivity"],  # URL path heuristic
      ]
      return threat_features + context  # 18-D vector
  ```

**Commit:** `feat(backend): add ML inference service with 18-D runtime vector — Flaw 2 Fix`

---

### ✅ Checkpoint 3.4 — Rule Engine for Non-CVE Findings

- Write `backend/app/services/intelligence/rule_engine.py`
- Handles findings like "Missing CSP", "Missing HSTS", "Weak Cookies"
- Assigns priority based on predefined security best-practice rules (no ML needed)

**Commit:** `feat(backend): add rule-based engine for non-CVE configuration findings`

---

### ✅ Checkpoint 3.5 — Gemini LLM Service (with Fallback Templates)

- Write `backend/app/services/llm/gemini_service.py`
- Sends finding + priority + SHAP drivers to Gemini API
- **Fallback:** If Gemini API fails, use pre-written templates for top 20 CWE categories

**Commit:** `feat(backend): add Gemini LLM explainability service with template fallback`

---

### ✅ Checkpoint 3.6 — PostgreSQL Schema & API Endpoints

- Write `database/init_schema.sql` — tables: `scan_logs`, `feature_vectors`, `recommendations`
- Write scan API endpoints:
  - `POST /api/v1/scan/website` — triggers website assessment pipeline
  - `POST /api/v1/scan/api` — triggers API assessment pipeline
  - `GET /api/v1/report/{scan_id}` — retrieves scan results + AI recommendations
  - `GET /api/v1/report/{scan_id}/pdf` — generates downloadable PDF

**Commit:** `feat(backend): add PostgreSQL schema and scan/report API endpoints`

#### 🔴 CEO Phase Gate: Phase 3 → Phase 4

| # | Gate Check | Pass? |
|---|---|---|
| 1 | CWE mapper correctly resolves ZAP alerts to CWE IDs | ☐ |
| 2 | Threat index lookup returns enriched features for CWE-89 | ☐ |
| 3 | ML inference produces valid priority class (0-3) from 18-D vector | ☐ |
| 4 | Rule engine handles non-CVE findings without errors | ☐ |
| 5 | Gemini fallback templates work when API key is missing | ☐ |
| 6 | Full pipeline: URL → Scan → CWE Bridge → ML → Priority works end-to-end | ☐ |

---

---

# 🖥️ PHASE 4: FRONTEND DASHBOARD

**Duration:** ~1–2 weeks
**Goal:** Build a modern React dashboard for running scans and viewing results

---

### ✅ Checkpoint 4.1 — React + Vite Project Setup
### ✅ Checkpoint 4.2 — Dual-Mode Scan Form (Website vs API mode selector)
### ✅ Checkpoint 4.3 — Dashboard with Trust Score Gauge (composite security + performance)
### ✅ Checkpoint 4.4 — Priority Remediation Cards (ranked by ML predictions + Gemini explanations)
### ✅ Checkpoint 4.5 — PDF Report Export

**Commit pattern:** `feat(frontend): <component description>`

#### 🔴 CEO Phase Gate: Phase 4 → Phase 5
- [ ] Dashboard renders scan results with correct priority ordering
- [ ] Trust Score combines both security and performance metrics
- [ ] PDF report downloads successfully

---

---

# 🧪 PHASE 5: INTEGRATION TESTING & PAPER PREPARATION

**Duration:** ~1 week
**Goal:** End-to-end validation and conference paper figure export

---

### ✅ Checkpoint 5.1 — End-to-End Test Runs
- Test against sample websites and mock REST APIs
- Verify full pipeline: URL → Scanners → CWE Bridge → ML → Gemini → Dashboard → PDF

### ✅ Checkpoint 5.2 — Conference Paper Figures Export
- Export from `results/`: confusion matrix, SHAP plots, model comparison, architecture diagram
- Map each figure to the corresponding IEEE paper section

### ✅ Checkpoint 5.3 — Final Documentation & README
- Complete `README.md` with setup instructions, screenshots, and architecture diagram
- Final review of all governance docs

---

---

# 📅 TIMELINE SUMMARY

```
Week  1     : Phase 0 (Bootstrap) + Checkpoint 1.1–1.3 (Data Loading, Merging, Threat Index)
Week  2     : Checkpoint 1.4–1.6 (Feature Engineering with Flaw Fixes, Labels, EDA)
Week  3     : Checkpoint 1.7–1.10 (Model Training, Evaluation, SHAP, Serialization)
Week  4–5   : Phase 2 (Assessment Tools — Lighthouse, Headers, SSL, ZAP Tiered)
Week  6–7   : Phase 3 (Backend — CWE Bridge, ML Inference, Rule Engine, Gemini, APIs)
Week  8–9   : Phase 4 (Frontend Dashboard — React, Trust Score, Priority Cards, PDF)
Week 10–11  : Phase 5 (Integration Testing, Paper Figures, Documentation)
Week 12     : Buffer + Conference Paper Finalization + Viva Preparation
```

---

## ✅ QUALITY ENFORCEMENT (Every Checkpoint)

```powershell
# Run before EVERY commit
ruff check AI_Model/src/ backend/        # Linting
black --check AI_Model/src/ backend/     # Formatting
mypy AI_Model/src/ --ignore-missing-imports  # Type checking
pytest AI_Model/tests/ -v --tb=short     # Unit tests
```
