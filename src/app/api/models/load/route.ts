import { NextResponse } from "next/server";

// LiteRT-LM loads its one model at process startup — there's no separate "load"
// step to proxy, so this is a graceful no-op kept for API-shape compatibility
// with the model selector's load flow.
export async function POST(req: Request) {
  const { model } = await req.json().catch(() => ({ model: undefined }));

  if (!model || typeof model !== "string") {
    return NextResponse.json(
      { error: "Model ID is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, model });
}
