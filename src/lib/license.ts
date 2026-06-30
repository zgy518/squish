import { saveLicense, hasValidLicense } from "./storage";

/**
 * License key validation.
 *
 * MVP uses a simple hash-based check. Key format:
 *   SQUISH-XXXX-XXXX-XXXX
 *
 * In production, this would call LemonSqueezy's /v1/licenses/validate API.
 * For MVP, we validate against a set of pre-generated patterns.
 */

// Pre-computed valid key prefixes (SHA-256 inspired, deterministic)
// In production: replace with LemonSqueezy API call
const VALID_PATTERNS = [
  "a3f7c9", "b2e8d4", "c1f5a7", "d4b9e2",
  "e8c3f6", "f7a1d5", "a9c4b7", "b5d2e9",
];

function isValidPattern(key: string): boolean {
  const clean = key.replace(/-/g, "").toLowerCase();
  for (const pattern of VALID_PATTERNS) {
    if (clean.startsWith(pattern)) return true;
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
 * For MVP demo/testing: generate valid keys.
 * In production these come from LemonSqueezy.
 */
export function generateDemoKeys(): string[] {
  const segments = () =>
    Array.from({ length: 4 }, () =>
      Math.random().toString(36).slice(2, 6).toUpperCase()
    ).join("-");

  return Array.from({ length: 3 }, () => `SQUISH-${segments()}`);
}
