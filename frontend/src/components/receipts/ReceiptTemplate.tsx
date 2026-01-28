import { forwardRef } from 'react';
import type { ReceiptData } from '@/types/receipt';
import {
  formatReceiptCurrency,
  formatReceiptDate,
  formatReceiptTime,
  formatGeneratedAt,
} from '@/lib/receipt-utils';
import { autoTranslate } from '@/config/constants';

interface ReceiptTemplateProps {
  data: ReceiptData;
}

// Inline styles for html2canvas compatibility (flexbox doesn't render correctly)
const styles = {
  container: {
    width: '600px',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    padding: '24px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    boxSizing: 'border-box' as const,
    lineHeight: '1.5',
  },
  header: {
    textAlign: 'center' as const,
    borderBottom: '2px solid #d1d5db',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: 0,
  },
  row: {
    display: 'table',
    width: '100%',
    marginBottom: '12px',
  },
  labelCell: {
    display: 'table-cell',
    width: '40%',
    color: '#4b5563',
    fontSize: '14px',
    verticalAlign: 'middle' as const,
  },
  valueCell: {
    display: 'table-cell',
    width: '60%',
    textAlign: 'right' as const,
    color: '#111827',
    verticalAlign: 'middle' as const,
  },
  descriptionBlock: {
    marginBottom: '12px',
  },
  descriptionLabel: {
    color: '#4b5563',
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
  },
  descriptionValue: {
    color: '#111827',
    fontWeight: 500,
    wordBreak: 'break-word' as const,
  },
  valueHighlight: {
    textAlign: 'center' as const,
    padding: '8px 0',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '12px',
  },
  valueLarge: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
  },
  statusPaid: {
    color: '#16a34a',
    fontWeight: 500,
  },
  statusOverdue: {
    color: '#dc2626',
    fontWeight: 500,
  },
  statusPending: {
    color: '#d97706',
    fontWeight: 500,
  },
  notes: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  notesLabel: {
    color: '#4b5563',
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
  },
  notesText: {
    color: '#374151',
    fontSize: '14px',
    wordBreak: 'break-word' as const,
    margin: 0,
  },
  statementSection: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
  },
  statementTitle: {
    color: '#374151',
    fontWeight: 500,
    fontSize: '14px',
    marginBottom: '8px',
  },
  statementItem: {
    display: 'table',
    width: '100%',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '4px',
    marginBottom: '8px',
  },
  statementItemDesc: {
    display: 'table-cell',
    width: '70%',
    verticalAlign: 'top' as const,
    paddingRight: '8px',
  },
  statementItemValue: {
    display: 'table-cell',
    width: '30%',
    textAlign: 'right' as const,
    verticalAlign: 'top' as const,
    fontSize: '14px',
  },
  statementCategory: {
    color: '#6b7280',
    fontSize: '12px',
    display: 'block',
  },
  installmentBadge: {
    color: '#6b7280',
    fontSize: '12px',
    marginLeft: '4px',
  },
  statementSummary: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#6b7280',
  },
  signature: {
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid #d1d5db',
    textAlign: 'center' as const,
  },
  signatureLine: {
    borderBottom: '1px solid #9ca3af',
    width: '256px',
    margin: '24px auto 4px auto',
  },
  signatureName: {
    color: '#374151',
    fontSize: '14px',
  },
  footer: {
    marginTop: '24px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#6b7280',
    fontSize: '12px',
  },
};

const getStatusStyle = (status?: string) => {
  if (
    status === 'payed' ||
    status === 'paid' ||
    status === 'received' ||
    status === 'completed' ||
    status === 'transfered'
  ) {
    return styles.statusPaid;
  }
  if (status === 'overdue') {
    return styles.statusOverdue;
  }
  return styles.statusPending;
};

/**
 * Receipt Template Component
 *
 * Visual layout of the financial receipt/voucher.
 * Fixed width of 600px for consistent export sizing.
 * Uses table-based layout for html2canvas compatibility.
 */
