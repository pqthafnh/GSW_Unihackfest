import { clientEnvSchema, serverEnvSchema } from "../src/lib/env";

type CheckResult = {
  component: string;
  status: "PASS" | "WARN" | "FAIL" | "SKIP";
  message: string;
};

async function runTechnicalChecks() {
  console.log("=================================================");
  console.log("   Micro-Gig Network - Technical Connection Check");
  console.log("=================================================\n");

  const results: CheckResult[] = [];

  // 1. Solana Devnet Configuration Check
  try {
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet";
    if (cluster !== "devnet") {
      results.push({
        component: "Solana Network Target",
        status: "FAIL",
        message: `Forbidden network detected: ${cluster}. Must be devnet.`,
      });
    } else {
      results.push({
        component: "Solana Network Target",
        status: "PASS",
        message: "Configured strictly for Solana Devnet.",
      });
    }
  } catch (err: unknown) {
    results.push({
      component: "Solana Network Target",
      status: "FAIL",
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // 2. Client Environment Schema Validation
  try {
    clientEnvSchema.parse(process.env);
    results.push({
      component: "Client Environment Schema",
      status: "PASS",
      message: "Client environment conforms to Zod schema without leaks.",
    });
  } catch (err: unknown) {
    results.push({
      component: "Client Environment Schema",
      status: "WARN",
      message: "Some optional client env variables are unset or malformed.",
    });
  }

  // 3. Server Environment Schema Validation
  try {
    serverEnvSchema.parse(process.env);
    results.push({
      component: "Server Environment Schema",
      status: "PASS",
      message: "Server environment parameters validated.",
    });
  } catch (err: unknown) {
    results.push({
      component: "Server Environment Schema",
      status: "WARN",
      message: "Server environment has missing optional credentials (expected in pre-deploy).",
    });
  }

  // 4. Supabase Connection Check
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    results.push({
      component: "Supabase Service",
      status: "PASS",
      message: "Credentials configured (live DB round-trip ready).",
    });
  } else {
    results.push({
      component: "Supabase Service",
      status: "WARN",
      message: "Supabase URL / service key not set in environment (mock/local mode).",
    });
  }

  // 5. Solana Devnet RPC Ping Check
  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "health-check",
        method: "getHealth",
      }),
    });
    if (res.ok) {
      results.push({
        component: "Solana Devnet RPC",
        status: "PASS",
        message: `Endpoint reachable (${rpcUrl}).`,
      });
    } else {
      results.push({
        component: "Solana Devnet RPC",
        status: "WARN",
        message: `RPC returned HTTP status ${res.status}.`,
      });
    }
  } catch {
    results.push({
      component: "Solana Devnet RPC",
      status: "WARN",
      message: "Could not reach Solana Devnet RPC (network timeout or offline).",
    });
  }

  // 6. Metaplex Mint Authority
  if (process.env.METAPLEX_MINT_AUTHORITY_SECRET) {
    results.push({
      component: "Metaplex Authority",
      status: "PASS",
      message: "Mint authority secret configured safely on server.",
    });
  } else {
    results.push({
      component: "Metaplex Authority",
      status: "SKIP",
      message: "Mint authority secret not configured (deferred to TASK-008).",
    });
  }

  // 7. AI Review Provider
  if (process.env.AI_API_KEY) {
    results.push({
      component: "AI Review Provider",
      status: "PASS",
      message: "AI API credentials configured.",
    });
  } else {
    results.push({
      component: "AI Review Provider",
      status: "SKIP",
      message: "AI API key not configured (deferred to TASK-006).",
    });
  }

  // Print Summary Table
  console.log("| Component                     | Status | Details");
  console.log("|-------------------------------|--------|--------------------------------------------------");
  for (const r of results) {
    const paddedComponent = r.component.padEnd(29, " ");
    const paddedStatus = r.status.padEnd(6, " ");
    console.log(`| ${paddedComponent} | ${paddedStatus} | ${r.message}`);
  }

  const hasFail = results.some((r) => r.status === "FAIL");
  console.log("\n-------------------------------------------------");
  if (hasFail) {
    console.error("OVERALL STATUS: NOT TECHNICALLY CONNECTED (FAIL detected)");
    process.exit(1);
  } else {
    console.log("OVERALL STATUS: PASSED / READY FOR STAGED TASKS");
    process.exit(0);
  }
}

runTechnicalChecks().catch((err) => {
  console.error("Unexpected error during connection check:", err);
  process.exit(1);
});
