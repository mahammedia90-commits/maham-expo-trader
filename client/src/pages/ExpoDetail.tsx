/**
 * ExpoDetail — Exhibition Detail Page with Interactive Booth Map
 * Design: Obsidian Glass with interactive SVG booth map, countdown timer, booking flow
 * Features: Booth selection, temporary hold (30min), pricing, AI suggestions
 * Fully localized via useLanguage()
 */
import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, MapPin, Calendar, Users, Star, Clock, Shield,
  CheckCircle2, Lock, Sparkles, Building2, Ruler, Zap, Eye,
  CreditCard, Timer, Info
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { events2026 } from "@/data/events2026";

type BoothStatus = "available" | "reserved" | "sold" | "my-hold";
type BoothType = "standard" | "premium" | "corner" | "island" | "kiosk";

interface Booth {
  id: string;
  code: string;
  type: BoothType;
  size: string;
  sizeM2: number;
  price: number;
  status: BoothStatus;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: string;
  featureKeys: string[];
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

const generateBooths = (): Booth[] => {
  const booths: Booth[] = [];
  const zones = [
    { name: "A", startX: 40, startY: 60 },
    { name: "B", startX: 40, startY: 260 },
    { name: "C", startX: 440, startY: 60 },
    { name: "D", startX: 440, startY: 260 },
  ];

  const types: { type: BoothType; w: number; h: number; price: number; size: string; sizeM2: number; featureKeys: string[] }[] = [
    { type: "standard", w: 55, h: 45, price: 8000, size: "3×3", sizeM2: 9, featureKeys: ["expoDetail.electricity", "expoDetail.internet"] },
    { type: "premium", w: 70, h: 45, price: 15000, size: "4×3", sizeM2: 12, featureKeys: ["expoDetail.electricity", "expoDetail.internet", "expoDetail.premiumLocation"] },
    { type: "corner", w: 70, h: 55, price: 20000, size: "4×4", sizeM2: 16, featureKeys: ["expoDetail.electricity", "expoDetail.internet", "expoDetail.twoFacades"] },
    { type: "island", w: 85, h: 65, price: 45000, size: "6×4", sizeM2: 24, featureKeys: ["expoDetail.electricity3Phase", "expoDetail.highSpeedInternet", "expoDetail.centralAC", "expoDetail.ledScreen"] },
  ];

  const statuses: BoothStatus[] = ["available", "available", "available", "reserved", "sold", "available"];

  zones.forEach((zone) => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const idx = row * 5 + col;
        const tp = types[idx % types.length];
        const s = statuses[(idx + zone.name.charCodeAt(0)) % statuses.length];
        booths.push({
          id: `${zone.name}-${row + 1}${col + 1}`,
          code: `${zone.name}${(row + 1) * 10 + col + 1}`,
          type: tp.type,
          size: tp.size,
          sizeM2: tp.sizeM2,
          price: tp.price,
          status: s,
          x: zone.startX + col * 75,
          y: zone.startY + row * 60,
          w: tp.w,
          h: tp.h,
          zone: zone.name,
          featureKeys: tp.featureKeys,
        });
      }
    }
  });
  return booths;
};

