
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Mail, Settings, Trash2, Edit, Send } from 'lucide-react';
import { EmailConfig, AlertConfig, EmailTemplate } from '@/types/mikrotik';
import { useToast } from '@/hooks/use-toast';

const Email = () => {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    enabled: false,
    smtpServer: '',
    smtpPort: 587,
    username: '',
    password: '',
    fromEmail: '',
    toEmails: [],
    useSSL: true,
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Alerta Crítica',
      subject: 'ALERTA CRÍTICA: {{deviceName}}',
      body: 'Se ha detectado una alerta crítica en el dispositivo {{deviceName}}:\n\n{{message}}\n\nFecha: {{timestamp}}\nIP: {{deviceIP}}',
      type: 'alert',
      variables: ['deviceName', 'message', 'timestamp', 'deviceIP'],
      isDefault: true
    }
  ]);

  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([
    {
      id: '1',
      name: 'Alertas Críticas',
      enabled: true,
      alertTypes: ['critical'],
      emailTemplate: '1',
      sendEmail: true,
      sendSMS: false,
      devices: ['1']
    }
  ]);

  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    type: 'alert',
    variables: [],
    isDefault: false
  });

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveEmailConfig = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración SMTP ha sido guardada exitosamente",
    });
  };

  const handleTestEmail = () => {
    if (!emailConfig.enabled || !emailConfig.smtpServer) {
      toast({
        title: "Error",
        description: "Por favor configura primero el servidor SMTP",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Enviando email de prueba",
      description: "Se está enviando un email de prueba...",
    });

    // Simular envío de email
    setTimeout(() => {
      toast({
        title: "Email enviado",
        description: "El email de prueba ha sido enviado exitosamente",
      });
    }, 2000);
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name!,
      subject: newTemplate.subject!,
      body: newTemplate.body!,
      type: newTemplate.type as 'alert' | 'notification' | 'report',
      variables: extractVariables(newTemplate.subject! + ' ' + newTemplate.body!),
      isDefault: false
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      subject: '',
      body: '',
      type: 'alert',
      variables: [],
      isDefault: false
    });
    setIsTemplateDialogOpen(false);

    toast({
      title: "Plantilla creada",
      description: `Plantilla ${template.name} creada exitosamente`,
    });
  };

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
  };

  const deleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      toast({
        title: "Error",
        description: "No se puede eliminar una plantilla por defecto",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Plantilla eliminada",
      description: "Plantilla eliminada exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Email</h1>
          <p className="text-gray-600">Configuración SMTP y plantillas de email</p>
        </div>
      </div>

      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp">Configuración SMTP</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="alerts">Configuración de Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Servidor SMTP</CardTitle>
              <CardDescription>
                Configura los parámetros para el envío de emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-enabled"
                  checked={emailConfig.enabled}
                  onCheckedChange={(checked) => setEmailConfig({...emailConfig, enabled: checked})}
                />
                <Label htmlFor="email-enabled">Habilitar envío de emails</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">Servidor SMTP</Label>
                  <Input
                    id="smtp-server"
                    value={emailConfig.smtpServer}
                    onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({...emailConfig, smtpPort: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Usuario</Label>
                  <Input
                    id="smtp-username"
                    value={emailConfig.username}
                    onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                    placeholder="tu-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Contraseña</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">Email remitente</Label>
                <Input
                  id="from-email"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                  placeholder="noreply@miempresa.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="use-ssl"
                  checked={emailConfig.useSSL}
                  onCheckedChange={(checked) => setEmailConfig({...emailConfig, useSSL: checked})}
                />
                <Label htmlFor="use-ssl">Usar SSL/TLS</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveEmailConfig}>
                  Guardar Configuración
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  <Send className="w-4 h-4 mr-2" />
                  Probar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Plantilla
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crear Plantilla de Email</DialogTitle>
                  <DialogDescription>
                    Crea una nueva plantilla personalizada para emails
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la plantilla</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      placeholder="Nombre descriptivo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Tipo</Label>
                    <Select
                      value={newTemplate.type || 'alert'}
                      onValueChange={(value) => setNewTemplate({...newTemplate, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alert">Alerta</SelectItem>
                        <SelectItem value="notification">Notificación</SelectItem>
                        <SelectItem value="report">Reporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-subject">Asunto</Label>
                    <Input
                      id="template-subject"
                      value={newTemplate.subject || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                      placeholder="Usa {{variable}} para variables dinámicas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-body">Cuerpo del mensaje</Label>
                    <Textarea
                      id="template-body"
                      value={newTemplate.body || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                      placeholder="Contenido del email con {{variables}}"
                      rows={6}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddTemplate} className="flex-1">
                      Crear Plantilla
                    </Button>
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>Tipo: {template.type}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      {template.isDefault && (
                        <Badge variant="secondary">Por defecto</Badge>
                      )}
                      {!template.isDefault && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Asunto:</p>
                    <p className="text-sm text-gray-600">{template.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Variables:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Alertas por Email</CardTitle>
              <CardDescription>
                Configura qué alertas enviar por email y sus plantillas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Configuración</TableHead>
                    <TableHead>Tipos de Alerta</TableHead>
                    <TableHead>Plantilla</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertConfigs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-gray-500">
                            {config.devices.length} dispositivo(s)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {config.alertTypes.map((type) => (
                            <Badge
                              key={type}
                              variant={type === 'critical' ? 'destructive' : type === 'warning' ? 'default' : 'secondary'}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {templates.find(t => t.id === config.emailTemplate)?.name || 'Sin plantilla'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.enabled ? 'default' : 'secondary'}>
                          {config.enabled ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Email;
