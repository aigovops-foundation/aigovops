# Security Policy

## Reporting a vulnerability

Please report security issues privately via the AiGovOps Foundation security contact rather than opening a public issue. Include steps to reproduce and the affected file or commit.

## Scope

This is a static, client-side webapp. It performs no network calls and stores no data; the SHA-256 receipt preview runs entirely in the browser. The preview is explicitly unsigned and must not be used as audit evidence until signed by Beacon (Ed25519 + JCS).

## Supported

The main branch is the supported version.
