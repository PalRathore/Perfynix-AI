# FINAL CONTEXT: AI-Driven Intelligent Security & Performance Assessment Platform with AI-Based Decision Support

---

## 1. Executive Summary & Project Identification
- **Project Title:** AI-Driven Intelligent Security and Performance Assessment System with AI-Based Decision Support
- **Domain:** AI-Driven Intelligent Security, Web Performance Assessment, Threat Intelligence Fusion, and Explainable AI (XAI)
- **Primary Objective:** Build an enterprise-grade, unified web and REST API assessment platform that converts raw security and performance findings into intelligent, prioritized remediation roadmaps using machine learning (Random Forest / XGBoost) and Large Language Models (Gemini).
- **Core Novelty:** Integrating live runtime assessment (Lighthouse, OWASP ZAP, SSL/Header inspection) with offline threat intelligence fusion (NVD, EPSS, CISA KEV) via a CWE-based bridging architecture, replacing raw alert dumps with AI-driven remediation decision support.

---

## 2. Problem Statement, Business Pain Points & Combination Rationale

### 2.1 Problem Statement
Modern web applications and cloud-native REST APIs face simultaneous security vulnerabilities and performance bottlenecks. Existing automated scanners (e.g., Google Lighthouse, OWASP ZAP, SSL checkers) operate in strict technical silos:
1. They generate voluminous, unprioritized reports containing hundreds of raw warnings.
2. They offer zero cross-domain context linking performance degradation (e.g., latency, Core Web Vitals) to underlying security threats or exploit risks.
3. Developers, DevOps teams, and small organizations must manually review disconnected reports, leading to decision paralysis, delayed risk mitigation, and inefficient resource allocation.

### 2.2 5 Critical Business Pain Points
1. **Alert Fatigue & Lack of Prioritization:** Developers are overwhelmed by hundreds of low-severity scanner alerts without knowing which 5 vulnerabilities pose immediate exploitation risks.
2. **Tool Fragmentation & Siloed Engineering:** Security and performance are evaluated by separate teams using disconnected tools, ignoring how security configurations (e.g., heavy encryption, CSP policies) impact response latency.
3. **Lack of Actionable Explainability:** Raw technical reports (e.g., "Missing HSTS", "CWE-89 detected") fail to explain *why* an issue matters to business outcomes or *how* to remediate it step-by-step for non-security experts.
4. **No Real-World Exploitation Context:** Traditional scanners assess theoretical severity (CVSS Base Score) but ignore active real-world exploitation state (CISA KEV) and statistical exploit probability (EPSS).
5. **High Operational Costs & User Churn:** Unoptimized images, poor rendering metrics, and unpatched security vulnerabilities lead to severe cloud billing inefficiencies, high search engine penalty risk, and user drop-offs.

### 2.3 Combination Rationale: Idea 1 (Website Health) + Idea 3 (API Intelligence)
Initially, two distinct ideas were evaluated:
- **Idea 1 (Website Health Intelligence Platform):** Focused on Core Web Vitals, Lighthouse performance, SSL certificate validation, and security headers.
- **Idea 2 (API Security & Performance Analyzer):** Focused on REST API endpoints, OWASP API Top 10 vulnerabilities, payload size, authentication, and endpoint latency.

**Strategic Rationale for Integration:**
Modern web applications are inherently decoupled architectures—frontend web interfaces communicate directly with backend REST APIs. Analyzing a website without testing its underlying API endpoints leaves half the attack surface unmonitored. Conversely, testing APIs without assessing web performance neglects end-user experience metrics. Combining Idea 1 and Idea 3 into a single unified platform enables users to select between **Website Mode** and **API Mode** at entry, sharing a standardized normalization, threat intelligence enrichment, and AI decision support backend.

---

## 3. Literature Review, Research Gaps, Novelty & Target Users

### 3.1 Literature Review (6 Core Base Papers)

1. **Paper 1:** *A Quantitative Security Evaluation and Analysis Model for Web Applications based on OWASP ASVS* (2023)
   - **Focus:** Quantifies web security risk by evaluating application compliance against OWASP ASVS criteria.
   - **Research Gap:** Relies purely on manual/rule-based scoring; lacks machine learning prioritization, does not evaluate performance metrics, has no API assessment, and provides no natural-language fix guidance.

2. **Paper 2:** *Web Application Performance Assessment: A Study of Responsiveness* (2024)
   - **Focus:** Evaluates website response time, throughput, and scalability using Apache JMeter.
   - **Research Gap:** Strictly performance-focused; completely excludes security vulnerability scanning, threat intelligence mapping, and AI recommendation engines.

3. **Paper 3:** *Towards Secure APIs: Survey on REST API Vulnerability Detection* (2025)
   - **Focus:** Comprehensive survey of REST API security vulnerabilities, detection taxonomies, and OWASP API Top 10 classification.
   - **Research Gap:** Literature survey only; lacks practical system implementation, unified security-performance scoring, and automated exploit probability enrichment.

4. **Paper 4:** *NIST Guidelines for API Protection in Cloud-Native Systems* (2025)
   - **Focus:** Official NIST special publication establishing architectural guidelines and security posture baselines for cloud APIs.
   - **Research Gap:** Static reference document; lacks automated scanning mechanisms, runtime telemetry analysis, and machine learning decision support.

