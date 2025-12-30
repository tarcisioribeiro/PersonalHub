import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { formatDate } from '@/lib/formatters';
import { readingsService } from '@/services/readings-service';
import { booksService } from '@/services/books-service';
import type { Reading, ReadingFormData, Book } from '@/types';
import { Plus, Edit, Trash2, BookMarked, BookOpen, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { ReadingForm } from '@/components/library/ReadingForm';

export default function Readings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { showConfirm } = useAlertDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [readingsData, booksData] = await Promise.all([
        readingsService.getAll(),
        booksService.getAll(),
      ]);
      setReadings(readingsData);
      setBooks(booksData);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (books.length === 0) {
      toast({
        title: 'Ação não permitida',
        description: 'É necessário ter pelo menos um livro cadastrado antes de registrar uma leitura.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedReading(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (reading: Reading) => {
    setSelectedReading(reading);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Excluir leitura',
      description: 'Tem certeza que deseja excluir esta leitura? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await readingsService.delete(id);
      toast({
        title: 'Leitura excluída',
        description: 'A leitura foi excluída com sucesso.',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir leitura',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: ReadingFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedReading) {
        await readingsService.update(selectedReading.id, data);
        toast({
          title: 'Leitura atualizada',
          description: 'A leitura foi atualizada com sucesso.',
        });
      } else {
        await readingsService.create(data);
        toast({
          title: 'Leitura registrada',
          description: 'A leitura foi registrada com sucesso.',
        });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReadings = readings.filter(
    (reading) =>
      reading.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reading.notes && reading.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leituras"
        description="Acompanhe seu progresso de leitura"
        icon={<BookMarked />}
        action={{
          label: 'Nova Leitura',
          icon: <Plus className="h-4 w-4" />,
          onClick: handleCreate,
        }}
      />

      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Buscar leituras..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="flex-1"
        />
      </div>

      {filteredReadings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookMarked className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Nenhuma leitura encontrada</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm
                ? 'Tente ajustar sua pesquisa'
                : 'Comece registrando sua primeira leitura'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReadings.map((reading) => (
            <Card key={reading.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                      <CardTitle className="text-xl">{reading.book_title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(reading.reading_date, 'dd/MM/yyyy')}
                      </div>
                      <Badge variant="secondary">
                        {reading.pages_read} páginas lidas
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(reading)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reading.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {reading.notes && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {reading.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReading ? 'Editar' : 'Registrar'} Leitura
            </DialogTitle>
            <DialogDescription>
              {selectedReading
                ? 'Atualize as informações da leitura'
                : 'Registre o progresso de leitura de um livro'}
            </DialogDescription>
          </DialogHeader>
          <ReadingForm
            reading={selectedReading}
            books={books}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
