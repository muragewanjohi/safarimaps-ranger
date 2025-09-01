import { useCallback, useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { ApiResponse } from '../types';

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Specific hooks for different data types
export function useRangerData() {
  return useApiCall(() => dataService.getRangerData());
}

export function useParkData() {
  return useApiCall(() => dataService.getParkData());
}

export function useDashboardStats() {
  return useApiCall(() => dataService.getDashboardStats());
}

export function useEmergencyAlerts() {
  return useApiCall(() => dataService.getEmergencyAlerts());
}

export function useRecentIncidents() {
  return useApiCall(() => dataService.getRecentIncidents());
}

export function useRecentLocations() {
  return useApiCall(() => dataService.getRecentLocations());
}

export function useReports() {
  return useApiCall(() => dataService.getReports());
}

export function useReport(id: number) {
  return useApiCall(() => dataService.getReportById(id), [id]);
}

export function useImpactStats() {
  return useApiCall(() => dataService.getImpactStats());
}

export function useAchievements() {
  return useApiCall(() => dataService.getAchievements());
}

// Hook for adding locations
export function useAddLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLocation = useCallback(async (locationData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataService.addLocation(locationData);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to add location');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addLocation, loading, error };
}
