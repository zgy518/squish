import type { OutputFormat } from "@/types";

export interface CompressParams {
  file: File;
  quality: number;
  format?: OutputFormat;
}

/**
 * Load an image from a File and return an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress an image using Canvas API
 * Returns the compressed blob, along with width/height info
 */
export async function compressImage(params: CompressParams): Promise<{
  blob: Blob;
  width: number;
  height: number;
}> {
  const { file, quality, format } = params;
  const outputType = format || (file.type as OutputFormat) || "image/jpeg";

  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.drawImage(img, 0, 0);

  // For PNG output with transparent background, fill white
  // (PNG transparency is preserved when format is PNG)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Compression failed"));
          return;
        }
        resolve({
          blob,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      },
      outputType,
      quality
    );
  });
}

/**
 * Get image dimensions without compressing
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  return { width: img.naturalWidth, height: img.naturalHeight };
}
