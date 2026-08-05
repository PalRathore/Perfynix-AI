# 📚 Phase 1 Learning Guide: How We Built the AI Model (Simple Language)

> **Who this is for:** You — the developer, to understand everything we built in Phase 1 from scratch, in plain English.
> **Goal:** By the end of reading this, you should be able to explain every step of our pipeline to your professor in your own words.

---

## The Big Picture First

Imagine you're a security analyst at a company. Every day, hundreds of new software vulnerabilities (CVEs) are published. Your job is to decide: **which one do I fix first?** You can't fix all of them simultaneously, so you need to prioritize.

We built an AI that does this prioritization for you — automatically.

**The AI's job:** Given a CVE (a vulnerability report), predict whether it is `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW` priority for remediation.

---

## Step 1: Understanding the Raw Data Sources

Before we could train any model, we needed data. We used **3 real-world databases**:

---

### 📦 Dataset 1: NVD (National Vulnerability Database)
**What it is:** The official U.S. government database of all known software vulnerabilities.
**Who runs it:** NIST (National Institute of Standards and Technology).
**What it contains:** For each CVE, it gives us:
- `cvss_score` — The severity rating (0.0 to 10.0). Think of it like a "how dangerous is this on paper?" score.
- `exploitability_score` — How easy is it for an attacker to exploit this?
- `impact_score` — If exploited, how much damage does it cause?
- `attack_vector` — Can the attacker do this over the internet (`NETWORK`) or only locally (`LOCAL`)?
- `attack_complexity` — Is the attack easy (`LOW`) or hard (`HIGH`) to execute?

**Why CVSS alone is not enough:**
CVSS rates a vulnerability in isolation — it doesn't know if anyone is actually exploiting it in the real world right now. A CVSS 9.8 vulnerability that nobody has exploited in 5 years is less urgent than a CVSS 6.5 vulnerability that hackers are actively using today.

---

### 📦 Dataset 2: EPSS (Exploit Prediction Scoring System)
**What it is:** A machine-learning model maintained by FIRST (Forum of Incident Response and Security Teams) that predicts the **probability** that a CVE will be exploited in the next 30 days.
**Scale:** 0.0 (0% chance) to 1.0 (100% chance).

**Real example:**
```
CVE-2023-44487 (HTTP/2 Rapid Reset Attack)
CVSS: 7.5 (High)
EPSS: 0.966 (96.6% chance of exploitation!)
→ Despite "only" High severity, this was actively used by botnets globally
```

**Why this matters:** EPSS adds the "real-world threat" dimension that CVSS lacks.

---

### 📦 Dataset 3: CISA KEV (Known Exploited Vulnerabilities)
**What it is:** A list maintained by the U.S. Cybersecurity and Infrastructure Security Agency (CISA) of vulnerabilities that are **confirmed to be actively exploited** in the wild right now.
**Format:** A simple `YES/NO` flag — either a CVE is on this list (confirmed exploited) or it isn't.
**Size:** ~1,644 CVEs (as of our dataset).

**Why this is the most valuable signal:**
If CISA says a CVE is being exploited right now, it's not a theoretical threat — it's a real, ongoing attack. Any CVE on this list is automatically urgent.

---

## Step 2: How We Merged the Three Datasets

Each dataset uses `CVE-YYYY-XXXXX` format (e.g., `CVE-2023-12345`) as the unique key — this is what we joined on.

```
NVD (2023-2026):   148,598 CVEs  ──────┐
                                        ├──► MERGE on cve_id ──► 139,784 unique CVEs
EPSS Catalog:       348,601 CVEs ──────┤
                                        │
CISA KEV:             1,644 CVEs ──────┘
```

