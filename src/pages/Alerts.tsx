
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle, Info, CheckCircle, Settings } from 'lucide-react';
import { Alert as AlertType } from '@/types/mikrotik';

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([
    {
      id: '1',
      deviceId: 'dev1',
      deviceName: 'Router Principal',
      type: 'critical',
      message: 'Interfaz ethernet1 desconectada',
      timestamp: new Date(Date.now() - 30000),
      acknowledged: false,
    },
    {
      id: '2',
      deviceId: 'dev2',
      deviceName: 'Access Point',
      type: 'warning',
      message: 'Alta utilización de CPU (85%)',
      timestamp: new Date(Date.now() - 300000),
      acknowledged: false,
    },
    {
      id: '3',
      deviceId: 'dev1',
      deviceName: 'Router Principal',
      type: 'info',
      message: 'Backup completado exitosamente',
      timestamp: new Date(Date.now() - 3600000),
      acknowledged: true,
    },
  ]);

  const [emailConfig, setEmailConfig] = useState({
    enabled: false,
    smtpServer: '',
    smtpPort: 587,
    username: '',
    password: '',
    fromEmail: '',
    toEmails: '',
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertBadge = (type: string) => {
    const variants = {
      critical: 'destructive',
      warning: 'secondary',
      info: 'default',
    } as const;
    return variants[type as keyof typeof variants] || 'default';
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const saveEmailConfig = () => {
    console.log('Guardando configuración de email:', emailConfig);
    // Aquí se conectaría con la API para guardar la configuración
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Alertas</h1>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configurar Alertas
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Alertas Activas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={getAlertBadge(alert.type)}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{alert.deviceName}</span>
                        </div>
                        <AlertDescription className="text-gray-700">
                          {alert.message}
                        </AlertDescription>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.acknowledged ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Reconocer
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={emailConfig.enabled}
                  onCheckedChange={(checked) =>
                    setEmailConfig({ ...emailConfig, enabled: checked })
                  }
                />
                <Label>Habilitar notificaciones por email</Label>
              </div>

              {emailConfig.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Servidor SMTP</Label>
                    <Input
                      value={emailConfig.smtpServer}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, smtpServer: e.target.value })
                      }
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <Label>Puerto SMTP</Label>
                    <Input
                      type="number"
                      value={emailConfig.smtpPort}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, smtpPort: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div>
                    <Label>Usuario</Label>
                    <Input
                      value={emailConfig.username}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, username: e.target.value })
                      }
                      placeholder="usuario@gmail.com"
                    />
                  </div>

                  <div>
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={emailConfig.password}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, password: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Email de origen</Label>
                    <Input
                      value={emailConfig.fromEmail}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, fromEmail: e.target.value })
                      }
                      placeholder="alertas@miempresa.com"
                    />
                  </div>

                  <div>
                    <Label>Emails de destino (separados por comas)</Label>
                    <Input
                      value={emailConfig.toEmails}
                      onChange={(e) =>
                        setEmailConfig({ ...emailConfig, toEmails: e.target.value })
                      }
                      placeholder="admin@miempresa.com, soporte@miempresa.com"
                    />
                  </div>

                  <Button onClick={saveEmailConfig} className="w-full">
                    Guardar Configuración
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
