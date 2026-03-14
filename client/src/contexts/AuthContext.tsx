/**
 * AuthContext — Trader Authentication, KYC, Bookings, Payments & Contracts
 * Flow: Phone → OTP → Trader Name → Company → Activity → Region → Dashboard
 * KYC stores full merchant data for contract generation
 * Booking → Payment → Contract flow management
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type AuthStep = "phone" | "otp" | "info" | "complete";
export type KYCStatus = "none" | "pending" | "verified" | "rejected";

export interface TraderProfile {
  phone: string;
  name: string;
  companyName: string;
  activity: string;
  region: string;
  kycStatus: KYCStatus;
  documentsUploaded: boolean;
  accountVerified: boolean;
  registeredAt: string;
}

/** Full KYC data collected during verification */
export interface KYCData {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  dob: string;
  nationality: string;
  city: string;
  address: string;
  companyName: string;
  crNumber: string;
  businessType: string;
  founded: string;
  employees: string;
  website: string;
  vatNumber: string;
  nationalAddress: string;
  bankName: string;
  iban: string;
  accountHolder: string;
  accountNumber: string;
}

/** Booking record */
export interface BookingRecord {
  id: string;
  expoId: string;
  expoNameAr: string;
  expoNameEn: string;
  unitAr: string;
  unitEn: string;
  zone: string;
  boothType: string;
  boothSize: string;
  price: number;
  deposit: number;
  paidAmount: number;
  remainingAmount: number;
  status: "pending_review" | "approved" | "pending_payment" | "confirmed" | "active" | "cancelled" | "rejected";
  paymentStatus: "unpaid" | "deposit_paid" | "fully_paid";
  contractGenerated: boolean;
  contractId: string | null;
  createdAt: string;
  services: string[];
  location: string;
}

/** Payment record */
export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  type: "deposit" | "installment" | "full_payment";
  date: string;
  descAr: string;
  descEn: string;
}

/** Contract record — generated ONLY after full payment */
export interface ContractRecord {
  id: string;
  bookingId: string;
  paymentId: string;
  expoName: string;
  expoNameAr: string;
  boothNumber: string;
  boothSize: string;
  totalValue: number;
  deposit: number;
  remaining: number;
  status: "signed" | "pending_signature" | "draft";
  createdAt: string;
  expiresAt: string;
  sentVia: string[];
}

export interface Notification {
  id: string;
  type: "booking" | "payment" | "contract" | "system";
  titleAr: string;
  titleEn: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  trader: TraderProfile | null;
  authStep: AuthStep;
  otpCode: string;
  otpSent: boolean;
  otpVerified: boolean;
  phoneNumber: string;
  canBook: boolean;
  // KYC Data
  kycData: KYCData | null;
  saveKYCData: (data: KYCData) => void;
  // Bookings
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, "id" | "createdAt" | "paymentStatus" | "contractGenerated" | "contractId" | "status" | "paidAmount" | "remainingAmount">) => BookingRecord;
  updateBookingPayment: (bookingId: string, amount: number) => void;
  // Payments
  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, "id" | "date" | "status">) => PaymentRecord;
  // Contracts
  contracts: ContractRecord[];
  addContract: (bookingId: string, paymentId: string) => ContractRecord | null;
  markContractSent: (contractId: string, channel: string) => void;
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  pendingBookingsCount: number;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addPendingBooking: () => void;
  // Actions
  setPhoneNumber: (phone: string) => void;
  sendOTP: (phone?: string) => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  completeRegistration: (data: Omit<TraderProfile, "phone" | "kycStatus" | "documentsUploaded" | "accountVerified" | "registeredAt">) => void;
  logout: () => void;
  setAuthStep: (step: AuthStep) => void;
  completeKYC: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "maham_trader_auth";
const NOTIF_STORAGE_KEY = "maham_notifications";
const KYC_STORAGE_KEY = "maham_kyc_data";
const BOOKINGS_STORAGE_KEY = "maham_bookings";
const PAYMENTS_STORAGE_KEY = "maham_payments";
const CONTRACTS_STORAGE_KEY = "maham_contracts";