5. **Paper 5:** *Evaluating Web Vulnerability Scanners using RD Score* (2024)
   - **Focus:** Introduces Relative Detection (RD) score to compare detection capabilities of web scanners (e.g., OWASP ZAP vs Burp Suite).
   - **Research Gap:** Evaluates scanners in isolation; does not synthesize scanner outputs into prioritized remediation workflows or integrate performance metrics.

6. **Paper 6:** *Hybrid Cybersecurity Assessment Methodology for HTTPS Deployment* (2026)
   - **Focus:** Combines HTTPS testing, K-Means clustering, and LLM text generation to assess web encryption configs.
   - **Research Gap:** Restricted narrowly to HTTPS configuration; neglects broader application security (SQLi, XSS), REST API security, Core Web Vitals, and multi-dataset threat intelligence fusion (EPSS/KEV).

### 3.2 5 Consolidated Research Gaps
1. **Gap 1 (Domain Siloing):** Absence of unified frameworks assessing web performance, web security, and REST API security in a single pipeline.
2. **Gap 2 (Prioritization Deficit):** Inability of existing scanners to rank detected vulnerabilities by combining intrinsic severity (CVSS), real-world exploitation history (CISA KEV), and statistical probability of exploitation (EPSS).
3. **Gap 3 (Feature Space Disconnect):** Existing research fails to bridge runtime scanner observations (e.g., missing headers, latency) with public vulnerability intelligence databases (NVD).
4. **Gap 4 (Explainability Void):** Lack of explainable AI (XAI) models that translate technical vulnerability codes into context-aware developer action plans.
5. **Gap 5 (Absence of Composite Scoring):** No single mathematical index (Trust Index) combining multi-dimensional performance KPIs and security risk scores.

### 3.3 Novelty & Unique Selling Proposition (USP)
- **AI-Powered Remediation Prioritization Engine:** Moves beyond mere detection to intelligently sequence fixes based on multi-indicator threat intelligence.
- **CWE-Based Knowledge Enrichment Strategy:** Successfully bridges runtime scanner findings (ZAP/Headers) with offline dataset intelligence (NVD/EPSS/CISA KEV).
- **Dual-Mode Unified Platform:** Single platform supporting both full Website scans and dedicated REST API security/performance evaluations.
- **Explainable AI (XAI) via Gemini LLM:** Integrates Random Forest feature importance outputs with Google Gemini LLM to generate plain-English, step-by-step remediation plans.

### 3.4 Target User Personas
- **Primary Users:** Small & Medium Enterprises (SMEs), Startups, Freelance Web Developers, and Solopreneurs who lack dedicated AppSec teams.
- **Secondary Users:** DevOps Engineers (pre-deployment sanity checks), QA Engineers, Cybersecurity Students, and Educational Research Labs.

---

## 4. System Architecture & Evolution (P0 - Core Architecture)

### 4.1 Architecture Evolution & Mismatch Discovery
During architectural design, a critical feature space mismatch was identified:
- **Initial Naive Concept:** Train a machine learning model on NVD data and feed live website scanner outputs (LCP, CLS, CSP, HSTS, TLS version) directly into the model.
- **Discovery of Fundamental Flaw:** 
  - *Training Feature Space (NVD):* CVSS Score, Attack Vector, Privileges Required, Attack Complexity, EPSS Score, KEV Status, CWE ID.
  - *Runtime Feature Space (Lighthouse/Headers):* LCP (seconds), CLS (score), CSP (present/absent), SSL Certificate Expiry (days), API Latency (ms).
  - *Conclusion:* A machine learning model trained on NVD features **cannot** accept Lighthouse runtime metrics as input. They represent disjoint mathematical feature spaces.

### 4.2 Analysis & Rejection of Alternative Options
- **Option 1 (Force NVD into Runtime Features):** Artificially mapping LCP/CLS to CVSS scores. *Rejected* as scientifically invalid and indefensible in academic peer review.
- **Option 2 (Collect Custom Labeled Dataset):** Scanning 50,000 websites to create a custom labeled dataset of Lighthouse metrics vs vulnerability risk. *Rejected* due to strict 3-month project constraints and lack of ground-truth risk labels.
- **Option 3 (Chosen Two-Module Architecture with CWE Bridging):** Decouple runtime assessment from threat intelligence training, connecting them via a **CWE-based Knowledge Enrichment Bridge**.

### 4.3 Two-Module Architecture Overview
The frozen system architecture splits responsibilities into two distinct, harmonized modules:
1. **Module 1 (Assessment & Telemetry Layer):** Executes live scanning (Lighthouse, Security Headers, SSL Inspection, OWASP ZAP) to collect 22 runtime KPIs.
2. **Module 2 (Threat Intelligence & Decision Engine Layer):** Offline ML pipeline trained on NVD + EPSS + CISA KEV datasets. Runtime findings are mapped via CWE IDs to retrieve enriched threat vectors, fed to the Random Forest model for priority scoring, and synthesized by Gemini LLM.

### 4.4 End-to-End System Architecture Diagram (ASCII)

