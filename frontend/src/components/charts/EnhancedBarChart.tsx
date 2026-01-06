import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { EnhancedTooltip } from './EnhancedTooltip';

interface EnhancedBarChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  formatter?: (value: any) => string;
  colors: string[];
  customColors?: (entry: any) => string;
  layout?: 'horizontal' | 'vertical';
  height?: number;
}

/**
 * Gráfico de barras aprimorado com:
 * - Gradientes verticais multi-stop
 * - CartesianGrid sutil
 * - Bordas arredondadas
 * - Animações suaves
 * - Tooltip customizado
 * - Suporte a layout horizontal/vertical
 * - Suporte a cores customizadas
 */
export const EnhancedBarChart = ({
  data,
  dataKey,
  nameKey,
  formatter,
  colors,
  customColors,
  layout = 'vertical',
  height = 300,
}: EnhancedBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout}>
        <defs>
          {/* Gradientes verticais multi-stop para profundidade */}
          {colors.map((color, idx) => (
            <linearGradient
              key={`bar-gradient-${idx}`}
              id={`bar-gradient-${idx}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="60%" stopColor={color} stopOpacity={0.85} />
              <stop offset="100%" stopColor={color} stopOpacity={0.65} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.3}
          horizontal={layout === 'vertical'}
          vertical={layout === 'horizontal'}
        />

        {layout === 'vertical' ? (
          <>
            <XAxis type="number" />
            <YAxis dataKey={nameKey} type="category" width={150} />
          </>
        ) : (
          <>
            <XAxis dataKey={nameKey} type="category" />
            <YAxis type="number" />
          </>
        )}

        <Tooltip content={<EnhancedTooltip formatter={formatter} />} />

        <Bar
          dataKey={dataKey}
          radius={layout === 'vertical' ? [0, 8, 8, 0] : [8, 8, 0, 0]}
          animationDuration={800}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => {
            const fillColor = customColors
              ? customColors(entry)
              : `url(#bar-gradient-${index % colors.length})`;

            return (
              <Cell
                key={`cell-${index}`}
                fill={fillColor}
                className="hover:opacity-80 hover:brightness-110 transition-all cursor-pointer"
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
