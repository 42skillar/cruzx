'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn, resetPassword } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(formData.email, formData.password);

      if (signInError) {
        setError(signInError.message || 'Email ou senha incorretos');
        return;
      }

      if (data && data.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao fazer login. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Digite seu email primeiro');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(formData.email);
      
      if (resetError) {
        setError('Erro ao enviar email de recuperação');
      } else {
        toast({
          title: 'Email enviado',
          description: 'Verifique sua caixa de entrada para recuperar a senha.',
        });
        setShowForgotPassword(false);
      }
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
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
          <p className="text-sm text-gray-600">Sistema de Gestão de Doadores - Angola</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
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
              </div>

              <Button
                type="submit"
                className="w-full bg-[#E10600] hover:bg-[#C10500]"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-sm text-[#E10600]"
                >
                  Esqueci minha senha
                </Button>
              </div>

              {showForgotPassword && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Digite seu email acima e clique no botão abaixo para recuperar a senha.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleForgotPassword}
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Recuperar Senha'}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          Sistema desenvolvido para a Cruz Vermelha Angola
        </div>
      </div>
    </div>
  );
}