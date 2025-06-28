import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { NetworkInterface } from '@/types/mikrotik';
import DeviceSelector from '@/components/DeviceSelector/DeviceSelector';
import { MikroTikDevice } from '@/types/mikrotik';

const Traffic = () => {
  const [selectedDevice, setSelectedDevice] = useState('1');
  const [selectedInterface, setSelectedInterface] = useState('all');
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);

  // Datos simulados de dispositivos
  const [devices] = useState<MikroTikDevice[]>([]);

  useEffect(() => {
    setInterfaces([]);
    setTrafficData([]);
  }, [selectedDevice]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatRate = (rate: number) => {
    return formatBytes(rate) + '/s';
  };

  const getInterfaceIcon = (type: string) => {
    switch (type) {
      case 'ethernet': return '🔌';
      case 'wireless': return '📶';
      case 'vpn': return '🔒';
      case 'bridge': return '🌉';
      default: return '⚡';
    }
  };

  const selectedDeviceName = devices.find(d => d.id === selectedDevice)?.name || 'Dispositivo desconocido';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tráfico de Red</h1>
          <p className="text-gray-600">Monitoreo de interfaces y ancho de banda - {selectedDeviceName}</p>
        </div>
        <div className="flex space-x-4">
          <DeviceSelector
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={setSelectedDevice}
          />
          <Select value={selectedInterface} onValueChange={setSelectedInterface}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar interfaz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las interfaces</SelectItem>
              {interfaces.map((iface) => (
                <SelectItem key={iface.id} value={iface.id}>
                  {iface.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gráfico de tráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Tráfico en Tiempo Real</CardTitle>
          <CardDescription>
            Ancho de banda utilizado en las últimas 24 horas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value} KB/s`, name === 'rx' ? 'Descarga' : 'Subida']} />
              <Line type="monotone" dataKey="rx" stroke="#8884d8" strokeWidth={2} name="rx" />
              <Line type="monotone" dataKey="tx" stroke="#82ca9d" strokeWidth={2} name="tx" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista de interfaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interfaces.length === 0 ? (
          <p className="text-sm text-gray-500 col-span-3">No hay interfaces disponibles</p>
        ) : (
        interfaces.map((iface) => (
          <Card key={iface.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getInterfaceIcon(iface.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{iface.name}</CardTitle>
                    <CardDescription className="capitalize">{iface.type}</CardDescription>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${iface.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">RX Total</p>
                  <p className="font-medium">{formatBytes(iface.rxBytes)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TX Total</p>
                  <p className="font-medium">{formatBytes(iface.txBytes)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">RX Rate</p>
                  <p className="font-medium text-blue-600">{formatRate(iface.rxRate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TX Rate</p>
                  <p className="font-medium text-green-600">{formatRate(iface.txRate)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Descarga</span>
                  <span className="text-sm text-blue-600">{formatRate(iface.rxRate)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((iface.rxRate / 10000000) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mb-2 mt-3">
                  <span className="text-sm text-gray-500">Subida</span>
                  <span className="text-sm text-green-600">{formatRate(iface.txRate)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((iface.txRate / 10000000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>
    </div>
  );
};

export default Traffic;