export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptTemplateProps>(
  ({ data }, ref) => {
    return (
      <div ref={ref} style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            Comprovante de {data.typeLabel}
          </h1>
        </div>

        {/* Main Content */}
        <div>
          {/* Description */}
          <div style={styles.descriptionBlock}>
            <span style={styles.descriptionLabel}>Descrição:</span>
            <span style={styles.descriptionValue}>{data.description}</span>
          </div>

          {/* Value - Prominent display */}
          <div style={styles.valueHighlight}>
            <span style={styles.valueLarge}>
              {formatReceiptCurrency(data.value)}
            </span>
          </div>

          {/* Date */}
          <div style={styles.row}>
            <span style={styles.labelCell}>Data:</span>
            <span style={styles.valueCell}>{formatReceiptDate(data.date)}</span>
          </div>

          {/* Time (if available) */}
          {data.time && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Horário:</span>
              <span style={styles.valueCell}>{formatReceiptTime(data.time)}</span>
            </div>
          )}

          {/* Category (if available) */}
          {data.category && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Categoria:</span>
              <span style={styles.valueCell}>{autoTranslate(data.category)}</span>
            </div>
          )}

          {/* Status */}
          {data.statusLabel && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Status:</span>
              <span style={{ ...styles.valueCell, ...getStatusStyle(data.status) }}>
                {data.statusLabel}
              </span>
            </div>
          )}

          {/* Account (if available) */}
          {data.accountName && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Conta:</span>
              <span style={styles.valueCell}>{data.accountName}</span>
            </div>
          )}

          {/* Card Name (for credit card types) */}
          {data.cardName && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Cartão:</span>
              <span style={styles.valueCell}>{data.cardName}</span>
            </div>
          )}

          {/* Transfer specific fields */}
          {data.originAccountName && data.destinyAccountName && (
            <>
              <div style={styles.row}>
                <span style={styles.labelCell}>Conta Origem:</span>
                <span style={styles.valueCell}>{data.originAccountName}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.labelCell}>Conta Destino:</span>
                <span style={styles.valueCell}>{data.destinyAccountName}</span>
              </div>
            </>
          )}

          {/* Loan specific fields */}
          {data.benefitedName && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Beneficiado:</span>
              <span style={styles.valueCell}>{data.benefitedName}</span>
            </div>
          )}
          {data.creditorName && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Credor:</span>
              <span style={styles.valueCell}>{data.creditorName}</span>
            </div>
          )}

          {/* Installments (for credit card purchases) */}
          {data.totalInstallments && data.totalInstallments > 1 && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Parcelas:</span>
              <span style={styles.valueCell}>
                {data.installments || 0}/{data.totalInstallments}x de {formatReceiptCurrency(data.installmentValue || 0)}
              </span>
            </div>
          )}

          {/* Vault specific fields */}
          {data.vaultName && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Cofre:</span>
              <span style={styles.valueCell}>{data.vaultName}</span>
            </div>
          )}
          {data.balanceAfter !== undefined && (
            <div style={styles.row}>
              <span style={styles.labelCell}>Saldo Após:</span>
              <span style={styles.valueCell}>
                {formatReceiptCurrency(data.balanceAfter)}
              </span>
            </div>
          )}

          {/* Notes (if available) */}
          {data.notes && (
            <div style={styles.notes}>
              <span style={styles.notesLabel}>Observações:</span>
              <p style={styles.notesText}>{data.notes}</p>
            </div>
          )}

          {/* Extrato de Fatura (apenas para credit_card_bill com items) */}
          {data.type === 'credit_card_bill' &&
            data.statementItems &&
            data.statementItems.length > 0 && (
              <div style={styles.statementSection}>
                <div style={styles.statementTitle}>
                  Extrato ({data.totalItems} {data.totalItems === 1 ? 'item' : 'itens'}):
                </div>
                <div>
                  {data.statementItems.map((item, index) => (
                    <div key={index} style={styles.statementItem}>
                      <div style={styles.statementItemDesc}>
                        <span style={{ color: '#1f2937', fontSize: '14px' }}>
                          {item.description}
                        </span>
                        {item.totalInstallments && item.totalInstallments > 1 && (
                          <span style={styles.installmentBadge}>
                            ({item.installmentNumber}/{item.totalInstallments})
                          </span>
                        )}
                        <span style={styles.statementCategory}>{item.categoryLabel}</span>
                      </div>
                      <div style={{
                        ...styles.statementItemValue,
                        color: item.payed ? '#16a34a' : '#1f2937',
                      }}>
                        {formatReceiptCurrency(item.value)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.statementSummary}>
                  {data.totalPaidItems} de {data.totalItems} itens pagos
                </div>
              </div>
            )}
        </div>

        {/* Signature Section */}
        <div style={styles.signature}>
          <div style={styles.signatureLine}></div>
          <span style={styles.signatureName}>{data.memberName}</span>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            Gerado em: {formatGeneratedAt(data.generatedAt)}
          </span>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = 'ReceiptTemplate';
