// Image compression types

export interface CompressionResult {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  quality: number;
  width: number;
  height: number;
}

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  status: "idle" | "compressing" | "done" | "error";
  result?: CompressionResult;
  error?: string;
}

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export interface CompressionOptions {
  quality: number;
  format: OutputFormat;
  maxWidth?: number;
  maxHeight?: number;
}
