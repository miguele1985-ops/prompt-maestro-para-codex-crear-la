import type { LucideIcon } from "lucide-react";

export type FeatureAvailability = "offline" | "online" | "hybrid";

export interface MediaAsset {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
}

export interface AppFeature {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image?: string;
  video?: string;
  availability: FeatureAvailability;
  category: string;
  highlights: string[];
  warnings?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContentPage {
  slug: string;
  navLabel?: string;
  title: string;
  eyebrow?: string;
  description: string;
  body: string[];
  highlights?: string[];
  sections?: Array<{
    title: string;
    body: string;
    items?: string[];
    image?: string;
    imageAlt?: string;
    buttonLabel?: string;
    buttonHref?: string;
    steps?: string[];
    tips?: string[];
    warning?: string;
  }>;
  cta?: string;
  ctaHref?: string;
  seoTitle: string;
  seoDescription: string;
  keywords?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  priority: string;
  firstActions: string[];
  risks: string[];
  materials: string[];
}

export interface GuideCategory {
  id: string;
  title: string;
  description: string;
  articleCountLabel: string;
  expansion?: string;
  articleExamples?: string[];
  usageTips?: string[];
}

export interface Calculator {
  id: string;
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
  warnings: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
  fixes?: string[];
  downloadUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export type IconMap = Record<string, LucideIcon>;
