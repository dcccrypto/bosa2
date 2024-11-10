import { createContext } from 'react';

export interface StatsContextType {
  stats: {
    price: number;
    totalSupply: number;
    founderBalance: number;
    holders: number;
    lastUpdated: string;
    cached?: boolean;
    cacheAge?: number;
  } | null;
  founderPercentage: number;
}

export const StatsContext = createContext<StatsContextType>({
  stats: null,
  founderPercentage: 0
}); 