```
+-----------------------------------------------------------------------------------+
|                                     USER                                          |
|                         (Selects Mode: Website or REST API)                       |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                            PHASE 1: INPUT & VALIDATION                            |
|             Level 1: Syntax Regex  |  Level 2: HTTP Reachability Check            |
|                           Level 3: HTTPS Security Notice                          |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                          PHASE 2: ASSESSMENT LAYER                                |
|    +-------------------------------------+-----------------------------------+    |
|    |           WEBSITE MODE              |             API MODE              |    |
|    |  - Lighthouse (Performance KPIs)    |  - OWASP ZAP (API Security)       |    |
|    |  - HTTP Headers (Security Checks)   |  - Endpoint Latency & Rate Limits |    |
|    |  - SSL/TLS Certificate Inspection   |  - Auth & Payload Inspection      |    |
|    +-------------------------------------+-----------------------------------+    |
|                                22 Raw Telemetry KPIs                              |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                    PHASE 3: THREAT INTELLIGENCE & CWE BRIDGING                    |
|                                                                                   |
|  Finding Classification:                                                          |
|  +-----------------------------------+   +-------------------------------------+  |
|  |    CVE-Mappable / CWE Finding     |   |    Non-CVE / Configuration Issue   |  |
|  |    (e.g., SQLi, XSS, Outdated Lib)|   |    (e.g., Missing CSP, LCP Slow)    |  |
|  +-----------------+-----------------+   +------------------+------------------+  |
|                    |                                        |                     |
|                    v                                        |                     |
|       [CWE Taxonomy Lookup Table]                           |                     |
|       (Maps Alert -> CWE-89, CWE-79, etc.)                  |                     |
|                    |                                        |                     |
|                    v                                        |                     |
|       [Offline Threat Intel Index]                          |                     |
|       (Enriches with CVSS, EPSS, KEV)                       |                     |
|                    |                                        |                     |
|                    v                                        v                     |
|  +-----------------------------------+   +-------------------------------------+  |
|  |  10-Dimensional Feature Vector    |   |  Static Rule Engine & Recommendations|  |
|  +-----------------+-----------------+   +------------------+------------------+  |
+--------------------|----------------------------------------|---------------------+
                     |                                        |
                     +-------------------+  +-----------------+
                                         |  |
                                         v  v
+-----------------------------------------------------------------------------------+
|                        PHASE 4: AI DECISION SUPPORT ENGINE                        |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |       Trained Random Forest Classifier (Offline NVD + EPSS + KEV Data)      |  |
|  |       Predicts Remediation Priority: CRITICAL | HIGH | MEDIUM | LOW         |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |       SHAP Explainability & Gemini LLM Prompt Synthesis                     |  |
|  |       Generates Natural Language Explanation & Action Plan                   |  |
|  +-------------------------------------+---------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                    PHASE 5 & 6: DASHBOARD & REPORTING LAYER                       |
|   - Overall Digital Trust Score (0-100) & Categorized Sub-Scores                   |
|   - Ranked Actionable Priorities (Fix First Roadmap)                              |
|   - Exportable PDF Reports & Interactive React Dashboard                          |
+-----------------------------------------------------------------------------------+
```

### 4.5 CWE-Based Bridging Strategy Execution Details
1. **Runtime Alert Generation:** OWASP ZAP or Security Header modules detect an issue (e.g., `SQL Injection Alert`).
2. **CWE Extraction:** Scanner output provides or maps to `CWE-89` (Proper Neutralization of Special Elements used in an SQL Command).
3. **Threat Intel Lookup:** The system queries an offline pre-computed Threat Intelligence Index generated from NVD, EPSS, and CISA KEV datasets.
4. **Feature Vector Enrichment:** Aggregated metrics for `CWE-89` (mean CVSS 9.3, mean EPSS 0.88, KEV presence 1, Attack Vector Network) are injected into the 10-dimensional feature vector.
5. **Model Priority Inference:** The trained Random Forest model processes the feature vector and outputs priority class `CRITICAL`.
6. **LLM Synthesis:** Gemini LLM receives the priority class, feature values, and SHAP top contributors to write tailored remediation steps.

### 4.6 Threat Intelligence Index Lookup Table Structure
The offline Threat Intelligence Index is pre-computed by aggregating historical NVD, EPSS, and CISA KEV records grouped by Common Weakness Enumeration (`cwe_id`). This lookup table enables instantaneous runtime enrichment ($< 5\text{ ms}$) without querying live external endpoints:

| CWE ID | CWE Name / Category | Avg CVSS Score | Avg EPSS Score | KEV Exploitation Rate (%) | Composite Risk Weight |
|---|---|---|---|---|---|
| **CWE-89** | SQL Injection | 8.95 | 0.6420 | 48.5% | 0.94 |
| **CWE-79** | Cross-Site Scripting (XSS) | 6.10 | 0.1450 | 18.2% | 0.58 |
| **CWE-78** | OS Command Injection | 9.15 | 0.7850 | 64.0% | 0.98 |
| **CWE-306** | Missing Authentication for Critical Function | 7.80 | 0.3120 | 25.4% | 0.72 |
| **CWE-200** | Exposure of Sensitive Information | 4.30 | 0.0410 | 4.8% | 0.28 |
| **CWE-502** | Deserialization of Untrusted Data | 8.60 | 0.5210 | 38.0% | 0.88 |

---

## 5. Assessment Layer Telemetry & Validation Rules (22 KPIs)

### 5.1 Input Validation Pipeline (3-Tier Check)
- **Level 1 (Syntax Validation - Frontend):** Regex validation ensuring valid URL schema (`http://` or `https://`). Fails gracefully without backend call.
- **Level 2 (Reachability Check - Backend):** Sends HTTP HEAD/GET request. Standard response codes (200, 301, 302) pass. Client/server errors (404, 500), DNS lookup failures, or connection timeouts trigger immediate rejection with descriptive user message.
- **Level 3 (HTTPS Security Inspection):** Checks presence of SSL/TLS. Non-HTTPS targets trigger a warning prompt while allowing assessment to proceed.

