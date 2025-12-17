import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TRANSLATIONS } from '@/config/constants';
import type { Member, MemberFormData } from '@/types';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MemberForm: React.FC<MemberFormProps> = ({ member, onSubmit, onCancel, isLoading = false }) => {
  const { register, handleSubmit, setValue, watch } = useForm<MemberFormData>({
    defaultValues: member ? {
      member_name: member.member_name,
      member_type: member.member_type,
    } : {
      member_type: 'user',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome *</Label>
        <Input {...register('member_name', { required: true })} placeholder="Ex: João Silva" disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label>Tipo *</Label>
        <Select value={watch('member_type')} onValueChange={(v) => setValue('member_type', v)}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            {Object.entries(TRANSLATIONS.memberTypes).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : member ? 'Atualizar' : 'Criar'}</Button>
      </div>
    </form>
  );
};
