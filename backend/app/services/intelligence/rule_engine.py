"""
Static Rule Engine for Non-CVE & Configuration Findings — Checkpoint 3.4
Evaluates non-CVE findings (missing security headers, SSL issues, Core Web Vitals performance).

🔵 CODER: Written
🟡 SUPERVISOR: Validates with test_rule_engine.py
🔴 CEO: Ensures rule priorities match industry standard security & performance baselines
"""

from __future__ import annotations

from dataclasses import asdict, dataclass

LABEL_MAP: dict[int, str] = {0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "CRITICAL"}


@dataclass
class RuleEvaluationResult:
    """Result of rule-based finding evaluation."""

    finding_title: str
    cwe_id: str
    priority_label: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    priority_code: int  # 3, 2, 1, 0
    rule_category: str  # "security_header", "ssl", "performance", "configuration"
    explanation: str
    recommended_action: str

    def to_dict(self) -> dict:
        return asdict(self)


def evaluate_non_cve_finding(finding: dict) -> RuleEvaluationResult:
    """
    Evaluate a non-CVE or configuration finding against security rules.

    Args:
        finding: Dictionary with keys 'header', 'type', 'cwe_id', 'risk', 'description', etc.

    Returns:
        RuleEvaluationResult with evaluated priority and remediation advice.
    """
    f_type = str(finding.get("type", "")).lower()
    cwe_id = str(finding.get("cwe_id", "CWE-200"))
    header = str(finding.get("header", ""))
    risk = str(finding.get("risk", "")).lower()

    # 1. Security Header Rules
    if f_type == "missing_security_header":
        if header in {"Content-Security-Policy", "Strict-Transport-Security"}:
            code, label = 2, "HIGH"
        elif header in {"X-Frame-Options", "X-Content-Type-Options"}:
            code, label = 1, "MEDIUM"
        else:
            code, label = 0, "LOW"

        return RuleEvaluationResult(
            finding_title=f"Missing Security Header: {header}",
            cwe_id=cwe_id,
            priority_label=label,
            priority_code=code,
            rule_category="security_header",
            explanation=finding.get("description", f"Response header '{header}' is missing."),
            recommended_action=f"Configure the web server to emit '{header}' header.",
        )

    # 2. SSL/TLS Certificate Rules
    if "ssl" in f_type or "certificate" in f_type or "tls" in f_type:
        if "expired" in f_type or risk == "critical":
            code, label = 3, "CRITICAL"
        elif "weak" in f_type or "invalid" in f_type or risk == "high":
            code, label = 2, "HIGH"
        else:
            code, label = 1, "MEDIUM"

        return RuleEvaluationResult(
            finding_title=finding.get("description", "SSL/TLS Issue"),
            cwe_id=cwe_id,
            priority_label=label,
            priority_code=code,
            rule_category="ssl",
            explanation=finding.get("description", "SSL/TLS configuration vulnerability."),
            recommended_action=finding.get(
                "remediation",
                "Update SSL/TLS certificate and server protocol configuration.",
            ),
        )

    # 3. Core Web Vitals Performance Rules
    if f_type == "performance_kpi":
        kpi = finding.get("kpi", "performance")
        value = finding.get("value", 0.0)

        # LCP > 4000ms is Poor (HIGH priority performance issue)
        if kpi == "lcp_ms" and value > 4000:
            code, label = 2, "HIGH"
        elif kpi == "lcp_ms" and value > 2500 or kpi == "cls_score" and value > 0.25:
            code, label = 1, "MEDIUM"
        else:
            code, label = 0, "LOW"

        return RuleEvaluationResult(
            finding_title=f"Poor Core Web Vital Metric: {kpi.upper()}",
            cwe_id="CWE-400",  # Uncontrolled Resource Consumption
            priority_label=label,
            priority_code=code,
            rule_category="performance",
            explanation=f"Metric {kpi} recorded a value of {value}, exceeding performance budget.",
            recommended_action="Optimize asset delivery, caching, and DOM rendering tree.",
        )

    # 4. Fallback for generic configuration findings
    if risk == "high":
        code, label = 2, "HIGH"
    elif risk == "medium":
        code, label = 1, "MEDIUM"
    else:
        code, label = 0, "LOW"

    return RuleEvaluationResult(
        finding_title=finding.get("alert", "Configuration Finding"),
        cwe_id=cwe_id,
        priority_label=label,
        priority_code=code,
        rule_category="configuration",
        explanation=finding.get("description", "System configuration finding."),
        recommended_action=finding.get("solution", "Review security baseline configuration."),
    )
