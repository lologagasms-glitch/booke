// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Fonction qui produit la config de request
export const createI18nRequestConfig = () =>
  getRequestConfig(async ({ requestLocale }) => {
    // 1) Récupère la locale demandée (URL, cookie, header)
    let locale = await requestLocale;

    // 2) Sécurité : fallback si locale absente ou invalide
    if (!locale || !routing.locales.includes(locale as any)) {
      locale = routing.defaultLocale;
    }

    // 3) Chargement dynamique des messages
    const messages = (
      await import(`../../messages/${locale}.json`)
    ).default;

    return {
      locale,
      messages,
      // timeZone: 'Europe/Paris', // optionnel
    };
  });

// Export par défaut requis par next-intl
export default createI18nRequestConfig();