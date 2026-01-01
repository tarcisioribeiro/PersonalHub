import { useState, useEffect } from 'react';
import { Library, BookOpen, User, Building2, FileText, BookMarked, BookCheck, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { libraryDashboardService, type LibraryDashboardStats } from '@/services/library-dashboard-service';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function LibraryDashboard() {
  const [stats, setStats] = useState<LibraryDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await libraryDashboardService.getStats();
      setStats(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#bd93f9', '#ff79c6', '#8be9fd', '#50fa7b', '#ffb86c', '#ff5555'];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <LoadingState fullScreen />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard de Leitura"
        description="Acompanhe seu progresso e estatísticas de leitura"
        icon={<Library />}
      />

      {/* Métricas Principais - Grid 4 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livros</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_books || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.total_books === 1 ? 'livro cadastrado' : 'livros cadastrados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_authors || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.total_authors === 1 ? 'autor' : 'autores'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Editoras</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_publishers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.total_publishers === 1 ? 'editora' : 'editoras'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas Lidas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_pages_read || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Média: {stats?.average_rating?.toFixed(1) || 0} ★
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso de Leitura - Grid 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lendo</CardTitle>
            <BookMarked className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.books_reading || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.books_reading === 1 ? 'livro em andamento' : 'livros em andamento'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Para Ler</CardTitle>
            <BookOpen className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats?.books_to_read || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.books_to_read === 1 ? 'livro na fila' : 'livros na fila'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lidos</CardTitle>
            <BookCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.books_read || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.books_read === 1 ? 'livro completo' : 'livros completos'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Livros por Gênero */}
        <Card>
          <CardHeader>
            <CardTitle>Livros por Gênero (Top 5)</CardTitle>
            <p className="text-sm text-muted-foreground">Distribuição por gênero literário</p>
          </CardHeader>
          <CardContent>
            {!stats || stats.books_by_genre.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Nenhum livro cadastrado
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.books_by_genre} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="genre_display" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {stats.books_by_genre.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stats.books_by_genre.map((genre, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>{genre.genre_display}</span>
                      </div>
                      <span className="font-semibold">
                        {genre.count} {genre.count === 1 ? 'livro' : 'livros'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top 3 Avaliações */}
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Avaliações</CardTitle>
            <p className="text-sm text-muted-foreground">Livros mais bem avaliados</p>
          </CardHeader>
          <CardContent>
            {!stats || stats.top_rated_books.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Nenhum livro avaliado
              </div>
            ) : (
              <div className="space-y-4">
                {stats.top_rated_books.map((book, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.authors_names.join(', ')}
                      </p>
                      <div className="mt-2">{renderStars(book.rating)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leituras Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Leituras Recentes</CardTitle>
          <p className="text-sm text-muted-foreground">Últimas 5 sessões de leitura</p>
        </CardHeader>
        <CardContent>
          {!stats || stats.recent_readings.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Nenhuma leitura registrada
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recent_readings.map((reading, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{reading.book_title}</p>
                      <p className="text-xs text-muted-foreground">
                        {reading.pages_read} {reading.pages_read === 1 ? 'página' : 'páginas'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(reading.reading_date), "dd 'de' MMM", { locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
