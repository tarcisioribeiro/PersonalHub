import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCardForm } from '@/components/credit-cards/CreditCardForm';
import { creditCardsService } from '@/services/credit-cards-service';
import { accountsService } from '@/services/accounts-service';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { translate } from '@/config/constants';
import type { CreditCard, CreditCardFormData, Account } from '@/types';

export default function CreditCards() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCard | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cardsData, accountsData] = await Promise.all([
        creditCardsService.getAll(),
        accountsService.getAll(),
      ]);
      setCreditCards(cardsData);
      setAccounts(accountsData);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreditCardFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedCard) {
        await creditCardsService.update(selectedCard.id, data);
        toast({ title: 'Cartão atualizado', description: 'O cartão foi atualizado com sucesso.' });
      } else {
        await creditCardsService.create(data);
        toast({ title: 'Cartão criado', description: 'O cartão foi criado com sucesso.' });
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
        description: 'É necessário ter pelo menos uma conta cadastrada antes de criar um cartão de crédito.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedCard(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Excluir cartão',
      description: 'Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await creditCardsService.delete(id);
      toast({ title: 'Cartão excluído', description: 'O cartão foi excluído com sucesso.' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  const totalLimit = creditCards.reduce((sum, card) => sum + parseFloat(card.credit_limit), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cartões de Crédito</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus cartões de crédito</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />Novo Cartão
        </Button>
      </div>

      <div className="bg-card border rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{creditCards.length} cartão(ões) cadastrado(s)</span>
        <span className="text-lg font-bold">Limite Total: {formatCurrency(totalLimit)}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : creditCards.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Nenhum cartão cadastrado.</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Cartão</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Bandeira</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Número</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Limite</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Vencimento</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {creditCards.map((card) => (
                  <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium">{card.name}</div></td>
                    <td className="px-6 py-4"><Badge>{translate('cardBrands', card.flag)}</Badge></td>
                    <td className="px-6 py-4 font-mono text-sm">{card.card_number_masked ? `******* ${card.card_number_masked.slice(-4)}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-right font-semibold">{formatCurrency(card.credit_limit)}</td>
                    <td className="px-6 py-4 text-center text-sm">Dia {card.due_day}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCard(card); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)}>
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
            <DialogTitle>{selectedCard ? 'Editar Cartão' : 'Novo Cartão'}</DialogTitle>
            <DialogDescription>{selectedCard ? 'Atualize as informações do cartão' : 'Adicione um novo cartão ao sistema'}</DialogDescription>
          </DialogHeader>
          <CreditCardForm creditCard={selectedCard} accounts={accounts} onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
