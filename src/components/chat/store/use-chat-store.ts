import { create } from "zustand";
import { toast } from "sonner";

export interface ChatItem {
    id: string;
    title: string;
    model: string;
    createdAt: string;
    updatedAt: string;
}

interface ChatStore {
    model: string;
    useWebSearch: boolean;
    input: string;
    reasoningEnabled: boolean;
    
    // Chat state
    currentChatId: string | null;
    recentChats: ChatItem[];
    totalRecentChats: number;
    recentChatsLoading: boolean;

    // Actions
    setModel: (model: string) => void;
    setUseWebSearch: (useWebSearch: boolean | ((prev: boolean) => boolean)) => void;
    setInput: (input: string | ((prev: string) => string)) => void;
    setReasoningEnabled: (reasoningEnabled: boolean | ((prev: boolean) => boolean)) => void;
    setCurrentChatId: (chatId: string | null) => void;
    fetchRecentChats: () => Promise<void>;
    addRecentChat: (chat: ChatItem) => void;
    deleteChat: (chatId: string) => Promise<void>;
}

// Guards fetchRecentChats against out-of-order responses: an older in-flight
// request must never clobber state set by a newer one.
let recentChatsFetchSeq = 0;
export const useChatStore = create<ChatStore>((set) => ({
    model: "gemma-4-e4b-it",
    useWebSearch: false,
    input: "",
    reasoningEnabled: true,
    currentChatId: null,
    recentChats: [],
    totalRecentChats: 0,
    recentChatsLoading: false,

    setModel: (model) => set({ model }),
    setUseWebSearch: (useWebSearch) =>
        set((state) => ({
            useWebSearch: typeof useWebSearch === "function" ? useWebSearch(state.useWebSearch) : useWebSearch,
        })),
    setInput: (input) =>
        set((state) => ({
            input: typeof input === "function" ? input(state.input) : input,
        })),
    setReasoningEnabled: (reasoningEnabled) =>
        set((state) => ({
            reasoningEnabled: typeof reasoningEnabled === "function" ? reasoningEnabled(state.reasoningEnabled) : reasoningEnabled,
        })),
    setCurrentChatId: (currentChatId) => set({ currentChatId }),

    fetchRecentChats: async () => {
        const seq = ++recentChatsFetchSeq;
        set({ recentChatsLoading: true });
        try {
            const res = await fetch("/api/chats");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (seq !== recentChatsFetchSeq) return;
            set({
                recentChats: data.chats,
                totalRecentChats: data.total,
                recentChatsLoading: false,
            });
        } catch (err) {
            console.error("fetchRecentChats error:", err);
            if (seq === recentChatsFetchSeq) {
                set({ recentChatsLoading: false });
            }
        }
    },

    addRecentChat: (chat) => {
        set((state) => {
            if (state.recentChats.some((c) => c.id === chat.id)) return state;
            return {
                recentChats: [chat, ...state.recentChats],
                totalRecentChats: state.totalRecentChats + 1,
            };
        });
    },

    deleteChat: async (chatId: string) => {
        try {
            const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete chat");
            toast.success("Chat deleted");
            
            // Remove from store list
            set((state) => ({
                recentChats: state.recentChats.filter((c) => c.id !== chatId),
                totalRecentChats: Math.max(0, state.totalRecentChats - 1),
            }));
        } catch (err) {
            toast.error("Failed to delete chat");
            console.error("deleteChat error:", err);
        }
    },
}));
