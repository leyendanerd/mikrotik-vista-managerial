
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-700';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-gray-900">MikroTik</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-semibold px-4 py-2">
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

        <div className="mt-auto p-4 border-t border-gray-200">
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
