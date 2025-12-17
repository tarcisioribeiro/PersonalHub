import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { Member, MemberFormData , PaginatedResponse } from '@/types';

class MembersService {
  async getAll(): Promise<Member[]> {
    const response = await apiClient.get<PaginatedResponse<Member>>(API_CONFIG.ENDPOINTS.MEMBERS);
    return response.results;
  }

  async getById(id: number): Promise<Member> {
    return apiClient.get<Member>(`${API_CONFIG.ENDPOINTS.MEMBERS}${id}/`);
  }

  async create(data: MemberFormData): Promise<Member> {
    return apiClient.post<Member>(API_CONFIG.ENDPOINTS.MEMBERS, data);
  }

  async update(id: number, data: Partial<MemberFormData>): Promise<Member> {
    return apiClient.put<Member>(`${API_CONFIG.ENDPOINTS.MEMBERS}${id}/`, data);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.MEMBERS}${id}/`);
  }

  async getCurrentUserMember(): Promise<Member> {
    return apiClient.get<Member>(API_CONFIG.ENDPOINTS.CURRENT_USER_MEMBER);
  }
}

export const membersService = new MembersService();
