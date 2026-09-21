# API Specification

## Envelope
Success returns `{ ok: true, data, requestId }`. Failure returns `{ ok: false, error: { code, message, fieldErrors? }, requestId }`.

## Core routes
- `POST /api/gigs`
- `GET /api/gigs/:gigId`
- `POST /api/gigs/:gigId/lock-terms`
- `POST /api/gigs/:gigId/fund`
- `POST /api/gigs/:gigId/fund/confirm`
- `POST /api/gigs/:gigId/submissions`
- `POST /api/submissions/:submissionId/review`
- `POST /api/gigs/:gigId/revision`
- `POST /api/gigs/:gigId/approve`
- `POST /api/gigs/:gigId/approve/confirm`
- `POST /api/gigs/:gigId/disputes`
- `GET /api/receipts/:assetId`

All mutations require session, authorization, Zod validation and state validation. Confirmation endpoints are idempotent and verify chain state.
