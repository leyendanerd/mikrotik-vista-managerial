import { useEffect } from 'react';

export type EventCallback = (data: any) => void;

export function useEventStream(onEvent: EventCallback) {
  useEffect(() => {
    const source = new EventSource('/api/events');
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent(data);
      } catch (_) {}
    };
    return () => {
      source.close();
    };
  }, [onEvent]);
}
