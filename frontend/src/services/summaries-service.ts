import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Summary, SummaryFormData, PaginatedResponse } from '@/types';

class SummariesService {
  async getAll(): Promise<Summary[]> {
    const response = await apiClient.get<PaginatedResponse<Summary>>(API_CONFIG.ENDPOINTS.SUMMARIES);
    return response.results;
  }

  async getById(id: number): Promise<Summary> {
    return apiClient.get<Summary>(`${API_CONFIG.ENDPOINTS.SUMMARIES}${id}/`);
  }

  async create(data: SummaryFormData): Promise<Summary> {
    return apiClient.post<Summary>(API_CONFIG.ENDPOINTS.SUMMARIES, data);
  }

  async update(id: number, data: Partial<SummaryFormData>): Promise<Summary> {
    return apiClient.put<Summary>(`${API_CONFIG.ENDPOINTS.SUMMARIES}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.SUMMARIES}${id}/`);
  }
}

export const summariesService = new SummariesService();
