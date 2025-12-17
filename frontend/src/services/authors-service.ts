import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Author, AuthorFormData, PaginatedResponse } from '@/types';

class AuthorsService {
  async getAll(): Promise<Author[]> {
    const response = await apiClient.get<PaginatedResponse<Author>>(API_CONFIG.ENDPOINTS.AUTHORS);
    return response.results;
  }

  async getById(id: number): Promise<Author> {
    return apiClient.get<Author>(`${API_CONFIG.ENDPOINTS.AUTHORS}${id}/`);
  }

  async create(data: AuthorFormData): Promise<Author> {
    return apiClient.post<Author>(API_CONFIG.ENDPOINTS.AUTHORS, data);
  }

  async update(id: number, data: Partial<AuthorFormData>): Promise<Author> {
    return apiClient.put<Author>(`${API_CONFIG.ENDPOINTS.AUTHORS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.AUTHORS}${id}/`);
  }
}

export const authorsService = new AuthorsService();
