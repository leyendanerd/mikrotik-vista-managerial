
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MikroTikDevice } from '@/types/mikrotik';

interface DeviceSelectorProps {
  devices: MikroTikDevice[];
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
  className?: string;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDevice,
  onDeviceChange,
  className = "w-48"
}) => {
  return (
    <Select value={selectedDevice} onValueChange={onDeviceChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Seleccionar dispositivo" />
      </SelectTrigger>
      <SelectContent>
        {devices.map((device) => (
          <SelectItem key={device.id} value={device.id}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>{device.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DeviceSelector;
