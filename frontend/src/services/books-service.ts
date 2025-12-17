import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Book, BookFormData, PaginatedResponse } from '@/types';

class BooksService {
  async getAll(): Promise<Book[]> {
    const response = await apiClient.get<PaginatedResponse<Book>>(API_CONFIG.ENDPOINTS.BOOKS);
    return response.results;
  }

  async getById(id: number): Promise<Book> {
    return apiClient.get<Book>(`${API_CONFIG.ENDPOINTS.BOOKS}${id}/`);
  }

  async create(data: BookFormData): Promise<Book> {
    return apiClient.post<Book>(API_CONFIG.ENDPOINTS.BOOKS, data);
  }

  async update(id: number, data: Partial<BookFormData>): Promise<Book> {
    return apiClient.put<Book>(`${API_CONFIG.ENDPOINTS.BOOKS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.BOOKS}${id}/`);
  }
}

export const booksService = new BooksService();
