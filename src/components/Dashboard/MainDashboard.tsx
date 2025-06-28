
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Bell, Key, Settings } from 'lucide-react';
import { MikroTikDevice, Alert } from '@/types/mikrotik';

export const MainDashboard: React.FC = () => {
  const [devices, setDevices] = useState<MikroTikDevice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Cargar datos desde la API
    setDevices([]);
    setAlerts([]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En línea';
      case 'warning': return 'Advertencia';
      case 'offline': return 'Fuera de línea';
      default: return 'Desconocido';
    }
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispositivos Online</CardTitle>
            <Monitor className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineDevices}</div>
            <p className="text-xs text-muted-foreground">
              de {devices.length} dispositivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningDevices}</div>
            <p className="text-xs text-muted-foreground">
              dispositivos con advertencias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuera de línea</CardTitle>
            <Monitor className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{offlineDevices}</div>
            <p className="text-xs text-muted-foreground">
              dispositivos desconectados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Nuevas</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unacknowledgedAlerts}</div>
            <p className="text-xs text-muted-foreground">
              alertas sin revisar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de dispositivos */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Dispositivos</CardTitle>
          <CardDescription>
            Monitoreo en tiempo real de todos los equipos MikroTik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-gray-500">{device.ip} - {device.board}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">v{device.version}</p>
                    <p className="text-xs text-gray-500">Uptime: {device.uptime}</p>
                  </div>
                  <Badge variant={device.status === 'online' ? 'default' : device.status === 'warning' ? 'secondary' : 'destructive'}>
                    {getStatusText(device.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Recientes</CardTitle>
          <CardDescription>
            Últimas notificaciones del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'critical' ? 'bg-red-500' : 
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{alert.deviceName}</h4>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                {!alert.acknowledged && (
                  <Badge variant="outline" className="text-xs">
                    Nuevo
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
