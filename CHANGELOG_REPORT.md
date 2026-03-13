# تقرير التعديلات الشامل — منصة مهام إكسبو (بوابة التاجر)

**التاريخ:** 13 مارس 2026  
**المنصة:** Maham Expo — Smart Trader Portal  
**عدد الطلبات المنفذة:** 7 طلبات رئيسية  

---

## الطلب 1: تحديث صفحة توثيق الحساب (KYC)

| البند | التفاصيل |
|-------|----------|
| **حذف مستندات** | تم حذف رخصة البلدية وشهادة التأمينات من متطلبات التوثيق |
| **العنوان الوطني** | تم تحويله إلى حقل اختياري (غير مشروط) مع وسم "اختياري" |
| **الحساب البنكي** | تم نقله من خطوة التسجيل الأول إلى خطوة التوثيق (KYC) |
| **الملفات المعدلة** | `KYC.tsx`, `Login.tsx`, `AuthContext.tsx` |

---

## الطلب 2: تفعيل زر تصفح المعارض والحجز

| البند | التفاصيل |
|-------|----------|
| **زر تصفح المعارض** | تم تفعيله ليعمل بشكل حقيقي — ينقل المستخدم لصفحة المعارض |
| **نظام BookingGuard** | يسمح بالتصفح الكامل لكن يمنع الحجز قبل إكمال التوثيق |
| **التوجيه بعد التسجيل** | يتم التوجيه مباشرة لصفحة المعارض بدلاً من الداشبورد |
| **الملفات المعدلة** | `Home.tsx`, `BrowseExpos.tsx`, `BookingGuard.tsx`, `Login.tsx` |

---

## الطلب 3: إكمال الملف التعريفي للتاجر وتسجيل الخروج

| البند | التفاصيل |
|-------|----------|
| **الملف التعريفي** | تم إكماله ببيانات التاجر الحقيقية من AuthContext (الاسم، الشركة، النشاط، المنطقة، الهاتف) |
| **زر تسجيل الخروج** | تم إضافته بشكل واضح مع مودال تأكيد احترافي |
| **حالة التوثيق** | تظهر بشكل بصري واضح (موثق / بانتظار التوثيق) |
| **الملفات المعدلة** | `Profile.tsx`, `AuthContext.tsx` |

---

## الطلب 4: إصلاح Bottom Navigation وزر الرجوع

| البند | التفاصيل |
|-------|----------|
| **Bottom Navigation** | تم إعادة بنائه بالكامل — ثابت في الأسفل على الجوال مع 5 أقسام رئيسية + زر المزيد |
| **زر رجوع ديناميكي** | يظهر تلقائياً في Header لكل الأقسام الفرعية |
| **Mobile Drawer** | قائمة جانبية متحركة للجوال مع كل الأقسام وتسجيل الخروج |
| **Safe Area** | دعم safe-area-inset لأجهزة iPhone (notch) |
| **الملفات المعدلة** | `DashboardLayout.tsx`, `index.css`, `index.html` |

---

## الطلب 5: إصلاح شامل لـ Responsive على الجوال

| البند | التفاصيل |
|-------|----------|
| **المودالات** | تم تحويل كل المودالات لنمط bottom-sheet على الجوال بدلاً من النوافذ المركزية |
| **الجداول** | تم تحويل الجداول في Bookings و Payments لبطاقات cards على الشاشات الصغيرة |
| **الصفحات المعدلة** | `Bookings.tsx`, `Payments.tsx`, `Contracts.tsx`, `Messages.tsx`, `Analytics.tsx`, `Operations.tsx`, `Dashboard.tsx`, `Notifications.tsx`, `Reviews.tsx`, `HelpCenter.tsx`, `ExpoMap.tsx`, `BrowseExpos.tsx` |
| **viewport-fit** | تم إضافة `viewport-fit=cover` في `index.html` لدعم safe-area |

---

## الطلب 6: تفعيل تحميل PDF حقيقي

| البند | التفاصيل |
|-------|----------|
| **مكتبة PDF** | تم بناء `pdfGenerator.ts` باستخدام jsPDF + jspdf-autotable |
| **عقد PDF** | عقد تشغيل تجزئة احترافي من صفحتين يتضمن بيانات الطرفين والبنود المالية والشروط والتوقيعات |
| **تقرير حجوزات** | تقرير PDF مفصل بحالة الحجز والبيانات المالية والخدمات الإضافية |
| **تقرير مدفوعات** | تقرير PDF بجدول كل المعاملات المالية مع KPIs |
| **تقرير تحليلات** | تقرير PDF بالإيرادات والحجوزات ونسبة الإشغال وأفضل المعارض |
| **بيانات العقد** | مستخرجة من ملحق العقد الرسمي المرفق — تتضمن بنود الدفع والالتزامات والمخالفات |
| **الملفات المعدلة** | `pdfGenerator.ts` (جديد), `Contracts.tsx`, `Bookings.tsx`, `Payments.tsx`, `Analytics.tsx` |

