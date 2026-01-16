import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type {
  CreditCardInstallment,
  CreditCardInstallmentUpdateData,
  PaginatedResponse,
} from '@/types';

interface InstallmentFilters {
  purchase__card?: number;
  bill?: number | null;
  purchase__category?: string;
  payed?: boolean;
}

class CreditCardInstallmentsService {
  async getAll(params?: InstallmentFilters): Promise<CreditCardInstallment[]> {
    const response = await apiClient.get<PaginatedResponse<CreditCardInstallment>>(
      API_CONFIG.ENDPOINTS.CREDIT_CARD_INSTALLMENTS,
      params as Record<string, any>
    );
    return response.results;
  }

  async update(
    id: number,
    data: CreditCardInstallmentUpdateData
  ): Promise<CreditCardInstallment> {
    return apiClient.patch<CreditCardInstallment>(
      `${API_CONFIG.ENDPOINTS.CREDIT_CARD_INSTALLMENTS}${id}/`,
      data
    );
  }

  async getByCard(cardId: number): Promise<CreditCardInstallment[]> {
    return this.getAll({ purchase__card: cardId });
  }

  async getByBill(billId: number): Promise<CreditCardInstallment[]> {
    return this.getAll({ bill: billId });
  }

  async getUnassigned(): Promise<CreditCardInstallment[]> {
    return this.getAll({ bill: null });
  }

  async getUnpaid(): Promise<CreditCardInstallment[]> {
    return this.getAll({ payed: false });
  }

  async getPaid(): Promise<CreditCardInstallment[]> {
    return this.getAll({ payed: true });
  }

  async markAsPaid(id: number): Promise<CreditCardInstallment> {
    return this.update(id, { payed: true });
  }

  async assignToBill(id: number, billId: number): Promise<CreditCardInstallment> {
    return this.update(id, { bill: billId });
  }
}

export const creditCardInstallmentsService = new CreditCardInstallmentsService();
