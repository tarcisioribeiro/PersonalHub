import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReceiptTemplate } from './ReceiptTemplate';
import type { ReceiptData, ExportFormat } from '@/types/receipt';
import { useReceiptGenerator } from '@/hooks/use-receipt-generator';
import { FileText, Image, Loader2 } from 'lucide-react';

interface ReceiptPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ReceiptData | null;
}

/**
 * Receipt Preview Dialog
 *
 * Shows a preview of the receipt before exporting.
 * Allows user to choose between PDF and PNG export formats.
 */
export function ReceiptPreviewDialog({
  open,
  onOpenChange,
  data,
}: ReceiptPreviewDialogProps) {
  // Ref for the hidden full-size receipt (used for export)
  const captureRef = useRef<HTMLDivElement>(null);
  const { isGenerating, error, generateReceipt, clearError } =
    useReceiptGenerator();

  const handleExport = async (format: ExportFormat) => {
    if (!data) return;
    // Use the hidden full-size element for capture
    await generateReceipt(captureRef.current, data, format);
    if (!error) {
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      clearError();
    }
    onOpenChange(newOpen);
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Comprovante de {data.typeLabel}</DialogTitle>
        </DialogHeader>

        {/* Receipt Preview (scaled for display) */}
        <div className="flex justify-center bg-muted rounded-lg p-4 overflow-auto custom-scrollbar">
          <div className="transform scale-[0.65] origin-top">
            <ReceiptTemplate data={data} />
          </div>
        </div>

        {/* Full-size receipt for capture - positioned off-screen but fully rendered */}
        <div
          style={{
            position: 'fixed',
            left: '-10000px',
            top: 0,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <ReceiptTemplate ref={captureRef} data={data} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Export Buttons */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('png')}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Image className="w-4 h-4 mr-2" />
            )}
            Exportar PNG
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
