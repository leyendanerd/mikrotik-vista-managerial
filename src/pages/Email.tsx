
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Settings, Plus, Edit, Trash2, Send, AlertTriangle } from 'lucide-react';
import { EmailConfig, EmailTemplate, AlertConfig } from '@/types/mikrotik';
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
    useSSL: true
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([]);

  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    type: 'alert',
    variables: [],
    isDefault: false
  });

  const [newAlertConfig, setNewAlertConfig] = useState<Partial<AlertConfig>>({
    name: '',
    enabled: true,
    alertTypes: ['critical'],
    emailTemplate: '',
    sendEmail: true,
    sendSMS: false,
    devices: []
  });

  const [recipientEmail, setRecipientEmail] = useState('');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isAlertConfigDialogOpen, setIsAlertConfigDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleSaveEmailConfig = () => {
    if (!emailConfig.smtpServer || !emailConfig.username || !emailConfig.password || !emailConfig.fromEmail) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos de configuración SMTP",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuración guardada",
      description: "La configuración de email ha sido guardada exitosamente",
    });
  };

  const handleTestEmail = () => {
    if (!emailConfig.enabled) {
      toast({
        title: "Error",
        description: "Habilita la configuración de email primero",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Enviando email de prueba",
      description: "Se está enviando un email de prueba...",
    });

    setTimeout(() => {
      toast({
        title: "Email enviado",
        description: "Email de prueba enviado exitosamente",
      });
    }, 2000);
  };

  const addRecipient = () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      toast({
        title: "Error",
        description: "Ingresa un email válido",
        variant: "destructive",
      });
      return;
    }

    if (emailConfig.toEmails.includes(recipientEmail)) {
      toast({
        title: "Error",
        description: "Este email ya está en la lista",
        variant: "destructive",
      });
      return;
    }

    setEmailConfig({
      ...emailConfig,
      toEmails: [...emailConfig.toEmails, recipientEmail]
    });
    setRecipientEmail('');
  };

  const removeRecipient = (email: string) => {
    setEmailConfig({
      ...emailConfig,
      toEmails: emailConfig.toEmails.filter(e => e !== email)
    });
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
      type: newTemplate.type || 'alert',
      variables: newTemplate.variables || [],
      isDefault: newTemplate.isDefault || false
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

  const handleAddAlertConfig = () => {
    if (!newAlertConfig.name || !newAlertConfig.emailTemplate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const alertConfig: AlertConfig = {
      id: Date.now().toString(),
      name: newAlertConfig.name!,
      enabled: newAlertConfig.enabled || true,
      alertTypes: newAlertConfig.alertTypes || ['critical'],
      emailTemplate: newAlertConfig.emailTemplate!,
      sendEmail: newAlertConfig.sendEmail || true,
      sendSMS: newAlertConfig.sendSMS || false,
      devices: newAlertConfig.devices || []
    };

    setAlertConfigs([...alertConfigs, alertConfig]);
    setNewAlertConfig({
      name: '',
      enabled: true,
      alertTypes: ['critical'],
      emailTemplate: '',
      sendEmail: true,
      sendSMS: false,
      devices: []
    });
    setIsAlertConfigDialogOpen(false);

    toast({
      title: "Configuración de alerta creada",
      description: `Configuración ${alertConfig.name} creada exitosamente`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
    toast({
      title: "Plantilla eliminada",
      description: "Plantilla eliminada exitosamente",
    });
  };

  const deleteAlertConfig = (configId: string) => {
    setAlertConfigs(alertConfigs.filter(config => config.id !== configId));
    toast({
      title: "Configuración eliminada",
      description: "Configuración de alerta eliminada exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Email</h1>
          <p className="text-gray-600">Configura SMTP y plantillas de notificaciones</p>
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
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Configuración del Servidor SMTP</span>
              </CardTitle>
              <CardDescription>
                Configura la conexión al servidor de email para enviar notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-enabled"
                  checked={emailConfig.enabled}
                  onCheckedChange={(checked) => setEmailConfig({...emailConfig, enabled: checked})}
                />
                <Label htmlFor="email-enabled">Habilitar notificaciones por email</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">Servidor SMTP *</Label>
                  <Input
                    id="smtp-server"
                    value={emailConfig.smtpServer}
                    onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
                    placeholder="smtp.gmail.com"
                    disabled={!emailConfig.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto SMTP</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({...emailConfig, smtpPort: parseInt(e.target.value)})}
                    placeholder="587"
                    disabled={!emailConfig.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Usuario SMTP *</Label>
                  <Input
                    id="smtp-username"
                    value={emailConfig.username}
                    onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                    placeholder="usuario@gmail.com"
                    disabled={!emailConfig.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Contraseña SMTP *</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                    disabled={!emailConfig.enabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">Email remitente *</Label>
                <Input
                  id="from-email"
                  type="email"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                  placeholder="notificaciones@miempresa.com"
                  disabled={!emailConfig.enabled}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="use-ssl"
                  checked={emailConfig.useSSL}
                  onCheckedChange={(checked) => setEmailConfig({...emailConfig, useSSL: checked})}
                  disabled={!emailConfig.enabled}
                />
                <Label htmlFor="use-ssl">Usar SSL/TLS</Label>
              </div>

              <div className="space-y-4">
                <Label>Destinatarios de notificaciones</Label>
                <div className="flex space-x-2">
                  <Input
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="destinatario@email.com"
                    disabled={!emailConfig.enabled}
                  />
                  <Button onClick={addRecipient} disabled={!emailConfig.enabled}>
                    Agregar
                  </Button>
                </div>
                {emailConfig.toEmails.length > 0 && (
                  <div className="space-y-2">
                    {emailConfig.toEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{email}</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeRecipient(email)}
                          disabled={!emailConfig.enabled}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveEmailConfig} disabled={!emailConfig.enabled}>
                  <Settings className="w-4 h-4 mr-2" />
                  Guardar Configuración
                </Button>
                <Button variant="outline" onClick={handleTestEmail} disabled={!emailConfig.enabled}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Prueba
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
                    Crea una nueva plantilla para las notificaciones por email
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la plantilla *</Label>
                    <Input
                      id="template-name"
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      placeholder="Alerta Crítica"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Tipo de plantilla</Label>
                    <Select
                      value={newTemplate.type || 'alert'}
                      onValueChange={(value: 'alert' | 'notification' | 'report') => setNewTemplate({...newTemplate, type: value})}
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
                    <Label htmlFor="template-subject">Asunto *</Label>
                    <Input
                      id="template-subject"
                      value={newTemplate.subject || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                      placeholder="[ALERTA] {{deviceName}} - {{alertType}}"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-body">Cuerpo del mensaje *</Label>
                    <Textarea
                      id="template-body"
                      value={newTemplate.body || ''}
                      onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                      placeholder="Se ha detectado una alerta en el dispositivo {{deviceName}}..."
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="template-default"
                      checked={newTemplate.isDefault || false}
                      onCheckedChange={(checked) => setNewTemplate({...newTemplate, isDefault: checked})}
                    />
                    <Label htmlFor="template-default">Plantilla por defecto</Label>
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

          {templates.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay plantillas de email configuradas</p>
              <p className="text-sm text-gray-400 mt-1">Crea una plantilla para personalizar las notificaciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{template.name}</span>
                          {template.isDefault && <Badge variant="default">Por defecto</Badge>}
                        </CardTitle>
                        <CardDescription>{template.subject}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tipo:</span>
                        <Badge variant="secondary">{template.type}</Badge>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500 mb-1">Vista previa:</p>
                        <p className="text-gray-700 text-xs line-clamp-3">{template.body}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isAlertConfigDialogOpen} onOpenChange={setIsAlertConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Configuración
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar Alertas por Email</DialogTitle>
                  <DialogDescription>
                    Define cuándo y cómo enviar notificaciones por email
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-name">Nombre de la configuración *</Label>
                    <Input
                      id="alert-name"
                      value={newAlertConfig.name || ''}
                      onChange={(e) => setNewAlertConfig({...newAlertConfig, name: e.target.value})}
                      placeholder="Alertas Críticas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-template">Plantilla de email *</Label>
                    <Select
                      value={newAlertConfig.emailTemplate || ''}
                      onValueChange={(value) => setNewAlertConfig({...newAlertConfig, emailTemplate: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alert-enabled"
                      checked={newAlertConfig.enabled || false}
                      onCheckedChange={(checked) => setNewAlertConfig({...newAlertConfig, enabled: checked})}
                    />
                    <Label htmlFor="alert-enabled">Configuración habilitada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alert-send-email"
                      checked={newAlertConfig.sendEmail || false}
                      onCheckedChange={(checked) => setNewAlertConfig({...newAlertConfig, sendEmail: checked})}
                    />
                    <Label htmlFor="alert-send-email">Enviar por email</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddAlertConfig} className="flex-1">
                      Crear Configuración
                    </Button>
                    <Button variant="outline" onClick={() => setIsAlertConfigDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {alertConfigs.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay configuraciones de alerta</p>
              <p className="text-sm text-gray-400 mt-1">Configura cuándo enviar notificaciones por email</p>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Plantilla</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertConfigs.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell className="font-medium">{config.name}</TableCell>
                        <TableCell>{config.emailTemplate}</TableCell>
                        <TableCell>
                          <Badge variant={config.enabled ? 'default' : 'secondary'}>
                            {config.enabled ? 'Habilitado' : 'Deshabilitado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.sendEmail ? 'default' : 'secondary'}>
                            {config.sendEmail ? 'Sí' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteAlertConfig(config.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Email;
