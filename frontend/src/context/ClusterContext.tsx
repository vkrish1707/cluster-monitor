// src/context/ClusterContext.tsx
import React, { createContext, useContext } from 'react';

export const ClusterContext = createContext<{
  clusterId: string | null,
  setClusterId: (id: string) => void
}>({
  clusterId: null,
  setClusterId: () => {},
});

export function useCluster() {
  return useContext(ClusterContext);
}