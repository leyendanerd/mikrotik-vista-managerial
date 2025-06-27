
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Settings, Monitor } from 'lucide-react';
import { MikroTikDevice } from '@/types/mikrotik';
import { useToast } from '@/hooks/use-toast';

const Devices = () => {
  const [devices, setDevices] = useState<MikroTikDevice[]>([
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
    }
  ]);

  const [newDevice, setNewDevice] = useState<Partial<MikroTikDevice>>({
    name: '',
    ip: '',
    port: 8728,
    username: 'admin',
    password: '',
    useHttps: false
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.ip || !newDevice.username || !newDevice.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const device: MikroTikDevice = {
      id: Date.now().toString(),
      name: newDevice.name!,
      ip: newDevice.ip!,
      port: newDevice.port || 8728,
      username: newDevice.username!,
      password: newDevice.password!,
      useHttps: newDevice.useHttps || false,
      status: 'offline',
      lastSeen: new Date(),
      version: 'Desconocido',
      board: 'Desconocido',
      uptime: '0d 0h 0m'
    };

    setDevices([...devices, device]);
    setNewDevice({
      name: '',
      ip: '',
      port: 8728,
      username: 'admin',
      password: '',
      useHttps: false
    });
    setIsDialogOpen(false);

    toast({
      title: "Dispositivo agregado",
      description: `${device.name} ha sido agregado exitosamente`,
    });
  };

  const testConnection = async (device: MikroTikDevice) => {
    toast({
      title: "Probando conexión",
      description: `Conectando con ${device.name}...`,
    });

    // Simulamos una prueba de conexión
    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      if (success) {
        setDevices(devices.map(d => 
          d.id === device.id 
            ? { ...d, status: 'online' as const, lastSeen: new Date() }
            : d
        ));
        toast({
          title: "Conexión exitosa",
          description: `Conectado con ${device.name}`,
        });
      } else {
        toast({
          title: "Error de conexión",
          description: `No se pudo conectar con ${device.name}`,
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Dispositivos</h1>
          <p className="text-gray-600">Administra tus equipos MikroTik</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Dispositivo MikroTik</DialogTitle>
              <DialogDescription>
                Configura la conexión a un nuevo equipo MikroTik
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">Nombre del dispositivo *</Label>
                <Input
                  id="device-name"
                  value={newDevice.name || ''}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  placeholder="Ej: Router Principal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-ip">Dirección IP *</Label>
                <Input
                  id="device-ip"
                  value={newDevice.ip || ''}
                  onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
                  placeholder="Ej: 192.168.1.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-port">Puerto API</Label>
                <Input
                  id="device-port"
                  type="number"
                  value={newDevice.port || 8728}
                  onChange={(e) => setNewDevice({...newDevice, port: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-username">Usuario *</Label>
                <Input
                  id="device-username"
                  value={newDevice.username || ''}
                  onChange={(e) => setNewDevice({...newDevice, username: e.target.value})}
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device-password">Contraseña *</Label>
                <Input
                  id="device-password"
                  type="password"
                  value={newDevice.password || ''}
                  onChange={(e) => setNewDevice({...newDevice, password: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-https"
                  checked={newDevice.useHttps || false}
                  onCheckedChange={(checked) => setNewDevice({...newDevice, useHttps: checked})}
                />
                <Label htmlFor="use-https">Usar HTTPS</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddDevice} className="flex-1">
                  Agregar Dispositivo
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                </div>
                <Monitor className="w-5 h-5 text-gray-500" />
              </div>
              <CardDescription>{device.ip}:{device.port}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Modelo</p>
                  <p className="font-medium">{device.board}</p>
                </div>
                <div>
                  <p className="text-gray-500">Versión</p>
                  <p className="font-medium">{device.version}</p>
                </div>
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-medium">{device.uptime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Protocolo</p>
                  <p className="font-medium">{device.useHttps ? 'HTTPS' : 'HTTP'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                  {device.status === 'online' ? 'En línea' : 'Fuera de línea'}
                </Badge>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => testConnection(device)}>
                    Probar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Devices;
