// utils/url.ts
import { routing } from '@/i18n/routing';

export type Locale = typeof routing.locales[number];

/**
 * Construit une URL localisée de manière sécurisée
 * Gère tous les cas edge et évite la duplication
 */
export const buildLocalizedUrl = (
  href: string | URL, 
  locale?: Locale,
  options?: {
    preserveQuery?: boolean;
    absolute?: boolean;
  }
): string => {
  // Convertir URL en string si nécessaire
  const hrefStr = typeof href === 'string' ? href : href.pathname;
  
  // Valider et normaliser le locale
  const validLocale = validateLocale(locale);
  
  // Nettoyer l'URL d'entrée
  const cleanHref = normalizeUrl(hrefStr);
  
  // Si l'URL contient déjà un locale valide, la retourner telle quelle
  if (hasValidLocalePrefix(cleanHref)) {
    return options?.preserveQuery ? addQueryParams(cleanHref, href) : cleanHref;
  }
  
  // Construire l'URL avec le locale
  const localizedPath = `/${validLocale}${cleanHref === '/' ? '' : cleanHref}`;
  
  // Ajouter les query params si demandé
  return options?.preserveQuery ? addQueryParams(localizedPath, href) : localizedPath;
};

/**
 * Extrait le locale d'une URL et retourne le chemin sans locale
 */
export const extractPathAndLocale = (url: string | {pathname:string}): { locale: Locale | null; path: string } => {
  const urlStr = typeof url === 'string' ? url : url.pathname;
  const cleanUrl = normalizeUrl(urlStr);
  
  // Pattern pour capturer le locale au début de l'URL
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`);
  const match = cleanUrl.match(localePattern);
  
  if (match) {
    const locale = match[1] as Locale;
    const pathWithoutLocale = cleanUrl.slice(locale.length + 1) || '/';
    return { locale, path: pathWithoutLocale };
  }
  
  return { locale: null, path: cleanUrl };
};

/**
 * Change le locale d'une URL existante
 */
export const switchUrlLocale = (url: string, newLocale: Locale): string => {
  const { path } = extractPathAndLocale(url);
  return buildLocalizedUrl(path, newLocale);
};

/**
 * Vérifie si une URL a un préfixe locale valide
 */
export const hasValidLocalePrefix = (url: string): boolean => {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`);
  return localePattern.test(url);
};

/**
 * Valide et retourne un locale valide
 */
export const validateLocale = (locale?: string): Locale => {
  if (locale && routing.locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return routing.defaultLocale;
};

/**
 * Normalise une URL (supprime les slashes multiples, etc.)
 */
export const normalizeUrl = (url: string): string => {
  return url
    .replace(/\/+/g, '/') // Supprime les slashes multiples
    .replace(/\/$/, '') || '/'; // Supprime le slash final sauf pour la racine
};

/**
 * Ajoute les query params à une URL
 */
const addQueryParams = (baseUrl: string, originalUrl: string | URL): string => {
  if (typeof originalUrl === 'string') return baseUrl;
  
  const searchParams = originalUrl.search;
  return searchParams ? `${baseUrl}${searchParams}` : baseUrl;
};