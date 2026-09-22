import { GigRecord } from "@/contracts";

export interface DemoMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  badgeText?: string;
}

export interface PendingReviewItem {
  id: string;
  gigId: string;
  gigTitle: string;
  contributorName: string;
  submittedAt: string;
  fileName: string;
  fileSizeBytes: number;
  contentHashSha256: string;
  aiAdvisory: {
    status: "PASS" | "NEEDS_ATTENTION";
    summary: string;
    details: string[];
    humanReviewNotice: string;
  };
}

export interface PlannedIntegrationItem {
  service: string;
  role: string;
  status: "Configured" | "Not connected";
  details: string;
}

export const PLANNED_TECHNICAL_STACK: PlannedIntegrationItem[] = [
  {
    service: "Solana Devnet",
    role: "L1 Settlement Layer",
    status: "Configured",
    details: "Cluster endpoint configured for Devnet test assets and RPC health check.",
  },
  {
    service: "Anchor Escrow",
    role: "Escrow Program",
    status: "Not connected",
    details: "Program contracts under programs/escrow; client binding in progress (TASK-004).",
  },
  {
    service: "Private Storage",
    role: "Encrypted Deliverables",
    status: "Not connected",
    details: "Off-chain Supabase private storage integration pending (TASK-002 / TASK-005).",
  },
  {
    service: "Metaplex Core",
    role: "IP License Receipt",
    status: "Not connected",
    details: "Post-settlement receipt minting adapter pending (TASK-008).",
  },
  {
    service: "AI Review",
    role: "Advisory Analysis",
    status: "Not connected",
    details: "Automated format and keyword check provider pending (TASK-006).",
  },
];

export const DEMO_GIGS: GigRecord[] = [
  {
    id: "gig-demo-001",
    clientId: "studio-stellar-forge",
    workerId: "contributor-alex-chen",
    title: "Japanese Localization Pack (Prologue & Act I Dialogue)",
    brief: "Translate 2,800 lines of fantasy JRPG dialogue from English to natural Japanese with glossaries for in-game lore.",
    budgetAtomic: 450_000_000, // 450 test tokens (atomic units)
    deadline: "2026-10-15T00:00:00Z",
    status: "SUBMITTED",
    licenseType: "COMMERCIAL_GAMING",
    termsHash: "3f79e39097d6228f418579435b6f00db7fe1cb87a13d7890bc4d34f0d36746cf",
    escrowPda: "EsCrOw11111111111111111111111111111111111111",
    createdAt: "2026-09-18T10:00:00Z",
    updatedAt: "2026-09-21T14:30:00Z",
  },
  {
    id: "gig-demo-002",
    clientId: "studio-stellar-forge",
    workerId: "contributor-maya-lin",
    title: "Modular Pixel Art Tilemap (Cyberpunk Alleyway)",
    brief: "Design 32x32 tileset including pavement, neon signs, holographic kiosks, and layered parallax backgrounds.",
    budgetAtomic: 320_000_000, // 320 test tokens
    deadline: "2026-10-20T00:00:00Z",
    status: "CLAIMED",
    licenseType: "EXCLUSIVE",
    termsHash: "8a83d7351631522f77977462bf415668e1ab00eb6085a6dbd4c0ab0c47ae5b41",
    escrowPda: "EsCrOw22222222222222222222222222222222222222",
    createdAt: "2026-09-19T08:00:00Z",
    updatedAt: "2026-09-20T11:00:00Z",
  },
  {
    id: "gig-demo-003",
    clientId: "studio-stellar-forge",
    workerId: null,
    title: "Dynamic Ambient Combat Music Stem (Retro Synth)",
    brief: "Compose 2-minute looping battle track with separate drum, bass, and synth stems for adaptive audio mixing.",
    budgetAtomic: 500_000_000, // 500 test tokens
    deadline: "2026-10-25T00:00:00Z",
    status: "FUNDED",
    licenseType: "EXCLUSIVE",
    termsHash: "51c9b68c5b0ec89be7cf82713e73b22fbef1f1d1f0545f94b1ef868e82ef6bcf",
    escrowPda: "EsCrOw33333333333333333333333333333333333333",
    createdAt: "2026-09-20T09:15:00Z",
    updatedAt: "2026-09-20T09:30:00Z",
  },
  {
    id: "gig-demo-004",
    clientId: "studio-stellar-forge",
    workerId: "contributor-jordan-smith",
    title: "Game Trailer Subtitles & French Localization",
    brief: "Timed SRT subtitles and localized copy for the 90-second reveal trailer across Steam and YouTube.",
    budgetAtomic: 180_000_000, // 180 test tokens
    deadline: "2026-09-20T00:00:00Z",
    status: "COMPLETED",
    licenseType: "NON_EXCLUSIVE",
    termsHash: "7b47b469542a223f0fe7842e4d29f8f2b2c9a96e17ffea4a56ff95b9fa757e84",
    escrowPda: "EsCrOw44444444444444444444444444444444444444",
    createdAt: "2026-09-10T12:00:00Z",
    updatedAt: "2026-09-20T16:45:00Z",
  },
];

