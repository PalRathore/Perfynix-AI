"""
OWASP ZAP Tiered Scanner Wrapper — Checkpoint 2.4
Implements the 3-tier scanning architecture (Flaw 3 Fix from IMPLEMENTATION_PHASES.md).

Tier Architecture:
  Tier 1 (Instant, ~15s):    header_scanner + ssl_checker + lighthouse_wrapper
                              [NOT in this file — handled by orchestrator]
  Tier 2 (Fast, ~60-90s):    ZAP Spider + Passive Scan (this module)
  Tier 3 (Deep, 15-60min):   ZAP Active Scan with payloads (this module — async stub)

ZAP Communication:
  - ZAP is launched as a headless daemon (port 8080)
  - Python communicates via ZAP's REST API using the 'zaproxy' library
  - API key: 'capstone-zap-key' (set in .env)

CWE Mapping:
  All ZAP alerts include a CWE ID in their alert data.
  ZAP RISK LEVELS: High=3, Medium=2, Low=1, Informational=0

🔵 CODER: Written
🟡 SUPERVISOR: Validates with integration test (zap must be installed)
🔴 CEO: Verify Flaw 3 Fix — must confirm tiered separation exists
"""

from __future__ import annotations

import subprocess
import time
from dataclasses import asdict, dataclass, field

from zapv2 import ZAPv2

# ---------------------------------------------------------------------------
# ZAP executable location (Windows)
# ---------------------------------------------------------------------------
DEFAULT_ZAP_EXE = r"C:\Program Files\ZAP\Zed Attack Proxy\ZAP.exe"
DEFAULT_ZAP_PORT = 8080
DEFAULT_API_KEY = "capstone-zap-key"


@dataclass
class ZAPFinding:
    """A single normalized ZAP alert finding."""

    alert: str
    risk: str  # "High", "Medium", "Low", "Informational"
    risk_code: int  # 3=High, 2=Medium, 1=Low, 0=Informational
    confidence: str
    description: str
    url: str
    solution: str
    cwe_id: str  # e.g. "CWE-79"
    wasc_id: str
    evidence: str
    reference: str


@dataclass
class ZAPScanResult:
    """Structured result from a ZAP scan."""

    scan_type: str = "passive"  # "passive" or "active"
    target_url: str = ""
    alerts_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    low_count: int = 0
    info_count: int = 0
    findings: list[dict] = field(default_factory=list)
    cwe_ids: list[str] = field(default_factory=list)
    duration_seconds: float = 0.0
    error: str | None = None

    def to_dict(self) -> dict:
        return asdict(self)


