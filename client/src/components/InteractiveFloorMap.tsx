/**
 * InteractiveFloorMap — Premium Exhibition Floor Plan
 * Clean, realistic, easy-to-use interactive map with beautiful design
 * Features: Smooth zoom/pan, hover tooltips, zone navigation, mini-map
 * Designed for "On His Steps" (على خطاه) event with 8 real zones
 */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Layers,
  Search, MapPin
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

// Elegant color scheme for booth statuses
const statusColors: Record<BoothStatus, { fill: string; stroke: string; glow: string; text: string; bg: string }> = {
  available: { fill: "#22C55E", stroke: "#4ADE80", glow: "rgba(34,197,94,0.35)", text: "#DCFCE7", bg: "rgba(34,197,94,0.12)" },
  reserved: { fill: "#EAB308", stroke: "#FACC15", glow: "rgba(234,179,8,0.3)", text: "#FEF9C3", bg: "rgba(234,179,8,0.1)" },
  sold: { fill: "#6B7280", stroke: "#9CA3AF", glow: "rgba(107,114,128,0.1)", text: "#E5E7EB", bg: "rgba(107,114,128,0.06)" },
  "my-hold": { fill: "#C5A55A", stroke: "#E8D5A3", glow: "rgba(197,165,90,0.4)", text: "#FEF9C3", bg: "rgba(197,165,90,0.15)" },
};

const typeIcons: Record<BoothType, string> = {
  standard: "S", premium: "P", corner: "C", island: "I", kiosk: "K",
};

