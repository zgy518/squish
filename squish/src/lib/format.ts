/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Calculate size reduction percentage
 */
export function reductionPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

/**
 * Validate if file is an acceptable image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  return validTypes.includes(file.type);
}

/**
 * Generate unique ID for image queue items
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
