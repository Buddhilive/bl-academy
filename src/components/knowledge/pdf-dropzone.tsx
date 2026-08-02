"use client";

import { UploadIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export const MAX_UPLOAD_MB = 30;

export interface PdfDropzoneProps {
  onFileSelected: (file: File) => void;
  onRejected: (message: string) => void;
  disabled?: boolean;
}

function validate(file: File): string | null {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return `"${file.name}" isn't a PDF file.`;
  if (file.size === 0) return `"${file.name}" is empty.`;
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `"${file.name}" exceeds the ${MAX_UPLOAD_MB}MB limit.`;
  return null;
}

export function PdfDropzone({ onFileSelected, onRejected, disabled }: PdfDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const error = validate(file);
      if (error) {
        onRejected(error);
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected, onRejected]
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary/60"
      )}
    >
      <UploadIcon className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium">Drop a PDF here, or click to browse</p>
      <p className="text-xs text-muted-foreground">Up to {MAX_UPLOAD_MB}MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
