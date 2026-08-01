import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
    Message,
    MessageContent,
    MessageResponse,
} from "@/components/ai-elements/message";
import {
    Reasoning,
    ReasoningTrigger,
    ReasoningContent,
} from "@/components/ai-elements/reasoning";
import {
    InlineCitation,
    InlineCitationCard,
    InlineCitationCardBody,
    InlineCitationCardTrigger,
    InlineCitationSource,
} from "@/components/ai-elements/inline-citation";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
    AssistantMessageActions,
    UserMessageWithActions,
} from "@/components/chat/message-actions";
import { Button } from "@/components/ui/button";
import type { UIMessage, ChatStatus } from "ai";
import type { ComponentProps } from "react";
import { AlertCircleIcon } from "lucide-react";

interface MessageListProps {
    messages: UIMessage[];
    reasoningEnabled?: boolean;
    chatStatus?: ChatStatus;
    onEdit?: (editedText: string) => void;
    onRegenerate?: () => void;
    onCopy?: (text: string) => void;
    error?: Error | null;
}

function parseMessageContent(message: UIMessage) {
    let nativeReasoning = "";
    let rawText = "";

    if (Array.isArray(message.parts) && message.parts.length > 0) {
        nativeReasoning = message.parts
            .filter((p) => p.type === "reasoning")
            .map((p) => (p as { text?: string; reasoning?: string }).text || (p as { reasoning?: string }).reasoning || "")
            .join("");

        rawText = message.parts
            .filter((p) => p.type === "text")
            .map((p) => (p as { text?: string }).text || "")
            .join("");
    } else {
        rawText = (message as any).content || "";
    }

    // Regex fallback to extract <think>...</think> from text content
    let fallbackReasoning = "";
    const thinkRegex = /<think>([\s\S]*?)(<\/think>|$)/gi;
    let match;

    while ((match = thinkRegex.exec(rawText)) !== null) {
        fallbackReasoning += match[1];
    }

    // Remove <think>...</think> from text content so it isn't rendered twice
    const cleanTextContent = rawText.replace(/<think>[\s\S]*?(<\/think>|$)/gi, "").trim();
    const reasoningText = (nativeReasoning + fallbackReasoning).trim();

    return {
        reasoningText,
        textContent: cleanTextContent,
    };
}

interface ConceptCitation {
    title: string;
    url: string;
    description?: string;
}

/** Collects `[cite:<id>]`-able sources from any completed `searchKnowledgeBase` tool
 * results in a message, keyed by the concept id the model was told to cite. */
function collectCitationSources(message: UIMessage): Map<string, ConceptCitation> {
    const sources = new Map<string, ConceptCitation>();
    if (!Array.isArray(message.parts)) return sources;

    for (const part of message.parts) {
        if (part.type !== "tool-searchKnowledgeBase" && part.type !== "tool-webSearch") continue;
        const toolPart = part as { state?: string; output?: { results?: { id: string; title: string; url: string; description?: string }[] } };
        if (toolPart.state !== "output-available") continue;
        for (const result of toolPart.output?.results ?? []) {
            sources.set(result.id, { title: result.title, url: result.url, description: result.description });
        }
    }
    return sources;
}

const CITE_MARKER_RE = /\[cite:([^\]]+)\]/g;

/** Rewrites `[cite:id]` markers into markdown links Streamdown can hand to a custom
 * `a` renderer, and drops a dangling partial marker at the very end of in-flight text. */
const CITATION_URL_PREFIX = "https://citation.internal/";

function toCitationMarkdown(text: string): string {
    const withLinks = text.replace(CITE_MARKER_RE, (_match, id: string) => `[cite](${CITATION_URL_PREFIX}${encodeURIComponent(id)})`);
    return withLinks.replace(/\[cite:[^\]]*$/, "");
}

type CitationAnchorProps = ComponentProps<"a"> & { node?: unknown };

function createCitationAnchor(sources: Map<string, ConceptCitation>) {
    return function CitationAnchor({ href, children, node: _node, ...props }: CitationAnchorProps) {
        if (href?.startsWith(CITATION_URL_PREFIX)) {
            const source = sources.get(decodeURIComponent(href.slice(CITATION_URL_PREFIX.length)));
            if (!source) return null;
            const origin = typeof window !== "undefined" ? window.location.origin : "https://knowledge-base.local";
            const badgeSources = [new URL(source.url, origin).toString()];
            return (
                <InlineCitation>
                    <InlineCitationCard>
                        <InlineCitationCardTrigger sources={badgeSources} label={source.title} />
                        <InlineCitationCardBody>
                            <div className="p-4">
                                <InlineCitationSource
                                    title={source.title}
                                    url={source.url}
                                    description={source.description}
                                />
                            </div>
                        </InlineCitationCardBody>
                    </InlineCitationCard>
                </InlineCitation>
            );
        }
        return (
            <a href={href} {...props}>
                {children}
            </a>
        );
    };
}

