import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const requestId = crypto.randomUUID();
  
  // Return safe fields only. Never expose secrets or internal connection strings.
  return apiSuccess(
    {
      status: "healthy",
      environment: process.env.NODE_ENV ?? "development",
      configuredCluster: "devnet",
    },
    requestId
  );
}
