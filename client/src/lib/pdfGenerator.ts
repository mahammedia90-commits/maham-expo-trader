/**
 * PDF Generator — Maham Expo
 * Uses jsPDF + jspdf-autotable directly (no html2canvas)
 * Arabic text is rendered as-is — jsPDF with embedded font handles it
 * We use a simple table-based layout approach for clean Arabic PDFs
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Colors
const DARK_BG = "#0f141e";
const GOLD = "#c5a55a";
const GOLD_LIGHT = "#dcc382";
const TEXT_LIGHT = "#e0e5f0";
const TEXT_MUTED = "#a0aab9";
const SECTION_BG = "#192337";
const GREEN = "#22c55e";
const RED = "#ef4444";
const YELLOW = "#eab308";

// Helper: create a new jsPDF doc with dark background
function createDoc(): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  return doc;
}

// Helper: draw dark background
function drawBackground(doc: jsPDF) {
  doc.setFillColor(DARK_BG);
  doc.rect(0, 0, 210, 297, "F");
}

// Helper: draw header
function drawHeader(doc: jsPDF, titleAr: string, titleEn: string, subtitle?: string): number {
  // Header background
  doc.setFillColor("#1a2540");
  doc.rect(0, 0, 210, 32, "F");
  
  // Gold line
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.8);
  doc.line(0, 32, 210, 32);

  // MAHAM EXPO
  doc.setTextColor(GOLD);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MAHAM EXPO", 105, 10, { align: "center" });

  // Subtitle
  doc.setTextColor(GOLD_LIGHT);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle || "Maham Expo for Exhibitions & Conferences", 105, 15, { align: "center" });

  // Title Arabic (use English transliteration since jsPDF can't render Arabic natively)
  doc.setTextColor("#ffffff");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(titleEn, 105, 22, { align: "center" });

  // Title English
  doc.setTextColor(TEXT_MUTED);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(titleAr, 105, 27, { align: "center" });

  return 38; // Y position after header
}

// Helper: draw section title
function drawSectionTitle(doc: jsPDF, y: number, textEn: string): number {
  doc.setFillColor(SECTION_BG);
  doc.roundedRect(15, y, 180, 7, 1, 1, "F");
  doc.setTextColor(GOLD);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(textEn, 105, y + 5, { align: "center" });
  return y + 10;
}

// Helper: draw info row
function drawInfoRow(doc: jsPDF, y: number, label: string, value: string, valueColor?: string): number {
  doc.setDrawColor("#283246");
  doc.setLineWidth(0.2);
  doc.line(20, y + 6, 190, y + 6);
  
  doc.setTextColor(GOLD_LIGHT);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(label, 185, y + 4, { align: "right" });
  
  doc.setTextColor(valueColor || TEXT_LIGHT);
  doc.setFont("helvetica", "normal");
  doc.text(value, 25, y + 4, { align: "left" });
  
  return y + 8;
}

// Helper: draw footer
function drawFooter(doc: jsPDF, pageNum?: number) {
  const y = 285;
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.3);
  doc.line(20, y, 190, y);
  
  doc.setTextColor(TEXT_MUTED);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("info@mahamexpo.sa | +966 53 555 5900 | www.mahamexpo.sa", 105, y + 3, { align: "center" });
  doc.text("Maham Company for Services & IT — All Rights Reserved 2025", 105, y + 6, { align: "center" });
  if (pageNum) {
    doc.text(`Page ${pageNum}`, 105, y + 9, { align: "center" });
  }
}

// Helper: draw KPI cards
function drawKPICards(doc: jsPDF, y: number, cards: { label: string; value: string; color: string }[]): number {
  const cardWidth = 170 / cards.length;
  const startX = 20;
  
  cards.forEach((card, i) => {
    const x = startX + i * (cardWidth + 3);
    doc.setFillColor(SECTION_BG);
    doc.roundedRect(x, y, cardWidth - 2, 18, 1, 1, "F");
    
    doc.setTextColor(TEXT_MUTED);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(card.label, x + (cardWidth - 2) / 2, y + 5, { align: "center" });
    
    doc.setTextColor(card.color);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, x + (cardWidth - 2) / 2, y + 13, { align: "center" });
  });
  
  return y + 22;
}

// ═══════════════════════════════════════════════════════════════
// CONTRACT PDF
// ═══════════════════════════════════════════════════════════════
export interface ContractData {
  contractId: string;
  bookingId: string;
  expoName: string;
  boothNumber: string;
  boothSize: string;
  traderName: string;
  traderCompany: string;
  traderCR: string;
  traderPhone: string;
  traderEmail: string;
  traderVAT?: string;
  traderIBAN?: string;
  traderBankName?: string;
  traderNationalAddress?: string;
  traderIdNumber?: string;
  totalValue: number;
  deposit: number;
  remaining: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  status: string;
}

export async function generateContractPDF(data: ContractData) {
  const doc = createDoc();
  const vat = data.totalValue * 0.15;
  const totalWithVat = data.totalValue + vat;

  // ─── PAGE 1 ───
  drawBackground(doc);
  let y = drawHeader(doc, `Retail Operating Contract — ${data.contractId}`, "Retail Operating Contract");

  // Reference box
  doc.setFillColor(SECTION_BG);
  doc.roundedRect(20, y, 170, 8, 1, 1, "F");
  doc.setTextColor(GOLD);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`Ref: ${data.contractId}`, 25, y + 5);
  doc.setTextColor(TEXT_MUTED);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${data.createdDate}`, 185, y + 5, { align: "right" });
  y += 12;

  // First Party
  y = drawSectionTitle(doc, y, "First Party (Organizer)");
  y = drawInfoRow(doc, y, "Company", "Maham Company for Services & IT");
  y = drawInfoRow(doc, y, "Commercial Reg.", "4030163376");
  y = drawInfoRow(doc, y, "Representative", "Nour Eddin Youssef Karam Dayoub");
  y = drawInfoRow(doc, y, "Position", "General Manager");
  y = drawInfoRow(doc, y, "Mobile", "+966 53 555 5900");
  y = drawInfoRow(doc, y, "Email", "info@maham.com.sa");

  // Second Party — Built from real KYC data
  y = drawSectionTitle(doc, y + 2, "Second Party (Operator / Trader)");
  y = drawInfoRow(doc, y, "Trader Name", data.traderName);
  y = drawInfoRow(doc, y, "Company", data.traderCompany);
  y = drawInfoRow(doc, y, "Commercial Reg.", data.traderCR || "—");
  if (data.traderIdNumber && data.traderIdNumber !== "—") {
    y = drawInfoRow(doc, y, "National ID / Iqama", data.traderIdNumber);
  }
  if (data.traderVAT && data.traderVAT !== "—") {
    y = drawInfoRow(doc, y, "VAT Number", data.traderVAT);
  }
  y = drawInfoRow(doc, y, "Mobile", data.traderPhone);
  y = drawInfoRow(doc, y, "Email", data.traderEmail);
  if (data.traderNationalAddress && data.traderNationalAddress !== "—") {
    y = drawInfoRow(doc, y, "National Address", data.traderNationalAddress);
  }
  if (data.traderBankName && data.traderBankName !== "—") {
    y = drawInfoRow(doc, y, "Bank", `${data.traderBankName}`);
  }
  if (data.traderIBAN && data.traderIBAN !== "—") {
    y = drawInfoRow(doc, y, "IBAN", data.traderIBAN);
  }

  // Location Details
  y = drawSectionTitle(doc, y + 2, "Location & Expo Details");
  y = drawInfoRow(doc, y, "Expo Name", data.expoName);
  y = drawInfoRow(doc, y, "Booth Number", data.boothNumber);
  y = drawInfoRow(doc, y, "Area", data.boothSize);
  y = drawInfoRow(doc, y, "Start Date", data.startDate);
  y = drawInfoRow(doc, y, "End Date", data.endDate);

  // Financial Details
  y = drawSectionTitle(doc, y + 2, "Financial Details");
  y = drawInfoRow(doc, y, "Total Value", `${data.totalValue.toLocaleString()} SAR`);
  y = drawInfoRow(doc, y, "Deposit Paid", `${data.deposit.toLocaleString()} SAR`);
  y = drawInfoRow(doc, y, "Remaining", `${data.remaining.toLocaleString()} SAR`, RED);
  y = drawInfoRow(doc, y, "VAT 15%", `${vat.toLocaleString()} SAR`);
  y = drawInfoRow(doc, y, "Grand Total (incl. VAT)", `${totalWithVat.toLocaleString()} SAR`, GOLD);

  drawFooter(doc, 1);

  // ─── PAGE 2: Terms ───
  doc.addPage();
  drawBackground(doc);
  y = drawHeader(doc, `Terms & Conditions — ${data.contractId}`, "Terms & Conditions");

  // Payment Terms Table
  y = drawSectionTitle(doc, y, "Payment Terms");
  
  autoTable(doc, {
    startY: y,
    head: [["Item", "Value", "Description"]],
    body: [
      ["Contract Signing", "100% Deposit", "Payment upon contract signing"],
      ["Organizer Share", "30%", "Revenue sharing — Organizer"],
      ["Trader Share", "70%", "Revenue sharing — Trader"],
      ["Late Payment Penalty", "1,000 SAR/day", "Daily penalty for late payment"],
      ["Evacuation Penalty", "5,000 SAR", "Penalty for late evacuation"],
      ["POS System Fee", "100 SAR + VAT", "Point of Sale system rental"],
    ],
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 2, textColor: TEXT_LIGHT, fillColor: "#0f1626", lineColor: "#283246", lineWidth: 0.2 },
    headStyles: { fillColor: "#1e2a41", textColor: GOLD, fontStyle: "bold", fontSize: 7 },
    alternateRowStyles: { fillColor: "#141e30" },
    margin: { left: 20, right: 20 },
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Obligations
  y = drawSectionTitle(doc, y, "Operator Obligations");
  const obligations = [
    "All operational costs during contract period",
    "Provide qualified and licensed workforce",
    "No subcontracting without written permission",
    "Comply with health and safety standards",
    "Obtain all required licenses and permits",
    "Follow security and safety instructions",
    "Provide comprehensive insurance policy",
    "Adhere to working hours set by organizer",
    "No modifications without prior approval",
  ];
  
  obligations.forEach((ob, i) => {
    doc.setTextColor(GOLD);
    doc.setFontSize(7);
    doc.text("-", 185, y + 4);
    doc.setTextColor(TEXT_LIGHT);
    doc.text(`${i + 1}. ${ob}`, 180, y + 4, { align: "right" });
    y += 6;
  });

  // Signatures
  y += 4;
  y = drawSectionTitle(doc, y, "Signatures");
  
  // First Party Signature
  doc.setFillColor(SECTION_BG);
  doc.roundedRect(110, y, 80, 30, 1, 1, "F");
  doc.setTextColor(GOLD);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("First Party (Organizer)", 150, y + 6, { align: "center" });
  doc.setTextColor(GOLD_LIGHT);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Nour Eddin Karam Dayoub", 150, y + 11, { align: "center" });
  doc.setTextColor(TEXT_MUTED);
  doc.text("Signature: ___________________", 150, y + 19, { align: "center" });
  doc.text(`Date: ${data.createdDate}`, 150, y + 24, { align: "center" });

  // Second Party Signature
  doc.setFillColor(SECTION_BG);
  doc.roundedRect(20, y, 80, 30, 1, 1, "F");
  doc.setTextColor(GOLD);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Second Party (Trader)", 60, y + 6, { align: "center" });
  doc.setTextColor(GOLD_LIGHT);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(data.traderName, 60, y + 11, { align: "center" });
  doc.setTextColor(TEXT_MUTED);
  doc.text("Signature: ___________________", 60, y + 19, { align: "center" });
  doc.text("Date: ___________________", 60, y + 24, { align: "center" });

  drawFooter(doc, 2);
  doc.save(`Contract_${data.contractId}.pdf`);
}

// ═══════════════════════════════════════════════════════════════
// BOOKING REPORT PDF
// ═══════════════════════════════════════════════════════════════
export interface BookingReportData {
  bookingId: string;
  expoName: string;
  boothNumber: string;
  boothType: string;
  boothSize: string;
  status: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  paidAmount: number;
  remaining: number;
  services: string[];
  traderName: string;
  traderCompany: string;
}

export async function generateBookingPDF(data: BookingReportData) {
  const doc = createDoc();
  drawBackground(doc);
  let y = drawHeader(doc, `Booking Report — ${data.bookingId}`, "Booking Report");

  // Status badge
  const statusColor = data.status === "Confirmed" || data.status === "مؤكد" ? GREEN : YELLOW;
  const statusText = data.status === "مؤكد" ? "Confirmed" : data.status === "بانتظار الدفع" ? "Pending Payment" : data.status;
  doc.setFillColor(statusColor);
  doc.roundedRect(80, y, 50, 7, 2, 2, "F");
  doc.setTextColor("#000000");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(statusText, 105, y + 5, { align: "center" });
  y += 12;

  // Booking Details
  y = drawSectionTitle(doc, y, "Booking Details");
  y = drawInfoRow(doc, y, "Booking ID", data.bookingId);
  y = drawInfoRow(doc, y, "Expo Name", data.expoName);
  y = drawInfoRow(doc, y, "Booth Number", data.boothNumber);
  y = drawInfoRow(doc, y, "Booth Type", data.boothType);
  y = drawInfoRow(doc, y, "Area", data.boothSize);
  y = drawInfoRow(doc, y, "Start Date", data.startDate);
  y = drawInfoRow(doc, y, "End Date", data.endDate);

  // Trader Info
  y = drawSectionTitle(doc, y + 2, "Trader Information");
  y = drawInfoRow(doc, y, "Trader Name", data.traderName);
  y = drawInfoRow(doc, y, "Company", data.traderCompany);

  // Financial KPIs
  y = drawSectionTitle(doc, y + 2, "Financial Summary");
  y = drawKPICards(doc, y, [
    { label: "Total Cost", value: `${data.totalCost.toLocaleString()} SAR`, color: GOLD },
    { label: "Paid Amount", value: `${data.paidAmount.toLocaleString()} SAR`, color: GREEN },
    { label: "Remaining", value: `${data.remaining.toLocaleString()} SAR`, color: YELLOW },
  ]);

  // Services
  if (data.services.length > 0) {
    y = drawSectionTitle(doc, y + 2, "Additional Services");
    data.services.forEach(s => {
      doc.setFillColor(SECTION_BG);
      doc.roundedRect(20, y, 170, 6, 1, 1, "F");
      doc.setTextColor(GOLD_LIGHT);
      doc.setFontSize(7);
      doc.text(`- ${s}`, 180, y + 4, { align: "right" });
      y += 7;
    });
  }

  drawFooter(doc);
  doc.save(`Booking_${data.bookingId}.pdf`);
}

// ═══════════════════════════════════════════════════════════════
// PAYMENTS REPORT PDF
// ═══════════════════════════════════════════════════════════════
export interface PaymentReportData {
  payments: {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: string;
    description: string;
  }[];
  traderName: string;
  traderCompany: string;
  totalPaid: number;
  totalPending: number;
}

export async function generatePaymentsPDF(data: PaymentReportData) {
  const doc = createDoc();
  drawBackground(doc);
  let y = drawHeader(doc, `Payments Report — ${data.traderName}`, "Payments Report");

  // KPIs
  y = drawKPICards(doc, y, [
    { label: "Total Paid", value: `${data.totalPaid.toLocaleString()} SAR`, color: GREEN },
    { label: "Pending", value: `${data.totalPending.toLocaleString()} SAR`, color: YELLOW },
    { label: "Transactions", value: `${data.payments.length}`, color: GOLD },
  ]);

  // Payments Table
  y = drawSectionTitle(doc, y + 2, "Payment Details");
  
  const rows = data.payments.map(p => [
    p.id,
    p.date,
    `${p.amount.toLocaleString()} SAR`,
    p.method,
    p.status === "مكتمل" || p.status === "مؤكد" ? "Confirmed" : "Pending",
    p.description,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Amount", "Method", "Status", "Description"]],
    body: rows,
    theme: "grid",
    styles: { fontSize: 6.5, cellPadding: 2, textColor: TEXT_LIGHT, fillColor: "#0f1626", lineColor: "#283246", lineWidth: 0.2 },
    headStyles: { fillColor: "#1e2a41", textColor: GOLD, fontStyle: "bold", fontSize: 7 },
    alternateRowStyles: { fillColor: "#141e30" },
    margin: { left: 20, right: 20 },
    columnStyles: {
      4: { cellWidth: 18 },
    },
  });

  drawFooter(doc);
  doc.save(`Payments_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS REPORT PDF
// ═══════════════════════════════════════════════════════════════
export interface AnalyticsReportData {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: string;
  topExpos: { name: string; revenue: number; bookings: number }[];
  traderName: string;
}

export async function generateAnalyticsPDF(data: AnalyticsReportData) {
  const doc = createDoc();
  drawBackground(doc);
  let y = drawHeader(doc, `Analytics Report — ${data.period}`, "Analytics Report");

  // KPIs
  y = drawKPICards(doc, y, [
    { label: "Total Revenue", value: `${data.totalRevenue.toLocaleString()} SAR`, color: GOLD },
    { label: "Total Bookings", value: `${data.totalBookings}`, color: GREEN },
    { label: "Occupancy Rate", value: data.occupancyRate, color: "#3b82f6" },
  ]);

  // Top Expos Table
  if (data.topExpos.length > 0) {
    y = drawSectionTitle(doc, y + 2, "Top Performing Expos");
    
    const rows = data.topExpos.map(e => [
      e.name,
      `${e.revenue.toLocaleString()} SAR`,
      `${e.bookings}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Expo Name", "Revenue", "Bookings"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 2, textColor: TEXT_LIGHT, fillColor: "#0f1626", lineColor: "#283246", lineWidth: 0.2 },
      headStyles: { fillColor: "#1e2a41", textColor: GOLD, fontStyle: "bold", fontSize: 7 },
      alternateRowStyles: { fillColor: "#141e30" },
      margin: { left: 20, right: 20 },
    });
  }

  // Notes
  y = (doc as any).lastAutoTable?.finalY + 8 || y + 8;
  y = drawSectionTitle(doc, y, "Notes");
  doc.setTextColor(TEXT_MUTED);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("This report was generated automatically from Maham Expo platform.", 105, y + 5, { align: "center" });
  doc.text("Data shown represents the selected period and may differ from final audited figures.", 105, y + 9, { align: "center" });
  doc.text("For inquiries, contact support via email or phone.", 105, y + 13, { align: "center" });

  drawFooter(doc);
  doc.save(`Analytics_${data.period.replace(/\s/g, "_")}.pdf`);
}
