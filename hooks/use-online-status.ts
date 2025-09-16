'use client';

import { useState, useEffect } from 'react';
import { offlineStorage } from '@/lib/indexeddb';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Update pending count
    const updatePendingCount = async () => {
      try {
        const pending = await offlineStorage.getPendingData();
        setPendingCount(pending.length);
      } catch (error) {
        console.error('Error getting pending data count:', error);
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      updatePendingCount();
    };

    const handleOffline = () => {
      setIsOnline(false);
      updatePendingCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update pending count on mount and periodically
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, pendingCount };
}