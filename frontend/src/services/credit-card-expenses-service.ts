import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { CreditCardExpense, CreditCardExpenseFormData , PaginatedResponse } from '@/types';

class CreditCardExpensesService {
  async getAll(params?: Record<string, any>): Promise<CreditCardExpense[]> {
    const response = await apiClient.get<PaginatedResponse<CreditCardExpense>>(API_CONFIG.ENDPOINTS.CREDIT_CARD_EXPENSES, params);
    return response.results;
  }

  async getById(id: number): Promise<CreditCardExpense> {
    return apiClient.get<CreditCardExpense>(`${API_CONFIG.ENDPOINTS.CREDIT_CARD_EXPENSES}${id}/`);
  }

  async create(data: CreditCardExpenseFormData): Promise<CreditCardExpense> {
    return apiClient.post<CreditCardExpense>(API_CONFIG.ENDPOINTS.CREDIT_CARD_EXPENSES, data);
  }

  async update(id: number, data: Partial<CreditCardExpenseFormData>): Promise<CreditCardExpense> {
    return apiClient.put<CreditCardExpense>(`${API_CONFIG.ENDPOINTS.CREDIT_CARD_EXPENSES}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.CREDIT_CARD_EXPENSES}${id}/`);
  }

  async getByCard(cardId: number): Promise<CreditCardExpense[]> {
    return this.getAll({ card: cardId });
  }

  async getByBill(billId: number): Promise<CreditCardExpense[]> {
    return this.getAll({ bill: billId });
  }

  async getByCategory(category: string): Promise<CreditCardExpense[]> {
    return this.getAll({ category });
  }

  async getUnpaid(): Promise<CreditCardExpense[]> {
    return this.getAll({ payed: false });
  }

  async getPaid(): Promise<CreditCardExpense[]> {
    return this.getAll({ payed: true });
  }
}

export const creditCardExpensesService = new CreditCardExpensesService();
