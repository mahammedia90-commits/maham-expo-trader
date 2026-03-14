/**
 * InteractiveFloorMap — Professional interactive exhibition floor plan
 * Features: Zoom/Pan, hover tooltips, realistic aisles, zone labels, mini-map
 * Designed for real estate-style booth selling on map
 */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Layers, Eye,
  MapPin, Building2, Ruler, Zap, Lock, Star
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

// Professional color scheme
const statusColors: Record<BoothStatus, { fill: string; stroke: string; glow: string }> = {
  available: { fill: "#10B981", stroke: "#34D399", glow: "rgba(16,185,129,0.25)" },
  reserved: { fill: "#F59E0B", stroke: "#FBBF24", glow: "rgba(245,158,11,0.2)" },
  sold: { fill: "#6B7280", stroke: "#9CA3AF", glow: "rgba(107,114,128,0.1)" },
  "my-hold": { fill: "#C5A55A", stroke: "#E8D5A3", glow: "rgba(197,165,90,0.3)" },
};

const typeIcons: Record<BoothType, string> = {
  standard: "S", premium: "P", corner: "C", island: "I", kiosk: "K",
};

// Map dimensions
const MAP_W = 1200;
const MAP_H = 700;

export default function InteractiveFloorMap({
  booths, selectedBooth, onBoothClick, zoneFilter, typeFilter, t, isRTL, isArabicLike,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBooth, setHoveredBooth] = useState<Booth | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Filter booths
  const filteredBooths = useMemo(() => {
    return booths.filter(b => {
      const matchZone = zoneFilter === "all" || b.zone === zoneFilter;
      const matchType = typeFilter === "all" || b.type === typeFilter;
      return matchZone && matchType;
    });
  }, [booths, zoneFilter, typeFilter]);

  // Zoom controls
  const handleZoom = useCallback((delta: number) => {
    setScale(prev => Math.min(3, Math.max(0.4, prev + delta)));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / MAP_W;
    const scaleY = rect.height / MAP_H;
    setScale(Math.min(scaleX, scaleY) * 0.95);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.min(3, Math.max(0.4, prev + delta)));
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
      setScale(Math.min(3, Math.max(0.4, newScale)));
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

  // Zone definitions for realistic layout
  const zones = [
    { id: "A", label: isArabicLike ? "المنطقة الرئيسية" : "Main Zone", x: 50, y: 50, w: 500, h: 270, color: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" },
    { id: "B", label: isArabicLike ? "منطقة التقنية" : "Tech Zone", x: 50, y: 380, w: 500, h: 270, color: "rgba(96,165,250,0.04)", borderColor: "rgba(96,165,250,0.15)" },
    { id: "C", label: isArabicLike ? "منطقة الخدمات" : "Services Zone", x: 620, y: 50, w: 530, h: 270, color: "rgba(251,191,36,0.04)", borderColor: "rgba(251,191,36,0.15)" },
    { id: "D", label: isArabicLike ? "منطقة VIP" : "VIP Zone", x: 620, y: 380, w: 530, h: 270, color: "rgba(197,165,90,0.04)", borderColor: "rgba(197,165,90,0.15)" },
  ];

  // Aisles/corridors
  const aisles = [
    // Horizontal main aisle
    { x: 50, y: 330, w: 1100, h: 40, label: isArabicLike ? "الممر الرئيسي" : "Main Aisle" },
    // Vertical center aisle
    { x: 560, y: 50, w: 50, h: 600, label: isArabicLike ? "الممر المركزي" : "Central Aisle" },
  ];

  // Facilities
  const facilities = [
    { x: 50, y: 665, w: 120, h: 30, label: isArabicLike ? "مدخل رئيسي" : "Main Entrance", icon: "🚪" },
    { x: 480, y: 665, w: 120, h: 30, label: isArabicLike ? "مدخل VIP" : "VIP Entrance", icon: "⭐" },
    { x: 950, y: 665, w: 120, h: 30, label: isArabicLike ? "مخرج طوارئ" : "Emergency Exit", icon: "🚨" },
    { x: 1080, y: 50, w: 70, h: 30, label: isArabicLike ? "دورات مياه" : "WC", icon: "🚻" },
    { x: 1080, y: 320, w: 70, h: 30, label: isArabicLike ? "كافيتريا" : "Café", icon: "☕" },
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
      {/* Zoom Controls */}
      <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-20 flex flex-col gap-1.5`}>
        <button onClick={() => handleZoom(0.2)} className="glass-card w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors" title="Zoom In">
          <ZoomIn size={16} className="t-secondary" />
        </button>
        <button onClick={() => handleZoom(-0.2)} className="glass-card w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--glass-bg)] transition-colors" title="Zoom Out">
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
      <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-20`}>
        <div className="glass-card rounded-xl p-3 space-y-2">
          <p className="text-[9px] font-bold t-secondary mb-1">{isArabicLike ? "دليل الخريطة" : "Map Legend"}</p>
          {(["available", "reserved", "sold", "my-hold"] as BoothStatus[]).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: statusColors[s].fill, border: `1px solid ${statusColors[s].stroke}` }} />
              <span className="text-[9px] t-tertiary">{statusLabel(s)}</span>
            </div>
          ))}
          <div className="border-t border-[var(--glass-border)] pt-1.5 mt-1.5">
            {(["standard", "premium", "corner", "island"] as BoothType[]).map(tp => (
              <div key={tp} className="flex items-center gap-2">
                <span className="w-4 text-center text-[8px] font-bold text-[#C5A55A] font-['Inter']">{typeIcons[tp]}</span>
                <span className="text-[9px] t-tertiary">{boothTypeLabel(tp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div
        ref={containerRef}
        className="glass-card rounded-2xl overflow-hidden relative"
        style={{ height: "min(70vh, 550px)", cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
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
          {/* Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A55A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <rect width={MAP_W} height={MAP_H} fill="rgba(8,8,16,0.95)" rx="16" />
          <rect width={MAP_W} height={MAP_H} fill="url(#grid)" rx="16" />

          {/* Outer border */}
          <rect x="5" y="5" width={MAP_W - 10} height={MAP_H - 10} fill="none" stroke="rgba(197,165,90,0.1)" strokeWidth="1" rx="14" strokeDasharray="8 4" />

          {/* Zones */}
          {zones.map(zone => (
            <g key={zone.id}>
              <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill={zone.color} stroke={zone.borderColor} strokeWidth="1" rx="8" strokeDasharray="6 3" />
              <text x={zone.x + zone.w / 2} y={zone.y + 18} fill={zone.borderColor} fontSize="11" textAnchor="middle" fontFamily="Inter" fontWeight="600" opacity="0.7">
                {zone.label}
              </text>
              <text x={zone.x + zone.w / 2} y={zone.y + 32} fill={zone.borderColor} fontSize="9" textAnchor="middle" fontFamily="Inter" opacity="0.4">
                Zone {zone.id}
              </text>
            </g>
          ))}

          {/* Aisles */}
          {aisles.map((aisle, i) => (
            <g key={i}>
              <rect x={aisle.x} y={aisle.y} width={aisle.w} height={aisle.h} fill="rgba(197,165,90,0.03)" stroke="rgba(197,165,90,0.08)" strokeWidth="1" rx="4" strokeDasharray="4 2" />
              <text x={aisle.x + aisle.w / 2} y={aisle.y + aisle.h / 2 + 4} fill="rgba(197,165,90,0.25)" fontSize="9" textAnchor="middle" fontFamily="Inter">
                {aisle.label}
              </text>
            </g>
          ))}

          {/* Facilities */}
          {facilities.map((f, i) => (
            <g key={i}>
              <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="rgba(100,100,120,0.08)" stroke="rgba(100,100,120,0.15)" strokeWidth="1" rx="6" />
              <text x={f.x + 14} y={f.y + 20} fontSize="12">{f.icon}</text>
              <text x={f.x + 30} y={f.y + 20} fill="rgba(160,160,180,0.5)" fontSize="8" fontFamily="Inter">{f.label}</text>
            </g>
          ))}

          {/* Booths */}
          {filteredBooths.map((booth) => {
            const colors = statusColors[booth.status];
            const isSelected = selectedBooth?.id === booth.id;
            const isHovered = hoveredBooth?.id === booth.id;
            const isAvailable = booth.status === "available";
            const isMyHold = booth.status === "my-hold";

            return (
              <g
                key={booth.id}
                className="booth-rect"
                onClick={(e) => { e.stopPropagation(); onBoothClick(booth); }}
                onMouseEnter={(e) => handleBoothHover(booth, e)}
                onMouseLeave={() => setHoveredBooth(null)}
                style={{ cursor: booth.status === "sold" ? "not-allowed" : "pointer" }}
              >
                {/* Glow effect for selected/hovered */}
                {(isSelected || isHovered) && (
                  <rect
                    x={booth.x - 3}
                    y={booth.y - 3}
                    width={booth.w + 6}
                    height={booth.h + 6}
                    fill="none"
                    stroke={isSelected ? "#C5A55A" : colors.stroke}
                    strokeWidth="2"
                    rx="6"
                    opacity="0.6"
                    filter="url(#glow)"
                  />
                )}

                {/* Booth rectangle */}
                <rect
                  x={booth.x}
                  y={booth.y}
                  width={booth.w}
                  height={booth.h}
                  fill={isSelected ? "rgba(197,165,90,0.25)" : `${colors.fill}${booth.status === "sold" ? "15" : "25"}`}
                  stroke={isSelected ? "#C5A55A" : colors.stroke}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                  rx="5"
                  opacity={booth.status === "sold" ? 0.4 : 1}
                />

                {/* Type indicator badge */}
                <rect
                  x={booth.x + 2}
                  y={booth.y + 2}
                  width={14}
                  height={12}
                  fill={colors.fill}
                  rx="3"
                  opacity="0.6"
                />
                <text
                  x={booth.x + 9}
                  y={booth.y + 11}
                  fill="white"
                  fontSize="7"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="700"
                >
                  {typeIcons[booth.type]}
                </text>

                {/* Booth code */}
                <text
                  x={booth.x + booth.w / 2}
                  y={booth.y + booth.h / 2 - 3}
                  fill={booth.status === "sold" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)"}
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="Inter"
                  fontWeight="700"
                >
                  {booth.code}
                </text>

                {/* Size */}
                <text
                  x={booth.x + booth.w / 2}
                  y={booth.y + booth.h / 2 + 10}
                  fill={booth.status === "sold" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)"}
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="Inter"
                >
                  {booth.sizeM2}m²
                </text>

                {/* Price tag for available */}
                {isAvailable && booth.h >= 45 && (
                  <text
                    x={booth.x + booth.w / 2}
                    y={booth.y + booth.h - 5}
                    fill="rgba(16,185,129,0.6)"
                    fontSize="7"
                    textAnchor="middle"
                    fontFamily="Inter"
                    fontWeight="600"
                  >
                    {(booth.price / 1000).toFixed(0)}K
                  </text>
                )}

                {/* Lock icon for my-hold */}
                {isMyHold && (
                  <text
                    x={booth.x + booth.w - 12}
                    y={booth.y + 12}
                    fontSize="10"
                    fill="#C5A55A"
                  >
                    🔒
                  </text>
                )}

                {/* Star for premium */}
                {booth.type === "premium" && isAvailable && (
                  <text
                    x={booth.x + booth.w - 12}
                    y={booth.y + 12}
                    fontSize="8"
                    fill="#FBBF24"
                  >
                    ★
                  </text>
                )}
              </g>
            );
          })}

          {/* North arrow / compass */}
          <g transform="translate(1150, 30)">
            <circle cx="0" cy="0" r="18" fill="rgba(197,165,90,0.05)" stroke="rgba(197,165,90,0.15)" strokeWidth="1" />
            <text x="0" y="-5" fill="rgba(197,165,90,0.5)" fontSize="8" textAnchor="middle" fontFamily="Inter" fontWeight="700">N</text>
            <path d="M0,-12 L3,-4 L-3,-4 Z" fill="rgba(197,165,90,0.4)" />
            <text x="0" y="12" fill="rgba(197,165,90,0.3)" fontSize="6" textAnchor="middle" fontFamily="Inter">S</text>
          </g>

          {/* Scale bar */}
          <g transform="translate(50, 685)">
            <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(197,165,90,0.3)" strokeWidth="1" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(197,165,90,0.3)" strokeWidth="1" />
            <line x1="100" y1="-3" x2="100" y2="3" stroke="rgba(197,165,90,0.3)" strokeWidth="1" />
            <text x="50" y="-5" fill="rgba(197,165,90,0.3)" fontSize="7" textAnchor="middle" fontFamily="Inter">10m</text>
          </g>
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
                left: Math.min(tooltipPos.x, (containerRef.current?.clientWidth || 300) - 200),
                top: Math.max(tooltipPos.y - 120, 10),
              }}
            >
              <div className="glass-card rounded-xl p-3 shadow-2xl border border-[rgba(197,165,90,0.2)]" style={{ minWidth: 180, backgroundColor: "rgba(15,15,25,0.97)" }}>
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
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="t-tertiary">{isArabicLike ? "النوع" : "Type"}</span>
                    <span className="t-secondary">{boothTypeLabel(hoveredBooth.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="t-tertiary">{isArabicLike ? "المساحة" : "Area"}</span>
                    <span className="t-secondary font-['Inter']">{hoveredBooth.sizeM2}m² ({hoveredBooth.dimensions})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="t-tertiary">{isArabicLike ? "الواجهات" : "Faces"}</span>
                    <span className="t-secondary font-['Inter']">{hoveredBooth.faces}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[var(--glass-border)]">
                    <span className="t-tertiary font-bold">{isArabicLike ? "السعر" : "Price"}</span>
                    <span className="text-[#C5A55A] font-bold font-['Inter']">{hoveredBooth.price.toLocaleString()} SAR</span>
                  </div>
                </div>
                {hoveredBooth.status === "available" && (
                  <div className="mt-2 pt-1.5 border-t border-[var(--glass-border)] text-center">
                    <span className="text-[8px] text-green-400">{isArabicLike ? "اضغط للحجز" : "Click to book"}</span>
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
            style={{ width: 140, height: 85 }}
          >
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="100%">
              <rect width={MAP_W} height={MAP_H} fill="rgba(8,8,16,0.9)" rx="8" />
              {zones.map(z => (
                <rect key={z.id} x={z.x} y={z.y} width={z.w} height={z.h} fill={z.color} stroke={z.borderColor} strokeWidth="3" rx="4" />
              ))}
              {filteredBooths.map(b => (
                <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} fill={statusColors[b.status].fill} rx="2" opacity="0.7" />
              ))}
              {/* Viewport indicator */}
              <rect
                x={MAP_W / 2 - (MAP_W / scale / 2) - translate.x / scale}
                y={MAP_H / 2 - (MAP_H / scale / 2) - translate.y / scale}
                width={MAP_W / scale}
                height={MAP_H / scale}
                fill="none"
                stroke="#C5A55A"
                strokeWidth="4"
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
