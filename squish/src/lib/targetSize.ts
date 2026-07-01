import { compressImage } from "./compress";
import type { OutputFormat } from "@/types";

export interface TargetSizeResult {
  blob: Blob;
  quality: number;
  width: number;
  height: number;
  iterations: number;
  exactMatch: boolean;
}

/**
 * Compress an image to a target file size using binary search on quality.
 *
 * @param file      - Source image file
 * @param targetKB  - Desired output size in kilobytes
 * @param format    - Output image format
 * @param tolerance - Acceptable deviation from target (0.05 = 5%)
 *
 * Binary search over quality [0.01, 1.0]. Each iteration compresses and
 * checks the resulting blob size against the target. Stops when within
 * tolerance, or after maxIterations.
 */
export async function compressToTargetSize(
  file: File,
  targetKB: number,
  format?: OutputFormat,
  tolerance: number = 0.05
): Promise<TargetSizeResult> {
  const targetBytes = targetKB * 1024;
  const maxIterations = 12;

  let low = 0.01;
  let high = 1.0;
  let bestResult: { blob: Blob; quality: number; width: number; height: number } | null = null;
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;
    const mid = (low + high) / 2;

    const { blob, width, height } = await compressImage({
      file,
      quality: mid,
      format,
    });

    const sizeDiff = blob.size - targetBytes;
    const percentOff = Math.abs(sizeDiff) / targetBytes;

    // Keep track of the closest result so far
    if (
      bestResult === null ||
      Math.abs(blob.size - targetBytes) < Math.abs(bestResult.blob.size - targetBytes)
    ) {
      bestResult = { blob, quality: mid, width, height };
    }

    // Within tolerance — great result
    if (percentOff <= tolerance) {
      return {
        blob,
        quality: mid,
        width,
        height,
        iterations,
        exactMatch: true,
      };
    }

    // Binary search direction
    if (blob.size > targetBytes) {
      high = mid; // Too big → lower quality
    } else {
      low = mid; // Too small → raise quality
    }
  }

  // Return best approximation after max iterations
  return {
    blob: bestResult!.blob,
    quality: bestResult!.quality,
    width: bestResult!.width,
    height: bestResult!.height,
    iterations,
    exactMatch: false,
  };
}

/**
 * Estimate what quality is needed to reach a target size based on
 * a quick sample compression. Falls back to a heuristic.
 */
export async function estimateQuality(
  file: File,
  targetKB: number
): Promise<number> {
  // Try a quick test at quality 0.5 to calibrate
  const { blob: sampleBlob } = await compressImage({ file, quality: 0.5 });
  const sampleSize = sampleBlob.size;
  const targetBytes = targetKB * 1024;

  if (sampleSize <= targetBytes) {
    // Target is larger than 50% quality result — interpolate upward
    return Math.min(1.0, 0.5 + (targetBytes - sampleSize) / sampleSize * 0.5);
  } else {
    // Target is smaller — need lower quality
    const ratio = targetBytes / sampleSize;
    return Math.max(0.01, ratio * 0.5);
  }
}