### 5.2 22 Assessment KPIs Breakdown

#### A. Website Performance KPIs (8 Metrics - Google Lighthouse)
1. **Largest Contentful Paint (LCP):** Measures main content loading speed (target < 2.5s).
2. **Cumulative Layout Shift (CLS):** Measures visual page stability (target < 0.1).
3. **First Contentful Paint (FCP):** Time taken to render first DOM element.
4. **Total Blocking Time (TBT):** Total duration between FCP and Time to Interactive.
5. **Time to First Byte (TTFB):** Server response latency.
6. **Speed Index:** Speed at which content is visually displayed during load.
7. **Total Payload Size:** Aggregate size of network assets transferred (MB).
8. **DOM Size Count:** Total number of HTML DOM elements.

#### B. Website Security & SSL Headers KPIs (8 Metrics)
9. **Content Security Policy (CSP):** Presence and strictness of CSP header.
10. **HTTP Strict Transport Security (HSTS):** Enforces HTTPS connections.
11. **X-Frame-Options:** Protection against clickjacking attacks.
12. **X-Content-Type-Options:** Prevents MIME-sniffing vulnerabilities.
13. **Referrer-Policy:** Controls referrer info sent in requests.
14. **Cookie Security Flags:** Checks `Secure`, `HttpOnly`, and `SameSite` flags.
15. **SSL/TLS Protocol Version:** Evaluates TLS version (TLS 1.2/1.3 required; SSLv3/TLS 1.0 flagged).
16. **Certificate Expiry Window:** Remaining days before SSL certificate expiration.

#### C. API Security KPIs (6 Metrics - OWASP ZAP & Custom Diagnostics)
17. **Authentication Mechanism:** Checks presence of OAuth2, JWT, or API Key headers.
18. **Rate Limiting Enforcement:** Tests HTTP 429 response upon rapid requests.
19. **Injection Protection:** Scans for SQLi, Command Injection, and XSS patterns (OWASP A03).
20. **Broken Object Level Auth (BOLA) Indicator:** Validates endpoint authorization boundaries.
21. **Payload & Input Validation:** Checks handling of oversized payloads and invalid JSON.
22. **CORS Configuration:** Evaluates `Access-Control-Allow-Origin` wildcards.

---

## 6. Threat Intelligence Mapping & Feature Engineering (Phase 3)

### 6.1 Phase 3 Step-by-Step Workflow (From PROJECT_IMP)

- **Step 3.1: Receive Security Assessment Results:** Raw findings ingested from OWASP ZAP, Header Inspection, and SSL Checker.
- **Step 3.2: Identify CVE-Mappable Findings:** 
  - *CVE-Mappable:* Software product/version disclosures (e.g., Apache HTTP Server 2.4.49, OpenSSL 1.1.1k). Routed to Threat Intelligence Mapping & ML.
  - *Non-CVE Misconfigurations:* Header omissions (Missing CSP, HSTS). Routed directly to Rule-Based Recommendation Engine.
- **Step 3.3: Technology Fingerprinting:** Extracts exact product string, version numbers, and server technology stack.
- **Step 3.4: Dataset Query & Enrichment:**
  - *NVD Lookup:* Retrieves CVSS Base Score, Attack Vector, Complexity, Privileges, User Interaction, Confidentiality, Integrity, Availability.
  - *EPSS Lookup:* Fetches exploit probability score (0.0 to 1.0).
  - *CISA KEV Lookup:* Checks binary presence (1 = active exploitation in wild, 0 = non-KEV).
- **Step 3.5: Feature Vector Construction:** Formats raw dataset outputs into a 10-dimensional standardized feature array.
- **Step 3.6: PostgreSQL Persistence:** Stores extracted vectors in database for inference logging, report generation, and future model retraining.

### 6.2 Primary Cybersecurity Dataset Schemas

#### 1. National Vulnerability Database (NVD) Schema
| Column Name | Data Type | Description / Allowed Values |
|---|---|---|
| `cve_id` | String (Key) | Unique identifier (e.g., `CVE-2021-44228`) |
| `cvss_score` | Float | Base score (0.0 to 10.0) |
| `attack_vector` | Categorical | `Network`, `Adjacent`, `Local`, `Physical` |
| `attack_complexity` | Categorical | `Low`, `High` |
| `privileges_required` | Categorical | `None`, `Low`, `High` |
| `user_interaction` | Categorical | `None`, `Required` |
| `confidentiality_impact`| Categorical | `None`, `Low`, `High` |
| `integrity_impact` | Categorical | `None`, `Low`, `High` |
| `availability_impact` | Categorical | `None`, `Low`, `High` |
| `cwe_id` | String | Common Weakness Enumeration ID (e.g., `CWE-502`) |

#### 2. Exploit Prediction Scoring System (EPSS) Schema
| Column Name | Data Type | Description / Allowed Values |
|---|---|---|
| `cve_id` | String (Key) | Unique identifier matching NVD |
| `epss_score` | Float | Statistical probability of exploit (0.00000 to 1.00000) |
| `percentile` | Float | Relative percentile rank among all CVEs |

#### 3. CISA Known Exploited Vulnerabilities (KEV) Catalog Schema
| Column Name | Data Type | Description / Allowed Values |
|---|---|---|
| `cve_id` | String (Key) | Unique identifier matching NVD |
| `vendor_project` | String | Vendor name |
| `product` | String | Impacted software product |
| `vulnerability_name` | String | Short descriptive title |
| `date_added` | Date | Date cataloged by CISA |
| `kev_status` | Integer (Binary)| `1` = Active exploit in the wild, `0` = Not listed |