// Map dimensions
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

  // 8 Zone definitions — realistic master plan layout
  const zones = [
    // Top row
    { id: "A", label: isArabicLike ? "غار ثور" : "Ghar Thawr", labelEn: "Zone A", x: 40, y: 40, w: 390, h: 350, color: "#EF4444", colorBg: "rgba(239,68,68,0.03)", borderColor: "rgba(239,68,68,0.12)" },
    { id: "B", label: isArabicLike ? "الجحفة" : "Al-Juhfah", labelEn: "Zone B", x: 470, y: 40, w: 390, h: 350, color: "#3B82F6", colorBg: "rgba(59,130,246,0.03)", borderColor: "rgba(59,130,246,0.12)" },
    { id: "C", label: isArabicLike ? "الريم" : "Al-Reem", labelEn: "Zone C", x: 900, y: 40, w: 390, h: 350, color: "#10B981", colorBg: "rgba(16,185,129,0.03)", borderColor: "rgba(16,185,129,0.12)" },
    { id: "D", label: isArabicLike ? "العرج" : "Al-Arj", labelEn: "Zone D", x: 1330, y: 40, w: 430, h: 350, color: "#A855F7", colorBg: "rgba(168,85,247,0.03)", borderColor: "rgba(168,85,247,0.12)" },
    // Bottom row
    { id: "E", label: isArabicLike ? "القاهة" : "Al-Qahah", labelEn: "Zone E", x: 40, y: 500, w: 390, h: 350, color: "#F59E0B", colorBg: "rgba(245,158,11,0.03)", borderColor: "rgba(245,158,11,0.12)" },
    { id: "F", label: isArabicLike ? "الروحاء" : "Al-Rawha", labelEn: "Zone F", x: 470, y: 500, w: 390, h: 350, color: "#EC4899", colorBg: "rgba(236,72,153,0.03)", borderColor: "rgba(236,72,153,0.12)" },
    { id: "G", label: isArabicLike ? "ذو الحليفة" : "Dhul Hulayfah", labelEn: "Zone G", x: 900, y: 500, w: 390, h: 350, color: "#14B8A6", colorBg: "rgba(20,184,166,0.03)", borderColor: "rgba(20,184,166,0.12)" },
    { id: "H", label: isArabicLike ? "المدينة المنورة" : "Al-Madinah", labelEn: "Zone H", x: 1330, y: 500, w: 430, h: 350, color: "#C5A55A", colorBg: "rgba(197,165,90,0.03)", borderColor: "rgba(197,165,90,0.12)" },
  ];

  // Main aisles/corridors
  const aisles = [
    { x: 40, y: 400, w: 1720, h: 90, label: isArabicLike ? "الممر الرئيسي — طريق الهجرة" : "Main Boulevard — Hijrah Path", isMain: true },
    { x: 435, y: 40, w: 30, h: 350, label: "", isMain: false },
    { x: 865, y: 40, w: 30, h: 350, label: "", isMain: false },
    { x: 1295, y: 40, w: 30, h: 350, label: "", isMain: false },
    { x: 435, y: 500, w: 30, h: 350, label: "", isMain: false },
    { x: 865, y: 500, w: 30, h: 350, label: "", isMain: false },
    { x: 1295, y: 500, w: 30, h: 350, label: "", isMain: false },
  ];

  // Facilities
  const facilities = [
    { x: 40, y: 860, w: 150, h: 30, label: isArabicLike ? "🚪 المدخل الرئيسي" : "🚪 Main Entrance", type: "entrance" },
    { x: 250, y: 860, w: 130, h: 30, label: isArabicLike ? "🎫 التسجيل" : "🎫 Registration", type: "registration" },
    { x: 700, y: 860, w: 130, h: 30, label: isArabicLike ? "⭐ مدخل VIP" : "⭐ VIP Entrance", type: "vip" },
    { x: 1100, y: 860, w: 130, h: 30, label: isArabicLike ? "🚛 بوابة الخدمات" : "🚛 Service Gate", type: "service" },
    { x: 1600, y: 860, w: 150, h: 30, label: isArabicLike ? "🚨 مخرج طوارئ" : "🚨 Emergency Exit", type: "emergency" },
    { x: 500, y: 5, w: 120, h: 28, label: isArabicLike ? "☕ كافيتريا" : "☕ Café", type: "cafe" },
    { x: 900, y: 5, w: 120, h: 28, label: isArabicLike ? "🏥 إسعافات" : "🏥 First Aid", type: "medical" },
    { x: 1400, y: 5, w: 120, h: 28, label: isArabicLike ? "🕌 مصلى" : "🕌 Prayer Room", type: "prayer" },
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

  // Navigate to zone
  const navigateToZone = useCallback((zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetScale = 1.2;
    const centerX = zone.x + zone.w / 2;
    const centerY = zone.y + zone.h / 2;
    setScale(targetScale);
    setTranslate({
      x: rect.width / 2 - centerX * targetScale,
      y: rect.height / 2 - centerY * targetScale,
    });
    setHighlightedZone(highlightedZone === zoneId ? null : zoneId);
  }, [highlightedZone, zones]);

  return (
    <div className="relative">
      {/* Top Bar: Stats + Search */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
        {/* Status Legend - compact */}
        <div className="flex items-center gap-2 sm:gap-3">
          {(["available", "reserved", "sold", "my-hold"] as BoothStatus[]).map(s => {
            const count = booths.filter(b => b.status === s).length;
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors[s].fill }} />
                <span className="text-[9px] sm:text-[10px] t-muted font-medium">
                  {statusLabel(s)} <span className="font-['Inter'] t-secondary">({count})</span>
                </span>
              </div>
            );
          })}
        </div>
        {/* Search */}
        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ms-auto" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          <Search size={12} className="t-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabicLike ? "بحث عن وحدة..." : "Search unit..."}
            className="bg-transparent text-[10px] t-primary w-20 sm:w-28 outline-none placeholder:t-muted"
          />
        </div>
      </div>

      {/* Zone Quick Nav — Beautiful Cards */}
      <div className="flex gap-1.5 sm:gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {zones.map(z => {
          const zoneBooths = booths.filter(b => b.zone === z.id);
          const zoneAvailable = zoneBooths.filter(b => b.status === "available").length;
          const isActive = highlightedZone === z.id;
          return (
            <button
              key={z.id}
              onClick={() => navigateToZone(z.id)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all shrink-0"
              style={{
                background: isActive ? `${z.color}15` : "var(--glass-bg)",
                border: `1px solid ${isActive ? `${z.color}40` : "var(--glass-border)"}`,
                color: isActive ? z.color : "var(--text-secondary)",
              }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
              <span className="whitespace-nowrap">{z.label}</span>
              <span className="font-['Inter'] text-[8px] px-1 py-0.5 rounded-full" style={{
                background: zoneAvailable > 0 ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)",
                color: zoneAvailable > 0 ? "#22C55E" : "var(--text-muted)",
              }}>
                {zoneAvailable}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Map Container */}
      <div className="relative">
        {/* Zoom Controls — Floating */}
        <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-20 flex items-center gap-1 rounded-xl p-1`} style={{ background: "rgba(10,10,18,0.85)", backdropFilter: "blur(12px)", border: "1px solid var(--glass-border)" }}>
          <button onClick={() => handleZoom(0.15)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" title="Zoom In">
            <ZoomIn size={14} className="t-secondary" />
          </button>
          <div className="w-px h-5" style={{ background: "var(--glass-border)" }} />
          <button onClick={() => handleZoom(-0.15)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" title="Zoom Out">
            <ZoomOut size={14} className="t-secondary" />
          </button>
          <div className="w-px h-5" style={{ background: "var(--glass-border)" }} />
          <button onClick={handleFitToScreen} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" title="Fit">
            <Maximize2 size={14} className="t-secondary" />
          </button>
          <div className="w-px h-5" style={{ background: "var(--glass-border)" }} />
          <button onClick={handleReset} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" title="Reset">
            <RotateCcw size={14} className="t-secondary" />
          </button>
          <div className="w-px h-5" style={{ background: "var(--glass-border)" }} />
          <button onClick={() => setShowMiniMap(!showMiniMap)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showMiniMap ? 'bg-[#C5A55A]/15 text-[#C5A55A]' : 'hover:bg-white/5 t-secondary'}`} title="Mini Map">
            <Layers size={14} />
          </button>
          <div className="px-1.5">
            <span className="text-[9px] t-muted font-['Inter'] tabular-nums">{Math.round(scale * 100)}%</span>
          </div>
        </div>

        {/* Map Canvas */}
        <div
          ref={containerRef}
          className="rounded-2xl overflow-hidden relative"
          style={{
            height: "min(75vh, 620px)",
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
            background: "linear-gradient(145deg, rgba(8,8,18,0.98), rgba(12,12,24,0.98))",
            border: "1px solid var(--glass-border)",
          }}
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
              transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Definitions */}
            <defs>
              <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="0.5" fill="rgba(197,165,90,0.06)" />
              </pattern>
              <filter id="booth-glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="soft-shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" />
              </filter>
              <linearGradient id="aisleGradV" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(197,165,90,0.04)" />
                <stop offset="50%" stopColor="rgba(197,165,90,0.02)" />
                <stop offset="100%" stopColor="rgba(197,165,90,0.04)" />
              </linearGradient>
              <linearGradient id="aisleGradH" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(197,165,90,0.04)" />
                <stop offset="50%" stopColor="rgba(197,165,90,0.02)" />
                <stop offset="100%" stopColor="rgba(197,165,90,0.04)" />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect width={MAP_W} height={MAP_H} fill="rgba(8,8,18,1)" rx="16" />
            <rect width={MAP_W} height={MAP_H} fill="url(#grid-dots)" rx="16" />

            {/* Outer border */}
            <rect x="3" y="3" width={MAP_W - 6} height={MAP_H - 6} fill="none" stroke="rgba(197,165,90,0.08)" strokeWidth="1" rx="14" />

            {/* Watermark title */}
            <text x={MAP_W / 2} y={MAP_H / 2 + 5} fill="rgba(197,165,90,0.035)" fontSize="56" textAnchor="middle" fontFamily="Inter" fontWeight="900" letterSpacing="6">
              {isArabicLike ? "على خطاه" : "ON HIS STEPS"}
            </text>

            {/* Aisles */}
            {aisles.map((aisle, i) => (
              <g key={`aisle-${i}`}>
                <rect
                  x={aisle.x} y={aisle.y}
                  width={aisle.w} height={aisle.h}
                  fill={aisle.isMain ? "url(#aisleGradH)" : "url(#aisleGradV)"}
                  stroke="rgba(197,165,90,0.06)"
                  strokeWidth={aisle.isMain ? 1 : 0.3}
                  rx={aisle.isMain ? 6 : 3}
                />
                {aisle.label && (
                  <>
                    <line
                      x1={aisle.x + 30} y1={aisle.y + aisle.h / 2}
                      x2={aisle.x + aisle.w - 30} y2={aisle.y + aisle.h / 2}
                      stroke="rgba(197,165,90,0.08)" strokeWidth="0.8" strokeDasharray="10 5"
                    />
                    <text x={aisle.x + aisle.w / 2} y={aisle.y + aisle.h / 2 + 4} fill="rgba(197,165,90,0.15)" fontSize="9" textAnchor="middle" fontFamily="Inter" fontWeight="500">
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
                <g key={zone.id} opacity={isHighlighted ? 1 : 0.2} style={{ transition: "opacity 0.3s ease" }}>
                  {/* Zone background */}
                  <rect
                    x={zone.x} y={zone.y}
                    width={zone.w} height={zone.h}
                    fill={zone.colorBg}
                    stroke={zone.borderColor}
                    strokeWidth="1"
                    rx="8"
                  />
                  {/* Zone label - pill style */}
                  <rect
                    x={zone.x + zone.w / 2 - 65} y={zone.y + 6}
                    width={130} height={24}
                    fill="rgba(0,0,0,0.5)"
                    rx="12"
                  />
                  <text
                    x={zone.x + zone.w / 2} y={zone.y + 18}
                    fill={zone.color}
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="Inter"
                    fontWeight="600"
                  >
                    {zone.label}
                  </text>
                  <text
                    x={zone.x + zone.w / 2} y={zone.y + 28}
                    fill="rgba(255,255,255,0.2)"
                    fontSize="6.5"
                    textAnchor="middle"
                    fontFamily="Inter"
                  >
                    {zone.labelEn} • {zoneAvailable} {isArabicLike ? "متاح" : "avail."}
                  </text>
                </g>
              );
            })}

            {/* Facilities */}
            {facilities.map((f, i) => (
              <g key={`fac-${i}`}>
                <rect
                  x={f.x} y={f.y}
                  width={f.w} height={f.h}
                  fill={f.type === "emergency" ? "rgba(239,68,68,0.06)" : f.type === "stage" ? "rgba(197,165,90,0.06)" : "rgba(100,100,120,0.04)"}
                  stroke={f.type === "emergency" ? "rgba(239,68,68,0.15)" : f.type === "stage" ? "rgba(197,165,90,0.15)" : "rgba(100,100,120,0.08)"}
                  strokeWidth="0.8"
                  rx="5"
                />
                <text
                  x={f.x + f.w / 2} y={f.y + f.h / 2 + 3.5}
                  fill={f.type === "emergency" ? "rgba(239,68,68,0.5)" : f.type === "stage" ? "rgba(197,165,90,0.5)" : "rgba(160,160,180,0.4)"}
                  fontSize="8"
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
              const isSold = booth.status === "sold";
              const zoneHighlighted = !highlightedZone || booth.zone === highlightedZone;

              return (
                <g
                  key={booth.id}
                  className="booth-rect"
                  onClick={(e) => { e.stopPropagation(); onBoothClick(booth); }}
                  onMouseEnter={(e) => handleBoothHover(booth, e)}
                  onMouseLeave={() => setHoveredBooth(null)}
                  style={{ cursor: isSold ? "not-allowed" : "pointer" }}
                  opacity={zoneHighlighted ? 1 : 0.15}
                >
                  {/* Selection/Hover glow */}
                  {(isSelected || isHovered) && (
                    <rect
                      x={booth.x - 2} y={booth.y - 2}
                      width={booth.w + 4} height={booth.h + 4}
                      fill="none"
                      stroke={isSelected ? "#C5A55A" : colors.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      rx="6"
                      opacity="0.8"
                      filter="url(#booth-glow)"
                    />
                  )}

                  {/* Booth body */}
                  <rect
                    x={booth.x} y={booth.y}
                    width={booth.w} height={booth.h}
                    fill={isSelected ? "rgba(197,165,90,0.25)" : colors.bg}
                    stroke={isSelected ? "#C5A55A" : `${colors.fill}${isSold ? "30" : "50"}`}
                    strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.6}
                    rx="4"
                    opacity={isSold ? 0.4 : 1}
                  />

                  {/* Type badge */}
                  <rect
                    x={booth.x + 2} y={booth.y + 2}
                    width={13} height={11}
                    fill={`${colors.fill}${isSold ? "20" : "40"}`} rx="2.5"
                  />
                  <text
                    x={booth.x + 8.5} y={booth.y + 10}
                    fill={isSold ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)"} fontSize="6.5" textAnchor="middle" fontFamily="Inter" fontWeight="700"
                  >
                    {typeIcons[booth.type]}
                  </text>

                  {/* Booth code */}
                  <text
                    x={booth.x + booth.w / 2} y={booth.y + booth.h / 2 - 2}
                    fill={isSold ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.85)"}
                    fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="700"
                  >
                    {booth.code}
                  </text>

                  {/* Size */}
                  <text
                    x={booth.x + booth.w / 2} y={booth.y + booth.h / 2 + 9}
                    fill={isSold ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.35)"}
                    fontSize="7" textAnchor="middle" fontFamily="Inter"
                  >
                    {booth.sizeM2}m²
                  </text>

                  {/* Price for available */}
                  {isAvailable && booth.h >= 45 && (
                    <text
                      x={booth.x + booth.w / 2} y={booth.y + booth.h - 4}
                      fill="rgba(34,197,94,0.55)" fontSize="6.5" textAnchor="middle" fontFamily="Inter" fontWeight="600"
                    >
                      {(booth.price / 1000).toFixed(0)}K
                    </text>
                  )}

                  {/* Lock for my-hold */}
                  {isMyHold && (
                    <text x={booth.x + booth.w - 11} y={booth.y + 11} fontSize="8" fill="#C5A55A">🔒</text>
                  )}

                  {/* Star for premium */}
                  {booth.type === "premium" && isAvailable && (
                    <text x={booth.x + booth.w - 10} y={booth.y + 11} fontSize="7" fill="#FBBF24">★</text>
                  )}
                </g>
              );
            })}

            {/* Compass */}
            <g transform={`translate(${MAP_W - 35}, 30)`}>
              <circle cx="0" cy="0" r="16" fill="rgba(0,0,0,0.4)" stroke="rgba(197,165,90,0.12)" strokeWidth="0.8" />
              <text x="0" y="-5" fill="rgba(197,165,90,0.5)" fontSize="8" textAnchor="middle" fontFamily="Inter" fontWeight="700">N</text>
              <path d="M0,-11 L3,-4 L-3,-4 Z" fill="rgba(197,165,90,0.4)" />
            </g>

            {/* Scale bar */}
            <g transform={`translate(${MAP_W - 160}, ${MAP_H - 18})`}>
              <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(197,165,90,0.25)" strokeWidth="1" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(197,165,90,0.25)" strokeWidth="0.8" />
              <line x1="100" y1="-3" x2="100" y2="3" stroke="rgba(197,165,90,0.25)" strokeWidth="0.8" />
              <text x="50" y="-6" fill="rgba(197,165,90,0.3)" fontSize="7" textAnchor="middle" fontFamily="Inter" fontWeight="500">20m</text>
            </g>

            {/* Footer watermark */}
            <text x={MAP_W / 2} y={MAP_H - 8} fill="rgba(197,165,90,0.06)" fontSize="8" textAnchor="middle" fontFamily="Inter" fontWeight="400">
              Maham Expo — Master Plan v2.0
            </text>
          </svg>

          {/* Hover Tooltip */}
          <AnimatePresence>
            {hoveredBooth && !isDragging && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute z-30 pointer-events-none"
                style={{
                  left: Math.min(tooltipPos.x, (containerRef.current?.clientWidth || 300) - 230),
                  top: Math.max(tooltipPos.y - 150, 10),
                }}
              >
                <div className="rounded-xl p-3.5 shadow-2xl" style={{
                  minWidth: 210,
                  backgroundColor: "rgba(10,10,20,0.97)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(197,165,90,0.2)",
                }}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-bold text-[#E8D5A3] font-['Inter']">{hoveredBooth.code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold" style={{
                      backgroundColor: statusColors[hoveredBooth.status].bg,
                      color: statusColors[hoveredBooth.status].fill,
                    }}>
                      {statusLabel(hoveredBooth.status)}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{isArabicLike ? "المنطقة" : "Zone"}</span>
                      <span className="text-gray-300">{zones.find(z => z.id === hoveredBooth.zone)?.label || hoveredBooth.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{isArabicLike ? "النوع" : "Type"}</span>
                      <span className="text-gray-300">{boothTypeLabel(hoveredBooth.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{isArabicLike ? "المساحة" : "Area"}</span>
                      <span className="text-gray-300 font-['Inter']">{hoveredBooth.sizeM2}m² ({hoveredBooth.dimensions})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{isArabicLike ? "الواجهات" : "Faces"}</span>
                      <span className="text-gray-300 font-['Inter']">{hoveredBooth.faces}</span>
                    </div>
                    {hoveredBooth.featureKeys.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {hoveredBooth.featureKeys.slice(0, 3).map((fk, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[7px]" style={{
                            background: "rgba(197,165,90,0.08)",
                            color: "#C5A55A",
                            border: "1px solid rgba(197,165,90,0.15)",
                          }}>
                            {t(fk)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-white/5">
                      <span className="text-gray-500 font-bold">{isArabicLike ? "السعر" : "Price"}</span>
                      <span className="text-[#C5A55A] font-bold font-['Inter']">{hoveredBooth.price.toLocaleString()} SAR</span>
                    </div>
                  </div>
                  {hoveredBooth.status === "available" && (
                    <div className="mt-2 pt-1.5 border-t border-white/5 text-center">
                      <span className="text-[8px] text-green-400/80">{isArabicLike ? "⬅ اضغط للحجز" : "Click to book →"}</span>
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
              className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} z-20 rounded-lg p-1.5`}
              style={{
                width: 170, height: 90,
                background: "rgba(10,10,20,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(197,165,90,0.12)",
              }}
            >
              <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="100%">
                <rect width={MAP_W} height={MAP_H} fill="rgba(8,8,16,0.95)" rx="8" />
                <rect x={40} y={400} width={1720} height={90} fill="rgba(197,165,90,0.06)" rx="4" />
                {zones.map(z => (
                  <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h} fill={z.colorBg} stroke={z.borderColor} strokeWidth="3" rx="4" />
                ))}
                {filteredBooths.map(b => (
                  <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} fill={statusColors[b.status].fill} rx="1.5" opacity="0.5" />
                ))}
                {/* Viewport */}
                <rect
                  x={MAP_W / 2 - (MAP_W / scale / 2) - translate.x / scale}
                  y={MAP_H / 2 - (MAP_H / scale / 2) - translate.y / scale}
                  width={MAP_W / scale}
                  height={MAP_H / scale}
                  fill="none"
                  stroke="#C5A55A"
                  strokeWidth="5"
                  rx="3"
                  opacity="0.4"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile hint */}
      <p className="text-[8px] t-muted text-center mt-2 sm:hidden">
        <MapPin size={8} className="inline" /> {isArabicLike ? "اسحب للتنقل • قارب بين إصبعين للتكبير" : "Drag to pan • Pinch to zoom"}
      </p>
    </div>
  );
}