export default function ExpoDetail() {
  const { t, lang, isRTL } = useLanguage();
  const isArabicLike = ["ar", "fa"].includes(lang);
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addBooking, addPayment, addNotification, addPendingBooking, canBook } = useAuth();

  // Find the expo from events data
  const expo = events2026.find(e => e.id === params.id) || events2026[0];
  const [booths, setBooths] = useState<Booth[]>(generateBooths);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [holdBooth, setHoldBooth] = useState<Booth | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "payment">("select");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const boothTypeLabel = (type: BoothType): string => {
    const map: Record<BoothType, string> = {
      standard: t("expoDetail.standard"),
      premium: t("expoDetail.premium"),
      corner: t("expoDetail.corner"),
      island: t("expoDetail.island"),
      kiosk: t("expoDetail.standard"),
    };
    return map[type];
  };

  const zoneLabel = (zone: string): string => {
    const map: Record<string, string> = {
      A: t("expoDetail.mainZone"),
      B: t("expoDetail.techZone"),
      C: t("expoDetail.servicesZone"),
      D: t("expoDetail.vipZone"),
    };
    return map[zone] || zone;
  };

  const statusLabel = (status: BoothStatus): string => {
    const map: Record<BoothStatus, string> = {
      available: t("expoDetail.available"),
      reserved: t("expoDetail.reserved"),
      sold: t("expoDetail.sold"),
      "my-hold": t("expoDetail.myHold"),
    };
    return map[status];
  };

  useEffect(() => {
    if (!holdBooth || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setHoldBooth(null);
          setBookingStep("select");
          toast.error(t("expoDetail.holdExpired"));
          setBooths(prev2 => prev2.map(b => b.id === holdBooth.id ? { ...b, status: "available" as BoothStatus } : b));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [holdBooth, countdown, t]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleBoothClick = (booth: Booth) => {
    if (booth.status === "sold") {
      toast.error(t("expoDetail.unitSold"));
      return;
    }
    if (booth.status === "reserved") {
      toast.error(t("expoDetail.unitReserved"));
      return;
    }
    setSelectedBooth(booth);
    setBookingStep("select");
  };

  const handleHoldBooth = () => {
    if (!selectedBooth) return;
    setBooths(prev => prev.map(b => b.id === selectedBooth.id ? { ...b, status: "my-hold" as BoothStatus } : b));
    setHoldBooth(selectedBooth);
    setCountdown(30 * 60);
    setBookingStep("confirm");
    toast.success(t("expoDetail.unitHeld"));
  };

  const handleProceedToPayment = () => {
    setBookingStep("payment");
  };

  const handleConfirmPayment = () => {
    if (!holdBooth || !selectedBooth) return;

    // Check if user can book (KYC verified)
    if (!canBook) {
      toast.error(t("expoDetail.verifyAccountFirst"));
      setTimeout(() => navigate("/kyc"), 1500);
      return;
    }

    // 1. Create booking via AuthContext
    const newBooking = addBooking({
      expoId: expo.id,
      expoNameAr: expo.nameAr,
      expoNameEn: expo.nameEn,
      unitAr: `${t("expoDetail.booth")} ${holdBooth.code} — ${zoneLabel(holdBooth.zone)}`,
      unitEn: `Booth ${holdBooth.code} — Zone ${holdBooth.zone}`,
      zone: holdBooth.zone,
      boothType: holdBooth.type,
      boothSize: holdBooth.size,
      price: holdBooth.price,
      deposit: holdBooth.price * 0.05,
      services: holdBooth.featureKeys.map(fk => t(fk)),
      location: expo.location,
    });

    // 2. Create payment record
    const depositAmount = holdBooth.price * 0.05;
    const newPayment = addPayment({
      bookingId: newBooking.id,
      amount: depositAmount,
      method: "Credit Card",
      type: "deposit",
      descAr: t("expoDetail.depositDesc").replace("{code}", holdBooth.code).replace("{expo}", expo.nameAr),
      descEn: `Deposit for Booth ${holdBooth.code} — ${expo.nameEn}`,
    });

    // 3. Add pending booking count
    addPendingBooking();

    // 4. Add notification
    addNotification({
      type: "booking",
      titleAr: t("expoDetail.newBookingNotif").replace("{code}", holdBooth.code),
      titleEn: `New Booking — Booth ${holdBooth.code}`,
      message: t("expoDetail.bookingCreatedNotif")
        .replace("{code}", holdBooth.code)
        .replace("{expo}", isRTL ? expo.nameAr : expo.nameEn)
        .replace("{id}", newBooking.id),
      link: "/bookings",
    });

    // 5. Update local booth state
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "sold" as BoothStatus } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");

    toast.success(t("expoDetail.bookingCreatedToast").replace("{id}", newBooking.id));
    setTimeout(() => navigate("/bookings"), 2000);
  };

  const handleCancelHold = () => {
    if (!holdBooth) return;
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "available" as BoothStatus } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");
    toast.info(t("expoDetail.holdCancelled"));
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

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/expos">
          <button className="glass-card p-2 rounded-lg t-secondary hover:text-[#C5A55A] transition-colors">
            <BackArrow size={18} />
          </button>
        </Link>
        <div>
          <h2 className="text-lg font-bold t-primary">{t("expoDetail.floorPlan")}</h2>
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
                    {t("expoDetail.temporaryHold")} — {holdBooth.code}
                  </p>
                  <p className="text-[10px] t-tertiary">
                    {t("expoDetail.completePayment")}
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
                  {t("expoDetail.cancel")}
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
            <p className="text-xs t-secondary">{t("expoDetail.city")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A55A]/60" />
            <p className="text-xs t-secondary font-['Inter']">15-19 Apr 2025</p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[#C5A55A]/60" />
            <p className="text-xs t-secondary">45,000+ {t("expoDetail.expectedVisitors")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-[#FBBF24]" />
            <p className="text-xs t-secondary font-['Inter']">4.8/5 {t("expoDetail.rating")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-400/60" />
            <p className="text-xs text-green-400/70">{t("expoDetail.officiallyLicensed")}</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("expoDetail.totalUnits"), value: stats.total, color: "t-secondary" },
          { label: t("expoDetail.available"), value: stats.available, color: "text-green-400" },
          { label: t("expoDetail.reserved"), value: stats.reserved, color: "text-yellow-400" },
          { label: t("expoDetail.sold"), value: stats.sold, color: "text-red-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className={`text-xl font-bold font-['Inter'] ${s.color}`}>{s.value}</p>
            <p className="text-[10px] t-tertiary mt-0.5">{s.label}</p>
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
          <option value="all" className="bg-[#0A0A12]">{t("expoDetail.filterAllZones")}</option>
          <option value="A" className="bg-[#0A0A12]">{t("expoDetail.mainZone")}</option>
          <option value="B" className="bg-[#0A0A12]">{t("expoDetail.techZone")}</option>
          <option value="C" className="bg-[#0A0A12]">{t("expoDetail.servicesZone")}</option>
          <option value="D" className="bg-[#0A0A12]">{t("expoDetail.vipZone")}</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus"
        >
          <option value="all" className="bg-[#0A0A12]">{t("expoDetail.filterAllTypes")}</option>
          <option value="standard" className="bg-[#0A0A12]">{t("expoDetail.standard")}</option>
          <option value="premium" className="bg-[#0A0A12]">{t("expoDetail.premium")}</option>
          <option value="corner" className="bg-[#0A0A12]">{t("expoDetail.corner")}</option>
          <option value="island" className="bg-[#0A0A12]">{t("expoDetail.island")}</option>
        </select>
        {/* Legend */}
        <div className={`flex items-center gap-4 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
          {(["available", "reserved", "sold", "my-hold"] as BoothStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: boothColors[s], border: `1px solid ${boothBorders[s]}` }} />
              <span className="text-[10px] t-tertiary">{statusLabel(s)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Booth Map + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Map */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 overflow-auto">
          <svg viewBox="0 0 850 460" className="w-full h-auto" style={{ minHeight: 350 }}>
            <rect x="0" y="0" width="850" height="460" fill="rgba(10,10,18,0.5)" rx="12" />
            
            {/* Zone Labels */}
            <text x="200" y="45" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">{t("expoDetail.mainZone")}</text>
            <text x="200" y="245" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">{t("expoDetail.techZone")}</text>
            <text x="600" y="45" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">{t("expoDetail.servicesZone")}</text>
            <text x="600" y="245" fill="rgba(197,165,90,0.4)" fontSize="11" textAnchor="middle" fontFamily="Inter">{t("expoDetail.vipZone")}</text>

            {/* Entrance */}
            <rect x="370" y="420" width="110" height="30" fill="rgba(197,165,90,0.1)" stroke="rgba(197,165,90,0.3)" strokeWidth="1" rx="6" />
            <text x="425" y="440" fill="rgba(197,165,90,0.6)" fontSize="10" textAnchor="middle" fontFamily="Inter">{t("expoDetail.entrance")}</text>

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
          {selectedBooth ? (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-5 border-[rgba(197,165,90,0.15)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#E8D5A3]">{selectedBooth.code}</h3>
                  <p className="text-[10px] t-tertiary">{zoneLabel(selectedBooth.zone)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] ${
                  selectedBooth.status === "available" ? "bg-green-400/15 text-green-400" :
                  selectedBooth.status === "my-hold" ? "bg-[#C5A55A]/15 text-[#C5A55A]" :
                  "bg-yellow-400/15 text-yellow-400"
                }`}>
                  {statusLabel(selectedBooth.status)}
                </span>
              </div>

              {/* Booth Details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Building2 size={12} /> {t("expoDetail.type")}</span>
                  <span className="text-xs t-secondary">{boothTypeLabel(selectedBooth.type)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Ruler size={12} /> {t("expoDetail.area")}</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.sizeM2} m² ({selectedBooth.size})</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><MapPin size={12} /> {t("expoDetail.zone")}</span>
                  <span className="text-xs t-secondary">{zoneLabel(selectedBooth.zone)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Zap size={12} /> {t("expoDetail.features")}</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {selectedBooth.featureKeys.map((fk, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-[9px] t-secondary">{t(fk)}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="glass-card rounded-xl p-4 mb-4 text-center">
                <p className="text-[10px] t-tertiary mb-1">{t("expoDetail.totalPrice")}</p>
                <p className="text-2xl font-bold text-[#C5A55A] font-['Inter']">
                  {selectedBooth.price.toLocaleString()} <span className="text-sm t-tertiary">{t("common.sar")}</span>
                </p>
                <p className="text-[10px] t-muted mt-1">{t("expoDetail.vatIncluded")}</p>
              </div>

              {/* Booking Actions */}
              {bookingStep === "select" && selectedBooth.status === "available" && (
                <div className="space-y-3">
                  <button
                    onClick={handleHoldBooth}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <Lock size={14} />
                    {t("expoDetail.holdUnitMinutes")}
                  </button>
                  <p className="text-[9px] t-muted text-center flex items-center justify-center gap-1">
                    <Info size={10} /> {t("expoDetail.holdUnitNote")}
                  </p>
                </div>
              )}

              {bookingStep === "confirm" && (
                <div className="space-y-3">
                  <div className="glass-card rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={14} className="text-green-400/70" />
                      <p className="text-xs text-green-400/70">{t("expoDetail.legalAcknowledgment")}</p>
                    </div>
                    <p className="text-[10px] t-tertiary leading-relaxed">
                      {t("expoDetail.legalText")}
                    </p>
                    <label className="flex items-start gap-2 mt-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 accent-[var(--gold-accent)] w-4 h-4 rounded shrink-0"
                      />
                      <span className="text-[11px] t-secondary leading-relaxed">
                        {t("expoDetail.acceptTerms")}
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!termsAccepted}
                    className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                      termsAccepted ? "btn-gold" : "opacity-40 cursor-not-allowed bg-gray-600"
                    }`}
                  >
                    <CreditCard size={14} />
                    {t("expoDetail.proceedToPayment")}
                  </button>
                  <button
                    onClick={handleCancelHold}
                    className="w-full glass-card py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    {t("expoDetail.cancelHold")}
                  </button>
                </div>
              )}

              {bookingStep === "payment" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-4">
                    <h4 className="text-xs font-bold t-secondary mb-3">{t("expoDetail.paymentSummary")}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="t-tertiary">{t("expoDetail.unitPrice")}</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.87).toLocaleString()} {t("common.sar")}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="t-tertiary">{t("expoDetail.vat15")}</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.13).toLocaleString()} {t("common.sar")}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-[var(--glass-border)]">
                        <span className="t-secondary font-bold">{t("expoDetail.deposit")} (5%)</span>
                        <span className="text-[#C5A55A] font-bold font-['Inter']">{(selectedBooth.price * 0.05).toLocaleString()} {t("common.sar")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <p className="text-[10px] t-tertiary">{t("expoDetail.paymentMethod")}</p>
                    {["Credit Card", "Mada", "Apple Pay", "Bank Transfer"].map((m, i) => (
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
                    {t("expoDetail.confirmPayment")} — {(selectedBooth.price * 0.05).toLocaleString()} {t("common.sar")}
                  </button>
                  <p className="text-[9px] t-muted text-center">
                    {t("expoDetail.depositNonRefundable")}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Eye size={32} className="mx-auto t-muted mb-3" />
              <p className="text-sm t-tertiary">{t("expoDetail.selectUnit")}</p>
            </div>
          )}

          {/* AI Suggestion */}
          <div className="glass-card rounded-2xl p-4 border-purple-400/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-purple-400" />
              <h4 className="text-xs font-bold text-purple-300">{t("expoDetail.aiSuggestion")}</h4>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">
              {t("expoDetail.aiSuggestionText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
