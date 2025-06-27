
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatabaseBackup, Download, Upload, Trash2, Calendar } from 'lucide-react';
import { BackupFile } from '@/types/mikrotik';

const Backups = () => {
  const [backups, setBackups] = useState<BackupFile[]>([
    {
      id: '1',
      deviceId: 'dev1',
      deviceName: 'Router Principal',
      filename: 'router-principal-2024-01-15.backup',
      size: 2048576,
      created: new Date('2024-01-15T10:30:00'),
      type: 'configuration',
    },
    {
      id: '2',
      deviceId: 'dev2',
      deviceName: 'Access Point',
      filename: 'access-point-2024-01-14.backup',
      size: 1536000,
      created: new Date('2024-01-14T15:45:00'),
      type: 'full',
    },
    {
      id: '3',
      deviceId: 'dev1',
      deviceName: 'Router Principal',
      filename: 'router-principal-2024-01-10.backup',
      size: 2097152,
      created: new Date('2024-01-10T09:15:00'),
      type: 'configuration',
    },
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState('');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createBackup = async () => {
    if (!selectedDevice) return;
    
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simular progreso de backup
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          
          // Agregar nuevo backup a la lista
          const newBackup: BackupFile = {
            id: Date.now().toString(),
            deviceId: selectedDevice,
            deviceName: selectedDevice === 'dev1' ? 'Router Principal' : 'Access Point',
            filename: `backup-${Date.now()}.backup`,
            size: Math.floor(Math.random() * 3000000) + 1000000,
            created: new Date(),
            type: 'configuration',
          };
          
          setBackups([newBackup, ...backups]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadBackup = (backup: BackupFile) => {
    console.log('Descargando backup:', backup.filename);
    // Aquí se implementaría la descarga real
  };

  const deleteBackup = (backupId: string) => {
    setBackups(backups.filter(backup => backup.id !== backupId));
  };

  const restoreBackup = (backup: BackupFile) => {
    if (confirm(`¿Está seguro de que desea restaurar el backup ${backup.filename}? Esta acción no se puede deshacer.`)) {
      console.log('Restaurando backup:', backup.filename);
      // Aquí se implementaría la restauración real
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Backups</h1>
        <Button onClick={() => setSelectedDevice('dev1')}>
          <DatabaseBackup className="w-4 h-4 mr-2" />
          Crear Backup
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Seleccionar Dispositivo</Label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="dev1">Router Principal</option>
                  <option value="dev2">Access Point</option>
                </select>
              </div>

              {isCreatingBackup && (
                <div className="space-y-2">
                  <Label>Creando backup...</Label>
                  <Progress value={backupProgress} />
                  <p className="text-sm text-gray-500">{backupProgress}% completado</p>
                </div>
              )}

              <Button 
                onClick={createBackup} 
                disabled={!selectedDevice || isCreatingBackup}
                className="w-full"
              >
                {isCreatingBackup ? 'Creando...' : 'Crear Backup'}
              </Button>

              <Alert>
                <DatabaseBackup className="h-4 w-4" />
                <AlertDescription>
                  Los backups incluyen toda la configuración del dispositivo MikroTik.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DatabaseBackup className="w-5 h-5 mr-2" />
                Backups Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <DatabaseBackup className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">{backup.filename}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{backup.deviceName}</span>
                          <Badge variant={backup.type === 'full' ? 'default' : 'secondary'}>
                            {backup.type === 'full' ? 'Completo' : 'Configuración'}
                          </Badge>
                          <span>{formatFileSize(backup.size)}</span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {backup.created.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBackup(backup)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restoreBackup(backup)}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBackup(backup.id)}
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
      </div>
    </div>
  );
};

export default Backups;
