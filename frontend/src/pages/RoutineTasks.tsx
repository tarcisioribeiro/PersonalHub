import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/hooks/use-toast';
import type { RoutineTask } from '@/types';

export default function RoutineTasks() {
  const [tasks, setTasks] = useState<RoutineTask[]>([]);
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
        title="Tarefas Rotineiras"
        description="Gerencie suas tarefas diárias, semanais e mensais"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </PageHeader>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhuma tarefa rotineira cadastrada
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeira tarefa
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{task.name}</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
