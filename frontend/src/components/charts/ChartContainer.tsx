import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useChartType, ChartType } from '@/hooks/use-chart-type';
import { EnhancedPieChart } from './EnhancedPieChart';
import { EnhancedBarChart } from './EnhancedBarChart';
import { EnhancedLineChart } from './EnhancedLineChart';
import { cn } from '@/lib/utils';

interface LineConfig {
  dataKey: string;
  stroke: string;
  yAxisId?: string;
  name?: string;
}

interface YAxisConfig {
  dataKey: string;
  label?: string;
  color: string;
}

interface DualYAxisConfig {
  left: YAxisConfig;
  right: YAxisConfig;
}

interface ChartContainerProps {
  chartId: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  formatter?: (value: any) => string;
  colors: string[];
  enabledTypes?: ChartType[];
  emptyMessage?: string;
  customColors?: (entry: any) => string;
  dualYAxis?: DualYAxisConfig;
  lines?: LineConfig[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
  withArea?: boolean;
  defaultType?: ChartType;
}

/**
 * Container de gráfico com sistema de toggle entre tipos
 * - Botão de alternância no canto superior direito
 * - Persistência de preferência no localStorage
 * - Animações suaves entre transições
 * - Suporte a todos os tipos de gráfico (Pie, Bar, Line)
 * - Empty state quando não há dados
 */
export const ChartContainer = ({
  chartId,
  data,
  dataKey,
  nameKey,
  formatter,
  colors,
  enabledTypes = ['pie', 'bar', 'line'],
  emptyMessage = 'Nenhum dado disponível',
  customColors,
  dualYAxis,
  lines,
  height = 300,
  layout = 'vertical',
  withArea = true,
  defaultType = 'pie',
}: ChartContainerProps) => {
  const { chartType, cycleChartType } = useChartType(chartId, defaultType);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    cycleChartType();
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
        <div className="h-12 w-12 mb-2 opacity-50 flex items-center justify-center">
          <RefreshCw className="h-8 w-8" />
        </div>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="absolute top-0 right-0 z-10 group">
        <motion.button
          onClick={handleToggle}
          disabled={isAnimating}
          className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border
                     hover:bg-accent transition-colors disabled:opacity-50 shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Alternar visualização do gráfico"
        >
          <RefreshCw
            className={cn('h-4 w-4 transition-transform', isAnimating && 'animate-spin')}
          />
        </motion.button>

        {/* Tooltip hint on hover */}
        <div
          className="absolute top-12 right-0 opacity-0 group-hover:opacity-100
                      text-xs text-muted-foreground bg-background/95 backdrop-blur-sm
                      border border-border rounded px-2 py-1 shadow-sm transition-opacity
                      whitespace-nowrap pointer-events-none"
        >
          Clique para alternar
        </div>
      </div>

      {/* Chart Renderer with Transition Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {chartType === 'pie' && enabledTypes.includes('pie') && (
            <EnhancedPieChart
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              formatter={formatter}
              colors={colors}
              customColors={customColors}
              height={height}
            />
          )}

          {chartType === 'bar' && enabledTypes.includes('bar') && (
            <EnhancedBarChart
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              formatter={formatter}
              colors={colors}
              customColors={customColors}
              layout={layout}
              height={height}
            />
          )}

          {chartType === 'line' && enabledTypes.includes('line') && (
            <EnhancedLineChart
              data={data}
              dataKey={lines ? undefined : dataKey}
              nameKey={nameKey}
              formatter={formatter}
              colors={colors}
              lines={lines}
              dualYAxis={dualYAxis}
              height={height}
              withArea={withArea}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
