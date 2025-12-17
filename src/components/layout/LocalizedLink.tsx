// components/LocalizedLink.tsx
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLocalizedNavigation } from './useLoc';
import { Locale } from 'next-intl';

interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, 'href' | 'locale'> {
  href: string;
  locale?: string;
  preserveQuery?: boolean;
  external?: boolean;
}

export const LocalizedLink = ({ 
  href, 
  locale, 
  preserveQuery = false, 
  external = false,
  ...props 
}: LocalizedLinkProps) => {
  const { buildLinkUrl } = useLocalizedNavigation();
  
  if (external) {
    return <Link href={href} {...props} />;
  }

  const localizedHref = buildLinkUrl(href, locale as any);
  
  return (
    <Link 
      href={localizedHref} 
      locale={locale} 
      {...props} 
    />
  );
};

// Version avec validation TypeScript plus stricte
export const StrictLocalizedLink = <T extends string>({ 
  href, 
  locale,
  ...props 
}: {
  href: T | `/${string}`;
  locale?:  "en" | "fr" | "de" | "es" | "it" | "pt" | "nl" | "ja" | "ru" | "zh" | undefined;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}) => {
  const { buildLinkUrl } = useLocalizedNavigation();
  const localizedHref = buildLinkUrl(href as string, locale);
  
  return (
    <Link href={localizedHref} {...props} />
  );
};