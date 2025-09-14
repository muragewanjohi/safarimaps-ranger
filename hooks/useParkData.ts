import { Park, ParkEntry, parkService } from '@/services/parkService';
import { useEffect, useState } from 'react';

export function useParkDetails(parkId: string) {
  const [park, setPark] = useState<Park | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParkDetails();
  }, [parkId]);

  const loadParkDetails = async () => {
    if (!parkId) {
      console.log('useParkDetails: No parkId provided');
      return;
    }
    
    console.log('useParkDetails: Loading park details for ID:', parkId);
    setLoading(true);
    setError(null);
    
    try {
      const parkData = await parkService.getParkById(parkId);
      console.log('useParkDetails: Park data loaded:', parkData?.name);
      setPark(parkData);
    } catch (err) {
      console.error('useParkDetails: Error loading park details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load park details');
    } finally {
      setLoading(false);
    }
  };

  const updatePark = async (updates: Partial<Park>) => {
    if (!park) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedPark = await parkService.updatePark(park.id, updates);
      setPark(updatedPark);
      return updatedPark;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update park');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    park,
    loading,
    error,
    updatePark,
    refetch: loadParkDetails
  };
}

export function useParkEntries(parkId: string) {
  const [entries, setEntries] = useState<ParkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParkEntries();
  }, [parkId]);

  const loadParkEntries = async () => {
    if (!parkId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const entriesData = await parkService.getParkEntries(parkId);
      setEntries(entriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load park entries');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: Omit<ParkEntry, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newEntry = await parkService.createParkEntry(entry);
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create park entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, updates: Partial<ParkEntry>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedEntry = await parkService.updateParkEntry(id, updates);
      setEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
      return updatedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update park entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await parkService.deleteParkEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete park entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: loadParkEntries
  };
}

export function useParkStats(parkId: string) {
  const [stats, setStats] = useState<{
    totalEntries: number;
    primaryEntries: number;
    primaryExits: number;
    totalCapacity: number;
    accessibleEntries: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParkStats();
  }, [parkId]);

  const loadParkStats = async () => {
    if (!parkId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await parkService.getParkStats(parkId);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load park stats');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: loadParkStats
  };
}
