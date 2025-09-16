'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  BarChart3, 
  Users, 
  Heart,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/main-layout';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { hasPermission } from '@/lib/auth';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { profile, selectedProvinceId } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && selectedProvinceId) {
      loadStats();
    }
  }, [profile, selectedProvinceId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const queries = [];

      // Base filters
      const provinceFilter = profile?.role === 'admin' && selectedProvinceId 
        ? selectedProvinceId 
        : profile?.province_id;

      // Total donors
      let donorsQuery = supabase
        .from('donors')
        .select('id', { count: 'exact' });

      if (profile?.role === 'leader') {
        donorsQuery = donorsQuery.eq('created_by', profile.id);
      } else if (provinceFilter) {
        donorsQuery = donorsQuery.eq('province_id', provinceFilter);
      }

      // Eligible donors
      let eligibleQuery = supabase
        .from('donors')
        .select('id', { count: 'exact' })
        .eq('is_eligible', true);

      if (profile?.role === 'leader') {
        eligibleQuery = eligibleQuery.eq('created_by', profile.id);
      } else if (provinceFilter) {
        eligibleQuery = eligibleQuery.eq('province_id', provinceFilter);
      }

      // Total donations
      let donationsQuery = supabase
        .from('donations')
        .select('id', { count: 'exact' });

      if (profile?.role === 'leader') {
        donationsQuery = donationsQuery.eq('created_by', profile.id);
      } else if (provinceFilter) {
        donationsQuery = donationsQuery.eq('province_id', provinceFilter);
      }

      // This month donations
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      let thisMonthQuery = supabase
        .from('donations')
        .select('id', { count: 'exact' })
        .gte('donation_date', startOfMonth.toISOString());

      if (profile?.role === 'leader') {
        thisMonthQuery = thisMonthQuery.eq('created_by', profile.id);
      } else if (provinceFilter) {
        thisMonthQuery = thisMonthQuery.eq('province_id', provinceFilter);
      }

      const [
        { count: totalDonors },
        { count: eligibleDonors },
        { count: totalDonations },
        { count: donationsThisMonth }
      ] = await Promise.all([
        donorsQuery,
        eligibleQuery,
        donationsQuery,
        thisMonthQuery
      ]);

      setStats({
        total_donors: totalDonors || 0,
        eligible_donors: eligibleDonors || 0,
        total_donations: totalDonations || 0,
        donations_this_month: donationsThisMonth || 0,
        donors_by_blood_type: {},
        donors_by_age_group: {},
        donations_by_month: {}
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'leader': return 'Líder';
      case 'operator': return 'Operador';
      default: return role;
    }
  };

  const quickActions = [
    {
      title: 'Pesquisar Doadores',
      description: 'Encontre doadores por filtros avançados',
      icon: Search,
      href: '/donors/search',
      permission: true,
      color: 'bg-blue-500'
    },
    {
      title: 'Cadastrar Doador',
      description: 'Adicione novos doadores ao sistema',
      icon: UserPlus,
      href: '/donors/new',
      permission: profile ? hasPermission(profile.role, 'create', 'donor') : false,
      color: 'bg-green-500'
    },
    {
      title: 'Registrar Doação',
      description: 'Registre uma nova doação de sangue',
      icon: Heart,
      href: '/donations/new',
      permission: profile ? hasPermission(profile.role, 'create', 'donation') : false,
      color: 'bg-[#E10600]'
    },
    {
      title: 'Relatórios',
      description: 'Gere relatórios detalhados',
      icon: BarChart3,
      href: '/reports',
      permission: profile ? hasPermission(profile.role, 'read', 'report') : false,
      color: 'bg-purple-500'
    },
    {
      title: 'Gerenciar Líderes',
      description: 'Cadastre e gerencie líderes',
      icon: Users,
      href: '/admin/leaders',
      permission: profile?.role === 'admin',
      color: 'bg-orange-500'
    }
  ];

  const visibleActions = quickActions.filter(action => action.permission);

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Olá, {profile?.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {getRoleLabel(profile?.role || '')}
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{profile?.province?.name}</span>
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gerencie doadores e doações da Cruz Vermelha Angola
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Doadores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_donors}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.eligible_donors} elegíveis para doação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_donations}</div>
                <p className="text-xs text-muted-foreground">
                  Registradas no sistema
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.donations_this_month}</div>
                <p className="text-xs text-muted-foreground">
                  Doações em {new Date().toLocaleDateString('pt-AO', { month: 'long' })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Elegibilidade</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_donors > 0 
                    ? Math.round((stats.eligible_donors / stats.total_donors) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Doadores aptos para doação
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.href}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhuma atividade recente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}