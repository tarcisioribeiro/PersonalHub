import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { StoredBankAccount, StoredBankAccountFormData, StoredBankAccountReveal, PaginatedResponse } from '@/types';

class StoredAccountsService {
  async getAll(): Promise<StoredBankAccount[]> {
    const response = await apiClient.get<PaginatedResponse<StoredBankAccount>>(API_CONFIG.ENDPOINTS.STORED_ACCOUNTS);
    return response.results;
  }

  async getById(id: number): Promise<StoredBankAccount> {
    return apiClient.get<StoredBankAccount>(`${API_CONFIG.ENDPOINTS.STORED_ACCOUNTS}${id}/`);
  }

  async create(data: StoredBankAccountFormData): Promise<StoredBankAccount> {
    return apiClient.post<StoredBankAccount>(API_CONFIG.ENDPOINTS.STORED_ACCOUNTS, data);
  }

  async update(id: number, data: Partial<StoredBankAccountFormData>): Promise<StoredBankAccount> {
    return apiClient.put<StoredBankAccount>(`${API_CONFIG.ENDPOINTS.STORED_ACCOUNTS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.STORED_ACCOUNTS}${id}/`);
  }

  async reveal(id: number): Promise<StoredBankAccountReveal> {
    return apiClient.get<StoredBankAccountReveal>(`${API_CONFIG.ENDPOINTS.STORED_ACCOUNTS}${id}/reveal/`);
  }
}

export const storedAccountsService = new StoredAccountsService();
