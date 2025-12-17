import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { CreditCard, CreditCardFormData , PaginatedResponse } from '@/types';

class CreditCardsService {
  async getAll(): Promise<CreditCard[]> {
    const response = await apiClient.get<PaginatedResponse<CreditCard>>(API_CONFIG.ENDPOINTS.CREDIT_CARDS);
    return response.results;
  }

  async getById(id: number): Promise<CreditCard> {
    return apiClient.get<CreditCard>(`${API_CONFIG.ENDPOINTS.CREDIT_CARDS}${id}/`);
  }

  async create(data: CreditCardFormData): Promise<CreditCard> {
    return apiClient.post<CreditCard>(API_CONFIG.ENDPOINTS.CREDIT_CARDS, data);
  }

  async update(id: number, data: Partial<CreditCardFormData>): Promise<CreditCard> {
    return apiClient.put<CreditCard>(`${API_CONFIG.ENDPOINTS.CREDIT_CARDS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.CREDIT_CARDS}${id}/`);
  }
}

export const creditCardsService = new CreditCardsService();
