import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Account, AccountFormData, PaginatedResponse } from '@/types';

class AccountsService {
  async getAll(): Promise<Account[]> {
    const response = await apiClient.get<PaginatedResponse<Account>>(API_CONFIG.ENDPOINTS.ACCOUNTS);
    return response.results;
  }

  async getById(id: number): Promise<Account> {
    return apiClient.get<Account>(`${API_CONFIG.ENDPOINTS.ACCOUNTS}${id}/`);
  }

  async create(data: AccountFormData): Promise<Account> {
    return apiClient.post<Account>(API_CONFIG.ENDPOINTS.ACCOUNTS, data);
  }

  async update(id: number, data: Partial<AccountFormData>): Promise<Account> {
    return apiClient.put<Account>(`${API_CONFIG.ENDPOINTS.ACCOUNTS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ACCOUNTS}${id}/`);
  }
}

export const accountsService = new AccountsService();