function generateId(prefix: string): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(100 + Math.random() * 900));
  return `${prefix}-${year}-${num}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [contracts, setContracts] = useState<ContractRecord[]>([]);
  const [otpCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TraderProfile;
        setTrader(parsed);
        setPhoneNumber(parsed.phone);
        setAuthStep("complete");
        setOtpVerified(true);
      }
      const savedNotifs = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      const savedPending = localStorage.getItem("maham_pending_bookings");
      if (savedPending) setPendingBookingsCount(parseInt(savedPending) || 0);
      const savedKyc = localStorage.getItem(KYC_STORAGE_KEY);
      if (savedKyc) setKycData(JSON.parse(savedKyc));
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      const savedPayments = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      const savedContracts = localStorage.getItem(CONTRACTS_STORAGE_KEY);
      if (savedContracts) setContracts(JSON.parse(savedContracts));
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  // Save auth state
  useEffect(() => {
    if (trader && authStep === "complete") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trader));
    }
  }, [trader, authStep]);

  // Save bookings/payments/contracts
  useEffect(() => { localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts)); }, [contracts]);

  const isAuthenticated = !!trader && authStep === "complete";
  const canBook = isAuthenticated && trader!.kycStatus === "verified" && trader!.documentsUploaded && trader!.accountVerified;

  const sendOTP = useCallback(async (phone?: string): Promise<boolean> => {
    const num = phone || phoneNumber;
    if (!num || num.length < 9) return false;
    await new Promise(r => setTimeout(r, 1200));
    setOtpSent(true);
    setAuthStep("otp");
    return true;
  }, [phoneNumber]);

  const verifyOTP = useCallback(async (code: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    if (code.length === 4) {
      setOtpVerified(true);
      setAuthStep("info");
      return true;
    }
    return false;
  }, []);

  const completeRegistration = useCallback((data: Omit<TraderProfile, "phone" | "kycStatus" | "documentsUploaded" | "accountVerified" | "registeredAt">) => {
    const profile: TraderProfile = {
      phone: phoneNumber,
      name: data.name,
      companyName: data.companyName,
      activity: data.activity,
      region: data.region,
      kycStatus: "pending",
      documentsUploaded: false,
      accountVerified: false,
      registeredAt: new Date().toISOString(),
    };
    setTrader(profile);
    setAuthStep("complete");
  }, [phoneNumber]);

  const completeKYC = useCallback(() => {
    if (trader) {
      const updated: TraderProfile = { ...trader, kycStatus: "verified", documentsUploaded: true, accountVerified: true };
      setTrader(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [trader]);

  const saveKYCData = useCallback((data: KYCData) => {
    setKycData(data);
    localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const addBooking = useCallback((booking: Omit<BookingRecord, "id" | "createdAt" | "paymentStatus" | "contractGenerated" | "contractId" | "status" | "paidAmount" | "remainingAmount">): BookingRecord => {
    const newBooking: BookingRecord = {
      ...booking,
      id: generateId("BK"),
      status: "pending_payment",
      paymentStatus: "unpaid",
      paidAmount: 0,
      remainingAmount: booking.price,
      contractGenerated: false,
      contractId: null,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  }, []);

  const updateBookingPayment = useCallback((bookingId: string, amount: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      const newPaid = b.paidAmount + amount;
      const newRemaining = Math.max(0, b.price - newPaid);
      const isFullyPaid = newRemaining === 0;
      return {
        ...b,
        paidAmount: newPaid,
        remainingAmount: newRemaining,
        paymentStatus: isFullyPaid ? "fully_paid" as const : "deposit_paid" as const,
        status: isFullyPaid ? "confirmed" as const : "pending_payment" as const,
      };
    }));
  }, []);

  const addPayment = useCallback((payment: Omit<PaymentRecord, "id" | "date" | "status">): PaymentRecord => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: generateId("TX"),
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    };
    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  }, []);

  const addContract = useCallback((bookingId: string, paymentId: string): ContractRecord | null => {
    // We need to get the latest booking state
    let targetBooking: BookingRecord | undefined;
    setBookings(prev => {
      targetBooking = prev.find(b => b.id === bookingId);
      return prev;
    });
    if (!targetBooking) return null;

    const contractId = generateId("CT");
    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + 6);

    const newContract: ContractRecord = {
      id: contractId,
      bookingId,
      paymentId,
      expoName: targetBooking.expoNameEn || targetBooking.expoNameAr,
      expoNameAr: targetBooking.expoNameAr,
      boothNumber: targetBooking.unitEn?.match(/[A-Z]\d+/)?.[0] || targetBooking.unitAr,
      boothSize: targetBooking.boothSize,
      totalValue: targetBooking.price,
      deposit: targetBooking.deposit,
      remaining: 0,
      status: "pending_signature",
      createdAt: now.toISOString().split("T")[0],
      expiresAt: expiry.toISOString().split("T")[0],
      sentVia: [],
    };

    setContracts(prev => [newContract, ...prev]);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, contractGenerated: true, contractId } : b));

    return newContract;
  }, []);

  const markContractSent = useCallback((contractId: string, channel: string) => {
    setContracts(prev => prev.map(c =>
      c.id === contractId ? { ...c, sentVia: Array.from(new Set([...c.sentVia, channel])) } : c
    ));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotif: Notification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addPendingBooking = useCallback(() => {
    setPendingBookingsCount(prev => {
      const next = prev + 1;
      localStorage.setItem("maham_pending_bookings", String(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setTrader(null);
    setAuthStep("phone");
    setPhoneNumber("");
    setOtpSent(false);
    setOtpVerified(false);
    setNotifications([]);
    setPendingBookingsCount(0);
    setKycData(null);
    setBookings([]);
    setPayments([]);
    setContracts([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    localStorage.removeItem("maham_pending_bookings");
    localStorage.removeItem(KYC_STORAGE_KEY);
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    localStorage.removeItem(PAYMENTS_STORAGE_KEY);
    localStorage.removeItem(CONTRACTS_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isLoading, trader, authStep, otpCode, otpSent, otpVerified, phoneNumber, canBook,
      kycData, saveKYCData,
      bookings, addBooking, updateBookingPayment,
      payments, addPayment,
      contracts, addContract, markContractSent,
      notifications, unreadCount, pendingBookingsCount,
      addNotification, markNotificationRead, markAllRead, addPendingBooking,
      setPhoneNumber, sendOTP, verifyOTP, completeRegistration, completeKYC, logout, setAuthStep,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
