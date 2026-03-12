import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ExpoMap from "./pages/ExpoMap";
import Bookings from "./pages/Bookings";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Operations from "./pages/Operations";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/DashboardLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={() => <DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/map" component={() => <DashboardLayout><ExpoMap /></DashboardLayout>} />
      <Route path="/bookings" component={() => <DashboardLayout><Bookings /></DashboardLayout>} />
      <Route path="/contracts" component={() => <DashboardLayout><Contracts /></DashboardLayout>} />
      <Route path="/payments" component={() => <DashboardLayout><Payments /></DashboardLayout>} />
      <Route path="/operations" component={() => <DashboardLayout><Operations /></DashboardLayout>} />
      <Route path="/analytics" component={() => <DashboardLayout><Analytics /></DashboardLayout>} />
      <Route path="/ai-assistant" component={() => <DashboardLayout><AIAssistant /></DashboardLayout>} />
      <Route path="/profile" component={() => <DashboardLayout><Profile /></DashboardLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
