import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/hooks/use-toast';
import type { DailyTaskRecord } from '@/types';

export default function TodayTasks() {
  const [tasks, setTasks] = useState<DailyTaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar chamada ao service
      setTasks([]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar tarefas',
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Tarefas de Hoje"
        description="Marque as tarefas que você completou hoje"
      />

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma tarefa programada para hoje
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4 flex items-center gap-4">
              <CheckCircle2
                className={`h-6 w-6 ${
                  task.completed ? 'text-green-500' : 'text-gray-300'
                }`}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{task.task}</h3>
                {task.notes && (
                  <p className="text-sm text-muted-foreground">{task.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
