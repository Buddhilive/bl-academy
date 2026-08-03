import { escapeLiteral } from "pg";
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";

export const DUMP_MAGIC_HEADER = "-- buddhi-ai-os backup v1";

const INSERT_BATCH_SIZE = 500;

export class DumpValidationError extends Error {}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new DumpValidationError(`Non-finite number in dump: ${value}`);
    return String(value);
  }
  if (value instanceof Date) return `${escapeLiteral(value.toISOString())}::timestamptz`;
  if (typeof value === "object") return `${escapeLiteral(JSON.stringify(value))}::jsonb`;
  return escapeLiteral(String(value));
}

function insertStatements(table: string, columns: string[], rows: Record<string, unknown>[]): string[] {
  const statements: string[] = [];
  for (let i = 0; i < rows.length; i += INSERT_BATCH_SIZE) {
    const batch = rows.slice(i, i + INSERT_BATCH_SIZE);
    const tuples = batch.map((row) => `  (${columns.map((c) => sqlValue(row[c])).join(", ")})`).join(",\n");
    statements.push(`INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${tuples};`);
  }
  return statements;
}

export async function buildDumpSql(): Promise<{ sql: string; counts: { chats: number; messages: number } }> {
  const chatRows = await db.select().from(chats);
  const messageRows = await db.select().from(messages);

  const chatColumns = ["id", "title", "model", "created_at", "updated_at", "context_summary", "summarized_message_count"];
  const chatValues = chatRows.map((r) => ({
    id: r.id,
    title: r.title,
    model: r.model,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
    context_summary: r.contextSummary,
    summarized_message_count: r.summarizedMessageCount,
  }));

  const messageColumns = ["id", "chat_id", "role", "parts", "created_at"];
  const messageValues = messageRows.map((r) => ({
    id: r.id,
    chat_id: r.chatId,
    role: r.role,
    parts: r.parts,
    created_at: r.createdAt,
  }));

  const parts = [
    DUMP_MAGIC_HEADER,
    `-- generated ${new Date().toISOString()}`,
    "TRUNCATE TABLE messages, chats RESTART IDENTITY CASCADE;",
    "",
    ...(chatValues.length > 0 ? insertStatements("chats", chatColumns, chatValues) : []),
    "",
    ...(messageValues.length > 0 ? insertStatements("messages", messageColumns, messageValues) : []),
  ];

  return {
    sql: parts.join("\n"),
    counts: { chats: chatRows.length, messages: messageRows.length },
  };
}

export function assertDumpSqlIsWellFormed(dumpSql: string): void {
  if (!dumpSql.startsWith(DUMP_MAGIC_HEADER)) {
    throw new DumpValidationError("db/dump.sql is missing the expected backup header — not a buddhi-ai-os dump");
  }
}

/** Runs TRUNCATE + INSERTs in one transaction — any failure rolls back cleanly,
 * leaving the live database completely untouched. */
export async function restoreFromDumpSql(dumpSql: string): Promise<void> {
  assertDumpSqlIsWellFormed(dumpSql);
  await db.transaction(async (tx) => {
    await tx.execute(sql.raw(dumpSql));
  });
}
