import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { archivesService } from '@/services/archives-service';
import { useToast } from '@/hooks/use-toast';
import type { Archive } from '@/types';

export default function Archives() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await archivesService.getAll();
      setArchives(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arquivos Confidenciais</h1>
          <p className="text-muted-foreground">
            Armazene documentos e textos de forma criptografada
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Arquivo
        </Button>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Funcionalidade completa em desenvolvimento.
          {archives.length} arquivos encontrados.
        </p>
      </div>
    </div>
  );
}
