
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Settings, Monitor, Edit, Trash2 } from 'lucide-react';
import { MikroTikDevice } from '@/types/mikrotik';
import { useToast } from '@/hooks/use-toast';

const Devices = () => {
  const [devices, setDevices] = useState<MikroTikDevice[]>([]);
  const formatUptime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };
  useEffect(() => {
    fetch('/api/devices')
      .then((r) => r.json())
      .then((data) =>
        setDevices(
          data.map((d: any) => ({
            id: d.id.toString(),
            name: d.name,
            ip: d.ip_address,
            port: d.port,
            username: d.username,
            password: d.password_encrypted,
            useHttps: !!d.use_https,
            status: d.status || 'offline',
            lastSeen: d.last_seen ? new Date(d.last_seen) : null,
            version: d.version || 'Desconocido',
            board: d.board || 'Desconocido',
            uptime: d.last_seen ? formatUptime(Date.now() - new Date(d.last_seen).getTime()) : '0d 0h 0m',
          }))
        )
      )
      .catch((e) => console.error('Failed to load devices', e));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(devices => devices.map(d =>
        d.status === 'online' && d.lastSeen
          ? { ...d, uptime: formatUptime(Date.now() - d.lastSeen.getTime()) }
          : d
      ));
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  const [newDevice, setNewDevice] = useState<Partial<MikroTikDevice>>({
    name: '',
    ip: '',
    port: 8728,
    username: 'admin',
    password: '',
    useHttps: false
  });

  const [editingDevice, setEditingDevice] = useState<MikroTikDevice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.ip || !newDevice.username || !newDevice.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    const res = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newDevice.name,
        ip: newDevice.ip,
        port: newDevice.port,
        username: newDevice.username,
        password: newDevice.password,
        useHttps: newDevice.useHttps,
        status: 'offline',
        lastSeen: null,
        version: null,
        board: null,
        uptime: '0d 0h 0m'
      }),
    });
    if (res.ok) {
      const saved = await res.json();
      setDevices([...devices, {
        id: saved.id.toString(),
        name: saved.name,
        ip: saved.ip_address,
        port: saved.port,
        username: saved.username,
        password: saved.password_encrypted,
        useHttps: !!saved.use_https,
        status: saved.status || 'offline',
        lastSeen: saved.last_seen ? new Date(saved.last_seen) : null,
        version: saved.version || 'Desconocido',
        board: saved.board || 'Desconocido',
        uptime: saved.uptime || '0d 0h 0m',
      }]);
    }
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
      description: `${newDevice.name} ha sido agregado exitosamente`,
    });
  };

  const handleEditDevice = (device: MikroTikDevice) => {
    setEditingDevice(device);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDevice = async () => {
    if (!editingDevice || !editingDevice.name || !editingDevice.ip || !editingDevice.username || !editingDevice.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    const res = await fetch(`/api/devices/${editingDevice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editingDevice.name,
        ip: editingDevice.ip,
        port: editingDevice.port,
        username: editingDevice.username,
        password: editingDevice.password,
        useHttps: editingDevice.useHttps,
        status: editingDevice.status,
        lastSeen: editingDevice.lastSeen ? editingDevice.lastSeen.toISOString() : null,
        version: editingDevice.version,
        board: editingDevice.board,
        uptime: editingDevice.uptime,
      }),
    });
    if (res.ok) {
      const saved = await res.json();
      setDevices(devices.map(device =>
        device.id === editingDevice.id ? {
          id: saved.id.toString(),
          name: saved.name,
          ip: saved.ip_address,
          port: saved.port,
          username: saved.username,
          password: saved.password_encrypted,
          useHttps: !!saved.use_https,
          status: saved.status || 'offline',
          lastSeen: saved.last_seen ? new Date(saved.last_seen) : null,
          version: saved.version || 'Desconocido',
          board: saved.board || 'Desconocido',
          uptime: saved.uptime || '0d 0h 0m',
        } : device
      ));
    }

    setEditingDevice(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Dispositivo actualizado",
      description: `${editingDevice.name} actualizado exitosamente`,
    });
  };

  const deleteDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    await fetch(`/api/devices/${deviceId}`, { method: 'DELETE' });
    setDevices(devices.filter(device => device.id !== deviceId));
    toast({
      title: "Dispositivo eliminado",
      description: `${device?.name} eliminado exitosamente`,
    });
  };

  const testConnection = async (device: MikroTikDevice) => {
    toast({
      title: "Probando conexión",
      description: `Conectando con ${device.name}...`,
    });

    // Simulamos una prueba de conexión
    setTimeout(async () => {
      const success = Math.random() > 0.3;

      if (success) {
        const lastSeen = new Date();
        const updated = { ...device, status: 'online' as const, lastSeen };
        setDevices(devices.map(d => d.id === device.id ? { ...updated, uptime: formatUptime(0) } : d));
        await fetch(`/api/devices/${device.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: device.name,
            ip: device.ip,
            port: device.port,
            username: device.username,
            password: device.password,
            useHttps: device.useHttps,
            status: 'online',
            lastSeen: lastSeen.toISOString(),
            version: device.version,
            board: device.board,
            uptime: '0d 0h 0m'
          })
        });
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
                  placeholder="Ej: Router 1"
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

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Dispositivo</DialogTitle>
            <DialogDescription>
              Modifica la configuración del dispositivo MikroTik
            </DialogDescription>
          </DialogHeader>
          {editingDevice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-device-name">Nombre del dispositivo *</Label>
                <Input
                  id="edit-device-name"
                  value={editingDevice.name}
                  onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-ip">Dirección IP *</Label>
                <Input
                  id="edit-device-ip"
                  value={editingDevice.ip}
                  onChange={(e) => setEditingDevice({...editingDevice, ip: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-port">Puerto API</Label>
                <Input
                  id="edit-device-port"
                  type="number"
                  value={editingDevice.port}
                  onChange={(e) => setEditingDevice({...editingDevice, port: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-username">Usuario *</Label>
                <Input
                  id="edit-device-username"
                  value={editingDevice.username}
                  onChange={(e) => setEditingDevice({...editingDevice, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-device-password">Contraseña *</Label>
                <Input
                  id="edit-device-password"
                  type="password"
                  value={editingDevice.password}
                  onChange={(e) => setEditingDevice({...editingDevice, password: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-use-https"
                  checked={editingDevice.useHttps}
                  onCheckedChange={(checked) => setEditingDevice({...editingDevice, useHttps: checked})}
                />
                <Label htmlFor="edit-use-https">Usar HTTPS</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateDevice} className="flex-1">
                  Actualizar Dispositivo
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay dispositivos configurados</h3>
          <p className="text-gray-500 mb-4">Agrega tu primer dispositivo MikroTik para comenzar</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Dispositivo
          </Button>
        </div>
      ) : (
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
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => testConnection(device)}>
                      Probar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDevice(device)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteDevice(device.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Devices;
