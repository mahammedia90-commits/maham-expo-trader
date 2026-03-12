/**
 * DashboardLayout — Obsidian Glass sidebar + main content area
 * Design: Apple Vision Pro dark glassmorphism with gold accents
 * Sidebar: Persistent left sidebar (collapsed on mobile → bottom nav)
 */
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, CalendarCheck, FileText, CreditCard,
  Settings2, BarChart3, Bot, User, ChevronLeft, ChevronRight,
  Menu, X, LogOut
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
  { path: "/map", icon: Map, labelAr: "خريطة المعرض", labelEn: "Expo Map" },
  { path: "/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
  { path: "/contracts", icon: FileText, labelAr: "العقود", labelEn: "Contracts" },
  { path: "/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
  { path: "/operations", icon: Settings2, labelAr: "العمليات", labelEn: "Operations" },
  { path: "/analytics", icon: BarChart3, labelAr: "التحليلات", labelEn: "Analytics" },
  { path: "/ai-assistant", icon: Bot, labelAr: "المساعد الذكي", labelEn: "AI Assistant" },
  { path: "/profile", icon: User, labelAr: "الملف الشخصي", labelEn: "Profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sidebar-glass fixed top-0 right-0 h-screen z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6 px-4 border-b border-white/5">
          <img src={LOGO_URL} alt="Maham Expo" className={`object-contain transition-all duration-300 ${collapsed ? "h-8" : "h-10"}`} />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 mx-3 my-1 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/8 border border-[rgba(197,165,90,0.25)] shadow-[0_0_20px_rgba(197,165,90,0.08)]"
                      : "hover:bg-white/4 border border-transparent"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`shrink-0 ${isActive ? "text-[#C5A55A]" : "text-white/50"}`}
                  />
                  {!collapsed && (
                    <div className="flex flex-col leading-tight">
                      <span className={`text-sm font-medium ${isActive ? "text-[#E8D5A3]" : "text-white/70"}`}>
                        {item.labelAr}
                      </span>
                      <span className={`text-[10px] ${isActive ? "text-[#C5A55A]/70" : "text-white/30"}`}>
                        {item.labelEn}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-4 border-t border-white/5 text-white/30 hover:text-[#C5A55A] transition-colors"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 sidebar-glass border-t border-white/8">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-all ${
                  isActive ? "text-[#C5A55A]" : "text-white/40"
                }`}>
                  <item.icon size={18} />
                  <span className="text-[9px]">{item.labelAr}</span>
                </div>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2 text-white/40"
          >
            <Menu size={18} />
            <span className="text-[9px]">المزيد</span>
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
              className="lg:hidden fixed top-0 right-0 h-full w-72 sidebar-glass z-50 p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <img src={LOGO_URL} alt="Maham Expo" className="h-8 object-contain" />
                <button onClick={() => setMobileOpen(false)} className="text-white/50">
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-white/8 border border-[rgba(197,165,90,0.25)]"
                            : "hover:bg-white/4 border border-transparent"
                        }`}
                      >
                        <item.icon size={18} className={isActive ? "text-[#C5A55A]" : "text-white/50"} />
                        <div className="flex flex-col leading-tight">
                          <span className={`text-sm ${isActive ? "text-[#E8D5A3]" : "text-white/70"}`}>{item.labelAr}</span>
                          <span className={`text-[10px] ${isActive ? "text-[#C5A55A]/70" : "text-white/30"}`}>{item.labelEn}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
        <header className="sticky top-0 z-30 glass-card border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gold-gradient font-['Inter']">
                {navItems.find(n => n.path === location)?.labelEn || "Dashboard"}
              </h1>
              <p className="text-xs text-white/40">
                {navItems.find(n => n.path === location)?.labelAr || "لوحة التحكم"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm text-white/80">مرحباً، التاجر</span>
                <span className="text-[10px] text-[#C5A55A]/60">Welcome, Trader</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center">
                <User size={16} className="text-[#0A0A12]" />
              </div>
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
