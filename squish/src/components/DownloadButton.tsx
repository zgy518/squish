"use client";

import type { ImageFile } from "@/types";
import JSZip from "jszip";
import { formatFileSize } from "@/lib/format";

interface DownloadButtonProps {
  images: ImageFile[];
  disabled?: boolean;
}

export function DownloadButton({ images, disabled }: DownloadButtonProps) {
  const completedImages = images.filter((img) => img.status === "done" && img.result);
  const totalOriginal = completedImages.reduce((sum, img) => sum + img.result!.originalSize, 0);
  const totalCompressed = completedImages.reduce((sum, img) => sum + img.result!.compressedSize, 0);
  const saved = totalOriginal - totalCompressed;
  const percentage = totalOriginal > 0 ? Math.round((saved / totalOriginal) * 100) : 0;

  const handleDownloadSingle = (imageFile: ImageFile) => {
    if (!imageFile.result) return;
    const { compressedBlob, compressedSize } = imageFile.result;
    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement("a");
    link.href = url;
    // Add "-compressed" suffix to original filename
    const dotIndex = imageFile.file.name.lastIndexOf(".");
    const nameWithoutExt = imageFile.file.name.slice(0, dotIndex);
    const ext = imageFile.file.name.slice(dotIndex);
    link.download = `${nameWithoutExt}-compressed${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (const imageFile of completedImages) {
      if (!imageFile.result) continue;
      const dotIndex = imageFile.file.name.lastIndexOf(".");
      const nameWithoutExt = imageFile.file.name.slice(0, dotIndex);
      const ext = imageFile.file.name.slice(dotIndex);
      zip.file(`${nameWithoutExt}-compressed${ext}`, imageFile.result.compressedBlob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "squish-compressed.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-3">
      {completedImages.length > 0 && (
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-sm text-emerald-700">
            <span className="font-semibold">{formatFileSize(saved)}</span> saved
            {percentage > 0 && <> ({percentage}% reduction)</>}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {completedImages.length === 1 && (
          <button
            onClick={() => handleDownloadSingle(completedImages[0])}
            disabled={disabled}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white
              hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Compressed Image
          </button>
        )}

        {completedImages.length > 1 && (
          <button
            onClick={handleDownloadAll}
            disabled={disabled}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white
              hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download All ({completedImages.length} files) &middot; ZIP
          </button>
        )}
      </div>
    </div>
  );
}
