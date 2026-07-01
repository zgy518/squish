import { saveLicense, hasValidLicense } from "./storage";

/**
 * License key validation.
 *
 * MVP uses a simple hash-based check. Key format:
 *   SQUISH-XXXX-XXXX-XXXX
 *
 * When LemonSqueezy/Paddle becomes available, replace with API validation.
 * For MVP, we validate against pre-defined valid prefixes.
 *
 * To generate a valid key for a customer, use any key starting with one of
 * the VALID_PREFIXES below. Example: SQUISH-A3F7-C9A1-B2E8
 */

const VALID_PREFIXES = [
  "a3f7", "b2e8", "c1f5", "d4b9",
  "e8c3", "f6a1", "a9c4", "b5d2",
];

function isValidPattern(key: string): boolean {
  const clean = key.replace(/-/g, "").toLowerCase();
  // Check if the cleaned key starts with any valid prefix
  for (const prefix of VALID_PREFIXES) {
    if (clean.startsWith(prefix)) return true;
  }
  return false;
}

function isValidFormat(key: string): boolean {
  // SQUISH-XXXX-XXXX-XXXX where X is alphanumeric
  return /^SQUISH-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(key.trim());
}

export function validateLicenseKey(key: string): { valid: boolean; error?: string } {
  if (hasValidLicense()) {
    return { valid: false, error: "A license is already activated on this device." };
  }

  if (!key || !key.trim()) {
    return { valid: false, error: "Please enter a license key." };
  }

  if (!isValidFormat(key.trim())) {
    return {
      valid: false,
      error: "Invalid format. Key should be: SQUISH-XXXX-XXXX-XXXX",
    };
  }

  if (!isValidPattern(key.trim())) {
    return { valid: false, error: "Invalid license key. Please check and try again." };
  }

  // Valid! Save it
  saveLicense(key.trim().toUpperCase());
  return { valid: true };
}

/**
 * Generate a single valid license key for a paying customer.
 * Uses a valid prefix + random suffix to create unique keys.
 */
export function generateLicenseKey(): string {
  const prefix = VALID_PREFIXES[Math.floor(Math.random() * VALID_PREFIXES.length)];
  const segment = (): string =>
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const suffix = segment() + segment() + segment();
  return `SQUISH-${(prefix + suffix).slice(0, 4).toUpperCase()}-${segment()}-${segment()}`;
}

/**
 * Pre-made valid keys you can give to paying customers.
 * Each starts with a valid prefix so they'll pass validation.
 */
export const MANUAL_KEYS: string[] = [
  "SQUISH-A3F7-C9B1-E2D8",
  "SQUISH-B2E8-D4A7-F1C9",
  "SQUISH-C1F5-A9D3-B7E2",
  "SQUISH-D4B9-E8C2-A6F1",
  "SQUISH-E8C3-F6A1-D9B4",
];
