import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Password, PasswordFormData, PasswordReveal, PaginatedResponse } from '@/types';

class PasswordsService {
  async getAll(): Promise<Password[]> {
    const response = await apiClient.get<PaginatedResponse<Password>>(API_CONFIG.ENDPOINTS.PASSWORDS);
    return response.results;
  }

  async getById(id: number): Promise<Password> {
    return apiClient.get<Password>(`${API_CONFIG.ENDPOINTS.PASSWORDS}${id}/`);
  }

  async create(data: PasswordFormData): Promise<Password> {
    return apiClient.post<Password>(API_CONFIG.ENDPOINTS.PASSWORDS, data);
  }

  async update(id: number, data: Partial<PasswordFormData>): Promise<Password> {
    return apiClient.put<Password>(`${API_CONFIG.ENDPOINTS.PASSWORDS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.PASSWORDS}${id}/`);
  }

  async reveal(id: number): Promise<PasswordReveal> {
    return apiClient.get<PasswordReveal>(`${API_CONFIG.ENDPOINTS.PASSWORDS}${id}/reveal/`);
  }
}

export const passwordsService = new PasswordsService();
