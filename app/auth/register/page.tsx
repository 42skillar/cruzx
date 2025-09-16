
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const provinces = [
  { id: '1', name: 'Luanda', code: 'LUA' },
  { id: '2', name: 'Bengo', code: 'BGO' },
  { id: '3', name: 'Benguela', code: 'BGU' },
  { id: '4', name: 'Bié', code: 'BIE' },
  { id: '5', name: 'Cabinda', code: 'CAB' },
  { id: '6', name: 'Cuando Cubango', code: 'CCU' },
  { id: '7', name: 'Cuanza Norte', code: 'CNO' },
  { id: '8', name: 'Cuanza Sul', code: 'CSU' },
  { id: '9', name: 'Cunene', code: 'CNN' },
  { id: '10', name: 'Huambo', code: 'HUA' },
  { id: '11', name: 'Huíla', code: 'HUI' },
  { id: '12', name: 'Lunda Norte', code: 'LNO' },
  { id: '13', name: 'Lunda Sul', code: 'LSU' },
  { id: '14', name: 'Malanje', code: 'MAL' },
  { id: '15', name: 'Moxico', code: 'MOX' },
  { id: '16', name: 'Namibe', code: 'NAM' },
  { id: '17', name: 'Uíge', code: 'UIG' },
  { id: '18', name: 'Zaire', code: 'ZAI' },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as 'admin' | 'leader' | 'operator',
    province_id: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!formData.province_id) {
      setError('Selecione uma província');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (authError) {
        setError(authError.message || 'Erro ao criar conta');
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            role: formData.role,
            province_id: formData.province_id,
            first_login: true,
          });

        if (profileError) {
          setError('Erro ao criar perfil do usuário');
          return;
        }

        toast({
          title: 'Conta criada com sucesso',
          description: 'O administrador foi cadastrado no sistema.',
        });

        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-sm text-gray-600">Registro de Administrador</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar Conta de Administrador</CardTitle>
            <CardDescription>
              Preencha os dados para criar uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome completo"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="province">Província</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={formData.province_id}
                    onValueChange={(value) => setFormData({ ...formData, province_id: value })}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Selecione uma província" />
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
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo de 8 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E10600] hover:bg-[#C10500]"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/auth/login')}
                  className="text-sm text-[#E10600]"
                >
                  Já tem uma conta? Entrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
