import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr','de','es','it','pt','nl','ja','ru','zh'],  
  defaultLocale: 'en',
  localePrefix: 'always', 
});
export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  ja: "日本語",
  nl: "Nederlands",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
};
export const flagEmoji: Record<string, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  it: "🇮🇹",
  ja: "🇯🇵",
  nl: "🇳🇱",
  pt: "🇵🇹",
  ru: "🇷🇺",
  zh: "🇨🇳",
};