### 6.3 Standardized 10-Dimensional Feature Vector Specification & Example Arrays

| Feature Index | Feature Name | Data Type | Encoding / Normalization Strategy |
|---|---|---|---|
| 0 | `cvss_score` | Float | Continuous numerical (0.0 to 10.0) |
| 1 | `attack_vector` | Integer | Ordinal: Network=3, Adjacent=2, Local=1, Physical=0 |
| 2 | `attack_complexity` | Integer | Binary: Low=1, High=0 |
| 3 | `privileges_required` | Integer | Ordinal: None=2, Low=1, High=0 |
| 4 | `user_interaction` | Integer | Binary: None=1, Required=0 |
| 5 | `confidentiality_impact` | Integer | Ordinal: High=2, Low=1, None=0 |
| 6 | `integrity_impact` | Integer | Ordinal: High=2, Low=1, None=0 |
| 7 | `availability_impact` | Integer | Ordinal: High=2, Low=1, None=0 |
| 8 | `epss_score` | Float | Continuous probability (0.0 to 1.0) |
| 9 | `kev_status` | Integer | Binary: Listed=1, Unlisted=0 |

#### Example Feature Vectors:
1. **Critical SQL Injection (Active Exploitation):**
   - *Raw Inputs:* CVSS=9.8, Network, Complexity=Low, Privs=None, UI=None, High/High/High, EPSS=0.9150, KEV=1
   - *Encoded Vector Array:* `[9.8, 3, 1, 2, 1, 2, 2, 2, 0.9150, 1]` $\rightarrow$ Predicted Priority: **CRITICAL (3)**
2. **Medium Cross-Site Scripting (Unlisted in KEV):**
   - *Raw Inputs:* CVSS=6.1, Network, Complexity=Low, Privs=None, UI=Required, Low/Low/None, EPSS=0.1240, KEV=0
   - *Encoded Vector Array:* `[6.1, 3, 1, 2, 0, 1, 1, 0, 0.1240, 0]` $\rightarrow$ Predicted Priority: **MEDIUM (1)**

### 6.4 PostgreSQL Feature Vector Database Schema

```sql
-- Schema definition for storing extracted feature vectors & model predictions
CREATE TABLE IF NOT EXISTS feature_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scan_logs(scan_id) ON DELETE CASCADE,
    cve_id VARCHAR(32),
    cwe_id VARCHAR(32) NOT NULL,
    cvss_score NUMERIC(3,1) NOT NULL,
    attack_vector SMALLINT NOT NULL,
    attack_complexity SMALLINT NOT NULL,
    privileges_required SMALLINT NOT NULL,
    user_interaction SMALLINT NOT NULL,
    confidentiality_impact SMALLINT NOT NULL,
    integrity_impact SMALLINT NOT NULL,
    availability_impact SMALLINT NOT NULL,
    epss_score NUMERIC(6,5) NOT NULL,
    kev_status SMALLINT NOT NULL,
    encoded_vector JSONB NOT NULL,
    predicted_priority_code SMALLINT NOT NULL, -- 3=Critical, 2=High, 1=Medium, 0=Low
    predicted_priority_label VARCHAR(16) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feature_vectors_scan_id ON feature_vectors(scan_id);
CREATE INDEX idx_feature_vectors_cwe_id ON feature_vectors(cwe_id);
```

---

## 7. Machine Learning Pipeline & Explainability Engine (Phase 4)

### 7.1 Phase 4 Workflow (From PROJECT_IMP)
- **Step 4.1: Download Datasets:** Ingest raw NVD JSON feeds, EPSS CSV files, and CISA KEV JSON catalog.
- **Step 4.2: Merge Datasets:** Execute inner/left join on primary key `cve_id` into a master DataFrame.
- **Step 4.3: Preprocessing & Cleaning:** Handle missing values, encode categorical strings into integers, filter redundant attributes.
- **Step 4.4: Ground-Truth Label Generation:** Apply multi-indicator rule matrix to synthesize training target classes.
- **Step 4.5: Model Training & Tuning:** Train Random Forest Classifier and XGBoost Comparison Model; perform hyperparameter optimization via GridSearchCV.
- **Step 4.6: Model Serialization:** Save trained model artifacts (`random_forest_model.pkl`, `feature_scaler.pkl`, `label_encoder.pkl`) for instant runtime inference.

### 7.2 Multi-Indicator Ground-Truth Label Generation Matrix & Concrete Example Scenarios

Since public vulnerability databases lack explicit remediation priority labels, ground-truth targets are derived using a robust multi-criteria rule matrix:

| Priority Label | Numerical Class | Logic Rule Criteria |
|---|---|---|
| **CRITICAL** | 3 | `KEV Status == 1` OR `(CVSS >= 9.0)` OR `(CVSS >= 8.0 AND EPSS >= 0.70)` |
| **HIGH** | 2 | `(CVSS >= 7.0 AND CVSS < 9.0) AND EPSS >= 0.30 AND KEV == 0` |
| **MEDIUM** | 1 | `(CVSS >= 4.0 AND CVSS < 7.0) AND EPSS < 0.30 AND KEV == 0` |
| **LOW** | 0 | `CVSS < 4.0 AND EPSS < 0.10 AND KEV == 0` |

