/**
 * InteractiveFloorMap — Professional Real Estate Master Plan
 * Realistic exhibition floor plan for online booth selling
 * Features: Zoom/Pan, pinch-zoom, hover tooltips, realistic zones with aisles,
 * facilities, entrances, emergency exits, mini-map, compass, scale bar
 * Designed for "On His Steps" (على خطاه) event with 8 real zones
 */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Layers, Eye,
  MapPin, Building2, Ruler, Zap, Lock, Star, Search, Filter
} from "lucide-react";

export type BoothStatus = "available" | "reserved" | "sold" | "my-hold";
export type BoothType = "standard" | "premium" | "corner" | "island" | "kiosk";

export interface Booth {
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
  faces: number;
  dimensions: string;
}

interface Props {
  booths: Booth[];
  selectedBooth: Booth | null;
  onBoothClick: (booth: Booth) => void;
  zoneFilter: string;
  typeFilter: string;
  t: (key: string) => string;
  isRTL: boolean;
  isArabicLike: boolean;
}

// Professional color scheme for booth statuses
const statusColors: Record<BoothStatus, { fill: string; stroke: string; glow: string; text: string }> = {
  available: { fill: "#10B981", stroke: "#34D399", glow: "rgba(16,185,129,0.3)", text: "#D1FAE5" },
  reserved: { fill: "#F59E0B", stroke: "#FBBF24", glow: "rgba(245,158,11,0.25)", text: "#FEF3C7" },
  sold: { fill: "#6B7280", stroke: "#9CA3AF", glow: "rgba(107,114,128,0.1)", text: "#D1D5DB" },
  "my-hold": { fill: "#C5A55A", stroke: "#E8D5A3", glow: "rgba(197,165,90,0.35)", text: "#FEF9C3" },
};

const typeIcons: Record<BoothType, string> = {
  standard: "S", premium: "P", corner: "C", island: "I", kiosk: "K",
};

// Map dimensions - wider for 8 zones layout
const MAP_W = 1800;
const MAP_H = 900;

