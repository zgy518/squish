"use client";

import { useState, useCallback } from "react";
import type { ImageFile, OutputFormat } from "@/types";
import { generateId } from "@/lib/format";
import { compressImage } from "@/lib/compress";
import { compressToTargetSize } from "@/lib/targetSize";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { ImagePreview } from "@/components/ImagePreview";
import { QualitySlider } from "@/components/QualitySlider";
import { TargetSizeInput } from "@/components/TargetSizeInput";
import { DownloadButton } from "@/components/DownloadButton";

type CompressMode = "quality" | "target";

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mode, setMode] = useState<CompressMode>("quality");
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<OutputFormat | "original">("original");
  const [isProcessing, setIsProcessing] = useState(false);

  const isCompressing = images.some((img) => img.status === "compressing");

  const getOutputFormat = (file: File): OutputFormat | undefined => {
    if (format === "original") return undefined;
    return format;
  };

  const compressSingle = async (file: File, q: number, fmt?: OutputFormat) => {
    const { blob, width, height } = await compressImage({ file, quality: q, format: fmt });
    return { blob, width, height };
  };

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const newImages: ImageFile[] = files.map((file) => ({
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "idle",
      }));

      setImages((prev) => [...prev, ...newImages]);
      setIsProcessing(true);

      for (const img of newImages) {
        setImages((prev) =>
          prev.map((p) => (p.id === img.id ? { ...p, status: "compressing" } : p))
        );

        try {
          const outFmt = getOutputFormat(img.file);
          const { blob, width, height } = await compressSingle(img.file, quality, outFmt);

          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "done",
                    result: {
                      originalFile: img.file,
                      compressedBlob: blob,
                      originalSize: img.file.size,
                      compressedSize: blob.size,
                      quality,
                      width,
                      height,
                    },
                  }
                : p
            )
          );
        } catch (err) {
          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "error",
                    error: err instanceof Error ? err.message : "Compression failed",
                  }
                : p
            )
          );
        }
      }

      setIsProcessing(false);
    },
    [quality, format]
  );

  const handleQualityChange = useCallback(
    async (newQuality: number) => {
      setQuality(newQuality);

      const compressible = images.filter((img) => img.status === "done" || img.status === "idle");
      if (compressible.length === 0) return;

      setIsProcessing(true);

      for (const img of compressible) {
        setImages((prev) =>
          prev.map((p) => (p.id === img.id ? { ...p, status: "compressing" } : p))
        );

        try {
          const outFmt = getOutputFormat(img.file);
          const { blob, width, height } = await compressSingle(img.file, newQuality, outFmt);

          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "done",
                    result: {
                      originalFile: img.file,
                      compressedBlob: blob,
                      originalSize: img.file.size,
                      compressedSize: blob.size,
                      quality: newQuality,
                      width,
                      height,
                    },
                  }
                : p
            )
          );
        } catch (err) {
          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "error",
                    error: err instanceof Error ? err.message : "Compression failed",
                  }
                : p
            )
          );
        }
      }

      setIsProcessing(false);
    },
    [images, format]
  );

  const handleTargetSize = useCallback(
    async (targetKB: number) => {
      const compressible = images.filter((img) => img.status === "done" || img.status === "idle");
      if (compressible.length === 0) return;

      setIsProcessing(true);

      for (const img of compressible) {
        setImages((prev) =>
          prev.map((p) => (p.id === img.id ? { ...p, status: "compressing" } : p))
        );

        try {
          const outFmt = getOutputFormat(img.file);
          const result = await compressToTargetSize(img.file, targetKB, outFmt);

          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "done",
                    result: {
                      originalFile: img.file,
                      compressedBlob: result.blob,
                      originalSize: img.file.size,
                      compressedSize: result.blob.size,
                      quality: result.quality,
                      width: result.width,
                      height: result.height,
                    },
                  }
                : p
            )
          );
        } catch (err) {
          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "error",
                    error: err instanceof Error ? err.message : "Compression failed",
                  }
                : p
            )
          );
        }
      }

      setIsProcessing(false);
    },
    [images, format]
  );

  const handleRemove = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleFormatChange = useCallback(
    async (newFormat: OutputFormat | "original") => {
      setFormat(newFormat);

      const compressible = images.filter((img) => img.status === "done" || img.status === "idle");
      if (compressible.length === 0) return;

      setIsProcessing(true);
      const outFmt = newFormat === "original" ? undefined : newFormat;

      for (const img of compressible) {
        setImages((prev) =>
          prev.map((p) => (p.id === img.id ? { ...p, status: "compressing" } : p))
        );

        try {
          const { blob, width, height } = await compressSingle(img.file, quality, outFmt);

          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "done",
                    result: {
                      originalFile: img.file,
                      compressedBlob: blob,
                      originalSize: img.file.size,
                      compressedSize: blob.size,
                      quality,
                      width,
                      height,
                    },
                  }
                : p
            )
          );
        } catch (err) {
          setImages((prev) =>
            prev.map((p) =>
              p.id === img.id
                ? {
                    ...p,
                    status: "error",
                    error: err instanceof Error ? err.message : "Compression failed",
                  }
                : p
            )
          );
        }
      }

      setIsProcessing(false);
    },
    [images, quality]
  );

  const hasImages = images.length > 0;
  const allDone = hasImages && images.every((img) => img.status === "done" || img.status === "error");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          {/* Hero — hides when images are present */}
          {!hasImages && (
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                Squish your images
              </h1>
              <p className="mt-3 text-lg text-zinc-500">
                Compress JPG, PNG, and WebP images right in your browser.
                <br />
                Nothing is uploaded — your files stay private.
              </p>
            </div>
          )}

          {/* Upload zone */}
          <div className="mb-6">
            <UploadZone onFilesSelected={handleFilesSelected} disabled={isCompressing} />
          </div>

          {/* Compression controls — show when images exist */}
          {hasImages && (
            <div className="mb-6 space-y-4">
              {/* Mode toggle */}
              <div className="flex rounded-xl bg-white border border-zinc-200 p-1 gap-1">
                <button
                  onClick={() => setMode("quality")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    mode === "quality"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Quality
                </button>
                <button
                  onClick={() => setMode("target")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    mode === "target"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  🎯 Target Size
                </button>
              </div>

              {/* Quality mode */}
              {mode === "quality" && (
                <QualitySlider
                  quality={quality}
                  onChange={handleQualityChange}
                  disabled={isCompressing}
                />
              )}

              {/* Target size mode */}
              {mode === "target" && (
                <TargetSizeInput
                  onCompress={handleTargetSize}
                  disabled={isCompressing}
                  isCompressing={isCompressing}
                />
              )}

              {/* Format selector */}
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="text-zinc-500">Convert to:</span>
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as OutputFormat | "original")}
                  disabled={isCompressing}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm
                    focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
                    disabled:opacity-50"
                >
                  <option value="original">Original format</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>
          )}

          {/* Image list */}
          {hasImages && (
            <div className="mb-8 space-y-3">
              {images.map((img, i) => (
                <ImagePreview
                  key={img.id}
                  imageFile={img}
                  index={i}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}

          {/* Download section */}
          {allDone && !isCompressing && <DownloadButton images={images} />}

          {/* Features — only when no images */}
          {!hasImages && (
            <div className="mt-20 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 mx-auto">
                  <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">100% Private</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  All processing in your browser. Images never uploaded.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 mx-auto">
                  <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">Exact Target Size</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Need exactly 100KB? We find the right quality for your target.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 mx-auto">
                  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">Format Conversion</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Convert between JPG, PNG, and WebP while compressing.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-zinc-400 sm:px-6">
          &copy; {new Date().getFullYear()} Squish. All processing happens in your browser.
        </div>
      </footer>
    </div>
  );
}