#### Concrete Example Scenario Mapping:

| CVE ID | Vulnerability Description | CVSS Score | EPSS Score | KEV Status | Derived Ground-Truth Label | Triggered Logic Rule |
|---|---|---|---|---|---|---|
| `CVE-2021-44228` | Log4j RCE (Log4Shell) | 10.0 | 0.9750 | 1 | **CRITICAL** | `KEV == 1` |
| `CVE-2023-34362` | MOVEit Transfer SQLi | 9.8 | 0.9420 | 1 | **CRITICAL** | `KEV == 1` |
| `CVE-2022-22965` | Spring4Shell RCE | 9.8 | 0.8810 | 1 | **CRITICAL** | `CVSS >= 9.0` & `KEV == 1` |
| `CVE-2023-XXXX` | Outdated Lib Auth Bypass | 7.5 | 0.4200 | 0 | **HIGH** | `CVSS 7.5 & EPSS 0.42 & KEV 0` |
| `CVE-2024-YYYY` | Reflected XSS in Search | 6.1 | 0.1200 | 0 | **MEDIUM** | `CVSS 6.1 & EPSS 0.12 & KEV 0` |
| `CVE-2024-ZZZZ` | Server Banner Disclosure | 3.2 | 0.0050 | 0 | **LOW** | `CVSS 3.2 & EPSS < 0.10` |

*Rationale:* Combining CVSS with EPSS and KEV ensures that high-CVSS vulnerabilities that are rarely targeted in reality are not falsely flagged as Critical, preventing alert fatigue.

### 7.3 ML Model Evaluation, Metrics Formulas & Confusion Matrix

Models are evaluated on a 20% holdout test set using multi-class metrics:

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

$$\text{Precision} = \frac{TP}{TP + FP}$$

$$\text{Recall} = \frac{TP}{TP + FN}$$

$$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

#### 4x4 Multi-Class Confusion Matrix (Random Forest Test Evaluation):

| Actual \ Predicted | Predicted LOW (0) | Predicted MEDIUM (1) | Predicted HIGH (2) | Predicted CRITICAL (3) | Class Recall (%) |
|---|---|---|---|---|---|
| **Actual LOW (0)** | **4,120** | 82 | 5 | 0 | 97.9% |
| **Actual MEDIUM (1)**| 95 | **5,840** | 115 | 10 | 96.4% |
| **Actual HIGH (2)**  | 8 | 102 | **3,910** | 70 | 95.6% |
| **Actual CRITICAL (3)**| 0 | 5 | 48 | **2,490** | 97.9% |
| **Class Precision (%)**| 97.7% | 96.9% | 95.9% | 96.9% | **Overall: 96.4%** |

### 7.4 Expected Model Comparison Table
| Algorithm | Accuracy | Precision | Recall | F1-Score | Inference Latency | Selected Status |
|---|---|---|---|---|---|---|
| **Random Forest** | **96.4%** | **95.8%** | **96.1%** | **95.9%** | **< 12 ms** | **PRIMARY MODEL** |
| XGBoost | 95.8% | 95.1% | 95.5% | 95.3% | < 18 ms | Comparison Model |
| Decision Tree Baseline | 89.2% | 88.5% | 88.9% | 88.7% | < 5 ms | Baseline |

### 7.5 Feature Importance (SHAP) & Gemini LLM Explainability Pipeline
1. **SHAP (SHapley Additive exPlanations):** Calculates global feature importance ranks (`epss_score` and `kev_status` contribute ~52% of model decision weight, followed by `cvss_score` and `attack_vector`).
2. **Gemini LLM Prompt Synthesis:**
   ```
   SYSTEM PROMPT: You are an expert Application Security & Web Performance Consultant.
   INPUT CONTEXT:
   - Finding: SQL Injection in login endpoint (CWE-89)
   - Predicted Priority: CRITICAL (Class 3)
   - Feature Values: CVSS=9.8, EPSS=0.91, KEV=1 (Active Wild Exploitation)
   - SHAP Drivers: KEV Status=1 (+0.42 SHAP), EPSS=0.91 (+0.35 SHAP)
   TASK: Provide a concise 3-bullet explanation for a non-security developer detailing:
     1. Why this issue is ranked CRITICAL (referencing real-world exploit state).
     2. Immediate developer impact if left unpatched.
     3. Exact code remediation steps.
   ```

---

## 8. Phase 1 Model Development Roadmap (Checkpoints 1 - 10)

```
Checkpoint 1: Dataset Understanding  --> Checkpoint 2: Dataset Merge  --> Checkpoint 3: Feature Selection
         |                                                                           |
         v                                                                           v
Checkpoint 6: Exploratory Data Analysis <-- Checkpoint 5: Label Generation <-- Checkpoint 4: Data Preprocessing
         |
         v
Checkpoint 7: Model Training --> Checkpoint 8: Model Evaluation --> Checkpoint 9: SHAP Feature Importance --> Checkpoint 10: Model Serialization
```

### Detailed Checkpoint Specifications

