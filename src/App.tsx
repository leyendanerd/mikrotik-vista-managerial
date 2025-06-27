
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { LoginPage } from "./components/Login/LoginPage";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Traffic from "./pages/Traffic";
import Wireless from "./pages/Wireless";
import Alerts from "./pages/Alerts";
import Backups from "./pages/Backups";
import Users from "./pages/Users";
import Config from "./pages/Config";
import PPPoEUsersPage from "./pages/PPPoEUsers";
import Email from "./pages/Email";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Lógica de autenticación simple
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/traffic" element={<Traffic />} />
              <Route path="/vpn" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Gestión de VPN</h1><p className="text-gray-600 mt-2">Próximamente...</p></div>} />
              <Route path="/wireless" element={<Wireless />} />
              <Route path="/pppoe" element={<PPPoEUsersPage />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/backups" element={<Backups />} />
              <Route path="/users" element={<Users />} />
              <Route path="/email" element={<Email />} />
              <Route path="/config" element={<Config />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
