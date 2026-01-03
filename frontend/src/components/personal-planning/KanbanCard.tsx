import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TaskCard } from '@/types';

interface KanbanCardProps {
  card: TaskCard;
}

export function KanbanCard({ card }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: 'bg-category-health',
      studies: 'bg-category-studies',
      spiritual: 'bg-category-spiritual',
      exercise: 'bg-category-exercise',
      nutrition: 'bg-category-nutrition',
      meditation: 'bg-category-spiritual',
      reading: 'bg-category-studies',
      writing: 'bg-category-work',
      work: 'bg-category-work',
      leisure: 'bg-category-leisure',
      family: 'bg-accent',
      social: 'bg-category-leisure',
      finance: 'bg-category-finance',
      household: 'bg-category-nutrition',
      personal_care: 'bg-category-health',
      other: 'bg-muted',
    };
    return colors[category] || 'bg-muted';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="mt-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Card Content */}
        <div className="flex-1 space-y-2.5">
          {/* Title and Category */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm leading-tight dark:text-gray-100">
              {card.task_name}
              {card.total_instances > 1 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground dark:text-gray-400">
                  ({card.index + 1}º {card.unit})
                </span>
              )}
            </h4>
            <Badge className={`${getCategoryColor(card.category)} shrink-0 text-xs`}>
              {card.category_display}
            </Badge>
          </div>

          {/* Task Description */}
          {card.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {card.description}
            </p>
          )}

          {/* Daily Notes */}
          {card.notes && (
            <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notas:</p>
              <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {card.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
