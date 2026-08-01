import { SEARXNG_BASE_URL } from "@/lib/api-config";

export interface WebSearchResult {
    id: string;
    title: string;
    url: string;
    description: string;
}

interface SearxngApiResult {
    title?: string;
    url?: string;
    content?: string;
}

export async function searchWeb(query: string, limit = 5): Promise<WebSearchResult[]> {
    const url = `${SEARXNG_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!response.ok) return [];

        const data = (await response.json()) as { results?: SearxngApiResult[] };
        const results = data.results ?? [];

        return results.slice(0, limit).map((result, index) => ({
            id: `web:${index}`,
            title: result.title ?? "Untitled",
            url: result.url ?? "",
            description: result.content ?? "",
        }));
    } catch {
        return [];
    }
}
