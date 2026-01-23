import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth-service';
import { Loader2 } from 'lucide-react';

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  document: string;
  phone: string;
  email?: string;
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        username: data.username,
        password: data.password,
        name: data.name,
        document: data.document,
        phone: data.phone,
        email: data.email,
      });

      toast({
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer login com suas credenciais.',
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao cadastrar',
        description: error.message || 'Ocorreu um erro ao tentar cadastrar. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              MindLedger
            </h1>
            <p className="mt-2">Crie sua conta</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">CPF *</Label>
              <Input
                id="document"
                type="text"
                {...register('document', {
                  required: 'CPF é obrigatório',
                  pattern: {
                    value: /^\d{11}$/,
                    message: 'CPF deve conter 11 dígitos',
                  },
                })}
                placeholder="00000000000"
                maxLength={11}
                disabled={isLoading}
              />
              {errors.document && (
                <p className="text-sm text-destructive">{errors.document.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                placeholder="(00) 00000-0000"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário *</Label>
              <Input
                id="username"
                type="text"
                {...register('username', {
                  required: 'Nome de usuário é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Mínimo de 3 caracteres',
                  },
                })}
                placeholder="usuario"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Mínimo de 6 caracteres',
                  },
                })}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: (value) =>
                    value === password || 'As senhas não coincidem',
                })}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span>Já tem uma conta? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
