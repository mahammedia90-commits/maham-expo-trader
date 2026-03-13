/**
 * AuthContext — Trader Authentication & Registration System
 * Flow: Phone → OTP → Trader Name → Company → Activity → Region → Dashboard
 * Protects booking until KYC is fully verified
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [otpCode] = useState(() => {
    // Generate a random 4-digit OTP for demo
    return String(Math.floor(1000 + Math.random() * 9000));
  });

  // Load saved auth state + notifications
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
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      }
      const savedPending = localStorage.getItem("maham_pending_bookings");
      if (savedPending) setPendingBookingsCount(parseInt(savedPending) || 0);
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  // Save auth state
  useEffect(() => {
    if (trader && authStep === "complete") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trader));
    }
  }, [trader, authStep]);

  const isAuthenticated = !!trader && authStep === "complete";

  // Can book only if KYC is verified and documents uploaded
  const canBook = isAuthenticated && trader!.kycStatus === "verified" && trader!.documentsUploaded && trader!.accountVerified;

  const sendOTP = useCallback(async (phone?: string): Promise<boolean> => {
    const num = phone || phoneNumber;
    if (!num || num.length < 9) return false;
    // Simulate sending OTP
    await new Promise(r => setTimeout(r, 1200));
    setOtpSent(true);
    setAuthStep("otp");
    return true;
  }, [phoneNumber]);

  const verifyOTP = useCallback(async (code: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    // Accept any 4-digit code for demo, or match generated code
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
      const updated: TraderProfile = {
        ...trader,
        kycStatus: "verified",
        documentsUploaded: true,
        accountVerified: true,
      };
      setTrader(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [trader]);

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
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    localStorage.removeItem("maham_pending_bookings");
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      trader,
      authStep,
      otpCode,
      otpSent,
      otpVerified,
      phoneNumber,
      canBook,
      notifications,
      unreadCount,
      pendingBookingsCount,
      addNotification,
      markNotificationRead,
      markAllRead,
      addPendingBooking,
      setPhoneNumber,
      sendOTP,
      verifyOTP,
      completeRegistration,
      completeKYC,
      logout,
      setAuthStep,
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
