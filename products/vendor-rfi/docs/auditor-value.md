# Auditor Value Model

This document defines what AIGovOps vendor evaluation gives an auditor. The goal is to move from "vendor comparison opinion" to **evidence-oriented vendor decisions** that are versioned, testable, observable, and auditable by default.

## What auditors get

- Structured decision records: each stack choice is recorded with rationale, profile inputs, and date.
- Canonical exports: deterministic JSON/YAML so two runs of the same inputs produce identical bytes.
- Hash preview: SHA-256 over the canonical record, ready for Beacon Ed25519 + JCS signing.
- Cross-functional traceability: links risk profile to layer, vendor, and control owner.
- Explicit gap visibility: gaps (e.g. OT/IIoT) are first-class, never hidden behind a single score.

## Why no single score

A synthetic 1-100 score collapses independent risks into one number an auditor cannot reconstruct. Instead each layer carries a status: Ready, Integrate, or Gap. Auditors can verify each status against evidence rather than trusting a weighting they cannot inspect.

## Evidence record fields

| Field | Purpose |
| --- | --- |
| schema | Versioned record format (aigovops.vendor-rfi/v0.1) |
| generated | ISO-8601 timestamp |
| profile | Risk inputs (regulated, OT, in-VPC) |
| stack | Per-layer vendors and status |
| evidence_sha256 | Hash of canonical record |
| signature | Null until signed by Beacon |
