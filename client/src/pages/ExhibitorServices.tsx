/**
 * ExhibitorServices — Unified Trader Services & Operations Hub
 * Merged: Operations + ExhibitorServices + Permits/Badges/Access
 * Design: Obsidian Glass with gold accents, tabbed interface
 * Categories: 14 categories covering everything a trader needs
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paintbrush, Zap, Truck, Megaphone, Coffee, Camera, Languages,
  Shield, Warehouse, Printer, Search, ShoppingCart, Plus, Minus,
  CheckCircle2, Star, Clock, Phone, Mail, ArrowRight, Package,
  Wifi, Monitor, Users, Sparkles, FileText, CreditCard, X,
  ChevronDown, ChevronUp, Building2, Globe, Headphones, Mic2,
  Lightbulb, Wrench, Flower2, BadgeCheck, Sofa, Tv,
  KeyRound, Car, BadgeInfo, DoorOpen, ClipboardList, ShieldCheck,
  Ticket, UserCheck, AlertTriangle, CircleDot, QrCode, IdCard,
  Fingerprint, ScanLine, Settings2, Palette, Filter
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Service {
  id: string;
  icon: any;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  unit: string;
  unitAr: string;
  popular?: boolean;
  rating?: number;
  deliveryDays?: number;
}

interface ServiceCategory {
  id: string;
  icon: any;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  color: string;
  tab: "services" | "operations" | "permits";
  services: Service[];
}

const serviceCategories: ServiceCategory[] = [
  // ═══════════════════════════════════════════
  // TAB: خدمات التاجر (Trader Services)
  // ═══════════════════════════════════════════
  {
    id: "design",
    icon: Paintbrush,
    nameAr: "تصميم وبناء البوث",
    nameEn: "Booth Design & Build",
    descAr: "تصميم وتنفيذ وتجهيز البوث بالكامل",
    descEn: "Complete booth design, construction and setup",
    color: "#C5A55A",
    tab: "services",
    services: [
      { id: "d1", icon: Paintbrush, nameAr: "تصميم ثلاثي الأبعاد", nameEn: "3D Design", descAr: "تصميم ثلاثي الأبعاد احترافي للبوث مع عرض واقعي", descEn: "Professional 3D booth design with realistic rendering", price: 3500, unit: "per design", unitAr: "لكل تصميم", popular: true, rating: 4.9, deliveryDays: 3 },
      { id: "d2", icon: Wrench, nameAr: "بناء بوث مخصص", nameEn: "Custom Build", descAr: "بناء بوث مخصص حسب التصميم المعتمد بمواد عالية الجودة", descEn: "Custom booth construction with premium materials", price: 15000, unit: "per booth", unitAr: "لكل بوث", rating: 4.8, deliveryDays: 7 },
      { id: "d3", icon: Sofa, nameAr: "أثاث وتجهيزات", nameEn: "Furniture & Fixtures", descAr: "طاولات، كراسي، أرفف عرض، خزائن زجاجية", descEn: "Tables, chairs, display shelves, glass cabinets", price: 2500, unit: "per package", unitAr: "لكل باقة", rating: 4.7, deliveryDays: 2 },
      { id: "d4", icon: Flower2, nameAr: "ديكور وتنسيق", nameEn: "Decoration & Styling", descAr: "تنسيق زهور، إضاءة ديكورية، سجاد وأرضيات", descEn: "Floral arrangements, decorative lighting, carpets & flooring", price: 4000, unit: "per booth", unitAr: "لكل بوث", rating: 4.6, deliveryDays: 2 },
      { id: "d5", icon: Lightbulb, nameAr: "إضاءة احترافية", nameEn: "Professional Lighting", descAr: "إضاءة LED، سبوت لايت، إضاءة خلفية للعلامة التجارية", descEn: "LED lighting, spotlights, brand backlit signage", price: 3000, unit: "per booth", unitAr: "لكل بوث", popular: true, rating: 4.8, deliveryDays: 2 },
    ],
  },
  {
    id: "marketing",
    icon: Megaphone,
    nameAr: "التسويق والإعلان",
    nameEn: "Marketing & Advertising",
    descAr: "حملات تسويقية وإعلانات داخل المعرض",
    descEn: "Marketing campaigns and in-expo advertising",
    color: "#EC4899",
    tab: "services",
    services: [
      { id: "m1", icon: Megaphone, nameAr: "إعلان في كتيب المعرض", nameEn: "Expo Catalog Ad", descAr: "صفحة إعلانية كاملة في كتيب المعرض الرسمي", descEn: "Full page ad in official expo catalog", price: 5000, unit: "per page", unitAr: "لكل صفحة", rating: 4.5, deliveryDays: 5 },
      { id: "m2", icon: Monitor, nameAr: "إعلان على شاشات المعرض", nameEn: "Digital Signage Ad", descAr: "عرض إعلانك على الشاشات الرقمية في المعرض", descEn: "Display your ad on expo digital screens", price: 8000, unit: "per event", unitAr: "لكل فعالية", popular: true, rating: 4.7, deliveryDays: 3 },
      { id: "m3", icon: Globe, nameAr: "تسويق رقمي", nameEn: "Digital Marketing", descAr: "حملة إعلانية على وسائل التواصل + SEO", descEn: "Social media campaign + SEO optimization", price: 6000, unit: "per campaign", unitAr: "لكل حملة", rating: 4.6, deliveryDays: 5 },
      { id: "m4", icon: Sparkles, nameAr: "هدايا ترويجية", nameEn: "Promotional Gifts", descAr: "تصميم وإنتاج هدايا ترويجية بشعارك", descEn: "Design and produce branded promotional gifts", price: 3000, unit: "per 500 pcs", unitAr: "لكل 500 قطعة", rating: 4.4, deliveryDays: 7 },
    ],
  },
  {
    id: "hospitality",
    icon: Coffee,
    nameAr: "الضيافة والكاترنج",
    nameEn: "Hospitality & Catering",
    descAr: "خدمات ضيافة وطعام وشراب للزوار",
    descEn: "Hospitality, food and beverage for visitors",
    color: "#10B981",
    tab: "services",
    services: [
      { id: "h1", icon: Coffee, nameAr: "ركن قهوة وشاي", nameEn: "Coffee & Tea Corner", descAr: "ماكينة قهوة احترافية + شاي + مياه طوال الفعالية", descEn: "Professional coffee machine + tea + water throughout event", price: 4500, unit: "per event", unitAr: "لكل فعالية", popular: true, rating: 4.9, deliveryDays: 1 },
      { id: "h2", icon: Coffee, nameAr: "بوفيه خفيف", nameEn: "Light Buffet", descAr: "بوفيه معجنات وحلويات وعصائر طبيعية", descEn: "Pastries, sweets and fresh juices buffet", price: 3500, unit: "per day", unitAr: "لكل يوم", rating: 4.7, deliveryDays: 1 },
      { id: "h3", icon: Users, nameAr: "طاقم ضيافة", nameEn: "Hospitality Staff", descAr: "مضيفين/مضيفات محترفين لاستقبال الزوار", descEn: "Professional hosts/hostesses for visitor reception", price: 1500, unit: "per person/day", unitAr: "لكل شخص/يوم", rating: 4.8, deliveryDays: 2 },
    ],
  },
  {
    id: "photography",
    icon: Camera,
    nameAr: "التصوير والفيديو",
    nameEn: "Photography & Video",
    descAr: "تصوير فوتوغرافي وفيديو احترافي",
    descEn: "Professional photography and videography",
    color: "#8B5CF6",
    tab: "services",
    services: [
      { id: "p1", icon: Camera, nameAr: "تصوير فوتوغرافي", nameEn: "Photography", descAr: "مصور محترف لتغطية يوم كامل + تحرير", descEn: "Professional photographer for full day + editing", price: 3500, unit: "per day", unitAr: "لكل يوم", popular: true, rating: 4.9, deliveryDays: 3 },
      { id: "p2", icon: Camera, nameAr: "تصوير فيديو", nameEn: "Videography", descAr: "فريق تصوير فيديو + مونتاج احترافي", descEn: "Video crew + professional editing", price: 7000, unit: "per day", unitAr: "لكل يوم", rating: 4.8, deliveryDays: 5 },
      { id: "p3", icon: Camera, nameAr: "بث مباشر", nameEn: "Live Streaming", descAr: "بث مباشر على منصات التواصل الاجتماعي", descEn: "Live streaming on social media platforms", price: 5000, unit: "per day", unitAr: "لكل يوم", rating: 4.6, deliveryDays: 1 },
    ],
  },
  {
    id: "translation",
    icon: Languages,
    nameAr: "الترجمة والمضيفين",
    nameEn: "Translation & Hosts",
    descAr: "خدمات ترجمة فورية ومضيفين متعددي اللغات",
    descEn: "Simultaneous translation and multilingual hosts",
    color: "#06B6D4",
    tab: "services",
    services: [
      { id: "t1", icon: Languages, nameAr: "مترجم فوري", nameEn: "Simultaneous Interpreter", descAr: "مترجم فوري محترف (عربي/إنجليزي/فرنسي/صيني)", descEn: "Professional interpreter (AR/EN/FR/CN)", price: 2500, unit: "per day", unitAr: "لكل يوم", popular: true, rating: 4.8, deliveryDays: 2 },
      { id: "t2", icon: Headphones, nameAr: "أجهزة ترجمة فورية", nameEn: "Translation Equipment", descAr: "سماعات وأجهزة إرسال واستقبال للترجمة الفورية", descEn: "Headsets and transmitters for simultaneous translation", price: 1500, unit: "per 50 sets", unitAr: "لكل 50 طقم", rating: 4.7, deliveryDays: 1 },
      { id: "t3", icon: Mic2, nameAr: "مقدم فعاليات", nameEn: "Event MC", descAr: "مقدم فعاليات محترف ثنائي اللغة", descEn: "Professional bilingual event MC", price: 5000, unit: "per day", unitAr: "لكل يوم", rating: 4.9, deliveryDays: 3 },
    ],
  },
  {
    id: "printing",
    icon: Printer,
    nameAr: "الطباعة والإنتاج",
    nameEn: "Printing & Production",
    descAr: "طباعة وإنتاج جميع المواد الترويجية",
    descEn: "Print and produce all promotional materials",
    color: "#F97316",
    tab: "services",
    services: [
      { id: "pr1", icon: Printer, nameAr: "لوحة خلفية (Backdrop)", nameEn: "Backdrop Banner", descAr: "طباعة لوحة خلفية عالية الجودة بالحجم الكامل", descEn: "Full-size high-quality backdrop printing", price: 2500, unit: "per banner", unitAr: "لكل لوحة", popular: true, rating: 4.8, deliveryDays: 3 },
      { id: "pr2", icon: Printer, nameAr: "رول أب (Roll-up)", nameEn: "Roll-up Banner", descAr: "بانر رول أب 85×200 سم مع حامل", descEn: "85×200cm roll-up banner with stand", price: 350, unit: "per piece", unitAr: "لكل قطعة", rating: 4.7, deliveryDays: 2 },
      { id: "pr3", icon: FileText, nameAr: "بروشورات وكتيبات", nameEn: "Brochures & Catalogs", descAr: "تصميم وطباعة بروشورات وكتيبات احترافية", descEn: "Design and print professional brochures and catalogs", price: 3000, unit: "per 1000 pcs", unitAr: "لكل 1000 قطعة", rating: 4.6, deliveryDays: 5 },
      { id: "pr4", icon: FileText, nameAr: "بطاقات أعمال", nameEn: "Business Cards", descAr: "تصميم وطباعة بطاقات أعمال فاخرة", descEn: "Design and print premium business cards", price: 500, unit: "per 500 pcs", unitAr: "لكل 500 قطعة", rating: 4.8, deliveryDays: 3 },
    ],
  },

  // ═══════════════════════════════════════════
  // TAB: العمليات التشغيلية (Operations)
  // ═══════════════════════════════════════════
  {
    id: "utilities",
    icon: Zap,
    nameAr: "الكهرباء والمرافق",
    nameEn: "Electricity & Utilities",
    descAr: "جميع خدمات البنية التحتية والكهرباء والتكييف",
    descEn: "All infrastructure, power and HVAC services",
    color: "#60A5FA",
    tab: "operations",
    services: [
      { id: "u1", icon: Zap, nameAr: "كهرباء أحادية الطور (13A)", nameEn: "Single Phase Power (13A)", descAr: "توصيل كهرباء أحادي مع لوحة توزيع وقاطع حماية", descEn: "Single phase power with distribution board and circuit breaker", price: 800, unit: "per unit", unitAr: "لكل وحدة", rating: 4.9, deliveryDays: 1 },
      { id: "u2", icon: Zap, nameAr: "كهرباء ثلاثية الأطوار (32A)", nameEn: "Three Phase Power (32A)", descAr: "للمعدات الثقيلة والشاشات الكبيرة — 380V", descEn: "For heavy equipment and large displays — 380V", price: 2500, unit: "per unit", unitAr: "لكل وحدة", rating: 4.8, deliveryDays: 1 },
      { id: "u3", icon: Wifi, nameAr: "إنترنت فائق السرعة", nameEn: "High-Speed Internet", descAr: "إنترنت ألياف بصرية مخصص 100Mbps مع IP ثابت", descEn: "Dedicated fiber optic 100Mbps with static IP", price: 1500, unit: "per event", unitAr: "لكل فعالية", popular: true, rating: 4.7, deliveryDays: 1 },
      { id: "u4", icon: Monitor, nameAr: "شاشة عرض LED 55\"", nameEn: "55\" LED Display", descAr: "شاشة LED عالية الدقة 4K مع حامل أرضي", descEn: "4K HD LED screen with floor stand", price: 3500, unit: "per screen", unitAr: "لكل شاشة", rating: 4.8, deliveryDays: 1 },
      { id: "u5", icon: Tv, nameAr: "نظام صوت احترافي", nameEn: "Professional Sound System", descAr: "مكبرات صوت JBL، ميكروفونات لاسلكية، ميكسر رقمي", descEn: "JBL speakers, wireless mics, digital mixer", price: 4000, unit: "per system", unitAr: "لكل نظام", rating: 4.6, deliveryDays: 1 },
    ],
  },
  {
    id: "logistics",
    icon: Truck,
    nameAr: "اللوجستيات والشحن",
    nameEn: "Logistics & Shipping",
    descAr: "نقل وشحن وتركيب المعدات والمواد",
    descEn: "Transport, shipping and equipment installation",
    color: "#F59E0B",
    tab: "operations",
    services: [
      { id: "l1", icon: Truck, nameAr: "نقل داخلي (الرياض)", nameEn: "Local Transport (Riyadh)", descAr: "نقل المعدات والمواد داخل الرياض مع تأمين شامل", descEn: "Equipment transport within Riyadh with full insurance", price: 1200, unit: "per trip", unitAr: "لكل رحلة", rating: 4.7, deliveryDays: 1 },
      { id: "l2", icon: Package, nameAr: "شحن دولي", nameEn: "International Shipping", descAr: "شحن جوي أو بحري من أي دولة مع تخليص جمركي", descEn: "Air or sea freight from any country with customs clearance", price: 5000, unit: "per shipment", unitAr: "لكل شحنة", rating: 4.5, deliveryDays: 7 },
      { id: "l3", icon: Wrench, nameAr: "تركيب وتفكيك", nameEn: "Setup & Dismantling", descAr: "فريق متخصص لتركيب وتفكيك البوث بالكامل", descEn: "Specialized team for complete booth setup and dismantling", price: 3000, unit: "per booth", unitAr: "لكل بوث", popular: true, rating: 4.8, deliveryDays: 1 },
      { id: "l4", icon: Users, nameAr: "عمال مساعدة", nameEn: "Labor Support", descAr: "عمال لنقل وترتيب المعروضات والبضائع", descEn: "Workers for moving and arranging exhibits and goods", price: 500, unit: "per worker/day", unitAr: "لكل عامل/يوم", rating: 4.6, deliveryDays: 1 },
    ],
  },
  {
    id: "storage",
    icon: Warehouse,
    nameAr: "التخزين والمستودعات",
    nameEn: "Storage & Warehousing",
    descAr: "تخزين آمن ومكيف للمواد والمعدات",
    descEn: "Secure climate-controlled storage for materials",
    color: "#78716C",
    tab: "operations",
    services: [
      { id: "s1", icon: Warehouse, nameAr: "تخزين قبل المعرض", nameEn: "Pre-Event Storage", descAr: "مستودع مكيف لتخزين المواد قبل المعرض مع حراسة 24/7", descEn: "Climate-controlled warehouse with 24/7 security", price: 1500, unit: "per week", unitAr: "لكل أسبوع", rating: 4.6, deliveryDays: 1 },
      { id: "s2", icon: Warehouse, nameAr: "تخزين بعد المعرض", nameEn: "Post-Event Storage", descAr: "تخزين المعدات والمواد بعد انتهاء المعرض", descEn: "Storage for equipment and materials after event", price: 1200, unit: "per week", unitAr: "لكل أسبوع", rating: 4.5, deliveryDays: 1 },
    ],
  },
  {
    id: "cleaning",
    icon: Wrench,
    nameAr: "التنظيف والصيانة",
    nameEn: "Cleaning & Maintenance",
    descAr: "خدمات تنظيف يومية وصيانة فنية",
    descEn: "Daily cleaning and technical maintenance",
    color: "#22D3EE",
    tab: "operations",
    services: [
      { id: "cl1", icon: Wrench, nameAr: "تنظيف يومي للبوث", nameEn: "Daily Booth Cleaning", descAr: "خدمة تنظيف يومية شاملة مع تعقيم ومواد تنظيف", descEn: "Comprehensive daily cleaning with sanitization", price: 350, unit: "per day", unitAr: "لكل يوم", rating: 4.6, deliveryDays: 1 },
      { id: "cl2", icon: Settings2, nameAr: "صيانة فنية طارئة", nameEn: "Emergency Technical Maintenance", descAr: "فني متخصص لإصلاح أي أعطال كهربائية أو ميكانيكية", descEn: "Specialist technician for electrical or mechanical repairs", price: 500, unit: "per visit", unitAr: "لكل زيارة", popular: true, rating: 4.8, deliveryDays: 0 },
    ],
  },
  {
    id: "insurance",
    icon: Shield,
    nameAr: "التأمين والسلامة",
    nameEn: "Insurance & Safety",
    descAr: "تأمين شامل وشهادات سلامة ومعدات إطفاء",
    descEn: "Comprehensive insurance, safety certificates & fire equipment",
    color: "#EF4444",
    tab: "operations",
    services: [
      { id: "i1", icon: Shield, nameAr: "تأمين شامل على البوث", nameEn: "Booth Insurance", descAr: "تأمين ضد الحريق والسرقة والأضرار طوال الفعالية", descEn: "Insurance against fire, theft and damage", price: 2000, unit: "per event", unitAr: "لكل فعالية", popular: true, rating: 4.7, deliveryDays: 2 },
      { id: "i2", icon: ShieldCheck, nameAr: "حارس أمن", nameEn: "Security Guard", descAr: "حارس أمن مرخص ومدرب — وردية 8 ساعات", descEn: "Licensed trained security guard — 8-hour shift", price: 600, unit: "per shift", unitAr: "لكل وردية", rating: 4.5, deliveryDays: 1 },
      { id: "i3", icon: BadgeCheck, nameAr: "شهادة سلامة", nameEn: "Safety Certificate", descAr: "فحص وشهادة سلامة للبوث والمعدات من الدفاع المدني", descEn: "Safety inspection certificate from Civil Defense", price: 1000, unit: "per certificate", unitAr: "لكل شهادة", rating: 4.6, deliveryDays: 3 },
    ],
  },

  // ═══════════════════════════════════════════
  // TAB: التصاريح والباجات (Permits & Badges)
  // ═══════════════════════════════════════════
  {
    id: "badges",
    icon: IdCard,
    nameAr: "الباجات وبطاقات الدخول",
    nameEn: "Badges & Access Cards",
    descAr: "باجات الموظفين والزوار وبطاقات VIP",
    descEn: "Staff badges, visitor passes and VIP cards",
    color: "#C5A55A",
    tab: "permits",
    services: [
      { id: "bg1", icon: IdCard, nameAr: "باج موظف / عامل", nameEn: "Staff Badge", descAr: "بطاقة دخول للموظفين والعمال مع صورة وباركود — صالحة طوال الفعالية", descEn: "Staff entry badge with photo and barcode — valid for entire event", price: 50, unit: "per badge", unitAr: "لكل باج", popular: true, rating: 4.9, deliveryDays: 1 },
      { id: "bg2", icon: Ticket, nameAr: "باج زائر VIP", nameEn: "VIP Visitor Badge", descAr: "بطاقة دخول VIP للعملاء والضيوف المميزين مع صلاحيات خاصة", descEn: "VIP entry badge for special guests with premium access", price: 100, unit: "per badge", unitAr: "لكل باج", rating: 4.8, deliveryDays: 1 },
      { id: "bg3", icon: QrCode, nameAr: "باج إلكتروني (QR)", nameEn: "Digital Badge (QR)", descAr: "باج رقمي بكود QR يُرسل عبر SMS/WhatsApp — بدون طباعة", descEn: "Digital QR badge sent via SMS/WhatsApp — no printing needed", price: 25, unit: "per badge", unitAr: "لكل باج", popular: true, rating: 4.7, deliveryDays: 0 },
      { id: "bg4", icon: Fingerprint, nameAr: "باج بصمة (Biometric)", nameEn: "Biometric Badge", descAr: "بطاقة دخول ببصمة الإصبع للمناطق عالية الأمان", descEn: "Fingerprint entry card for high-security zones", price: 200, unit: "per badge", unitAr: "لكل باج", rating: 4.6, deliveryDays: 2 },
    ],
  },
  {
    id: "vehicle-permits",
    icon: Car,
    nameAr: "تصاريح السيارات والبضائع",
    nameEn: "Vehicle & Cargo Permits",
    descAr: "تصاريح دخول السيارات والشاحنات والبضائع للموقع",
    descEn: "Vehicle, truck and cargo entry permits to venue",
    color: "#3B82F6",
    tab: "permits",
    services: [
      { id: "vp1", icon: Car, nameAr: "تصريح سيارة ركاب", nameEn: "Passenger Vehicle Permit", descAr: "تصريح دخول سيارة ركاب واحدة لموقع الفعالية مع موقف مخصص", descEn: "Single passenger vehicle entry permit with designated parking", price: 200, unit: "per vehicle", unitAr: "لكل سيارة", popular: true, rating: 4.8, deliveryDays: 1 },
      { id: "vp2", icon: Truck, nameAr: "تصريح شاحنة / فان", nameEn: "Truck / Van Permit", descAr: "تصريح دخول شاحنة أو فان لتحميل/تفريغ البضائع — ساعات محددة", descEn: "Truck/van entry permit for loading/unloading — scheduled hours", price: 500, unit: "per vehicle", unitAr: "لكل مركبة", rating: 4.7, deliveryDays: 1 },
      { id: "vp3", icon: Package, nameAr: "تصريح إدخال بضاعة", nameEn: "Cargo Entry Permit", descAr: "تصريح إدخال بضائع ومواد للموقع مع قائمة محتويات معتمدة", descEn: "Cargo entry permit with approved contents manifest", price: 150, unit: "per shipment", unitAr: "لكل شحنة", popular: true, rating: 4.9, deliveryDays: 0 },
      { id: "vp4", icon: AlertTriangle, nameAr: "تصريح مواد خاصة", nameEn: "Special Materials Permit", descAr: "تصريح إدخال مواد كيميائية أو قابلة للاشتعال أو معدات ثقيلة", descEn: "Permit for chemicals, flammables or heavy equipment entry", price: 800, unit: "per permit", unitAr: "لكل تصريح", rating: 4.5, deliveryDays: 3 },
    ],
  },
  {
    id: "access-control",
    icon: DoorOpen,
    nameAr: "الدخول والخروج والتعميم",
    nameEn: "Access Control & Circulation",
    descAr: "إدارة الدخول والخروج والتعميم للأشخاص والمركبات",
    descEn: "Entry/exit management and circulation for people and vehicles",
    color: "#10B981",
    tab: "permits",
    services: [
      { id: "ac1", icon: DoorOpen, nameAr: "تعميم دخول موظفين", nameEn: "Staff Access Circulation", descAr: "تعميم رسمي لإدارة الموقع بأسماء الموظفين المصرح لهم بالدخول", descEn: "Official circulation to venue management with authorized staff names", price: 100, unit: "per list", unitAr: "لكل قائمة", popular: true, rating: 4.8, deliveryDays: 0 },
      { id: "ac2", icon: UserCheck, nameAr: "موافقة دخول مسبقة", nameEn: "Pre-Approved Entry", descAr: "تسجيل مسبق للأشخاص المصرح لهم — يكفي إبراز الهوية عند البوابة", descEn: "Pre-registration for authorized persons — ID verification at gate", price: 0, unit: "free", unitAr: "مجاني", rating: 5.0, deliveryDays: 0 },
      { id: "ac3", icon: ScanLine, nameAr: "نظام مسح QR للدخول", nameEn: "QR Scan Entry System", descAr: "نظام مسح كود QR عند البوابة لتسجيل الدخول والخروج تلقائياً", descEn: "QR code scanning system at gates for automatic check-in/out", price: 1500, unit: "per event", unitAr: "لكل فعالية", rating: 4.7, deliveryDays: 2 },
      { id: "ac4", icon: ClipboardList, nameAr: "سجل دخول/خروج يومي", nameEn: "Daily Entry/Exit Log", descAr: "تقرير يومي بأسماء وأوقات دخول وخروج جميع الأشخاص والمركبات", descEn: "Daily report with names and times of all person/vehicle entries and exits", price: 300, unit: "per day", unitAr: "لكل يوم", rating: 4.6, deliveryDays: 0 },
      { id: "ac5", icon: KeyRound, nameAr: "مفتاح / كود وحدة", nameEn: "Unit Key / Access Code", descAr: "تسليم مفتاح أو كود دخول للوحدة المستأجرة مع محضر استلام", descEn: "Unit key or access code delivery with handover protocol", price: 0, unit: "free", unitAr: "مجاني", rating: 5.0, deliveryDays: 0 },
    ],
  },
];

interface CartItem {
  service: Service;
  category: ServiceCategory;
  quantity: number;
}

type TabKey = "services" | "operations" | "permits";

export default function ExhibitorServices() {
  const { t, lang, isRTL } = useLanguage();
  const isArabicLike = ["ar", "fa"].includes(lang);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabKey>("services");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const tabs: { key: TabKey; labelAr: string; labelEn: string; icon: any; count: number }[] = [
    { key: "services", labelAr: "خدمات التاجر", labelEn: "Trader Services", icon: Package, count: serviceCategories.filter(c => c.tab === "services").reduce((s, c) => s + c.services.length, 0) },
    { key: "operations", labelAr: "العمليات التشغيلية", labelEn: "Operations", icon: Settings2, count: serviceCategories.filter(c => c.tab === "operations").reduce((s, c) => s + c.services.length, 0) },
    { key: "permits", labelAr: "التصاريح والباجات", labelEn: "Permits & Badges", icon: KeyRound, count: serviceCategories.filter(c => c.tab === "permits").reduce((s, c) => s + c.services.length, 0) },
  ];

  const filteredCategories = useMemo(() => {
    let cats = serviceCategories.filter(c => c.tab === activeTab);
    if (selectedCategory !== "all") {
      cats = cats.filter(c => c.id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cats = cats.map(cat => ({
        ...cat,
        services: cat.services.filter(s =>
          s.nameAr.includes(q) || s.nameEn.toLowerCase().includes(q) ||
          s.descAr.includes(q) || s.descEn.toLowerCase().includes(q)
        ),
      })).filter(cat => cat.services.length > 0);
    }
    return cats;
  }, [activeTab, selectedCategory, searchQuery]);

  const tabCategories = useMemo(() => serviceCategories.filter(c => c.tab === activeTab), [activeTab]);

  const addToCart = (service: Service, category: ServiceCategory) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { service, category, quantity: 1 }];
    });
    toast.success(isArabicLike ? `تمت إضافة "${service.nameAr}" للسلة` : `"${service.nameEn}" added to cart`);
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => prev.filter(item => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.service.id === serviceId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    toast.success(isArabicLike
      ? `تم إرسال طلب الخدمات (${cart.length} خدمة) بقيمة ${cartTotal.toLocaleString()} ر.س — سيتم التواصل معك خلال 24 ساعة`
      : `Service request sent (${cart.length} services) for ${cartTotal.toLocaleString()} SAR — we'll contact you within 24 hours`
    );
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{isArabicLike ? "خدمات وعمليات التاجر" : "Trader Services & Operations"}</h1>
          <p className="text-xs t-tertiary mt-1">{isArabicLike ? "كل ما تحتاجه لنجاح مشاركتك — خدمات، عمليات، تصاريح وباجات" : "Everything you need — services, operations, permits & badges"}</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative btn-gold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <ShoppingCart size={16} />
          {isArabicLike ? "السلة" : "Cart"}
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold font-['Inter']">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedCategory("all"); setExpandedCategory(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "btn-gold"
                  : "glass-card hover:bg-[var(--glass-bg)] t-tertiary"
              }`}
            >
              <TabIcon size={14} />
              {isArabicLike ? tab.labelAr : tab.labelEn}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-['Inter'] ${isActive ? "bg-black/20 text-white" : "bg-[var(--glass-bg)] t-muted"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 t-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isArabicLike ? "ابحث عن خدمة..." : "Search services..."}
            className="w-full ps-9 pe-3 py-2.5 rounded-xl text-xs t-secondary bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:outline-none gold-focus"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-3 py-2.5 text-xs t-secondary focus:outline-none gold-focus"
        >
          <option value="all" className="bg-[var(--bg-primary)] text-[var(--text-primary)]">{isArabicLike ? "جميع الفئات" : "All Categories"}</option>
          {tabCategories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">{isArabicLike ? cat.nameAr : cat.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isArabicLike ? "فئات" : "Categories", value: tabCategories.length, icon: Building2 },
          { label: isArabicLike ? "خدمات" : "Services", value: tabCategories.reduce((s, c) => s + c.services.length, 0), icon: Package },
          { label: isArabicLike ? "الأكثر طلباً" : "Popular", value: tabCategories.reduce((s, c) => s + c.services.filter(sv => sv.popular).length, 0), icon: Star },
          { label: isArabicLike ? "في السلة" : "In Cart", value: cart.length, icon: ShoppingCart },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <stat.icon size={16} className="mx-auto t-gold mb-1.5" />
            <p className="text-lg font-bold t-primary font-['Inter']">{stat.value}</p>
            <p className="text-[9px] t-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Service Categories */}
      <div className="space-y-4">
        {filteredCategories.map(cat => {
          const CatIcon = cat.icon;
          const isExpanded = expandedCategory === cat.id || selectedCategory !== "all" || searchQuery.trim() !== "";

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-[var(--glass-bg)] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                  <CatIcon size={18} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 text-start min-w-0">
                  <h3 className="text-sm font-bold t-primary">{isArabicLike ? cat.nameAr : cat.nameEn}</h3>
                  <p className="text-[10px] t-tertiary truncate">{isArabicLike ? cat.descAr : cat.descEn}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] t-muted font-['Inter']">{cat.services.length} {isArabicLike ? "خدمة" : "services"}</span>
                  {isExpanded ? <ChevronUp size={14} className="t-tertiary" /> : <ChevronDown size={14} className="t-tertiary" />}
                </div>
              </button>

              {/* Services Grid */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 pt-0">
                      {cat.services.map(service => {
                        const SvcIcon = service.icon;
                        const inCart = cart.find(item => item.service.id === service.id);
                        const isFree = service.price === 0;

                        return (
                          <div
                            key={service.id}
                            className="relative p-4 rounded-xl transition-all hover:bg-[var(--glass-bg)]"
                            style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid var(--glass-border)" }}
                          >
                            {service.popular && (
                              <span className="absolute top-2 end-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-[#C5A55A]/15 text-[#C5A55A] border border-[#C5A55A]/20">
                                {isArabicLike ? "الأكثر طلباً" : "Popular"}
                              </span>
                            )}

                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}10` }}>
                                <SvcIcon size={14} style={{ color: cat.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold t-secondary">{isArabicLike ? service.nameAr : service.nameEn}</h4>
                                <p className="text-[10px] t-tertiary mt-0.5 leading-relaxed">{isArabicLike ? service.descAr : service.descEn}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                {isFree ? (
                                  <span className="text-sm font-bold text-green-400">{isArabicLike ? "مجاني" : "Free"}</span>
                                ) : (
                                  <>
                                    <span className="text-sm font-bold text-[#C5A55A] font-['Inter']">{service.price.toLocaleString()}</span>
                                    <span className="text-[9px] t-tertiary ms-1">{t("common.sar")} / {isArabicLike ? service.unitAr : service.unit}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {service.rating && (
                                  <div className="flex items-center gap-0.5">
                                    <Star size={10} className="text-[#FBBF24] fill-[#FBBF24]" />
                                    <span className="text-[9px] t-muted font-['Inter']">{service.rating}</span>
                                  </div>
                                )}
                                {service.deliveryDays !== undefined && (
                                  <div className="flex items-center gap-0.5">
                                    <Clock size={10} className="t-muted" />
                                    <span className="text-[9px] t-muted font-['Inter']">
                                      {service.deliveryDays === 0 ? (isArabicLike ? "فوري" : "Instant") : `${service.deliveryDays}d`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                              {inCart ? (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(service.id, -1)} className="w-7 h-7 rounded-lg glass-card flex items-center justify-center hover:bg-[var(--glass-bg)]">
                                      <Minus size={12} className="t-secondary" />
                                    </button>
                                    <span className="text-sm font-bold t-primary font-['Inter'] w-6 text-center">{inCart.quantity}</span>
                                    <button onClick={() => updateQuantity(service.id, 1)} className="w-7 h-7 rounded-lg glass-card flex items-center justify-center hover:bg-[var(--glass-bg)]">
                                      <Plus size={12} className="t-secondary" />
                                    </button>
                                  </div>
                                  <button onClick={() => removeFromCart(service.id)} className="text-[10px] text-red-400 hover:text-red-300">
                                    {isArabicLike ? "إزالة" : "Remove"}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(service, cat)}
                                  className="w-full py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all hover:bg-[#C5A55A]/10 text-[#C5A55A] border border-[#C5A55A]/20"
                                >
                                  <Plus size={12} />
                                  {isFree ? (isArabicLike ? "طلب مجاني" : "Request Free") : (isArabicLike ? "أضف للسلة" : "Add to Cart")}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Banner */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-[#C5A55A]/10 flex items-center justify-center shrink-0">
            <Headphones size={22} className="text-[#C5A55A]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold t-primary">{isArabicLike ? "تحتاج خدمة مخصصة؟" : "Need a Custom Service?"}</h3>
            <p className="text-[10px] t-tertiary mt-0.5">{isArabicLike ? "تواصل معنا وسنوفر لك كل ما تحتاجه" : "Contact us and we'll provide everything you need"}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a href="tel:00966535555900" className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-[10px] t-secondary hover:text-[#C5A55A] transition-colors">
              <Phone size={12} />
              <span className="font-['Inter']">00966535555900</span>
            </a>
            <a href="mailto:rent@mahamexpo.sa" className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-[10px] t-secondary hover:text-[#C5A55A] transition-colors">
              <Mail size={12} />
              <span>rent@mahamexpo.sa</span>
            </a>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="glass-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 p-4 border-b border-[var(--glass-border)]" style={{ backgroundColor: "var(--bg-primary)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold t-primary flex items-center gap-2">
                    <ShoppingCart size={16} className="t-gold" />
                    {isArabicLike ? "سلة الخدمات" : "Service Cart"}
                    <span className="text-[10px] t-muted font-['Inter']">({cart.length})</span>
                  </h3>
                  <button onClick={() => setShowCart(false)} className="glass-card p-1.5 rounded-full">
                    <X size={14} className="t-secondary" />
                  </button>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart size={40} className="mx-auto t-muted mb-3" />
                  <p className="text-sm t-tertiary">{isArabicLike ? "السلة فارغة" : "Cart is empty"}</p>
                  <p className="text-[10px] t-muted mt-1">{isArabicLike ? "أضف خدمات من القائمة أعلاه" : "Add services from the list above"}</p>
                </div>
              ) : (
                <>
                  <div className="p-4 space-y-3">
                    {cart.map(item => (
                      <div key={item.service.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.category.color}10` }}>
                          <item.service.icon size={14} style={{ color: item.category.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold t-secondary truncate">{isArabicLike ? item.service.nameAr : item.service.nameEn}</p>
                          <p className="text-[9px] t-muted font-['Inter']">
                            {item.service.price === 0 ? (isArabicLike ? "مجاني" : "Free") : `${item.service.price.toLocaleString()} ${t("common.sar")} × ${item.quantity}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(item.service.id, -1)} className="w-6 h-6 rounded glass-card flex items-center justify-center">
                            <Minus size={10} className="t-secondary" />
                          </button>
                          <span className="text-xs font-bold t-primary font-['Inter'] w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.service.id, 1)} className="w-6 h-6 rounded glass-card flex items-center justify-center">
                            <Plus size={10} className="t-secondary" />
                          </button>
                          <button onClick={() => removeFromCart(item.service.id)} className="ms-1 w-6 h-6 rounded flex items-center justify-center text-red-400/60 hover:text-red-400">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 p-4 border-t border-[var(--glass-border)]" style={{ backgroundColor: "var(--bg-primary)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold t-primary">{isArabicLike ? "الإجمالي" : "Total"}</span>
                      <span className="text-lg font-bold text-[#C5A55A] font-['Inter']">{cartTotal.toLocaleString()} <span className="text-xs">{t("common.sar")}</span></span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2 font-bold"
                    >
                      <CreditCard size={14} />
                      {isArabicLike ? "إرسال طلب الخدمات" : "Submit Service Request"}
                    </button>
                    <p className="text-[8px] t-muted text-center mt-2">
                      {isArabicLike ? "سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب والدفع" : "We'll contact you within 24 hours to confirm and process payment"}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
