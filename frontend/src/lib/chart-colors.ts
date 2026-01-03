import { useEffect, useState } from 'react';

/**
 * Sistema de cores para gráficos Recharts
 * Retorna cores adaptadas ao tema atual (light/dark)
 */

export const getChartColors = () => {
  const isDark = document.documentElement.classList.contains('dark');

  if (isDark) {
    return ['#bd93f9', '#ff79c6', '#8be9fd', '#50fa7b', '#ffb86c', '#ff5555'];
  } else {
    return ['#9b59d9', '#e056ad', '#5ec9e8', '#2dd45e', '#d4b956', '#e63c3c'];
  }
};

/**
 * Hook reativo que atualiza cores quando o tema muda
 * Usa MutationObserver para detectar mudanças na classe 'dark' do HTML
 */
export const useChartColors = () => {
  const [colors, setColors] = useState(getChartColors());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setColors(getChartColors());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
};
