
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, Check, X } from 'lucide-react';
import { Alert } from '@/types/mikrotik';
import { useEventStream } from '@/hooks/useEventStream';
import DeviceSelector from '@/components/DeviceSelector/DeviceSelector';
import { MikroTikDevice } from '@/types/mikrotik';

const Alerts = () => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Lista de dispositivos obtenida desde la API
  const [devices] = useState<MikroTikDevice[]>([]);

  useEventStream((evt) => {
    if (evt.type === 'alert') {
      setAlerts((a) => [
        ...a,
        {
          id: evt.id || Math.random().toString(36).slice(2),
          deviceId: evt.deviceId,
          deviceName: evt.deviceName,
          type: evt.level === 'error' ? 'critical' : 'info',
          message: evt.message,
          timestamp: evt.timestamp ? new Date(evt.timestamp) : new Date(),
          acknowledged: false,
        },
      ]);
    }
  });

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && alert.deviceId === selectedDevice).length;
  const warningAlerts = alerts.filter(alert => alert.type === 'warning' && alert.deviceId === selectedDevice).length;
  const infoAlerts = alerts.filter(alert => alert.type === 'info' && alert.deviceId === selectedDevice).length;

  const selectedDeviceName = devices.find(d => d.id === selectedDevice)?.name || 'Dispositivo desconocido';
  const filteredAlerts = alerts.filter(alert => alert.deviceId === selectedDevice);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Alertas</h1>
          <p className="text-gray-600">Monitoreo y notificaciones - {selectedDeviceName}</p>
        </div>
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Advertencias</p>
                <p className="text-2xl font-bold text-yellow-600">{warningAlerts}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Informativas</p>
                <p className="text-2xl font-bold text-blue-600">{infoAlerts}</p>
              </div>
              <Info className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas Recientes</CardTitle>
          <CardDescription>
            Historial de alertas del dispositivo seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-4 border-l-4 rounded-lg ${
                    alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {alert.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                    {alert.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">
                        {alert.deviceName} • {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay alertas para el dispositivo seleccionado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
