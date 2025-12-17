import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Publisher, PublisherFormData, PaginatedResponse } from '@/types';

class PublishersService {
  async getAll(): Promise<Publisher[]> {
    const response = await apiClient.get<PaginatedResponse<Publisher>>(API_CONFIG.ENDPOINTS.PUBLISHERS);
    return response.results;
  }

  async getById(id: number): Promise<Publisher> {
    return apiClient.get<Publisher>(`${API_CONFIG.ENDPOINTS.PUBLISHERS}${id}/`);
  }

  async create(data: PublisherFormData): Promise<Publisher> {
    return apiClient.post<Publisher>(API_CONFIG.ENDPOINTS.PUBLISHERS, data);
  }

  async update(id: number, data: Partial<PublisherFormData>): Promise<Publisher> {
    return apiClient.put<Publisher>(`${API_CONFIG.ENDPOINTS.PUBLISHERS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.PUBLISHERS}${id}/`);
  }
}

export const publishersService = new PublishersService();
