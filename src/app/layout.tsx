import type { Metadata } from "next";
import { Noto_Serif, Inter, Space_Grotesk } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import { GlobalDropZone } from "@/components/layout/GlobalDropZone";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://backgrone.app"),
  title: {
    default:
      "Backgrone \u2014 Free AI Background Remover | Remove Background Instantly",
    template: "%s | Backgrone",
  },
  description:
    "Remove background from images for free with AI \u2014 100% private, no upload, no signup. Runs locally in your browser via WebAssembly. Try the best free background remover online.",
  keywords: [
    "remove background",
    "background remover",
    "remove background from image",
    "background removal tool",
    "free background remover",
    "remove background online free",
    "local background removal",
    "private background remover",
    "ai background remover",
    "remove background no upload",
    "client-side background removal",
    "remove bg",
    "transparent background maker",
    "background eraser",
    "remove image background free",
    "remove background without uploading",
    "private ai background removal browser",
    "offline background remover",
    "remove background locally in browser",
    "wasm background removal",
  ],
  openGraph: {
    title:
      "Backgrone \u2014 Free AI Background Remover | Remove Background Instantly",
    description:
      "Remove background from images for free with AI. 100% private, no upload, runs locally in your browser. The best free background remover online.",
    type: "website",
    siteName: "Backgrone",
    locale: "en_US",
    url: "https://backgrone.app",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Backgrone \u2014 Free AI Background Remover | Remove Background Instantly",
    description:
      "Remove background from images for free with AI. 100% private, no upload, runs locally in your browser.",
  },
  alternates: {
    canonical: "https://backgrone.app",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased">
        <NavBar />
        <GlobalDropZone />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  name: "Backgrone",
                  alternateName: [
                    "Backgrone Background Remover",
                    "BG Remover",
                  ],
                  description:
                    "Free AI background remover that runs 100% in your browser. Remove backgrounds from images instantly with no upload, no signup, and no watermarks. Powered by ISNet and RMBG AI models via WebAssembly.",
                  url: "https://backgrone.app",
                  applicationCategory: "DesignApplication",
                  operatingSystem: "Web Browser",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                  },
                  featureList: [
                    "Remove background from images",
                    "100% local processing - no upload",
                    "3 AI engines to choose from",
                    "Batch processing up to 20 images",
                    "Free forever - no signup required",
                    "No watermarks",
                    "Supports PNG, JPG, WebP, HEIC",
                    "Works offline after first load",
                  ],
                  screenshot:
                    "https://backgrone.app/samples/hero-before.jpg",
                  softwareVersion: "1.0.0",
                  author: {
                    "@type": "Person",
                    name: "ABCDullahh",
                  },
                },
                {
                  "@type": "WebSite",
                  name: "Backgrone",
                  url: "https://backgrone.app",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
