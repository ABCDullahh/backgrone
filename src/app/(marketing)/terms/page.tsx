import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Backgrone, the free AI background remover. Client-side image processing, no data collection, open-source background removal tool.",
  alternates: {
    canonical: "https://backgrone.app/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="pt-24">
      <article className="mx-auto max-w-3xl px-8 py-32">
        <h1 className="font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
          TERMS OF
          <br />
          SERVICE.
        </h1>

        <p className="mt-6 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          Last updated: March 25, 2026
        </p>

        <div className="mt-16 space-y-12 font-body text-base leading-relaxed text-on-surface-variant">
          {/* 1 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              1. Acceptance of Terms
            </h2>
            <p className="mt-4">
              By accessing and using Backgrone (&ldquo;the Service&rdquo;), you
              accept and agree to be bound by these Terms of Service. If you do
              not agree to these terms, please do not use the Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              2. Description of Service
            </h2>
            <p className="mt-4">
              Backgrone is a client-side web application that removes image
              backgrounds using AI models running in your web browser via
              WebAssembly. All image processing occurs locally on your device.
              The Service does not upload, transmit, or store any user images on
              external servers.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              3. User Responsibilities
            </h2>
            <p className="mt-4">
              You are responsible for the content you process using the Service.
              You agree not to use Backgrone to process images that you do not
              have the legal right to modify, or to process content that
              violates any applicable laws or regulations. You are solely
              responsible for ensuring you have the necessary rights and
              permissions for any images you process.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              4. Intellectual Property
            </h2>
            <p className="mt-4">
              The Backgrone application, including its design, code, and
              branding, is the intellectual property of its creators. The AI
              models used are subject to their respective open-source licenses.
              You retain full ownership and rights to any images you process
              using the Service — we claim no rights over your content.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              5. Disclaimers
            </h2>
            <p className="mt-4">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, either express or
              implied. We do not warrant that the Service will be uninterrupted,
              error-free, or that results will meet your specific requirements.
              AI-based processing may produce varying results depending on input
              image quality, complexity, and browser capabilities.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              6. Limitation of Liability
            </h2>
            <p className="mt-4">
              To the maximum extent permitted by applicable law, Backgrone and
              its creators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits or revenues, whether incurred directly or indirectly, or
              any loss of data, use, goodwill, or other intangible losses
              resulting from your use of the Service.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              7. Changes to Terms
            </h2>
            <p className="mt-4">
              We reserve the right to modify these Terms of Service at any time.
              Changes will be posted on this page with an updated effective
              date. Your continued use of the Service after any changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              8. Contact
            </h2>
            <p className="mt-4">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:hello@backgrone.app"
                className="font-bold text-on-surface underline decoration-secondary-container decoration-2 underline-offset-4 hover:decoration-secondary"
              >
                hello@backgrone.app
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
