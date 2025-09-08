import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface Incident {
  id: string;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  description: string;
  coordinates: string;
  tourists_affected?: number;
  tour_operator?: string;
  contact_info?: string;
  transport?: string;
  medical_condition?: string;
  tags: string[];
  photos: string[];
  created_at: string;
  reported_by: string;
  reported_by_name: string;
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      setIncidents([]); // Reset incidents to empty array

      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading incidents:', error);
        setError(error.message);
        setIncidents([]); // Ensure incidents is always an array
        return;
      }

      setIncidents(data || []);
    } catch (err) {
      console.error('Error loading incidents:', err);
      setError('Failed to load incidents');
      setIncidents([]); // Ensure incidents is always an array
    } finally {
      setLoading(false);
    }
  };

  const refreshIncidents = () => {
    loadIncidents();
  };

  return {
    incidents: Array.isArray(incidents) ? incidents : [],
    loading,
    error,
    refreshIncidents
  };
}
