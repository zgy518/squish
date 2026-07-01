import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Squish",
  description: "Squish processes all images locally in your browser. No files are ever uploaded to any server.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Squish
        </Link>

        <h1 className="text-3xl font-bold text-zinc-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: July 1, 2026</p>

        <div className="mt-8 space-y-6 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Your Images Stay on Your Device</h2>
            <p className="mt-2">
              Squish processes all images entirely within your web browser. Your files are
              <strong> never uploaded</strong> to any server. We have no access to your images
              and cannot see, store, or share them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">No Data Collection</h2>
            <p className="mt-2">
              We do not require accounts, collect personal information, or store any of your files.
              We use anonymous analytics (Google Analytics) to understand overall usage patterns,
              but this does not include your images or any personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Cookies</h2>
            <p className="mt-2">
              We do not use cookies for tracking. Google Analytics may set anonymous
              measurement cookies for basic traffic analysis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900">Contact</h2>
            <p className="mt-2">
              For questions about this privacy policy, please contact us via{" "}
              <a
                href="https://github.com/zgy518/squish"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                GitHub Issues
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
