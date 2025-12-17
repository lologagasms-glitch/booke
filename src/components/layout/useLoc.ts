// hooks/useLocalizedNavigation.ts
import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/routing';
import { buildLocalizedUrl, extractPathAndLocale, switchUrlLocale } from './url';

export const useLocalizedNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  /**
   * Navigue vers une URL en préservant le locale actuel
   */
  const navigate = (url: string, options?: { locale?: Locale; replace?: boolean }) => {
    const targetLocale = options?.locale || currentLocale;
    const localizedUrl = buildLocalizedUrl(url, targetLocale);
    
    if (options?.replace) {
      router.replace(localizedUrl);
    } else {
      router.push(localizedUrl);
    }
  };

  /**
   * Change le locale de la page actuelle
   */
  const switchLocale = (newLocale: Locale) => {
    const newUrl = switchUrlLocale(pathname, newLocale);
    router.replace(newUrl);
  };

  /**
   * Obtient le chemin actuel sans le locale
   */
  const getCurrentPath = () => {
    const { path } = extractPathAndLocale(pathname);
    return path;
  };

  /**
   * Construit une URL pour un composant Link
   */
  const buildLinkUrl = (href: string, locale?: Locale) => {
    return buildLocalizedUrl(href, locale || currentLocale);
  };

  return {
    navigate,
    switchLocale,
    getCurrentPath,
    buildLinkUrl,
    currentLocale,
    pathname
  };
};