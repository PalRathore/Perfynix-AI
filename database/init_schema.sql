-- ============================================================
-- Capstone Project — PostgreSQL Database Schema (Phase 3)
-- Database: capstone_security_db (Port 5434)
-- ============================================================

-- Create Scans Table
CREATE TABLE IF NOT EXISTS scans (
    id VARCHAR(64) PRIMARY KEY,
    target_url VARCHAR(2048) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    scan_mode VARCHAR(32) NOT NULL DEFAULT 'website',
    overall_trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create Scan Findings Table
CREATE TABLE IF NOT EXISTS scan_findings (
    id SERIAL PRIMARY KEY,
    scan_id VARCHAR(64) NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    finding_title VARCHAR(512) NOT NULL,
    cwe_id VARCHAR(32) NOT NULL,
    priority_label VARCHAR(32) NOT NULL,
    priority_code INTEGER NOT NULL,
    confidence_score FLOAT DEFAULT 1.0,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Remediations Table
CREATE TABLE IF NOT EXISTS remediations (
    id SERIAL PRIMARY KEY,
    scan_id VARCHAR(64) NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    cwe_id VARCHAR(32) NOT NULL,
    finding_title VARCHAR(512) NOT NULL,
    priority_label VARCHAR(32) NOT NULL,
    summary TEXT,
    impact TEXT,
    remediation_steps TEXT,
    code_example TEXT,
    source VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scan_findings_scan_id ON scan_findings(scan_id);
CREATE INDEX IF NOT EXISTS idx_remediations_scan_id ON remediations(scan_id);
