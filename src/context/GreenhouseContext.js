'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { getGreenhouses } from '@/components/greenhouse';

const GreenhouseContext = createContext(null);

export function GreenhouseProvider({ children }) {
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGreenhouses = async () => {
    try {
      setLoading(true);
      setError('');
      const list = await getGreenhouses();

      if (Array.isArray(list)) {
        setGreenhouses(list);

        if (!selectedGreenhouseId && list.length > 0) {
          setSelectedGreenhouseId(list[0].id);
        }
      } else {
        setGreenhouses([]);
      }
    } catch (err) {
      console.error('Failed to load greenhouses:', err);
      setError('Failed to load greenhouses');
      setGreenhouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGreenhouses();
  }, []);

  const value = {
    greenhouses,
    selectedGreenhouseId,
    setSelectedGreenhouseId,
    loading,
    error,
    reload: loadGreenhouses,
  };

  return (
    <GreenhouseContext.Provider value={value}>
      {children}
    </GreenhouseContext.Provider>
  );
}

export function useGreenhouse() {
  const ctx = useContext(GreenhouseContext);
  if (!ctx) {
    throw new Error('useGreenhouse must be used within a GreenhouseProvider');
  }
  return ctx;
}
