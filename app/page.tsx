'use client';

import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
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

  return null; // AuthProvider handles the redirect
}