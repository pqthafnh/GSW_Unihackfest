# ADR-006: AI-Assisted Review

- Status: Accepted
- Date: 2026-09-21

## Context
AI detection and authorship claims are unreliable and unsuitable for automatic payment decisions.

## Decision
AI provides structured summary, brief coverage, risk flags and confidence note; a human decides.

## Consequences
Provider failures are retryable and never invalidate the submission.

## Alternatives considered
Automatic approval/rejection and AI-authorship scoring were rejected.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