export default function InteractiveFloorMap({
  booths, selectedBooth, onBoothClick, zoneFilter, typeFilter, t, isRTL, isArabicLike,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBooth, setHoveredBooth] = useState<Booth | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);

  // Filter booths
  const filteredBooths = useMemo(() => {
    return booths.filter(b => {
      const matchZone = zoneFilter === "all" || b.zone === zoneFilter;
      const matchType = typeFilter === "all" || b.type === typeFilter;
      const matchSearch = !searchQuery || b.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchZone && matchType && matchSearch;
    });
  }, [booths, zoneFilter, typeFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = booths.length;
    const available = booths.filter(b => b.status === "available").length;
    const reserved = booths.filter(b => b.status === "reserved").length;
    const sold = booths.filter(b => b.status === "sold").length;
    return { total, available, reserved, sold, occupancy: Math.round(((sold + reserved) / total) * 100) };
  }, [booths]);

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    setScale(prev => Math.min(3, Math.max(0.3, prev + delta)));
  }, []);

  const handleReset = useCallback(() => {
    setScale(0.7);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / MAP_W;
    const scaleY = rect.height / MAP_H;
    setScale(Math.min(scaleX, scaleY) * 0.92);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Auto fit on mount
  useEffect(() => {
    const timer = setTimeout(handleFitToScreen, 100);
    return () => clearTimeout(timer);
  }, [handleFitToScreen]);

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setScale(prev => Math.min(3, Math.max(0.3, prev + delta)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".booth-rect")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  }, [translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const touchRef = useRef<{ startX: number; startY: number; startDist: number; startScale: number }>({
    startX: 0, startY: 0, startDist: 0, startScale: 1,
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - translate.x, y: e.touches[0].clientY - translate.y });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current = {
        startX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        startY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        startDist: Math.sqrt(dx * dx + dy * dy),
        startScale: scale,
      };
    }
  }, [translate, scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setTranslate({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newScale = touchRef.current.startScale * (dist / touchRef.current.startDist);
      setScale(Math.min(3, Math.max(0.3, newScale)));
    }
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Booth hover tooltip
  const handleBoothHover = useCallback((booth: Booth, e: React.MouseEvent) => {
    setHoveredBooth(booth);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 10,
      });
    }
  }, []);

  // 8 Zone definitions for "On His Steps" (على خطاه) - realistic master plan layout
  // Layout: 4 zones top row, 4 zones bottom row with main aisle in between
  const zones = [
    // Top row (left to right)
    { id: "A", label: isArabicLike ? "غار ثور" : "Ghar Thawr", labelEn: "Zone A", x: 40, y: 40, w: 390, h: 350, color: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.18)", accent: "#EF4444" },
    { id: "B", label: isArabicLike ? "الجحفة" : "Al-Juhfah", labelEn: "Zone B", x: 470, y: 40, w: 390, h: 350, color: "rgba(59,130,246,0.04)", borderColor: "rgba(59,130,246,0.18)", accent: "#3B82F6" },
    { id: "C", label: isArabicLike ? "الريم" : "Al-Reem", labelEn: "Zone C", x: 900, y: 40, w: 390, h: 350, color: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.18)", accent: "#10B981" },
    { id: "D", label: isArabicLike ? "العرج" : "Al-Arj", labelEn: "Zone D", x: 1330, y: 40, w: 430, h: 350, color: "rgba(168,85,247,0.04)", borderColor: "rgba(168,85,247,0.18)", accent: "#A855F7" },
    // Bottom row (left to right)
    { id: "E", label: isArabicLike ? "القاهة" : "Al-Qahah", labelEn: "Zone E", x: 40, y: 500, w: 390, h: 350, color: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.18)", accent: "#F59E0B" },
    { id: "F", label: isArabicLike ? "الروحاء" : "Al-Rawha", labelEn: "Zone F", x: 470, y: 500, w: 390, h: 350, color: "rgba(236,72,153,0.04)", borderColor: "rgba(236,72,153,0.18)", accent: "#EC4899" },
    { id: "G", label: isArabicLike ? "ذو الحليفة" : "Dhul Hulayfah", labelEn: "Zone G", x: 900, y: 500, w: 390, h: 350, color: "rgba(20,184,166,0.04)", borderColor: "rgba(20,184,166,0.18)", accent: "#14B8A6" },
    { id: "H", label: isArabicLike ? "المدينة المنورة" : "Al-Madinah", labelEn: "Zone H", x: 1330, y: 500, w: 430, h: 350, color: "rgba(197,165,90,0.04)", borderColor: "rgba(197,165,90,0.18)", accent: "#C5A55A" },
  ];

  // Main aisles/corridors
  const aisles = [
    // Horizontal main boulevard (between top and bottom rows)
    { x: 40, y: 400, w: 1720, h: 90, label: isArabicLike ? "الممر الرئيسي — طريق الهجرة" : "Main Boulevard — Hijrah Path", isMain: true },
    // Vertical aisles between zones (top)
    { x: 435, y: 40, w: 30, h: 350, label: "", isMain: false },
    { x: 865, y: 40, w: 30, h: 350, label: "", isMain: false },
    { x: 1295, y: 40, w: 30, h: 350, label: "", isMain: false },
    // Vertical aisles between zones (bottom)
    { x: 435, y: 500, w: 30, h: 350, label: "", isMain: false },
    { x: 865, y: 500, w: 30, h: 350, label: "", isMain: false },
    { x: 1295, y: 500, w: 30, h: 350, label: "", isMain: false },
  ];

  // Facilities and landmarks
  const facilities = [
    { x: 40, y: 860, w: 150, h: 30, label: isArabicLike ? "🚪 المدخل الرئيسي" : "🚪 Main Entrance", type: "entrance" },
    { x: 250, y: 860, w: 130, h: 30, label: isArabicLike ? "🎫 التسجيل" : "🎫 Registration", type: "registration" },
    { x: 700, y: 860, w: 130, h: 30, label: isArabicLike ? "⭐ مدخل VIP" : "⭐ VIP Entrance", type: "vip" },
    { x: 1100, y: 860, w: 130, h: 30, label: isArabicLike ? "🚛 بوابة الخدمات" : "🚛 Service Gate", type: "service" },
    { x: 1600, y: 860, w: 150, h: 30, label: isArabicLike ? "🚨 مخرج طوارئ" : "🚨 Emergency Exit", type: "emergency" },
    // Top facilities
    { x: 40, y: 5, w: 120, h: 28, label: isArabicLike ? "🚻 دورات مياه" : "🚻 Restrooms", type: "wc" },
    { x: 500, y: 5, w: 120, h: 28, label: isArabicLike ? "☕ كافيتريا" : "☕ Café", type: "cafe" },
    { x: 900, y: 5, w: 120, h: 28, label: isArabicLike ? "🏥 إسعافات" : "🏥 First Aid", type: "medical" },
    { x: 1400, y: 5, w: 120, h: 28, label: isArabicLike ? "🕌 مصلى" : "🕌 Prayer Room", type: "prayer" },
    // Center facilities on main aisle
    { x: 820, y: 420, w: 160, h: 50, label: isArabicLike ? "🎭 المسرح الرئيسي" : "🎭 Main Stage", type: "stage" },
  ];

  const boothTypeLabel = (type: BoothType) => {
    const map: Record<BoothType, string> = {
      standard: isArabicLike ? "عادي" : "Standard",
      premium: isArabicLike ? "مميز" : "Premium",
      corner: isArabicLike ? "زاوية" : "Corner",
      island: isArabicLike ? "جزيرة" : "Island",
      kiosk: isArabicLike ? "كشك" : "Kiosk",
    };
    return map[type];
  };

  const statusLabel = (status: BoothStatus) => {
    const map: Record<BoothStatus, string> = {
      available: isArabicLike ? "متاح" : "Available",
      reserved: isArabicLike ? "محجوز" : "Reserved",
      sold: isArabicLike ? "مباع" : "Sold",
      "my-hold": isArabicLike ? "مثبّت لك" : "Your Hold",
    };
    return map[status];
  };

  return (
    <div className="relative">
      {/* Top Stats Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-3 px-1">
        <div className="flex items-center gap-4 text-[10px]">
          <span className="t-muted">{isArabicLike ? "إجمالي الوحدات:" : "Total Units:"} <strong className="t-primary font-['Inter']">{stats.total}</strong></span>
          <span className="text-green-500">{isArabicLike ? "متاح:" : "Available:"} <strong className="font-['Inter']">{stats.available}</strong></span>
          <span className="text-yellow-500">{isArabicLike ? "محجوز:" : "Reserved:"} <strong className="font-['Inter']">{stats.reserved}</strong></span>
          <span className="t-muted">{isArabicLike ? "مباع:" : "Sold:"} <strong className="font-['Inter']">{stats.sold}</strong></span>
          <span className="text-[#C5A55A]">{isArabicLike ? "نسبة الإشغال:" : "Occupancy:"} <strong className="font-['Inter']">{stats.occupancy}%</strong></span>
        </div>
        {/* Search */}
        <div className="flex items-center gap-1.5 glass-card rounded-lg px-2 py-1 ms-auto">
          <Search size={12} className="t-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabicLike ? "بحث عن وحدة..." : "Search unit..."}
            className="bg-transparent text-[10px] t-primary w-24 outline-none placeholder:t-muted"
          />
        </div>
      </div>

      {/* Zone Quick Nav */}
      <div className="flex flex-wrap gap-1.5 mb-3 px-1">
        {zones.map(z => {
          const zoneBooths = booths.filter(b => b.zone === z.id);
          const zoneAvailable = zoneBooths.filter(b => b.status === "available").length;
          return (
            <button
              key={z.id}
              onClick={() => setHighlightedZone(highlightedZone === z.id ? null : z.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-medium transition-all ${
                highlightedZone === z.id
                  ? 'ring-1 ring-[#C5A55A] bg-[#C5A55A]/10 text-[#C5A55A]'
                  : 'glass-card t-secondary hover:bg-[var(--glass-bg)]'
              }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: z.accent }} />
              <span>{z.label}</span>
              <span className="font-['Inter'] text-[8px] t-muted">({zoneAvailable})</span>
            </button>
          );
        })}
      </div>

      {/* Zoom Controls */}
      <div className={`absolute top-[120px] ${isRTL ? 'left-3' : 'right-3'} z-20 flex flex-col gap-1.5`}>
        <button onClick={() => handleZoom(0.15)} className="glass-card w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors" title="Zoom In">
          <ZoomIn size={16} className="t-secondary" />
        </button>
        <button onClick={() => handleZoom(-0.15)} className="glass-card w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors" title="Zoom Out">
          <ZoomOut size={16} className="t-secondary" />
        </button>
        <button onClick={handleFitToScreen} className="glass-card w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors" title="Fit">
          <Maximize2 size={16} className="t-secondary" />
        </button>
        <button onClick={handleReset} className="glass-card w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors" title="Reset">
          <RotateCcw size={16} className="t-secondary" />
        </button>
        <button onClick={() => setShowMiniMap(!showMiniMap)} className={`glass-card w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showMiniMap ? 'bg-[#C5A55A]/15 text-[#C5A55A]' : 'hover:bg-[var(--glass-bg)] t-secondary'}`} title="Mini Map">
          <Layers size={16} />
        </button>
        <div className="glass-card px-2 py-1 rounded-lg text-center">
          <span className="text-[9px] t-muted font-['Inter']">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className={`absolute top-[120px] ${isRTL ? 'right-3' : 'left-3'} z-20`}>
        <div className="glass-card rounded-xl p-3 space-y-1.5" style={{ minWidth: 130 }}>
          <p className="text-[9px] font-bold t-secondary mb-1">{isArabicLike ? "دليل الخريطة" : "Map Legend"}</p>
          {(["available", "reserved", "sold", "my-hold"] as BoothStatus[]).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: statusColors[s].fill, border: `1px solid ${statusColors[s].stroke}` }} />
              <span className="text-[9px] t-tertiary">{statusLabel(s)}</span>
            </div>
          ))}
          <div className="border-t border-[var(--glass-border)] pt-1.5 mt-1.5">
            <p className="text-[8px] font-bold t-muted mb-1">{isArabicLike ? "أنواع الوحدات" : "Unit Types"}</p>
            {(["standard", "premium", "corner", "island", "kiosk"] as BoothType[]).map(tp => (
              <div key={tp} className="flex items-center gap-2">
                <span className="w-4 text-center text-[8px] font-bold text-[#C5A55A] font-['Inter']">{typeIcons[tp]}</span>
                <span className="text-[9px] t-tertiary">{boothTypeLabel(tp)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--glass-border)] pt-1.5 mt-1.5">
            <p className="text-[8px] font-bold t-muted mb-1">{isArabicLike ? "المرافق" : "Facilities"}</p>
            <div className="space-y-0.5 text-[8px] t-tertiary">
              <div>🚪 {isArabicLike ? "مدخل" : "Entrance"}</div>
              <div>🚨 {isArabicLike ? "طوارئ" : "Emergency"}</div>
              <div>🎭 {isArabicLike ? "مسرح" : "Stage"}</div>
              <div>🕌 {isArabicLike ? "مصلى" : "Prayer"}</div>
              <div>☕ {isArabicLike ? "كافيتريا" : "Café"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div
        ref={containerRef}
        className="glass-card rounded-2xl overflow-hidden relative"
        style={{ height: "min(75vh, 620px)", cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* Background & Grid */}
          <defs>
            <pattern id="grid-fine" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.3" />
            </pattern>
            <pattern id="grid-major" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
            </filter>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A55A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="aisleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(197,165,90,0.06)" />
              <stop offset="50%" stopColor="rgba(197,165,90,0.03)" />
              <stop offset="100%" stopColor="rgba(197,165,90,0.06)" />
            </linearGradient>
          </defs>

          {/* Dark background */}
          <rect width={MAP_W} height={MAP_H} fill="rgba(8,8,16,0.97)" rx="16" />
          <rect width={MAP_W} height={MAP_H} fill="url(#grid-fine)" rx="16" />
          <rect width={MAP_W} height={MAP_H} fill="url(#grid-major)" rx="16" />

          {/* Outer border with gold accent */}
          <rect x="4" y="4" width={MAP_W - 8} height={MAP_H - 8} fill="none" stroke="rgba(197,165,90,0.12)" strokeWidth="1.5" rx="14" />
          <rect x="8" y="8" width={MAP_W - 16} height={MAP_H - 16} fill="none" stroke="rgba(197,165,90,0.06)" strokeWidth="0.5" rx="12" strokeDasharray="8 4" />

          {/* Title */}
          <text x={MAP_W / 2} y={MAP_H / 2 + 5} fill="rgba(197,165,90,0.06)" fontSize="60" textAnchor="middle" fontFamily="Inter" fontWeight="900" letterSpacing="8">
            {isArabicLike ? "على خطاه" : "ON HIS STEPS"}
          </text>

          {/* Main Aisles */}
          {aisles.map((aisle, i) => (
            <g key={`aisle-${i}`}>
              <rect
                x={aisle.x} y={aisle.y}
                width={aisle.w} height={aisle.h}
                fill={aisle.isMain ? "url(#aisleGrad)" : "rgba(197,165,90,0.02)"}
                stroke="rgba(197,165,90,0.08)"
                strokeWidth={aisle.isMain ? 1.5 : 0.5}
                rx={aisle.isMain ? 8 : 4}
                strokeDasharray={aisle.isMain ? "none" : "4 2"}
              />
              {aisle.label && (
                <>
                  {/* Dashed center line for main aisle */}
                  <line
                    x1={aisle.x + 20} y1={aisle.y + aisle.h / 2}
                    x2={aisle.x + aisle.w - 20} y2={aisle.y + aisle.h / 2}
                    stroke="rgba(197,165,90,0.12)" strokeWidth="1" strokeDasharray="12 6"
                  />
                  {/* Direction arrows */}
                  <text x={aisle.x + 60} y={aisle.y + aisle.h / 2 - 10} fill="rgba(197,165,90,0.15)" fontSize="14" fontFamily="Inter">→</text>
                  <text x={aisle.x + aisle.w - 80} y={aisle.y + aisle.h / 2 - 10} fill="rgba(197,165,90,0.15)" fontSize="14" fontFamily="Inter">→</text>
                  <text x={aisle.x + aisle.w / 2} y={aisle.y + aisle.h / 2 + 5} fill="rgba(197,165,90,0.2)" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="600">
                    {aisle.label}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* Zones */}
          {zones.map(zone => {
            const isHighlighted = highlightedZone === zone.id || !highlightedZone;
            const zoneBooths = booths.filter(b => b.zone === zone.id);
            const zoneAvailable = zoneBooths.filter(b => b.status === "available").length;
            return (
              <g key={zone.id} opacity={isHighlighted ? 1 : 0.3}>
                {/* Zone background */}
                <rect
                  x={zone.x} y={zone.y}
                  width={zone.w} height={zone.h}
                  fill={zone.color}
                  stroke={zone.borderColor}
                  strokeWidth="1.5"
                  rx="10"
                />
                {/* Zone label background */}
                <rect
                  x={zone.x + zone.w / 2 - 70} y={zone.y + 6}
                  width={140} height={28}
                  fill="rgba(0,0,0,0.4)"
                  rx="6"
                />
                <text
                  x={zone.x + zone.w / 2} y={zone.y + 20}
                  fill={zone.accent}
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="700"
                >
                  {zone.label}
                </text>
                <text
                  x={zone.x + zone.w / 2} y={zone.y + 30}
                  fill="rgba(255,255,255,0.3)"
                  fontSize="7"
                  textAnchor="middle"
                  fontFamily="Inter"
                >
                  {zone.labelEn} • {zoneAvailable} {isArabicLike ? "متاح" : "available"}
                </text>
                {/* Zone corner markers */}
                <line x1={zone.x} y1={zone.y + 8} x2={zone.x} y2={zone.y} stroke={zone.accent} strokeWidth="2" opacity="0.4" />
                <line x1={zone.x} y1={zone.y} x2={zone.x + 8} y2={zone.y} stroke={zone.accent} strokeWidth="2" opacity="0.4" />
                <line x1={zone.x + zone.w - 8} y1={zone.y} x2={zone.x + zone.w} y2={zone.y} stroke={zone.accent} strokeWidth="2" opacity="0.4" />
                <line x1={zone.x + zone.w} y1={zone.y} x2={zone.x + zone.w} y2={zone.y + 8} stroke={zone.accent} strokeWidth="2" opacity="0.4" />
              </g>
            );
          })}

          {/* Facilities */}
          {facilities.map((f, i) => (
            <g key={`fac-${i}`}>
              <rect
                x={f.x} y={f.y}
                width={f.w} height={f.h}
                fill={f.type === "emergency" ? "rgba(239,68,68,0.08)" : f.type === "stage" ? "rgba(197,165,90,0.08)" : "rgba(100,100,120,0.06)"}
                stroke={f.type === "emergency" ? "rgba(239,68,68,0.2)" : f.type === "stage" ? "rgba(197,165,90,0.2)" : "rgba(100,100,120,0.12)"}
                strokeWidth="1"
                rx="6"
              />
              <text
                x={f.x + f.w / 2} y={f.y + f.h / 2 + 4}
                fill={f.type === "emergency" ? "rgba(239,68,68,0.6)" : f.type === "stage" ? "rgba(197,165,90,0.6)" : "rgba(160,160,180,0.5)"}
                fontSize="9"
                textAnchor="middle"
                fontFamily="Inter"
                fontWeight="500"
              >
                {f.label}
              </text>
            </g>
          ))}

          {/* Booths */}
          {filteredBooths.map((booth) => {
            const colors = statusColors[booth.status];
            const isSelected = selectedBooth?.id === booth.id;
            const isHovered = hoveredBooth?.id === booth.id;
            const isAvailable = booth.status === "available";
            const isMyHold = booth.status === "my-hold";
            const zoneHighlighted = !highlightedZone || booth.zone === highlightedZone;

            return (
              <g
                key={booth.id}
                className="booth-rect"
                onClick={(e) => { e.stopPropagation(); onBoothClick(booth); }}
                onMouseEnter={(e) => handleBoothHover(booth, e)}
                onMouseLeave={() => setHoveredBooth(null)}
                style={{ cursor: booth.status === "sold" ? "not-allowed" : "pointer" }}
                opacity={zoneHighlighted ? 1 : 0.25}
              >
                {/* Glow effect for selected/hovered */}
                {(isSelected || isHovered) && (
                  <rect
                    x={booth.x - 3} y={booth.y - 3}
                    width={booth.w + 6} height={booth.h + 6}
                    fill="none"
                    stroke={isSelected ? "#C5A55A" : colors.stroke}
                    strokeWidth="2"
                    rx="7"
                    opacity="0.7"
                    filter="url(#glow)"
                  />
                )}

                {/* Booth rectangle */}
                <rect
                  x={booth.x} y={booth.y}
                  width={booth.w} height={booth.h}
                  fill={isSelected ? "rgba(197,165,90,0.3)" : `${colors.fill}${booth.status === "sold" ? "12" : "20"}`}
                  stroke={isSelected ? "#C5A55A" : colors.stroke}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 0.8}
                  rx="5"
                  opacity={booth.status === "sold" ? 0.35 : 1}
                />

                {/* Inner border for depth */}
                <rect
                  x={booth.x + 1.5} y={booth.y + 1.5}
                  width={booth.w - 3} height={booth.h - 3}
                  fill="none"
                  stroke={`${colors.fill}15`}
                  strokeWidth="0.5"
                  rx="4"
                />

                {/* Type indicator badge */}
                <rect
                  x={booth.x + 2} y={booth.y + 2}
                  width={14} height={12}
                  fill={colors.fill} rx="3" opacity="0.5"
                />
                <text
                  x={booth.x + 9} y={booth.y + 11}
                  fill="white" fontSize="7" textAnchor="middle" fontFamily="Inter" fontWeight="700"
                >
                  {typeIcons[booth.type]}
                </text>

                {/* Booth code */}
                <text
                  x={booth.x + booth.w / 2} y={booth.y + booth.h / 2 - 3}
                  fill={booth.status === "sold" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.9)"}
                  fontSize="11" textAnchor="middle" fontFamily="Inter" fontWeight="700"
                >
                  {booth.code}
                </text>

                {/* Size */}
                <text
                  x={booth.x + booth.w / 2} y={booth.y + booth.h / 2 + 10}
                  fill={booth.status === "sold" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.4)"}
                  fontSize="8" textAnchor="middle" fontFamily="Inter"
                >
                  {booth.sizeM2}m²
                </text>

                {/* Price tag for available */}
                {isAvailable && booth.h >= 45 && (
                  <text
                    x={booth.x + booth.w / 2} y={booth.y + booth.h - 5}
                    fill="rgba(16,185,129,0.65)" fontSize="7" textAnchor="middle" fontFamily="Inter" fontWeight="600"
                  >
                    {(booth.price / 1000).toFixed(0)}K SAR
                  </text>
                )}

                {/* Lock icon for my-hold */}
                {isMyHold && (
                  <text x={booth.x + booth.w - 12} y={booth.y + 12} fontSize="10" fill="#C5A55A">🔒</text>
                )}

                {/* Star for premium */}
                {booth.type === "premium" && isAvailable && (
                  <text x={booth.x + booth.w - 12} y={booth.y + 12} fontSize="8" fill="#FBBF24">★</text>
                )}
              </g>
            );
          })}

          {/* North arrow / compass */}
          <g transform={`translate(${MAP_W - 40}, 35)`}>
            <circle cx="0" cy="0" r="20" fill="rgba(197,165,90,0.05)" stroke="rgba(197,165,90,0.15)" strokeWidth="1" />
            <text x="0" y="-7" fill="rgba(197,165,90,0.6)" fontSize="9" textAnchor="middle" fontFamily="Inter" fontWeight="700">N</text>
            <path d="M0,-14 L4,-5 L-4,-5 Z" fill="rgba(197,165,90,0.5)" />
            <text x="0" y="14" fill="rgba(197,165,90,0.3)" fontSize="7" textAnchor="middle" fontFamily="Inter">S</text>
            <text x="-14" y="3" fill="rgba(197,165,90,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">W</text>
            <text x="14" y="3" fill="rgba(197,165,90,0.2)" fontSize="6" textAnchor="middle" fontFamily="Inter">E</text>
          </g>

          {/* Scale bar */}
          <g transform={`translate(${MAP_W - 180}, ${MAP_H - 20})`}>
            <line x1="0" y1="0" x2="120" y2="0" stroke="rgba(197,165,90,0.35)" strokeWidth="1.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(197,165,90,0.35)" strokeWidth="1" />
            <line x1="60" y1="-3" x2="60" y2="3" stroke="rgba(197,165,90,0.2)" strokeWidth="0.5" />
            <line x1="120" y1="-4" x2="120" y2="4" stroke="rgba(197,165,90,0.35)" strokeWidth="1" />
            <text x="60" y="-7" fill="rgba(197,165,90,0.4)" fontSize="8" textAnchor="middle" fontFamily="Inter" fontWeight="500">20m</text>
          </g>

          {/* Project title watermark */}
          <text x={MAP_W / 2} y={MAP_H - 10} fill="rgba(197,165,90,0.08)" fontSize="9" textAnchor="middle" fontFamily="Inter" fontWeight="500">
            Maham Expo — Master Plan v2.0
          </text>
        </svg>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredBooth && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute z-30 pointer-events-none"
              style={{
                left: Math.min(tooltipPos.x, (containerRef.current?.clientWidth || 300) - 220),
                top: Math.max(tooltipPos.y - 140, 10),
              }}
            >
              <div className="rounded-xl p-3 shadow-2xl border border-[rgba(197,165,90,0.25)]" style={{ minWidth: 200, backgroundColor: "rgba(12,12,22,0.97)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#E8D5A3] font-['Inter']">{hoveredBooth.code}</span>
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-bold" style={{
                    backgroundColor: `${statusColors[hoveredBooth.status].fill}20`,
                    color: statusColors[hoveredBooth.status].fill,
                    border: `1px solid ${statusColors[hoveredBooth.status].fill}40`,
                  }}>
                    {statusLabel(hoveredBooth.status)}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isArabicLike ? "المنطقة" : "Zone"}</span>
                    <span className="text-gray-200">{zones.find(z => z.id === hoveredBooth.zone)?.label || hoveredBooth.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isArabicLike ? "النوع" : "Type"}</span>
                    <span className="text-gray-200">{boothTypeLabel(hoveredBooth.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isArabicLike ? "المساحة" : "Area"}</span>
                    <span className="text-gray-200 font-['Inter']">{hoveredBooth.sizeM2}m² ({hoveredBooth.dimensions})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isArabicLike ? "الواجهات" : "Faces"}</span>
                    <span className="text-gray-200 font-['Inter']">{hoveredBooth.faces}</span>
                  </div>
                  {hoveredBooth.featureKeys.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {hoveredBooth.featureKeys.slice(0, 3).map((fk, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[7px] bg-[rgba(197,165,90,0.1)] text-[#C5A55A] border border-[rgba(197,165,90,0.2)]">
                          {t(fk)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-[rgba(255,255,255,0.08)]">
                    <span className="text-gray-400 font-bold">{isArabicLike ? "السعر" : "Price"}</span>
                    <span className="text-[#C5A55A] font-bold font-['Inter']">{hoveredBooth.price.toLocaleString()} SAR</span>
                  </div>
                </div>
                {hoveredBooth.status === "available" && (
                  <div className="mt-2 pt-1.5 border-t border-[rgba(255,255,255,0.06)] text-center">
                    <span className="text-[8px] text-green-400 animate-pulse">{isArabicLike ? "⬅ اضغط للحجز" : "Click to book →"}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini Map */}
      <AnimatePresence>
        {showMiniMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} z-20 glass-card rounded-lg p-1.5 border border-[rgba(197,165,90,0.15)]`}
            style={{ width: 180, height: 95 }}
          >
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="100%">
              <rect width={MAP_W} height={MAP_H} fill="rgba(8,8,16,0.95)" rx="8" />
              {/* Main aisle */}
              <rect x={40} y={400} width={1720} height={90} fill="rgba(197,165,90,0.08)" rx="4" />
              {zones.map(z => (
                <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h} fill={z.color} stroke={z.borderColor} strokeWidth="4" rx="6" />
              ))}
              {filteredBooths.map(b => (
                <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} fill={statusColors[b.status].fill} rx="2" opacity="0.6" />
              ))}
              {/* Viewport indicator */}
              <rect
                x={MAP_W / 2 - (MAP_W / scale / 2) - translate.x / scale}
                y={MAP_H / 2 - (MAP_H / scale / 2) - translate.y / scale}
                width={MAP_W / scale}
                height={MAP_H / scale}
                fill="none"
                stroke="#C5A55A"
                strokeWidth="6"
                rx="4"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
