
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  Monitor,
  Settings,
  Bell,
  User,
  File,
  Calendar,
  Book,
  Users,
  Mail
} from 'lucide-react';
import { useGeneralConfig } from '@/hooks/useGeneralConfig';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: Monitor },
  { title: 'Dispositivos', url: '/devices', icon: Settings },
  { title: 'Tráfico de Red', url: '/traffic', icon: Monitor },
  { title: 'Wireless', url: '/wireless', icon: Monitor },
  { title: 'Usuarios PPPoE', url: '/pppoe', icon: Users },
  { title: 'Alertas', url: '/alerts', icon: Bell },
  { title: 'Backups', url: '/backups', icon: File },
  { title: 'Usuarios', url: '/users', icon: User },
  { title: 'Email', url: '/email', icon: Mail },
  { title: 'Configuración', url: '/config', icon: Settings },
];

export const DashboardSidebar: React.FC = () => {
  const { state } = useSidebar();
  const [generalConfig] = useGeneralConfig();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-blue-100 text-blue-800 font-medium dark:bg-blue-800/20 dark:text-blue-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))]">
        <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              {React.createElement(Icons[generalConfig.loginIcon as keyof typeof Icons] ?? Monitor, {
                className: 'w-5 h-5 text-white',
              })}
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold">{generalConfig.appName}</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase text-xs font-semibold px-4 py-2">
            {!isCollapsed && 'Navegación'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg mx-2 transition-colors ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Administrador</p>
                <p className="text-xs text-gray-500">admin@mikrotik.local</p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
