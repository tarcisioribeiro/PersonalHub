import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { personalPlanningDashboardService } from '@/services/personal-planning-dashboard-service';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import type { PersonalPlanningDashboardStats, DailyReflection } from '@/types';

export default function PersonalPlanningDashboard() {
  const [stats, setStats] = useState<PersonalPlanningDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas de Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completed_tasks_today} / {stats.total_tasks_today}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_routine_tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas rotineiras configuradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objetivos Ativos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_goals}</div>
            <p className="text-xs text-muted-foreground">
              Objetivos em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.current_streak}</div>
            <p className="text-xs text-muted-foreground">
              Dias consecutivos
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.recent_reflections && stats.recent_reflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reflexões Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_reflections.map((reflection: DailyReflection) => (
                <div key={reflection.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">{reflection.date}</span>
                    {reflection.mood && (
                      <span className="text-sm text-muted-foreground capitalize">
                        {reflection.mood}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
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
