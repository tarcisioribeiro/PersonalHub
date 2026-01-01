import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/types';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar chamada ao service
      setGoals([]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar objetivos',
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
        title="Objetivos"
        description="Acompanhe seus objetivos e metas pessoais"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Objetivo
        </Button>
      </PageHeader>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhum objetivo cadastrado
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeiro objetivo
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
