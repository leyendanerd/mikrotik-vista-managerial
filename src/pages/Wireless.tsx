import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WirelessInterface } from '@/types/mikrotik';
import { Wifi, WifiOff, Signal, Users, Settings } from 'lucide-react';
import DeviceSelector from '@/components/DeviceSelector/DeviceSelector';
import { MikroTikDevice } from '@/types/mikrotik';

const Wireless = () => {
  const [selectedDevice, setSelectedDevice] = useState('1');
  const [wirelessInterfaces, setWirelessInterfaces] = useState<WirelessInterface[]>([
    {
      id: '1',
      name: 'wlan1',
      ssid: 'MiEmpresa-WiFi',
      frequency: '2.4GHz',
      signal: -45,
      clients: 12,
      rxBytes: 1234567890,
      txBytes: 987654321,
      status: 'up',
    },
    {
      id: '2',
      name: 'wlan2',
      ssid: 'MiEmpresa-5G',
      frequency: '5GHz',
      signal: -38,
      clients: 8,
      rxBytes: 2345678901,
      txBytes: 1876543210,
      status: 'up',
    },
    {
      id: '3',
      name: 'wlan3',
      ssid: 'Invitados',
      frequency: '2.4GHz',
      signal: -52,
      clients: 5,
      rxBytes: 567890123,
      txBytes: 345678901,
      status: 'up',
    },
    {
      id: '4',
      name: 'wlan4',
      ssid: 'BackupAP',
      frequency: '5GHz',
      signal: 0,
      clients: 0,
      rxBytes: 0,
      txBytes: 0,
      status: 'down',
    },
  ]);

  // Datos simulados de dispositivos
  const [devices] = useState<MikroTikDevice[]>([
    {
      id: '1',
      name: 'Router Principal',
      ip: '192.168.1.1',
      port: 8728,
      username: 'admin',
      password: '',
      useHttps: true,
      status: 'online',
      lastSeen: new Date(),
      version: '7.10.1',
      board: 'RB4011iGS+',
      uptime: '15d 3h 42m'
    },
    {
      id: '2',
      name: 'Access Point WiFi',
      ip: '192.168.1.2',
      port: 8728,
      username: 'admin',
      password: '',
      useHttps: false,
      status: 'online',
      lastSeen: new Date(),
      version: '7.9.2',
      board: 'cAP ac',
      uptime: '8d 12h 15m'
    }
  ]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSignalStrength = (signal: number) => {
    if (signal === 0) return 0;
    if (signal >= -30) return 100;
    if (signal >= -50) return 75;
    if (signal >= -70) return 50;
    if (signal >= -90) return 25;
    return 10;
  };

  const getSignalColor = (signal: number) => {
    const strength = getSignalStrength(signal);
    if (strength >= 75) return 'text-green-500';
    if (strength >= 50) return 'text-yellow-500';
    if (strength >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const toggleInterface = (interfaceId: string) => {
    setWirelessInterfaces(interfaces =>
      interfaces.map(iface =>
        iface.id === interfaceId
          ? { ...iface, status: iface.status === 'up' ? 'down' : 'up' }
          : iface
      )
    );
  };

  const selectedDeviceName = devices.find(d => d.id === selectedDevice)?.name || 'Dispositivo desconocido';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión Wireless</h1>
          <p className="text-gray-600">{selectedDeviceName}</p>
        </div>
        <div className="flex space-x-4">
          <DeviceSelector
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={setSelectedDevice}
          />
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configurar WiFi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interfaces Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {wirelessInterfaces.filter(iface => iface.status === 'up').length}
                </p>
              </div>
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {wirelessInterfaces.reduce((sum, iface) => sum + iface.clients, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Datos Recibidos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatBytes(wirelessInterfaces.reduce((sum, iface) => sum + iface.rxBytes, 0))}
                </p>
              </div>
              <Signal className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Datos Enviados</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatBytes(wirelessInterfaces.reduce((sum, iface) => sum + iface.txBytes, 0))}
                </p>
              </div>
              <Signal className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wifi className="w-5 h-5 mr-2" />
            Interfaces Wireless
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wirelessInterfaces.map((iface) => (
              <div
                key={iface.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {iface.status === 'up' ? (
                    <Wifi className="w-8 h-8 text-green-500" />
                  ) : (
                    <WifiOff className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900">{iface.name}</h3>
                      <Badge variant={iface.status === 'up' ? 'default' : 'secondary'}>
                        {iface.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{iface.ssid}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span>{iface.frequency}</span>
                        {iface.status === 'up' && (
                          <>
                            <span className="flex items-center">
                              <Signal className={`w-4 h-4 mr-1 ${getSignalColor(iface.signal)}`} />
                              {iface.signal} dBm
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {iface.clients} clientes
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {iface.status === 'up' && (
                    <div className="text-right text-sm">
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-500">RX: </span>
                          <span className="font-medium">{formatBytes(iface.rxBytes)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">TX: </span>
                          <span className="font-medium">{formatBytes(iface.txBytes)}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Señal</div>
                        <Progress value={getSignalStrength(iface.signal)} className="w-20 h-2" />
                      </div>
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    variant={iface.status === 'up' ? 'destructive' : 'default'}
                    onClick={() => toggleInterface(iface.id)}
                  >
                    {iface.status === 'up' ? 'Deshabilitar' : 'Habilitar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wireless;
