import { create } from 'zustand';

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
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
    variant?: 'default' | 'destructive';
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

  return { showConfirm, showAlert };
};
