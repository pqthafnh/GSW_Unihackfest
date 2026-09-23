type CheckResult = {
  component: string;
  status: "PASS" | "FAIL" | "SKIP";
  message: string;
};

async function runTechnicalChecks() {
  const results: CheckResult[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  let validUrl = false;
  try {
    validUrl = Boolean(url && new URL(url));
  } catch {
    validUrl = false;
  }

  if (!validUrl || !publishableKey || !secretKey) {
    results.push({ component: "Supabase Database", status: "SKIP", message: "Supabase configuration is incomplete." });
  } else {
    try {
      const response = await fetch(`${url}/rest/v1/system_health_checks?select=id&limit=1`, {
        headers: { apikey: publishableKey, Authorization: `Bearer ${secretKey}` },
        signal: AbortSignal.timeout(8_000),
      });
      results.push(response.ok
        ? { component: "Supabase Database", status: "PASS", message: "Technical schema query succeeded." }
        : { component: "Supabase Database", status: "FAIL", message: "Technical schema query failed; migration may not be applied." });
    } catch {
      results.push({ component: "Supabase Database", status: "FAIL", message: "Technical schema query failed; migration may not be applied." });
    }
  }

  results.push(
    { component: "Supabase Auth", status: "SKIP", message: "Not checked in TASK-002A." },
    { component: "Supabase Storage", status: "SKIP", message: "Not checked in TASK-002A." },
    { component: "Solana / Anchor", status: "SKIP", message: "Out of scope for TASK-002A." },
    { component: "AI Review", status: "SKIP", message: "Out of scope for TASK-002A." },
    { component: "Metaplex Core", status: "SKIP", message: "Out of scope for TASK-002A." },
  );

  console.log("| Component | Status | Details");
  for (const result of results) console.log(`| ${result.component} | ${result.status} | ${result.message}`);
  process.exit(results.some((result) => result.status === "FAIL") ? 1 : 0);
}

runTechnicalChecks().catch(() => {
  console.error("Technical connection check failed safely.");
  process.exit(1);
});
