
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, UserPlus, Edit, Trash2, Shield } from 'lucide-react';
import { User as UserType } from '@/types/mikrotik';

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@miempresa.com',
      role: 'admin',
      lastLogin: new Date('2024-01-15T10:30:00'),
      active: true,
    },
    {
      id: '2',
      username: 'operador1',
      email: 'operador1@miempresa.com',
      role: 'operator',
      lastLogin: new Date('2024-01-14T15:45:00'),
      active: true,
    },
    {
      id: '3',
      username: 'viewer1',
      email: 'viewer1@miempresa.com',
      role: 'viewer',
      lastLogin: new Date('2024-01-13T09:15:00'),
      active: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'viewer' as 'admin' | 'operator' | 'viewer',
    active: true,
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      operator: 'default',
      viewer: 'secondary',
    } as const;
    return variants[role as keyof typeof variants] || 'secondary';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'operator':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'viewer':
        return <User className="w-4 h-4 text-gray-500" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const openUserDialog = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'viewer',
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const saveUser = () => {
    if (editingUser) {
      // Actualizar usuario existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, lastLogin: user.lastLogin }
          : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser: UserType = {
        id: Date.now().toString(),
        ...formData,
        lastLogin: new Date(),
      };
      setUsers([...users, newUser]);
    }
    setIsDialogOpen(false);
  };

  const deleteUser = (userId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, active: !user.active }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openUserDialog()}>
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre de Usuario</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <Label>Contraseña {editingUser && '(dejar vacío para mantener actual)'}</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="********"
                />
              </div>
              <div>
                <Label>Rol</Label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <option value="viewer">Viewer - Solo lectura</option>
                  <option value="operator">Operator - Operaciones básicas</option>
                  <option value="admin">Admin - Control total</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Usuario activo</Label>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={saveUser} className="flex-1">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Lista de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{user.username}</h3>
                      {getRoleIcon(user.role)}
                      <Badge variant={getRoleBadge(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      {!user.active && <Badge variant="outline">Inactivo</Badge>}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>{user.email}</p>
                      <p>Último acceso: {user.lastLogin.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={user.active}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openUserDialog(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteUser(user.id)}
                    disabled={user.username === 'admin'}
                  >
                    <Trash2 className="w-4 h-4" />
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

export default Users;
