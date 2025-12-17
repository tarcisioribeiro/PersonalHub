import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { StoredCreditCard, StoredCreditCardFormData, StoredCreditCardReveal, PaginatedResponse } from '@/types';

class StoredCardsService {
  async getAll(): Promise<StoredCreditCard[]> {
    const response = await apiClient.get<PaginatedResponse<StoredCreditCard>>(API_CONFIG.ENDPOINTS.STORED_CARDS);
    return response.results;
  }

  async getById(id: number): Promise<StoredCreditCard> {
    return apiClient.get<StoredCreditCard>(`${API_CONFIG.ENDPOINTS.STORED_CARDS}${id}/`);
  }

  async create(data: StoredCreditCardFormData): Promise<StoredCreditCard> {
    return apiClient.post<StoredCreditCard>(API_CONFIG.ENDPOINTS.STORED_CARDS, data);
  }

  async update(id: number, data: Partial<StoredCreditCardFormData>): Promise<StoredCreditCard> {
    return apiClient.put<StoredCreditCard>(`${API_CONFIG.ENDPOINTS.STORED_CARDS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.STORED_CARDS}${id}/`);
  }

  async reveal(id: number): Promise<StoredCreditCardReveal> {
    return apiClient.get<StoredCreditCardReveal>(`${API_CONFIG.ENDPOINTS.STORED_CARDS}${id}/reveal/`);
  }
}

export const storedCardsService = new StoredCardsService();
