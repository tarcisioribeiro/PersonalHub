import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storedAccountsService } from '@/services/stored-accounts-service';
import { useToast } from '@/hooks/use-toast';
import type { StoredBankAccount } from '@/types';

export default function StoredAccounts() {
  const [accounts, setAccounts] = useState<StoredBankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await storedAccountsService.getAll();
      setAccounts(data);
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
          <h1 className="text-3xl font-bold tracking-tight">Contas Bancárias</h1>
          <p className="text-muted-foreground">
            Armazene dados das suas contas bancárias com segurança
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Funcionalidade completa em desenvolvimento.
          {accounts.length} contas encontradas.
        </p>
      </div>
    </div>
  );
}