---

## الطلب 7: إشعارات ديناميكية + نظام إرسال العقد + إصلاح الأزرار

| البند | التفاصيل |
|-------|----------|
| **إشعارات ديناميكية** | عند حجز بوث يظهر badge رقمي على أيقونة الحجوزات في Sidebar و Bottom Nav |
| **عداد الإشعارات** | يظهر على أيقونة الجرس في Header مع عدد الإشعارات غير المقروءة |
| **نظام إرسال العقد** | مكون `ContractShare.tsx` يوفر إرسال العقد عبر: |
| | — البريد الإلكتروني (يفتح mailto مع رابط العقد) |
| | — SMS (يفتح تطبيق الرسائل مع رابط العقد) |
| | — واتساب (يفتح WhatsApp مع رسالة رسمية تتضمن رابط العقد) |
| | — تحميل مباشر (PDF) |
| **أزرار الداشبورد** | تم التأكد من أن كل الأزرار والبطاقات مربوطة بـ Link وتعمل بشكل صحيح |
| **الملفات المعدلة** | `ContractShare.tsx` (جديد), `AuthContext.tsx`, `DashboardLayout.tsx`, `BrowseExpos.tsx`, `Contracts.tsx`, `Dashboard.tsx` |

---

## ملخص الملفات المعدلة والجديدة

| الملف | الحالة | الوصف |
|-------|--------|-------|
| `client/src/pages/KYC.tsx` | معدل | حذف مستندات + عنوان وطني اختياري + حساب بنكي |
| `client/src/pages/Login.tsx` | معدل | إزالة حقل البنك + توجيه لصفحة المعارض |
| `client/src/pages/Home.tsx` | معدل | تفعيل أزرار CTA |
| `client/src/pages/Profile.tsx` | معدل | إكمال بيانات + زر خروج |
| `client/src/pages/BrowseExpos.tsx` | معدل | تصفح كامل + حجز بعد التوثيق + إشعارات |
| `client/src/pages/Bookings.tsx` | معدل | cards للجوال + PDF حقيقي |
| `client/src/pages/Payments.tsx` | معدل | cards للجوال + PDF حقيقي |
| `client/src/pages/Contracts.tsx` | معدل | bottom-sheet + PDF + إرسال عقد |
| `client/src/pages/Messages.tsx` | معدل | responsive محسّن |
| `client/src/pages/Analytics.tsx` | معدل | responsive + تصدير PDF |
| `client/src/pages/Operations.tsx` | معدل | responsive محسّن |
| `client/src/pages/Dashboard.tsx` | معدل | responsive + أزرار مفعلة |
| `client/src/pages/Notifications.tsx` | معدل | responsive محسّن |
| `client/src/pages/Reviews.tsx` | معدل | responsive محسّن |
| `client/src/pages/HelpCenter.tsx` | معدل | responsive محسّن |
| `client/src/pages/ExpoMap.tsx` | معدل | responsive محسّن |
| `client/src/components/DashboardLayout.tsx` | معدل | Bottom Nav + زر رجوع + Drawer + إشعارات |
| `client/src/components/BookingGuard.tsx` | معدل | bottom-sheet + safe-area |
| `client/src/components/ContractShare.tsx` | جديد | نظام إرسال العقد (إيميل/SMS/واتساب/PDF) |
| `client/src/contexts/AuthContext.tsx` | معدل | completeKYC + إشعارات + عداد حجوزات |
| `client/src/lib/pdfGenerator.ts` | جديد | مكتبة توليد PDF (عقود/حجوزات/مدفوعات/تحليلات) |
| `client/src/index.css` | معدل | safe-area + mobile fixes |
| `client/index.html` | معدل | viewport-fit=cover |

---

## ملاحظات تقنية

**تقنيات PDF المستخدمة:**
- jsPDF v2 لتوليد PDF في المتصفح مباشرة (بدون backend)
- jspdf-autotable لتوليد جداول احترافية
- النصوص بالإنجليزية في PDF لأن خط Helvetica المدمج لا يدعم العربية
- التصميم يتبع نفس الهوية البصرية للمنصة (خلفية داكنة + ذهبي)

**قيد معروف:**
- النص العربي في PDF يظهر مشوّه لأن jsPDF لا يدعم ligatures العربية بخط Helvetica. الحل الحالي: استخدام الإنجليزية في PDF. الحل المستقبلي: استخدام backend مع مكتبة مثل Puppeteer أو WeasyPrint لتوليد PDF بالعربية.

---

**تم إعداد هذا التقرير بواسطة:** Manus AI — المستشار التقني لمنصة مهام إكسبو  
**التاريخ:** 13 مارس 2026
