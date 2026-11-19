export function generatePDFReport(summary = {}, findings = []) {
  const domainClean = (summary.domain || 'example.com').replace(/[^a-zA-Z0-9.-]/g, '_');

  const safeFindings = Array.isArray(findings) ? findings : [];
  const criticalCount = safeFindings.filter(f => f.severity?.toLowerCase() === 'critical').length;
  const highCount = safeFindings.filter(f => f.severity?.toLowerCase() === 'high').length;
  const mediumCount = safeFindings.filter(f => f.severity?.toLowerCase() === 'medium').length;
  const lowCount = safeFindings.filter(f => f.severity?.toLowerCase() === 'low').length;

  const logoSvgHtml = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 42px; height: 42px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
      <path d="M 50 6 L 86 18 L 86 46 C 86 72 50 94 50 94 C 50 94 14 72 14 46 L 14 18 Z" fill="#1E293B" stroke="#2563EB" stroke-width="4" stroke-linejoin="round" />
      <path d="M 50 14 L 78 24 L 78 45 C 78 64 50 82 50 82 C 50 82 22 64 22 45 L 22 24 Z" fill="none" stroke="#00F0FF" stroke-width="1.8" stroke-dasharray="6 3" opacity="0.75" />
      <line x1="50" y1="14" x2="50" y2="26" stroke="#00F0FF" stroke-width="2" />
      <line x1="50" y1="70" x2="50" y2="82" stroke="#A855F7" stroke-width="2" />
      <line x1="22" y1="48" x2="35" y2="48" stroke="#3B82F6" stroke-width="1.8" />
      <line x1="78" y1="48" x2="65" y2="48" stroke="#06B6D4" stroke-width="1.8" />
      <circle cx="50" cy="48" r="22" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-dasharray="18 6 5 6" />
      <circle cx="50" cy="48" r="14" fill="none" stroke="#00F0FF" stroke-width="1.6" stroke-dasharray="10 4" />
      <polygon points="50,36 60,48 50,60 40,48" fill="#00F0FF" stroke="#3B82F6" stroke-width="1.5" />
      <circle cx="50" cy="48" r="4" fill="#FFFFFF" />
      <circle cx="50" cy="26" r="2.5" fill="#00F0FF" />
      <circle cx="50" cy="70" r="2.5" fill="#A855F7" />
      <circle cx="35" cy="48" r="2.5" fill="#3B82F6" />
      <circle cx="65" cy="48" r="2.5" fill="#06B6D4" />
    </svg>
  `;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Perfynix AI - Security Assessment Report - ${summary.domain || 'example.com'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      padding: 15mm;
    }

    svg {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Top Action Bar for Viewer */
    .viewer-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
    }

    .viewer-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      font-weight: 700;
    }

    .viewer-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
      transition: all 0.2s;
    }

    .report-container {
      margin-top: 45px;
    }

    /* Header Styling */
    .report-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-title-wrap {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .brand-title span.ai-text {
      color: #06b6d4;
      font-weight: 900;
    }

    .brand-subtitle {
      font-size: 9.5px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }

    .report-meta {
      text-align: right;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }

    .report-meta strong {
      color: #0f172a;
    }

    /* Title Block */
    .title-block {
      margin-bottom: 20px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 16px 20px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .title-block h1 {
      font-size: 20px;
      font-weight: 800;
      color: #1e3a8a;
      margin-bottom: 4px;
    }

    .title-block p {
      color: #475569;
      font-size: 11px;
    }

    /* Grid Layouts */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .metric-card .val {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }

    .metric-card .lbl {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-top: 2px;
    }

    /* Severity Counters */
    .severity-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 24px;
    }

    .sev-box {
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .sev-critical { background: #fef2f2 !important; border: 1px solid #fecaca !important; color: #dc2626 !important; }
    .sev-high { background: #fff7ed !important; border: 1px solid #fed7aa !important; color: #ea580c !important; }
    .sev-medium { background: #fefce8 !important; border: 1px solid #fef08a !important; color: #ca8a04 !important; }
    .sev-low { background: #f0fdf4 !important; border: 1px solid #bbf7d0 !important; color: #16a34a !important; }

    /* Findings Table */
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e2e8f0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }

    th {
      background: #f1f5f9 !important;
      color: #334155 !important;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 12px;
      text-align: left;
      border-bottom: 2px solid #cbd5e1;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    td {
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .badge-critical { background: #dc2626 !important; color: white !important; }
    .badge-high { background: #ea580c !important; color: white !important; }
    .badge-medium { background: #ca8a04 !important; color: white !important; }
    .badge-low { background: #16a34a !important; color: white !important; }

    /* Finding Detail Cards */
    .finding-card {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      background: #ffffff;
    }

    .finding-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #f1f5f9;
    }

    .finding-head h3 {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }

    .finding-desc {
      color: #334155;
      font-size: 11px;
      margin-bottom: 8px;
    }

    .code-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      background: #0f172a !important;
      color: #e2e8f0 !important;
      padding: 10px 12px;
      border-radius: 8px;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 6px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      .report-container {
        margin-top: 0 !important;
      }
      svg {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .brand-title span.ai-text {
        color: #06b6d4 !important;
        -webkit-text-fill-color: #06b6d4 !important;
      }
    }
  </style>
</head>
<body>
  <!-- Top Viewer Action Bar (Hidden when printing/saving to PDF) -->
  <div class="viewer-bar no-print">
    <div class="viewer-title">
      ${logoSvgHtml}
      <span>Perfynix AI &bull; Executive Security Assessment PDF Report</span>
    </div>
    <div class="viewer-actions">
      <button onclick="window.print()" class="btn-primary">
        <span>Save as PDF / Print</span>
      </button>
    </div>
  </div>

  <div class="report-container">
    <!-- Top Brand Header -->
    <div class="report-header">
      <div class="brand-logo">
        ${logoSvgHtml}
        <div class="brand-title-wrap">
          <div class="brand-title">Perfynix <span class="ai-text">AI</span></div>
          <div class="brand-subtitle">AI Security Platform</div>
        </div>
      </div>
      <div class="report-meta">
        <div><strong>Scanned Target:</strong> ${summary.domain || 'example.com'}</div>
        <div><strong>IP Address:</strong> ${summary.ip || '93.184.216.34'}</div>
        <div><strong>Scan Date:</strong> ${summary.scannedAt || new Date().toLocaleString()}</div>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="title-block">
      <h1>Executive Security Assessment Report</h1>
      <p>Automated multi-engine security vulnerability findings, AI explainability signals, and developer remediation patches.</p>
    </div>

    <!-- Metrics Grid -->
    <div class="summary-grid">
      <div class="metric-card">
        <div class="val" style="color: #2563eb;">${summary.crsiScore || 87}</div>
        <div class="lbl">CRSI Score / 100</div>
      </div>
      <div class="metric-card">
        <div class="val" style="color: #dc2626;">${summary.overallRisk || 'CRITICAL'}</div>
        <div class="lbl">Overall Risk Grade</div>
      </div>
      <div class="metric-card">
        <div class="val">${safeFindings.length}</div>
        <div class="lbl">Total Vulnerabilities</div>
      </div>
      <div class="metric-card">
        <div class="val">${summary.enginesRun || 8}</div>
        <div class="lbl">Engines Executed</div>
      </div>
    </div>

    <!-- Severity Counters -->
    <div class="severity-bar">
      <div class="sev-box sev-critical"><span>Critical</span><span>${criticalCount}</span></div>
      <div class="sev-box sev-high"><span>High</span><span>${highCount}</span></div>
      <div class="sev-box sev-medium"><span>Medium</span><span>${mediumCount}</span></div>
      <div class="sev-box sev-low"><span>Low</span><span>${lowCount}</span></div>
    </div>

    <!-- Findings Overview Table -->
    <div class="section-title">Vulnerability Inventory Summary</div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>CWE</th>
          <th>Severity</th>
          <th>CVSS</th>
          <th>Affected Component</th>
        </tr>
      </thead>
      <tbody>
        ${safeFindings
          .map(
            (f) => `
          <tr>
            <td><strong>${f.id}</strong></td>
            <td>${f.title}</td>
            <td>${f.cwe}</td>
            <td><span class="badge badge-${(f.severity || 'low').toLowerCase()}">${f.severity}</span></td>
            <td><strong>${f.cvss}</strong></td>
            <td style="font-family: monospace;">${f.affectedComponent}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Detailed Finding Cards -->
    <div class="section-title" style="margin-top: 24px;">Detailed Technical Findings & Remediation</div>
    ${safeFindings
      .map(
        (f) => `
      <div class="finding-card">
        <div class="finding-head">
          <div>
            <h3>${f.id}: ${f.title}</h3>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
              ${f.source} &bull; ${f.cwe} &bull; ${f.affectedComponent}
            </div>
          </div>
          <span class="badge badge-${(f.severity || 'low').toLowerCase()}">${f.severity} (${f.cvss})</span>
        </div>
        <div class="finding-desc"><strong>Summary:</strong> ${f.summary}</div>
        <div class="finding-desc"><strong>Technical Details:</strong> ${f.technicalDetails}</div>
        ${
          f.remediation?.application
            ? `<div style="margin-top: 6px;">
                <strong style="font-size: 10px; text-transform: uppercase; color: #475569;">Application Remediation Patch:</strong>
                <pre class="code-box">${f.remediation.application.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
              </div>`
            : ''
        }
      </div>
    `
      )
      .join('')}

    <!-- Footer -->
    <div class="footer">
      Generated automatically by Perfynix AI Security Platform &bull; Confidential Assessment Document
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;

  // 1. Trigger Direct Download of Report Document
  try {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Perfynix_AI_Security_Report_${domainClean}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (err) {
    console.error('Direct download error:', err);
  }

  // 2. Open PDF Viewer & Print Dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