export const MessageList = ({
    messages,
    reasoningEnabled = true,
    chatStatus = "ready",
    onEdit,
    onRegenerate,
    onCopy,
    error,
}: MessageListProps) => {
    // Identify the last user and assistant message indices for action placement
    let lastUserIndex = -1;
    let lastAssistantIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
        if (lastAssistantIndex === -1 && messages[i].role === "assistant") {
            lastAssistantIndex = i;
        }
        if (lastUserIndex === -1 && messages[i].role === "user") {
            lastUserIndex = i;
        }
        if (lastUserIndex !== -1 && lastAssistantIndex !== -1) break;
    }

    const hasActionCallbacks = Boolean(onEdit && onRegenerate && onCopy);

    return (
        <Conversation>
            <ConversationContent>
                {messages.map((message, index) => {
                    const isAssistant = message.role === "assistant";
                    const isLastMessage = index === messages.length - 1;
                    const isStreaming = isLastMessage && chatStatus === "streaming";
                    const isLastUser = !isAssistant && index === lastUserIndex;
                    const isLastAssistant = isAssistant && index === lastAssistantIndex;

                    const { reasoningText, textContent } = parseMessageContent(message);
                    const citationSources = isAssistant ? collectCitationSources(message) : new Map<string, ConceptCitation>();

                    const isWaiting =
                        isAssistant &&
                        isLastMessage &&
                        (chatStatus === "submitted" ||
                            (chatStatus === "streaming" && !reasoningText && !textContent));

                    // Last user message — rendered with inline edit + action buttons
                    if (isLastUser && hasActionCallbacks) {
                        return (
                            <Message from="user" key={message.id}>
                                <UserMessageWithActions
                                    messageText={textContent}
                                    chatStatus={chatStatus}
                                    onEdit={onEdit!}
                                    onRegenerate={onRegenerate!}
                                    onCopy={onCopy!}
                                />
                            </Message>
                        );
                    }

                    return (
                        <Message
                            from={message.role === "user" ? "user" : "assistant"}
                            key={message.id}
                        >
                            <div>
                                <MessageContent>
                                    {isWaiting ? (
                                        <Shimmer className="text-sm" duration={2}>
                                            Thinking…
                                        </Shimmer>
                                    ) : (
                                        <>
                                            {isAssistant && reasoningEnabled && (
                                                <>
                                                    {reasoningText || isStreaming ? (
                                                        <Reasoning isStreaming={isStreaming}>
                                                            <ReasoningTrigger />
                                                            <ReasoningContent>{reasoningText}</ReasoningContent>
                                                        </Reasoning>
                                                    ) : (
                                                        <Reasoning defaultOpen={false}>
                                                            <ReasoningTrigger getThinkingMessage={() => <p>No reasoning found</p>} />
                                                            <ReasoningContent>No reasoning was generated by the model.</ReasoningContent>
                                                        </Reasoning>
                                                    )}
                                                </>
                                            )}
                                            {isAssistant && citationSources.size > 0 ? (
                                                <MessageResponse components={{ a: createCitationAnchor(citationSources) }}>
                                                    {toCitationMarkdown(textContent)}
                                                </MessageResponse>
                                            ) : (
                                                <MessageResponse>{textContent}</MessageResponse>
                                            )}
                                        </>
                                    )}
                                </MessageContent>

                                {/* Action buttons for the last assistant message */}
                                {isLastAssistant && !isWaiting && onRegenerate && onCopy && (
                                    <AssistantMessageActions
                                        messageText={textContent}
                                        chatStatus={chatStatus}
                                        onRegenerate={onRegenerate}
                                        onCopy={onCopy}
                                    />
                                )}
                            </div>
                        </Message>
                    );
                })}

                {/* Error banner — shown when an API error occurs */}
                {error && (
                    <div className="mx-2 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircleIcon className="size-4 shrink-0" />
                        <span className="flex-1">Something went wrong. Please try again.</span>
                        {onRegenerate && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRegenerate}
                                className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                            >
                                Retry
                            </Button>
                        )}
                    </div>
                )}
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
    );
};
