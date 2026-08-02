"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { countTokens, extractMessageText, SUMMARIZATION_TOKEN_THRESHOLD } from "@/lib/context/constants";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useChatStore } from "@/components/chat/store/use-chat-store";

interface ChatSession {
    messages: UIMessage[];
    chatStatus: "submitted" | "streaming" | "ready" | "error";
    error: Error | null;
    usedTokens: number;
    isFetching: boolean;
    isSummarizing: boolean;
    sendMessage: (text: string) => void;
    handleEdit: (editedText: string) => void;
    handleRegenerate: () => void;
    handleCopy: (text: string) => void;
    handleSuggestionClick: (suggestion: string) => void;
    dynamicSuggestions: string[] | null;
}

const ChatContext = createContext<ChatSession | null>(null);

export function useChatSession() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChatSession must be used within a ChatProvider");
    return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const params = useParams<{ chatId?: string[] }>();
    const chatIdFromUrl = params.chatId?.[0] || null;
    const router = useRouter();

    const { model, reasoningEnabled, useWebSearch, suggestionsEnabled, setCurrentChatId, fetchRecentChats, addRecentChat } = useChatStore();

    // Tracks which chatId's messages are currently loaded.
    // isFetching is derived from this — no synchronous setState needed in the effect.
    const [loadedChatId, setLoadedChatId] = useState<string | null>(null);
    // The id fed into useChat — deliberately decoupled from chatIdFromUrl so that
    // learning a newly-created chat's real DB id doesn't change this value mid-stream.
    // @ai-sdk/react recreates its internal Chat instance (wiping `messages`) whenever
    // this id changes, so it's only updated on genuine navigation (see effect below).
    // This now lives in a layout-hosted provider (not the page) so it actually survives
    // the router navigation that Next.js performs on every /chat -> /chat/<id> URL sync.
    const [chatHookId, setChatHookId] = useState<string>(chatIdFromUrl || "new-chat");
    const chatHookIdRef = useRef(chatHookId);
    chatHookIdRef.current = chatHookId;
    const isFetching = Boolean(chatIdFromUrl && loadedChatId !== chatIdFromUrl);
    const [error, setError] = useState<Error | null>(null);
    // Set right after creating a new chat, to the id we just got back from the
    // server. `router.replace` is a Next.js transition — it resolves in a LATER
    // render than the `setLoadedChatId` call right above it, so there's a real
    // intermediate render where `loadedChatId` is already the new id but
    // `chatIdFromUrl` is still null. Without this ref, the sync effect below
    // can't tell that apart from a genuine "navigated to /chat fresh" case, and
    // wrongly resets everything. Cleared once chatIdFromUrl catches up.
    const pendingChatIdRef = useRef<string | null>(null);
    // Context-compaction state: how many of the loaded chat's messages are already
    // folded into the server-persisted summary, plus in-flight tracking so a nav-away
    // or chat switch can abort a running compaction request instead of wasting compute.
    const [summarizedMessageCount, setSummarizedMessageCount] = useState(0);
    const [contextSummary, setContextSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const summarizeAbortRef = useRef<AbortController | null>(null);
    const [dynamicSuggestions, setDynamicSuggestions] = useState<string[] | null>(null);
    const suggestionsAbortRef = useRef<AbortController | null>(null);

    const maybeCompactContext = useCallback(
        async (targetChatId: string, msgs: UIMessage[], summarizedCount: number) => {
            const tailTokens = countTokens(
                msgs.slice(summarizedCount).map(extractMessageText).join("")
            );
            if (tailTokens < SUMMARIZATION_TOKEN_THRESHOLD) return;

            summarizeAbortRef.current?.abort();
            const controller = new AbortController();
            summarizeAbortRef.current = controller;
            setIsSummarizing(true);

            try {
                const res = await fetch(`/api/chats/${targetChatId}/summarize`, {
                    method: "POST",
                    signal: controller.signal,
                });
                if (res.ok) {
                    const data = await res.json();
                    if (typeof data.summarizedMessageCount === "number") {
                        setSummarizedMessageCount(data.summarizedMessageCount);
                    }
                    if (typeof data.summary === "string" || data.summary === null) {
                        setContextSummary(data.summary);
                    }
                }
            } catch (err) {
                if ((err as Error)?.name !== "AbortError") {
                    console.error("Context compaction failed:", err);
                }
            } finally {
                if (summarizeAbortRef.current === controller) {
                    setIsSummarizing(false);
                }
            }
        },
        []
    );

    const maybeGenerateSuggestions = useCallback(
        async (msgs: UIMessage[]) => {
            suggestionsAbortRef.current?.abort();
            const controller = new AbortController();
            suggestionsAbortRef.current = controller;

            try {
                const res = await fetch("/api/chat/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ model, messages: msgs.slice(-8) }),
                    signal: controller.signal,
                });
                if (res.ok) {
                    const data = await res.json();
                    setDynamicSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
                } else {
                    setDynamicSuggestions([]);
                }
            } catch (err) {
                if ((err as Error)?.name !== "AbortError") {
                    console.error("Suggestion generation failed:", err);
                    setDynamicSuggestions([]);
                }
            }
        },
        [model]
    );

    // Abort any in-flight compaction when switching chats or navigating away —
    // no point burning compute on a summary for a chat the user has left.
    useEffect(() => {
        return () => {
            summarizeAbortRef.current?.abort();
            suggestionsAbortRef.current?.abort();
        };
    }, [chatIdFromUrl]);

    // Update currentChatId in store when URL param changes
    useEffect(() => {
        setCurrentChatId(chatIdFromUrl);
    }, [chatIdFromUrl, setCurrentChatId]);

    // Turning suggestions off immediately reverts the chip row to static defaults
    // rather than leaving the last-generated set stuck on screen.
    useEffect(() => {
        if (!suggestionsEnabled) {
            suggestionsAbortRef.current?.abort();
            setDynamicSuggestions(null);
        }
    }, [suggestionsEnabled]);

    // Stable transport — recreated only when model, reasoningEnabled, or chatIdFromUrl changes
    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: "/api/chat",
                body: { model, reasoningEnabled, chatId: chatIdFromUrl, webSearch: useWebSearch },
            }),
        [model, reasoningEnabled, chatIdFromUrl, useWebSearch]
    );

    const { messages, setMessages, sendMessage: chatSendMessage, status: chatStatus } = useChat({
        id: chatHookId,
        transport,
        onFinish: ({ messages: finishedMessages }) => {
            fetchRecentChats();
            const targetChatId = chatIdFromUrl || loadedChatId;
            if (targetChatId) {
                void maybeCompactContext(targetChatId, finishedMessages, summarizedMessageCount);
            }
            if (suggestionsEnabled) {
                void maybeGenerateSuggestions(finishedMessages);
            }
        },
        onError: (err) => {
            console.error("Chat error:", err);
            // Ignore errors from a stream the user has since navigated away from —
            // state now persists across chat switches, so a late error from an
            // abandoned chat must not corrupt the currently-visible one.
            if (chatHookIdRef.current !== chatHookId) return;
            // Remove partial/incomplete assistant message before showing the error banner
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.slice(0, -1);
                return prev;
            });
            setError(err);
        },
    });

    // Fetch saved messages when chatId is present in URL or clear messages if starting a new chat.
    // isFetching is derived from (chatIdFromUrl !== loadedChatId) so no synchronous setState is needed here.
    useEffect(() => {
        // Mid chat-creation transition: chatIdFromUrl hasn't caught up to the
        // router.replace yet. Wait rather than treating this like a fresh
        // "navigated to /chat" reset.
        if (pendingChatIdRef.current) {
            if (chatIdFromUrl === pendingChatIdRef.current) {
                pendingChatIdRef.current = null;
            } else {
                return;
            }
        }

        if (!chatIdFromUrl) {
            setMessages([]);
            setChatHookId("new-chat");
            setLoadedChatId(null);
            setSummarizedMessageCount(0);
            setContextSummary(null);
            setDynamicSuggestions(null);
            return;
        }

        // Already have this chat's messages locally (e.g. just created inline) —
        // skip the DB refetch AND skip updating chatHookId, so `useChat`'s internal
        // Chat instance isn't recreated (which would silently reset messages to empty)
        // right as the URL syncs to the newly-created chat's real id.
        if (loadedChatId === chatIdFromUrl) {
            return;
        }

        setChatHookId(chatIdFromUrl);

        let isMounted = true;

        fetch(`/api/chats/${chatIdFromUrl}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load chat");
                return res.json();
            })
            .then((data) => {
                if (isMounted) {
                    const loadedMessages = data.messages || [];
                    const loadedSummarizedCount =
                        typeof data.summarizedMessageCount === "number" ? data.summarizedMessageCount : 0;
                    setMessages(loadedMessages);
                    setLoadedChatId(chatIdFromUrl);
                    setSummarizedMessageCount(loadedSummarizedCount);
                    setContextSummary(
                        typeof data.contextSummary === "string" ? data.contextSummary : null
                    );
                    setDynamicSuggestions(null);
                    void maybeCompactContext(chatIdFromUrl, loadedMessages, loadedSummarizedCount);
                }
            })
            .catch((err) => {
                console.error("Error loading chat:", err);
                if (isMounted) {
                    setMessages([]);
                    setLoadedChatId(chatIdFromUrl);
                    setSummarizedMessageCount(0);
                    setContextSummary(null);
                    setDynamicSuggestions(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [chatIdFromUrl, loadedChatId, setMessages, maybeCompactContext]);

    const sendMessage = useCallback(
        async (text: string) => {
            setError(null);
            let activeChatId = chatIdFromUrl || loadedChatId;

            // If starting a new conversation (no chatId in URL yet)
            if (!activeChatId) {
                try {
                    const res = await fetch("/api/chats", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: text, model }),
                    });
                    const data = await res.json();
                    if (data.chatId) {
                        activeChatId = data.chatId;
                        setCurrentChatId(activeChatId);
                        // Mark this chat's messages as already loaded so the load-effect above
                        // doesn't refetch from the DB and clobber the in-flight streaming state.
                        setLoadedChatId(activeChatId);
                        // Mark the transition as pending so the sync effect ignores the
                        // stale chatIdFromUrl===null render until the URL catches up.
                        pendingChatIdRef.current = activeChatId;
                        // Show it in the sidebar immediately — don't rely on fetchRecentChats()
                        // winning a race against the mount-time fetch (it may resolve later and
                        // clobber this chat right back out of the list while the reply streams).
                        addRecentChat({
                            id: activeChatId as string,
                            title: text.length > 50 ? text.slice(0, 50) + "..." : text,
                            model,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                        // Sync the URL via the real router API. This still triggers a Next.js
                        // navigation (Next patches history.pushState/replaceState globally, so
                        // there's no way to avoid that) — but that's fine now: this state lives
                        // in a layout-hosted provider, which Next does not tear down on
                        // navigation, unlike the page itself.
                        router.replace(`/chat/${activeChatId}`, { scroll: false });
                        fetchRecentChats();
                    }
                } catch (err) {
                    console.error("Failed to create chat in DB:", err);
                }
            }

            chatSendMessage(
                { text },
                {
                    body: {
                        chatId: activeChatId,
                    },
                }
            );
        },
        [chatIdFromUrl, loadedChatId, model, setCurrentChatId, chatSendMessage, fetchRecentChats, addRecentChat, router]
    );

    // --- Message action handlers ---

    const handleEdit = useCallback(
        (editedText: string) => {
            setError(null);

            // Strip last user + assistant pair from thread
            setMessages((prev) => {
                let stripped = [...prev];
                if (stripped[stripped.length - 1]?.role === "assistant") {
                    stripped = stripped.slice(0, -1);
                }
                if (stripped[stripped.length - 1]?.role === "user") {
                    stripped = stripped.slice(0, -1);
                }
                return stripped;
            });

            sendMessage(editedText);
        },
        [setMessages, sendMessage]
    );

    const handleRegenerate = useCallback(() => {
        setError(null);

        // Find last user message text before modifying the array
        let lastUserText = "";
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.role === "user") {
                if (Array.isArray(msg.parts) && msg.parts.length > 0) {
                    lastUserText = msg.parts
                        .filter((p) => p.type === "text")
                        .map((p) => (p as { text?: string }).text || "")
                        .join("");
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    lastUserText = (msg as any).content || "";
                }
                break;
            }
        }

        if (!lastUserText) return;

        // Strip the last assistant + user pair — chatSendMessage will append a fresh
        // user message, so we must remove the original to avoid a duplicate.
        setMessages((prev) => {
            let stripped = [...prev];
            if (stripped[stripped.length - 1]?.role === "assistant") {
                stripped = stripped.slice(0, -1);
            }
            if (stripped[stripped.length - 1]?.role === "user") {
                stripped = stripped.slice(0, -1);
            }
            return stripped;
        });

        sendMessage(lastUserText);
    }, [messages, setMessages, sendMessage]);

    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard");
        }).catch(() => {
            toast.error("Failed to copy to clipboard");
        });
    }, []);

    const handleSuggestionClick = useCallback(
        (suggestion: string) => {
            sendMessage(suggestion);
        },
        [sendMessage]
    );

    const usedTokens = useMemo(() => {
        const tail = messages.slice(summarizedMessageCount);
        const tailTokens = countTokens(tail.map(extractMessageText).join(""));
        const summaryTokens = countTokens(contextSummary || "");
        return summaryTokens + tailTokens;
    }, [messages, summarizedMessageCount, contextSummary]);

    const value: ChatSession = {
        messages,
        chatStatus,
        error,
        usedTokens,
        isFetching,
        isSummarizing,
        dynamicSuggestions,
        sendMessage,
        handleEdit,
        handleRegenerate,
        handleCopy,
        handleSuggestionClick,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
