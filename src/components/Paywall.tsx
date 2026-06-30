"use client";

import { useState } from "react";
import { LicenseInput } from "./LicenseInput";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
}

export function Paywall({ isOpen, onClose, remaining }: PaywallProps) {
  const [showLicenseInput, setShowLicenseInput] = useState(false);

  if (!isOpen) return null;

  if (showLicenseInput) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <LicenseInput
          onSuccess={() => {
            setShowLicenseInput(false);
            onClose();
          }}
          onCancel={() => setShowLicenseInput(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <svg className="h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>

        <h2 className="text-center text-xl font-bold text-zinc-900">
          {remaining <= 0 ? "You've hit the free limit" : "Almost there!"}
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-600">
          {remaining <= 0
            ? "You've used all 15 free compressions for today. Upgrade to unlock unlimited access."
            : `${remaining} free compression${remaining === 1 ? "" : "s"} left today.`}
        </p>

        {/* Pricing card */}
        <div className="mt-6 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 p-5 text-center">
          <p className="text-sm font-medium text-zinc-600">Lifetime Access</p>
          <p className="mt-1 text-4xl font-bold text-zinc-900">
            $9<span className="text-lg text-zinc-500">.99</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">One-time payment. No subscription.</p>

          <ul className="mt-4 space-y-2 text-left text-sm text-zinc-600">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Unlimited compressions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Files up to 50MB
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Exact target size compression
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> WebP & AVIF conversion
            </li>
          </ul>

          <a
            href="https://lemonsqueezy.com" // Placeholder — replace with real product URL
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white
              hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200"
          >
            Get Lifetime Access — $9.99
          </a>
        </div>

        {/* Already have a key */}
        <button
          onClick={() => setShowLicenseInput(true)}
          className="mt-4 w-full text-center text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
        >
          Already have a license key? Enter it here
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
