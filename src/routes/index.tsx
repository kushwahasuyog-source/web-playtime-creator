import { createFileRoute } from "@tanstack/react-router";
import { faqs } from "@/components/landing/Sections";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Automation,
  BuilderDemo,
  Cta,
  Faq,
  Features,
  Footer,
  HowItWorks,
  Pricing,
  Templates,
} from "@/components/landing/Sections";

const title = "BotForge — Build Telegram bots with AI";
const description =
  "Describe your Telegram bot in plain language. BotForge generates it, connects your BotFather token, deploys it, and manages commands, automations and analytics.";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BotForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://botforge.app/" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://botforge.app/" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(appJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd) },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <BuilderDemo />
        <Features />
        <Templates />
        <Automation />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
