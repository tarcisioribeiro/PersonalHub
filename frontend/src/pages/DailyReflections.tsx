import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/hooks/use-toast';
import type { DailyReflection } from '@/types';

export default function DailyReflections() {
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar chamada ao service
      setReflections([]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar reflexões',
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
        title="Reflexões Diárias"
        description="Registre suas reflexões e pensamentos do dia"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Reflexão
        </Button>
      </PageHeader>

      {reflections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhuma reflexão registrada
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar primeira reflexão
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reflections.map((reflection) => (
            <div key={reflection.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{reflection.date}</span>
                {reflection.mood && (
                  <span className="text-sm text-muted-foreground capitalize">
                    {reflection.mood}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{reflection.reflection}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
