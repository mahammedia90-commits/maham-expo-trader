import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { lazy, Suspense } from "react";
import DashboardLayout from "./components/DashboardLayout";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExpoMap = lazy(() => import("./pages/ExpoMap"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Contracts = lazy(() => import("./pages/Contracts"));
const Payments = lazy(() => import("./pages/Payments"));
const Operations = lazy(() => import("./pages/Operations"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Profile = lazy(() => import("./pages/Profile"));
const Messages = lazy(() => import("./pages/Messages"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Notifications = lazy(() => import("./pages/Notifications"));
const KYC = lazy(() => import("./pages/KYC"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const BrowseExpos = lazy(() => import("./pages/BrowseExpos"));
const ExpoDetail = lazy(() => import("./pages/ExpoDetail"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 border-2 border-[#C5A55A]/30 border-t-[#C5A55A] rounded-full animate-spin" />
    </div>
  );
}

function DashPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={() => <Suspense fallback={<PageLoader />}><Home /></Suspense>} />
        <Route path="/login" component={() => <Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path="/dashboard" component={() => <DashPage><Dashboard /></DashPage>} />
        <Route path="/map" component={() => <DashPage><ExpoMap /></DashPage>} />
        <Route path="/bookings" component={() => <DashPage><Bookings /></DashPage>} />
        <Route path="/contracts" component={() => <DashPage><Contracts /></DashPage>} />
        <Route path="/payments" component={() => <DashPage><Payments /></DashPage>} />
        <Route path="/operations" component={() => <DashPage><Operations /></DashPage>} />
        <Route path="/analytics" component={() => <DashPage><Analytics /></DashPage>} />
        <Route path="/ai-assistant" component={() => <DashPage><AIAssistant /></DashPage>} />
        <Route path="/profile" component={() => <DashPage><Profile /></DashPage>} />
        <Route path="/expos" component={() => <DashPage><BrowseExpos /></DashPage>} />
        <Route path="/expos/:id" component={() => <DashPage><Suspense fallback={<PageLoader />}><ExpoDetail /></Suspense></DashPage>} />
        <Route path="/messages" component={() => <DashPage><Messages /></DashPage>} />
        <Route path="/reviews" component={() => <DashPage><Reviews /></DashPage>} />
        <Route path="/notifications" component={() => <DashPage><Notifications /></DashPage>} />
        <Route path="/kyc" component={() => <DashPage><KYC /></DashPage>} />
        <Route path="/help" component={() => <DashPage><HelpCenter /></DashPage>} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={true}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
