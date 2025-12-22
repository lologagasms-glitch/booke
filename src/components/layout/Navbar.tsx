"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "@/app/lib/auth-client";
import { Theme, useTheme } from "@/components/providers/ThemeProvider";
import { flagEmoji, localeNames, routing } from "@/i18n/routing";
import { TransletText } from "@/app/lib/services/translation/transletText";

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
} from "@heroicons/react/24/outline";
import { useLocalizedNavigation } from "./useLoc";
import { LocalizedLink } from "./LocalizedLink";

/* ========================== */
/* ===== TYPES & CONFIG ===== */
/* ========================== */

type NavItem = {
  href?: string;
  label: string;
  icon?: React.ElementType;
  children?: Array<{ href: string; label: string; icon?: React.ElementType }>;
};

type ThemeValue = "white" | "dark" | "yellow";

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "accueil", icon: HomeIcon },
  { href: "/etablissements", label: "établissements", icon: BuildingOfficeIcon },
  {
    label: "contact",
    icon: EnvelopeIcon,
    children: [
      { href: "/contact", label: "contact", icon: EnvelopeIcon },
      { href: "/teams", label: "Membres", icon: UserGroupIcon },
    ],
  },
];

const THEME_OPTIONS = [
  { value: "white" as ThemeValue, icon: SunIcon, label: "Clair" },
  { value: "dark" as ThemeValue, icon: MoonIcon, label: "Sombre" },
  { value: "yellow" as ThemeValue, icon: SwatchIcon, label: "Jaune" },
];

/* ========================== */
/* ======= HOOKS ============ */
/* ========================== */

/**
 * Détecte et retourne la hauteur de la zone safe-area (notch, home indicator)
 */
const useSafeAreaBottom = () => {
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  useEffect(() => {
    const updateSafeArea = () => {
      const safeArea = getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-bottom');
      setSafeAreaBottom(parseInt(safeArea) || 0);
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeAreaBottom;
};

/**
 * Gère l'état du scroll pour l'effet de navbar
 */
const useScrollEffect = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll(); // Vérifier l'état initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isScrolled;
};

/* ========================== */
/* ====== COMPONENTS ======== */
/* ========================== */

const Logo = () => {
  const { buildLinkUrl } = useLocalizedNavigation();
  
  return (
    <LocalizedLink href="/" className="flex items-center">
      <Image src="/vercel.svg" alt="Logo" width={100} height={24} className="h-12 w-auto" />
    </LocalizedLink>
  );
};

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen,
  onToggle,
  className = "",
}) => (
  <div className={`relative ${className}`}>
    <button
      onClick={onToggle}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-foreground/10 transition cursor-pointer"
      aria-expanded={isOpen}
    >
      {trigger}
      <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    <div
      className={`absolute right-0 mt-2 min-w-[12rem] rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-xl overflow-hidden transition-all ${
        isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-1 invisible"
      } z-50`}
    >
      {children}
    </div>
  </div>
);

