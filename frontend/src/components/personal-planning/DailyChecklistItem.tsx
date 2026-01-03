import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { TaskForToday } from '@/types';
import { useState, useEffect } from 'react';

interface DailyChecklistItemProps {
  task: TaskForToday;
  onToggle: (taskId: number, completed: boolean) => void;
  onQuantityChange: (taskId: number, quantity: number) => void;
}

export function DailyChecklistItem({
  task,
  onToggle,
  onQuantityChange,
}: DailyChecklistItemProps) {
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>(
    Array(task.target_quantity).fill(false)
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: 'bg-category-health',
      studies: 'bg-category-studies',
      spiritual: 'bg-category-spiritual',
      exercise: 'bg-category-exercise',
      nutrition: 'bg-category-nutrition',
      meditation: 'bg-primary',
      reading: 'bg-warning',
      writing: 'bg-accent',
      work: 'bg-category-work',
      leisure: 'bg-category-leisure',
      family: 'bg-destructive',
      social: 'bg-primary',
      finance: 'bg-category-finance',
      household: 'bg-success',
      personal_care: 'bg-accent',
      other: 'bg-muted',
    };
    return colors[category] || 'bg-muted';
  };

  // Sincronizar com task.completed e quantity_completed
  useEffect(() => {
    if (task.completed) {
      setCheckboxStates(Array(task.target_quantity).fill(true));
    } else {
      const newStates = Array(task.target_quantity).fill(false);
      for (let i = 0; i < task.quantity_completed; i++) {
        newStates[i] = true;
      }
      setCheckboxStates(newStates);
    }
  }, [task.completed, task.quantity_completed, task.target_quantity]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newStates = [...checkboxStates];
    newStates[index] = checked;
    setCheckboxStates(newStates);

    const completedCount = newStates.filter(Boolean).length;
    const allCompleted = completedCount === task.target_quantity;

    onToggle(task.task_id, allCompleted);
    onQuantityChange(task.task_id, completedCount);
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2">
        <Label className="text-base font-medium">
          {task.task_name}
        </Label>
        <Badge className={getCategoryColor(task.category)}>
          {task.category_display}
        </Badge>
      </div>

      {/* Checkboxes horizontais */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: task.target_quantity }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox
              id={`task-${task.task_id}-${index}`}
              checked={checkboxStates[index]}
              onCheckedChange={(checked) =>
                handleCheckboxChange(index, checked as boolean)
              }
            />
            <Label
              htmlFor={`task-${task.task_id}-${index}`}
              className="text-sm cursor-pointer"
            >
              {index + 1}º {task.unit}
            </Label>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="text-sm text-muted-foreground">
        <span>
          Meta: {task.quantity_completed}/{task.target_quantity} {task.unit}
        </span>
      </div>

      {/* Nota estilizada como post-it */}
      {task.notes && (
        <div className="mt-2 p-3 bg-warning/20 border-b-4 border-warning shadow-md rotate-[-1deg] rounded-sm">
          <p className="text-sm italic text-foreground">{task.notes}</p>
        </div>
      )}
    </div>
  );
}
