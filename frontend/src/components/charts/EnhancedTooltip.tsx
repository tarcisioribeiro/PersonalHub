

interface EnhancedTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: any; color: string; payload: any }>; // Recharts payload items
  label?: string | number;
  formatter?: (value: any) => string;
}

export const EnhancedTooltip = ({
  active,
  payload,
  label,
  formatter,
}: EnhancedTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="bg-background/95 backdrop-blur-sm border border-border
                  p-3 rounded-lg shadow-lg max-w-xs text-sm"
    >
      <p className="text-muted-foreground mb-1">{label}</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {payload.map((entry: { name: string; value: any; color: string; payload: any }, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-xs">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            <span className="text-foreground">{entry.name}:</span>{' '}
            <span className="text-muted-foreground font-medium">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
