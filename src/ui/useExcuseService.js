import { useSyncExternalStore } from 'react';

// Conecta React con el servicio de aplicación: re-renderiza cuando cambia su estado.
export function useExcuseService(service) {
  return useSyncExternalStore(service.subscribe, service.getState);
}
