import { create } from 'zustand';
import type { LucideIcon } from 'lucide-react';

type AlertVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info';
type AnimationType = 'default' | 'slideUp' | 'slideDown' | 'bounce' | 'shake';
type BlurLevel = 'none' | 'sm' | 'md' | 'lg';

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: AlertVariant;
  animation?: AnimationType;
  blur?: BlurLevel;
  icon?: LucideIcon | React.ReactNode;
  showIcon?: boolean;
}

interface AlertDialogStore extends AlertDialogState {
  openAlert: (config: Omit<AlertDialogState, 'isOpen'>) => void;
  closeAlert: () => void;
}

export const useAlertDialogStore = create<AlertDialogStore>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'default',
  animation: 'default',
  blur: 'md',
  showIcon: true,
  openAlert: (config) => set({ ...config, isOpen: true }),
  closeAlert: () => set({ isOpen: false }),
}));

export const useAlertDialog = () => {
  const store = useAlertDialogStore();

  const showConfirm = (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: AlertVariant;
    animation?: AnimationType;
    blur?: BlurLevel;
    icon?: LucideIcon | React.ReactNode;
    showIcon?: boolean;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      store.openAlert({
        ...options,
        onConfirm: () => {
          store.closeAlert();
          resolve(true);
        },
        onCancel: () => {
          store.closeAlert();
          resolve(false);
        },
      });
    });
  };

  const showAlert = (options: {
    title: string;
    description: string;
    confirmText?: string;
    variant?: AlertVariant;
    animation?: AnimationType;
    blur?: BlurLevel;
    icon?: LucideIcon | React.ReactNode;
    showIcon?: boolean;
  }): Promise<void> => {
    return new Promise((resolve) => {
      store.openAlert({
        ...options,
        onConfirm: () => {
          store.closeAlert();
          resolve();
        },
      });
    });
  };

  const showSuccess = (title: string, description: string, options?: Partial<typeof defaultOptions>): Promise<void> => {
    return showAlert({ title, description, variant: 'success', animation: 'bounce', ...options });
  };

  const showWarning = (title: string, description: string, options?: Partial<typeof defaultOptions>): Promise<boolean> => {
    return showConfirm({ title, description, variant: 'warning', animation: 'slideDown', ...options });
  };

  const showError = (title: string, description: string, options?: Partial<typeof defaultOptions>): Promise<void> => {
    return showAlert({ title, description, variant: 'destructive', animation: 'shake', ...options });
  };

  const showInfo = (title: string, description: string, options?: Partial<typeof defaultOptions>): Promise<void> => {
    return showAlert({ title, description, variant: 'info', animation: 'slideUp', ...options });
  };

  const showDelete = (itemName: string, options?: Partial<typeof defaultOptions>): Promise<boolean> => {
    return showConfirm({
      title: 'Confirmar exclusão',
      description: `Tem certeza que deseja excluir ${itemName}? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
      animation: 'shake',
      ...options,
    });
  };

  return {
    showConfirm,
    showAlert,
    showSuccess,
    showWarning,
    showError,
    showInfo,
    showDelete,
  };
};

const defaultOptions = {
  confirmText: 'OK',
  cancelText: 'Cancelar',
  animation: 'default' as AnimationType,
  blur: 'md' as BlurLevel,
  showIcon: true,
};
