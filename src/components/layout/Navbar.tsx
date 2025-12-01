'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  SwatchIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  HomeIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/components/providers/ThemeProvider';
import { signOut, useSession } from '@/app/lib/auth-client';
import { flagEmoji, localeNames, routing } from '@/i18n/routing';
import { TransletText } from '@/app/lib/services/translation/transletText';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

// Spacer component
export const NavbarSpacer = () => <div className="h-20" />;

type NavItem = {
  href?: string;
  label: string;
  icon?: React.ElementType;
  children?: Array<{
    href: string;
    label: string;
    icon?: React.ElementType;
  }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'acceuil', icon: HomeIcon },
  { href: '/etablissements', label: 'établissements', icon: BuildingOfficeIcon },
  {
    label: 'contact',
    icon: EnvelopeIcon,
    children: [
      { href: '/contact', label: 'contact', icon: EnvelopeIcon },
      { href: '/teams', label: 'Membres', icon: UserGroupIcon }
    ]
  },
];

// Hook to detect outside clicks
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

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { locale } = useParams();

  const closeAllMenus = useCallback(() => setOpenMenu(null), []);

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
      const cleanPath = pathname.replace(/^\/[^\/]+/, '') || '/';
      router.replace(cleanPath, { locale: newLocale });
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
    setOpenMenu(prev => (prev === menu ? null : menu));
  }, []);

  const Logo = () => (
    <Link href="/" onClick={closeAllMenus} className="flex items-center">
      <Image
        src="/vercel.svg"
        alt="Logo"
        width={100}
        height={24}
        className="h-20 w-auto"
      />
    </Link>
  );

  const LanguageDropdown = ({ isMobile = false }: { isMobile?: boolean }) => {
    const currentLabel = localeNames[locale as keyof typeof localeNames];
    const currentFlag = flagEmoji[locale as keyof typeof flagEmoji];
    const isOpen = openMenu === 'lang';

    return (
      <div ref={isMobile ? mobileMenuRef : langMenuRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
        <button
          onClick={() => toggleMenu('lang')}
          className={`flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-foreground/10 transition ${isMobile ? 'w-full justify-center' : ''}`}
        >
          <GlobeAltIcon className="h-4 w-4" />
          <span className="hidden sm:inline"><TransletText>{currentLabel}</TransletText></span>
          <span className="text-base">{currentFlag}</span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`absolute right-0 mt-2 w-48 rounded-xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50 transition-all ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'} ${isMobile ? 'relative w-full mt-1' : ''}`}>
          {routing.locales.map((code) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/20 transition flex items-center gap-3 ${code === locale ? 'text-primary font-semibold bg-primary/10' : ''}`}
            >
              <span className="text-base">{flagEmoji[code]}</span>
              <span><TransletText>{localeNames[code as keyof typeof localeNames]}</TransletText></span>
            </button>
          ))}
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

  const MobileDropdown = ({ item }: { item: NavItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon;
    const isParentActive = item.children?.some(child => isPathActive(child.href)) || false;

    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl transition-all ${isParentActive
              ? 'bg-primary/20 text-primary font-semibold'
              : 'text-foreground/80 hover:bg-primary/10 hover:text-foreground'
            }`}
        >
          <span className="flex items-center gap-4">
            {Icon && <Icon className="h-5 w-5" />}
            <TransletText>{item.label}</TransletText>
          </span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-6 space-y-1 overflow-hidden"
            >
              {item.children?.map((child) => (
                <Link
                  key={`${child.href}`}
                  href={child.href}
                  onClick={closeAllMenus}
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${isPathActive(child.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    {child.icon && <child.icon className="h-4 w-4" />}
                    <TransletText>{child.label}</TransletText>
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl bg-background/70 shadow-2xl' : 'bg-background/40 backdrop-blur-lg'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  const isActive = item.children.some(child => isPathActive(child.href));
                  return (
                    <div key={item.label} className="relative" ref={(el: HTMLDivElement | null) => { dropdownRefs.current[item.label] = el; }}>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={`flex items-center gap-2 text-foreground/90 hover:text-primary transition text-sm font-medium ${isActive ? 'text-primary' : ''}`}
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                      >
                        <TransletText>{item.label}</TransletText>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${openMenu === item.label ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {openMenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute left-0 mt-2 w-48 rounded-xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50"
                          >
                            {item.children?.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`flex items-center gap-3 cursor-pointer px-4 py-2 text-sm hover:bg-primary/20 transition-colors ${isPathActive(child.href) ? 'text-primary font-semibold bg-primary/10' : ''}`}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <TransletText>{child.label}</TransletText>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href!}
                    href={item.href!}
                    onClick={closeAllMenus}
                    className={`flex items-center gap-2 text-foreground/90 hover:text-primary transition text-sm font-medium ${isPathActive(item.href!) ? 'text-primary' : ''}`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <TransletText>{item.label}</TransletText>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {session?.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={closeAllMenus}
                  className="flex items-center gap-2 rounded-lg border border-destructive/50 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  {t('admin')}
                </Link>
              )}

              {session?.user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => toggleMenu('user')}
                    className="flex items-center space-x-2 rounded-lg p-2 hover:bg-foreground/10 transition"
                  >
                    <UserAvatar />
                  </button>

                  <div className={`absolute right-0 mt-3 w-56 rounded-xl bg-popover/95 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50 transition-all ${openMenu === 'user' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-foreground font-medium">{session.user.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
                    </div>
                    <Link href="/profile" onClick={closeAllMenus} className="block px-4 py-2 text-sm hover:bg-primary/20">
                      <UserCircleIcon className="h-4 w-4 inline mr-2" />
                      <TransletText>profile</TransletText>
                    </Link>
                    <Link href="/reservations" onClick={closeAllMenus} className="block px-4 py-2 text-sm hover:bg-primary/20">
                      <ClipboardDocumentListIcon className="h-4 w-4 inline mr-2" />
                      {t('reservations')}
                    </Link>
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm hover:bg-primary/20">
                      <ArrowRightOnRectangleIcon className="h-4 w-4 inline mr-2" />
                      <TransletText>logout</TransletText>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/signin" onClick={closeAllMenus} className="px-4 py-2 text-sm border border-primary/50 rounded-lg hover:bg-primary/10 transition">
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 inline mr-2" />
                    <TransletText>Connexion</TransletText>
                  </Link>
                  <Link href="/auth/signup" onClick={closeAllMenus} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold">
                    <UserPlusIcon className="h-4 w-4 inline mr-2" />
                    <TransletText> {"s'inscrire"} </TransletText>
                  </Link>
                </div>
              )}

              <div ref={themeMenuRef} className="relative">
                <button onClick={() => toggleMenu('theme')} className="p-2 rounded-lg hover:bg-foreground/10 transition">
                  {theme === 'white' && <SunIcon className="h-5 w-5" />}
                  {theme === 'dark' && <MoonIcon className="h-5 w-5" />}
                  {theme === 'yellow' && <SwatchIcon className="h-5 w-5" />}
                </button>

                <div className={`absolute right-0 mt-2 w-32 rounded-xl bg-surface/90 backdrop-blur-md border border-border shadow-2xl overflow-hidden z-50 transition-all ${openMenu === 'theme' ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                  {['white', 'dark', 'yellow'].map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTheme(t as 'white' | 'dark' | 'yellow'); closeAllMenus(); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/20 flex items-center gap-2 ${theme === t ? 'text-primary font-bold' : ''}`}
                    >
                      {t === 'white' && <SunIcon className="h-4 w-4" />}
                      {t === 'dark' && <MoonIcon className="h-4 w-4" />}
                      {t === 'yellow' && <SwatchIcon className="h-4 w-4" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <LanguageDropdown />
            </div>

            {/* Mobile Burger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => toggleMenu('mobile')}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-foreground/80 hover:bg-foreground/10 transition"
              >
                {openMenu === 'mobile' ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {openMenu === 'mobile' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={closeAllMenus}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-5/6 max-w-sm z-50 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl lg:hidden"
              ref={mobileMenuRef}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <Logo />
                <button
                  onClick={closeAllMenus}
                  aria-label="Close menu"
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
                >
                  <XMarkIcon className="h-6 w-6 text-foreground" />
                </button>
              </div>

              <div className="h-[calc(100%-5rem)] overflow-y-auto px-6 py-4">
                {/* Navigation */}
                <nav className="space-y-2">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, type: 'spring' }}
                    >
                      {item.children ? (
                        <MobileDropdown item={item} />
                      ) : (
                        <Link
                          href={item.href!}
                          onClick={closeAllMenus}
                          className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-xl transition-all ${isPathActive(item.href!)
                              ? 'bg-primary/20 text-primary font-semibold'
                              : 'text-foreground/80 hover:bg-primary/10 hover:text-foreground'
                            }`}
                        >
                          <span className="w-6 flex justify-center">
                            {item.icon && <item.icon className="h-5 w-5" />}
                          </span>
                          <TransletText>{item.label}</TransletText>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Settings Section */}
                <div className="mt-8 pt-6 border-t border-border space-y-4">
                  {/* Theme Switcher - Modern Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                      <SwatchIcon className="h-4 w-4 inline mr-2" />
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['white', 'dark', 'yellow'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t as 'white' | 'dark' | 'yellow')}
                          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                            theme === t 
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                              : 'border-transparent bg-surface hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {t === 'white' && <SunIcon className="h-5 w-5 text-amber-500" />}
                          {t === 'dark' && <MoonIcon className="h-5 w-5 text-indigo-400" />}
                          {t === 'yellow' && <SwatchIcon className="h-5 w-5 text-yellow-500" />}
                          <span className="text-xs capitalize">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selector - Modern Cards with Icons */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                      <GlobeAltIcon className="h-4 w-4 inline mr-2" />
                      <TransletText>language</TransletText>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {routing.locales.map((code) => (
                        <button
                          key={code}
                          onClick={() => switchLanguage(code)}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                            code === locale
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                              : 'border-transparent bg-surface hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-lg">{flagEmoji[code]}</span>
                            <span className="text-sm font-medium">
                              {localeNames[code as keyof typeof localeNames]}
                            </span>
                          </span>
                          {code === locale && (
                            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-6 border-t border-border space-y-3"
                >
                  {session?.user ? (
                    <>
                      <div className="px-4 py-4 rounded-xl bg-primary/10 mb-2">
                        <p className="text-foreground font-semibold">{session.user.name}</p>
                        <p className="text-muted-foreground text-sm truncate">{session.user.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link href="/profile" onClick={closeAllMenus} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-primary/10 transition">
                          <UserCircleIcon className="h-5 w-5" />
                          <TransletText>profile</TransletText>
                        </Link>
                        <Link href="/reservations" onClick={closeAllMenus} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-primary/10 transition">
                          <ClipboardDocumentListIcon className="h-5 w-5" />
                          <TransletText>reservations</TransletText>
                        </Link>
                        {session.user.role === 'admin' && (
                          <Link href="/admin" onClick={closeAllMenus} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition">
                            <ShieldCheckIcon className="h-5 w-5" />
                            <TransletText>admin</TransletText>
                          </Link>
                        )}
                      </div>
                      
                      {/* Logout button moved inside scrollable area */}
                      <button
                        onClick={() => { signOut(); closeAllMenus(); }}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <TransletText>logout</TransletText>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/signin" onClick={closeAllMenus} className="flex items-center gap-3 justify-center w-full px-4 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition font-medium">
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <TransletText>login</TransletText>
                      </Link>
                      <Link href="/auth/signup" onClick={closeAllMenus} className="flex items-center gap-3 justify-center w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition font-semibold">
                        <UserPlusIcon className="h-5 w-5" />
                        <TransletText>signup</TransletText>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NavbarSpacer />
    </>
  );
}