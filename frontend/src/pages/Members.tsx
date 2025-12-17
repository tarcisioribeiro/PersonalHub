import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberForm } from '@/components/members/MemberForm';
import { membersService } from '@/services/members-service';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { translate } from '@/config/constants';
import type { Member, MemberFormData } from '@/types';
import { format } from 'date-fns';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await membersService.getAll();
      setMembers(data);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: MemberFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedMember) {
        await membersService.update(selectedMember.id, data);
        toast({ title: 'Membro atualizado', description: 'O membro foi atualizado com sucesso.' });
      } else {
        await membersService.create(data);
        toast({ title: 'Membro criado', description: 'O membro foi criado com sucesso.' });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Excluir membro',
      description: 'Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;
    try {
      await membersService.delete(id);
      toast({ title: 'Membro excluído', description: 'O membro foi excluído com sucesso.' });
      loadData();
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Membros</h1>
          <p className="text-muted-foreground mt-2">Gerencie membros do sistema</p>
        </div>
        <Button onClick={() => { setSelectedMember(undefined); setIsDialogOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" />Novo Membro
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : members.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Nenhum membro cadastrado.</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Criado em</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium">{member.member_name}</div></td>
                    <td className="px-6 py-4"><Badge variant="secondary">{translate('memberTypes', member.member_type)}</Badge></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{format(new Date(member.created_at), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedMember(member); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMember ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
            <DialogDescription>{selectedMember ? 'Atualize as informações do membro' : 'Adicione um novo membro ao sistema'}</DialogDescription>
          </DialogHeader>
          <MemberForm member={selectedMember} onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