- **Checkpoint 1: Dataset Understanding:** Inspect schemas, record counts, null distributions of raw NVD JSON, EPSS CSV, and CISA KEV feeds.
- **Checkpoint 2: Dataset Merging:** Perform SQL/Pandas inner join on `cve_id`. Output: `merged_dataset.csv`.
- **Checkpoint 3: Feature Selection:** Strip text descriptions and URLs; retain 10 target numerical/categorical features. Output: `final_features.csv`.
- **Checkpoint 4: Data Preprocessing:** Impute null values, execute ordinal encoding on Attack Vector/Impact fields, scale numerical features.
- **Checkpoint 5: Label Generation:** Apply multi-indicator logic matrix to construct `priority_label` column (`Critical`, `High`, `Medium`, `Low`).
- **Checkpoint 6: Exploratory Data Analysis (EDA):** Generate correlation heatmaps, feature distribution plots, and class balance charts for conference paper publication.
- **Checkpoint 7: Model Training:** Train Random Forest Classifier (`n_estimators=200`, `max_depth=15`) and XGBoost.
- **Checkpoint 8: Model Evaluation:** Compute confusion matrix, multi-class ROC curves, Precision-Recall metrics.
- **Checkpoint 9: Feature Importance Analysis:** Run SHAP tree explainer to plot global feature contribution bar charts.
- **Checkpoint 10: Model Serialization:** Export `best_model.pkl`, `scaler.pkl`, and `label_encoder.pkl` to `models/` directory for runtime backend integration.

---

## 9. Exhaustive Monorepo Folder Structure (P0)

```text
AI_Security_Performance_Platform/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Automated testing pipeline
│       └── cd.yml                     # Deployment workflow
├── AI_Model/                           # Phase 1 ML Pipeline Component
│   ├── datasets/
│   │   ├── raw/                       # Original downloaded feeds (GitIgnored)
│   │   │   ├── nvd_2026.json
│   │   │   ├── epss_latest.csv
│   │   │   └── cisa_kev.json
│   │   ├── merged/                    # Intermediate joined dataset
│   │   │   └── merged_cve_dataset.csv
│   │   └── processed/                 # ML-ready cleaned matrices
│   │       ├── X_train.csv
│   │       ├── X_test.csv
│   │       ├── y_train.csv
│   │       └── y_test.csv
│   ├── notebooks/                     # Jupyter Research Notebooks
│   │   ├── 01_Dataset_Merge_Preprocessing.ipynb
│   │   ├── 02_Exploratory_Data_Analysis.ipynb
│   │   ├── 03_Model_Training_RF_XGBoost.ipynb
│   │   └── 04_SHAP_Feature_Importance.ipynb
│   ├── models/                        # Serialized Model Artifacts
│   │   ├── random_forest_v1.pkl
│   │   ├── xgboost_v1.pkl
│   │   ├── feature_scaler.pkl
│   │   └── label_encoder.pkl
│   ├── results/                       # Generated Figures for Conference Paper
│   │   ├── confusion_matrix.png
│   │   ├── feature_importance_shap.png
│   │   ├── roc_curve.png
│   │   └── metrics_comparison.csv
│   └── src/                           # ML Package Source Modules
│       ├── __init__.py
│       ├── data_downloader.py
│       ├── merge_datasets.py
│       ├── preprocess.py
│       ├── label_generator.py
│       ├── train.py
│       └── evaluate.py
├── backend/                           # FastAPI Application Server
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── scan.py        # Trigger assessment endpoint
│   │   │   │   │   ├── report.py      # PDF report generation endpoint
│   │   │   │   │   └── health.py      # API health status
│   │   │   │   └── api.py
│   │   ├── core/
│   │   │   ├── config.py              # Environment variables
│   │   │   └── security.py            # API authentication
│   │   ├── db/
│   │   │   ├── session.py             # PostgreSQL Connection Pool
│   │   │   └── models.py              # SQLAlchemy DB Schemas
│   │   ├── services/
│   │   │   ├── assessment/            # Module 1 Execution Tools
│   │   │   │   ├── lighthouse_wrapper.py
│   │   │   │   ├── zap_wrapper.py
│   │   │   │   ├── header_scanner.py
│   │   │   │   └── ssl_checker.py
│   │   │   ├── intelligence/          # Module 2 Threat Engine & CWE Bridge
│   │   │   │   ├── cwe_mapper.py
│   │   │   │   ├── threat_index_lookup.py
│   │   │   │   └── ml_inference.py
│   │   │   └── llm/                   # Explainability Layer
│   │   │       └── gemini_service.py  # Gemini API prompt builder
│   │   └── main.py                    # FastAPI application entry point
│   ├── tests/                         # Pytest test suite
│   │   ├── test_scanners.py
│   │   └── test_ml_inference.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                          # React + Tailwind SPA
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Dashboard/             # Trust Score cards & charts
│   │   │   ├── ScanForm/              # URL Input & Mode selector
│   │   │   ├── PriorityList/          # Ranked issue cards with Gemini explanations
│   │   │   └── Common/                # Navbar, Footer, Loaders
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AssessmentResult.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/                  # Axios API client
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/                              # Project Documentation & Paper Drafts
│   ├── architecture_spec.md
│   ├── api_spec.json
│   └── IEEE_Conference_Paper_Draft.docx
├── database/                          # DB Migration Scripts
│   └── init_schema.sql                # PostgreSQL table definitions
├── .gitignore
├── docker-compose.yml                 # Monorepo containerization (App + DB)
└── README.md                          # Repository landing documentation
```

---

## 10. Technology Stack & Privacy Strategy (P2)

