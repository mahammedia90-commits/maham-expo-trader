/**
 * DashboardLayout — Sidebar + main content area
 * Features: Bottom Nav, Back button, Logout, Responsive, Language Switcher, Theme Toggle
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, LANGUAGES, type Language } from "@/contexts/LanguageContext";
import {
  LayoutDashboard, Map, CalendarCheck, FileText, CreditCard,
  BarChart3, Bot, User, ChevronLeft, ChevronRight,
  Menu, X, Building2, MessageSquare, Star, Bell,
  Shield, HelpCircle, Sun, Moon, LogOut, Phone, Mail, ArrowRight,
  Globe, Check, Users, Package
} from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";

interface NavItem {
  path: string;
  icon: any;
  labelKey: string;
  badge?: number;
  badgeKey?: "bookings" | "notifications" | "messages";
}

function useNavSections(t: (key: string) => string): { titleKey: string; items: NavItem[] }[] {
  return [
    {
      titleKey: "nav.dashboard",
      items: [
        { path: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
        { path: "/expos", icon: Building2, labelKey: "nav.expos" },
        { path: "/map", icon: Map, labelKey: "nav.map" },
      ],
    },
    {
      titleKey: "nav.bookings",
      items: [
        { path: "/bookings", icon: CalendarCheck, labelKey: "nav.bookings", badgeKey: "bookings" as const },
        { path: "/contracts", icon: FileText, labelKey: "nav.contracts" },
        { path: "/payments", icon: CreditCard, labelKey: "nav.payments" },
        { path: "/waitlist", icon: Bell, labelKey: "nav.waitlist" },
      ],
    },
    {
      titleKey: "nav.services",
      items: [
        { path: "/services", icon: Package, labelKey: "nav.services" },
        { path: "/team", icon: Users, labelKey: "nav.team" },
        { path: "/analytics", icon: BarChart3, labelKey: "nav.analytics" },
        { path: "/ai-assistant", icon: Bot, labelKey: "nav.ai" },
      ],
    },
    {
      titleKey: "common.notifications",
      items: [
        { path: "/messages", icon: MessageSquare, labelKey: "nav.help", badgeKey: "messages" },
        { path: "/notifications", icon: Bell, labelKey: "common.notifications", badgeKey: "notifications" },
        { path: "/reviews", icon: Star, labelKey: "nav.help" },
      ],
    },
    {
      titleKey: "settings.profile",
      items: [
        { path: "/profile", icon: User, labelKey: "settings.profile" },
        { path: "/kyc", icon: Shield, labelKey: "nav.kyc" },
        { path: "/help", icon: HelpCircle, labelKey: "nav.help" },
      ],
    },
  ];
}

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Calculate position when opening
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: Math.max(8, rect.left - 80),
    });
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [open]);

  const handleSelect = (code: Language) => {
    setLang(code);
    setOpen(false);
    const langName = LANGUAGES.find(l => l.code === code)?.nativeName || code;
    toast.success(langName);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg transition-colors ${
          compact ? "p-2" : "w-full px-3 py-3"
        }`}
        style={{
          color: "var(--text-secondary)",
          background: compact ? "transparent" : "var(--glass-bg)",
          border: compact ? "none" : "1px solid var(--glass-border)",
        }}
        title={t("settings.language")}
      >
        <Globe size={16} />
        {!compact && (
          <>
            <span className="text-xs flex-1 text-start">
              {LANGUAGES.find(l => l.code === lang)?.nativeName}
            </span>
            <ChevronLeft size={12} className={`transition-transform ${open ? "rotate-90" : ""}`} />
          </>
        )}
      </button>

      {open && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 99998 }}
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="fixed rounded-xl overflow-hidden shadow-2xl"
            style={{
              zIndex: 99999,
              top: pos.top,
              left: pos.left,
              minWidth: "220px",
              background: "var(--sidebar-bg)",
              backdropFilter: "blur(40px)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="p-2">
              <p className="px-2 py-1 text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {t("settings.language")}
              </p>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    lang === l.code ? "bg-gold-subtle" : "hover:bg-[var(--glass-bg-hover)]"
                  }`}
                  style={lang === l.code ? { border: "1px solid var(--gold-border)" } : { border: "1px solid transparent" }}
                >
                  <span className="text-base">{l.flag}</span>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-xs font-medium" style={{ color: lang === l.code ? "var(--gold-light)" : "var(--text-secondary)" }}>
                      {l.nativeName}
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                      {l.name}
                    </span>
                  </div>
                  {lang === l.code && <Check size={14} style={{ color: "var(--gold-accent)" }} />}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { trader, logout, unreadCount, pendingBookingsCount } = useAuth();
  const { t, lang, isRTL, dir } = useLanguage();
  const traderName = trader?.name || t("settings.profile");
  const traderCompany = trader?.companyName || "";

  const navSections = useNavSections(t);
  const allNavItems = navSections.flatMap(s => s.items);

  const mobileNavItems: NavItem[] = [
    { path: "/expos", icon: Building2, labelKey: "nav.expos" },
    { path: "/bookings", icon: CalendarCheck, labelKey: "nav.bookings", badgeKey: "bookings" },
    { path: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
    { path: "/messages", icon: MessageSquare, labelKey: "nav.help", badgeKey: "messages" },
    { path: "/profile", icon: User, labelKey: "settings.profile" },
  ];

  const currentItem = allNavItems.find(n => n.path === location) || allNavItems.find(n => location.startsWith(n.path));
  const isSubPage = location !== "/dashboard" && location !== "/expos";

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    toast.success(t("nav.logout"));
    window.location.href = "/";
  }, [logout, t]);

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/expos");
    }
  }, [navigate]);

  // Dynamic positioning based on RTL/LTR
  const sidebarSide = isRTL ? "right-0" : "left-0";
  const mainMargin = isRTL
    ? (collapsed ? "lg:mr-20" : "lg:mr-64")
    : (collapsed ? "lg:ml-20" : "lg:ml-64");
  const drawerSide = isRTL ? "right-0" : "left-0";
  const drawerBorder = isRTL
    ? { borderLeft: "1px solid var(--glass-border)" }
    : { borderRight: "1px solid var(--glass-border)" };
  const drawerInitial = isRTL ? { x: "100%" } : { x: "-100%" };

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sidebar-glass fixed top-0 ${sidebarSide} h-screen z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center py-6 px-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <img src={LOGO_URL} alt="Maham Expo" className={`object-contain transition-all duration-300 ${collapsed ? "h-10 w-10" : "h-16 w-auto max-w-[200px]"}`} style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.25) contrast(1.2)' }} />
          {!collapsed && (
            <>
              <p className="text-[9px] t-tertiary mt-2 text-center leading-tight font-semibold">{isRTL ? "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات" : "Maham Expo for Exhibitions & Conferences"}</p>
              <p className="text-[8px] t-muted text-center leading-tight font-['Inter'] mt-0.5" style={{ opacity: 0.7 }}>{isRTL ? "Maham Expo for Exhibitions & Conferences" : "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات"}</p>
              <p className="text-[7px] t-muted text-center leading-tight mt-0.5" style={{ opacity: 0.5 }}>{isRTL ? "فرع من شركة مهام للخدمات وتقنية المعلومات" : "A branch of Maham Services & IT Company"}</p>
            </>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navSections.map((section, si) => (
            <div key={si} className="mb-2">
              {!collapsed && (
                <p className="px-5 py-1.5 text-[9px] t-muted uppercase tracking-wider">
                  {t(section.titleKey)}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = location === item.path || (item.path !== "/dashboard" && location.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`flex items-center gap-3 mx-3 my-0.5 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-gold-subtle border-gold shadow-sm"
                          : "hover:bg-[var(--glass-bg-hover)] border border-transparent"
                      }`}
                      style={isActive ? { border: `1px solid var(--gold-border)` } : undefined}
                    >
                      <div className="relative">
                        <item.icon
                          size={18}
                          className="shrink-0"
                          style={{ color: isActive ? "var(--gold-accent)" : "var(--text-tertiary)" }}
                        />
                        {(() => {
                          const count = item.badgeKey === "bookings" ? pendingBookingsCount
                            : item.badgeKey === "notifications" ? unreadCount
                            : item.badgeKey === "messages" ? 3
                            : item.badge || 0;
                          return count > 0 ? (
                            <span className="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[8px] font-bold animate-pulse"
                              style={{ backgroundColor: item.badgeKey === "bookings" ? "var(--status-yellow)" : "var(--badge-bg)", color: item.badgeKey === "bookings" ? "#000" : "var(--badge-text)" }}>
                              {count}
                            </span>
                          ) : null;
                        })()}
                      </div>
                      {!collapsed && (
                        <span className="text-[13px] font-medium"
                          style={{ color: isActive ? "var(--gold-light)" : "var(--text-secondary)" }}>
                          {t(item.labelKey)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: Collapse Only */}
        <div className="border-t" style={{ borderColor: "var(--glass-border)" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-3 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {collapsed
              ? (isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
              : (isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
            }
          </button>
        </div>
      </aside>

      {/* ========== MOBILE BOTTOM NAV — ALWAYS VISIBLE ========== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50" style={{
        background: "var(--bg-primary, #0a0a0a)",
        borderTop: "1px solid var(--glass-border)",
        paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)",
      }}>
        <div className="flex items-center justify-around py-2 px-1">
          {mobileNavItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/dashboard" && item.path !== "/expos" && location.startsWith(item.path));
            const isExactActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all relative min-w-[44px]"
                  style={{ color: isExactActive ? "var(--gold-accent)" : "var(--text-tertiary)" }}>
                  <div className="relative">
                    <item.icon size={20} strokeWidth={isExactActive ? 2.5 : 1.8} />
                    {(() => {
                      const count = item.badgeKey === "bookings" ? pendingBookingsCount
                        : item.badgeKey === "notifications" ? unreadCount
                        : item.badgeKey === "messages" ? 3
                        : item.badge || 0;
                      return count > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[7px] font-bold animate-pulse"
                          style={{ backgroundColor: item.badgeKey === "bookings" ? "var(--status-yellow)" : "var(--badge-bg)", color: item.badgeKey === "bookings" ? "#000" : "var(--badge-text)" }}>
                          {count}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium leading-tight truncate max-w-[56px] text-center">{t(item.labelKey)}</span>
                  {isExactActive && (
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full" style={{ backgroundColor: "var(--gold-accent)" }} />
                  )}
                </div>
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 min-w-[44px]"
            style={{ color: mobileOpen ? "var(--gold-accent)" : "var(--text-tertiary)" }}
          >
            <Menu size={20} strokeWidth={1.8} />
            <span className="text-[9px] sm:text-[10px] font-medium leading-tight truncate max-w-[56px] text-center">{t("common.filter")}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[55]"
              style={{ backgroundColor: "var(--modal-overlay)" }}
              onClick={closeMobile}
            />
            <motion.div
              initial={drawerInitial}
              animate={{ x: 0 }}
              exit={drawerInitial}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed top-0 ${drawerSide} h-full w-[280px] z-[56] overflow-y-auto`}
              style={{
                background: "var(--sidebar-bg)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                ...drawerBorder,
              }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <img src={LOGO_URL} alt="Maham Expo" className="h-9 object-contain" style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.3)' }} />
                <button onClick={closeMobile} className="p-2 rounded-lg" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}>
                  <X size={16} />
                </button>
              </div>

              {/* Trader Info */}
              <div className="p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--gold-accent), var(--gold-light))" }}>
                    <User size={16} style={{ color: "var(--btn-gold-text)" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold t-primary truncate">{traderName}</p>
                    <p className="text-[10px] t-gold/60 font-['Inter'] truncate">{traderCompany}</p>
                  </div>
                </div>
              </div>

              {/* Nav Sections */}
              <nav className="p-3">
                {navSections.map((section, si) => (
                  <div key={si} className="mb-3">
                    <p className="px-2 py-1 text-[9px] t-muted uppercase tracking-wider">
                      {t(section.titleKey)}
                    </p>
                    {section.items.map((item) => {
                      const isActive = location === item.path;
                      return (
                        <Link key={item.path} href={item.path}>
                          <div
                            onClick={closeMobile}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all my-0.5 ${
                              isActive ? "bg-gold-subtle" : ""
                            }`}
                            style={isActive ? { border: "1px solid var(--gold-border)" } : { border: "1px solid transparent" }}
                          >
                            <div className="relative">
                              <item.icon size={16} style={{ color: isActive ? "var(--gold-accent)" : "var(--text-tertiary)" }} />
                              {(() => {
                                const count = item.badgeKey === "bookings" ? pendingBookingsCount
                                  : item.badgeKey === "notifications" ? unreadCount
                                  : item.badgeKey === "messages" ? 3
                                  : item.badge || 0;
                                return count > 0 ? (
                                  <span className="absolute -top-1 -left-1 min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center text-[6px] font-bold"
                                    style={{ backgroundColor: item.badgeKey === "bookings" ? "var(--status-yellow)" : "var(--badge-bg)", color: item.badgeKey === "bookings" ? "#000" : "var(--badge-text)" }}>
                                    {count}
                                  </span>
                                ) : null;
                              })()}
                            </div>
                            <span className="text-[13px]" style={{ color: isActive ? "var(--gold-light)" : "var(--text-secondary)" }}>
                              {t(item.labelKey)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              {/* Drawer Footer — Clean */}
              <div className="p-3 border-t mt-auto" style={{ borderColor: "var(--glass-border)" }}>
                <p className="text-[9px] t-muted text-center">
                  {isRTL ? "مهام إكسبو — بوابة التاجر" : "Maham Expo — Trader Portal"}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 min-w-0 min-h-screen transition-all duration-300 ${mainMargin}`}
        style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom, 24px))" }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 px-3 sm:px-6 py-2 sm:py-3" style={{
          background: "var(--sidebar-bg)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderBottom: "1px solid var(--glass-border)",
        }}>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2">
              {/* Back Button — shows on sub-pages */}
              {isSubPage && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-lg transition-colors shrink-0"
                  style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}
                  title={t("common.back")}
                >
                  {isRTL ? <ArrowRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              )}
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gold-gradient">
                  {currentItem ? t(currentItem.labelKey) : t("nav.dashboard")}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all"
                style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
                title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Language Switcher — compact in header */}
              <LanguageSwitcher compact />

              <Link href="/notifications">
                <button className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[8px] font-bold animate-pulse"
                      style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              </Link>
              <Link href="/messages">
                <button className="relative p-2 rounded-lg transition-colors hidden sm:block" style={{ color: "var(--text-tertiary)" }}>
                  <MessageSquare size={16} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-blue)" }} />
                </button>
              </Link>
              <div className="hidden sm:flex flex-col" style={{ textAlign: isRTL ? "left" : "right" }}>
                <span className="text-xs t-secondary">{traderName}</span>
                <span className="text-[9px]" style={{ color: "var(--gold-accent)", opacity: 0.6 }}>{traderCompany}</span>
              </div>
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: `linear-gradient(135deg, var(--gold-accent), var(--gold-light))` }}>
                  <User size={14} style={{ color: "var(--btn-gold-text)" }} />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-2 sm:p-4 lg:p-6 pb-24 lg:pb-6 overflow-x-hidden">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
