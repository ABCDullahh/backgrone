# Backgrone

**Background Gone** — A privacy-first, 100% client-side AI background removal web application.

All image processing runs entirely in your browser via WebAssembly and WebGPU. Zero data leaves your device.

## Features

- **3 AI Engines** — Choose between Precision (ISNet fp16), Lightweight (ISNet uint8), or Balanced (RMBG-1.4)
- **100% Local Processing** — No server uploads, absolute privacy
- **Before/After Comparison** — Interactive slider to compare results
- **Background Replacement** — Transparent, solid color, gradient, or custom image backgrounds
- **Batch Processing** — Process up to 20 images at once, download as ZIP
- **Engine Arena** — Compare all 3 engines side-by-side on the same image
- **Auto Engine Selection** — Detects WebGPU/WASM/SIMD capabilities and recommends the best engine
- **Keyboard Shortcuts** — Ctrl+V paste, Ctrl+S download, Ctrl+Z undo, Esc cancel
- **Offline Capable** — Models cached in IndexedDB after first download
- **Blog** — Technical articles about the technology behind Backgrone

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animations | Motion (Framer Motion) |
| ML Engine A | @imgly/background-removal (ISNet fp16) |
| ML Engine B | @imgly/background-removal (ISNet uint8) |
| ML Engine C | @huggingface/transformers (RMBG-1.4) |
| Concurrency | Web Workers |
| Caching | IndexedDB |
| Blog | MDX via next-mdx-remote |
| Before/After | react-compare-slider |
| ZIP | JSZip |

## Design System

**Aura Brutalist-Editorial** — A high-contrast design system featuring:

- Monochrome palette with Electric Green (#006e16) accent
- Zero border-radius on all elements
- Typography: Noto Serif (headlines), Inter (body), Space Grotesk (labels)
- Glassmorphism navbar with backdrop-blur
- Active whitespace as a structural design element
- Scroll-triggered animations with `prefers-reduced-motion` support

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repo-url>
cd backgrone
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

### Testing

```bash
npm run test
```

## Project Structure

```
src/
  app/
    (marketing)/     # SSG pages (landing, pricing, blog, etc.)
    (app)/           # CSR pages (editor, samples)
  components/
    layout/          # NavBar, Footer
    landing/         # Landing page sections
    editor/          # Editor components
    samples/         # Samples & Engine Arena
    ui/              # Shared UI components
  lib/
    ml/              # ML processing layer
      engines/       # 3 engine implementations
    hooks/           # React hooks
    utils/           # Utilities
  workers/           # Web Worker for ML inference
  content/blog/      # MDX blog posts
  types/             # TypeScript types
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, live demo, FAQ |
| `/editor` | Main background removal tool |
| `/samples` | Sample showcase + Engine Arena comparison |
| `/pricing` | Free forever pricing page |
| `/how-it-works` | 3-step process + technical deep dive |
| `/blog` | Technical articles |
| `/about` | Brand philosophy + tech credits |
| `/video` | Video BG removal (coming soon) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## How It Works

1. **Upload** — Drag-drop, click, or paste an image (JPEG, PNG, WebP, HEIC)
2. **Process** — AI model runs in a Web Worker via WASM/WebGPU
3. **Download** — Get a lossless transparent PNG

All processing happens in-browser. The AI model is downloaded once (~42-84MB depending on engine) and cached in IndexedDB for instant loading on subsequent visits.

## Browser Support

- Chrome 91+ (WebGPU: 113+)
- Firefox 89+
- Safari 16.4+
- Edge 91+

## License

MIT
