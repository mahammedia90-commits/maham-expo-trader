/**
 * DashboardLayout — Obsidian Glass sidebar + main content area
 * Design: Apple Vision Pro dark glassmorphism with gold accents
 * Sidebar: Persistent left sidebar with sections (collapsed on mobile → bottom nav)
 * Updated: All new pages added (Expos, Messages, Reviews, Notifications, KYC, Help)
 */
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, CalendarCheck, FileText, CreditCard,
  Settings2, BarChart3, Bot, User, ChevronLeft, ChevronRight,
  Menu, X, LogOut, Building2, MessageSquare, Star, Bell,
  Shield, HelpCircle
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
    titleAr: "الرئيسية",
    titleEn: "Main",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
      { path: "/expos", icon: Building2, labelAr: "تصفح المعارض", labelEn: "Browse Expos" },
      { path: "/map", icon: Map, labelAr: "خريطة المعرض", labelEn: "Expo Map" },
    ],
  },
  {
    titleAr: "الحجوزات والعقود",
    titleEn: "Bookings",
    items: [
      { path: "/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
      { path: "/contracts", icon: FileText, labelAr: "العقود", labelEn: "Contracts" },
      { path: "/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
    ],
  },
  {
    titleAr: "التشغيل والتحليل",
    titleEn: "Operations",
    items: [
      { path: "/operations", icon: Settings2, labelAr: "العمليات", labelEn: "Operations" },
      { path: "/analytics", icon: BarChart3, labelAr: "التحليلات", labelEn: "Analytics" },
      { path: "/ai-assistant", icon: Bot, labelAr: "المساعد الذكي", labelEn: "AI Assistant" },
    ],
  },
  {
    titleAr: "التواصل والتقييم",
    titleEn: "Communication",
    items: [
      { path: "/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages", badge: 3 },
      { path: "/notifications", icon: Bell, labelAr: "الإشعارات", labelEn: "Notifications", badge: 4 },
      { path: "/reviews", icon: Star, labelAr: "التقييمات", labelEn: "Reviews" },
    ],
  },
  {
    titleAr: "الحساب",
    titleEn: "Account",
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

  const currentItem = allNavItems.find(n => n.path === location) || allNavItems.find(n => location.startsWith(n.path));

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sidebar-glass fixed top-0 right-0 h-screen z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-5 px-4 border-b border-white/5">
          <img src={LOGO_URL} alt="Maham Expo" className={`object-contain transition-all duration-300 ${collapsed ? "h-7" : "h-9"}`} />
        </div>

        {/* Nav Items with Sections */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {navSections.map((section, si) => (
            <div key={si} className="mb-2">
              {!collapsed && (
                <p className="px-5 py-1.5 text-[9px] text-white/20 uppercase tracking-wider font-['Inter']">
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
                          ? "bg-white/8 border border-[rgba(197,165,90,0.25)] shadow-[0_0_20px_rgba(197,165,90,0.08)]"
                          : "hover:bg-white/4 border border-transparent"
                      }`}
                    >
                      <div className="relative">
                        <item.icon
                          size={18}
                          className={`shrink-0 ${isActive ? "text-[#C5A55A]" : "text-white/40"}`}
                        />
                        {item.badge && (
                          <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#C5A55A] flex items-center justify-center text-[7px] text-[#0A0A12] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col leading-tight flex-1">
                          <span className={`text-[13px] font-medium ${isActive ? "text-[#E8D5A3]" : "text-white/60"}`}>
                            {item.labelAr}
                          </span>
                          <span className={`text-[9px] ${isActive ? "text-[#C5A55A]/60" : "text-white/20"} font-['Inter']`}>
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

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/5 text-white/25 hover:text-[#C5A55A] transition-colors"
        >
          {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 sidebar-glass border-t border-white/8">
        <div className="flex items-center justify-around py-2 px-1">
          {mobileNavItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all relative ${
                  isActive ? "text-[#C5A55A]" : "text-white/35"
                }`}>
                  <item.icon size={17} />
                  <span className="text-[8px]">{item.labelAr}</span>
                  {item.badge && (
                    <span className="absolute -top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#C5A55A] flex items-center justify-center text-[6px] text-[#0A0A12] font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2 text-white/35"
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
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 right-0 h-full w-72 sidebar-glass z-50 p-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <img src={LOGO_URL} alt="Maham Expo" className="h-7 object-contain" />
                <button onClick={() => setMobileOpen(false)} className="text-white/40">
                  <X size={18} />
                </button>
              </div>
              <nav>
                {navSections.map((section, si) => (
                  <div key={si} className="mb-4">
                    <p className="px-2 py-1 text-[9px] text-white/20 uppercase tracking-wider font-['Inter']">
                      {section.titleAr} · {section.titleEn}
                    </p>
                    {section.items.map((item) => {
                      const isActive = location === item.path;
                      return (
                        <Link key={item.path} href={item.path}>
                          <div
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all my-0.5 ${
                              isActive
                                ? "bg-white/8 border border-[rgba(197,165,90,0.25)]"
                                : "hover:bg-white/4 border border-transparent"
                            }`}
                          >
                            <div className="relative">
                              <item.icon size={16} className={isActive ? "text-[#C5A55A]" : "text-white/40"} />
                              {item.badge && (
                                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-[#C5A55A] flex items-center justify-center text-[6px] text-[#0A0A12] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col leading-tight">
                              <span className={`text-[13px] ${isActive ? "text-[#E8D5A3]" : "text-white/60"}`}>{item.labelAr}</span>
                              <span className={`text-[9px] ${isActive ? "text-[#C5A55A]/60" : "text-white/20"} font-['Inter']`}>{item.labelEn}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
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
        <header className="sticky top-0 z-30 glass-card border-b border-white/5 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gold-gradient font-['Inter']">
                {currentItem?.labelEn || "Dashboard"}
              </h1>
              <p className="text-[10px] text-white/35">
                {currentItem?.labelAr || "لوحة التحكم"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/notifications">
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Bell size={16} className="text-white/40" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C5A55A]" />
                </button>
              </Link>
              <Link href="/messages">
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <MessageSquare size={16} className="text-white/40" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400" />
                </button>
              </Link>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-white/70">مرحباً، التاجر</span>
                <span className="text-[9px] text-[#C5A55A]/50">Welcome, Trader</span>
              </div>
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center cursor-pointer">
                  <User size={14} className="text-[#0A0A12]" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
