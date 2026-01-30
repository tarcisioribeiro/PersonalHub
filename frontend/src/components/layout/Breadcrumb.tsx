import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  className?: string;
}

/**
 * Componente Breadcrumb para navegação hierárquica.
 *
 * Exibe a hierarquia de navegação atual baseada na rota.
 * Em mobile mostra apenas o item atual, em desktop mostra todos.
 *
 * @example
 * ```tsx
 * <Breadcrumb className="my-4" />
 * ```
 */
export function Breadcrumb({ className }: BreadcrumbProps) {
  const { breadcrumbs } = useBreadcrumb();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center', className)}
    >
      {/* Versão desktop - todos os items */}
      <ol className="hidden md:flex items-center gap-1 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = item.icon;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5',
                    isLast
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Versão mobile - apenas item atual */}
      <div className="flex md:hidden items-center gap-2 text-sm">
        {breadcrumbs.length > 1 && (
          <>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Voltar ao início"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Link>
            <span className="text-foreground font-medium">
              {breadcrumbs[breadcrumbs.length - 1].label}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}

export default Breadcrumb;