/* ---------- LanguageSelector ---------- */
interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const [open, setOpen] = useState(false);
  const { switchLocale, currentLocale } = useLocalizedNavigation();

  const handleLocaleChange = (code: string) => {
    switchLocale(code as "en" | "fr" | "de" | "es" | "it" | "pt" | "nl" | "ja" | "ru" | "zh");
    setOpen(false);
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
          <GlobeAltIcon className="h-4 w-4 inline mr-2" />
          Langue
        </label>
        <div className="grid grid-cols-2 gap-2">
          {routing.locales.map((code) => (
            <button
              key={code}
              onClick={() => handleLocaleChange(code)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                code === currentLocale ? "border-primary bg-primary/10" : "border-transparent bg-surface hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{flagEmoji[code as keyof typeof flagEmoji]}</span>
                <span className="text-sm">{localeNames[code as keyof typeof localeNames]}</span>
              </span>
              {code === currentLocale && (
                <svg className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentFlag = flagEmoji[currentLocale as keyof typeof flagEmoji];

  return (
    <Dropdown
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
      trigger={
        <div className="flex items-center gap-2 cursor-pointer">
          <GlobeAltIcon className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">{localeNames[currentLocale as keyof typeof localeNames]}</span>
          <span className="text-base">{currentFlag}</span>
        </div>
      }
    >
      <div className="py-1">
        {routing.locales.map((code) => (
          <button
            key={code}
            onClick={() => handleLocaleChange(code)}
            className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-primary/10 transition cursor-pointer ${
              code === currentLocale ? "text-primary font-medium" : ""
            }`}
          >
            <span className="text-base">{flagEmoji[code as keyof typeof flagEmoji]}</span>
            <span>{localeNames[code as keyof typeof localeNames]}</span>
          </button>
        ))}
      </div>
    </Dropdown>
  );
};

/* ---------- ThemeSelector ---------- */
interface ThemeSelectorProps {
  isMobile?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isMobile = false }) => {
  const { theme, setTheme } = useTheme();
  
  if (isMobile) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
          <SwatchIcon className="h-4 w-4 inline mr-2" />
          Thème
        </label>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value as Theme)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                theme === value
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-transparent bg-surface hover:border-primary/50"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  value === "dark" ? "text-indigo-400" : value === "yellow" ? "text-yellow-500" : "text-amber-500"
                }`}
              />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentIndex = THEME_OPTIONS.findIndex(opt => opt.value === theme);
  const nextTheme = THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length];
  const CurrentIcon = THEME_OPTIONS.find((opt) => opt.value === theme)?.icon || SunIcon;

  return (
    <button
      onClick={() => setTheme(nextTheme.value as Theme)}
      className="p-2 rounded-lg hover:bg-foreground/10 transition relative cursor-pointer"
      title={`Changer de thème (${nextTheme.label})`}
    >
      <CurrentIcon className="h-5 w-5" />
    </button>
  );
};

/* ---------- UserMenu ---------- */
const UserMenu: React.FC = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");

  if (!session?.user || session.user.isAnonymous) return null;

  return (
    <Dropdown
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
      trigger={
        <div className="flex items-center gap-2 cursor-pointer group">
          {session.user.image ? (
            <div className="relative">
              <img
                src={session.user.image}
                alt={session.user.name || ""}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-200"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
          ) : (
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm group-hover:scale-105 transition-all duration-200">
                {session.user.name?.[0] || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
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
        <LocalizedLink href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition cursor-pointer">
          <UserCircleIcon className="h-4 w-4" /> {t("profile")}
        </LocalizedLink>
        <LocalizedLink href="/reservations" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition cursor-pointer">
          <ClipboardDocumentListIcon className="h-4 w-4" /> {t("reservations")}
        </LocalizedLink>
        {session.user.role === "admin" && (
          <LocalizedLink href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition cursor-pointer">
            <ShieldCheckIcon className="h-4 w-4" /> {t("admin")}
          </LocalizedLink>
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" /> <TransletText>Déconnexion</TransletText>
        </button>
      </div>
    </Dropdown>
  );
};

/* ========================== */
/* ===== NAVBAR PRINCIPALE === */
/* ========================== */

export default function Navbar() {
  const t = useTranslations("common");
  const { buildLinkUrl } = useLocalizedNavigation();
  const { data: session } = useSession();
  const safeAreaBottom = useSafeAreaBottom();
  const isScrolled = useScrollEffect();
  const pathname=usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // 🔥 CORRECTION PRINCIPALE : Suppression du useEffect problématique
  // useEffect(() => {
  //   setIsMobileMenuOpen(false);
  //   setActiveDropdown(null);
  // }, [buildLinkUrl]);

  /**
   * Ferme le menu mobile et réinitialise les dropdowns
   */
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, []);

  /**
   * Gère le clic en dehors du menu mobile
   */
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const isClickInsideMenu = mobileMenuRef.current?.contains(e.target as Node);
      const isClickOnMenuButton = menuButtonRef.current?.contains(e.target as Node);
      
      if (!isClickInsideMenu && !isClickOnMenuButton) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, closeMobileMenu]);

  /**
   * Empêche le scroll du body quand le menu mobile est ouvert
   */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /**
   * Vérifie si un chemin est actif
   */
  const isActivePath = useCallback((path: string) => {
    const currentPath = buildLinkUrl(path);
    return pathname === currentPath || pathname.startsWith(currentPath);
  }, [buildLinkUrl]);

  /**
   * Bascule l'état du menu mobile
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  /**
   * Bascule l'état d'un dropdown
   */
  const toggleDropdown = useCallback((label: string) => {
    setActiveDropdown(prev => prev === label ? null : label);
  }, []);

  /* ---------- Rendu Desktop ---------- */
  const renderDesktopNav = () => (
    <div className="hidden lg:flex items-center space-x-8">
      {NAV_ITEMS.map((item) => {
        if (item.children) {
          const isActive = item.children.some((child) => isActivePath(child.href));
          return (
            <Dropdown
              key={item.label}
              isOpen={activeDropdown === item.label}
              onToggle={() => toggleDropdown(item.label)}
              trigger={
                <span className={`flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}>
                  <TransletText>{item.label}</TransletText>
                </span>
              }
            >
              <div className="py-1">
                {item.children.map((child) => (
                  <LocalizedLink
                    key={child.href}
                    href={child.href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition cursor-pointer ${
                      isActivePath(child.href) ? "text-primary font-medium" : ""
                    }`}
                  >
                    {child.icon && <child.icon className="h-4 w-4" />}
                    <TransletText>{child.label}</TransletText>
                  </LocalizedLink>
                ))}
              </div>
            </Dropdown>
          );
        }
        return (
          <LocalizedLink
            key={item.href}
            href={item.href!}
            className={`flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
              isActivePath(item.href!) ? "text-primary" : "text-foreground/80 hover:text-primary"
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <TransletText>{item.label}</TransletText>
          </LocalizedLink>
        );
      })}
    </div>
  );

  /* ---------- Rendu Desktop Right ---------- */
  const renderDesktopRight = () => (
    <div className="hidden lg:flex items-center space-x-4">
      {session?.user?.role === "admin" && !session.user.isAnonymous && (
        <LocalizedLink
          href="/admin"
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition cursor-pointer"
        >
          <ShieldCheckIcon className="h-4 w-4" />
          {t("admin")}
        </LocalizedLink>
      )}

      {!session?.user || session.user.isAnonymous ? (
        <div className="flex items-center space-x-3">
          <LocalizedLink
            href="/auth/signin"
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 transition cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            <TransletText>Connexion</TransletText>
          </LocalizedLink>
          <LocalizedLink
            href="/auth/signup"
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium cursor-pointer"
          >
            <UserPlusIcon className="h-4 w-4" />
            <TransletText>{"S'inscrire"}</TransletText>
          </LocalizedLink>
        </div>
      ) : (
        <UserMenu />
      )}

      <ThemeSelector />
      <LanguageSelector />
    </div>
  );

  /* ---------- Rendu Mobile Menu ---------- */
  const renderMobileMenu = () => {
    if (!isMobileMenuOpen) return null;

    return (
      <>
        <div className="lg:hidden">
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" 
            onClick={closeMobileMenu} 
          />
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-0 h-full w-4/5 max-w-sm z-50 bg-background/95 backdrop-blur-xl border-l border-border shadow-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <Logo />
              <button onClick={closeMobileMenu} className="p-2 rounded-full hover:bg-foreground/10 transition cursor-pointer">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div 
              className="overflow-y-auto"
              style={{ 
                height: `calc(100vh - 4rem - ${safeAreaBottom}px)`,
                paddingBottom: `${Math.max(safeAreaBottom, 24)}px`
              }}
            >
              <div className="p-5 space-y-6">
                {/* Navigation */}
                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    if (item.children) {
                      const isOpen = activeDropdown === item.label;
                      const isActive = item.children.some((child) => isActivePath(child.href));
                      return (
                        <div key={item.label}>
                          <button
                            onClick={() => toggleDropdown(item.label)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition cursor-pointer ${
                              isActive ? "bg-primary/10 text-primary" : "hover:bg-foreground/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon && <item.icon className="h-5 w-5" />}
                              <TransletText>{item.label}</TransletText>
                            </div>
                            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="ml-8 mt-1 space-y-1">
                              {item.children.map((child) => (
                                <LocalizedLink
                                  key={child.href}
                                  href={child.href}
                                  className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition cursor-pointer ${
                                    isActivePath(child.href) ? "bg-primary/10 text-primary" : "hover:bg-foreground/5"
                                  }`}
                                >
                                  {child.icon && <child.icon className="h-4 w-4" />}
                                  <TransletText>{child.label}</TransletText>
                                </LocalizedLink>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <LocalizedLink
                        key={item.href}
                        href={item.href!}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition cursor-pointer ${
                          isActivePath(item.href!) ? "bg-primary/10 text-primary" : "hover:bg-foreground/5"
                        }`}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <TransletText>{item.label}</TransletText>
                      </LocalizedLink>
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
                  {session?.user && !session.user.isAnonymous ? (
                    <>
                      <div className="px-4 py-3 rounded-xl bg-primary/10">
                        <p className="font-medium text-sm">{session.user.name}</p>
                        <p className="text-muted-foreground text-xs truncate">{session.user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <LocalizedLink href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 rounded-lg transition cursor-pointer">
                          <UserCircleIcon className="h-4 w-4" /> <TransletText>{"Profile"}</TransletText>
                        </LocalizedLink>
                        <LocalizedLink href="/reservations" className="flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 rounded-lg transition cursor-pointer">
                          <ClipboardDocumentListIcon className="h-4 w-4" /> <TransletText>{"réservations"}</TransletText>
                        </LocalizedLink>
                        {session.user.role === "admin" && (
                          <LocalizedLink href="/admin" className="flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition cursor-pointer">
                            <ShieldCheckIcon className="h-4 w-4" /> admin
                          </LocalizedLink>
                        )}
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-3 w-full px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition cursor-pointer"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" /> <TransletText>Déconnexion</TransletText>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <LocalizedLink href="/auth/signin" className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition font-medium cursor-pointer">
                        <ArrowLeftOnRectangleIcon className="h-4 w-4" /> <TransletText>Connexion</TransletText>
                      </LocalizedLink>
                      <LocalizedLink href="/auth/signup" className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-medium cursor-pointer">
                        <UserPlusIcon className="h-4 w-4" /> <TransletText>{"s'inscrire"}</TransletText>
                      </LocalizedLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  /* ---------- RENDU PRINCIPAL ---------- */
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? "bg-background/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Logo />
            {renderDesktopNav()}
            {renderDesktopRight()}

            {/* Mobile button */}
            <button
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-foreground/10 transition cursor-pointer"
              aria-label="Menu mobile"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {renderMobileMenu()}
      <div className="h-20" />
    </>
  );
}

export const NavbarSpacer = () => <div className="h-20" />;