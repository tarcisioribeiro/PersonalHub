import { apiClient } from './api-client';
import { API_CONFIG } from '@/config/constants';
import type { AIQueryRequest, AIQueryResponse } from '@/types';

class AIService {
  /**
   * Send a query to the AI Assistant
   */
  async query(data: AIQueryRequest): Promise<AIQueryResponse> {
    return apiClient.post<AIQueryResponse>(API_CONFIG.ENDPOINTS.AI_QUERY, data);
  }
}

export const aiService = new AIService();
