/**
 * DashboardLayout — Sidebar + main content area
 * Supports: Light Mode / Dark Mode with theme toggle
 * All nav items, badges, and buttons are fully functional
 */
import { useState, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Map, CalendarCheck, FileText, CreditCard,
  Settings2, BarChart3, Bot, User, ChevronLeft, ChevronRight,
  Menu, X, Building2, MessageSquare, Star, Bell,
  Shield, HelpCircle, Sun, Moon, LogOut
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";

interface NavItem {
  path: string;
  icon: any;
  labelAr: string;
  labelEn: string;
  badge?: number;
}

const navSections: { titleAr: string; titleEn: string; items: NavItem[] }[] = [
  {
    titleAr: "الرئيسية", titleEn: "MAIN",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
      { path: "/expos", icon: Building2, labelAr: "تصفح المعارض", labelEn: "Browse Expos" },
      { path: "/map", icon: Map, labelAr: "خريطة المعرض", labelEn: "Expo Map" },
    ],
  },
  {
    titleAr: "الحجوزات والعقود", titleEn: "BOOKINGS",
    items: [
      { path: "/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
      { path: "/contracts", icon: FileText, labelAr: "العقود", labelEn: "Contracts" },
      { path: "/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
    ],
  },
  {
    titleAr: "التشغيل والتحليل", titleEn: "OPERATIONS",
    items: [
      { path: "/operations", icon: Settings2, labelAr: "العمليات", labelEn: "Operations" },
      { path: "/analytics", icon: BarChart3, labelAr: "التحليلات", labelEn: "Analytics" },
      { path: "/ai-assistant", icon: Bot, labelAr: "المساعد الذكي", labelEn: "AI Assistant" },
    ],
  },
  {
    titleAr: "التواصل والتقييم", titleEn: "COMMUNICATION",
    items: [
      { path: "/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages", badge: 3 },
      { path: "/notifications", icon: Bell, labelAr: "الإشعارات", labelEn: "Notifications", badge: 4 },
      { path: "/reviews", icon: Star, labelAr: "التقييمات", labelEn: "Reviews" },
    ],
  },
  {
    titleAr: "الحساب", titleEn: "ACCOUNT",
    items: [
      { path: "/profile", icon: User, labelAr: "الملف الشخصي", labelEn: "Profile" },
      { path: "/kyc", icon: Shield, labelAr: "التحقق (KYC)", labelEn: "Verification" },
      { path: "/help", icon: HelpCircle, labelAr: "المساعدة", labelEn: "Help Center" },
    ],
  },
];

const allNavItems = navSections.flatMap(s => s.items);

const mobileNavItems: NavItem[] = [
  { path: "/dashboard", icon: LayoutDashboard, labelAr: "الرئيسية", labelEn: "Home" },
  { path: "/expos", icon: Building2, labelAr: "المعارض", labelEn: "Expos" },
  { path: "/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
  { path: "/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages", badge: 3 },
  { path: "/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { trader, logout } = useAuth();
  const traderName = trader?.name || "التاجر";
  const traderCompany = trader?.companyName || "";

  const currentItem = allNavItems.find(n => n.path === location) || allNavItems.find(n => location.startsWith(n.path));

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sidebar-glass fixed top-0 right-0 h-screen z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6 px-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <img src={LOGO_URL} alt="Maham Expo" className={`object-contain transition-all duration-300 ${collapsed ? "h-8" : "h-11"}`} style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.3)' }} />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navSections.map((section, si) => (
            <div key={si} className="mb-2">
              {!collapsed && (
                <p className="px-5 py-1.5 text-[9px] t-muted uppercase tracking-wider font-['Inter']">
                  {section.titleEn}
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
                        {item.badge && (
                          <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold"
                            style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col leading-tight flex-1">
                          <span className="text-[13px] font-medium"
                            style={{ color: isActive ? "var(--gold-light)" : "var(--text-secondary)" }}>
                            {item.labelAr}
                          </span>
                          <span className="text-[9px] font-['Inter']"
                            style={{ color: isActive ? "var(--gold-accent)" : "var(--text-muted)" }}>
                            {item.labelEn}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: Theme Toggle + Logout + Collapse */}
        <div className="border-t" style={{ borderColor: "var(--glass-border)" }}>
          {!collapsed && (
            <>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-5 py-2.5 transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="text-xs">{theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>
              </button>
              <button
                onClick={() => { logout(); window.location.href = "/"; }}
                className="w-full flex items-center gap-3 px-5 py-2.5 transition-colors"
                style={{ color: "var(--status-red)" }}
              >
                <LogOut size={16} />
                <span className="text-xs">تسجيل الخروج</span>
              </button>
            </>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-3 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 sidebar-glass" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="flex items-center justify-around py-2 px-1">
          {mobileNavItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all relative"
                  style={{ color: isActive ? "var(--gold-accent)" : "var(--text-tertiary)" }}>
                  <item.icon size={17} />
                  <span className="text-[8px]">{item.labelAr}</span>
                  {item.badge && (
                    <span className="absolute -top-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold"
                      style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Menu size={17} />
            <span className="text-[8px]">المزيد</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50"
              style={{ backgroundColor: "var(--modal-overlay)" }}
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 right-0 h-full w-72 sidebar-glass z-50 p-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <img src={LOGO_URL} alt="Maham Expo" className="h-9 object-contain" style={{ filter: theme === 'dark' ? 'none' : 'brightness(0.3)' }} />
                <button onClick={closeMobile} style={{ color: "var(--text-tertiary)" }}>
                  <X size={18} />
                </button>
              </div>
              <nav>
                {navSections.map((section, si) => (
                  <div key={si} className="mb-4">
                    <p className="px-2 py-1 text-[9px] t-muted uppercase tracking-wider font-['Inter']">
                      {section.titleAr} · {section.titleEn}
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
                              {item.badge && (
                                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold"
                                  style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col leading-tight">
                              <span className="text-[13px]" style={{ color: isActive ? "var(--gold-light)" : "var(--text-secondary)" }}>{item.labelAr}</span>
                              <span className="text-[9px] font-['Inter']" style={{ color: isActive ? "var(--gold-accent)" : "var(--text-muted)" }}>{item.labelEn}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
              {/* Theme toggle in mobile */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-3 mt-4 rounded-xl glass-card"
                style={{ color: "var(--text-secondary)" }}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="text-xs">{theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 pb-20 lg:pb-0 ${
          collapsed ? "lg:mr-20" : "lg:mr-64"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-card px-3 sm:px-6 py-2 sm:py-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gold-gradient font-['Inter']">
                {currentItem?.labelEn || "Dashboard"}
              </h1>
              <p className="text-[9px] sm:text-[10px] t-tertiary">
                {currentItem?.labelAr || "لوحة التحكم"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme Toggle (desktop top bar) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link href="/notifications">
                <button className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <Bell size={16} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--gold-accent)" }} />
                </button>
              </Link>
              <Link href="/messages">
                <button className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <MessageSquare size={16} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-blue)" }} />
                </button>
              </Link>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs t-secondary">مرحباً، {traderName}</span>
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
        <div className="p-2 sm:p-4 lg:p-6">
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
