'use client';

import React, { useEffect } from 'react';
import { Header } from './header';
import { Navigation } from './navigation';
import { useAuth } from '@/hooks/use-auth';
import { syncManager } from '@/lib/sync';
import { offlineStorage } from '@/lib/indexeddb';
import { useToast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize IndexedDB
    offlineStorage.init().catch(console.error);

    // Setup sync on network change
    const handleOnline = async () => {
      toast({
        title: 'Conexão restaurada',
        description: 'Sincronizando dados pendentes...',
      });

      try {
        const result = await syncManager.syncPendingData();
        if (result.success > 0) {
          toast({
            title: 'Sincronização completa',
            description: `${result.success} registros sincronizados com sucesso.`,
          });
        }
        if (result.failed > 0) {
          toast({
            title: 'Sincronização parcial',
            description: `${result.failed} registros falharam. Tente novamente.`,
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Erro na sincronização',
          description: 'Não foi possível sincronizar os dados.',
          variant: 'destructive'
        });
      }
    };

    const handleOffline = () => {
      toast({
        title: 'Modo offline',
        description: 'Você pode continuar trabalhando. Os dados serão sincronizados quando a conexão for restaurada.',
        variant: 'secondary'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 rounded bg-[#E10600] flex items-center justify-center">
            <div className="h-5 w-5 bg-white rounded-sm flex items-center justify-center">
              <div className="h-3 w-0.5 bg-[#E10600]"></div>
              <div className="h-0.5 w-3 bg-[#E10600] absolute"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}