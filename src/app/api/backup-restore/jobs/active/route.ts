import { NextResponse } from "next/server";

import { jobRegistry } from "@/lib/backup/job-registry";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(jobRegistry.getActive());
}
