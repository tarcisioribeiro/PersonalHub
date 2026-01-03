import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  CreditCard,
  ArrowLeftRight,
  Key,
  Lock,
  BookOpen,
  BookMarked,
  LayoutDashboard,
  Shield,
  Library,
  Bot,
} from 'lucide-react';

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  features: string[];
}

export default function Home() {
  const modules: ModuleCard[] = [
    {
      title: 'Controle Financeiro',
      description: 'Gestão Financeira Completa',
      icon: <Wallet className="w-8 h-8" />,
      href: '/dashboard',
      color: 'from-success to-success/70',
      features: [
        'Controle de Contas Bancárias',
        'Gestão de Despesas e Receitas',
        'Cartões de Crédito e Faturas',
        'Empréstimos e Transferências',
        'Dashboard com Gráficos'
      ]
    },
    {
      title: 'Segurança',
      description: 'Gerenciador de Senhas e Segurança',
      icon: <Shield className="w-8 h-8" />,
      href: '/security/passwords',
      color: 'from-info to-primary',
      features: [
        'Armazenamento Seguro de Senhas',
        'Cartões e Contas Bancárias',
        'Arquivos Criptografados',
        'Logs de Atividade',
        'Criptografia de Ponta'
      ]
    },
    {
      title: 'Leitura',
      description: 'Biblioteca Pessoal Digital',
      icon: <Library className="w-8 h-8" />,
      href: '/library/books',
      color: 'from-primary to-accent',
      features: [
        'Catálogo de Livros',
        'Autores e Editoras',
        'Resumos e Anotações',
        'Controle de Leituras',
        'Estatísticas de Leitura'
      ]
    },
    {
      title: 'AI Assistant',
      description: 'Assistente Inteligente',
      icon: <Bot className="w-8 h-8" />,
      href: '/ai-assistant',
      color: 'from-warning to-warning/70',
      features: [
        'Consultas em Linguagem Natural',
        'Análise de Dados Financeiros',
        'Recomendações Personalizadas',
        'Busca Inteligente',
        'Insights Automatizados'
      ]
    }
  ];

  const quickActions = [
    { icon: <TrendingDown className="w-5 h-5" />, label: 'Nova Despesa', href: '/expenses' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Nova Receita', href: '/revenues' },
    { icon: <ArrowLeftRight className="w-5 h-5" />, label: 'Transferência', href: '/transfers' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Cartões', href: '/credit-cards' },
    { icon: <Key className="w-5 h-5" />, label: 'Senhas', href: '/security/passwords' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Livros', href: '/library/books' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Bem-vindo ao PersonalHub
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Sua plataforma completa de gestão pessoal
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>Acesso rápido às funcionalidades mais usadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all hover:scale-105"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Módulos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <Link key={index} to={module.href} className="group">
              <Card className="h-full transition-all hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-base">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Finanças Organizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Controle total das suas finanças pessoais com dashboards intuitivos e relatórios detalhados.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Segurança Máxima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Seus dados protegidos com criptografia de ponta a ponta e armazenamento seguro.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <BookMarked className="w-5 h-5" />
              Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Organize sua biblioteca pessoal e acompanhe seu progresso de leitura.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
