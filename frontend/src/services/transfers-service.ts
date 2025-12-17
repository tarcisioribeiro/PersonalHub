import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Transfer, TransferFormData , PaginatedResponse } from '@/types';

class TransfersService {
  async getAll(): Promise<Transfer[]> {
    const response = await apiClient.get<PaginatedResponse<Transfer>>(API_CONFIG.ENDPOINTS.TRANSFERS);
    return response.results;
  }

  async getById(id: number): Promise<Transfer> {
    return apiClient.get<Transfer>(`${API_CONFIG.ENDPOINTS.TRANSFERS}${id}/`);
  }

  async create(data: TransferFormData): Promise<Transfer> {
    return apiClient.post<Transfer>(API_CONFIG.ENDPOINTS.TRANSFERS, data);
  }

  async update(id: number, data: Partial<TransferFormData>): Promise<Transfer> {
    return apiClient.put<Transfer>(`${API_CONFIG.ENDPOINTS.TRANSFERS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.TRANSFERS}${id}/`);
  }
}

export const transfersService = new TransfersService();
