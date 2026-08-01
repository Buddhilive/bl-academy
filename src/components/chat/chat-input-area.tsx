import { useCallback, useMemo } from "react";
import {
    Attachment,
    AttachmentPreview,
    AttachmentRemove,
    Attachments,
    type AttachmentData,
} from "@/components/ai-elements/attachments";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputBody,
    PromptInputFooter,
    PromptInputHeader,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
    usePromptInputAttachments,
    PromptInputButton,
} from "@/components/ai-elements/prompt-input";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import { useChatStore } from "./store/use-chat-store";
import type { ChatStatus } from "ai";
import { toast } from "sonner";
import { BrainIcon, GlobeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { encode } from "gpt-tokenizer";
import {
    Context,
    ContextContent,
    ContextContentBody,
    ContextContentFooter,
    ContextContentHeader,
    ContextInputUsage,
    ContextOutputUsage,
    ContextTrigger,
} from "@/components/ai-elements/context";

const DEFAULT_MAX_CONTEXT_TOKENS = 32000;

const AttachmentItem = ({
    attachment,
    onRemove,
}: {
    attachment: AttachmentData;
    onRemove: (id: string) => void;
}) => {
    const handleRemove = useCallback(() => {
        onRemove(attachment.id);
    }, [onRemove, attachment.id]);

    return (
        <Attachment data={attachment} onRemove={handleRemove}>
            <AttachmentPreview />
            <AttachmentRemove />
        </Attachment>
    );
};

const PromptInputAttachmentsDisplay = () => {
    const attachments = usePromptInputAttachments();

    const handleRemove = useCallback(
        (id: string) => {
            attachments.remove(id);
        },
        [attachments]
    );

    if (attachments.files.length === 0) {
        return null;
    }

    return (
        <Attachments variant="inline">
            {attachments.files.map((attachment) => (
                <AttachmentItem
                    attachment={attachment}
                    key={attachment.id}
                    onRemove={handleRemove}
                />
            ))}
        </Attachments>
    );
};

interface ChatInputAreaProps {
    sendMessage: (text: string) => void;
    chatStatus: ChatStatus;
    usedTokens?: number;
}

export const ChatInputArea = ({ sendMessage, chatStatus, usedTokens = 0 }: ChatInputAreaProps) => {
    const {
        input,
        setInput,
        model,
        reasoningEnabled,
        setReasoningEnabled,
        useWebSearch,
        setUseWebSearch,
    } = useChatStore();

    const handleTextChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setInput(event.target.value);
        },
        [setInput]
    );

    const handleTranscriptionChange = useCallback(
        (transcript: string) => {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        [setInput]
    );

    const handleSubmit = useCallback(
        (message: PromptInputMessage) => {
            const hasText = Boolean(message.text?.trim());
            const hasAttachments = Boolean(message.files?.length);

            if (!(hasText || hasAttachments)) {
                return;
            }

            if (message.files?.length) {
                toast.success("Files attached", {
                    description: `${message.files.length} file(s) attached to message`,
                });
            }

            sendMessage(message.text?.trim() || "Sent with attachments");
            setInput("");
        },
        [sendMessage, setInput]
    );

    const liveUsedTokens = useMemo(() => {
        const inputTokens = input ? encode(input).length : 0;
        return usedTokens + inputTokens;
    }, [input, usedTokens]);

    const isSubmitDisabled = useMemo(
        () =>
            !(input || "").trim() ||
            chatStatus === "streaming" ||
            chatStatus === "submitted" ||
            !model,
        [input, chatStatus, model]
    );

    return (
        <div className="w-full px-4 pb-4">
            <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                <PromptInputHeader>
                    <PromptInputAttachmentsDisplay />
                </PromptInputHeader>
                <PromptInputBody>
                    <PromptInputTextarea onChange={handleTextChange} value={input} />
                </PromptInputBody>
                <PromptInputFooter>
                    <PromptInputTools>
                        <PromptInputActionMenu>
                            <PromptInputActionMenuTrigger />
                            <PromptInputActionMenuContent>
                                <PromptInputActionAddAttachments />
                            </PromptInputActionMenuContent>
                        </PromptInputActionMenu>
                        <SpeechInput
                            className="shrink-0"
                            onTranscriptionChange={handleTranscriptionChange}
                            size="icon-sm"
                            variant="ghost"
                        />
                        <PromptInputButton
                            onClick={() => setReasoningEnabled((prev) => !prev)}
                            tooltip={reasoningEnabled ? "Disable reasoning" : "Enable reasoning"}
                            aria-pressed={reasoningEnabled}
                            className={cn(
                                "shrink-0 transition-colors",
                                reasoningEnabled ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <BrainIcon className="size-4" />
                        </PromptInputButton>
                        <PromptInputButton
                            onClick={() => setUseWebSearch((prev) => !prev)}
                            tooltip={useWebSearch ? "Disable web search" : "Enable web search"}
                            aria-pressed={useWebSearch}
                            className={cn(
                                "shrink-0 transition-colors",
                                useWebSearch ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <GlobeIcon className="size-4" />
                        </PromptInputButton>
                    </PromptInputTools>
                    <div className="flex items-center gap-2">
                        <Context 
                            maxTokens={DEFAULT_MAX_CONTEXT_TOKENS} 
                            usedTokens={liveUsedTokens} 
                            // @ts-expect-error ai sdk usage type compatibility
                            usage={{ promptTokens: liveUsedTokens, completionTokens: 0, totalTokens: liveUsedTokens, inputTokens: liveUsedTokens, outputTokens: 0 }}
                        >
                            <ContextTrigger />
                            <ContextContent>
                                <ContextContentHeader />
                                <ContextContentBody>
                                    <ContextInputUsage />
                                    <ContextOutputUsage />
                                </ContextContentBody>
                                <ContextContentFooter />
                            </ContextContent>
                        </Context>
                        <PromptInputSubmit disabled={isSubmitDisabled} status={chatStatus} />
                    </div>
                </PromptInputFooter>
            </PromptInput>
        </div>
    );
};
