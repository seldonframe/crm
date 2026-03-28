export type LandingSectionType =
  | "hero"
  | "social_proof"
  | "features"
  | "benefits"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "form"
  | "booking"
  | "custom_html";

export type LandingSection = {
  id: string;
  type: LandingSectionType;
  title?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  formSlug?: string;
  bookingSlug?: string;
  html?: string;
};

export function defaultLandingSections(): LandingSection[] {
  return [
    {
      id: "hero-1",
      type: "hero",
      title: "Transform your workflow",
      subtitle: "Book a strategy call and start scaling faster.",
      ctaLabel: "Get Started",
      ctaHref: "#lead-form",
    },
    {
      id: "form-1",
      type: "form",
      title: "Get in touch",
      subtitle: "Leave your details and we will reach out.",
      formSlug: "default-intake",
    },
    {
      id: "cta-1",
      type: "cta",
      title: "Ready to move faster?",
      ctaLabel: "Book now",
      ctaHref: "#lead-form",
    },
  ];
}
