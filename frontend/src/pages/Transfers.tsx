import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransferForm } from '@/components/transfers/TransferForm';
import { transfersService } from '@/services/transfers-service';
import { accountsService } from '@/services/accounts-service';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { translate } from '@/config/constants';
import type { Transfer, TransferFormData, Account } from '@/types';
import { format } from 'date-fns';

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [transfersData, accountsData] = await Promise.all([
        transfersService.getAll(),
        accountsService.getAll(),
      ]);
      setTransfers(transfersData);
      setAccounts(accountsData);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: TransferFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedTransfer) {
        await transfersService.update(selectedTransfer.id, data);
        toast({ title: 'Transferência atualizada', description: 'A transferência foi atualizada com sucesso.' });
      } else {
        await transfersService.create(data);
        toast({ title: 'Transferência criada', description: 'A transferência foi criada com sucesso.' });
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
    if (accounts.length < 2) {
      toast({
        title: 'Ação não permitida',
        description: 'É necessário ter pelo menos duas contas cadastradas antes de criar uma transferência.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedTransfer(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Excluir transferência',
      description: 'Tem certeza que deseja excluir esta transferência? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await transfersService.delete(id);
      toast({ title: 'Transferência excluída', description: 'A transferência foi excluída com sucesso.' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transferências</h1>
          <p className="text-muted-foreground mt-2">Histórico de transferências</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />Nova Transferência
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : transfers.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Nenhuma transferência cadastrada.</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Origem → Destino</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium">{transfer.description}</div></td>
                    <td className="px-6 py-4 text-right font-semibold">{formatCurrency(transfer.value)}</td>
                    <td className="px-6 py-4"><Badge>{translate('transferTypes', transfer.category)}</Badge></td>
                    <td className="px-6 py-4 text-sm">{transfer.origin_account_name} → {transfer.destiny_account_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{format(new Date(transfer.date), 'dd/MM/yyyy')} às {transfer.horary}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedTransfer(transfer); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transfer.id)}>
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
            <DialogTitle>{selectedTransfer ? 'Editar Transferência' : 'Nova Transferência'}</DialogTitle>
            <DialogDescription>{selectedTransfer ? 'Atualize as informações da transferência' : 'Adicione uma nova transferência ao sistema'}</DialogDescription>
          </DialogHeader>
          <TransferForm transfer={selectedTransfer} accounts={accounts} onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
