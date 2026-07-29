import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://localhost:8000/v1/models", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Inference server returned status: ${response.status}`);
    }

    const data = await response.json();
    // The local engine loads its one model at process startup, so it's always "loaded".
    const models = (data.data || []).map((m: any) => ({
      id: m.id,
      name: m.id,
      loaded: true,
    }));
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Failed to fetch inference server models:", error);
    return NextResponse.json({
      models: [],
      error: "Inference server is not running or unreachable",
    });
  }
}
