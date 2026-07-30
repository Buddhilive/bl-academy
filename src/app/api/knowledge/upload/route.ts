import { runKnowledgeExtraction, sseErrorResponse, sseStreamResponse } from "@/lib/knowledge/orchestrate";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
        return sseErrorResponse("No file provided", "no_file");
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return sseErrorResponse(`Unsupported file type: ${file.type || "unknown"}`, "bad_type");
    }

    const pdfBytes = Buffer.from(await file.arrayBuffer());
    const stream = runKnowledgeExtraction({ filename: file.name, pdfBytes });
    return sseStreamResponse(stream);
}
