#!/usr/bin/env bash
# Cloud-Mary — 🗣️ Message lint (promise · path · proof). Thin wrapper; the checks live in test-message.py.
cd "$(dirname "$0")/.." && python3 scripts/test-message.py
