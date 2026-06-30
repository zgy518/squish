"use client";

import type { ImageFile } from "@/types";
import { formatFileSize, reductionPercent } from "@/lib/format";

interface ImagePreviewProps {
  imageFile: ImageFile;
  index: number;
  onRemove: (id: string) => void;
}

export function ImagePreview({ imageFile, index, onRemove }: ImagePreviewProps) {
  const { id, file, previewUrl, status, result } = imageFile;
  const isCompressed = status === "done" && result;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Thumbnails */}
        <div className="flex gap-3">
          {/* Original */}
          <div className="flex-shrink-0">
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Original</p>
            <img
              src={previewUrl}
              alt={file.name}
              className="h-24 w-24 rounded-lg border border-zinc-200 object-cover"
            />
            <p className="mt-1 text-xs text-zinc-600">{formatFileSize(file.size)}</p>
          </div>

          {/* Compressed */}
          {isCompressed && (
            <div className="flex-shrink-0">
              <p className="mb-1.5 text-xs font-medium text-emerald-600">Compressed</p>
              <img
                src={URL.createObjectURL(result.compressedBlob)}
                alt={`Compressed ${file.name}`}
                className="h-24 w-24 rounded-lg border-2 border-emerald-200 object-cover"
              />
              <p className="mt-1 text-xs text-emerald-600">
                {formatFileSize(result.compressedSize)}
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900" title={file.name}>
            {file.name}
          </p>

          {isCompressed && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {reductionPercent(file.size, result.compressedSize)}% smaller
              </span>
            </div>
          )}

          {status === "compressing" && (
            <p className="mt-2 text-xs text-indigo-600 animate-pulse">
              Compressing...
            </p>
          )}

          {status === "error" && (
            <p className="mt-2 text-xs text-red-600">{imageFile.error || "Error"}</p>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          title="Remove"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
