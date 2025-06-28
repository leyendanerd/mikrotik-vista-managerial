
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Database, Mail, Shield, Globe } from 'lucide-react';
import { useGeneralConfig } from '@/hooks/useGeneralConfig';

const Config = () => {
  const [generalConfig, setGeneralConfig] = useGeneralConfig();

  const [databaseConfig, setDatabaseConfig] = useState({
    host: 'localhost',
    port: 3306,
    database: 'mikrotik_dashboard',
    username: 'admin',
    password: '',
    connectionTimeout: 10,
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    username: '',
    password: '',
    fromEmail: '',
    useSSL: true,
  });

  const [securityConfig, setSecurityConfig] = useState({
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    enableTwoFactor: false,
  });

  const [apiConfig, setApiConfig] = useState({
    defaultHttpPort: 80,
    defaultHttpsPort: 443,
    connectionTimeout: 30,
    retryAttempts: 3,
    enableSSLVerification: true,
  });

  const saveGeneralConfig = () => {
    console.log('Guardando configuración general:', generalConfig);
    localStorage.setItem('general-config', JSON.stringify(generalConfig));
  };

  const saveDatabaseConfig = () => {
    console.log('Guardando configuración de base de datos:', databaseConfig);
    // Aquí se conectaría con la API para guardar
  };

  const saveEmailConfig = () => {
    console.log('Guardando configuración de email:', emailConfig);
    // Aquí se conectaría con la API para guardar
  };

  const saveSecurityConfig = () => {
    console.log('Guardando configuración de seguridad:', securityConfig);
    // Aquí se conectaría con la API para guardar
  };

  const saveApiConfig = () => {
    console.log('Guardando configuración de API:', apiConfig);
    // Aquí se conectaría con la API para guardar
  };

  const testDatabaseConnection = () => {
    console.log('Probando conexión a base de datos...');
    // Aquí se implementaría la prueba de conexión
  };

  const testEmailConnection = () => {
    console.log('Probando configuración de email...');
    // Aquí se implementaría el envío de email de prueba
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Base de Datos</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="api">API MikroTik</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre de la Aplicación</Label>
                <Input
                  value={generalConfig.appName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, appName: e.target.value })}
                />
              </div>
              <div>
                <Label>Ícono de Login (nombre de lucide)</Label>
                <Input
                  value={generalConfig.loginIcon}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, loginIcon: e.target.value })}
                />
              </div>
              <div>
                <Label>Intervalo de Actualización (segundos)</Label>
                <Input
                  type="number"
                  value={generalConfig.refreshInterval}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, refreshInterval: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={generalConfig.enableNotifications}
                  onCheckedChange={(checked) => setGeneralConfig({ ...generalConfig, enableNotifications: checked })}
                />
                <Label>Habilitar notificaciones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={generalConfig.darkMode}
                  onCheckedChange={(checked) => setGeneralConfig({ ...generalConfig, darkMode: checked })}
                />
                <Label>Modo oscuro</Label>
              </div>
              <Button onClick={saveGeneralConfig}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Configuración de Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Host</Label>
                  <Input
                    value={databaseConfig.host}
                    onChange={(e) => setDatabaseConfig({ ...databaseConfig, host: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Puerto</Label>
                  <Input
                    type="number"
                    value={databaseConfig.port}
                    onChange={(e) => setDatabaseConfig({ ...databaseConfig, port: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Base de Datos</Label>
                <Input
                  value={databaseConfig.database}
                  onChange={(e) => setDatabaseConfig({ ...databaseConfig, database: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Usuario</Label>
                  <Input
                    value={databaseConfig.username}
                    onChange={(e) => setDatabaseConfig({ ...databaseConfig, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Contraseña</Label>
                  <Input
                    type="password"
                    value={databaseConfig.password}
                    onChange={(e) => setDatabaseConfig({ ...databaseConfig, password: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Timeout de Conexión (segundos)</Label>
                <Input
                  type="number"
                  value={databaseConfig.connectionTimeout}
                  onChange={(e) => setDatabaseConfig({ ...databaseConfig, connectionTimeout: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={saveDatabaseConfig}>Guardar</Button>
                <Button variant="outline" onClick={testDatabaseConnection}>
                  Probar Conexión
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Configuración de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Servidor SMTP</Label>
                  <Input
                    value={emailConfig.smtpServer}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpServer: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Puerto SMTP</Label>
                  <Input
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Usuario</Label>
                  <Input
                    value={emailConfig.username}
                    onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Contraseña</Label>
                  <Input
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Email de Origen</Label>
                <Input
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={emailConfig.useSSL}
                  onCheckedChange={(checked) => setEmailConfig({ ...emailConfig, useSSL: checked })}
                />
                <Label>Usar SSL/TLS</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={saveEmailConfig}>Guardar</Button>
                <Button variant="outline" onClick={testEmailConnection}>
                  Enviar Email de Prueba
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Timeout de Sesión (segundos)</Label>
                <Input
                  type="number"
                  value={securityConfig.sessionTimeout}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeout: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Máximo Intentos de Login</Label>
                <Input
                  type="number"
                  value={securityConfig.maxLoginAttempts}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, maxLoginAttempts: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={securityConfig.requireStrongPasswords}
                  onCheckedChange={(checked) => setSecurityConfig({ ...securityConfig, requireStrongPasswords: checked })}
                />
                <Label>Requerir contraseñas fuertes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={securityConfig.enableTwoFactor}
                  onCheckedChange={(checked) => setSecurityConfig({ ...securityConfig, enableTwoFactor: checked })}
                />
                <Label>Habilitar autenticación de dos factores</Label>
              </div>
              <Button onClick={saveSecurityConfig}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Configuración API MikroTik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Puerto HTTP por defecto</Label>
                  <Input
                    type="number"
                    value={apiConfig.defaultHttpPort}
                    onChange={(e) => setApiConfig({ ...apiConfig, defaultHttpPort: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Puerto HTTPS por defecto</Label>
                  <Input
                    type="number"
                    value={apiConfig.defaultHttpsPort}
                    onChange={(e) => setApiConfig({ ...apiConfig, defaultHttpsPort: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Timeout de Conexión (segundos)</Label>
                  <Input
                    type="number"
                    value={apiConfig.connectionTimeout}
                    onChange={(e) => setApiConfig({ ...apiConfig, connectionTimeout: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Reintentos de Conexión</Label>
                  <Input
                    type="number"
                    value={apiConfig.retryAttempts}
                    onChange={(e) => setApiConfig({ ...apiConfig, retryAttempts: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={apiConfig.enableSSLVerification}
                  onCheckedChange={(checked) => setApiConfig({ ...apiConfig, enableSSLVerification: checked })}
                />
                <Label>Verificar certificados SSL</Label>
              </div>
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Estas configuraciones se aplicarán a todas las nuevas conexiones con dispositivos MikroTik.
                </AlertDescription>
              </Alert>
              <Button onClick={saveApiConfig}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Config;
