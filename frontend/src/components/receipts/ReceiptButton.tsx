import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ReceiptTemplate } from './ReceiptTemplate';
import { ReceiptPreviewDialog } from './ReceiptPreviewDialog';
import { useReceiptGenerator } from '@/hooks/use-receipt-generator';
import type { ReceiptData, ExportFormat } from '@/types/receipt';
import {
  mapExpenseToReceipt,
  mapRevenueToReceipt,
  mapCreditCardBillToReceipt,
  mapCreditCardBillWithItemsToReceipt,
  mapCreditCardPurchaseToReceipt,
  mapLoanToReceipt,
  mapPayableToReceipt,
  mapTransferToReceipt,
  mapVaultDepositToReceipt,
  mapVaultWithdrawalToReceipt,
} from '@/lib/receipt-utils';
import type {
  Expense,
  Revenue,
  CreditCardBill,
  CreditCardPurchase,
  CreditCardInstallment,
  Loan,
  Payable,
  Transfer,
  Vault,
  VaultTransaction,
} from '@/types';
import { creditCardInstallmentsService } from '@/services/credit-card-installments-service';
import { FileText, Image, Receipt, Eye, Loader2 } from 'lucide-react';

// Type for different data sources
type ReceiptSourceData =
  | { type: 'expense'; data: Expense }
  | { type: 'revenue'; data: Revenue }
  | { type: 'credit_card_bill'; data: CreditCardBill }
  | { type: 'credit_card_purchase'; data: CreditCardPurchase }
  | { type: 'loan'; data: Loan }
  | { type: 'payable'; data: Payable }
  | { type: 'transfer'; data: Transfer }
  | { type: 'vault_deposit'; data: { vault: Vault; transaction: VaultTransaction } }
  | { type: 'vault_withdrawal'; data: { vault: Vault; transaction: VaultTransaction } };

interface ReceiptButtonProps {
  source: ReceiptSourceData;
  memberName: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

/**
 * Receipt Button Component
 *
 * A button with dropdown menu for generating receipts in PDF or PNG format.
 * Also includes option to preview before exporting.
 */
export function ReceiptButton({
  source,
  memberName,
  variant = 'ghost',
  size = 'icon',
}: ReceiptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [billInstallments, setBillInstallments] = useState<CreditCardInstallment[]>([]);
  const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { isGenerating, generateReceipt } = useReceiptGenerator();

  // Load installments for credit card bills
  const loadBillInstallments = useCallback(async () => {
    if (source.type === 'credit_card_bill' && billInstallments.length === 0) {
      setIsLoadingInstallments(true);
      try {
        const installments = await creditCardInstallmentsService.getByBill(source.data.id);
        setBillInstallments(installments);
      } catch (error) {
        console.error('Erro ao carregar parcelas da fatura:', error);
      } finally {
        setIsLoadingInstallments(false);
      }
    }
  }, [source, billInstallments.length]);

  // Convert source data to ReceiptData
  const getReceiptData = useCallback((): ReceiptData => {
    switch (source.type) {
      case 'expense':
        return mapExpenseToReceipt(source.data, memberName);
      case 'revenue':
        return mapRevenueToReceipt(source.data, memberName);
      case 'credit_card_bill':
        // Use version with installments if available
        if (billInstallments.length > 0) {
          return mapCreditCardBillWithItemsToReceipt(
            source.data,
            billInstallments,
            memberName
          );
        }
        return mapCreditCardBillToReceipt(source.data, memberName);
      case 'credit_card_purchase':
        return mapCreditCardPurchaseToReceipt(source.data, memberName);
      case 'loan':
        return mapLoanToReceipt(source.data, memberName);
      case 'payable':
        return mapPayableToReceipt(source.data, memberName);
      case 'transfer':
        return mapTransferToReceipt(source.data, memberName);
      case 'vault_deposit':
        return mapVaultDepositToReceipt(
          source.data.vault,
          source.data.transaction,
          memberName
        );
      case 'vault_withdrawal':
        return mapVaultWithdrawalToReceipt(
          source.data.vault,
          source.data.transaction,
          memberName
        );
    }
  }, [source, memberName, billInstallments]);

  const receiptData = getReceiptData();

  const handleExport = async (format: ExportFormat) => {
    setIsOpen(false);
    // Wait for popover to close and hidden receipt to render
    await new Promise((resolve) => setTimeout(resolve, 100));
    await generateReceipt(receiptRef.current, receiptData, format);
  };

  const handlePreview = () => {
    setIsOpen(false);
    setShowPreview(true);
  };

  return (
    <>
      {/* Hidden receipt template for direct export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <ReceiptTemplate ref={receiptRef} data={receiptData} />
      </div>

      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            loadBillInstallments();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={isGenerating}
            title="Gerar comprovante"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Receipt className="w-4 h-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          {isLoadingInstallments ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Carregando...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => handleExport('pdf')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => handleExport('png')}
              >
                <Image className="w-4 h-4 mr-2" />
                Exportar PNG
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Preview Dialog */}
      <ReceiptPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        data={receiptData}
      />
    </>
  );
}
