import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Backgrone privacy policy. Your images never leave your device. 100% local AI background removal with zero data collection, no tracking, no cloud processing.",
  alternates: {
    canonical: "https://backgrone.app/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="pt-24">
      <article className="mx-auto max-w-3xl px-8 py-32">
        <h1 className="font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
          PRIVACY
          <br />
          POLICY.
        </h1>

        <p className="mt-6 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Last updated: March 25, 2026
        </p>

        {/* Key message */}
        <div className="mt-12 bg-secondary-container p-8">
          <p className="font-headline text-xl font-bold text-on-secondary-container">
            We process nothing. Your browser does everything.
          </p>
        </div>

        <div className="mt-16 space-y-12 font-body text-base leading-relaxed text-on-surface-variant">
          {/* 1 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              1. Data Collection
            </h2>
            <p className="mt-4">
              Backgrone does not collect, store, or transmit any personal data.
              We do not require account creation, email addresses, or any form
              of registration. There are no user accounts, no profiles, and no
              data to breach.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              2. Image Processing
            </h2>
            <p className="mt-4">
              All image processing occurs entirely within your web browser using
              WebAssembly and local AI models. Your images are never uploaded to
              any server. They remain in your browser&apos;s memory during
              processing and are discarded when you close the tab or navigate
              away. We have no backend infrastructure capable of receiving or
              storing your images.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              3. Cookies &amp; Local Storage
            </h2>
            <p className="mt-4">
              Backgrone uses IndexedDB to cache AI model files for faster
              subsequent loads. This data is stored locally on your device and
              is never transmitted. We do not use tracking cookies, advertising
              cookies, or any third-party cookie-based services.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              4. Third-Party Services
            </h2>
            <p className="mt-4">
              Backgrone does not integrate with any third-party analytics,
              advertising, or tracking services. We do not use Google Analytics,
              Facebook Pixel, or similar tools. The only external requests are
              for loading the application itself and downloading AI model files
              on first use.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              5. Changes to This Policy
            </h2>
            <p className="mt-4">
              We may update this privacy policy from time to time. Any changes
              will be reflected on this page with an updated &ldquo;Last
              updated&rdquo; date. Given that we collect no data, changes are
              unlikely to affect you materially.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              6. Contact
            </h2>
            <p className="mt-4">
              If you have any questions about this privacy policy, please
              contact us at{" "}
              <a
                href="mailto:faizal2jz@gmail.com"
                className="font-bold text-on-surface underline decoration-secondary-container decoration-2 underline-offset-4 hover:decoration-secondary"
              >
                faizal2jz@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
