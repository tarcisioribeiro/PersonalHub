import { useState, useEffect, useMemo } from 'react';
import {
  Target, CheckCircle2, Calendar, TrendingUp,
  Award, ListTodo, Flag, Smile, Frown, Meh,
  SmilePlus, Angry
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { personalPlanningDashboardService } from '@/services/personal-planning-dashboard-service';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { StatCard } from '@/components/common/StatCard';
import { useChartColors } from '@/lib/chart-colors';
import type { PersonalPlanningDashboardStats, DailyReflection } from '@/types';

export default function PersonalPlanningDashboard() {
  const [stats, setStats] = useState<PersonalPlanningDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const COLORS = useChartColors();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await personalPlanningDashboardService.getStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Processar dados para gráficos
  const weeklyProgressData = useMemo(() => {
    if (!stats?.weekly_progress) return [];
    return stats.weekly_progress.map(item => ({
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      total: item.total,
      completadas: item.completed,
      taxa: parseFloat(item.rate.toFixed(1))
    }));
  }, [stats?.weekly_progress]);

  const tasksByCategoryData = useMemo(() => {
    if (!stats?.tasks_by_category) return [];
    return stats.tasks_by_category.map(item => ({
      category: item.category,
      name: item.category_display,
      count: item.count
    }));
  }, [stats?.tasks_by_category]);

  // Cores por categoria
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: '#10b981',
      studies: '#3b82f6',
      spiritual: '#8b5cf6',
      exercise: '#f59e0b',
      nutrition: '#14b8a6',
      meditation: '#8b5cf6',
      reading: '#eab308',
      writing: '#06b6d4',
      work: '#6366f1',
      leisure: '#ec4899',
      family: '#ef4444',
      social: '#f97316',
      finance: '#059669',
      household: '#84cc16',
      personal_care: '#06b6d4',
      other: '#6b7280',
    };
    return colors[category] || colors.other;
  };

  // Ícone de mood
  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'excellent':
        return <SmilePlus className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Smile className="h-4 w-4 text-blue-500" />;
      case 'neutral':
        return <Meh className="h-4 w-4 text-gray-500" />;
      case 'bad':
        return <Frown className="h-4 w-4 text-orange-500" />;
      case 'terrible':
        return <Angry className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Dashboard - Planejamento Pessoal"
          description="Acompanhe suas tarefas, objetivos e reflexões"
        />
        <p className="text-center text-muted-foreground mt-8">
          Nenhum dado disponível
        </p>
      </div>
    );
  }

  const completionRate = stats.total_tasks_today > 0
    ? ((stats.completed_tasks_today / stats.total_tasks_today) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Dashboard - Planejamento Pessoal"
        description="Acompanhe suas tarefas, objetivos e reflexões"
      />

      {/* Grid 1: 8 Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Tarefas de Hoje"
          value={`${stats.completed_tasks_today} / ${stats.total_tasks_today}`}
          icon={<Calendar className="h-4 w-4" />}
          subtitle={`${completionRate}% concluídas`}
        />

        <StatCard
          title="Taxa Cumprimento 7d"
          value={`${stats.completion_rate_7d.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          subtitle="Últimos 7 dias"
        />

        <StatCard
          title="Tarefas Ativas"
          value={stats.active_tasks}
          icon={<ListTodo className="h-4 w-4" />}
          subtitle="Tarefas rotineiras configuradas"
        />

        <StatCard
          title="Taxa Cumprimento 30d"
          value={`${stats.completion_rate_30d.toFixed(1)}%`}
          icon={<Calendar className="h-4 w-4" />}
          subtitle="Últimos 30 dias"
        />

        <StatCard
          title="Objetivos Ativos"
          value={stats.active_goals}
          icon={<Target className="h-4 w-4" />}
          subtitle="Objetivos em andamento"
        />

        <StatCard
          title="Melhor Sequência"
          value={`${stats.best_streak} dias`}
          icon={<Award className="h-4 w-4" />}
          subtitle="Recorde de dias consecutivos"
        />

        <StatCard
          title="Sequência Atual"
          value={`${stats.current_streak} dias`}
          icon={<TrendingUp className="h-4 w-4" />}
          subtitle="Dias consecutivos"
        />

        <StatCard
          title="Objetivos Completados"
          value={stats.completed_goals}
          icon={<CheckCircle2 className="h-4 w-4" />}
          subtitle="Total de objetivos concluídos"
        />
      </div>

      {/* Grid 2: Gráficos de Visualização */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
        {/* Gráfico 1: Progresso Semanal */}
        {weeklyProgressData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progresso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weeklyProgressData}>
                  <defs>
                    <linearGradient id="gradient-total" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradient-completed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradient-rate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    yAxisId="left"
                    label={{ value: 'Tarefas', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'Taxa %', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="total"
                    stroke={COLORS[0]}
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="completadas"
                    stroke={COLORS[3]}
                    strokeWidth={2}
                    name="Completadas"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="taxa"
                    stroke={COLORS[1]}
                    strokeWidth={2}
                    name="Taxa %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Gráfico 2: Tarefas por Categoria */}
        {tasksByCategoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Tarefas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={tasksByCategoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} name="Tarefas">
                    {tasksByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Grid 3: Progresso de Objetivos Ativos */}
      {stats.active_goals_progress && stats.active_goals_progress.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Progresso de Objetivos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.active_goals_progress.map((goal, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.progress_percentage}%
                    </span>
                  </div>
                  <Progress value={goal.progress_percentage} className="h-3" />
                  <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <span>{goal.current_value}/{goal.target_value}</span>
                    <span>{goal.days_active} dias ativos</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid 4: Reflexões Recentes com Ícones de Mood */}
      {stats.recent_reflections && stats.recent_reflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5" />
              Reflexões Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_reflections.map((reflection: DailyReflection) => (
                <div key={reflection.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      {new Date(reflection.date).toLocaleDateString('pt-BR')}
                    </span>
                    {reflection.mood && (
                      <div className="flex items-center gap-2">
                        {getMoodIcon(reflection.mood)}
                        <span className="text-sm text-muted-foreground capitalize">
                          {reflection.mood_display}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reflection.reflection}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
