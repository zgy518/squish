# Squish — Smart Image Compressor

The modern image compressor for the web. Compress images to an **exact target file size**, not just a quality percentage.

**Status:** 🚧 MVP in development

## Why Squish?

- 🎯 **Compress to target size** — Need exactly 100KB? Squish delivers.
- 🔒 **100% Private** — All processing happens in your browser. Images never uploaded.
- 🆓 **Free to use** — 15 compressions/day, up to 10MB per file.
- ⚡ **Batch processing** — Compress multiple images in parallel.
- 🌐 **Modern formats** — JPG, PNG, WebP, AVIF support.

## Tech Stack

- Next.js 14 + TypeScript + Tailwind CSS
- Pure browser-side Canvas API compression
- Web Workers for parallel batch processing
- Vercel deployment

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Documentation

- [Requirements](docs/requirements.md)
- [Tech Spec](docs/tech-spec.md)
- [Design Spec](docs/design-spec.md)
- [Execution Plan](docs/execution-plan.md)

## Roadmap

- [x] Project skeleton + docs
- [ ] Core compression (upload + compress + preview + download)
- [ ] Target-size compression + batch processing
- [ ] Freemium + LemonSqueezy payment
- [ ] Responsive polish + SEO

## Author

Built by [@zgy518](https://github.com/zgy518)
