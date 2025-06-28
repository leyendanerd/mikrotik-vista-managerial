
import React, { useState } from 'react';
import { MikroTikDevice } from '@/types/mikrotik';
import DeviceSelector from '@/components/DeviceSelector/DeviceSelector';
import PPPoEUsers from '@/components/PPPoE/PPPoEUsers';

const PPPoEUsersPage = () => {
  const [selectedDevice, setSelectedDevice] = useState('');

  // Lista de dispositivos obtenida desde la API
  const [devices] = useState<MikroTikDevice[]>([]);

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
