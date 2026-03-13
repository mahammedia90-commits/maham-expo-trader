/**
 * ExpoDetail — Exhibition Detail Page with Interactive Booth Map
 * Design: Obsidian Glass with interactive SVG booth map, countdown timer, booking flow
 * Features: Booth selection, temporary hold (30min), pricing, AI suggestions
 */
import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, MapPin, Calendar, Users, Star, Clock, Shield,
  CheckCircle2, AlertTriangle, Lock, Sparkles, ChevronDown,
  ChevronUp, Building2, Ruler, Zap, Eye, Phone, Mail,
  FileText, CreditCard, Timer, XCircle, Info
} from "lucide-react";
import { toast } from "sonner";

type BoothStatus = "available" | "reserved" | "sold" | "my-hold";
type BoothType = "standard" | "premium" | "corner" | "island" | "kiosk";

interface Booth {
  id: string;
  code: string;
  type: BoothType;
  typeAr: string;
  size: string;
  sizeM2: number;
  price: number;
  status: BoothStatus;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: string;
  zoneAr: string;
  features: string[];
}

const boothColors: Record<BoothStatus, string> = {
  available: "rgba(74, 222, 128, 0.4)",
  reserved: "rgba(251, 191, 36, 0.3)",
  sold: "rgba(239, 68, 68, 0.2)",
  "my-hold": "rgba(197, 165, 90, 0.5)",
};

const boothBorders: Record<BoothStatus, string> = {
  available: "rgba(74, 222, 128, 0.6)",
  reserved: "rgba(251, 191, 36, 0.5)",
  sold: "rgba(239, 68, 68, 0.3)",
  "my-hold": "rgba(197, 165, 90, 0.8)",
};

// Generate booth grid
const generateBooths = (): Booth[] => {
  const booths: Booth[] = [];
  const zones = [
    { name: "A", nameAr: "المنطقة أ — الرئيسية", startX: 40, startY: 60 },
    { name: "B", nameAr: "المنطقة ب — التقنية", startX: 40, startY: 260 },
    { name: "C", nameAr: "المنطقة ج — الخدمات", startX: 440, startY: 60 },
    { name: "D", nameAr: "المنطقة د — VIP", startX: 440, startY: 260 },
  ];

  const types: { type: BoothType; typeAr: string; w: number; h: number; price: number; size: string; sizeM2: number }[] = [
    { type: "standard", typeAr: "قياسي", w: 55, h: 45, price: 8000, size: "3×3", sizeM2: 9 },
    { type: "premium", typeAr: "مميز", w: 70, h: 45, price: 15000, size: "4×3", sizeM2: 12 },
    { type: "corner", typeAr: "زاوية", w: 70, h: 55, price: 20000, size: "4×4", sizeM2: 16 },
    { type: "island", typeAr: "جزيرة", w: 85, h: 65, price: 45000, size: "6×4", sizeM2: 24 },
  ];

  const statuses: BoothStatus[] = ["available", "available", "available", "reserved", "sold", "available"];

  zones.forEach((zone) => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const idx = row * 5 + col;
        const t = types[idx % types.length];
        const s = statuses[(idx + zone.name.charCodeAt(0)) % statuses.length];
        booths.push({
          id: `${zone.name}-${row + 1}${col + 1}`,
          code: `${zone.name}${(row + 1) * 10 + col + 1}`,
          type: t.type,
          typeAr: t.typeAr,
          size: t.size,
          sizeM2: t.sizeM2,
          price: t.price,
          status: s,
          x: zone.startX + col * 75,
          y: zone.startY + row * 60,
          w: t.w,
          h: t.h,
          zone: zone.name,
          zoneAr: zone.nameAr,
          features: t.type === "island"
            ? ["كهرباء 3 فاز", "إنترنت فائق", "تكييف مركزي", "شاشة LED"]
            : t.type === "corner"
            ? ["كهرباء", "إنترنت", "واجهتين"]
            : t.type === "premium"
            ? ["كهرباء", "إنترنت", "موقع مميز"]
            : ["كهرباء", "إنترنت"],
        });
      }
    }
  });
  return booths;
};

