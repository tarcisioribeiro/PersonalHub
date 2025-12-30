import { useState } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Toaster() {
  const { toasts } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, title?: React.ReactNode, description?: React.ReactNode) => {
    const titleText = typeof title === 'string' ? title : '';
    const descriptionText = typeof description === 'string' ? description : '';
    const textToCopy = `${titleText}\n${descriptionText}`.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(title || description) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(id, title, description)}
                >
                  {copiedId === id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
              {action}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
