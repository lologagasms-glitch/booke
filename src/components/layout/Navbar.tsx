'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, UsersIcon, SunIcon, MoonIcon, SwatchIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/components/providers/ThemeProvider';
import { signOut, useSession } from '@/app/lib/auth-client';
import { flagEmoji, localeNames, routing } from '@/i18n/routing';
import { TransletText } from '@/app/lib/services/translation/transletText';

// Composant espaceur à placer juste après la navbar
export const NavbarSpacer = () => {
  return <div className="h-20" />;
};

type NavItem = {
  href?: string;
  label: string;
  icon?: React.ElementType;
  children?: Array<{
    href: string;
    label: string;
  }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'home' },
  { href: '/etablissements', label: 'establishments' },
  {
    label: 'contact',
    icon: UsersIcon,
    children: [
      { href: '/contact', label: 'contact' },
      { href: '/teams', label: 'teams' }
    ]
  },
];

// Hook personnalisé pour détecter les clics à l'extérieur
const useOutsideClick = <T extends HTMLElement>(
  refs: React.RefObject<T>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = refs.some(ref => ref.current?.contains(target));
      if (!isInside) callback();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs, callback]);
};

export default function Navbar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const { theme, setTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState<string>('none');
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const { useLocale } = require('next-intl');
  const locale = useLocale();
  const closeAllMenus = useCallback(() => setOpenMenu('none'), []);

  // Collect all refs for outside click
  const allRefs = useMemo(() => {
    const refs = [userMenuRef, langMenuRef, mobileMenuRef, themeMenuRef];
    Object.values(dropdownRefs.current).forEach(ref => {
      if (ref) refs.push({ current: ref } as React.RefObject<HTMLDivElement>);
    });
    return refs;
  }, []);

  useOutsideClick(allRefs as React.RefObject<HTMLElement>[], closeAllMenus);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenu === 'mobile' ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openMenu]);

  const switchLanguage = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
      closeAllMenus();
    },
    [pathname, router, closeAllMenus]
  );

  const isPathActive = useCallback(
    (path: string) => {
      if (path === '/') return pathname === '/';
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const toggleMenu = useCallback((menu: string) => {
    setOpenMenu(prev => (prev === menu ? 'none' : menu));
  }, []);

  const Logo = () => (
    <Link href="/" onClick={closeAllMenus} className="flex items-center">
      <span className="text-2xl font-serif font-extrabold text-primary">
        Évasion
      </span>
    </Link>
  );

  const LanguageDropdown = ({ isMobile = false }: { isMobile?: boolean }) => {
    const currentLabel = localeNames[locale as keyof typeof localeNames];
    const currentFlag = flagEmoji[locale];
    const isOpen = openMenu === 'lang';

    return (
      <div ref={isMobile ? mobileMenuRef : langMenuRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
        <button
          onClick={() => toggleMenu('lang')}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={`flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-foreground/10 transition ${isMobile ? 'w-full justify-center' : ''
            }`}
        >
          <span className="text-base">{currentFlag}</span>
          <span className="hidden sm:inline">{currentLabel}</span>
          <ChevronDownIcon className={`h-4 w-4 text-foreground/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`absolute right-0 mt-2 w-48 rounded-xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50 transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
          } ${isMobile ? 'relative w-full mt-1' : ''}`}>
          {routing.locales.map((code) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              className={`w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition flex items-center gap-3 ${code === locale ? 'text-primary font-semibold bg-primary/10' : ''
                }`}
            >
              <span className="text-base">{flagEmoji[code]}</span>
              <span>{localeNames[code as keyof typeof localeNames]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const NavDropdown = ({ item, isMobile = false }: { item: NavItem; isMobile?: boolean }) => {
    const isOpen = openMenu === item.label;
    const isParentActive = item.children?.some(child => isPathActive(child.href)) || false;
    const Icon = item.icon;

    return (
      <div
        ref={(el) => {
          if (!isMobile) dropdownRefs.current[item.label] = el;
        }}
        className={`relative ${isMobile ? 'w-full' : ''}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // Empêche la fermeture immédiate
            toggleMenu(item.label);
          }}
          aria-label={`Menu ${item.label}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={
            isMobile
              ? `flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition ${isParentActive
                ? 'bg-primary/20 text-primary'
                : 'text-foreground/80 hover:bg-primary/20'
              }`
              : `relative text-foreground/90 hover:text-primary transition text-sm font-medium group flex items-center gap-2 ${isParentActive ? 'text-primary' : ''
              }`
          }
        >
          <span className="flex items-center gap-2">
            {Icon && (
              <Icon className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'} transition-colors ${isParentActive ? 'text-primary' : 'text-foreground/90'
                }`} />
            )}
            <TransletText>{item.label}</TransletText>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
          {!isMobile && (
            <span className={`absolute left-0 -bottom-1 h-0.5 bg-primary transition-all duration-300 ${isParentActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
          )}
        </button>

        <div
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur un lien
          className={`transition-all duration-200 ${isOpen
            ? isMobile
              ? 'max-h-64 opacity-100'
              : 'opacity-100 translate-y-0 visible'
            : isMobile
              ? 'max-h-0 opacity-0 overflow-hidden'
              : 'opacity-0 -translate-y-2 invisible'
            } ${isMobile ? 'pl-4 mt-1 space-y-1' : 'absolute left-0 mt-2 w-48 rounded-xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50'}`}
        >
          {item.children?.map((child) => {
            console.log(child.href)
           return  (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-2 text-sm text-foreground hover:bg-primary/20 transition flex items-center gap-3 ${isPathActive(child.href) ? 'text-primary font-semibold bg-primary/10' : ''
                } ${isMobile ? 'rounded-lg' : ''}`}
            >
              
            <TransletText> {child.label}</TransletText>
            </Link>
          )
          })}
        </div>
      </div>
    );
  };

  const UserAvatar = () => {
    if (session?.user?.image) {
      return (
        <Image
          src={session.user.image}
          alt={session.user.name ?? 'avatar'}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-400 transition-transform hover:scale-110"
        />
      );
    }
    return (
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform hover:scale-110">
        {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
      </div>
    );
  };

  const finalNavItems = useMemo(() => {
    const items = [...NAV_ITEMS];
    if (session?.user?.role === 'admin') {
      items.push({
        label: 'admin',
        icon: ShieldCheckIcon,
        children: [
          { href: '/admin', label: 'dashboard' },
          { href: '/admin/users', label: 'users' },
          { href: '/admin/etablissements', label: 'establishments' },
          { href: '/admin/reservations', label: 'reservations' },
        ]
      });
    }
    return items;
  }, [session]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? ' backdrop-blur-xl bg-background/70 shadow-2xl' : 'bg-background/40 backdrop-blur-lg'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Logo />

            {/* Desktop nav */}
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              {finalNavItems.map((item) => {
                if (item.children) {
                  return <NavDropdown key={item.label} item={item} />;
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={closeAllMenus}
                    className={`relative text-foreground/90 hover:text-primary transition text-sm font-medium group ${isPathActive(item.href!) ? 'text-primary' : ''
                      }`}
                  >
                    <TransletText>{item.label}</TransletText>
                    <span className={`absolute left-0 -bottom-1 h-0.5 bg-primary transition-all duration-300 ${isPathActive(item.href!) ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                  </Link>
                );
              })}
            </div>

            {/* Desktop right */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {session?.user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => toggleMenu('user')}
                    aria-haspopup="true"
                    aria-expanded={openMenu === 'user'}
                    className="flex items-center space-x-2 rounded-lg p-2 hover:bg-foreground/10 transition"
                  >
                    <UserAvatar />
                  </button>

                  <div className={`absolute right-0 mt-3 w-56 rounded-xl bg-popover/95 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50 transition-all duration-200 ${openMenu === 'user' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                    }`}>
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-foreground font-medium">{session.user.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
                    </div>
                    <Link href="/profile" onClick={closeAllMenus} className="block px-4 py-2 text-foreground/80 hover:bg-primary/20">
                      {t('profile')}
                    </Link>
                    <Link href="/reservations" onClick={closeAllMenus} className="block px-4 py-2 text-foreground/80 hover:bg-primary/20">
                      {t('reservations')}
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" onClick={closeAllMenus} className="block px-4 py-2 text-foreground/80 hover:bg-primary/20">
                        {t('admin')}
                      </Link>
                    )}
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-foreground/80 hover:bg-primary/20">
                      {t('logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/signin" onClick={closeAllMenus} className="rounded-lg border border-primary/50 px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition">
                    connexion
                  </Link>
                  <Link href="/auth/signup" onClick={closeAllMenus} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
                    inscription
                  </Link>
                </div>
              )}
              <div ref={themeMenuRef} className="relative">
                <button
                  onClick={() => toggleMenu('theme')}
                  className="p-2 rounded-lg text-foreground/80 hover:bg-foreground/10 transition"
                >
                  {theme === 'white' && <SunIcon className="h-5 w-5" />}
                  {theme === 'dark' && <MoonIcon className="h-5 w-5" />}
                  {theme === 'yellow' && <SwatchIcon className="h-5 w-5" />}
                </button>

                <div className={`absolute right-0 mt-2 w-32 rounded-xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50 transition-all duration-200 ${openMenu === 'theme' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                  <button onClick={() => { setTheme('white'); closeAllMenus(); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary/20 ${theme === 'white' ? 'text-primary font-bold' : 'text-foreground'}`}><SunIcon className="h-4 w-4" /> White</button>
                  <button onClick={() => { setTheme('dark'); closeAllMenus(); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary/20 ${theme === 'dark' ? 'text-primary font-bold' : 'text-foreground'}`}><MoonIcon className="h-4 w-4" /> Black</button>
                  <button onClick={() => { setTheme('yellow'); closeAllMenus(); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-primary/20 ${theme === 'yellow' ? 'text-primary font-bold' : 'text-foreground'}`}><SwatchIcon className="h-4 w-4" /> Yellow</button>
                </div>
              </div>
              <LanguageDropdown />
            </div>

            {/* Mobile burger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => toggleMenu('mobile')}
                aria-label="Toggle menu"
                aria-expanded={openMenu === 'mobile'}
                className="p-2 rounded-md text-foreground/80 hover:bg-foreground/10 transition"
              >
                {openMenu === 'mobile' ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div ref={mobileMenuRef} className={`lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-lg transition-transform duration-300 z-40 ${openMenu === 'mobile' ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="px-4 pt-6 pb-8 overflow-y-auto h-full">
            <div className="space-y-3">
              {finalNavItems.map((item) => {
                if (item.children) {
                  return <NavDropdown key={item.label} item={item} isMobile={true} />;
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={closeAllMenus}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition ${isPathActive(item.href!) ? 'bg-primary/20 text-primary' : 'text-foreground/80 hover:bg-primary/20'
                      }`}
                  >
                    <TransletText>{item.label}</TransletText>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              {session?.user ? (
                <>
                  <div className="px-4 py-3 rounded-lg bg-surface/50">
                    <p className="text-foreground font-medium">{session.user.name}</p>
                    <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
                  </div>
                  <Link href="/profile" onClick={closeAllMenus} className="block px-4 py-3 text-foreground/80 hover:bg-primary/20 rounded-lg">
                    {t('profile')}
                  </Link>
                  <Link href="/reservations" onClick={closeAllMenus} className="block px-4 py-3 text-foreground/80 hover:bg-primary/20 rounded-lg">
                    {t('reservations')}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" onClick={closeAllMenus} className="block px-4 py-3 text-foreground/80 hover:bg-primary/20 rounded-lg">
                      {t('admin')}
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-3 text-foreground/80 hover:bg-primary/20 rounded-lg">
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={closeAllMenus} className="block rounded-lg border border-primary/50 px-4 py-3 text-foreground/80 hover:bg-primary/20 text-center">
                    connexion
                  </Link>
                  <Link href="/auth/signup" onClick={closeAllMenus} className="block rounded-lg bg-primary px-4 py-3 text-primary-foreground font-semibold hover:opacity-90 text-center">
                    inscription
                  </Link>
                </>
              )}
              <div className="pt-2">
                <LanguageDropdown isMobile={true} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <NavbarSpacer />
    </>
  );
}
