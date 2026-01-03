import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import type { TaskCard, KanbanStatus } from '@/types';

interface KanbanColumnProps {
  status: KanbanStatus;
  title: string;
  cards: TaskCard[];
}

export function KanbanColumn({ status, title, cards }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getColorClasses = () => {
    const colors = {
      todo: 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600',
      doing: 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700',
      done: 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700',
    };
    return colors[status] || colors.todo;
  };

  const getHeaderColor = () => {
    const colors = {
      todo: 'bg-slate-600 dark:bg-slate-700',
      doing: 'bg-blue-600 dark:bg-blue-700',
      done: 'bg-green-600 dark:bg-green-700',
    };
    return colors[status] || colors.todo;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`${getHeaderColor()} text-white px-4 py-3 rounded-t-lg`}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm opacity-90">{cards.length} {cards.length === 1 ? 'tarefa' : 'tarefas'}</p>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`flex-1 ${getColorClasses()} border-2 rounded-b-lg p-4 min-h-[500px] transition-colors ${
          isOver ? 'border-dashed border-4 border-blue-400 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/30' : ''
        }`}
      >
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {cards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                <p className="text-sm">Nenhuma tarefa</p>
              </div>
            ) : (
              cards.map((card) => <KanbanCard key={card.id} card={card} />)
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
