import { Park, parkService } from '@/services/parkService';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ParkContextType {
  selectedPark: Park | null;
  setSelectedPark: (park: Park) => void;
  availableParks: Park[];
  isLoading: boolean;
  error: string | null;
}

const ParkContext = createContext<ParkContextType | undefined>(undefined);

interface ParkProviderProps {
  children: ReactNode;
}

export const ParkProvider: React.FC<ParkProviderProps> = ({ children }) => {
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [availableParks, setAvailableParks] = useState<Park[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParks();
  }, []);

  const loadParks = async () => {
    console.log('ParkContext: Loading parks...');
    setIsLoading(true);
    setError(null);
    
    try {
      const parks = await parkService.getParks();
      console.log('ParkContext: Parks loaded:', parks.length);
      setAvailableParks(parks);
      
      // Set the first park as selected by default
      if (parks.length > 0) {
        console.log('ParkContext: Setting selected park to:', parks[0].name);
        setSelectedPark(parks[0]);
      } else {
        console.log('ParkContext: No parks found');
      }
    } catch (err) {
      console.error('ParkContext: Error loading parks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load parks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSelectedPark = (park: Park) => {
    setSelectedPark(park);
    console.log('Park changed to:', park.name);
  };

  return (
    <ParkContext.Provider
      value={{
        selectedPark,
        setSelectedPark: handleSetSelectedPark,
        availableParks,
        isLoading,
        error
      }}
    >
      {children}
    </ParkContext.Provider>
  );
};

export const usePark = (): ParkContextType => {
  const context = useContext(ParkContext);
  if (context === undefined) {
    throw new Error('usePark must be used within a ParkProvider');
  }
  return context;
};
