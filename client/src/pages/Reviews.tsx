/**
 * Reviews — Post-Exhibition Rating & Review System
 * Design: Obsidian Glass with star ratings, feedback forms
 * Features: Rate expo experience, booth quality, services, ROI tracking
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star, MessageSquare, ThumbsUp, ThumbsDown, Award, TrendingUp,
  Users, Building2, Zap, Shield, CheckCircle2, Clock, BarChart3,
  Send, Camera, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReviewItem {
  id: string;
  expoNameAr: string;
  expoNameEn: string;
  date: string;
  boothCode: string;
  overallRating: number;
  status: "pending" | "submitted" | "verified";
}

interface PastReview {
  id: string;
  expoNameAr: string;
  date: string;
  rating: number;
  comment: string;
  response?: string;
}

const pendingReviews: ReviewItem[] = [
  {
    id: "rev-1",
    expoNameAr: "معرض الرياض الدولي للتقنية والابتكار",
    expoNameEn: "Riyadh International Tech Expo",
    date: "2025-04-19",
    boothCode: "A21",
    overallRating: 0,
    status: "pending",
  },
];

const pastReviews: PastReview[] = [
  {
    id: "prev-1",
    expoNameAr: "معرض الأغذية والمشروبات 2024",
    date: "2024-12-15",
    rating: 4,
    comment: "تجربة ممتازة، التنظيم كان رائعاً والخدمات اللوجستية متميزة. عدد الزوار فاق التوقعات.",
    response: "شكراً لتقييمكم الإيجابي! نسعد بخدمتكم في المعارض القادمة.",
  },
  {
    id: "prev-2",
    expoNameAr: "مؤتمر ريادة الأعمال 2024",
    date: "2024-09-20",
    rating: 5,
    comment: "أفضل مؤتمر حضرته. فرص التواصل مع المستثمرين كانت استثنائية والعائد على الاستثمار تجاوز 300%.",
  },
];

const ratingCategories = [
  { key: "organization", labelAr: "التنظيم العام", labelEn: "Overall Organization", icon: Building2 },
  { key: "services", labelAr: "جودة الخدمات", labelEn: "Service Quality", icon: Zap },
  { key: "visitors", labelAr: "عدد وجودة الزوار", labelEn: "Visitor Quality", icon: Users },
  { key: "roi", labelAr: "العائد على الاستثمار", labelEn: "Return on Investment", icon: TrendingUp },
  { key: "security", labelAr: "الأمان والحماية", labelEn: "Security & Safety", icon: Shield },
  { key: "logistics", labelAr: "الخدمات اللوجستية", labelEn: "Logistics", icon: BarChart3 },
];

function StarRating({ value, onChange, size = 20 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`${(hover || value) >= star ? "text-[#FBBF24] fill-[#FBBF24]" : "t-muted"} transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t, lang, isRTL } = useLanguage();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [showROIForm, setShowROIForm] = useState(false);
  const [roiData, setRoiData] = useState({ revenue: "", leads: "", deals: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (overallRating === 0) {
      toast.error("يرجى إضافة التقييم العام | Please add overall rating");
      return;
    }
    setSubmitted(true);
    toast.success("تم إرسال تقييمك بنجاح! شكراً لمساهمتك | Review submitted successfully!");
  };

  const avgRating = Object.values(ratings).length > 0
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold t-primary">التقييمات والمراجعات</h2>
        <p className="text-[10px] sm:text-xs t-gold/50 font-['Inter']">Ratings & Reviews — Post-Exhibition Feedback</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: "تقييمات مطلوبة", labelEn: "Pending", value: pendingReviews.length, icon: Clock, color: "text-[var(--status-yellow)]" },
          { label: "تقييمات مقدمة", labelEn: "Submitted", value: pastReviews.length, icon: CheckCircle2, color: "text-[var(--status-green)]" },
          { label: "متوسط تقييمك", labelEn: "Your Average", value: "4.5", icon: Star, color: "text-[#FBBF24]" },
          { label: "شارة الجودة", labelEn: "Quality Badge", value: "ذهبية", icon: Award, color: "t-gold" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-2.5 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={14} className={`${s.color} opacity-60`} />
              <span className="text-[10px] t-tertiary">{s.label}</span>
            </div>
            <p className={`text-lg font-bold font-['Inter'] ${s.color}`}>{s.value}</p>
            <p className="text-[8px] t-muted font-['Inter']">{s.labelEn}</p>
          </div>
        ))}
      </div>

      {/* Pending Review Form */}
      {pendingReviews.length > 0 && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 border-[var(--gold-border)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={16} className="t-gold" />
            <h3 className="text-sm font-bold t-primary">تقييم معرض جديد</h3>
            <span className="text-[9px] t-muted font-['Inter']">New Review Required</span>
          </div>

          {/* Expo Info */}
          <div className="glass-card rounded-xl p-4 mb-5">
            <p className="text-sm font-bold t-secondary">{pendingReviews[0].expoNameAr}</p>
            <p className="text-[10px] t-gold/50 font-['Inter']">{pendingReviews[0].expoNameEn}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] t-tertiary">الوحدة: {pendingReviews[0].boothCode}</span>
              <span className="text-[10px] t-tertiary font-['Inter']">{pendingReviews[0].date}</span>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="mb-6 text-center">
            <p className="text-xs t-secondary mb-2">التقييم العام | Overall Rating</p>
            <div className="flex justify-center">
              <StarRating value={overallRating} onChange={setOverallRating} size={32} />
            </div>
            {overallRating > 0 && (
              <p className="text-lg font-bold text-[#FBBF24] font-['Inter'] mt-2">{overallRating}.0 / 5.0</p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {ratingCategories.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <cat.icon size={14} className="t-tertiary" />
                  <div>
                    <p className="text-xs t-secondary">{cat.labelAr}</p>
                    <p className="text-[8px] t-muted font-['Inter']">{cat.labelEn}</p>
                  </div>
                </div>
                <StarRating
                  value={ratings[cat.key] || 0}
                  onChange={(v) => setRatings(prev => ({ ...prev, [cat.key]: v }))}
                  size={16}
                />
              </div>
            ))}
          </div>

          {/* ROI Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowROIForm(!showROIForm)}
              className="flex items-center gap-2 text-xs t-gold/70 hover:t-gold transition-colors"
            >
              <TrendingUp size={14} />
              <span>تسجيل العائد على الاستثمار (اختياري)</span>
              <ChevronDown size={14} className={`transition-transform ${showROIForm ? "rotate-180" : ""}`} />
            </button>
            {showROIForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3"
              >
                <div>
                  <label className="text-[9px] t-tertiary block mb-1">الإيرادات (ر.س)</label>
                  <input
                    type="number"
                    value={roiData.revenue}
                    onChange={(e) => setRoiData(prev => ({ ...prev, revenue: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none focus:border-[var(--gold-border)]"
                  />
                </div>
                <div>
                  <label className="text-[9px] t-tertiary block mb-1">العملاء المحتملين</label>
                  <input
                    type="number"
                    value={roiData.leads}
                    onChange={(e) => setRoiData(prev => ({ ...prev, leads: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none focus:border-[var(--gold-border)]"
                  />
                </div>
                <div>
                  <label className="text-[9px] t-tertiary block mb-1">الصفقات المغلقة</label>
                  <input
                    type="number"
                    value={roiData.deals}
                    onChange={(e) => setRoiData(prev => ({ ...prev, deals: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none focus:border-[var(--gold-border)]"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Comment */}
          <div className="mb-5">
            <label className="text-xs t-tertiary block mb-2">تعليقك | Your Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شاركنا تجربتك في المعرض... | Share your expo experience..."
              rows={4}
              className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-5">
            <button className="flex items-center gap-2 text-xs t-tertiary hover:t-secondary transition-colors">
              <Camera size={14} />
              <span>إرفاق صور (اختياري) | Attach photos</span>
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Send size={14} />
            إرسال التقييم
          </button>
        </motion.div>
      )}

      {/* Submitted Success */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center border-green-400/15"
        >
          <CheckCircle2 size={48} className="mx-auto text-[var(--status-green)] mb-4" />
          <h3 className="text-lg font-bold t-primary mb-2">شكراً لتقييمك!</h3>
          <p className="text-xs t-tertiary mb-1">تم إرسال تقييمك بنجاح وسيتم مراجعته</p>
          <p className="text-[10px] t-muted font-['Inter']">Your review has been submitted and will be verified</p>
        </motion.div>
      )}

      {/* Past Reviews */}
      <div>
        <h3 className="text-sm font-bold t-secondary mb-4">
          تقييماتك السابقة
          <span className="text-[10px] t-muted font-['Inter'] mr-2">Your Past Reviews</span>
        </h3>
        <div className="space-y-4">
          {pastReviews.map((review) => (
            <div key={review.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold t-secondary">{review.expoNameAr}</p>
                  <p className="text-[10px] t-tertiary font-['Inter']">{review.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= review.rating ? "text-[#FBBF24] fill-[#FBBF24]" : "t-muted"} />
                  ))}
                </div>
              </div>
              <p className="text-xs t-secondary leading-relaxed mb-3">{review.comment}</p>
              {review.response && (
                <div className="p-3 rounded-xl bg-gold-subtle border border-[rgba(197,165,90,0.1)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare size={10} className="t-gold" />
                    <span className="text-[9px] t-gold/70">رد المنظم</span>
                  </div>
                  <p className="text-[11px] t-tertiary">{review.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
