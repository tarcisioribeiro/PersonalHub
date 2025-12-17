import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { readingsService } from '@/services/readings-service';
import { booksService } from '@/services/books-service';
import type { Reading, ReadingFormData, Book } from '@/types';
import { Loader2, Plus, Search, Edit, Trash2, BookMarked, BookOpen, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Readings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [formData, setFormData] = useState<ReadingFormData>({
    book: 0,
    pages_read: 0,
    reading_date: new Date().toISOString().split('T')[0],
    reading_time: 0,
    notes: '',
    owner: 0,
  });
  const { toast } = useToast();

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
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar as leituras.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await readingsService.create(formData);
      toast({
        title: 'Leitura registrada',
        description: 'A leitura foi registrada com sucesso.',
      });
      setIsCreateDialogOpen(false);
      setFormData({
        book: 0,
        pages_read: 0,
        reading_date: new Date().toISOString().split('T')[0],
        reading_time: 0,
        notes: '',
        owner: 0,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro ao registrar leitura',
        description: 'Não foi possível registrar a leitura.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReading) return;

    try {
      await readingsService.update(selectedReading.id, formData);
      toast({
        title: 'Leitura atualizada',
        description: 'A leitura foi atualizada com sucesso.',
      });
      setIsEditDialogOpen(false);
      setSelectedReading(null);
      setFormData({
        book: 0,
        pages_read: 0,
        reading_date: new Date().toISOString().split('T')[0],
        reading_time: 0,
        notes: '',
        owner: 0,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar leitura',
        description: 'Não foi possível atualizar a leitura.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta leitura?')) return;

    try {
      await readingsService.delete(id);
      toast({
        title: 'Leitura excluída',
        description: 'A leitura foi excluída com sucesso.',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Erro ao excluir leitura',
        description: 'Não foi possível excluir a leitura.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (reading: Reading) => {
    setSelectedReading(reading);
    setFormData({
      book: reading.book,
      pages_read: reading.pages_read,
      reading_date: reading.reading_date,
      reading_time: reading.reading_time,
      notes: reading.notes || '',
      owner: reading.owner,
    });
    setIsEditDialogOpen(true);
  };

  const filteredReadings = readings.filter(
    (reading) =>
      reading.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reading.notes && reading.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getBookMaxPages = (bookId: number): number => {
    const book = books.find((b) => b.id === bookId);
    return book?.pages || 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leituras</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso de leitura</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Leitura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Registrar Nova Leitura</DialogTitle>
                <DialogDescription>Registre o progresso de leitura de um livro.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="book">Livro *</Label>
                  <Select
                    value={formData.book.toString()}
                    onValueChange={(value) => setFormData({ ...formData, book: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um livro" />
                    </SelectTrigger>
                    <SelectContent>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id.toString()}>
                          {book.title} ({book.pages} páginas)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages_read">Páginas Lidas *</Label>
                  <Input
                    id="pages_read"
                    type="number"
                    min="1"
                    max={formData.book ? getBookMaxPages(formData.book) : undefined}
                    value={formData.pages_read}
                    onChange={(e) =>
                      setFormData({ ...formData, pages_read: parseInt(e.target.value) })
                    }
                    required
                  />
                  {formData.book > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Máximo: {getBookMaxPages(formData.book)} páginas
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reading_date">Data da Leitura *</Label>
                  <Input
                    id="reading_date"
                    type="date"
                    value={formData.reading_date}
                    onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Anotações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="Anotações sobre esta sessão de leitura..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Registrar Leitura</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar leituras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Leitura
              </Button>
            )}
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
                        {new Date(reading.reading_date).toLocaleDateString('pt-BR')}
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
                      onClick={() => openEditDialog(reading)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Editar Leitura</DialogTitle>
              <DialogDescription>Atualize as informações da leitura.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-book">Livro *</Label>
                <Select
                  value={formData.book.toString()}
                  onValueChange={(value) => setFormData({ ...formData, book: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id.toString()}>
                        {book.title} ({book.pages} páginas)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pages_read">Páginas Lidas *</Label>
                <Input
                  id="edit-pages_read"
                  type="number"
                  min="1"
                  max={formData.book ? getBookMaxPages(formData.book) : undefined}
                  value={formData.pages_read}
                  onChange={(e) =>
                    setFormData({ ...formData, pages_read: parseInt(e.target.value) })
                  }
                  required
                />
                {formData.book > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Máximo: {getBookMaxPages(formData.book)} páginas
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-reading_date">Data da Leitura *</Label>
                <Input
                  id="edit-reading_date"
                  type="date"
                  value={formData.reading_date}
                  onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Anotações</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="Anotações sobre esta sessão de leitura..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
