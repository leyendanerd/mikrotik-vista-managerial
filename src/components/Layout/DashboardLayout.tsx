
import React from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralConfig } from '@/hooks/useGeneralConfig';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const [generalConfig] = useGeneralConfig();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">{generalConfig.appName}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleString()}
                </div>
                {onLogout && (
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={onLogout}
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};
