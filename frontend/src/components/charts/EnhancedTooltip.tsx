import { motion } from 'framer-motion';
import { TooltipProps } from 'recharts';

interface EnhancedTooltipProps extends TooltipProps<any, any> {
  formatter?: (value: any) => string;
  icon?: React.ReactNode;
}

/**
 * Tooltip customizado com animações e efeito glass
 * Mantém compatibilidade com formatters existentes (formatCurrency, formatPercentage, etc.)
 */
export const EnhancedTooltip = ({ active, payload, label, formatter, icon }: EnhancedTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
    >
      {label && (
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="font-medium text-foreground text-sm">{label}</span>
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex flex-col">
              {entry.name && entry.name !== entry.dataKey && (
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              )}
              <span className="text-sm font-semibold text-primary">
                {formatter ? formatter(entry.value) : entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
