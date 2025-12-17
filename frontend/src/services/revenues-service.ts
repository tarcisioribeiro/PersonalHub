import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Revenue, RevenueFormData , PaginatedResponse } from '@/types';

class RevenuesService {
  async getAll(params?: Record<string, any>): Promise<Revenue[]> {
    const response = await apiClient.get<PaginatedResponse<Revenue>>(API_CONFIG.ENDPOINTS.REVENUES, params);
    return response.results;
  }

  async getById(id: number): Promise<Revenue> {
    return apiClient.get<Revenue>(`${API_CONFIG.ENDPOINTS.REVENUES}${id}/`);
  }

  async create(data: RevenueFormData): Promise<Revenue> {
    return apiClient.post<Revenue>(API_CONFIG.ENDPOINTS.REVENUES, data);
  }

  async update(id: number, data: Partial<RevenueFormData>): Promise<Revenue> {
    return apiClient.put<Revenue>(`${API_CONFIG.ENDPOINTS.REVENUES}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.REVENUES}${id}/`);
  }
}

export const revenuesService = new RevenuesService();