export default function ExpoDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [booths, setBooths] = useState<Booth[]>(generateBooths);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [holdBooth, setHoldBooth] = useState<Booth | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showDetails, setShowDetails] = useState(true);
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "payment">("select");

  // Countdown timer for held booth
  useEffect(() => {
    if (!holdBooth || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setHoldBooth(null);
          setBookingStep("select");
          toast.error("انتهى وقت الحجز المؤقت! | Temporary hold expired!");
          setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "available" } : b));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [holdBooth, countdown]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleBoothClick = (booth: Booth) => {
    if (booth.status === "sold" || booth.status === "reserved") {
      toast.error(booth.status === "sold" ? "هذه الوحدة مباعة | This unit is sold" : "هذه الوحدة محجوزة | This unit is reserved");
      return;
    }
    setSelectedBooth(booth);
    setBookingStep("select");
  };

  const handleHoldBooth = () => {
    if (!selectedBooth) return;
    setBooths(prev => prev.map(b => b.id === selectedBooth.id ? { ...b, status: "my-hold" } : b));
    setHoldBooth(selectedBooth);
    setCountdown(30 * 60); // 30 minutes
    setBookingStep("confirm");
    toast.success("تم تثبيت الوحدة لمدة 30 دقيقة | Unit held for 30 minutes");
  };

  const handleProceedToPayment = () => {
    setBookingStep("payment");
  };

  const handleConfirmPayment = () => {
    if (!holdBooth) return;
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "sold" } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");
    toast.success("تم الحجز بنجاح! سيتم إنشاء العقد الإلكتروني | Booking confirmed! E-contract will be generated");
    setTimeout(() => navigate("/contracts"), 2000);
  };

  const handleCancelHold = () => {
    if (!holdBooth) return;
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "available" } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");
    toast.info("تم إلغاء الحجز المؤقت | Temporary hold cancelled");
  };

  const filteredBooths = useMemo(() => {
    return booths.filter(b => {
      const matchZone = zoneFilter === "all" || b.zone === zoneFilter;
      const matchType = typeFilter === "all" || b.type === typeFilter;
      return matchZone && matchType;
    });
  }, [booths, zoneFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: booths.length,
    available: booths.filter(b => b.status === "available").length,
    reserved: booths.filter(b => b.status === "reserved" || b.status === "my-hold").length,
    sold: booths.filter(b => b.status === "sold").length,
  }), [booths]);

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/expos">
          <button className="glass-card p-2 rounded-lg t-secondary hover:text-[#C5A55A] transition-colors">
            <ArrowRight size={18} />
          </button>
        </Link>
        <div>
          <h2 className="text-lg font-bold t-primary">معرض الرياض الدولي للتقنية والابتكار</h2>
          <p className="text-[10px] text-[#C5A55A]/50 font-['Inter']">Riyadh International Tech & Innovation Expo</p>
        </div>
      </div>

      {/* Countdown Banner */}
      <AnimatePresence>
        {holdBooth && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-2xl p-4 border-[rgba(197,165,90,0.3)] bg-[rgba(197,165,90,0.05)]"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A55A]/15 flex items-center justify-center">
                  <Timer size={18} className="text-[#C5A55A]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#E8D5A3]">
                    الوحدة {holdBooth.code} محجوزة مؤقتاً
                  </p>
                  <p className="text-[10px] t-tertiary font-['Inter']">
                    Unit {holdBooth.code} temporarily held — Complete payment before timer expires
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-2xl font-bold font-['Inter'] tabular-nums ${countdown < 300 ? "text-red-400 animate-pulse" : "text-[#C5A55A]"}`}>
                  {formatTime(countdown)}
                </div>
                <button
                  onClick={handleCancelHold}
                  className="glass-card px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expo Info Bar */}
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#C5A55A]/60" />
            <div>
              <p className="text-xs t-secondary">الرياض</p>
              <p className="text-[9px] t-tertiary font-['Inter']">Riyadh</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A55A]/60" />
            <div>
              <p className="text-xs t-secondary font-['Inter']">15-19 Apr 2025</p>
              <p className="text-[9px] t-tertiary">5 أيام</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[#C5A55A]/60" />
            <div>
              <p className="text-xs t-secondary">45,000+ زائر</p>
              <p className="text-[9px] t-tertiary font-['Inter']">Expected visitors</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-[#FBBF24]" />
            <div>
              <p className="text-xs t-secondary font-['Inter']">4.8/5</p>
              <p className="text-[9px] t-tertiary">التقييم</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-400/60" />
            <div>
              <p className="text-xs text-green-400/70">معتمد رسمياً</p>
              <p className="text-[9px] t-tertiary font-['Inter']">Officially Licensed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الوحدات", labelEn: "Total Units", value: stats.total, color: "t-secondary" },
          { label: "متاحة", labelEn: "Available", value: stats.available, color: "text-green-400" },
          { label: "محجوزة", labelEn: "Reserved", value: stats.reserved, color: "text-yellow-400" },
          { label: "مباعة", labelEn: "Sold", value: stats.sold, color: "text-red-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className={`text-xl font-bold font-['Inter'] ${s.color}`}>{s.value}</p>
            <p className="text-[10px] t-tertiary mt-0.5">{s.label}</p>
            <p className="text-[8px] t-muted font-['Inter']">{s.labelEn}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus"
        >
          <option value="all" className="bg-[#0A0A12]">كل المناطق | All Zones</option>
          <option value="A" className="bg-[#0A0A12]">المنطقة أ — الرئيسية</option>
          <option value="B" className="bg-[#0A0A12]">المنطقة ب — التقنية</option>
          <option value="C" className="bg-[#0A0A12]">المنطقة ج — الخدمات</option>
          <option value="D" className="bg-[#0A0A12]">المنطقة د — VIP</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus"
        >
          <option value="all" className="bg-[#0A0A12]">كل الأنواع | All Types</option>
          <option value="standard" className="bg-[#0A0A12]">قياسي — Standard</option>
          <option value="premium" className="bg-[#0A0A12]">مميز — Premium</option>
          <option value="corner" className="bg-[#0A0A12]">زاوية — Corner</option>
          <option value="island" className="bg-[#0A0A12]">جزيرة — Island</option>
        </select>
        {/* Legend */}
        <div className="flex items-center gap-4 mr-auto">
          {[
            { status: "available", label: "متاح" },
            { status: "reserved", label: "محجوز" },
            { status: "sold", label: "مباع" },
            { status: "my-hold", label: "حجزك" },
          ].map((l) => (
            <div key={l.status} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: boothColors[l.status as BoothStatus], border: `1px solid ${boothBorders[l.status as BoothStatus]}` }} />
              <span className="text-[10px] t-tertiary">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Booth Map + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Map */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 overflow-auto">
          <svg viewBox="0 0 850 460" className="w-full h-auto" style={{ minHeight: 350 }}>
            {/* Background */}
            <rect x="0" y="0" width="850" height="460" fill="rgba(10,10,18,0.5)" rx="12" />
            
            {/* Zone Labels */}
            <text x="200" y="45" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">Zone A — المنطقة أ</text>
            <text x="200" y="245" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">Zone B — المنطقة ب</text>
            <text x="600" y="45" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">Zone C — المنطقة ج</text>
            <text x="600" y="245" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">Zone D — المنطقة د</text>

            {/* Entrance */}
            <rect x="370" y="420" width="110" height="30" fill="rgba(197,165,90,0.1)" stroke="rgba(197,165,90,0.3)" strokeWidth="1" rx="6" />
            <text x="425" y="440" fill="rgba(197,165,90,0.6)" fontSize="10" textAnchor="middle" fontFamily="Inter">ENTRANCE | المدخل</text>

            {/* Booths */}
            {filteredBooths.map((booth) => (
              <g
                key={booth.id}
                onClick={() => handleBoothClick(booth)}
                className={`cursor-pointer transition-all ${booth.status === "sold" ? "opacity-40" : "hover:opacity-90"}`}
              >
                <rect
                  x={booth.x}
                  y={booth.y}
                  width={booth.w}
                  height={booth.h}
                  fill={boothColors[booth.status]}
                  stroke={selectedBooth?.id === booth.id ? "#C5A55A" : boothBorders[booth.status]}
                  strokeWidth={selectedBooth?.id === booth.id ? 2 : 1}
                  rx="4"
                />
                <text
                  x={booth.x + booth.w / 2}
                  y={booth.y + booth.h / 2 - 4}
                  fill="rgba(255,255,255,0.7)"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="600"
                >
                  {booth.code}
                </text>
                <text
                  x={booth.x + booth.w / 2}
                  y={booth.y + booth.h / 2 + 8}
                  fill="rgba(255,255,255,0.3)"
                  fontSize="7"
                  textAnchor="middle"
                  fontFamily="Inter"
                >
                  {booth.size}m
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {/* Selected Booth Info */}
          {selectedBooth ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-5 border-[rgba(197,165,90,0.15)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#E8D5A3]">الوحدة {selectedBooth.code}</h3>
                  <p className="text-[10px] t-tertiary font-['Inter']">Unit {selectedBooth.code} — {selectedBooth.zoneAr}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] ${
                  selectedBooth.status === "available" ? "bg-green-400/15 text-green-400" :
                  selectedBooth.status === "my-hold" ? "bg-[#C5A55A]/15 text-[#C5A55A]" :
                  "bg-yellow-400/15 text-yellow-400"
                }`}>
                  {selectedBooth.status === "available" ? "متاح" : selectedBooth.status === "my-hold" ? "حجزك" : "محجوز"}
                </span>
              </div>

              {/* Booth Details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Building2 size={12} /> النوع</span>
                  <span className="text-xs t-secondary">{selectedBooth.typeAr}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Ruler size={12} /> المساحة</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.sizeM2} م² ({selectedBooth.size})</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><MapPin size={12} /> المنطقة</span>
                  <span className="text-xs t-secondary">{selectedBooth.zoneAr}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Zap size={12} /> المميزات</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {selectedBooth.features.map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-[9px] t-secondary">{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="glass-card rounded-xl p-4 mb-4 text-center">
                <p className="text-[10px] t-tertiary mb-1">السعر الإجمالي | Total Price</p>
                <p className="text-2xl font-bold text-[#C5A55A] font-['Inter']">
                  {selectedBooth.price.toLocaleString()} <span className="text-sm t-tertiary">ر.س</span>
                </p>
                <p className="text-[10px] t-muted mt-1">شامل ضريبة القيمة المضافة 15%</p>
              </div>

              {/* Booking Actions */}
              {bookingStep === "select" && selectedBooth.status === "available" && (
                <div className="space-y-3">
                  <button
                    onClick={handleHoldBooth}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <Lock size={14} />
                    تثبيت الوحدة (30 دقيقة)
                  </button>
                  <p className="text-[9px] t-muted text-center flex items-center justify-center gap-1">
                    <Info size={10} /> سيتم تثبيت الوحدة مؤقتاً لمدة 30 دقيقة لإتمام الدفع
                  </p>
                </div>
              )}

              {bookingStep === "confirm" && (
                <div className="space-y-3">
                  <div className="glass-card rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={14} className="text-green-400/70" />
                      <p className="text-xs text-green-400/70">الإقرار القانوني</p>
                    </div>
                    <p className="text-[10px] t-tertiary leading-relaxed">
                      أقر بأنني أوافق على شروط وأحكام منصة مهام إكسبو، وأن أي محاولة للتواصل المباشر مع المستثمر خارج المنصة ستعرضني لغرامة مالية قدرها 50,000 ريال سعودي.
                    </p>
                    <p className="text-[9px] t-muted font-['Inter'] mt-1">
                      I acknowledge that any attempt to bypass the platform will result in a 50,000 ر.س penalty.
                    </p>
                  </div>
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <CreditCard size={14} />
                    الموافقة والمتابعة للدفع
                  </button>
                  <button
                    onClick={handleCancelHold}
                    className="w-full glass-card py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    إلغاء الحجز المؤقت
                  </button>
                </div>
              )}

              {bookingStep === "payment" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-4">
                    <h4 className="text-xs font-bold t-secondary mb-3">ملخص الدفع | Payment Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="t-tertiary">سعر الوحدة</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.87).toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="t-tertiary">ضريبة القيمة المضافة (15%)</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.13).toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-[var(--glass-border)]">
                        <span className="t-secondary font-bold">العربون (5%)</span>
                        <span className="text-[#C5A55A] font-bold font-['Inter']">{(selectedBooth.price * 0.05).toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <p className="text-[10px] t-tertiary">طريقة الدفع | Payment Method</p>
                    {["بطاقة ائتمان | Credit Card", "مدى | Mada", "Apple Pay", "تحويل بنكي | Bank Transfer"].map((m, i) => (
                      <label key={i} className="flex items-center gap-3 glass-card rounded-xl p-3 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors">
                        <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[#C5A55A]" />
                        <span className="text-xs t-secondary">{m}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    تأكيد الدفع — {(selectedBooth.price * 0.05).toLocaleString()} ر.س
                  </button>
                  <p className="text-[9px] t-muted text-center">
                    العربون غير مسترد | Deposit is non-refundable
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Eye size={32} className="mx-auto t-muted mb-3" />
              <p className="text-sm t-tertiary">اختر وحدة من الخريطة</p>
              <p className="text-[10px] t-muted font-['Inter']">Select a unit from the map</p>
            </div>
          )}

          {/* AI Suggestion */}
          <div className="glass-card rounded-2xl p-4 border-purple-400/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-purple-400" />
              <h4 className="text-xs font-bold text-purple-300">اقتراح الذكاء الاصطناعي</h4>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">
              بناءً على نشاطك التجاري في قطاع التقنية، ننصحك بالوحدات في المنطقة ب (التقنية) — خاصة الوحدات الزاوية B21 و B31 لأنها تحقق أعلى نسبة مرور زوار (34% أكثر من الوحدات القياسية).
            </p>
            <p className="text-[9px] t-muted font-['Inter'] mt-2">
              AI suggests Zone B corner units for 34% higher foot traffic based on your tech sector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
