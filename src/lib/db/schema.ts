import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    model: text("model").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull(),
});

export const messages = pgTable("messages", {
    id: text("id").primaryKey(),
    chatId: text("chat_id")
        .notNull()
        .references(() => chats.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    parts: jsonb("parts").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull(),
});