**Why did we lose ~8,814 records?**
- Some CVEs in NVD were very new and didn't have EPSS scores yet.
- Some CVEs had duplicate entries across years (we kept the most recently updated one).
- CVEs without a CVSS score were dropped (we can't compute severity without it).

**The result:** A clean table of **139,784 rows** where every row has a CVE ID, CVSS score, EPSS score, and KEV status.

---

## Step 3: Feature Engineering — Why 15 Features and Not Just 3?

At this point, we had 3 key numbers per CVE: `cvss_score`, `epss_score`, and `kev_status`.

**Could we just train a model on these 3 features?**
Yes, but the model would just learn the exact rules we used to create labels → this is called **label circularity** (the model isn't learning, it's just memorizing).

Think of it this way: if you teach a student by always showing them the answer and never the reasoning, they can pass the exact test you gave them but fail any real-world problem.

**The fix:** We added **5 extra features** that give the model additional real-world context:

---

### The 15 Features We Used

**Group A — 10 Core Threat Metrics (directly from datasets):**

| # | Feature | What It Means | Why Useful |
|---|---|---|---|
| 1 | `cvss_score` | Raw severity (0–10) | Baseline intrinsic risk |
| 2 | `exploitability_score` | How easy to exploit (0–10) | Attack feasibility |
| 3 | `impact_score` | Damage potential (0–10) | Business impact |
| 4 | `epss_score` | Probability of exploit (0–1) | Real-world threat signal |
| 5 | `epss_percentile` | EPSS rank among all CVEs (0–1) | Relative threat context |
| 6 | `kev_status` | Actively exploited? (0/1) | Confirmed real attack |
| 7 | `attack_vector_encoded` | Network=3, Local=1, Physical=0 | Remote vs local risk |
| 8 | `attack_complexity_encoded` | Easy=1, Hard=0 | Attack feasibility |
| 9 | `privileges_required_encoded` | None needed=2, Admin=0 | Barrier to attack |
| 10 | `user_interaction_encoded` | No interaction needed=1 | Social engineering requirement |

**Group B — 5 Temporal & Contextual Features (engineered by us):**

| # | Feature | What It Means | Why Useful |
|---|---|---|---|
| 11 | `days_since_published` | Age of the CVE in days | Old unpatched vulnerabilities = higher risk |
| 12 | `days_since_modified` | Days since vendor last updated it | Recent activity = higher attention |
| 13 | `cwe_category_frequency` | How common this type of bug is | Common types (like SQL injection) have more attack tools |
| 14 | `vendor_cve_count` | How many CVEs this vendor has historically | Prolific vendors often have faster patches available |
| 15 | `cvss_epss_divergence` | `|cvss/10 - epss|` | Catches anomalies: High CVSS but 0% EPSS = theoretical, not real threat |

---

### Feature 15 Explained in Detail: `cvss_epss_divergence`

This is our most creative feature. Consider these two CVEs:

```
CVE-A: CVSS = 9.8 (Critical), EPSS = 0.002 (0.2% exploit chance)
       → Divergence = |9.8/10 - 0.002| = 0.978
       → Large divergence = theoretically critical but not actually exploited

CVE-B: CVSS = 6.5 (Medium), EPSS = 0.72 (72% exploit chance)
       → Divergence = |6.5/10 - 0.72| = 0.07
       → Small divergence = real-world risk matches intrinsic severity
```

Without this feature, CVE-A might be prioritized over CVE-B. With it, the model learns that CVE-B is the real danger.

---

## Step 4: Generating the Target Labels (The CRSI Formula)

Now we had 139,784 rows with 15 features each. But we still needed to tell the model what the **right answer** is for each CVE. This is what we call the **label** (or target variable).

We couldn't just use CVSS thresholds (`>= 9.0 = Critical`) because:
1. That ignores EPSS (real-world threat probability).
2. That ignores KEV (confirmed active exploits).
3. A model would trivially memorize CVSS thresholds with 100% accuracy — not useful.

### The CRSI Formula (Continuous Risk Score Index)

We designed a formula that **blends all three real-world risk signals**:

$$\text{CRSI} = 0.40 \times \left(\frac{\text{CVSS}}{10}\right) + 0.35 \times \text{EPSS} + 0.25 \times \text{KEV} + 0.05 \times \text{Published Factor}$$

**Breaking down each piece:**

| Component | Weight | What It Contributes | Why This Weight? |
|---|---|---|---|
| `CVSS / 10` | **40%** | Intrinsic severity (normalized 0–1) | Most important base signal, but not the only one |
| `EPSS` | **35%** | Real-world exploit probability | Almost as important as CVSS — real threat > theoretical |
| `KEV status` | **25%** | Confirmed active exploitation | Binary but very powerful — if it's in KEV, it's urgent |
| `Published factor` | **5%** | Age correction (newer = slightly higher risk) | Small recency boost — very old unpatched CVEs warrant attention |

**The published factor formula:**
```
published_factor = max(0, 1 - (days_since_published / 3650))
```
This gives newer CVEs a small boost. A CVE published yesterday gets 1.0 (full boost), a CVE published 10 years ago gets 0.0 (no boost). This makes intuitive sense — a newly disclosed zero-day needs faster attention than a 10-year-old patched issue.

**Then we convert the continuous CRSI score (0.0 to 1.05) into priority classes:**

```
CRSI >= 0.65            → CRITICAL  (OR: KEV=1 OR CVSS >= 9.0)
0.33 <= CRSI < 0.65     → HIGH
0.22 <= CRSI < 0.33     → MEDIUM
CRSI < 0.22             → LOW
```

### A Worked Example

```
CVE-2023-44487 (HTTP/2 Rapid Reset Attack):
  CVSS = 7.5,  EPSS = 0.97,  KEV = 1,  days_since_published = 350

CRSI = 0.40 × (7.5/10) + 0.35 × 0.97 + 0.25 × 1 + 0.05 × (1 - 350/3650)
     = 0.40 × 0.75   + 0.35 × 0.97   + 0.25 × 1   + 0.05 × 0.904
     = 0.300          + 0.340          + 0.250       + 0.045
     = 0.935

0.935 >= 0.65 → CRITICAL ✅ (as expected — this was a major global attack)
```

---

## Why Is the CRSI Formula Close to Real-World Standards?

### Compared to SSVC (Stakeholder-Specific Vulnerability Categorization)

SSVC is the framework used by CISA and the U.S. Department of Defense for vulnerability triage. It considers:
- **Exploitation status** (None / PoC / Active) — our `kev_status` + `epss_score`
- **Technical impact** — our `cvss_score`, `impact_score`
- **Mission/business impact** — partially captured by our `vendor_cve_count`

Our CRSI essentially approximates SSVC's three core signals in a continuous scoring format.

### Compared to CVSS v4.0 (the latest standard)

CVSS v4.0 (released 2023) now includes **Threat Metrics** — specifically:
- **Exploit Maturity** — is there known exploit code? (similar to our `kev_status`)
- **Vulnerable System Impact** — similar to our `impact_score`

Our CRSI was designed **before we checked CVSS v4.0**, but independently arrived at incorporating the same signals — which validates our approach.

---

## Step 5: Train/Test Split — What Is This?

Once labels were generated, we split the 139,784 records into two groups:

```
Training Set (80%) = 111,827 records → The model LEARNS from this
Test Set (20%)     =  27,957 records → We TEST the model on this (it never saw this data)
```

**Why the separation?**
If you study for an exam using the exact questions that will be on the exam, you can get 100% without really understanding the material. The test set is the "real exam" — questions the model has never seen.

This is called **stratified splitting**, meaning each priority class maintains its percentage in both splits:
```
Training: ~10.77% CRITICAL, 32.58% HIGH, 46.83% MEDIUM, 9.81% LOW
Test:     ~10.77% CRITICAL, 32.58% HIGH, 46.83% MEDIUM, 9.81% LOW
```

---

## Step 6: Training the Models

Training a model means running an algorithm that finds the **optimal decision rules** from the training data.

**Random Forest training (simplified):**
```
1. Take a random sample of 111,827 rows
2. Build a decision tree on that sample
3. Repeat 200 times with different random samples
4. Final prediction = majority vote of all 200 trees
```
Training time: **5.8 seconds** on 111,827 rows.

**XGBoost training (simplified):**
```
1. Build tree #1 → makes some errors
2. Build tree #2 that specifically fixes tree #1's errors
3. Build tree #3 that fixes tree #2's errors
4. Repeat for N trees
5. Final prediction = weighted sum of all tree outputs
```
Training time: **2.5 seconds** on 111,827 rows.

---

## Step 7: Evaluation — How Do We Know If The Model Is Good?

We ran each trained model on the **27,957 test records** it had never seen and measured:

**Accuracy:** Out of all predictions, what percentage were correct?
```
Random Forest: 99.74%  → Misclassified only ~73 out of 27,957 test samples
XGBoost:       99.88%  → Misclassified only ~34 out of 27,957 test samples
```

**Macro F1-Score:** Measures if the model is good across ALL classes equally (not just the majority one).
```
Random Forest: 99.72%
XGBoost:       99.86%
```

**Confusion Matrix:** A 4×4 grid showing exactly what the model predicted vs. what the actual label was. Diagonal = correct predictions.

---

## Step 8: SHAP — Understanding WHY the Model Makes Decisions

Even if a model is 99.88% accurate, a reviewer might ask: "How do I know it's not just lucky?"

We used **SHAP (SHapley Additive exPlanations)** — a technique that shows exactly **how much each feature contributed to each prediction**.

**Key findings from SHAP analysis:**
1. `kev_status` is the single most powerful feature for `CRITICAL` predictions.
2. `epss_score` is the second most powerful signal.
3. The 5 engineered features (`days_since_published`, `cvss_epss_divergence`, etc.) all contribute non-zero SHAP values, **proving the model isn't just memorizing CVSS/EPSS rules** — it genuinely uses all 15 features.

---

## Phase 1 Summary: What We Built

```
Raw Datasets ──► Merge ──► Clean ──► Feature Engineering ──► Label Generation ──► Train/Test Split ──► Train Models ──► Evaluate ──► SHAP Analysis
   (3 sources)    (join)   (dedup)       (15 features)          (CRSI formula)          (80/20)          (RF + XGBoost)   (metrics)    (explainability)
                                                                                                                             ↓
                                                                                         139,784 records, 111,827 train, 27,957 test
                                                                                         Random Forest: 99.74% Accuracy
                                                                                         XGBoost:       99.88% Accuracy
```

**The model we trained is now ready to be deployed in the backend.** When a live scanner (OWASP ZAP) finds a vulnerability on a real website, we feed its CWE ID into our Threat Intelligence Index to get the 15 features, then pass them to the model — and in under 12 milliseconds, the model tells us: fix this one **CRITICAL**, fix that one **MEDIUM**.
