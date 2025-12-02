'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  HomeIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/components/providers/ThemeProvider';
import { signOut, useSession } from '@/app/lib/auth-client';
import { flagEmoji, localeNames, routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { TransletText } from '@/app/lib/services/translation/transletText';

export const NavbarSpacer = () => <div className="h-16" />; // Réduit de h-20

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

export default function Navbar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { locale } = useParams();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile quand la route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Gestion du clic extérieur pour mobile
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node) &&
          menuButtonRef.current && !menuButtonRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Empêche le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const isActivePath = (path: string) => pathname === path || pathname.startsWith(path);

  const switchLanguage = (newLocale: string) => {
      const cleanPath = pathname.startsWith(`/${locale}`)
    ? pathname.slice(3) 
    : pathname;
    
  router.replace(cleanPath || '/', { locale: newLocale });
  };

  const Logo = () => (
    <Link href="/" className="flex items-center" locale={locale as string} >
      <Image src="/vercel.svg" alt="Logo" width={100} height={24} className="h-12 w-auto" />
    </Link>
  );

  // Composant Dropdown unifié
  const Dropdown = ({ 
    trigger, 
    children, 
    isOpen, 
    onToggle,
    className = "" 
  }: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
  }) => (
    <div className={`relative ${className}`}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-foreground/10 transition"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`absolute right-0 mt-2 min-w-[12rem] rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-xl overflow-hidden transition-all ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'
      }`}>
        {children}
      </div>
    </div>
  );

  // Menu utilisateur
  const UserMenu = () => {
    if (!session?.user) return null;
    
    return (
      <Dropdown
        isOpen={activeDropdown === 'user'}
        onToggle={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
        trigger={
          <div className="flex items-center gap-2">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || ''}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {session.user.name?.[0] || 'U'}
              </div>
            )}
          </div>
        }
      >
        <div className="py-1">
          <div className="px-4 py-3 border-b border-border">
            <p className="font-medium text-sm">{session.user.name}</p>
            <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
          </div>
          <Link locale={locale as string} href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition">
            <UserCircleIcon className="h-4 w-4" /> {t('profile')}
          </Link>
          <Link locale={locale as string} href="/reservations" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition">
            <ClipboardDocumentListIcon className="h-4 w-4" /> {t('reservations')}
          </Link>
          {session.user.role === 'admin' && (
            <Link locale={locale as string} href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition">
              <ShieldCheckIcon className="h-4 w-4" /> {t('admin')}
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" /> {t('logout')}
          </button>
        </div>
      </Dropdown>
    );
  };

  // Sélecteur de langue
  const LanguageSelector = ({ isMobile = false }: { isMobile?: boolean }) => {
    const currentFlag = flagEmoji[locale as keyof typeof flagEmoji];
    
    if (isMobile) {
      return (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            <GlobeAltIcon className="h-4 w-4 inline mr-2" />
            {t('language')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {routing.locales.map((code) => (
              <button
                key={code}
                onClick={() => switchLanguage(code)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all ${
                  code === locale
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent bg-surface hover:border-primary/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{flagEmoji[code]}</span>
                  <span className="text-sm">{localeNames[code as keyof typeof localeNames]}</span>
                </span>
                {code === locale && (
                  <svg className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Dropdown
        isOpen={activeDropdown === 'lang'}
        onToggle={() => setActiveDropdown(activeDropdown === 'lang' ? null : 'lang')}
        trigger={
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">{localeNames[locale as keyof typeof localeNames]}</span>
            <span className="text-base">{currentFlag}</span>
          </div>
        }
      >
        <div className="py-1">
          {routing.locales.map((code) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-primary/10 transition ${
                code === locale ? 'text-primary font-medium' : ''
              }`}
            >
              <span className="text-base">{flagEmoji[code]}</span>
              <span>{localeNames[code as keyof typeof localeNames]}</span>
            </button>
          ))}
        </div>
      </Dropdown>
    );
  };

  // Sélecteur de thème
  const ThemeSelector = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            <SunIcon className="h-4 w-4 inline mr-2" />
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'white', icon: SunIcon, label: 'Clair' },
              { value: 'dark', icon: MoonIcon, label: 'Sombre' },
              { value: 'yellow', icon: SwatchIcon, label: 'Jaune' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value as any)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                  theme === value
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-transparent bg-surface hover:border-primary/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${value === 'dark' ? 'text-indigo-400' : value === 'yellow' ? 'text-yellow-500' : 'text-amber-500'}`} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Dropdown
        isOpen={activeDropdown === 'theme'}
        onToggle={() => setActiveDropdown(activeDropdown === 'theme' ? null : 'theme')}
        trigger={
          <div className="p-1">
            {theme === 'white' && <SunIcon className="h-5 w-5" />}
            {theme === 'dark' && <MoonIcon className="h-5 w-5" />}
            {theme === 'yellow' && <SwatchIcon className="h-5 w-5" />}
          </div>
        }
      >
        <div className="py-1">
          {[
            { value: 'white', icon: SunIcon, label: 'Clair' },
            { value: 'dark', icon: MoonIcon, label: 'Sombre' },
            { value: 'yellow', icon: SwatchIcon, label: 'Jaune' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value as any)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-primary/10 transition ${
                theme === value ? 'text-primary font-medium' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </Dropdown>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  const isActive = item.children.some(child => isActivePath(child.href));
                  return (
                    <Dropdown
                      key={item.label}
                      isOpen={activeDropdown === item.label}
                      onToggle={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      trigger={
                        <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                          isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                        }`}>
                          <span><TransletText>{item.label}</TransletText></span>
                        </button>
                      }
                    >
                      <div className="py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition ${
                              isActivePath(child.href) ? 'text-primary font-medium' : ''
                            }`}
                            locale={locale as string}
                          >
                            {child.icon && <child.icon className="h-4 w-4" />}
                            <span><TransletText>{child.label}</TransletText></span> 
                          </Link>
                        ))}
                      </div>
                    </Dropdown>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActivePath(item.href!) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                    }`}
                    locale={locale as string}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span><TransletText>{item.label}</TransletText></span> 
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center space-x-4">
              {session?.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition"
                  locale={locale as string}
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  {'admin'}
                </Link>
              )}

              {!session?.user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 transition"
                    locale={locale as string}
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    <TransletText>{"connexion"}</TransletText> 
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    <TransletText>{"s'inscrire"}</TransletText> 
                  </Link>
                </div>
              ) : (
                <UserMenu />
              )}

              <ThemeSelector />
              <LanguageSelector />
            </div>

            {/* Mobile button */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-foreground/10 transition"
              aria-label="Menu mobile"
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-4/5 max-w-sm z-50 bg-background/95 backdrop-blur-xl border-l border-border shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <Logo />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-foreground/10 transition">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="h-full overflow-y-auto p-5 space-y-6">
              {/* Navigation */}
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  if (item.children) {
                    const isOpen = activeDropdown === item.label;
                    const isActive = item.children.some(child => isActivePath(child.href));
                    
                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition ${
                            isActive ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-5 w-5" />}
                            <span className="font-medium">{t(item.label)}</span>
                          </div>
                          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isOpen && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition ${
                                  isActivePath(child.href) ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5'
                                }`}
                              >
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <TransletText>{child.label}</TransletText> 
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActivePath(item.href!) ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5'
                      }`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <TransletText>{item.label}</TransletText> 
                    </Link>
                  );
                })}
              </nav>

              {/* Settings */}
              <div className="pt-4 border-t border-border space-y-5">
                <ThemeSelector isMobile />
                <LanguageSelector isMobile />
              </div>

              {/* User section */}
              <div className="pt-4 border-t border-border space-y-3">
                {session?.user ? (
                  <>
                    <div className="px-4 py-3 rounded-xl bg-primary/10">
                      <p className="font-medium text-sm">{session.user.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 rounded-lg transition">
                        <UserCircleIcon className="h-4 w-4" /> {t('profile')}
                      </Link>
                      <Link href="/reservations" className="flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 rounded-lg transition">
                        <ClipboardDocumentListIcon className="h-4 w-4" /> {t('reservations')}
                      </Link>
                      {session.user.role === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition">
                          <ShieldCheckIcon className="h-4 w-4" /> {t('admin')}
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" /> {t('logout')}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth/signin" className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition font-medium">
                      <ArrowLeftOnRectangleIcon className="h-4 w-4" /> {t('login')}
                    </Link>
                    <Link href="/auth/signup" className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium">
                      <UserPlusIcon className="h-4 w-4" /> {t('signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <NavbarSpacer />
    </>
  );
}