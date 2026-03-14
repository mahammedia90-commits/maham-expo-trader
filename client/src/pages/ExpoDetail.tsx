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
  CreditCard, Timer, Info, Flame, Globe, AlertTriangle, Tag, FileText, Phone, Mail,
  Image, Layers, BarChart3, ChevronLeft, ChevronRight, Maximize2, X
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { events2026 } from "@/data/events2026";
import ContractPreview from "@/components/ContractPreview";

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
  faces: number; // number of open faces/frontage
  dimensions: string; // e.g. "3m x 3m"
}

// Booth gallery images by type (Unsplash)
const boothGallery: Record<BoothType, { url: string; label: string; labelEn: string }[]> = {
  standard: [
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", label: "واجهة البوث", labelEn: "Front View" },
    { url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
    { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  premium: [
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80", label: "واجهة البوث", labelEn: "Front View" },
    { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
    { url: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  corner: [
    { url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop", label: "واجهة البوث", labelEn: "Front View" },
    { url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop", label: "منظر جانبي", labelEn: "Side View" },
    { url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  island: [
    { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop", label: "منظر علوي", labelEn: "Top View" },
    { url: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
    { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  kiosk: [
    { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop", label: "واجهة الكشك", labelEn: "Kiosk Front" },
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
  ],
};

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

  const types: { type: BoothType; w: number; h: number; price: number; size: string; sizeM2: number; featureKeys: string[]; faces: number; dimensions: string }[] = [
    { type: "standard", w: 55, h: 45, price: 8000, size: "3×3", sizeM2: 9, featureKeys: ["expoDetail.electricity", "expoDetail.internet"], faces: 1, dimensions: "3m × 3m" },
    { type: "premium", w: 70, h: 45, price: 15000, size: "4×3", sizeM2: 12, featureKeys: ["expoDetail.electricity", "expoDetail.internet", "expoDetail.premiumLocation"], faces: 1, dimensions: "4m × 3m" },
    { type: "corner", w: 70, h: 55, price: 20000, size: "4×4", sizeM2: 16, featureKeys: ["expoDetail.electricity", "expoDetail.internet", "expoDetail.twoFacades"], faces: 2, dimensions: "4m × 4m" },
    { type: "island", w: 85, h: 65, price: 45000, size: "6×4", sizeM2: 24, featureKeys: ["expoDetail.electricity3Phase", "expoDetail.highSpeedInternet", "expoDetail.centralAC", "expoDetail.ledScreen"], faces: 4, dimensions: "6m × 4m" },
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
          faces: tp.faces,
          dimensions: tp.dimensions,
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
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "contract" | "review" | "approved" | "rejected" | "payment">("select");
  const [reviewStatus, setReviewStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [reviewTimer, setReviewTimer] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [compareList, setCompareList] = useState<Booth[]>([]);
  const [showCompare, setShowCompare] = useState(false);

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

  const handleProceedToContract = () => {
    setBookingStep("contract");
  };

  const handleContractAccepted = () => {
    setBookingStep("review");
    setReviewStatus("pending");
    setReviewTimer(0);
    toast.success(isArabicLike ? "تم إرسال طلبك للمشرف — بانتظار الموافقة" : "Request sent to supervisor — awaiting approval");
  };

  // Simulate admin review process (10-15 seconds)
  useEffect(() => {
    if (bookingStep !== "review" || reviewStatus !== "pending") return;
    const timer = setInterval(() => {
      setReviewTimer(prev => {
        const next = prev + 1;
        // Simulate approval after 10-15 seconds (90% approval rate)
        if (next >= 10 + Math.floor(Math.random() * 5)) {
          clearInterval(timer);
          const approved = Math.random() > 0.1; // 90% approval
          if (approved) {
            setReviewStatus("approved");
            setBookingStep("approved");
            toast.success(isArabicLike ? "تمت الموافقة على طلبك! يمكنك الدفع الآن" : "Your request has been approved! You can pay now");
            addNotification({
              type: "booking",
              titleAr: "تمت الموافقة على طلب الحجز",
              titleEn: "Booking Request Approved",
              message: isArabicLike
                ? `تمت الموافقة على حجز الجناح ${holdBooth?.code || ""} — يرجى إتمام الدفع خلال 30 دقيقة`
                : `Booth ${holdBooth?.code || ""} booking approved — please complete payment within 30 minutes`,
              link: "/bookings",
            });
          } else {
            setReviewStatus("rejected");
            setBookingStep("rejected");
            setRejectionReason(isArabicLike ? "لا يتوافق النشاط التجاري مع فئة المعرض" : "Business activity does not match expo category");
            toast.error(isArabicLike ? "تم رفض الطلب — يرجى مراجعة السبب" : "Request rejected — please review the reason");
            addNotification({
              type: "system",
              titleAr: "تم رفض طلب الحجز",
              titleEn: "Booking Request Rejected",
              message: isArabicLike
                ? `تم رفض حجز الجناح ${holdBooth?.code || ""} — السبب: لا يتوافق النشاط التجاري مع فئة المعرض`
                : `Booth ${holdBooth?.code || ""} booking rejected — Reason: Business activity does not match expo category`,
              link: "/bookings",
            });
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [bookingStep, reviewStatus, holdBooth, addNotification, isArabicLike]);

  const handleProceedToPayment = () => {
    setBookingStep("payment");
  };

  const handleRetryAfterRejection = () => {
    if (!holdBooth) return;
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "available" as BoothStatus } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");
    setReviewStatus("pending");
    setRejectionReason("");
    toast.info(isArabicLike ? "يمكنك اختيار وحدة أخرى" : "You can select another unit");
  };

  const handleBackToConfirm = () => {
    setBookingStep("confirm");
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

  // Simulated viewer count
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 15) + 8);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(3, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const scarcityPct = (stats.available / stats.total) * 100;
  const isScarcity = scarcityPct <= 30;

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
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold t-primary">{t("expoDetail.floorPlan")}</h2>
          <p className="text-[10px] t-muted truncate">{isArabicLike ? expo.nameAr : expo.nameEn}</p>
        </div>
        {/* Live viewers */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)] animate-pulse" />
          <Eye size={11} className="text-[var(--status-green)]" />
          <span className="text-[10px] text-[var(--status-green)] font-['Inter']">{viewerCount}</span>
          <span className="text-[9px] t-muted">{t("incentive.viewersNow").replace("{n}", "")}</span>
        </div>
      </div>

      {/* Scarcity Alert */}
      {isScarcity && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: scarcityPct <= 15 ? "rgba(239, 68, 68, 0.08)" : "rgba(251, 191, 36, 0.08)", border: `1px solid ${scarcityPct <= 15 ? "rgba(239, 68, 68, 0.15)" : "rgba(251, 191, 36, 0.15)"}` }}>
          <Flame size={14} className={scarcityPct <= 15 ? "text-[var(--status-red)] animate-pulse" : "text-[var(--status-yellow)]"} />
          <p className="text-[11px] t-secondary flex-1">
            {t("incentive.scarcity").replace("{n}", String(stats.available))}
          </p>
          <span className="text-[9px] t-muted font-['Inter']">
            {t("incentive.viewersNow").replace("{n}", String(viewerCount))}
          </span>
        </motion.div>
      )}

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

              {/* Booth Gallery */}
              {bookingStep === "select" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Image size={12} className="t-gold" />
                      <span className="text-[10px] font-bold t-secondary">{isArabicLike ? "صور الوحدة" : "Unit Gallery"}</span>
                    </div>
                    <button onClick={() => { setGalleryOpen(true); setGalleryIdx(0); }} className="text-[9px] t-gold hover:underline">
                      {isArabicLike ? "عرض الكل" : "View All"}
                    </button>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {boothGallery[selectedBooth.type]?.map((img, i) => (
                      <button key={i} onClick={() => { setGalleryOpen(true); setGalleryIdx(i); }}
                        className="shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-[var(--glass-border)] hover:border-[#C5A55A] transition-colors">
                        <img src={img.url} alt={isArabicLike ? img.label : img.labelEn} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Lightbox */}
              <AnimatePresence>
                {galleryOpen && selectedBooth && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
                    onClick={() => setGalleryOpen(false)}>
                    <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
                      <img src={boothGallery[selectedBooth.type]?.[galleryIdx]?.url} className="w-full rounded-xl" alt="" />
                      <p className="text-center text-xs t-secondary mt-2">
                        {isArabicLike ? boothGallery[selectedBooth.type]?.[galleryIdx]?.label : boothGallery[selectedBooth.type]?.[galleryIdx]?.labelEn}
                      </p>
                      <div className="flex justify-center gap-3 mt-3">
                        <button onClick={() => setGalleryIdx(prev => Math.max(0, prev - 1))} className="glass-card p-2 rounded-full"><ChevronLeft size={16} className="t-secondary" /></button>
                        <span className="text-xs t-muted self-center font-['Inter']">{galleryIdx + 1} / {boothGallery[selectedBooth.type]?.length}</span>
                        <button onClick={() => setGalleryIdx(prev => Math.min((boothGallery[selectedBooth.type]?.length || 1) - 1, prev + 1))} className="glass-card p-2 rounded-full"><ChevronRight size={16} className="t-secondary" /></button>
                      </div>
                      <button onClick={() => setGalleryOpen(false)} className="absolute top-2 right-2 glass-card p-1.5 rounded-full">
                        <X size={14} className="t-secondary" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                  <span className="text-xs t-tertiary flex items-center gap-2"><Maximize2 size={12} /> {isArabicLike ? "الأبعاد" : "Dimensions"}</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.dimensions}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Layers size={12} /> {isArabicLike ? "الواجهات" : "Frontage"}</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.faces} {isArabicLike ? "واجهة" : "face(s)"}</span>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (compareList.find(b => b.id === selectedBooth.id)) {
                          setCompareList(prev => prev.filter(b => b.id !== selectedBooth.id));
                        } else if (compareList.length < 3) {
                          setCompareList(prev => [...prev, selectedBooth]);
                        } else {
                          toast.info(isArabicLike ? "الحد الأقصى 3 وحدات للمقارنة" : "Max 3 booths to compare");
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border transition-colors ${
                        compareList.find(b => b.id === selectedBooth.id)
                          ? "border-[#C5A55A] bg-[#C5A55A]/10 text-[#C5A55A]"
                          : "border-[var(--glass-border)] t-tertiary hover:border-[#C5A55A]/50"
                      }`}
                    >
                      <BarChart3 size={12} />
                      {compareList.find(b => b.id === selectedBooth.id)
                        ? (isArabicLike ? "تمت الإضافة ✓" : "Added ✓")
                        : (isArabicLike ? "أضف للمقارنة" : "Compare")}
                    </button>
                    {compareList.length >= 2 && (
                      <button
                        onClick={() => setShowCompare(true)}
                        className="flex-1 py-2 rounded-xl text-[11px] btn-gold flex items-center justify-center gap-1.5"
                      >
                        <BarChart3 size={12} />
                        {isArabicLike ? `قارن (${compareList.length})` : `Compare (${compareList.length})`}
                      </button>
                    )}
                  </div>
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
                    onClick={handleProceedToContract}
                    disabled={!termsAccepted}
                    className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                      termsAccepted ? "btn-gold" : "opacity-40 cursor-not-allowed bg-gray-600"
                    }`}
                  >
                    <FileText size={14} />
                    {isArabicLike ? "معاينة العقد والمتابعة" : "Review Contract & Continue"}
                  </button>
                  <button
                    onClick={handleCancelHold}
                    className="w-full glass-card py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    {t("expoDetail.cancelHold")}
                  </button>
                </div>
              )}

              {bookingStep === "contract" && selectedBooth && (
                <ContractPreview
                  boothCode={selectedBooth.code}
                  boothType={boothTypeLabel(selectedBooth.type)}
                  boothSize={selectedBooth.size}
                  boothSizeM2={selectedBooth.sizeM2}
                  boothZone={`${t("expoDetail.zone")} ${selectedBooth.zone} — ${zoneLabel(selectedBooth.zone)}`}
                  boothPrice={selectedBooth.price}
                  depositAmount={selectedBooth.price * 0.05}
                  expoNameAr={expo.nameAr}
                  expoNameEn={expo.nameEn}
                  expoLocation={expo.location}
                  expoDate={`${expo.dateStart} — ${expo.dateEnd}`}
                  onAccept={handleContractAccepted}
                  onBack={handleBackToConfirm}
                />
              )}

              {/* Admin Review Step */}
              {bookingStep === "review" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.2)" }}>
                      <Clock size={28} className="text-yellow-400 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                    <h4 className="text-sm font-bold t-secondary mb-2">
                      {isArabicLike ? "بانتظار موافقة المشرف" : "Awaiting Supervisor Approval"}
                    </h4>
                    <p className="text-[10px] t-tertiary leading-relaxed mb-3">
                      {isArabicLike
                        ? "تم إرسال طلبك للمشرف لمراجعة ملفك التجاري والتحقق من توافق نشاطك مع فئة المعرض. ستتلقى إشعاراً بالنتيجة خلال دقائق."
                        : "Your request has been sent to the supervisor to review your business profile and verify compatibility with the expo category. You will receive a notification shortly."}
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-[11px] text-yellow-400 font-['Inter']">
                        {isArabicLike ? `جاري المراجعة... (${reviewTimer}s)` : `Reviewing... (${reviewTimer}s)`}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(reviewTimer * 8, 95)}%`, background: "linear-gradient(90deg, var(--gold-accent), var(--status-yellow))" }} />
                    </div>
                    <p className="text-[8px] t-muted mt-2">
                      {isArabicLike ? "المراجعة تتم عادة خلال 1-5 دقائق" : "Review usually takes 1-5 minutes"}
                    </p>
                  </div>

                  {/* What's being reviewed */}
                  <div className="glass-card rounded-xl p-3">
                    <p className="text-[9px] t-muted mb-2">{isArabicLike ? "ما يتم مراجعته:" : "What's being reviewed:"}</p>
                    <div className="space-y-1.5">
                      {[
                        { ar: "الملف التجاري والسجل التجاري", en: "Business profile & commercial registration", done: reviewTimer > 3 },
                        { ar: "توافق النشاط مع فئة المعرض", en: "Activity compatibility with expo category", done: reviewTimer > 6 },
                        { ar: "التحقق من بيانات KYC", en: "KYC data verification", done: reviewTimer > 8 },
                        { ar: "الموافقة النهائية", en: "Final approval", done: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {item.done ? (
                            <CheckCircle2 size={12} className="text-green-400 shrink-0" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-[var(--glass-border)] shrink-0" />
                          )}
                          <span className={`text-[10px] ${item.done ? "t-secondary" : "t-muted"}`}>
                            {isArabicLike ? item.ar : item.en}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCancelHold}
                    className="w-full glass-card py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    {t("expoDetail.cancelHold")}
                  </button>
                </div>
              )}

              {/* Approved — Proceed to Payment */}
              {bookingStep === "approved" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.2)" }}>
                      <CheckCircle2 size={28} className="text-green-400" />
                    </div>
                    <h4 className="text-sm font-bold text-green-400 mb-2">
                      {isArabicLike ? "تمت الموافقة على طلبك!" : "Your Request is Approved!"}
                    </h4>
                    <p className="text-[10px] t-tertiary leading-relaxed mb-3">
                      {isArabicLike
                        ? "تمت الموافقة على طلبك من قبل المشرف. يمكنك الآن إتمام الدفع لتأكيد الحجز. سيتم إرسال رابط الدفع أيضاً عبر SMS والبريد الإلكتروني."
                        : "Your request has been approved by the supervisor. You can now complete the payment to confirm your booking. A payment link will also be sent via SMS and email."}
                    </p>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.08)" }}>
                        <Phone size={10} className="text-green-400" />
                        <span className="text-[8px] text-green-400">SMS</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.08)" }}>
                        <Mail size={10} className="text-green-400" />
                        <span className="text-[8px] text-green-400">Email</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.08)" }}>
                        <CreditCard size={10} className="text-green-400" />
                        <span className="text-[8px] text-green-400">Apple Pay</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full btn-gold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 font-bold"
                  >
                    <CreditCard size={14} />
                    {isArabicLike ? `ادفع الآن — ${(selectedBooth!.price * 0.05).toLocaleString()} ${t("common.sar")}` : `Pay Now — ${(selectedBooth!.price * 0.05).toLocaleString()} ${t("common.sar")}`}
                  </button>
                  <p className="text-[8px] t-muted text-center">
                    {isArabicLike ? "يجب إتمام الدفع خلال فترة التثبيت المؤقت" : "Payment must be completed within the hold period"}
                  </p>
                </div>
              )}

              {/* Rejected */}
              {bookingStep === "rejected" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.2)" }}>
                      <AlertTriangle size={28} className="text-red-400" />
                    </div>
                    <h4 className="text-sm font-bold text-red-400 mb-2">
                      {isArabicLike ? "تم رفض الطلب" : "Request Rejected"}
                    </h4>
                    <p className="text-[10px] t-tertiary leading-relaxed mb-3">
                      {isArabicLike
                        ? "نأسف، تم رفض طلبك من قبل الجهة المشغلة. يمكنك التواصل مع الدعم أو اختيار وحدة أخرى."
                        : "Sorry, your request has been rejected by the operator. You can contact support or select another unit."}
                    </p>
                    {rejectionReason && (
                      <div className="p-2.5 rounded-lg mb-3" style={{ backgroundColor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        <p className="text-[9px] t-muted mb-1">{isArabicLike ? "سبب الرفض:" : "Reason:"}</p>
                        <p className="text-[10px] text-red-400">{rejectionReason}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-[9px] t-muted">
                      <Phone size={10} />
                      <span>00966535555900</span>
                      <span>|</span>
                      <Mail size={10} />
                      <span>rent@mahamexpo.sa</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRetryAfterRejection}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    {isArabicLike ? "اختيار وحدة أخرى" : "Select Another Unit"}
                  </button>
                  <Link href="/help">
                    <button className="w-full glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors text-center">
                      {isArabicLike ? "تواصل مع الدعم" : "Contact Support"}
                    </button>
                  </Link>
                </div>
              )}

              {bookingStep === "payment" && (
                <div className="space-y-4">
                  {/* Contract Accepted Badge */}
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span className="text-[10px] text-green-400 font-semibold">
                      {isArabicLike ? "\u062a\u0645 \u0642\u0628\u0648\u0644 \u0627\u0644\u0639\u0642\u062f \u0628\u0646\u062c\u0627\u062d — \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0644\u0644\u062f\u0641\u0639" : "Contract accepted — proceed to payment"}
                    </span>
                  </div>

                  {/* Enhanced Payment Summary */}
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
                        <span className="t-secondary font-bold">{isArabicLike ? "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a" : "Total"}</span>
                        <span className="t-secondary font-bold font-['Inter']">{selectedBooth.price.toLocaleString()} {t("common.sar")}</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2.5 rounded-lg text-center" style={{ backgroundColor: "rgba(197,165,90,0.05)", border: "1px solid rgba(197,165,90,0.15)" }}>
                      <p className="text-[9px] t-tertiary mb-1">{isArabicLike ? "\u0627\u0644\u0645\u0628\u0644\u063a \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0627\u0644\u0622\u0646" : "Amount Due Now"}</p>
                      <p className="text-lg font-bold text-[#C5A55A] font-['Inter']">{(selectedBooth.price * 0.05).toLocaleString()} <span className="text-xs">{t("common.sar")}</span></p>
                      <p className="text-[8px] t-muted">{isArabicLike ? "\u0639\u0631\u0628\u0648\u0646 \u063a\u064a\u0631 \u0645\u0633\u062a\u0631\u062f (5%)" : "Non-refundable deposit (5%)"}</p>
                    </div>
                    <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)" }}>
                      <div className="flex justify-between text-[9px]">
                        <span className="t-tertiary">{isArabicLike ? "\u0627\u0644\u0645\u062a\u0628\u0642\u064a (\u064a\u064f\u062f\u0641\u0639 \u0642\u0628\u0644 30 \u064a\u0648\u0645\u0627\u064b \u0645\u0646 \u0627\u0644\u0645\u0639\u0631\u0636)" : "Remaining (due 30 days before expo)"}</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.95).toLocaleString()} {t("common.sar")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(251,191,36,0.03)", border: "1px solid rgba(251,191,36,0.1)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={10} className="text-yellow-400" />
                      <span className="text-[9px] font-bold text-yellow-400">{isArabicLike ? "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u0625\u0644\u063a\u0627\u0621" : "Cancellation Policy"}</span>
                    </div>
                    <div className="space-y-1 text-[8px] t-muted">
                      <p>{isArabicLike ? "\u2022 \u0627\u0644\u0639\u0631\u0628\u0648\u0646 \u063a\u064a\u0631 \u0645\u0633\u062a\u0631\u062f \u0641\u064a \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0627\u0644\u0627\u062a" : "\u2022 Deposit is non-refundable"}</p>
                      <p>{isArabicLike ? "\u2022 \u0625\u0644\u063a\u0627\u0621 \u0642\u0628\u0644 15+ \u064a\u0648\u0645\u0627\u064b: \u0627\u0633\u062a\u0631\u062f\u0627\u062f 50% \u0645\u0646 \u0627\u0644\u0645\u062a\u0628\u0642\u064a" : "\u2022 Cancel 15+ days before: 50% refund of remaining"}</p>
                      <p>{isArabicLike ? "\u2022 \u0625\u0644\u063a\u0627\u0621 \u0642\u0628\u0644 \u0623\u0642\u0644 \u0645\u0646 15 \u064a\u0648\u0645\u0627\u064b: \u0644\u0627 \u064a\u0648\u062c\u062f \u0627\u0633\u062a\u0631\u062f\u0627\u062f" : "\u2022 Cancel <15 days: no refund"}</p>
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

          {/* Participating Countries */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={14} className="t-gold" />
              <h4 className="text-xs font-bold t-secondary">{t("expo.countries")}</h4>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["\u{1F1F8}\u{1F1E6}", "\u{1F1E6}\u{1F1EA}", "\u{1F1F6}\u{1F1E6}", "\u{1F1F0}\u{1F1FC}", "\u{1F1E7}\u{1F1ED}", "\u{1F1F4}\u{1F1F2}", "\u{1F1EA}\u{1F1EC}", "\u{1F1F9}\u{1F1F7}", "\u{1F1E8}\u{1F1F3}", "\u{1F1EC}\u{1F1E7}"].map((flag, i) => (
                <span key={i} className="text-lg">{flag}</span>
              ))}
            </div>
          </div>

          {/* Sponsorship Opportunities */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="t-gold" />
              <h4 className="text-xs font-bold t-secondary">{t("sponsor.title")}</h4>
            </div>
            <div className="space-y-2">
              {[
                { name: t("sponsor.gold"), price: "150,000", color: "#C5A55A", avail: true },
                { name: t("sponsor.silver"), price: "75,000", color: "#94A3B8", avail: true },
                { name: t("sponsor.startup"), price: "25,000", color: "#60A5FA", avail: false },
              ].map((sp, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sp.color }} />
                    <span className="text-[10px] t-secondary">{sp.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] t-gold font-['Inter']">{sp.price} {t("common.sar")}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{
                      backgroundColor: sp.avail ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: sp.avail ? "var(--status-green)" : "var(--status-red)",
                    }}>
                      {sp.avail ? t("sponsor.available") : t("sponsor.reserved")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compare Booths Modal */}
      <AnimatePresence>
        {showCompare && compareList.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowCompare(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card rounded-2xl p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold t-primary flex items-center gap-2">
                  <BarChart3 size={16} className="t-gold" />
                  {isArabicLike ? "مقارنة الوحدات" : "Compare Booths"}
                </h3>
                <button onClick={() => setShowCompare(false)} className="glass-card p-1.5 rounded-full"><X size={14} className="t-secondary" /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)]">
                      <th className="py-2 px-3 text-start t-tertiary">{isArabicLike ? "الخاصية" : "Feature"}</th>
                      {compareList.map(b => (
                        <th key={b.id} className="py-2 px-3 text-center text-[#C5A55A] font-bold">{b.code}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isArabicLike ? "النوع" : "Type"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary">{boothTypeLabel(b.type)}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isArabicLike ? "المساحة" : "Area"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary font-['Inter']">{b.sizeM2} m²</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isArabicLike ? "الأبعاد" : "Dimensions"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary font-['Inter']">{b.dimensions}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isArabicLike ? "الواجهات" : "Faces"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary font-['Inter']">{b.faces}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isArabicLike ? "المنطقة" : "Zone"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary">{zoneLabel(b.zone)}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isArabicLike ? "المميزات" : "Features"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary text-[10px]">{b.featureKeys.map(f => t(f)).join(", ")}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 t-tertiary font-bold">{isArabicLike ? "السعر" : "Price"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center text-[#C5A55A] font-bold font-['Inter']">{b.price.toLocaleString()} {t("common.sar")}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 mt-4">
                {compareList.map(b => (
                  <button key={b.id} onClick={() => { setSelectedBooth(b); setShowCompare(false); }}
                    className="flex-1 py-2 rounded-xl text-[11px] btn-gold flex items-center justify-center gap-1">
                    {isArabicLike ? `اختر ${b.code}` : `Select ${b.code}`}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
