import { Switch, Route } from "wouter";
import { QueryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@components/ui/toaster";
import TooltipProvider from "@components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import HomePage from "@/pages/HomePage";
import BrowsePage from "@/pages/BrowsePage";
import CommunityPage from "@/pages/CommunityPage";
import PricingPage from "@/pages/PricingPage";
import NotFound from "@/pages/NotFound";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/browse" component={BrowsePage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
