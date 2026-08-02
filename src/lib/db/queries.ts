import { db } from "./index";
import { chats, messages } from "./schema";
import { eq, desc, ilike, count } from "drizzle-orm";
import type { UIMessage } from "ai";

export function truncate(text: string, length: number = 50): string {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
}

export async function createChat(id: string, title: string, model: string) {
    const now = new Date();
    const truncatedTitle = truncate(title, 50);
    await db.insert(chats).values({
        id,
        title: truncatedTitle,
        model,
        createdAt: now,
        updatedAt: now,
    });
    return id;
}

export async function getRecentChats(limit: number = 10) {
    const list = await db.select().from(chats).orderBy(desc(chats.updatedAt)).limit(limit);
    const [totalResult] = await db.select({ count: count() }).from(chats);
    return {
        chats: list,
        total: totalResult?.count ?? 0,
    };
}

export async function getChatById(id: string) {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    if (!chat) return null;

    const msgList = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, id))
        .orderBy(messages.createdAt);

    return {
        ...chat,
        messages: msgList.map((m) => ({
            id: m.id,
            role: m.role as UIMessage["role"],
            parts: m.parts as UIMessage["parts"],
            createdAt: m.createdAt,
        })),
    };
}

export async function saveMessages(chatId: string, uiMessages: UIMessage[]) {
    // Guard against wiping a chat's history: a legitimate save always includes
    // at least the in-progress exchange, so an empty list here means something
    // upstream produced a bad/partial message set (SDK edge case, aborted
    // request, etc.) — never a valid "clear this chat" instruction.
    if (uiMessages.length === 0) {
        console.error(`saveMessages: refusing to save empty message list for chat ${chatId}`);
        return;
    }

    const now = new Date();

    // Update chat timestamp
    await db.update(chats)
        .set({ updatedAt: now })
        .where(eq(chats.id, chatId));

    // Delete existing messages and re-insert updated list to maintain sync
    await db.delete(messages).where(eq(messages.chatId, chatId));

    if (uiMessages.length > 0) {
        await db.insert(messages).values(
            uiMessages.map((msg) => ({
                id: msg.id || crypto.randomUUID(),
                chatId,
                role: msg.role,
                parts: msg.parts || [{ type: "text", text: "" }],
                createdAt: now,
            }))
        );
    }
}

export async function deleteChat(id: string) {
    await db.delete(chats).where(eq(chats.id, id));
}

export async function updateChatSummary(chatId: string, summary: string, summarizedMessageCount: number) {
    await db
        .update(chats)
        .set({ contextSummary: summary, summarizedMessageCount })
        .where(eq(chats.id, chatId));
}

export async function getPaginatedChats(page: number = 1, pageSize: number = 20, search: string = "") {
    const offset = (page - 1) * pageSize;
    const query = search ? ilike(chats.title, `%${search}%`) : undefined;

    const list = await db
        .select()
        .from(chats)
        .where(query)
        .orderBy(desc(chats.updatedAt))
        .limit(pageSize)
        .offset(offset);

    const [totalResult] = await db
        .select({ count: count() })
        .from(chats)
        .where(query);

    return {
        chats: list,
        total: totalResult?.count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((totalResult?.count ?? 0) / pageSize),
    };
}
