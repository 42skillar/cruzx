'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  UserPlus, 
  BarChart3, 
  Users, 
  Heart,
  FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission } from '@/lib/auth';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useAuth();

  const navigationItems = [
    {
      label: 'Início',
      icon: Home,
      href: '/dashboard',
      permission: true
    },
    {
      label: 'Pesquisar Doadores',
      icon: Search,
      href: '/donors/search',
      permission: true
    },
    {
      label: 'Cadastrar Doador',
      icon: UserPlus,
      href: '/donors/new',
      permission: profile ? hasPermission(profile.role, 'create', 'donor') : false
    },
    {
      label: 'Registrar Doação',
      icon: Heart,
      href: '/donations/new',
      permission: profile ? hasPermission(profile.role, 'create', 'donation') : false
    },
    {
      label: 'Relatórios',
      icon: BarChart3,
      href: '/reports',
      permission: profile ? hasPermission(profile.role, 'read', 'report') : false
    },
    {
      label: 'Gerenciar Líderes',
      icon: Users,
      href: '/admin/leaders',
      permission: profile?.role === 'admin'
    }
  ];

  const visibleItems = navigationItems.filter(item => item.permission);

  return (
    <nav className="border-r bg-muted/10 w-64 min-h-screen p-4">
      <div className="space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-[#E10600] text-white hover:bg-[#C10500]'
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Bottom section for admin secret link */}
      {profile?.role === 'admin' && (
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground"
            onClick={() => router.push('/admin/secret')}
          >
            <FileText className="mr-2 h-3 w-3" />
            Cadastrar Admins
          </Button>
        </div>
      )}
    </nav>
  );
}