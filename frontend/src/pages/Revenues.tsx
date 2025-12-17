import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RevenueForm } from '@/components/revenues/RevenueForm';
import { revenuesService } from '@/services/revenues-service';
import { accountsService } from '@/services/accounts-service';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { translate } from '@/config/constants';
import type { Revenue, RevenueFormData, Account } from '@/types';
import { format } from 'date-fns';

export default function Revenues() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [revenuesData, accountsData] = await Promise.all([
        revenuesService.getAll(),
        accountsService.getAll(),
      ]);
      setRevenues(revenuesData);
      setAccounts(accountsData);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: RevenueFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedRevenue) {
        await revenuesService.update(selectedRevenue.id, data);
        toast({ title: 'Receita atualizada', description: 'A receita foi atualizada com sucesso.' });
      } else {
        await revenuesService.create(data);
        toast({ title: 'Receita criada', description: 'A receita foi criada com sucesso.' });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = () => {
    if (accounts.length === 0) {
      toast({
        title: 'Ação não permitida',
        description: 'É necessário ter pelo menos uma conta cadastrada antes de criar uma receita.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedRevenue(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Excluir receita',
      description: 'Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await revenuesService.delete(id);
      toast({ title: 'Receita excluída', description: 'A receita foi excluída com sucesso.' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  const totalRevenues = revenues.reduce((sum, rev) => sum + parseFloat(rev.value), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receitas</h1>
          <p className="text-muted-foreground mt-2">Acompanhe suas receitas</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />Nova Receita
        </Button>
      </div>

      <div className="bg-card border rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{revenues.length} receita(s) cadastrada(s)</span>
        <span className="text-lg font-bold text-green-600 dark:text-green-400">Total: {formatCurrency(totalRevenues)}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : revenues.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Nenhuma receita cadastrada.</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {revenues.map((revenue) => (
                  <tr key={revenue.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium">{revenue.description}</div></td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">{formatCurrency(revenue.value)}</td>
                    <td className="px-6 py-4"><Badge variant="success">{translate('revenueCategories', revenue.category)}</Badge></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{format(new Date(revenue.date + 'T' + revenue.horary), 'dd/MM/yyyy HH:mm')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedRevenue(revenue); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(revenue.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRevenue ? 'Editar Receita' : 'Nova Receita'}</DialogTitle>
            <DialogDescription>{selectedRevenue ? 'Atualize as informações da receita' : 'Adicione uma nova receita ao sistema'}</DialogDescription>
          </DialogHeader>
          <RevenueForm revenue={selectedRevenue} accounts={accounts} onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
