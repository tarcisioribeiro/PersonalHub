import { useState, useEffect } from 'react';
import { Plus, Loader2, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { booksService } from '@/services/books-service';
import { useToast } from '@/hooks/use-toast';
import type { Book } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await booksService.getAll();
      setBooks(data);
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

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors_names.some((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      book.publisher_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return 'bg-green-500';
      case 'reading':
        return 'bg-blue-500';
      case 'to_read':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
          <p className="text-muted-foreground">
            Gerencie sua coleção de livros
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Livro
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar livros, autores ou editoras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {book.authors_names.join(', ')}
                  </CardDescription>
                </div>
                <Badge
                  className={getStatusColor(book.read_status)}
                  variant="default"
                >
                  {book.read_status_display}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {book.publisher_name}
                  </span>
                  <Badge variant="secondary">{book.genre_display}</Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {book.pages} páginas
                  </span>
                  {book.media_type_display && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {book.media_type_display}
                      </span>
                    </>
                  )}
                </div>

                {book.reading_progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Progresso
                      </span>
                      <span className="font-medium">
                        {book.reading_progress}%
                      </span>
                    </div>
                    <Progress value={book.reading_progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {book.total_pages_read} de {book.pages} páginas lidas
                    </p>
                  </div>
                )}

                {book.has_summary && (
                  <Badge variant="outline" className="w-full justify-center">
                    ✓ Possui resumo
                  </Badge>
                )}

                <div className="text-xs text-muted-foreground pt-2">
                  Adicionado em{' '}
                  {format(new Date(book.created_at), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum livro encontrado.</p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar primeiro livro
          </Button>
        </div>
      )}
    </div>
  );
}
