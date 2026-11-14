<h1 align="center">🛡️ Perfynix AI</h1>

<p align="center">
  <strong>Continuous Vulnerability Prioritization & Performance-Security Trade-Off Optimization for Modern Web Applications</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-Async-009688.svg?logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/LightGBM-99.86%25_Accuracy-brightgreen.svg" alt="LightGBM"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1.svg?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg?logo=tailwind-css&logoColor=white" alt="Tailwind"/>
</p>

---

## 📌 Problem Overview

When automated security scanners run against modern web applications, security teams are flooded with thousands of vulnerability alerts. In practice, development teams cannot remediate everything at once.

Traditional vulnerability triage relies heavily on the **CVSS Base Score** (e.g., flagging anything $\ge 7.0$ as urgent). However:
- **Alert Fatigue**: Fewer than **6%** of all published CVEs are ever exploited in the wild. Prioritizing solely on CVSS base scores leads to wasted engineering hours.
- **Missed Active Threats**: Critical real-world exploits frequently target lower-scoring vulnerabilities that bypass traditional CVSS thresholds.
- **The Performance Cost**: Implementing security remediations (e.g., strict CSP headers, input sanitation middleware, WAF filtering) often increases server latency and degrades **Google Core Web Vitals** (such as Largest Contentful Paint).

**Perfynix AI** bridges the gap between cybersecurity triage and web performance engineering by combining empirical exploit intelligence with real-time performance impact quantification.

---

## ✨ Key Features & Architectural Capabilities

### 1. 🎯 Continuous Risk Score Index (CRSI)
A normalized heuristic scoring formula that synthesizes four critical signals:
- **CVSS v3.1 Severity** (Weight: 0.38)
- **EPSS (Exploit Prediction Scoring System)** 30-day likelihood (Weight: 0.33)
- **CISA Known Exploited Vulnerabilities (KEV)** catalog presence (Weight: 0.24)
- **Vulnerability Publication Recency** (Weight: 0.05)

> **Impact**: Evaluated across **139,784 CVE records**, CRSI reduces the critical alert backlog by **76.9%** while maintaining a **100% detection capture rate** for confirmed in-the-wild exploits (602/602).

### 2. ⚡ High-Throughput Machine Learning Engine
- Powered by a fine-tuned **LightGBM** classifier trained on comprehensive vulnerability telemetry.
- **99.86% classification accuracy** on a 27,957 holdout test set.
- **1.2 ms inference latency** with a lightweight 2.9 MB model footprint.
- **Zero Critical-to-Low misclassification errors**, ensuring critical security flaws are never downranked.

### 3. ⚖️ Performance-Security Trade-Off Optimization ($\tau$)
- Formulates the Trade-Off Ratio:
  $$\tau = \frac{\Delta \text{Risk \%}}{\Delta \text{Latency \%}}$$
- Features an automated, headless Chrome performance auditor that measures Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and API response times before and after applying security patches.
- Enables engineering leads to objectively identify and deploy high-security, low-latency remediations.

### 4. 💻 Full-Stack Interactive Architecture
- **Asynchronous Backend**: High-performance FastAPI service managing threat ingestion pipelines, scoring engines, and telemetry persistence.
- **Data Persistence**: Relational schema in PostgreSQL managing vulnerability repositories, audit records, and benchmark metrics.
- **Modern Dashboard**: React 18 interface styled with Tailwind CSS, delivering interactive risk visualizers, Pareto frontier charts, and automated remediation recommendations.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React + Tailwind UI                       │
│      (Vulnerability Dashboard & Pareto Trade-Off Charts)     │
└──────────────────────────────┬───────────────────────────────┘
                               │ REST / WebSocket
┌──────────────────────────────▼───────────────────────────────┐
│                    FastAPI Async Backend                     │
├──────────────────────────────┬───────────────────────────────┤
│    Scoring Engine (CRSI)     │   Trade-Off Optimizer (τ)     │
│  - CVSS v3.1 Normalizer      │   - Headless Chrome Auditor   │
│  - EPSS Exploit Feed         │   - Core Web Vitals Profiler  │
│  - CISA KEV Ingestion        │   - Latency Delta Calculator  │
├──────────────────────────────┼───────────────────────────────┤
│       ML Classification      │      Relational Storage       │
│   LightGBM Inference Engine  │      PostgreSQL Database      │
│    (1.2 ms / 99.86% Acc)     │    (CVE Records & Metrics)    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend & APIs** | Python 3.10+, FastAPI, Uvicorn, Pydantic, AsyncIO |
| **Machine Learning** | LightGBM, Scikit-Learn, Pandas, NumPy, Joblib |
| **Database & ORM** | PostgreSQL, SQLAlchemy / Asyncpg, Alembic |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Recharts |
| **Auditing & DevTools**| Headless Chrome, Chrome DevTools Protocol (CDP) |
| **DevOps & Tooling** | Docker, Docker Compose, Git, Pytest |

---

## 🚀 Getting Started

### Prerequisites
- **Python** $\ge$ 3.10
- **Node.js** $\ge$ 18
- **PostgreSQL** $\ge$ 14

### 1. Clone the Repository
```bash
git clone https://github.com/PalRathore/Perfynix-AI.git
cd Perfynix-AI
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run database migrations and start server
uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation will be live at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Access the application dashboard at `http://localhost:5173`.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