class ZAPScanner:
    """
    OWASP ZAP tiered scanner.

    Usage:
        scanner = ZAPScanner(api_key="capstone-zap-key")
        scanner.start_daemon()
        result = scanner.tier2_passive("https://example.com")
        scanner.shutdown()
    """

    def __init__(
        self,
        api_key: str = DEFAULT_API_KEY,
        zap_port: int = DEFAULT_ZAP_PORT,
        zap_exe: str = DEFAULT_ZAP_EXE,
    ) -> None:
        self.api_key = api_key
        self.zap_port = zap_port
        self.zap_exe = zap_exe
        self.zap: ZAPv2 | None = None
        self._daemon_proc: subprocess.Popen | None = None

    # ------------------------------------------------------------------
    # Daemon lifecycle
    # ------------------------------------------------------------------

    def start_daemon(self, wait_seconds: int = 20) -> None:
        """
        Launch ZAP in headless daemon mode.
        Waits up to `wait_seconds` for ZAP API to become available.
        """
        cmd = [
            self.zap_exe,
            "-daemon",
            f"-port {self.zap_port}",
            f"-config api.key={self.api_key}",
            "-config api.addrs.addr.name=.*",
            "-config api.addrs.addr.regex=true",
        ]
        self._daemon_proc = subprocess.Popen(
            " ".join(cmd),
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        self.zap = ZAPv2(
            apikey=self.api_key,
            proxies={"http": f"http://localhost:{self.zap_port}", "https": f"http://localhost:{self.zap_port}"},
        )

        # Poll until ZAP API responds
        deadline = time.time() + wait_seconds
        while time.time() < deadline:
            try:
                self.zap.core.version()
                return  # ZAP is up
            except Exception:  # noqa: BLE001
                time.sleep(2)

        raise TimeoutError(
            f"ZAP daemon did not become ready within {wait_seconds}s. "
            "Check that ZAP is installed at the configured path."
        )

    def _ensure_ready(self) -> None:
        if self.zap is None:
            raise RuntimeError("ZAP daemon not started. Call ZAPScanner.start_daemon() first.")

    def shutdown(self) -> None:
        """Cleanly stop the ZAP daemon."""
        if self.zap is not None:
            try:
                self.zap.core.shutdown()
            except Exception:  # noqa: BLE001
                pass
            self.zap = None
        if self._daemon_proc is not None:
            try:
                self._daemon_proc.terminate()
            except Exception:  # noqa: BLE001
                pass
            self._daemon_proc = None

    # ------------------------------------------------------------------
    # Tier 2: Spider + Passive Scan (~60-90s)
    # ------------------------------------------------------------------

    def tier2_passive(self, url: str, spider_timeout: int = 60, passive_timeout: int = 60) -> ZAPScanResult:
        """
        Tier 2 — Spider the target URL and run ZAP's passive scanner.
        Target duration: 60-90 seconds.

        Args:
            url:              Target URL.
            spider_timeout:   Max seconds to run the spider.
            passive_timeout:  Max seconds to wait for passive scan queue to clear.

        Returns:
            ZAPScanResult with normalized findings and CWE IDs.
        """
        self._ensure_ready()
        start = time.time()

        try:
            # Access the target via ZAP proxy first (seeds the scan tree)
            self.zap.urlopen(url)
            time.sleep(2)

            # Start spider
            spider_id = self.zap.spider.scan(url, apikey=self.api_key)
            spider_deadline = time.time() + spider_timeout
            while time.time() < spider_deadline:
                progress = int(self.zap.spider.status(spider_id))
                if progress >= 100:
                    break
                time.sleep(3)

            # Wait for passive scan queue to empty
            passive_deadline = time.time() + passive_timeout
            while time.time() < passive_deadline:
                remaining = int(self.zap.pscan.records_to_scan())
                if remaining == 0:
                    break
                time.sleep(3)

            # Retrieve all alerts
            alerts = self.zap.core.alerts(baseurl=url, start=0, count=500, apikey=self.api_key)

        except Exception as exc:  # noqa: BLE001
            return ZAPScanResult(
                scan_type="passive",
                target_url=url,
                error=f"ZAP passive scan failed: {exc}",
                duration_seconds=round(time.time() - start, 2),
            )

        return self._build_result(alerts, url, "passive", time.time() - start)

    # ------------------------------------------------------------------
    # Tier 3: Full Active Scan (15-60 min) — stub / async placeholder
    # ------------------------------------------------------------------

    def tier3_active_start(self, url: str) -> str:
        """
        Tier 3 — Start a full ZAP Active Scan against the target.
        This is a LONG-RUNNING scan (15-60 minutes) meant to run asynchronously.

        Returns:
            scan_id (str): Use this ID to poll status via `tier3_active_status()`.

        NOTE: Caller is responsible for calling this in a background thread/task
              and polling `tier3_active_status()` until status == "100".
        """
        self._ensure_ready()
        scan_id = self.zap.ascan.scan(url=url, apikey=self.api_key)
        return str(scan_id)

    def tier3_active_status(self, scan_id: str) -> int:
        """
        Poll the active scan completion percentage.

        Returns:
            int: 0-100 percent complete.
        """
        self._ensure_ready()
        return int(self.zap.ascan.status(scan_id))

    def tier3_active_results(self, url: str, scan_id: str) -> ZAPScanResult:
        """
        Retrieve the final results once tier3_active_status() == 100.

        Returns:
            ZAPScanResult with all active scan findings.
        """
        self._ensure_ready()
        alerts = self.zap.core.alerts(baseurl=url, start=0, count=1000, apikey=self.api_key)
        return self._build_result(alerts, url, "active", 0.0)

    # ------------------------------------------------------------------
    # Shared alert normalization
    # ------------------------------------------------------------------

    def _build_result(
        self,
        alerts: list[dict],
        url: str,
        scan_type: str,
        duration: float,
    ) -> ZAPScanResult:
        """Convert raw ZAP alert dicts into normalized ZAPScanResult."""
        findings = []
        cwe_ids = []
        risk_counts = {"High": 0, "Medium": 0, "Low": 0, "Informational": 0}
        risk_code_map = {"High": 3, "Medium": 2, "Low": 1, "Informational": 0}

        for alert in alerts:
            risk = alert.get("risk", "Informational")
            risk_counts[risk] = risk_counts.get(risk, 0) + 1

            cwe_raw = alert.get("cweid", "0")
            cwe_id = f"CWE-{cwe_raw}" if cwe_raw and cwe_raw != "0" else "CWE-UNKNOWN"
            cwe_ids.append(cwe_id)

            findings.append(
                {
                    "alert": alert.get("alert", ""),
                    "risk": risk,
                    "risk_code": risk_code_map.get(risk, 0),
                    "confidence": alert.get("confidence", ""),
                    "description": alert.get("description", ""),
                    "url": alert.get("url", url),
                    "solution": alert.get("solution", ""),
                    "cwe_id": cwe_id,
                    "wasc_id": alert.get("wascid", ""),
                    "evidence": alert.get("evidence", ""),
                    "reference": alert.get("reference", ""),
                }
            )

        return ZAPScanResult(
            scan_type=scan_type,
            target_url=url,
            alerts_count=len(findings),
            high_count=risk_counts.get("High", 0),
            medium_count=risk_counts.get("Medium", 0),
            low_count=risk_counts.get("Low", 0),
            info_count=risk_counts.get("Informational", 0),
            findings=findings,
            cwe_ids=list(set(cwe_ids)),
            duration_seconds=round(duration, 2),
            error=None,
        )
