import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntry } from '@/types/mikrotik';
import { useEventStream } from '@/hooks/useEventStream';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEventStream((evt) => {
    if (evt.type === 'log') {
      setLogs((l) => [
        ...l,
        {
          id: evt.id || Math.random().toString(36).slice(2),
          message: evt.message,
          level: evt.level,
          timestamp: evt.timestamp ? new Date(evt.timestamp) : new Date(),
        },
      ]);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto text-sm space-y-1 font-mono">
          {logs.map((log) => (
            <div
              key={log.id}
              className={log.level === 'error' ? 'text-red-600' : 'text-gray-700'}
            >
              [{log.timestamp.toLocaleTimeString()}] {log.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Logs;
