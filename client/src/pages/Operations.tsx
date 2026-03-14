/**
 * Operations Marketplace — Full operational services marketplace
 * Categories: Design, Utilities, Connectivity, Logistics, Print, Security, Cleaning, Tech/AV
 * Features: Service catalog, order form, order tracking, timeline
 * All text uses t() for multi-language support
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2, Truck, ShieldCheck, Users, Wrench, Wifi, Zap, CheckCircle, Clock,
  AlertTriangle, Plus, Palette, Printer, Monitor, Sparkles, X, ShoppingCart,
  Package, Star, Search, Filter, ArrowRight, Phone, Mail, FileText
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  category: string;
  categoryEn: string;
  price: number;
  unit: string;
  unitEn: string;
  icon: typeof Zap;
  rating: number;
  popular: boolean;
  features: { ar: string; en: string }[];
}

interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  total: number;
  status: "pending" | "confirmed" | "in_progress" | "completed";
  date: string;
  notes: string;
}

const SERVICE_CATEGORIES = [
  { ar: "الكل", en: "All", icon: Package },
  { ar: "تصميم البوث", en: "Booth Design", icon: Palette },
  { ar: "كهرباء وتكييف", en: "Utilities", icon: Zap },
  { ar: "إنترنت واتصالات", en: "Connectivity", icon: Wifi },
  { ar: "لوجستيات ونقل", en: "Logistics", icon: Truck },
  { ar: "طباعة ولافتات", en: "Print & Signage", icon: Printer },
  { ar: "أمن وسلامة", en: "Security", icon: ShieldCheck },
  { ar: "تنظيف وصيانة", en: "Cleaning", icon: Wrench },
  { ar: "تقنية وشاشات", en: "Tech & AV", icon: Monitor },
];

const SERVICES: ServiceItem[] = [
  // Booth Design
  { id: "SVC-001", nameAr: "تصميم بوث قياسي", nameEn: "Standard Booth Design", descAr: "تصميم وتنفيذ بوث قياسي 3×3 م شامل الهيكل والجدران والإضاءة الأساسية", descEn: "Design and build standard 3×3m booth including structure, walls, and basic lighting", category: "تصميم البوث", categoryEn: "Booth Design", price: 12000, unit: "بوث", unitEn: "booth", icon: Palette, rating: 4.8, popular: true, features: [{ ar: "هيكل ألمنيوم", en: "Aluminum frame" }, { ar: "جدران MDF", en: "MDF walls" }, { ar: "إضاءة LED", en: "LED lighting" }] },
  { id: "SVC-002", nameAr: "تصميم بوث مميز", nameEn: "Premium Booth Design", descAr: "تصميم وتنفيذ بوث مميز مع تشطيبات فاخرة وإضاءة متقدمة وشاشات عرض", descEn: "Premium booth design with luxury finishes, advanced lighting, and display screens", category: "تصميم البوث", categoryEn: "Booth Design", price: 35000, unit: "بوث", unitEn: "booth", icon: Palette, rating: 4.9, popular: true, features: [{ ar: "تشطيبات فاخرة", en: "Luxury finishes" }, { ar: "إضاءة ذكية", en: "Smart lighting" }, { ar: "شاشة 55 بوصة", en: "55\" display" }] },
  { id: "SVC-003", nameAr: "تصميم جزيرة عرض", nameEn: "Island Display Design", descAr: "تصميم وتنفيذ جزيرة عرض مفتوحة من 4 جهات مع تصميم ثلاثي الأبعاد مخصص", descEn: "Open island display design accessible from 4 sides with custom 3D design", category: "تصميم البوث", categoryEn: "Booth Design", price: 75000, unit: "جزيرة", unitEn: "island", icon: Palette, rating: 5.0, popular: false, features: [{ ar: "4 واجهات مفتوحة", en: "4 open facades" }, { ar: "تصميم 3D مخصص", en: "Custom 3D design" }, { ar: "أرضية خاصة", en: "Custom flooring" }] },
  // Utilities
  { id: "SVC-004", nameAr: "توصيلة كهرباء 220V", nameEn: "220V Power Connection", descAr: "توصيلة كهرباء أحادية الطور 220V/16A مع قاطع حماية وتمديدات آمنة", descEn: "Single-phase 220V/16A power connection with circuit breaker and safe wiring", category: "كهرباء وتكييف", categoryEn: "Utilities", price: 800, unit: "توصيلة", unitEn: "connection", icon: Zap, rating: 4.7, popular: true, features: [{ ar: "قاطع حماية", en: "Circuit breaker" }, { ar: "تمديد 10 أمتار", en: "10m extension" }] },
  { id: "SVC-005", nameAr: "توصيلة كهرباء 380V", nameEn: "380V Power Connection", descAr: "توصيلة كهرباء ثلاثية الطور 380V/32A للمعدات الثقيلة والشاشات الكبيرة", descEn: "Three-phase 380V/32A power for heavy equipment and large displays", category: "كهرباء وتكييف", categoryEn: "Utilities", price: 2500, unit: "توصيلة", unitEn: "connection", icon: Zap, rating: 4.6, popular: false, features: [{ ar: "3 أطوار", en: "3-phase" }, { ar: "32 أمبير", en: "32A capacity" }] },
  { id: "SVC-006", nameAr: "وحدة تكييف متنقلة", nameEn: "Portable AC Unit", descAr: "وحدة تكييف متنقلة 2 طن مع خرطوم تصريف — مثالية للبوثات المغلقة", descEn: "2-ton portable AC unit with drain hose — ideal for enclosed booths", category: "كهرباء وتكييف", categoryEn: "Utilities", price: 3500, unit: "وحدة/يوم", unitEn: "unit/day", icon: Zap, rating: 4.5, popular: false, features: [{ ar: "2 طن تبريد", en: "2-ton cooling" }, { ar: "صامتة", en: "Low noise" }] },
  // Connectivity
  { id: "SVC-007", nameAr: "إنترنت فائق السرعة", nameEn: "High-Speed Internet", descAr: "اتصال إنترنت مخصص 100Mbps متماثل مع IP ثابت ودعم فني 24/7", descEn: "Dedicated 100Mbps symmetric internet with static IP and 24/7 support", category: "إنترنت واتصالات", categoryEn: "Connectivity", price: 2000, unit: "اتصال", unitEn: "connection", icon: Wifi, rating: 4.8, popular: true, features: [{ ar: "100Mbps متماثل", en: "100Mbps symmetric" }, { ar: "IP ثابت", en: "Static IP" }, { ar: "دعم 24/7", en: "24/7 support" }] },
  { id: "SVC-008", nameAr: "نظام هاتف VoIP", nameEn: "VoIP Phone System", descAr: "نظام هاتف رقمي مع رقم محلي وتحويل مكالمات وبريد صوتي", descEn: "Digital phone system with local number, call forwarding, and voicemail", category: "إنترنت واتصالات", categoryEn: "Connectivity", price: 800, unit: "خط", unitEn: "line", icon: Phone, rating: 4.3, popular: false, features: [{ ar: "رقم محلي", en: "Local number" }, { ar: "تحويل مكالمات", en: "Call forwarding" }] },
  // Logistics
  { id: "SVC-009", nameAr: "نقل وتوصيل بضائع", nameEn: "Cargo Transport", descAr: "نقل بضائع ومعدات من المستودع إلى موقع المعرض مع تفريغ وتركيب", descEn: "Transport goods and equipment from warehouse to venue with unloading and setup", category: "لوجستيات ونقل", categoryEn: "Logistics", price: 4500, unit: "شحنة", unitEn: "shipment", icon: Truck, rating: 4.6, popular: true, features: [{ ar: "شاحنة مبردة", en: "Refrigerated truck" }, { ar: "تأمين شامل", en: "Full insurance" }, { ar: "تفريغ وتركيب", en: "Unload & setup" }] },
  { id: "SVC-010", nameAr: "تخزين مؤقت", nameEn: "Temporary Storage", descAr: "مساحة تخزين مؤقتة مكيفة بالقرب من موقع المعرض مع حراسة 24/7", descEn: "Climate-controlled temporary storage near venue with 24/7 security", category: "لوجستيات ونقل", categoryEn: "Logistics", price: 1500, unit: "م²/أسبوع", unitEn: "sqm/week", icon: Package, rating: 4.4, popular: false, features: [{ ar: "مكيّف", en: "Climate-controlled" }, { ar: "حراسة 24/7", en: "24/7 security" }] },
  // Print & Signage
  { id: "SVC-011", nameAr: "طباعة لافتة خارجية", nameEn: "Outdoor Banner Print", descAr: "طباعة لافتة خارجية عالية الجودة على فينيل مع تركيب — حتى 3×2 متر", descEn: "High-quality outdoor vinyl banner print with installation — up to 3×2m", category: "طباعة ولافتات", categoryEn: "Print & Signage", price: 1200, unit: "لافتة", unitEn: "banner", icon: Printer, rating: 4.7, popular: true, features: [{ ar: "فينيل عالي الجودة", en: "High-quality vinyl" }, { ar: "مقاوم للماء", en: "Waterproof" }, { ar: "تركيب مجاني", en: "Free installation" }] },
  { id: "SVC-012", nameAr: "رول أب ستاند", nameEn: "Roll-Up Stand", descAr: "ستاند رول أب 85×200 سم مع طباعة عالية الدقة وحقيبة حمل", descEn: "85×200cm roll-up stand with high-resolution print and carry bag", category: "طباعة ولافتات", categoryEn: "Print & Signage", price: 450, unit: "ستاند", unitEn: "stand", icon: Printer, rating: 4.8, popular: true, features: [{ ar: "طباعة HD", en: "HD print" }, { ar: "حقيبة حمل", en: "Carry bag" }] },
  // Security
  { id: "SVC-013", nameAr: "حارس أمن", nameEn: "Security Guard", descAr: "حارس أمن مرخص ومدرب — وردية 8 ساعات مع زي رسمي وجهاز اتصال", descEn: "Licensed and trained security guard — 8-hour shift with uniform and radio", category: "أمن وسلامة", categoryEn: "Security", price: 600, unit: "وردية", unitEn: "shift", icon: ShieldCheck, rating: 4.5, popular: false, features: [{ ar: "مرخص", en: "Licensed" }, { ar: "زي رسمي", en: "Uniform" }, { ar: "جهاز اتصال", en: "Radio" }] },
  // Cleaning
  { id: "SVC-014", nameAr: "تنظيف يومي للبوث", nameEn: "Daily Booth Cleaning", descAr: "خدمة تنظيف يومية شاملة للبوث مع مواد تنظيف وتعقيم", descEn: "Comprehensive daily booth cleaning with cleaning supplies and sanitization", category: "تنظيف وصيانة", categoryEn: "Cleaning", price: 350, unit: "يوم", unitEn: "day", icon: Wrench, rating: 4.6, popular: false, features: [{ ar: "تنظيف شامل", en: "Full cleaning" }, { ar: "تعقيم", en: "Sanitization" }] },
  // Tech & AV
  { id: "SVC-015", nameAr: "شاشة LED 55 بوصة", nameEn: "55\" LED Display", descAr: "شاشة LED 55 بوصة 4K مع حامل أرضي وتوصيل HDMI — إيجار يومي", descEn: "55\" 4K LED display with floor stand and HDMI connection — daily rental", category: "تقنية وشاشات", categoryEn: "Tech & AV", price: 800, unit: "يوم", unitEn: "day", icon: Monitor, rating: 4.7, popular: true, features: [{ ar: "4K UHD", en: "4K UHD" }, { ar: "حامل أرضي", en: "Floor stand" }, { ar: "HDMI", en: "HDMI" }] },
  { id: "SVC-016", nameAr: "نظام صوت احترافي", nameEn: "Professional Sound System", descAr: "نظام صوت احترافي مع سماعات وميكسر وميكروفون لاسلكي — إيجار يومي", descEn: "Professional sound system with speakers, mixer, and wireless mic — daily rental", category: "تقنية وشاشات", categoryEn: "Tech & AV", price: 1500, unit: "يوم", unitEn: "day", icon: Monitor, rating: 4.5, popular: false, features: [{ ar: "سماعات JBL", en: "JBL speakers" }, { ar: "ميكسر رقمي", en: "Digital mixer" }, { ar: "ميكروفون لاسلكي", en: "Wireless mic" }] },
];

export default function Operations() {
  const { t, lang, isRTL } = useLanguage();
  const { canBook, bookings } = useAuth();
  const isArabicLike = lang === "ar" || lang === "fa";

  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [cart, setCart] = useState<{ service: ServiceItem; qty: number; notes: string }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [orderNotes, setOrderNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");

  const getName = (s: ServiceItem) => isArabicLike ? s.nameAr : s.nameEn;
  const getDesc = (s: ServiceItem) => isArabicLike ? s.descAr : s.descEn;
  const getCat = (s: ServiceItem) => isArabicLike ? s.category : s.categoryEn;
  const getUnit = (s: ServiceItem) => isArabicLike ? s.unit : s.unitEn;
  const getCatLabel = (c: { ar: string; en: string }) => isArabicLike ? c.ar : c.en;
  const getFeature = (f: { ar: string; en: string }) => isArabicLike ? f.ar : f.en;

  const filtered = useMemo(() => {
    return SERVICES.filter(s => {
      const matchCat = activeCategory === "الكل" || s.category === activeCategory;
      const matchSearch = search === "" ||
        s.nameAr.includes(search) || s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        s.descAr.includes(search) || s.descEn.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const cartTotal = cart.reduce((a, c) => a + c.service.price * c.qty, 0);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const addToCart = (service: ServiceItem, qty: number, notes: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.service.id === service.id);
      if (existing) {
        return prev.map(c => c.service.id === service.id ? { ...c, qty: c.qty + qty, notes } : c);
      }
      return [...prev, { service, qty, notes }];
    });
    toast.success(isArabicLike ? `تمت إضافة ${service.nameAr} إلى السلة` : `${service.nameEn} added to cart`);
    setShowOrderForm(false);
    setSelectedService(null);
    setOrderQty(1);
    setOrderNotes("");
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(c => c.service.id !== serviceId));
  };

  const submitOrder = () => {
    if (cart.length === 0) return;
    const newOrders: ServiceOrder[] = cart.map((c, i) => ({
      id: `ORD-${Date.now()}-${i + 1}`,
      serviceId: c.service.id,
      serviceName: isArabicLike ? c.service.nameAr : c.service.nameEn,
      quantity: c.qty,
      total: c.service.price * c.qty,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      notes: c.notes,
    }));
    setOrders(prev => [...newOrders, ...prev]);
    setCart([]);
    setShowCart(false);
    setActiveTab("orders");
    toast.success(isArabicLike ? `تم إرسال ${newOrders.length} طلب بنجاح!` : `${newOrders.length} order(s) submitted successfully!`);
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: t("ops.statusPending"), color: "#FBBF24" },
    confirmed: { label: t("ops.statusApproved"), color: "#60A5FA" },
    in_progress: { label: t("ops.statusInProgress"), color: "#A78BFA" },
    completed: { label: t("ops.statusApproved"), color: "#4ADE80" },
  };

  // Setup timeline
  const timeline = [
    { date: t("ops.days30"), task: t("ops.task30"), done: true },
    { date: t("ops.days20"), task: t("ops.task20"), done: true },
    { date: t("ops.days14"), task: t("ops.task14"), done: false },
    { date: t("ops.days7"), task: t("ops.task7"), done: false },
    { date: t("ops.openingDay"), task: t("ops.taskOpening"), done: false },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold t-primary">{t("opsMarket.title")}</h2>
          <p className="text-[10px] t-gold/50 font-['Inter']">Operations Marketplace</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <button onClick={() => setShowCart(true)} className="relative glass-card p-2 rounded-lg t-secondary hover:t-gold transition-colors">
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--gold-accent)] text-[9px] text-black font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        <button onClick={() => setActiveTab("catalog")}
          className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${activeTab === "catalog" ? "btn-gold" : "glass-card t-secondary"}`}>
          {t("opsMarket.catalog")}
        </button>
        <button onClick={() => setActiveTab("orders")}
          className={`px-3 py-1.5 rounded-lg text-[11px] transition-all flex items-center gap-1 ${activeTab === "orders" ? "btn-gold" : "glass-card t-secondary"}`}>
          {t("opsMarket.myOrders")}
          {orders.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10">{orders.length}</span>}
        </button>
      </div>

      {activeTab === "catalog" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 t-muted ${isRTL ? 'right-3' : 'left-3'}`} />
            <input type="text" placeholder={t("opsMarket.searchServices")} value={search} onChange={(e) => setSearch(e.target.value)}
              className={`w-full glass-card rounded-xl py-2.5 text-xs t-primary placeholder:t-muted gold-focus ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`} style={{ backgroundColor: "var(--input-bg)" }} />
          </div>

          {/* Category Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SERVICE_CATEGORIES.map((cat) => (
              <button key={cat.ar} onClick={() => setActiveCategory(cat.ar)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] transition-all whitespace-nowrap shrink-0 ${activeCategory === cat.ar ? "btn-gold" : "glass-card t-secondary"}`}>
                <cat.icon size={11} />
                {getCatLabel(cat)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-xl p-2 text-center">
              <p className="text-lg font-bold t-gold font-['Inter']">{SERVICES.length}</p>
              <p className="text-[9px] t-tertiary">{t("opsMarket.totalServices")}</p>
            </div>
            <div className="glass-card rounded-xl p-2 text-center">
              <p className="text-lg font-bold text-[var(--status-green)] font-['Inter']">{SERVICES.filter(s => s.popular).length}</p>
              <p className="text-[9px] t-tertiary">{t("opsMarket.popular")}</p>
            </div>
            <div className="glass-card rounded-xl p-2 text-center">
              <p className="text-lg font-bold text-[var(--status-blue)] font-['Inter']">{SERVICE_CATEGORIES.length - 1}</p>
              <p className="text-[9px] t-tertiary">{t("opsMarket.categories")}</p>
            </div>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-3 sm:p-4 cursor-pointer hover:border-[var(--gold-border)] transition-all"
                style={{ border: "1px solid var(--glass-border)" }}
                onClick={() => { setSelectedService(s); setShowOrderForm(true); }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gold-subtle flex items-center justify-center shrink-0">
                    <s.icon size={16} className="t-gold" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.popular && (
                      <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-[var(--status-green)]/10 text-[var(--status-green)]">
                        {t("opsMarket.popular")}
                      </span>
                    )}
                    <div className="flex items-center gap-0.5">
                      <Star size={9} className="text-[var(--gold-accent)]" fill="var(--gold-accent)" />
                      <span className="text-[9px] t-muted font-['Inter']">{s.rating}</span>
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-bold t-primary mb-1">{getName(s)}</h4>
                <p className="text-[10px] t-tertiary line-clamp-2 mb-2">{getDesc(s)}</p>
                <div className="flex gap-1 flex-wrap mb-2">
                  {s.features.slice(0, 3).map((f, j) => (
                    <span key={j} className="px-1.5 py-0.5 rounded text-[8px] t-muted" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                      {getFeature(f)}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <div>
                    <span className="text-sm font-bold t-gold font-['Inter']">{s.price.toLocaleString()}</span>
                    <span className="text-[9px] t-muted"> {t("common.sar")} / {getUnit(s)}</span>
                  </div>
                  <button className="p-1.5 rounded-lg bg-gold-subtle t-gold" onClick={(e) => { e.stopPropagation(); addToCart(s, 1, ""); }}>
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 glass-card rounded-2xl">
              <Search size={40} className="mx-auto t-muted mb-3" style={{ opacity: 0.3 }} />
              <p className="text-sm t-tertiary">{t("expos.noResults")}</p>
            </div>
          )}

          {/* Setup Timeline */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
            <h3 className="text-sm sm:text-base font-bold t-primary mb-1">{t("ops.setupTimeline")}</h3>
            <p className="text-[9px] sm:text-[10px] t-gold/50 font-['Inter'] mb-4 sm:mb-6">Setup Timeline</p>
            <div className="relative">
              <div className={`absolute ${isRTL ? "right-3.5 sm:right-4" : "left-3.5 sm:left-4"} top-0 bottom-0 w-px bg-[var(--glass-bg-hover)]`} />
              <div className="space-y-4 sm:space-y-6">
                {timeline.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 relative">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                      item.done ? "bg-[#4ADE80]/15 border border-[#4ADE80]/30" : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    }`}>
                      {item.done ? <CheckCircle size={12} className="text-[#4ADE80]" /> : <Clock size={12} className="t-tertiary" />}
                    </div>
                    <div className="flex-1 pb-1">
                      <span className={`text-[11px] sm:text-xs font-medium ${item.done ? "text-[#4ADE80]" : "t-secondary"}`}>{item.date}</span>
                      <p className={`text-xs sm:text-sm ${item.done ? "t-secondary" : "t-tertiary"}`}>{item.task}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "orders" && (
        <>
          {orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Package size={36} className="mx-auto t-muted mb-3" />
              <p className="text-sm t-secondary mb-1">{t("opsMarket.noOrders")}</p>
              <p className="text-[10px] t-muted mb-3">{t("opsMarket.noOrdersDesc")}</p>
              <button onClick={() => setActiveTab("catalog")} className="btn-gold px-4 py-2 rounded-xl text-xs">
                {t("opsMarket.browseCatalog")}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o, i) => {
                const st = statusMap[o.status];
                return (
                  <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="glass-card rounded-xl p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold t-primary">{o.serviceName}</p>
                        <p className="text-[9px] t-muted font-['Inter']">{o.id} · {o.date}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px]" style={{ backgroundColor: `${st.color}12`, color: st.color, border: `1px solid ${st.color}25` }}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="t-tertiary">{t("opsMarket.qty")}: {o.quantity}</span>
                      <span className="t-gold font-['Inter'] font-medium">{o.total.toLocaleString()} {t("common.sar")}</span>
                    </div>
                    {o.notes && <p className="text-[9px] t-muted mt-1">{o.notes}</p>}
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && selectedService && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => { setShowOrderForm(false); setSelectedService(null); }} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[480px] lg:max-h-[80vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-subtle flex items-center justify-center">
                      <selectedService.icon size={18} className="t-gold" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold t-primary">{getName(selectedService)}</h3>
                      <p className="text-[10px] t-muted">{getCat(selectedService)}</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowOrderForm(false); setSelectedService(null); }} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={14} />
                  </button>
                </div>

                <p className="text-[11px] t-tertiary leading-relaxed">{getDesc(selectedService)}</p>

                <div className="flex gap-1.5 flex-wrap">
                  {selectedService.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg text-[10px] t-secondary" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                      {getFeature(f)}
                    </span>
                  ))}
                </div>

                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-[10px] t-muted mb-1">{t("opsMarket.pricePerUnit")}</p>
                  <p className="text-xl font-bold t-gold font-['Inter']">{selectedService.price.toLocaleString()} <span className="text-xs t-muted">{t("common.sar")} / {getUnit(selectedService)}</span></p>
                </div>

                <div>
                  <label className="text-[10px] t-muted mb-1 block">{t("opsMarket.qty")}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setOrderQty(Math.max(1, orderQty - 1))} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center t-secondary text-lg">-</button>
                    <span className="text-lg font-bold t-primary font-['Inter'] w-8 text-center">{orderQty}</span>
                    <button onClick={() => setOrderQty(orderQty + 1)} className="glass-card w-8 h-8 rounded-lg flex items-center justify-center t-secondary text-lg">+</button>
                    <div className={`flex-1 ${isRTL ? "text-left" : "text-right"}`}>
                      <p className="text-[9px] t-muted">{t("opsMarket.subtotal")}</p>
                      <p className="text-sm font-bold t-gold font-['Inter']">{(selectedService.price * orderQty).toLocaleString()} {t("common.sar")}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] t-muted mb-1 block">{t("opsMarket.notes")}</label>
                  <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full glass-card rounded-xl p-2.5 text-xs t-primary placeholder:t-muted gold-focus resize-none h-16"
                    style={{ backgroundColor: "var(--input-bg)" }}
                    placeholder={isArabicLike ? "ملاحظات إضافية (اختياري)..." : "Additional notes (optional)..."} />
                </div>

                <button onClick={() => addToCart(selectedService, orderQty, orderNotes)}
                  className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  <ShoppingCart size={14} />
                  {t("opsMarket.addToCart")} — {(selectedService.price * orderQty).toLocaleString()} {t("common.sar")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setShowCart(false)} />
            <motion.div
              initial={{ opacity: 0, x: isRTL ? "-100%" : "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 bottom-0 w-[340px] sm:w-[400px] z-50 overflow-y-auto"
              style={{ background: "var(--modal-bg)", borderLeft: isRTL ? "none" : "1px solid var(--glass-border)", borderRight: isRTL ? "1px solid var(--glass-border)" : "none", [isRTL ? "left" : "right"]: 0 }}
              dir={isRTL ? "rtl" : "ltr"}>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold t-primary flex items-center gap-2">
                    <ShoppingCart size={16} className="t-gold" />
                    {t("opsMarket.cart")} ({cartCount})
                  </h3>
                  <button onClick={() => setShowCart(false)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={14} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={32} className="mx-auto t-muted mb-2" />
                    <p className="text-xs t-tertiary">{t("opsMarket.emptyCart")}</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {cart.map((c) => (
                        <div key={c.service.id} className="p-3 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-xs font-medium t-primary">{getName(c.service)}</p>
                            <button onClick={() => removeFromCart(c.service.id)} className="p-1 rounded text-red-400/60 hover:text-red-400">
                              <X size={12} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="t-muted">{c.qty} × {c.service.price.toLocaleString()} {t("common.sar")}</span>
                            <span className="t-gold font-['Inter'] font-medium">{(c.service.price * c.qty).toLocaleString()} {t("common.sar")}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="t-secondary font-bold">{t("opsMarket.total")}</span>
                        <span className="t-gold font-bold font-['Inter']">{cartTotal.toLocaleString()} {t("common.sar")}</span>
                      </div>
                      <button onClick={submitOrder} className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                        <CheckCircle size={14} />
                        {t("opsMarket.submitOrder")}
                      </button>
                      <p className="text-[9px] t-muted text-center mt-2">{t("opsMarket.contactInfo")}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
