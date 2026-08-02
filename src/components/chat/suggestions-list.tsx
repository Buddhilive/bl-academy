import { useCallback } from "react";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

const SuggestionItem = ({
    suggestion,
    onClick,
}: {
    suggestion: string;
    onClick: (suggestion: string) => void;
}) => {
    const handleSelect = useCallback(() => {
        onClick(suggestion);
    }, [onClick, suggestion]);

    return <Suggestion onClick={handleSelect} suggestion={suggestion} />;
};

interface SuggestionsListProps {
    onSuggestionClick: (suggestion: string) => void;
    /**
     * Dynamically generated suggestions for the ongoing conversation.
     * `null`/`undefined`/`[]` — nothing to show, hide the row entirely.
     */
    suggestions?: string[] | null;
}

export const SuggestionsList = ({ onSuggestionClick, suggestions }: SuggestionsListProps) => {
    const resolvedSuggestions = suggestions ?? [];

    if (resolvedSuggestions.length === 0) {
        return null;
    }

    return (
        <Suggestions className="px-4">
            {resolvedSuggestions.map((suggestion) => (
                <SuggestionItem
                    key={suggestion}
                    onClick={onSuggestionClick}
                    suggestion={suggestion}
                />
            ))}
        </Suggestions>
    );
};
