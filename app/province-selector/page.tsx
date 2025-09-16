
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import type { Province } from '@/types';

export default function ProvinceSelectorPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { profile, setSelectedProvinceId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadProvinces();
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && profile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [profile, router, mounted]);

  const loadProvinces = async () => {
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');

      if (error) throw error;
      setProvinces(data || []);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const handleContinue = () => {
    if (selectedProvince && mounted) {
      setSelectedProvinceId(selectedProvince);
      router.push('/dashboard');
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="w-full max-w-md space-y-8 p-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-lg bg-[#E10600] flex items-center justify-center">
            <div className="h-10 w-10 bg-white rounded flex items-center justify-center">
              <div className="h-6 w-1 bg-[#E10600]"></div>
              <div className="h-1 w-6 bg-[#E10600] absolute"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cruz Vermelha</h1>
          <p className="text-sm text-gray-600">Selecione uma província para continuar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Seleção de Província</span>
            </CardTitle>
            <CardDescription>
              Como administrador, você pode gerenciar todas as províncias. 
              Selecione uma para começar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="province" className="block text-sm font-medium mb-2">
                Província
              </label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma província" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-[#E10600] hover:bg-[#C10500]"
              disabled={!selectedProvince || loading}
            >
              Continuar
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Você pode alterar a província a qualquer momento no painel
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