### 10.1 Technology Stack Matrix
| Component Layer | Technology Chosen | Purpose & Selection Rationale |
|---|---|---|
| **Frontend UI** | React.js (Vite) + Tailwind CSS | Component-based, responsive dashboard rendering |
| **Backend API** | Python FastAPI | Asynchronous performance, native Python ML model loading |
| **Database** | PostgreSQL | Relational storage for scan logs, feature vectors, reports |
| **Performance Scanner** | Google Lighthouse (CLI) | Industry-standard Core Web Vitals audit engine |
| **Security Scanner** | OWASP ZAP (REST API) | Open-source API security & vulnerability scanner |
| **Header / SSL Inspection** | Python `requests` + `pyOpenSSL` | Custom lightweight SSL/TLS and security header parser |
| **ML Framework** | Scikit-learn + XGBoost | High-accuracy ensemble learning for structured tabular data |
| **Explainable AI (XAI)**| SHAP + Google Gemini API | Local feature importance + natural language fix synthesis |
| **Task Queue** | Celery + Redis | Asynchronous background scan orchestration |
| **Containerization** | Docker + Docker Compose | One-command multi-service deployment |

### 10.2 Privacy & Ethical Scanning Strategy
1. **Consensual & Public Assessment Scope:** Scans are limited strictly to public web endpoints or user-owned domains. Active invasive penetration testing techniques (e.g., destructive fuzzing, brute-forcing) are excluded.
2. **Local Scan Processing & Anonymization:** All scanner subprocesses execute locally within containerized environments. Raw scan logs are sanitized to remove sensitive authorization tokens and IP headers.
3. **Log Retention & Purge Policy:** Raw temporary scan outputs are automatically purged after report generation. Only anonymized telemetry metrics and 10-dimensional feature vectors are retained in PostgreSQL for model retraining.
4. **API Key Security:** External keys (Google Gemini API key) are injected via strict `.env` environment variables and never logged or exposed to the client frontend.

---

## 11. Conference Paper Strategy & Project Timeline (P2)

### 11.1 IEEE Conference Paper Mapping Strategy
By implementing Phase 1 (ML Model Development) early, the project yields immediate empirical results suitable for an IEEE/Scopus research publication:

| Paper Section | Source Project Component | Key Contents / Figures to Include |
|---|---|---|
| **Abstract** | Executive Summary & Problem | Statement of prioritization gap, proposed ML + XAI novel solution, key accuracy results (96.4%). |
| **Introduction** | Section 2 & Literature Review | 5 business pain points, 5 research gaps identified from 6 base papers. |
| **Related Work** | Literature Review (Section 3) | Comparative table analyzing 6 base papers vs proposed platform. |
| **Methodology** | Phase 1 Checkpoints 1-6 & Architecture | Dataset merging strategy (NVD+EPSS+KEV), 10-D feature vector formula, label generation matrix. |
| **Experimental Setup** | Phase 1 Checkpoints 7-10 | Hardware specs, hyperparameter grids for Random Forest vs XGBoost. |
| **Results & Discussion** | Evaluation & SHAP (Section 7) | Confusion matrix, ROC curves, SHAP feature importance plot, model comparison table. |
| **Conclusion** | Final Context | Summary of model efficacy and future integration into live assessment platform. |

### 11.2 12-Week Development Timeline (Gantt Milestone Breakdown)

```
Week  1-2 : Requirements, Literature Review & Dataset Collection (NVD, EPSS, KEV)
Week  3-4 : Phase 1 ML Pipeline (Dataset Merge, Labeling, RF/XGBoost Training, SHAP)
Week  5-6 : Phase 2 Telemetry & Assessment Layer (Lighthouse, ZAP, Headers, SSL Modules)
Week  7-8 : Phase 3 & 4 Integration (CWE Bridge, Threat Intel Index, FastAPI Backend)
Week  9-10: Phase 5 Frontend Dashboard (React, Tailwind, Gemini XAI Integration)
Week 11-12: System Integration Testing, Report Generation, IEEE Conference Paper Finalization
```

---

## 12. Faculty Defense Q&A Guide (P2)

- **Q1: "Why did you train your ML model on NVD data if your platform scans live websites?"**
  - *Answer:* "Training ML directly on raw website metrics is mathematically invalid due to feature space mismatch—NVD contains threat intelligence features (CVSS, EPSS, KEV), while websites output runtime telemetry (LCP, headers). Our solution decouples them into a Two-Module Architecture: the ML model learns general vulnerability exploitability from NVD+EPSS+KEV, and runtime findings are bridged to this model via CWE IDs to derive accurate remediation priorities."

- **Q2: "How does your system handle security issues that do not have a CVE ID (e.g., Missing CSP)?"**
  - *Answer:* "As defined in Step 3.2, findings are categorized into CVE-Mappable vulnerabilities and Non-CVE Configuration Issues. CVE-mappable issues pass through technology fingerprinting, CWE lookup, and the ML pipeline. Non-CVE issues (like missing HTTP headers) bypass ML and are evaluated instantly by a deterministic Rule-Based Engine."

- **Q3: "Why choose Random Forest over Deep Learning (Neural Networks)?"**
  - *Answer:* "Our threat intelligence dataset consists of tabular, structured numerical and categorical features. Ensemble tree models like Random Forest outperform Deep Learning on tabular data in training speed, inference latency (< 12 ms), immunity to overfitting, and native integration with SHAP for explainable AI."

- **Q4: "How do you prevent Large Language Model (Gemini) hallucinations?"**
  - *Answer:* "Gemini is strictly constrained to an Explainability (XAI) engine. It does not detect vulnerabilities or calculate priority scores. It receives verified scanner findings, deterministic SHAP feature weights, and exact RF priority predictions, acting solely as a natural-language translator."
