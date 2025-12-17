import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Reading, ReadingFormData, PaginatedResponse } from '@/types';

class ReadingsService {
  async getAll(): Promise<Reading[]> {
    const response = await apiClient.get<PaginatedResponse<Reading>>(API_CONFIG.ENDPOINTS.READINGS);
    return response.results;
  }

  async getById(id: number): Promise<Reading> {
    return apiClient.get<Reading>(`${API_CONFIG.ENDPOINTS.READINGS}${id}/`);
  }

  async create(data: ReadingFormData): Promise<Reading> {
    return apiClient.post<Reading>(API_CONFIG.ENDPOINTS.READINGS, data);
  }

  async update(id: number, data: Partial<ReadingFormData>): Promise<Reading> {
    return apiClient.put<Reading>(`${API_CONFIG.ENDPOINTS.READINGS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.READINGS}${id}/`);
  }
}

export const readingsService = new ReadingsService();
