import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Vault, ArrowDownToLine, ArrowUpFromLine, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vaultsService } from '@/services/vaults-service';
import { accountsService } from '@/services/accounts-service';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { formatCurrency } from '@/lib/formatters';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, type Column } from '@/components/common/DataTable';
import type { Vault as VaultType, VaultFormData, Account } from '@/types';
import { PageContainer } from '@/components/common/PageContainer';
import { cn } from '@/lib/utils';

export default function Vaults() {
  const [vaults, setVaults] = useState<VaultType[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<VaultType | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationAmount, setOperationAmount] = useState<string>('');
  const [operationDescription, setOperationDescription] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<VaultFormData>({
    description: '',
    account: 0,
    yield_rate: 0,
    is_active: true,
    notes: '',
  });

  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [vaultsData, accountsData] = await Promise.all([
        vaultsService.getAll(),
        accountsService.getAll(),
      ]);
      setVaults(vaultsData);
      setAccounts(accountsData);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (accounts.length === 0) {
      toast({
        title: 'Acao nao permitida',
        description: 'E necessario ter pelo menos uma conta cadastrada antes de criar um cofre.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedVault(undefined);
    setFormData({
      description: '',
      account: accounts[0]?.id || 0,
      yield_rate: 0,
      is_active: true,
      notes: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (vault: VaultType) => {
    setSelectedVault(vault);
    setFormData({
      description: vault.description,
      account: vault.account,
      yield_rate: parseFloat(vault.yield_rate) * 100, // Convert to percentage
      is_active: vault.is_active,
      notes: vault.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const vault = vaults.find(v => v.id === id);
    if (vault && parseFloat(vault.current_balance) > 0) {
      toast({
        title: 'Acao nao permitida',
        description: 'Nao e possivel excluir um cofre com saldo. Realize um saque completo primeiro.',
        variant: 'destructive',
      });
      return;
    }

    const confirmed = await showConfirm({
      title: 'Excluir cofre',
      description: 'Tem certeza que deseja excluir este cofre? Esta acao nao pode ser desfeita.',
    });

    if (confirmed) {
      try {
        await vaultsService.delete(id);
        toast({ title: 'Cofre excluido', description: 'O cofre foi excluido com sucesso.' });
        loadData();
      } catch (error: any) {
        toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const dataToSend = {
        ...formData,
        yield_rate: formData.yield_rate / 100, // Convert from percentage
      };

      if (selectedVault) {
        await vaultsService.update(selectedVault.id, dataToSend);
        toast({ title: 'Cofre atualizado', description: 'O cofre foi atualizado com sucesso.' });
      } else {
        await vaultsService.create(dataToSend);
        toast({ title: 'Cofre criado', description: 'O cofre foi criado com sucesso.' });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedVault) return;
    const amount = parseFloat(operationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Valor invalido', description: 'Informe um valor valido para o deposito.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await vaultsService.deposit(selectedVault.id, {
        amount,
        description: operationDescription || undefined,
      });
      toast({ title: 'Deposito realizado', description: `Deposito de ${formatCurrency(amount)} realizado com sucesso.` });
      setIsDepositDialogOpen(false);
      setOperationAmount('');
      setOperationDescription('');
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro no deposito', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedVault) return;
    const amount = parseFloat(operationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Valor invalido', description: 'Informe um valor valido para o saque.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await vaultsService.withdraw(selectedVault.id, {
        amount,
        description: operationDescription || undefined,
      });
      toast({ title: 'Saque realizado', description: `Saque de ${formatCurrency(amount)} realizado com sucesso.` });
      setIsWithdrawDialogOpen(false);
      setOperationAmount('');
      setOperationDescription('');
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro no saque', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyYield = async (vault: VaultType) => {
    try {
      const response = await vaultsService.applyYield(vault.id);
      if (response.yield_applied > 0) {
        toast({
          title: 'Rendimento aplicado',
          description: `Rendimento de ${formatCurrency(response.yield_applied)} aplicado ao cofre.`,
        });
      } else {
        toast({
          title: 'Sem rendimento',
          description: 'Nao ha rendimento pendente para aplicar.',
        });
      }
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao aplicar rendimento', description: error.message, variant: 'destructive' });
    }
  };

  const openDepositDialog = (vault: VaultType) => {
    setSelectedVault(vault);
    setOperationAmount('');
    setOperationDescription('');
    setIsDepositDialogOpen(true);
  };

  const openWithdrawDialog = (vault: VaultType) => {
    setSelectedVault(vault);
    setOperationAmount('');
    setOperationDescription('');
    setIsWithdrawDialogOpen(true);
  };

  // Calculate totals
  const totalBalance = vaults.reduce((sum, v) => sum + parseFloat(v.current_balance), 0);
  const totalYield = vaults.reduce((sum, v) => sum + parseFloat(v.accumulated_yield), 0);
  const totalPendingYield = vaults.reduce((sum, v) => sum + v.pending_yield, 0);

  const columns: Column<VaultType>[] = [
    {
      key: 'description',
      label: 'Descricao',
      render: (vault) => (
        <div>
          <div className="font-medium">{vault.description}</div>
          <div className="text-xs text-muted-foreground">{vault.account_name}</div>
        </div>
      ),
    },
    {
      key: 'current_balance',
      label: 'Saldo Atual',
      render: (vault) => (
        <span className={cn(
          "font-semibold",
          parseFloat(vault.current_balance) > 0 ? "text-success" : ""
        )}>
          {formatCurrency(parseFloat(vault.current_balance))}
        </span>
      ),
    },
    {
      key: 'accumulated_yield',
      label: 'Rendimentos',
      render: (vault) => (
        <div>
          <div className="text-success">{formatCurrency(parseFloat(vault.accumulated_yield))}</div>
          {vault.pending_yield > 0 && (
            <div className="text-xs text-muted-foreground">
              +{formatCurrency(vault.pending_yield)} pendente
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'yield_rate',
      label: 'Taxa',
      render: (vault) => (
        <span>{vault.yield_rate_percentage.toFixed(4)}% ao dia</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (vault) => (
        <Badge variant={vault.is_active ? 'default' : 'secondary'}>
          {vault.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acoes',
      render: (vault) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDepositDialog(vault)}
            title="Depositar"
            disabled={!vault.is_active}
          >
            <ArrowDownToLine className="h-4 w-4 text-success" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openWithdrawDialog(vault)}
            title="Sacar"
            disabled={!vault.is_active || parseFloat(vault.current_balance) <= 0}
          >
            <ArrowUpFromLine className="h-4 w-4 text-destructive" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleApplyYield(vault)}
            title="Aplicar Rendimento"
            disabled={!vault.is_active || vault.pending_yield <= 0}
          >
            <RefreshCcw className="h-4 w-4 text-info" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(vault)}
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(vault.id)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Cofres"
        icon={<Vault />}
        action={{
          label: 'Novo Cofre',
          icon: <Plus className="h-4 w-4" />,
          onClick: handleCreate,
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rendimentos Acumulados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalYield)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rendimentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{formatCurrency(totalPendingYield)}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={vaults}
        columns={columns}
        keyExtractor={(vault) => vault.id}
        isLoading={isLoading}
        emptyState={{ message: "Nenhum cofre cadastrado" }}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedVault ? 'Editar Cofre' : 'Novo Cofre'}</DialogTitle>
            <DialogDescription>
              {selectedVault
                ? 'Altere os dados do cofre abaixo.'
                : 'Preencha os dados para criar um novo cofre.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Descricao *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Reserva de Emergencia"
              />
            </div>
            <div>
              <Label htmlFor="account">Conta Associada *</Label>
              <Select
                value={formData.account.toString()}
                onValueChange={(value) => setFormData({ ...formData, account: parseInt(value) })}
                disabled={!!selectedVault}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="yield_rate">Taxa de Rendimento (% ao dia)</Label>
              <Input
                id="yield_rate"
                type="number"
                step="0.0001"
                min="0"
                value={formData.yield_rate}
                onChange={(e) => setFormData({ ...formData, yield_rate: parseFloat(e.target.value) || 0 })}
                placeholder="Ex: 0.0329"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deixe 0 para cofres sem rendimento
              </p>
            </div>
            <div>
              <Label htmlFor="notes">Observacoes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Anotacoes sobre o cofre..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Cofre ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.description}>
              {isSubmitting ? 'Salvando...' : selectedVault ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Depositar no Cofre</DialogTitle>
            <DialogDescription>
              {selectedVault && (
                <>
                  Depositar no cofre "{selectedVault.description}".
                  <br />
                  Saldo disponivel na conta: {formatCurrency(parseFloat(selectedVault.account_balance))}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deposit_amount">Valor do Deposito *</Label>
              <Input
                id="deposit_amount"
                type="number"
                step="0.01"
                min="0.01"
                max={selectedVault ? parseFloat(selectedVault.account_balance) : undefined}
                value={operationAmount}
                onChange={(e) => setOperationAmount(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div>
              <Label htmlFor="deposit_description">Descricao</Label>
              <Input
                id="deposit_description"
                value={operationDescription}
                onChange={(e) => setOperationDescription(e.target.value)}
                placeholder="Ex: Deposito mensal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeposit} disabled={isSubmitting || !operationAmount}>
              {isSubmitting ? 'Depositando...' : 'Depositar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sacar do Cofre</DialogTitle>
            <DialogDescription>
              {selectedVault && (
                <>
                  Sacar do cofre "{selectedVault.description}".
                  <br />
                  Saldo disponivel no cofre: {formatCurrency(parseFloat(selectedVault.current_balance))}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="withdraw_amount">Valor do Saque *</Label>
              <Input
                id="withdraw_amount"
                type="number"
                step="0.01"
                min="0.01"
                max={selectedVault ? parseFloat(selectedVault.current_balance) : undefined}
                value={operationAmount}
                onChange={(e) => setOperationAmount(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div>
              <Label htmlFor="withdraw_description">Descricao</Label>
              <Input
                id="withdraw_description"
                value={operationDescription}
                onChange={(e) => setOperationDescription(e.target.value)}
                placeholder="Ex: Saque para emergencia"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleWithdraw} disabled={isSubmitting || !operationAmount}>
              {isSubmitting ? 'Sacando...' : 'Sacar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
