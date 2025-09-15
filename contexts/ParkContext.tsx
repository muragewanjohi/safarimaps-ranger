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
      console.log('ParkContext: Parks data:', JSON.stringify(parks, null, 2));
      
      // If no parks are loaded from database, provide fallback parks
      if (parks.length === 0) {
        console.log('ParkContext: No parks from database, using fallback parks');
        const fallbackParks = [
          {
            id: '3467cff0-ca7d-4c6c-ad28-2d202f2372ce',
            name: 'Masai Mara National Reserve',
            description: 'Famous wildlife reserve in Kenya',
            location: 'Narok County, Kenya',
            established: null,
            area: null,
            coordinates: null
          },
          {
            id: '0dba0933-f39f-4c78-a943-45584f383d20',
            name: 'Nairobi National Park',
            description: 'Nairobi National Park',
            location: 'Langata',
            established: '1990-01-01',
            area: null,
            coordinates: null
          },
          {
            id: 'dc9b8bdc-7e14-4219-a35a-0ab1fb0a4513',
            name: 'Meru National Park',
            description: 'Meru National Park',
            location: 'Meru',
            established: null,
            area: null,
            coordinates: null
          }
        ];
        setAvailableParks(fallbackParks);
        setSelectedPark(fallbackParks[0]);
      } else {
        setAvailableParks(parks);
        // Set the first park as selected by default
        if (parks.length > 0) {
          console.log('ParkContext: Setting selected park to:', parks[0].name);
          setSelectedPark(parks[0]);
        }
      }
    } catch (err) {
      console.error('ParkContext: Error loading parks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load parks');
      
      // Provide fallback parks even on error
      console.log('ParkContext: Using fallback parks due to error');
      const fallbackParks = [
        {
          id: '3467cff0-ca7d-4c6c-ad28-2d202f2372ce',
          name: 'Masai Mara National Reserve',
          description: 'Famous wildlife reserve in Kenya',
          location: 'Narok County, Kenya',
          established: null,
          area: null,
          coordinates: null
        },
        {
          id: '0dba0933-f39f-4c78-a943-45584f383d20',
          name: 'Nairobi National Park',
          description: 'Nairobi National Park',
          location: 'Langata',
          established: '1990-01-01',
          area: null,
          coordinates: null
        },
        {
          id: 'dc9b8bdc-7e14-4219-a35a-0ab1fb0a4513',
          name: 'Meru National Park',
          description: 'Meru National Park',
          location: 'Meru',
          established: null,
          area: null,
          coordinates: null
        }
      ];
      setAvailableParks(fallbackParks);
      setSelectedPark(fallbackParks[0]);
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
