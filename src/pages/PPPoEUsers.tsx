
import React, { useState } from 'react';
import { MikroTikDevice } from '@/types/mikrotik';
import DeviceSelector from '@/components/DeviceSelector/DeviceSelector';
import PPPoEUsers from '@/components/PPPoE/PPPoEUsers';

const PPPoEUsersPage = () => {
  const [selectedDevice, setSelectedDevice] = useState('1');
  
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

  const selectedDeviceName = devices.find(d => d.id === selectedDevice)?.name || 'Dispositivo desconocido';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Usuarios PPPoE</h1>
          <p className="text-gray-600">Gestión de usuarios PPPoE - {selectedDeviceName}</p>
        </div>
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
        />
      </div>

      <PPPoEUsers 
        deviceId={selectedDevice} 
        deviceName={selectedDeviceName}
      />
    </div>
  );
};

export default PPPoEUsersPage;
