"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ConceptDetail as ConceptDetailType, PatchConceptRequest } from "@/lib/knowledge/types";

export function ConceptEditor({
  concept,
  onSaved,
  onCancel,
}: {
  concept: ConceptDetailType;
  onSaved: (updated: ConceptDetailType) => void;
  onCancel: () => void;
}) {
  const { frontmatter } = concept;
  const [title, setTitle] = React.useState(frontmatter.title ?? "");
  const [type, setType] = React.useState(frontmatter.type ?? "");
  const [description, setDescription] = React.useState(frontmatter.description ?? "");
  const [tags, setTags] = React.useState<string[]>(frontmatter.tags ?? []);
  const [tagInput, setTagInput] = React.useState("");
  const [body, setBody] = React.useState(concept.body);
  const [saving, setSaving] = React.useState(false);

  const addTag = () => {
    const next = tagInput.trim();
    if (next && !tags.includes(next)) setTags([...tags, next]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSave = async () => {
    setSaving(true);
    try {
      const patch: PatchConceptRequest = {
        action: "save",
        frontmatter: { title, type, description, tags },
        body,
      };
      const res = await fetch(`/api/knowledge/${concept.sourceSlug}/${concept.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to save concept");
      toast.success("Concept saved");
      onSaved(data as ConceptDetailType);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save concept");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Type</label>
          <Input value={type} onChange={(e) => setType(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Tags</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
            placeholder="Add tag…"
            className="h-7 w-32"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Body (markdown)</label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={18} className="font-mono text-sm" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
