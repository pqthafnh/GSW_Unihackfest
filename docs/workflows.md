# Business Workflows

## Happy path
DRAFT -> TERMS_LOCKED -> FUNDING_PENDING -> FUNDED -> CLAIMED -> SUBMITTED -> SETTLEMENT_PENDING -> SETTLED -> RECEIPT_PENDING -> COMPLETED.

## Revision
SUBMITTED -> REVISION_REQUESTED -> SUBMITTED.

## Refund
FUNDED -> CANCEL_PENDING -> REFUNDED when contract conditions allow.

## Dispute
SUBMITTED -> DISPUTED -> RESOLVED_TO_CLIENT or RESOLVED_TO_WORKER. MVP resolution is admin-assisted and must preserve evidence and audit events.
