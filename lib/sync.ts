import { supabase } from './supabase';
import { offlineStorage } from './indexeddb';
import type { Donor, Donation } from '@/types';

export class SyncManager {
  private static instance: SyncManager;
  private syncInProgress = false;

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  async syncPendingData(): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let successCount = 0;
    let failedCount = 0;

    try {
      const pendingData = await offlineStorage.getPendingData();
      console.log(`Syncing ${pendingData.length} pending items`);

      for (const item of pendingData) {
        try {
          let success = false;

          if (item.type === 'donor') {
            success = await this.syncDonor(item.data);
          } else if (item.type === 'donation') {
            success = await this.syncDonation(item.data);
          }

          if (success) {
            await offlineStorage.markAsSynced(item.id!);
            successCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          failedCount++;
        }
      }

      // Clean up synced data
      await offlineStorage.clearSyncedData();

    } finally {
      this.syncInProgress = false;
    }

    return { success: successCount, failed: failedCount };
  }

  private async syncDonor(donorData: Partial<Donor>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('donors')
        .insert(donorData);

      return !error;
    } catch (error) {
      console.error('Error syncing donor:', error);
      return false;
    }
  }

  private async syncDonation(donationData: Partial<Donation>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('donations')
        .insert(donationData);

      return !error;
    } catch (error) {
      console.error('Error syncing donation:', error);
      return false;
    }
  }

  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-store'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const syncManager = SyncManager.getInstance();