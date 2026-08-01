"use client";

import { useChatStore } from "@/components/chat/store/use-chat-store";
import { useChatSession } from "@/components/chat/chat-context";
import { MessageList } from "@/components/chat/message-list";
import { SuggestionsList } from "@/components/chat/suggestions-list";
import { ChatInputArea } from "@/components/chat/chat-input-area";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
    const { reasoningEnabled } = useChatStore();
    const {
        messages,
        chatStatus,
        error,
        usedTokens,
        isFetching,
        isSummarizing,
        sendMessage,
        handleEdit,
        handleRegenerate,
        handleCopy,
        handleSuggestionClick,
    } = useChatSession();

    if (isFetching) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="relative flex h-[calc(100vh-80px)] flex-col divide-y overflow-hidden">
            <MessageList
                messages={messages}
                reasoningEnabled={reasoningEnabled}
                chatStatus={chatStatus}
                onEdit={handleEdit}
                onRegenerate={handleRegenerate}
                onCopy={handleCopy}
                error={error}
            />
            <div className="grid shrink-0 gap-4 pt-4">
                <SuggestionsList onSuggestionClick={handleSuggestionClick} />
                <ChatInputArea
                    sendMessage={sendMessage}
                    chatStatus={chatStatus}
                    usedTokens={usedTokens}
                    isSummarizing={isSummarizing}
                />
            </div>
        </div>
    );
}
