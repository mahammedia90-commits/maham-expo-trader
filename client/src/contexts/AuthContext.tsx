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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode] = useState(() => {
    // Generate a random 4-digit OTP for demo
    return String(Math.floor(1000 + Math.random() * 9000));
  });

  // Load saved auth state
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

  const logout = useCallback(() => {
    setTrader(null);
    setAuthStep("phone");
    setPhoneNumber("");
    setOtpSent(false);
    setOtpVerified(false);
    localStorage.removeItem(STORAGE_KEY);
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
