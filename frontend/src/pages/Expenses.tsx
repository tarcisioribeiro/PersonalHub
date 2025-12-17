import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { expensesService } from '@/services/expenses-service';
import { accountsService } from '@/services/accounts-service';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { translate, TRANSLATIONS } from '@/config/constants';
import type { Expense, ExpenseFormData, Account } from '@/types';
import { format } from 'date-fns';

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [searchTerm, categoryFilter, statusFilter, expenses]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [expensesData, accountsData] = await Promise.all([
        expensesService.getAll(),
        accountsService.getAll(),
      ]);
      setExpenses(expensesData);
      setFilteredExpenses(expensesData);
      setAccounts(accountsData);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];
    if (searchTerm) {
      filtered = filtered.filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => statusFilter === 'paid' ? e.payed : !e.payed);
    }
    setFilteredExpenses(filtered);
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedExpense) {
        await expensesService.update(selectedExpense.id, data);
        toast({ title: 'Despesa atualizada', description: 'A despesa foi atualizada com sucesso.' });
      } else {
        await expensesService.create(data);
        toast({ title: 'Despesa criada', description: 'A despesa foi criada com sucesso.' });
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
        description: 'É necessário ter pelo menos uma conta cadastrada antes de criar uma despesa.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedExpense(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Excluir despesa',
      description: 'Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await expensesService.delete(id);
      toast({ title: 'Despesa excluída', description: 'A despesa foi excluída com sucesso.' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.value), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="text-muted-foreground mt-2">Acompanhe suas despesas</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />Nova Despesa
        </Button>
      </div>

      <div className="bg-card border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Buscar por descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {Object.entries(TRANSLATIONS.expenseCategories).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">{filteredExpenses.length} despesa(s) encontrada(s)</span>
          <span className="text-lg font-bold text-red-600 dark:text-red-400">Total: {formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filteredExpenses.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Nenhuma despesa encontrada.</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Valor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Conta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium">{expense.description}</div></td>
                    <td className="px-6 py-4 text-right font-semibold text-red-600 dark:text-red-400">{formatCurrency(expense.value)}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-medium">
                        {expense.account_name || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4"><Badge variant="secondary">{translate('expenseCategories', expense.category)}</Badge></td>
                    <td className="px-6 py-4">
                      <Badge variant={expense.payed ? 'success' : 'warning'}>
                        {expense.payed ? 'Pago' : 'Pendente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{format(new Date(expense.date), 'dd/MM/yyyy HH:mm')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedExpense(expense); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
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
            <DialogTitle>{selectedExpense ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
            <DialogDescription>{selectedExpense ? 'Atualize as informações da despesa' : 'Adicione uma nova despesa ao sistema'}</DialogDescription>
          </DialogHeader>
          <ExpenseForm expense={selectedExpense} accounts={accounts} onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