export const DEMO_PENDING_REVIEW: PendingReviewItem = {
  id: "review-sub-001",
  gigId: "gig-demo-001",
  gigTitle: "Japanese Localization Pack (Prologue & Act I Dialogue)",
  contributorName: "Alex Chen (alex.chen.eth)",
  submittedAt: "2026-09-21T14:30:00Z",
  fileName: "stellar-forge-jp-act1-v1.json",
  fileSizeBytes: 428000,
  contentHashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  aiAdvisory: {
    status: "PASS",
    summary: "Format adheres to dialogue JSON schema; zero detected placeholder tokens.",
    details: [
      "JSON schema validated with 2,800 dialogue nodes.",
      "Context glossaries checked against registered game lore.",
      "Human-in-the-loop reminder: AI never decides payout or legal ownership.",
    ],
    humanReviewNotice: "Advisory analysis only. Studio lead must verify artistic fidelity before approving settlement.",
  },
};

export const DEMO_CLIENT_METRICS: DemoMetric[] = [
  {
    id: "metric-client-1",
    label: "Active Gigs",
    value: "3",
    description: "1 in review, 1 claimed, 1 awaiting worker",
    badgeText: "Simulated",
  },
  {
    id: "metric-client-2",
    label: "Escrowed (Test Assets)",
    value: "1,270 tUSDC",
    description: "Locked in simulated Devnet escrow PDAs",
    badgeText: "Devnet Escrow",
  },
  {
    id: "metric-client-3",
    label: "Requires Studio Review",
    value: "1",
    description: "Japanese Localization Pack submitted",
    badgeText: "Action Needed",
  },
  {
    id: "metric-client-4",
    label: "Settled & Verified",
    value: "8",
    description: "Post-settlement receipts archived",
    badgeText: "Historical",
  },
];

export const DEMO_WORKER_METRICS: DemoMetric[] = [
  {
    id: "metric-worker-1",
    label: "Assigned Gigs",
    value: "2",
    description: "1 submitted, 1 active in progress",
    badgeText: "Simulated",
  },
  {
    id: "metric-worker-2",
    label: "Upcoming Deadline",
    value: "Oct 20, 2026",
    description: "Modular Pixel Art Tilemap",
    badgeText: "In Progress",
  },
  {
    id: "metric-worker-3",
    label: "Simulated Earnings",
    value: "180 tUSDC",
    description: "Settled to test wallet on Devnet",
    badgeText: "Test Assets Only",
  },
  {
    id: "metric-worker-4",
    label: "Pending Settlement",
    value: "450 tUSDC",
    description: "Awaiting studio review approval",
    badgeText: "In Review",
  },
];
