
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Settings, Trash2, Eye, EyeOff, Edit } from 'lucide-react';
import { PPPoEUser, PPPoEProfile } from '@/types/mikrotik';
import { useToast } from '@/hooks/use-toast';

interface PPPoEUsersProps {
  deviceId: string;
  deviceName: string;
}

const PPPoEUsers: React.FC<PPPoEUsersProps> = ({ deviceId, deviceName }) => {
  const [users, setUsers] = useState<PPPoEUser[]>([]);
  const [profiles, setProfiles] = useState<PPPoEProfile[]>([]);

  const [newUser, setNewUser] = useState<Partial<PPPoEUser>>({
    name: '',
    password: '',
    profile: '',
    service: 'any',
    callerIdPattern: '',
    disabled: false,
    comment: ''
  });

  const [newProfile, setNewProfile] = useState<Partial<PPPoEProfile>>({
    name: '',
    localAddress: '10.0.0.1',
    remoteAddress: '10.0.0.0/24',
    rateLimitRx: '1M/2M',
    rateLimitTx: '1M/2M',
    sessionTimeout: 0,
    idleTimeout: 0,
    onlyOne: true,
    changePasswordTo: '',
    useCompression: false,
    useEncryption: false,
    bridgeEnabled: false,
    bridgePath: ''
  });

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [editingUser, setEditingUser] = useState<PPPoEUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleAddUser = () => {
    if (!newUser.name || !newUser.password || !newUser.profile) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const user: PPPoEUser = {
      id: Date.now().toString(),
      name: newUser.name!,
      password: newUser.password!,
      profile: newUser.profile!,
      service: newUser.service || 'any',
      callerIdPattern: newUser.callerIdPattern || '',
      disabled: newUser.disabled || false,
      comment: newUser.comment || '',
      bytesIn: 0,
      bytesOut: 0,
      packetsIn: 0,
      packetsOut: 0,
      isActive: false
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      password: '',
      profile: '',
      service: 'any',
      callerIdPattern: '',
      disabled: false,
      comment: ''
    });
    setIsUserDialogOpen(false);

    toast({
      title: "Usuario PPPoE creado",
      description: `Usuario ${user.name} agregado exitosamente`,
    });
  };

  const handleAddProfile = () => {
    if (!newProfile.name) {
      toast({
        title: "Error",
        description: "El nombre del perfil es requerido",
        variant: "destructive",
      });
      return;
    }

    const profile: PPPoEProfile = {
      id: Date.now().toString(),
      name: newProfile.name!,
      localAddress: newProfile.localAddress || '10.0.0.1',
      remoteAddress: newProfile.remoteAddress || '10.0.0.0/24',
      rateLimitRx: newProfile.rateLimitRx || '1M/2M',
      rateLimitTx: newProfile.rateLimitTx || '1M/2M',
      sessionTimeout: newProfile.sessionTimeout || 0,
      idleTimeout: newProfile.idleTimeout || 0,
      onlyOne: newProfile.onlyOne || true,
      changePasswordTo: newProfile.changePasswordTo || '',
      useCompression: newProfile.useCompression || false,
      useEncryption: newProfile.useEncryption || false,
      bridgeEnabled: newProfile.bridgeEnabled || false,
      bridgePath: newProfile.bridgePath || ''
    };

    setProfiles([...profiles, profile]);
    setNewProfile({
      name: '',
      localAddress: '10.0.0.1',
      remoteAddress: '10.0.0.0/24',
      rateLimitRx: '1M/2M',
      rateLimitTx: '1M/2M',
      sessionTimeout: 0,
      idleTimeout: 0,
      onlyOne: true,
      changePasswordTo: '',
      useCompression: false,
      useEncryption: false,
      bridgeEnabled: false,
      bridgePath: ''
    });
    setIsProfileDialogOpen(false);

    toast({
      title: "Perfil PPPoE creado",
      description: `Perfil ${profile.name} agregado exitosamente`,
    });
  };

  const handleEditUser = (user: PPPoEUser) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser || !editingUser.name || !editingUser.password || !editingUser.profile) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setEditingUser(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Usuario actualizado",
      description: `Usuario ${editingUser.name} actualizado exitosamente`,
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuario eliminado",
      description: "Usuario PPPoE eliminado exitosamente",
    });
  };

  const deleteProfile = (profileId: string) => {
    setProfiles(profiles.filter(profile => profile.id !== profileId));
    toast({
      title: "Perfil eliminado",
      description: "Perfil PPPoE eliminado exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="profiles">Perfiles</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-passwords"
                checked={showPasswords}
                onCheckedChange={setShowPasswords}
              />
              <Label htmlFor="show-passwords">Mostrar contraseñas</Label>
            </div>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Usuario PPPoE</DialogTitle>
                  <DialogDescription>
                    Configura un nuevo usuario PPPoE para {deviceName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Nombre de usuario *</Label>
                    <Input
                      id="user-name"
                      value={newUser.name || ''}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="cliente1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Contraseña *</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={newUser.password || ''}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="contraseña123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-profile">Perfil *</Label>
                    <Select
                      value={newUser.profile || ''}
                      onValueChange={(value) => setNewUser({...newUser, profile: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.name}>
                            {profile.name} ({profile.rateLimitRx})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-comment">Comentario</Label>
                    <Input
                      id="user-comment"
                      value={newUser.comment || ''}
                      onChange={(e) => setNewUser({...newUser, comment: e.target.value})}
                      placeholder="Cliente residencial"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="user-disabled"
                      checked={newUser.disabled || false}
                      onCheckedChange={(checked) => setNewUser({...newUser, disabled: checked})}
                    />
                    <Label htmlFor="user-disabled">Deshabilitado</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddUser} className="flex-1">
                      Crear Usuario
                    </Button>
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Usuario PPPoE</DialogTitle>
                <DialogDescription>
                  Modifica los datos del usuario para {deviceName}
                </DialogDescription>
              </DialogHeader>
              {editingUser && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-name">Nombre de usuario *</Label>
                    <Input
                      id="edit-user-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-password">Contraseña *</Label>
                    <Input
                      id="edit-user-password"
                      type="password"
                      value={editingUser.password}
                      onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-profile">Perfil *</Label>
                    <Select
                      value={editingUser.profile}
                      onValueChange={(value) => setEditingUser({...editingUser, profile: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.name}>
                            {profile.name} ({profile.rateLimitRx})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-comment">Comentario</Label>
                    <Input
                      id="edit-user-comment"
                      value={editingUser.comment}
                      onChange={(e) => setEditingUser({...editingUser, comment: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-user-disabled"
                      checked={editingUser.disabled}
                      onCheckedChange={(checked) => setEditingUser({...editingUser, disabled: checked})}
                    />
                    <Label htmlFor="edit-user-disabled">Deshabilitado</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateUser} className="flex-1">
                      Actualizar Usuario
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Card>
            <CardContent className="p-0">
              {users.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay usuarios PPPoE configurados</p>
                  <p className="text-sm text-gray-400 mt-1">Crea un nuevo usuario para comenzar</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Contraseña</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Datos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.comment && <p className="text-sm text-gray-500">{user.comment}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {showPasswords ? user.password : '••••••••'}
                        </TableCell>
                        <TableCell>{user.profile}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : user.disabled ? 'destructive' : 'secondary'}>
                            {user.isActive ? 'Conectado' : user.disabled ? 'Deshabilitado' : 'Desconectado'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.ipAddress || '-'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>↓ {formatBytes(user.bytesIn)}</div>
                            <div>↑ {formatBytes(user.bytesOut)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crear Perfil PPPoE</DialogTitle>
                  <DialogDescription>
                    Configura un nuevo perfil PPPoE para {deviceName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Nombre del perfil *</Label>
                    <Input
                      id="profile-name"
                      value={newProfile.name || ''}
                      onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                      placeholder="profile-1M"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-rx-limit">Límite RX</Label>
                      <Input
                        id="profile-rx-limit"
                        value={newProfile.rateLimitRx || ''}
                        onChange={(e) => setNewProfile({...newProfile, rateLimitRx: e.target.value})}
                        placeholder="1M/2M"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-tx-limit">Límite TX</Label>
                      <Input
                        id="profile-tx-limit"
                        value={newProfile.rateLimitTx || ''}
                        onChange={(e) => setNewProfile({...newProfile, rateLimitTx: e.target.value})}
                        placeholder="1M/2M"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-local-addr">Dirección Local</Label>
                      <Input
                        id="profile-local-addr"
                        value={newProfile.localAddress || ''}
                        onChange={(e) => setNewProfile({...newProfile, localAddress: e.target.value})}
                        placeholder="10.0.0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-remote-addr">Dirección Remota</Label>
                      <Input
                        id="profile-remote-addr"
                        value={newProfile.remoteAddress || ''}
                        onChange={(e) => setNewProfile({...newProfile, remoteAddress: e.target.value})}
                        placeholder="10.0.0.0/24"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="profile-only-one"
                      checked={newProfile.onlyOne || false}
                      onCheckedChange={(checked) => setNewProfile({...newProfile, onlyOne: checked})}
                    />
                    <Label htmlFor="profile-only-one">Solo una sesión</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddProfile} className="flex-1">
                      Crear Perfil
                    </Button>
                    <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay perfiles PPPoE configurados</p>
              <p className="text-sm text-gray-400 mt-1">Crea un nuevo perfil para asignar a los usuarios</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription>
                          RX: {profile.rateLimitRx} | TX: {profile.rateLimitTx}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProfile(profile.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Local</p>
                        <p className="font-mono">{profile.localAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remoto</p>
                        <p className="font-mono">{profile.remoteAddress}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Solo una sesión:</span>
                      <Badge variant={profile.onlyOne ? 'default' : 'secondary'}>
                        {profile.onlyOne ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PPPoEUsers;
